const digest = 'FZZ6xDmT1TzRxtgjP5EkQeUAKr67pQAoCiia8xUbvwhq';

(async () => {
  // Check staking tx via JSON-RPC
  const resp = await fetch('https://fullnode.testnet.sui.io:443', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sui_getTransactionBlock',
      params: [digest, {
        showEffects: true,
        showObjectChanges: true,
        showEvents: true,
      }],
    }),
  });
  const data = await resp.json() as any;

  if (data.error) {
    console.log('ERROR:', JSON.stringify(data.error));
    return;
  }

  const effects = data.result?.effects;
  console.log('Status:', JSON.stringify(effects?.status));

  const created = effects?.created || [];
  console.log(`\nCreated objects: ${created.length}`);
  for (const c of created) {
    console.log(`  ${c.reference?.objectId}`);
  }

  const changes = data.result?.objectChanges || [];
  console.log(`\nObject changes: ${changes.length}`);
  for (const c of changes.slice(0, 10)) {
    console.log(`  ${c.type}: ${c.objectType?.slice(0, 80)} -> ${c.objectId}`);
  }
})();
