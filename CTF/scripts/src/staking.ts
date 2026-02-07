import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);

// Use gRPC for queries
const grpcClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

// Use HTTP client for transaction execution (better simulation handling)
const httpClient = new SuiJsonRpcClient({
	url: 'https://fullnode.testnet.sui.io:443',
});

const PACKAGE_ID = '0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf';
const STAKING_POOL_ID = '0x9576f25dd7b1ce05d23e6a87eba55f5882a0192bcff75d51a29e775a0256d96a';
const CLOCK_ID = '0x6';

const address = keypair.getPublicKey().toSuiAddress();

async function getOwnedReceipts(): Promise<string[]> {
  let allObjects: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await grpcClient.listOwnedObjects({
      owner: address,
      cursor,
    });
    const objects = result.objects || [];
    allObjects = allObjects.concat(objects);
    cursor = result.cursor || undefined;
    if (!result.hasNextPage) break;
  } while (cursor);

  return allObjects
    .filter((o: any) => o.type?.includes('StakeReceipt'))
    .map((o: any) => o.objectId);
}

async function claimFlag() {
  console.log('Fetching owned stake receipts...');
  const receiptIds = await getOwnedReceipts();
  console.log(`Found ${receiptIds.length} receipts`);

  if (receiptIds.length < 168) {
    console.log(`Need at least 168 receipts, only have ${receiptIds.length}`);
    return;
  }

  const useReceipts = receiptIds.slice(0, 169);
  console.log(`Using ${useReceipts.length} receipts for claim`);

  console.log('Building update + merge + claim transaction...');
  const tx = new Transaction();
  tx.setGasBudget(500_000_000);

  // Update all receipts
  const updatedReceipts: any[] = [];
  for (const receiptId of useReceipts) {
    const updated = tx.moveCall({
      target: `${PACKAGE_ID}::staking::update_receipt`,
      arguments: [
        tx.object(receiptId),
        tx.object(CLOCK_ID),
      ],
    });
    updatedReceipts.push(updated);
  }

  // Merge all into one
  let merged = updatedReceipts[0];
  for (let i = 1; i < updatedReceipts.length; i++) {
    merged = tx.moveCall({
      target: `${PACKAGE_ID}::staking::merge_receipts`,
      arguments: [
        merged,
        updatedReceipts[i],
        tx.object(CLOCK_ID),
      ],
    });
  }

  // Claim flag
  const [flag, coin] = tx.moveCall({
    target: `${PACKAGE_ID}::staking::claim_flag`,
    arguments: [
      tx.object(STAKING_POOL_ID),
      merged,
      tx.object(CLOCK_ID),
    ],
  });

  tx.transferObjects([flag], address);
  tx.transferObjects([coin], address);

  console.log('Submitting via HTTP client...');
  const result = await httpClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log('Staking flag captured!');
  console.log('Digest:', result.digest);
  console.log(`View: https://suiscan.xyz/testnet/tx/${result.digest}`);
}

(async () => {
  await claimFlag();
})();
