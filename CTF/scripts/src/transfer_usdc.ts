import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import mainKeyJson from "../keypair.json" with { type: "json" };
import secondKeyJson from "../keypair2.json" with { type: "json" };

const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';
const MAIN_ADDRESS = mainKeyJson.publicAddress;
const SECOND_ADDRESS = secondKeyJson.publicAddress;

const mainKeypair = Ed25519Keypair.fromSecretKey(mainKeyJson.privateKey);
const secondKeypair = Ed25519Keypair.fromSecretKey(secondKeyJson.privateKey);

const suiClient = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
});

(async () => {
  // Step 1: Send more SUI from main wallet to second wallet for gas
  console.log('Step 1: Sending 0.5 SUI for gas to second wallet...');
  const tx1 = new Transaction();
  const [gasCoin] = tx1.splitCoins(tx1.gas, [500_000_000]); // 0.5 SUI
  tx1.transferObjects([gasCoin], SECOND_ADDRESS);

  await suiClient.signAndExecuteTransaction({
    signer: mainKeypair,
    transaction: tx1,
  });
  console.log('Sent 0.5 SUI for gas');

  // Wait for tx to be indexed
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Step 2: Transfer all USDC from second wallet to main wallet
  console.log('Step 2: Transferring USDC from second wallet to main wallet...');
  const coinsResult = await suiClient.listCoins({ owner: SECOND_ADDRESS, coinType: USDC_TYPE });
  const coins = coinsResult.objects || [];
  console.log(`Found ${coins.length} USDC coin(s) in second wallet`);

  if (coins.length === 0) {
    console.log('No USDC in second wallet yet!');
    return;
  }

  const tx2 = new Transaction();
  tx2.setGasBudget(50_000_000); // 0.05 SUI should be more than enough
  for (const coin of coins) {
    tx2.transferObjects([tx2.object(coin.objectId)], MAIN_ADDRESS);
  }

  await suiClient.signAndExecuteTransaction({
    signer: secondKeypair,
    transaction: tx2,
  });
  console.log('USDC transferred to main wallet!');

  // Check new balance
  const balance = await suiClient.getBalance({ owner: MAIN_ADDRESS, coinType: USDC_TYPE });
  const total = balance.balance?.coinBalance || balance.balance?.balance || '0';
  console.log(`Main wallet USDC balance: ${Number(total) / 1_000_000} USDC`);
})();
