import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const PACKAGE_ID = '0x96662054f048469d560c7d5d74b79a44c12f79a8e017e45b1ad85857c6891fdf';
const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';
const COST_PER_FLAG = 5_849_000; // 5.849 USDC (6 decimals)

(async () => {
  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`Address: ${address}`);

  // Check USDC balance using gRPC API
  const balanceResult = await suiClient.getBalance({ owner: address, coinType: USDC_TYPE });
  const totalBalance = balanceResult.balance?.coinBalance || balanceResult.balance?.balance || '0';
  console.log(`USDC Balance: ${totalBalance} (need ${COST_PER_FLAG})`);

  if (BigInt(totalBalance) < BigInt(COST_PER_FLAG)) {
    console.log('Insufficient USDC! Get testnet USDC from https://faucet.circle.com/');
    return;
  }

  // Get USDC coins using listCoins (gRPC API returns { objects })
  const coinsResult = await suiClient.listCoins({ owner: address, coinType: USDC_TYPE });
  const coins = coinsResult.objects || [];
  console.log(`Found ${coins.length} USDC coin(s)`);

  if (coins.length === 0) {
    console.log('No USDC coins found!');
    return;
  }

  const tx = new Transaction();

  // Get first coin and split exact amount
  const firstCoin = coins[0];
  const coinId = firstCoin.objectId;
  const coinBalance = BigInt(firstCoin.balance || '0');

  let paymentCoin;
  if (coinBalance === BigInt(COST_PER_FLAG)) {
    paymentCoin = tx.object(coinId);
  } else {
    // Merge all USDC coins if multiple, then split exact amount
    if (coins.length > 1) {
      const primaryCoin = tx.object(coinId);
      const otherCoins = coins.slice(1).map((c: any) => tx.object(c.objectId));
      tx.mergeCoins(primaryCoin, otherCoins);
      [paymentCoin] = tx.splitCoins(primaryCoin, [COST_PER_FLAG]);
    } else {
      [paymentCoin] = tx.splitCoins(tx.object(coinId), [COST_PER_FLAG]);
    }
  }

  const flag = tx.moveCall({
    target: `${PACKAGE_ID}::merchant::buy_flag`,
    arguments: [paymentCoin],
  });

  tx.transferObjects([flag], address);

  console.log('Buying flag for 5.849 USDC...');
  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log('Merchant flag captured!');
  console.log('Digest:', result.digest);
  console.log(`View: https://suiscan.xyz/testnet/tx/${result.digest}`);
})();
