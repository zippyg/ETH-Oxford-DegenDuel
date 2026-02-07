import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const grpcClient = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });
const httpClient = new SuiJsonRpcClient({ url: 'https://fullnode.testnet.sui.io:443' });

const PACKAGE_ID = '0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf';
const STAKING_POOL_ID = '0x9576f25dd7b1ce05d23e6a87eba55f5882a0192bcff75d51a29e775a0256d96a';
const CLOCK_ID = '0x6';
const address = keypair.getPublicKey().toSuiAddress();

// Receipts were created at 1770410428483 ms = Feb 6 20:40:28 UTC
// Need: current_time >= 1770410428483 + 3600000 = 1770414028483 = Feb 6 21:40:28 UTC
const RECEIPT_CREATION_TS = 1770410428483;
const TARGET_TS = RECEIPT_CREATION_TS + 3_600_000 + 120_000; // +2 min buffer

async function getAllReceipts(): Promise<string[]> {
  let allObjects: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await grpcClient.listOwnedObjects({ owner: address, cursor });
    allObjects = allObjects.concat(result.objects || []);
    cursor = result.cursor || undefined;
    if (!result.hasNextPage) break;
  } while (cursor);

  return allObjects
    .filter((o: any) => o.type?.includes('StakeReceipt'))
    .map((o: any) => o.objectId);
}

(async () => {
  // Wait until enough time has passed
  const now = Date.now();
  const waitMs = TARGET_TS - now;
  if (waitMs > 0) {
    const waitMin = Math.ceil(waitMs / 60000);
    console.log(`Waiting ${waitMin} minutes until receipts are 1+ hours old...`);
    console.log(`Target: ${new Date(TARGET_TS).toISOString()}`);
    await new Promise(r => setTimeout(r, waitMs));
  }

  console.log(`Time reached! Current: ${new Date().toISOString()}`);
  console.log('Fetching receipts...');
  const receiptIds = await getAllReceipts();
  console.log(`Found ${receiptIds.length} receipts`);

  // The test updated one receipt (new timestamp ~21:30), skip it
  // Use all receipts - 168 originals get 1hr each = 168hrs
  // The 1 recently updated gets 0hrs = still 168 total which is >= 168
  const useReceipts = receiptIds.slice(0, 169);
  console.log(`Using ${useReceipts.length} receipts`);

  const tx = new Transaction();
  tx.setGasBudget(500_000_000);

  // Update all receipts (adds elapsed hours)
  const updatedReceipts: any[] = [];
  for (const id of useReceipts) {
    const updated = tx.moveCall({
      target: `${PACKAGE_ID}::staking::update_receipt`,
      arguments: [tx.object(id), tx.object(CLOCK_ID)],
    });
    updatedReceipts.push(updated);
  }

  // Merge all into one
  let merged = updatedReceipts[0];
  for (let i = 1; i < updatedReceipts.length; i++) {
    merged = tx.moveCall({
      target: `${PACKAGE_ID}::staking::merge_receipts`,
      arguments: [merged, updatedReceipts[i], tx.object(CLOCK_ID)],
    });
  }

  // Claim flag
  const [flag, coin] = tx.moveCall({
    target: `${PACKAGE_ID}::staking::claim_flag`,
    arguments: [tx.object(STAKING_POOL_ID), merged, tx.object(CLOCK_ID)],
  });

  tx.transferObjects([flag], address);
  tx.transferObjects([coin], address);

  console.log('Submitting claim transaction...');
  const result = await httpClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showEffects: true },
  });

  const status = result.effects?.status?.status;
  console.log(`TX Status: ${status}`);
  console.log(`Digest: ${result.digest}`);

  if (status === 'success') {
    console.log('STAKING FLAG CAPTURED!');
    console.log(`View: https://suiscan.xyz/testnet/tx/${result.digest}`);
  } else {
    console.log('FAILED!', JSON.stringify(result.effects?.status));
  }
})();
