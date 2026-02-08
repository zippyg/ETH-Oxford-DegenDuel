# DegenDuel: Complete Demo & Testing Walkthrough

## Quick Reference

| Item | Value |
|------|-------|
| **App URL** | `http://localhost:3000` |
| **Landing Page** | `http://localhost:3000/` |
| **App Dashboard** | `http://localhost:3000/arena` |
| **Network** | Flare Coston2 Testnet (Chain ID: 114) |
| **Currency** | C2FLR (testnet, no real value) |
| **Contract** | `0x835574875C1CB9003c1638E799f3d7c504808960` |
| **Deployer Wallet** | `0x332a479FA9E548CFb90e7aF8504534e37E27E764` |
| **Coston2 Faucet** | https://faucet.flare.network/coston2 |
| **Block Explorer** | https://coston2-explorer.flare.network |
| **RPC URL** | `https://coston2-api.flare.network/ext/C/rpc` |

---

## Part 1: Setup (Before the Demo)

### 1.1 Start the App
```bash
cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/nextjs
npx next dev
```
Wait until you see "Ready in Xms". The app is now at http://localhost:3000.

### 1.2 Two-Browser Setup
You need two separate browser sessions with two separate wallets:

- **Browser 1 (Safari)** — Player A (the challenger)
- **Browser 2 (Chrome)** — Player B (the opponent)

Each browser gets its own burner wallet automatically when you connect. Alternatively, you can use MetaMask with two different accounts.

### 1.3 Get Testnet C2FLR
Each wallet needs at least **0.5 C2FLR** (for gas + stakes).

**Option A: Use the deployer wallet (already funded with ~99 C2FLR)**
- Import private key `0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f` into MetaMask
- This is the deployer wallet at `0x332a479FA9E548CFb90e7aF8504534e37E27E764`

**Option B: Use the Coston2 faucet**
1. Go to https://faucet.flare.network/coston2
2. Paste your wallet address
3. Click "Request C2FLR"
4. You'll receive ~100 C2FLR (rate-limited to once per day per address)

**Option C: Use the in-app faucet button** (only works on local Hardhat network, NOT Coston2)

### 1.4 Add Coston2 to MetaMask (if using MetaMask)
1. Open MetaMask → Settings → Networks → Add Network
2. Enter:
   - **Network Name:** Flare Coston2
   - **RPC URL:** `https://coston2-api.flare.network/ext/C/rpc`
   - **Chain ID:** `114`
   - **Currency Symbol:** `C2FLR`
   - **Block Explorer:** `https://coston2-explorer.flare.network`
3. Click Save

---

## Part 2: The Landing Page

### What you see:
1. **Hero Section** — "PREDICT. DUEL. WIN." with dot-grid background
2. **How It Works** — Three cards: CREATE → MATCH → SETTLE
3. **Powered By** — Tech logos: Flare (FTSO v2, FDC, RNG), Effect-TS, FLock AI, ETH Oxford
4. **Footer** — "Developed by Zain Mughal"

### What happens behind the scenes:
- This is a static Next.js page. No blockchain calls are made.
- The header is intentionally hidden on the landing page.
- framer-motion handles all scroll animations (staggered reveals).

### Click: "Launch App"
This navigates to `/arena` via Next.js client-side routing. The header appears, the price ticker loads, and the dashboard renders.

---

## Part 3: The Arena Dashboard

### What you see:
- **Header** — Nav links (Duels, Create, Leaderboard, My Duels, Debug) + wallet connect button
- **Price Ticker** — Scrolling marquee of live prices (FLR, BTC, ETH, XRP, SOL)
- **Stats Bar** — "Live Arena" with total duels, settled duels, volume
- **Active Duel Panel** (left, 60%) — Shows the currently selected duel or "No Active Duel"
- **Create Duel Form** (right, 40%) — Asset selector, UP/DOWN, stake input
- **AI Hint** — FLock-powered prediction hint
- **Open Duels List** — Duels waiting for opponents
- **Active Duels List** — Duels in progress (waiting for settlement)
- **Leaderboard** — Top players by wins and earnings
- **Powered by Flare** — Protocol info cards

### What happens behind the scenes:

**Price Ticker:**
- Calls `DegenDuel.getCurrentPrice(feedId)` for each of the 5 assets
- This is a FREE view call to Flare's FTSO v2 (no gas cost)
- The contract internally calls `TestFtsoV2Interface.getFeedById(feedId)`
- FTSO v2 updates prices every ~1.8 seconds (each Coston2 block)
- The feed IDs are 21-byte hex strings (e.g., BTC/USD = `0x014254432f55534400000000000000000000000000`)

**Stats Bar:**
- Calls `DegenDuel.getProtocolStats()` — returns (totalDuels, settledDuels, totalVolume)
- All on-chain, all free view calls

**AI Hint (FLock):**
- On component mount, sends a POST to `https://api.flock.io/v1/chat/completions`
- Model: `qwen3-30b-a3b-instruct-2507` (decentralized AI on FLock's network)
- System prompt asks for JSON with confidence score (0-100) and rationale
- Response is a REAL AI-generated hint, not hardcoded
- If API key is missing or call fails, shows a fallback message

---

## Part 4: Creating a Duel (Player A)

### Step-by-step clicks:

1. **Connect Wallet** — Click the "Connect Wallet" button (top-right). Choose your wallet (MetaMask or Burner Wallet).

2. **Select Mode** — Click **PRICE** (default) or **DATA**
   - PRICE: Bet on FTSO v2 price feeds (BTC, ETH, FLR, XRP, SOL)
   - DATA: Bet on external API data via FDC Web2Json attestation

3. **Select Asset** — Click one of the pills: **BTC**, **ETH**, **FLR**, **XRP**, **SOL**
   - The current price updates live below the pills

4. **Choose Direction** — Click **UP** or **DOWN**
   - UP = you predict the price will be ABOVE the current price after 90 seconds
   - DOWN = you predict the price will be BELOW

5. **Enter Stake** — Type an amount (minimum 0.01 FLR), e.g., **0.05**

6. **Click CHALLENGE** — This sends a transaction to the blockchain

7. **Approve in MetaMask** — Confirm the transaction (gas is ~0.001 C2FLR)

### What happens behind the scenes:

```
Your browser                    MetaMask                    Coston2 Blockchain
    |                              |                              |
    |-- Click CHALLENGE ---------> |                              |
    |                              |-- Sign tx -----------------> |
    |                              |                              |
    |                              |                    DegenDuel.createPriceDuel(
    |                              |                      feedId,          // which asset
    |                              |                      priceThreshold,  // current price snapshot
    |                              |                      priceDecimals,   // decimal places
    |                              |                      deadline,        // now + 90 seconds
    |                              |                      prediction       // true=UP, false=DOWN
    |                              |                    ) { value: 0.05 FLR }
    |                              |                              |
    |                              |                    Contract stores duel:
    |                              |                      - id: auto-incremented
    |                              |                      - playerA: your address
    |                              |                      - stakeAmount: 0.05 FLR
    |                              |                      - status: OPEN
    |                              |                    Your 0.05 FLR is locked in the contract
    |                              |                              |
    |                              |  <-- tx receipt ------------ |
    | <-- "Duel Created!" -------- |                              |
```

After creation:
- The duel appears in "Open Duels" for all users
- Your stake is locked in the smart contract (not in anyone's wallet)
- The UI shows "Waiting for an opponent..."
- The deadline countdown starts (90 seconds for price duels)

---

## Part 5: Joining a Duel (Player B)

### Step-by-step clicks:

1. **Open Browser 2** (Chrome) → go to `http://localhost:3000/arena`
2. **Connect a DIFFERENT wallet** (different MetaMask account or burner wallet)
3. You'll see the open duel in the **"Open Duels"** section
4. Click the duel card → **"Accept"** / **"BET DOWN"** (or opposite direction)
5. **Approve in MetaMask** — Same stake amount is required

### What happens behind the scenes:

```
Player B's browser              MetaMask                    Coston2 Blockchain
    |                              |                              |
    |-- Click Accept ------------> |                              |
    |                              |-- Sign tx -----------------> |
    |                              |                              |
    |                              |                    DegenDuel.joinDuel(duelId)
    |                              |                    { value: 0.05 FLR }
    |                              |                              |
    |                              |                    Contract:
    |                              |                      - Sets playerB = your address
    |                              |                      - Locks your 0.05 FLR
    |                              |                      - Status: OPEN → ACTIVE
    |                              |                      - Total pot = 0.10 FLR
    |                              |                              |
    |                              |  <-- tx receipt ------------ |
    | <-- "Duel Joined!" --------- |                              |
```

Now both players can see the duel in "Active Duels" with a live countdown.

---

## Part 6: Settlement

### When can you settle?
- After the 90-second deadline passes
- The duel card will show **"Ready to settle"**
- ANYONE can trigger settlement (Player A, Player B, or any third party)

### Step-by-step clicks:

1. Wait for the countdown to hit 0
2. Click on the active duel
3. Click **"SETTLE"**
4. Approve the transaction

### What happens behind the scenes:

```
Any user                        MetaMask                    Coston2 Blockchain
    |                              |                              |
    |-- Click SETTLE ------------> |                              |
    |                              |-- Sign tx -----------------> |
    |                              |                              |
    |                              |                    DegenDuel.settlePriceDuel(duelId)
    |                              |                              |
    |                              |                    1. Read FTSO v2 price:
    |                              |                       TestFtsoV2Interface.getFeedById(feedId)
    |                              |                       → Returns (currentPrice, decimals, timestamp)
    |                              |                       (This is a FREE view call — no oracle fee!)
    |                              |                              |
    |                              |                    2. Compare:
    |                              |                       currentPrice >= threshold?
    |                              |                       → conditionMet = true/false
    |                              |                              |
    |                              |                    3. Determine winner:
    |                              |                       If conditionMet == playerA's prediction
    |                              |                         → Player A wins
    |                              |                       Else
    |                              |                         → Player B wins
    |                              |                              |
    |                              |                    4. RNG Bonus Check (10% chance):
    |                              |                       RandomNumberV2Interface.getRandomNumber()
    |                              |                       → Returns (randomNumber, isSecure, timestamp)
    |                              |                       If isSecure AND randomNumber % 100 < 10:
    |                              |                         → BONUS! Winner gets full pot (no fee)
    |                              |                         → Emit BonusTriggered event
    |                              |                         → 2x confetti animation
    |                              |                              |
    |                              |                    5. Calculate payout:
    |                              |                       Normal: pot (0.10 FLR) - 1% fee = 0.099 FLR
    |                              |                       Bonus:  pot (0.10 FLR) - 0% fee = 0.10 FLR
    |                              |                              |
    |                              |                    6. Transfer winnings to winner
    |                              |                    7. Update leaderboard stats
    |                              |                    8. Status: ACTIVE → SETTLED
    |                              |                    9. Emit DuelSettled event
    |                              |                              |
    |                              |  <-- tx receipt ------------ |
    | <-- Confetti! 🎉 ----------- |                              |
```

---

## Part 7: Quick Solo Test (One Wallet, Hardhat Script)

If you want to test the full flow with a single command:

```bash
cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/hardhat
npx hardhat run scripts/e2e-price-duel.ts --network coston2
```

This script:
1. Uses the deployer as Player A
2. Creates a random Player B wallet
3. Funds Player B with 0.3 C2FLR from Player A
4. Creates a price duel (FLR/USD, 0.1 FLR stake, UP prediction)
5. Player B joins the duel (opposite side)
6. Waits 90 seconds for deadline
7. Settles the duel via FTSO v2
8. Prints the winner and payout

Expected output:
```
[1/6] Funding Player B...
  ✓ Player B funded: 0.3 C2FLR
[2/6] Reading current FLR/USD price via FTSO v2...
  ✓ FLR/USD = $0.0096
[3/6] Creating price duel...
  ✓ Duel #X created
[4/6] Player B joining duel...
  ✓ Player B joined
[5/6] Waiting 95 seconds for deadline...
  ⏳ ...
[6/6] Settling duel via FTSO v2...
  ✓ Duel settled!
  Winner: Player A (or B)
  Payout: 0.198 C2FLR
```

---

## Part 8: Checking Results

### On-Chain Explorer
- View duel transactions: https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960
- View your wallet: https://coston2-explorer.flare.network/address/YOUR_ADDRESS

### In the App
- **Leaderboard** (`/leaderboard`): Shows top players by wins and earnings
- **My Duels** (`/my-duels`): Shows your duel history with results
- **Duel Detail** (`/duel/[id]`): Shows full details of a specific duel

---

## Part 9: The Complete Tech Stack (What's Actually Happening)

### Flare Protocol #1: FTSO v2 (Price Feeds)
- **What:** Decentralized price oracle with 100+ validators
- **Where:** Every price display, every price duel settlement
- **How:** Free view calls to `TestFtsoV2Interface.getFeedById()`
- **Speed:** Updates every ~1.8s block time
- **Cost:** FREE to read on Coston2

### Flare Protocol #2: FDC Web2Json (Data Attestation)
- **What:** Turns any Web2 API into a verified on-chain oracle
- **Where:** DATA mode duels (bet on external API data)
- **How:** 5-step pipeline:
  1. App sends API spec to FDC verifier
  2. 100+ validators independently fetch the API
  3. Consensus produces a Merkle root
  4. Proof is retrieved from the DA Layer
  5. Smart contract verifies the proof on-chain
- **Speed:** 3-8 minutes for attestation
- **Cost:** ~0.01 C2FLR for attestation request

### Flare Protocol #3: Secure RNG (Randomness)
- **What:** Verifiable on-chain random number
- **Where:** Settlement — 10% chance of 2x bonus (no protocol fee)
- **How:** `RandomNumberV2Interface.getRandomNumber()` returns a provably random value
- **Speed:** Available every block
- **Cost:** FREE view call

### FLock AI (Decentralized AI)
- **What:** AI-powered prediction hints
- **Where:** "AI HINT" card on the arena dashboard
- **How:** Direct API call to `https://api.flock.io/v1/chat/completions`
- **Model:** qwen3-30b running on FLock's decentralized network
- **Why FLock not OpenAI:** FLock is a bounty track sponsor at ETH Oxford. Using decentralized AI aligns with the crypto-native thesis. Qualifies for the FLock bounty prize.

### Effect-TS (Backend Services)
- **What:** 12 natural effect types in production for type-safe backend
- **Where:** FDC pipeline, service layer, error handling
- **Why:** Demonstrates advanced functional programming patterns

---

## Part 10: Troubleshooting

### "Insufficient funds for gas * price + value"
- Your wallet doesn't have enough C2FLR
- Get more from the faucet: https://faucet.flare.network/coston2
- Or import the deployer wallet (has ~99 C2FLR)

### "Transaction cancelled" / "User denied"
- You clicked "Reject" in MetaMask. Try again and click "Confirm".

### Price shows "---"
- The contract might not be connected. Make sure you're on Coston2 network.
- Check the browser console for RPC errors.

### Duel not appearing in Open Duels
- Wait a few seconds for the next block (~1.8s)
- The `watch: true` flag on the contract read should auto-refresh

### AI Hint shows "configure API key"
- The `.env.local` file needs `NEXT_PUBLIC_FLOCK_API_KEY=sk-artpyU8obEVnMpU4p_wgqg`
- Restart the dev server after adding it

---

## Wallet Addresses Reference

| Wallet | Address | Has C2FLR? |
|--------|---------|------------|
| Deployer (hardhat) | `0x332a479FA9E548CFb90e7aF8504534e37E27E764` | ~99 C2FLR |
| Contract | `0x835574875C1CB9003c1638E799f3d7c504808960` | Variable (holds active stakes) |
| Browser Burner | Auto-generated per session | Need to fund via faucet |

**Deployer Private Key (TESTNET ONLY):** `0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f`
