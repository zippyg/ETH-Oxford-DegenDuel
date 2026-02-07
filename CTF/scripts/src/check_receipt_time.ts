import { SuiGrpcClient } from '@mysten/sui/grpc';
import keyPairJson from "../keypair.json" with { type: "json" };

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const receiptId = '0x0238de92860f0b99aed885939dda496ab78db1983e41274e63e9f3464a9b16bc';

(async () => {
  // Get object with content
  const detail = await suiClient.getObject({
    objectId: receiptId,
    options: { showContent: true, showBcs: true },
  });
  console.log('Full object:', JSON.stringify(detail, (k,v) => typeof v === 'bigint' ? v.toString() : v, 2));

  // Try multiGetObjects
  try {
    const multi = await (suiClient as any).multiGetObjects({
      objectIds: [receiptId],
      options: { showContent: true },
    });
    console.log('\nmultiGetObjects:', JSON.stringify(multi, (k,v) => typeof v === 'bigint' ? v.toString() : v, 2).slice(0, 500));
  } catch(e: any) {
    console.log('multiGetObjects error:', e.message?.slice(0, 200));
  }
})();
