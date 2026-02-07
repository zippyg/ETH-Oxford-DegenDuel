import { NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseAbi,
  decodeEventLog,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";

// Flare Coston2 contract addresses
const FDCHUB_ADDRESS = "0x48aC463d7975828989331F4De43341627b9c5f1D" as const;
const FDC_REQUEST_FEE_CONFIGURATIONS = "0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e" as const;
const DA_LAYER_URL = "https://ctn2-data-availability.flare.network";

// ABIs (minimal)
const FDCHUB_ABI = parseAbi([
  "function requestAttestation(bytes calldata data) external payable returns (bool)",
  "event AttestationRequest(uint256 indexed roundId, bytes32 indexed requestHash, bytes data)",
]);

const FEE_CONFIG_ABI = parseAbi([
  "function getFee(bytes32 attestationType) external view returns (uint256)",
]);

// Helper: Calculate voting round from timestamp
function calculateVotingRound(timestamp: number): number {
  const FIRST_VOTING_ROUND_START_TS = 1658430000;
  const VOTING_EPOCH_DURATION_SECONDS = 90;
  return Math.floor((timestamp - FIRST_VOTING_ROUND_START_TS) / VOTING_EPOCH_DURATION_SECONDS);
}

// Helper: Convert string to bytes32
function toBytes32(str: string): Hex {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return `0x${hex.padEnd(64, "0")}` as Hex;
}

function getClients() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in environment variables");
  }

  const account = privateKeyToAccount(privateKey as Hex);
  const publicClient = createPublicClient({
    transport: http(RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    transport: http(RPC_URL),
  });

  return { publicClient, walletClient, account };
}

// Action: Submit attestation request to FdcHub
async function submitAttestation(abiEncodedRequest: string) {
  try {
    const { publicClient, walletClient } = getClients();

    // Get fee amount
    const attestationType = toBytes32("Web2Json");
    const fee = await publicClient.readContract({
      address: FDC_REQUEST_FEE_CONFIGURATIONS,
      abi: FEE_CONFIG_ABI,
      functionName: "getFee",
      args: [attestationType],
    });

    // Submit to FdcHub
    const txHash = await walletClient.writeContract({
      address: FDCHUB_ADDRESS,
      abi: FDCHUB_ABI,
      functionName: "requestAttestation",
      args: [abiEncodedRequest as Hex],
      value: fee,
      chain: null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    // Extract roundId from AttestationRequest event
    let roundId: number | undefined;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: FDCHUB_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "AttestationRequest") {
          // Get block timestamp for round calculation
          const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });
          roundId = calculateVotingRound(Number(block.timestamp));
          break;
        }
      } catch {
        // Not our event, skip
      }
    }

    if (roundId === undefined) {
      throw new Error("AttestationRequest event not found in transaction receipt");
    }

    return NextResponse.json({
      success: true,
      roundId,
      requestBytes: abiEncodedRequest,
      txHash: receipt.transactionHash,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit attestation";
    console.error("Submit attestation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Action: Poll DA layer for proof
async function pollForProof(roundId: number, requestBytes: string) {
  try {
    const response = await fetch(`${DA_LAYER_URL}/api/v1/fdc/proof-by-request-round-raw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundId, requestBytes }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404 || errorText.includes("not found")) {
        return NextResponse.json({ ready: false, message: "Proof not ready yet" });
      }
      throw new Error(`DA layer error: ${errorText}`);
    }

    const proof = await response.json();

    if (!proof || !proof.data) {
      return NextResponse.json({ ready: false, message: "Proof not ready yet" });
    }

    return NextResponse.json({ ready: true, proof });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to poll for proof";
    console.error("Poll for proof error:", error);
    if (message.includes("not found") || message.includes("not ready")) {
      return NextResponse.json({ ready: false, message: "Proof not ready yet" });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Action: Settle data duel with proof
async function settleDuel(duelId: number, proof: unknown) {
  try {
    const { publicClient, walletClient } = getClients();

    // Import the deployed contract info
    const deployedContracts = await import("~~/contracts/deployedContracts");
    const contractInfo = deployedContracts.default[114].DegenDuel;

    const txHash = await walletClient.writeContract({
      address: contractInfo.address,
      abi: contractInfo.abi,
      functionName: "settleDataDuel",
      args: [BigInt(duelId), proof as never],
      chain: null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    return NextResponse.json({
      success: true,
      txHash: receipt.transactionHash,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to settle duel";
    console.error("Settle duel error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "submit": {
        const { abiEncodedRequest } = body;
        if (!abiEncodedRequest) {
          return NextResponse.json({ error: "Missing abiEncodedRequest" }, { status: 400 });
        }
        return await submitAttestation(abiEncodedRequest);
      }

      case "poll": {
        const { roundId, requestBytes } = body;
        if (roundId === undefined || !requestBytes) {
          return NextResponse.json({ error: "Missing roundId or requestBytes" }, { status: 400 });
        }
        return await pollForProof(roundId, requestBytes);
      }

      case "settle": {
        const { duelId, proof } = body;
        if (duelId === undefined || !proof) {
          return NextResponse.json({ error: "Missing duelId or proof" }, { status: 400 });
        }
        return await settleDuel(duelId, proof);
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Must be 'submit', 'poll', or 'settle'" },
          { status: 400 },
        );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("API route error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
