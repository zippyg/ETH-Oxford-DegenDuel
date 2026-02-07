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

const PACKAGE_ID = `0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39`;
const VAULT_ID = `0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33`;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

/**
 * Scavenger Hunt: Exercise 3
 */
const main = async () => {
  const suiAddress = keypair.getPublicKey().toSuiAddress();

  // Task 1: Create a new Transaction
  const { Transaction } = await import("@mysten/sui/transactions");
  const tx = new Transaction();

  // Task 2: Create a new key
  const key = tx.moveCall({
    target: `${PACKAGE_ID}::key::new`,
  });

  // Task 3: Set the key code to 745223 (from vault object fields on-chain)
  tx.moveCall({
    target: `${PACKAGE_ID}::key::set_code`,
    arguments: [
      key,
      tx.pure.u64(745223),
    ],
  });

  // Task 4: Withdraw SUI from the vault using the key
  const coin = tx.moveCall({
    target: `${PACKAGE_ID}::vault::withdraw`,
    typeArguments: ["0x2::sui::SUI"],
    arguments: [
      tx.object(VAULT_ID),
      key,
    ],
  });

  // Task 5: Transfer the SUI coin to our account
  tx.transferObjects([coin], suiAddress);

  // Task 6: Sign and execute
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log("Scavenger hunt completed! SUI withdrawn from vault!");
  console.log("Digest:", result.digest);
  console.log(`View on explorer: https://suiscan.xyz/testnet/tx/${result.digest}`);
};

main();
