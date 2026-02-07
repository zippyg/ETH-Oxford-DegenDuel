import { SuiGrpcClient } from '@mysten/sui/grpc';
import keyPairJson from "../keypair.json" with { type: "json" };

const suiClient = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });
const address = keyPairJson.publicAddress;

(async () => {
  let allObjects: any[] = [];
  let cursor: string | undefined;
  do {
    const result = await suiClient.listOwnedObjects({ owner: address, cursor });
    allObjects = allObjects.concat(result.objects || []);
    cursor = result.cursor || undefined;
    if (!result.hasNextPage) break;
  } while (cursor);

  const nfts = allObjects.filter((o: any) => o.type?.includes('sui_nft'));
  console.log(`SuiNFT objects: ${nfts.length}`);
  for (const n of nfts) {
    console.log(`  ${n.objectId}`);
    console.log(`  https://suiscan.xyz/testnet/object/${n.objectId}`);
  }

  if (nfts.length === 0) {
    console.log('\nNo SUIII NFT found in this wallet.');
    console.log('The workshop may have used a different keypair.');
    console.log(`\nChecking workshop keypair...`);
  }
})();
