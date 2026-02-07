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
const CLOCK_ID = '0x6';

function getTimeInfo() {
  const nowSec = Math.floor(Date.now() / 1000);
  const timeInHour = nowSec % 3600;
  const mins = Math.floor(timeInHour / 60);
  const secs = timeInHour % 60;
  return { timeInHour, mins, secs };
}

function isWindowOpen(timeInHour: number): boolean {
  return (timeInHour >= 0 && timeInHour < 300) || (timeInHour >= 1800 && timeInHour < 2100);
}

function getWaitTime(timeInHour: number): number {
  if (timeInHour < 300) return 0;
  if (timeInHour < 1800) return (1800 - timeInHour) * 1000;
  if (timeInHour < 2100) return 0;
  return (3600 - timeInHour) * 1000;
}

(async () => {
  const address = keypair.getPublicKey().toSuiAddress();
  console.log(`Address: ${address}`);

  const { timeInHour, mins, secs } = getTimeInfo();
  console.log(`Current time in hour: ${mins}m ${secs}s (${timeInHour}s)`);

  if (!isWindowOpen(timeInHour)) {
    const waitMs = getWaitTime(timeInHour);
    const waitMins = Math.ceil(waitMs / 60000);
    console.log(`Window closed. Next window opens in ${waitMins} minutes.`);
    console.log('Re-run this script when the window is open!');

    // If less than 5 minutes to wait, wait automatically
    if (waitMs <= 5 * 60 * 1000) {
      console.log(`Short wait - auto-waiting ${waitMins} minutes...`);
      await new Promise(resolve => setTimeout(resolve, waitMs + 5000));
    } else {
      return;
    }
  }

  console.log('Window is OPEN! Extracting flag...');

  const tx = new Transaction();
  const flag = tx.moveCall({
    target: `${PACKAGE_ID}::moving_window::extract_flag`,
    arguments: [tx.object(CLOCK_ID)],
  });
  tx.transferObjects([flag], address);

  const result = await suiClient.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  });

  console.log('Moving Window flag captured!');
  console.log('Digest:', result.digest);
  console.log(`View: https://suiscan.xyz/testnet/tx/${result.digest}`);
})();
