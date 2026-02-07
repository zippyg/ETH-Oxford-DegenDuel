/**
 * FDC Web2Json Attestation Pipeline
 * Complete 5-step pipeline for settling data duels on DegenDuel
 *
 * Usage:
 *   npx hardhat run scripts/fdc-pipeline.ts --network coston2 [duelId]
 *
 * Steps:
 *   1. Prepare attestation request via FDC verifier
 *   2. Submit to FdcHub on-chain (pays fee)
 *   3. Calculate voting round ID
 *   4. Wait for finalization and retrieve proof from DA layer
 *   5. (Optional) Call settleDataDuel with the proof
 *
 * Environment Variables:
 *   FDC_API_URL (optional) - default: Blockchain.info BTC ticker
 *   FDC_API_JQ (optional) - default: { value: (.USD.last | tostring) }
 */

import hre from "hardhat";
import fs from "fs";
import path from "path";

// ============ Configuration ============

const DEGENDUEL_ADDRESS = "0x835574875C1CB9003c1638E799f3d7c504808960";
const FDC_HUB_ADDRESS = "0x48aC463d7975828989331F4De43341627b9c5f1D";
const FEE_CONFIG_ADDRESS = "0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e";
const VERIFIER_URL = "https://fdc-verifiers-testnet.flare.network";
const DA_LAYER_URL = "https://ctn2-data-availability.flare.network";
const FDC_API_KEY = "00000000-0000-0000-0000-000000000000";

// Voting round calculation constants
const FIRST_VOTING_ROUND_START = 1658430000;
const VOTING_EPOCH_DURATION = 90; // seconds

// Default API: Blockchain.info BTC ticker (confirmed working)
// Note: We return a uint256 to match the contract's expected abi.decode format
const DEFAULT_API_URL = "https://blockchain.info/ticker";
const DEFAULT_API_JQ = '{ value: .USD.last }';
const DEFAULT_ABI_SIGNATURE = {
  components: [{ internalType: "uint256", name: "value", type: "uint256" }],
  name: "task",
  type: "tuple",
};

// Minimal ABIs
const FDC_HUB_ABI = ["function requestAttestation(bytes calldata) external payable"];
const FEE_CONFIG_ABI = ["function getRequestFee(bytes calldata) external view returns (uint256)"];

// ============ Helper Functions ============

/**
 * Convert string to 0x-prefixed 32-byte hex (bytes32)
 */
function toHex(s: string): string {
  let h = "";
  for (let i = 0; i < s.length; i++) {
    h += s.charCodeAt(i).toString(16);
  }
  return "0x" + h.padEnd(64, "0");
}

/**
 * Calculate voting round ID from timestamp
 */
function calculateVotingRoundId(timestamp: number): number {
  return Math.floor((timestamp - FIRST_VOTING_ROUND_START) / VOTING_EPOCH_DURATION);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ Main Pipeline Steps ============

/**
 * Step 1: Prepare attestation request via FDC verifier
 */
async function prepareAttestationRequest(
  apiUrl: string,
  jqFilter: string,
  abiSignature: any
): Promise<string> {
  console.log("\n=== Step 1: Prepare Attestation Request ===");
  console.log(`API URL: ${apiUrl}`);
  console.log(`JQ Filter: ${jqFilter}`);
  console.log();

  const attestationType = toHex("Web2Json");
  const sourceId = toHex("PublicWeb2");

  const requestBody = {
    url: apiUrl,
    httpMethod: "GET",
    headers: "{}",
    queryParams: "{}",
    body: "{}",
    postProcessJq: jqFilter,
    abiSignature: JSON.stringify(abiSignature),
  };

  const payload = {
    attestationType,
    sourceId,
    requestBody,
  };

  console.log("Calling FDC verifier prepareRequest endpoint...");
  const response = await fetch(`${VERIFIER_URL}/verifier/web2/Web2Json/prepareRequest`, {
    method: "POST",
    headers: {
      "X-API-KEY": FDC_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Verifier error (${response.status}): ${errorText}`);
  }

  const result = await response.json();

  if (result.status !== "VALID") {
    throw new Error(`Invalid attestation request: ${JSON.stringify(result)}`);
  }

  const abiEncodedRequest = result.abiEncodedRequest;
  console.log(`✓ Attestation request prepared`);
  console.log(`ABI-encoded request: ${abiEncodedRequest.substring(0, 66)}...`);
  console.log();

  return abiEncodedRequest;
}

/**
 * Step 2: Submit attestation request to FdcHub on-chain
 */
async function submitAttestationRequest(
  abiEncodedRequest: string,
  signer: any
): Promise<{ receipt: any; timestamp: number }> {
  console.log("\n=== Step 2: Submit to FdcHub On-Chain ===");

  // Get the required fee
  console.log("Getting attestation fee...");
  const feeConfig = new hre.ethers.Contract(FEE_CONFIG_ADDRESS, FEE_CONFIG_ABI, signer);
  const fee = await feeConfig.getRequestFee(abiEncodedRequest);
  console.log(`Fee required: ${hre.ethers.formatEther(fee)} C2FLR`);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  if (balance < fee) {
    throw new Error(
      `Insufficient balance. Need ${hre.ethers.formatEther(fee)} C2FLR, have ${hre.ethers.formatEther(balance)} C2FLR`
    );
  }

  // Submit the request
  console.log("Submitting attestation request to FdcHub...");
  const fdcHub = new hre.ethers.Contract(FDC_HUB_ADDRESS, FDC_HUB_ABI, signer);
  const tx = await fdcHub.requestAttestation(abiEncodedRequest, { value: fee });

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log(`✓ Confirmed in block ${receipt!.blockNumber}`);

  // Get block timestamp
  const block = await hre.ethers.provider.getBlock(receipt!.blockNumber);
  const timestamp = Number(block!.timestamp);

  console.log(`Block timestamp: ${timestamp} (${new Date(timestamp * 1000).toISOString()})`);
  console.log();

  return { receipt, timestamp };
}

/**
 * Step 3: Calculate voting round ID
 */
function calculateRoundId(timestamp: number): number {
  console.log("\n=== Step 3: Calculate Voting Round ID ===");

  const roundId = calculateVotingRoundId(timestamp);
  console.log(`Voting round ID: ${roundId}`);
  console.log(
    `Round window: ${VOTING_EPOCH_DURATION}s (total wait: 3-8 minutes for finalization)`
  );
  console.log();

  return roundId;
}

/**
 * Step 4: Wait for finalization and retrieve proof
 */
async function waitAndRetrieveProof(abiEncodedRequest: string, roundId: number): Promise<any> {
  console.log("\n=== Step 4: Wait for Finalization and Retrieve Proof ===");
  console.log("Polling DA layer for proof...");
  console.log("(This typically takes 3-8 minutes)");
  console.log();

  const startTime = Date.now();
  const maxWaitTime = 10 * 60 * 1000; // 10 minutes
  const pollInterval = 30 * 1000; // 30 seconds
  let attempts = 0;

  while (Date.now() - startTime < maxWaitTime) {
    attempts++;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Attempt ${attempts} (${elapsed}s elapsed)...`);

    try {
      const response = await fetch(`${DA_LAYER_URL}/api/v1/fdc/proof-by-request-round-raw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": FDC_API_KEY,
        },
        body: JSON.stringify({
          votingRoundId: roundId,
          requestBytes: abiEncodedRequest,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.proof) {
          console.log(`✓ Proof retrieved after ${elapsed}s`);
          console.log();
          return data;
        }
      }
    } catch (error: any) {
      console.log(`  Error: ${error.message}`);
    }

    // Wait before next attempt
    if (Date.now() - startTime < maxWaitTime) {
      console.log(`  Waiting ${pollInterval / 1000}s before next attempt...`);
      await sleep(pollInterval);
    }
  }

  throw new Error("Timeout waiting for proof (10 minutes). Round may not have finalized.");
}

/**
 * Step 5: Call settleDataDuel with the proof
 */
async function settleDataDuel(duelId: string, proof: any, signer: any): Promise<void> {
  console.log("\n=== Step 5: Settle Data Duel ===");
  console.log(`Duel ID: ${duelId}`);
  console.log();

  const degenDuel = await hre.ethers.getContractAt("DegenDuel", DEGENDUEL_ADDRESS, signer);

  // Format the proof for the contract
  // The proof structure from DA layer matches IWeb2Json.Proof
  const formattedProof = {
    merkleProof: proof.proof,
    data: {
      attestationType: proof.data.attestationType,
      sourceId: proof.data.sourceId,
      votingRound: proof.data.votingRound,
      lowestUsedTimestamp: proof.data.lowestUsedTimestamp,
      requestBody: {
        url: proof.data.requestBody.url,
        httpMethod: proof.data.requestBody.httpMethod,
        headers: proof.data.requestBody.headers,
        queryParams: proof.data.requestBody.queryParams,
        body: proof.data.requestBody.body,
        postProcessJq: proof.data.requestBody.postProcessJq,
        abiSignature: proof.data.requestBody.abiSignature,
      },
      responseBody: {
        abiEncodedData: proof.data.responseBody.abiEncodedData,
      },
    },
  };

  console.log("Calling settleDataDuel...");
  const tx = await degenDuel.settleDataDuel(duelId, formattedProof);

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log(`✓ Duel settled in block ${receipt!.blockNumber}`);
  console.log();

  // Parse the DuelSettled event
  const eventInterface = degenDuel.interface;
  const duelSettledEvent = receipt!.logs
    .map(log => {
      try {
        return eventInterface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });
      } catch {
        return null;
      }
    })
    .find(event => event?.name === "DuelSettled");

  if (duelSettledEvent) {
    const { winner, payout, settledValue, bonusApplied } = duelSettledEvent.args;
    console.log("===========================================");
    console.log("DUEL SETTLED SUCCESSFULLY!");
    console.log("===========================================");
    console.log(`Winner: ${winner}`);
    console.log(`Payout: ${hre.ethers.formatEther(payout)} C2FLR`);
    console.log(`Settled Value: ${settledValue}`);
    console.log(`Bonus Applied: ${bonusApplied ? "YES (2x payout!)" : "NO"}`);
    console.log("===========================================");
  }
}

/**
 * Save proof to JSON file for later use
 */
function saveProof(proof: any, roundId: number): void {
  const outputDir = path.join(__dirname, "..", "fdc-proofs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = path.join(outputDir, `proof-round-${roundId}-${Date.now()}.json`);
  fs.writeFileSync(filename, JSON.stringify(proof, null, 2));

  console.log(`Proof saved to: ${filename}`);
  console.log();
}

// ============ Main Execution ============

async function main() {
  console.log("\n========================================");
  console.log("   FDC Web2Json Attestation Pipeline");
  console.log("========================================");

  // Parse arguments
  const args = process.argv.slice(2);
  const duelId = args.find(arg => !arg.startsWith("--"));

  console.log(`Network: ${hre.network.name}`);
  console.log(`Duel ID: ${duelId || "N/A (proof-only mode)"}`);
  console.log();

  // Get configuration
  const apiUrl = process.env.FDC_API_URL || DEFAULT_API_URL;
  const jqFilter = process.env.FDC_API_JQ || DEFAULT_API_JQ;
  const abiSignature = DEFAULT_ABI_SIGNATURE;

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`Using account: ${signer.address}`);

  // Run the 5-step pipeline
  try {
    // Step 1: Prepare request
    const abiEncodedRequest = await prepareAttestationRequest(apiUrl, jqFilter, abiSignature);

    // Step 2: Submit on-chain
    const { timestamp } = await submitAttestationRequest(abiEncodedRequest, signer);

    // Step 3: Calculate round ID
    const roundId = calculateRoundId(timestamp);

    // Step 4: Wait for proof
    const proof = await waitAndRetrieveProof(abiEncodedRequest, roundId);

    // Save proof
    saveProof(proof, roundId);

    // Decode and display the attested value
    console.log("=== Attested Data ===");
    try {
      // For our default case, the data is a tuple with a uint256 "value" field
      const decoded = hre.ethers.AbiCoder.defaultAbiCoder().decode(
        ["tuple(uint256 value)"],
        proof.data.responseBody.abiEncodedData
      );
      console.log(`Attested value: ${decoded[0].value.toString()}`);
      console.log();
    } catch (e) {
      console.log("(Could not decode - raw data saved in proof file)");
      console.log();
    }

    // Step 5: Settle duel if ID provided
    if (duelId) {
      await settleDataDuel(duelId, proof, signer);
    } else {
      console.log("No duel ID provided. Proof retrieved and saved successfully.");
      console.log("To settle a duel later, run:");
      console.log(`  npx hardhat run scripts/fdc-pipeline.ts --network coston2 -- <duelId>`);
    }

    console.log("\n✓ Pipeline completed successfully!");
  } catch (error: any) {
    console.error("\n❌ Pipeline failed:");
    console.error(error.message);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
