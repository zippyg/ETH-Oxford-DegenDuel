# FDC Scripts Quick Start Guide

## Prerequisites

1. Get C2FLR testnet tokens: https://faucet.flare.network/coston2
2. Ensure `.env` has `__RUNTIME_DEPLOYER_PRIVATE_KEY` set

## Quick Commands

### 1. Validate Setup
```bash
cd packages/hardhat
yarn hardhat run scripts/check-setup.ts --network coston2
```

### 2. Test FDC Verifier (No Gas)
```bash
yarn hardhat run scripts/test-fdc-verifier.ts
```

### 3. Create a Data Duel
```bash
# Default: BTC > $60,000 in 10 min, stake 0.1 C2FLR
yarn hardhat run scripts/create-data-duel.ts --network coston2

# Custom: BTC > $65,000 in 5 min, stake 0.5 C2FLR
DUEL_THRESHOLD=65000 DUEL_MINUTES=5 DUEL_STAKE=0.5 \
  yarn hardhat run scripts/create-data-duel.ts --network coston2
```

### 4. Settle the Duel (After Deadline)
```bash
# Replace "0" with your duel ID
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- 0
```

### 5. Just Get Attestation Proof (No Settlement)
```bash
yarn hardhat run scripts/fdc-pipeline.ts --network coston2
```

## Full Workflow Example

```bash
# 1. Check everything is set up
yarn hardhat run scripts/check-setup.ts --network coston2

# 2. Create a duel (save the duel ID from output)
DUEL_MINUTES=5 yarn hardhat run scripts/create-data-duel.ts --network coston2

# Output: "Duel ID: 0"

# 3. Wait 5 minutes for deadline to pass

# 4. Settle the duel
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- 0

# 5. Check results (winner, payout, bonus)
```

## Environment Variables

### create-data-duel.ts
- `DUEL_THRESHOLD` - Price threshold (default: 60000 USD)
- `DUEL_STAKE` - Stake amount (default: 0.1 C2FLR)
- `DUEL_MINUTES` - Duration (default: 10 minutes)
- `DUEL_PREDICTION` - "true" for ABOVE, "false" for BELOW (default: true)

### fdc-pipeline.ts
- `FDC_API_URL` - API endpoint (default: Blockchain.info BTC)
- `FDC_API_JQ` - JQ filter (default: `{ value: .USD.last }`)

### test-fdc-verifier.ts
- `TEST_API_URL` - Custom API to test
- `TEST_API_JQ` - Custom JQ filter to test

## Expected Timeline

- Create duel: ~5 seconds (1 transaction)
- Duel deadline: Your choice (5-10 min recommended for testing)
- FDC attestation: 3-8 minutes
- Settlement: ~5 seconds (1 transaction)
- **Total: ~10-20 minutes for full cycle**

## Troubleshooting

### "Insufficient balance"
Get more C2FLR: https://faucet.flare.network/coston2

### "Timeout waiting for proof"
- Check if API is whitelisted on testnet
- Verify JQ filter produces deterministic output
- Check Systems Explorer: https://coston2-systems-explorer.flare.rocks/finalizations

### "Duel not active"
Someone needs to join the duel first (via frontend or another wallet)

### "Too early to settle"
Wait until after the duel deadline has passed

## File Outputs

- Proofs saved to: `packages/hardhat/fdc-proofs/`
- Format: `proof-round-{roundId}-{timestamp}.json`

## Getting Help

See full documentation:
- `scripts/README.md` - Detailed usage guide
- `FDC_SCRIPTS_SUMMARY.md` - Technical implementation details

## Important Addresses

- **DegenDuel Contract:** `0x835574875C1CB9003c1638E799f3d7c504808960`
- **FdcHub:** `0x48aC463d7975828989331F4De43341627b9c5f1D`
- **FeeConfig:** `0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e`
- **Network:** Coston2 (Chain ID: 114)
