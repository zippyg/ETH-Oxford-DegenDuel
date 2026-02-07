import { SuiGrpcClient } from '@mysten/sui/grpc';
import keyPairJson from "../keypair.json" with { type: "json" };

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const PACKAGE_ID = '0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf';
const RECEIPT_TYPE = `${PACKAGE_ID}::staking::StakeReceipt`;
const address = keyPairJson.publicAddress;

(async () => {
  console.log(`Checking receipts for ${address}...`);

  // Paginate through all receipts
  let allObjects: any[] = [];
  let cursor: string | null = null;
  let page = 0;
  do {
    const result = await suiClient.listOwnedObjects({
      owner: address,
      filter: { StructType: RECEIPT_TYPE },
      cursor: cursor || undefined,
    });
    const objects = result.objects || [];
    allObjects = allObjects.concat(objects);
    cursor = result.cursor;
    page++;
    console.log(`Page ${page}: ${objects.length} objects (total so far: ${allObjects.length})`);
  } while (cursor);

  console.log(`\nTotal receipts: ${allObjects.length}`);
  if (allObjects.length > 0) {
    console.log('First object keys:', Object.keys(allObjects[0]));
    console.log('First objectId:', allObjects[0].objectId || allObjects[0].data?.objectId);
    console.log('Sample:', JSON.stringify(allObjects[0], (k,v) => typeof v === 'bigint' ? v.toString() : v).slice(0, 300));
  }
})();
