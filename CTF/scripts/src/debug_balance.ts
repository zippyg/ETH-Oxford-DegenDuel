import { SuiGrpcClient } from '@mysten/sui/grpc';

const c = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });

(async () => {
  const coinsResult = await c.listCoins({ owner: '0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783', coinType: '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC' });
  console.log('listCoins keys:', Object.keys(coinsResult));
  console.log('listCoins full:', JSON.stringify(coinsResult, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
})();
