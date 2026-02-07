import { SuiGrpcClient } from '@mysten/sui/grpc';

const c = new SuiGrpcClient({ network: 'testnet', baseUrl: 'https://fullnode.testnet.sui.io:443' });
const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';
const addr = '0xb5fd3b667b914bc8c39d42aff4c744f80ad561b826c5262d7e797d7fd8c76783';

(async () => {
  const bal = await c.getBalance({ owner: addr, coinType: USDC_TYPE });
  console.log('Balance result:', JSON.stringify(bal, (k,v) => typeof v === 'bigint' ? v.toString() : v, 2));
  const coins = await c.listCoins({ owner: addr, coinType: USDC_TYPE });
  console.log('Coins:', JSON.stringify(coins, (k,v) => typeof v === 'bigint' ? v.toString() : v, 2));
})();
