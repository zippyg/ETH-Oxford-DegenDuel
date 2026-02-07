import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { writeFileSync } from 'fs';

const kp = new Ed25519Keypair();
const config = { publicAddress: kp.getPublicKey().toSuiAddress(), privateKey: kp.getSecretKey() };
writeFileSync('keypair2.json', JSON.stringify(config, null, 2));
console.log('NEW ADDRESS FOR USDC:', config.publicAddress);
console.log('Have your friend request USDC to THIS address on Circle faucet');
