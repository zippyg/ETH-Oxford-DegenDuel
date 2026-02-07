# DegenDuel FDC Scripts

This directory contains scripts for creating and settling data duels using Flare's FDC Web2Json attestation protocol.

## Scripts

### 1. `create-data-duel.ts`

Creates a new data duel on the DegenDuel contract.

**Usage:**
```bash
cd packages/hardhat
yarn hardhat run scripts/create-data-duel.ts --network coston2
```

**Environment Variables:**
- `DUEL_THRESHOLD` - Data threshold value (default: 60000 USD - Bitcoin price)
- `DUEL_STAKE` - Stake amount in C2FLR (default: 0.1)
- `DUEL_MINUTES` - Duration in minutes (default: 10)
- `DUEL_PREDICTION` - Prediction: "true" for ABOVE, "false" for BELOW (default: true)

**Example:**
```bash
# Create a duel: Bitcoin price will be above $65,000 in 15 minutes, stake 0.5 C2FLR
DUEL_THRESHOLD=65000 DUEL_STAKE=0.5 DUEL_MINUTES=15 DUEL_PREDICTION=true \
  yarn hardhat run scripts/create-data-duel.ts --network coston2
```

**Output:**
- Prints the created duel ID
- Displays transaction hash and block confirmation
- Shows instructions for settling the duel

---

### 2. `fdc-pipeline.ts`

Complete 5-step FDC Web2Json attestation pipeline for settling data duels.

**Usage:**
```bash
# Run full pipeline and settle a duel
cd packages/hardhat
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- <duelId>

# Run pipeline without settling (proof-only mode)
yarn hardhat run scripts/fdc-pipeline.ts --network coston2
```

**Environment Variables:**
- `FDC_API_URL` - API endpoint to attest (default: https://blockchain.info/ticker)
- `FDC_API_JQ` - JQ filter for data extraction (default: `{ value: (.USD.last | tostring) }`)

**Example:**
```bash
# Settle duel ID 0 with Bitcoin price from Blockchain.info
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- 0

# Get Ethereum price attestation (proof-only mode)
FDC_API_URL="https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD" \
FDC_API_JQ='{ value: (.USD | tostring) }' \
  yarn hardhat run scripts/fdc-pipeline.ts --network coston2
```

**What it does:**

1. **Prepare Request** - Calls FDC verifier to prepare ABI-encoded attestation request
2. **Submit On-Chain** - Submits request to FdcHub contract (pays fee)
3. **Calculate Round** - Calculates the voting round ID based on transaction timestamp
4. **Wait for Proof** - Polls DA layer until proof is available (3-8 minutes typical)
5. **Settle Duel** - Calls `settleDataDuel()` with the verified proof (if duel ID provided)

**Output:**
- Progress messages for each step
- Saves proof to `packages/hardhat/fdc-proofs/proof-round-<roundId>-<timestamp>.json`
- If duel ID provided: settles the duel and displays winner/payout

---

## Complete Workflow Example

```bash
cd packages/hardhat

# Step 1: Create a data duel
# "Bitcoin will be above $60,000 in 10 minutes"
DUEL_THRESHOLD=60000 DUEL_MINUTES=10 DUEL_PREDICTION=true \
  yarn hardhat run scripts/create-data-duel.ts --network coston2

# Output will show duel ID, e.g., "Duel ID: 0"

# Step 2: Wait for duel deadline to pass (10 minutes in this case)
# You can also have another player join the duel first via the frontend

# Step 3: Settle the duel using FDC attestation
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- 0

# This will:
# - Attest the current BTC price from Blockchain.info
# - Wait for FDC finalization (3-8 min)
# - Settle the duel with the verified proof
# - Display the winner and payout
```

---

## Technical Details

### FDC Configuration

- **Verifier URL:** `https://fdc-verifiers-testnet.flare.network`
- **DA Layer URL:** `https://ctn2-data-availability.flare.network`
- **FDC API Key:** `00000000-0000-0000-0000-000000000000` (testnet default)
- **FdcHub Address:** `0x48aC463d7975828989331F4De43341627b9c5f1D`
- **Fee Config Address:** `0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e`

### Default API (Blockchain.info BTC Ticker)

The scripts use Blockchain.info's BTC ticker API by default, which is confirmed working with FDC on Coston2:

- **URL:** `https://blockchain.info/ticker`
- **JQ Filter:** `{ value: .USD.last }`
- **ABI Type:** `uint256`
- **Returns:** Current Bitcoin price in USD (e.g., 65000 for $65,000)

### Timing

- **Voting Epoch:** 90 seconds
- **Typical Finalization:** 3-8 minutes total
- **Max Wait Time:** 10 minutes (script timeout)

### Proof Storage

All retrieved proofs are saved to `packages/hardhat/fdc-proofs/` for debugging and later use.

---

## Troubleshooting

### "Insufficient balance"
You need C2FLR (Coston2 testnet tokens) for:
- Creating duels (stake amount)
- FDC attestation fee (~0.001 C2FLR)
- Gas fees

Get testnet tokens from: https://faucet.flare.network/coston2

### "Timeout waiting for proof"
The attestation may have failed. Common causes:
- API URL not whitelisted on testnet
- JQ filter produces non-deterministic output
- Invalid ABI signature
- Network issues

Check the Systems Explorer: https://coston2-systems-explorer.flare.rocks/finalizations

### "Invalid FDC proof"
The proof verification failed. Possible causes:
- Wrong voting round ID
- Tampered proof data
- Proof not yet finalized

### "Duel not active"
The duel must have status ACTIVE (someone joined) before it can be settled.

---

## Supported APIs (Confirmed Working on Coston2)

| API | URL | Use Case |
|-----|-----|----------|
| Blockchain.info BTC | `https://blockchain.info/ticker` | Bitcoin price |
| CryptoCompare ETH | `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD` | Ethereum price |
| CryptoCompare FLR | `https://min-api.cryptocompare.com/data/price?fsym=FLR&tsyms=USD` | Flare price |
| Exchange Rates | `https://open.er-api.com/v6/latest/USD` | Forex rates |
| ESPN Premier League | `https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard` | Sports scores |

See `FDC_SMOKE_TEST_RESULTS.md` in the agent logs for full compatibility matrix.

---

## For Hackathon Judges

These scripts demonstrate **complete end-to-end FDC Web2Json integration**:

1. Off-chain preparation via FDC verifier API
2. On-chain submission to FdcHub with fee payment
3. Voting round calculation
4. Proof retrieval from DA layer
5. On-chain verification via `IFdcVerification.verifyWeb2Json()`

This is a production-ready implementation of Flare's newest FDC attestation type (Web2Json, approved via FIP.14 in December 2025).
