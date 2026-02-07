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

(async () => {
  // Get all receipts
  let allObjects: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await grpcClient.listOwnedObjects({ owner: address, cursor });
    allObjects = allObjects.concat(result.objects || []);
    cursor = result.cursor || undefined;
    if (!result.hasNextPage) break;
  } while (cursor);

  const receipts = allObjects.filter((o: any) => o.type?.includes('StakeReceipt'));
  console.log(`Found ${receipts.length} receipts`);

  // Test 1: Update just ONE receipt and transfer it back, check result
  console.log('\n--- Test: Update 1 receipt and transfer back ---');
  const testReceipt = receipts[0];
  console.log(`Receipt: ${testReceipt.objectId}`);

  const tx1 = new Transaction();
  const updated = tx1.moveCall({
    target: `${PACKAGE_ID}::staking::update_receipt`,
    arguments: [
      tx1.object(testReceipt.objectId),
      tx1.object(CLOCK_ID),
    ],
  });
  tx1.transferObjects([updated], address);

  try {
    const result = await httpClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx1,
      options: { showEffects: true, showObjectChanges: true },
    });
    console.log('TX status:', result.effects?.status?.status);
    console.log('Digest:', result.digest);

    // Check the created object
    const created = result.effects?.created || [];
    console.log(`Created ${created.length} objects`);
    if (created.length > 0) {
      const newId = created[0].reference?.objectId;
      console.log(`New receipt ID: ${newId}`);

      // Fetch its content
      await new Promise(r => setTimeout(r, 2000));
      const resp = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'sui_getObject',
          params: [newId, { showContent: true }],
        }),
      });
      const data = await resp.json() as any;
      const fields = data?.result?.data?.content?.fields;
      console.log('Updated receipt fields:', JSON.stringify(fields, null, 2));
      console.log(`hours_staked: ${fields?.hours_staked}`);
      console.log(`amount: ${fields?.amount}`);
    }
  } catch(e: any) {
    console.log('Error:', e.message?.slice(0, 500));
  }
})();
