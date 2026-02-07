import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import keyPairJson from "../keypair.json" with { type: "json" };

/**
 *
 * Global variables
 *
 * These variables are used throughout the exercise below.
 *
 */
const PACKAGE_ID = `0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a`;
const COUNTER_OBJECT_ID = `0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6`;

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

/**
 * Objects as input: Exercise 1
 */
const main = async () => {
  // Task 1: Create a new Transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  // Task 2: Split a coin for the fee (min_fee = 10 MIST)
  const [feeCoin] = tx.splitCoins(tx.gas, [10]);

  // Task 3: Call counter::increment with the counter object and fee
  tx.moveCall({
    target: `${PACKAGE_ID}::counter::increment`,
    arguments: [
      tx.object(COUNTER_OBJECT_ID),
      feeCoin,
    ],
  });

  // Task 4: Sign and execute
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log("Counter incremented successfully!");
  console.log("Digest:", result.digest);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${result.digest}`);
};

main();
