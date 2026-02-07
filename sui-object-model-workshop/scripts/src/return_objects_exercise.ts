import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import keyPairJson from "../keypair.json" with { type: "json" };
import { SuiGrpcClient } from "@mysten/sui/grpc";

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0`;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

/**
 * Returning Objects: Exercise 1
 */
const main = async () => {
  // Task 1: Create a new Transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  // Task 2: Call sui_nft::new to mint a new NFT
  const nft = tx.moveCall({
    target: `${PACKAGE_ID}::sui_nft::new`,
  });

  // Task 3: Transfer the NFT to our address
  tx.transferObjects([nft], suiAddress);

  // Task 4: Sign and execute
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log("Transaction successful!");
  console.log("Digest:", result.digest);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${result.digest}`);
};

main();
