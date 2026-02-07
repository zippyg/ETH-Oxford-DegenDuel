import { SuiGrpcClient } from '@mysten/sui/grpc';
import keyPairJson from "../keypair.json" with { type: "json" };

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const PACKAGE_ID = '0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf';
const address = keyPairJson.publicAddress;

(async () => {
  console.log(`Wallet: ${address}`);
  console.log(`Suiscan: https://suiscan.xyz/testnet/account/${address}/portfolio\n`);

  // Get all owned objects
  let allObjects: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await suiClient.listOwnedObjects({ owner: address, cursor });
    allObjects = allObjects.concat(result.objects || []);
    cursor = result.cursor || undefined;
    if (!result.hasNextPage) break;
  } while (cursor);

  // Find flags
  const flags = allObjects.filter((o: any) => o.type?.includes('flag::Flag'));
  console.log(`=== FLAG OBJECTS: ${flags.length} ===\n`);

  for (const flag of flags) {
    console.log(`Flag Object ID: ${flag.objectId}`);
    console.log(`  Type: ${flag.type}`);
    console.log(`  Suiscan: https://suiscan.xyz/testnet/object/${flag.objectId}`);
    console.log();
  }

  // Also check via JSON-RPC for content (challenge names)
  for (const flag of flags) {
    try {
      const resp = await fetch('https://fullnode.testnet.sui.io:443', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sui_getObject',
          params: [flag.objectId, { showContent: true }],
        }),
      });
      const data = await resp.json() as any;
      const fields = data?.result?.data?.content?.fields;
      if (fields) {
        console.log(`Challenge: "${fields.challenge_name}"`);
        console.log(`  Captured by: ${fields.captured_by}`);
        console.log(`  Object: ${flag.objectId}`);
        console.log();
      }
    } catch (e: any) {
      console.log(`  Error fetching details: ${e.message}`);
    }
  }

  // Summary
  const expectedChallenges = ['merchant', 'moving_window', 'lootboxes', 'staking'];
  console.log('=== SUMMARY ===');
  console.log(`Total flags found: ${flags.length}/4`);
  console.log(`Expected challenges: ${expectedChallenges.join(', ')}`);
})();
