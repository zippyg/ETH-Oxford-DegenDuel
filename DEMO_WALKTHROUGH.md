# DegenDuel: Definitive Demo Walkthrough

Everything you need to demo DegenDuel from scratch. One path. Every click.

---

## Step 1: Install MetaMask

MetaMask is a browser extension that acts as a crypto wallet. It lets you sign transactions, hold tokens, and interact with decentralized apps (dApps) directly from your browser. Without it, you cannot connect to the blockchain.

1. Open Google Chrome
2. Go to https://metamask.io/download/
3. Click **"Install MetaMask for Chrome"**
4. Click **"Add to Chrome"** in the Chrome Web Store popup
5. Click **"Add Extension"** to confirm
6. MetaMask opens automatically. Click **"Create a new wallet"**
7. Agree to the terms
8. Set a password (this is local to your browser only). Click **"Create a new wallet"**
9. MetaMask shows you a 12-word Secret Recovery Phrase. **Write it down on paper** (you will not need this for the demo, but MetaMask requires you to back it up)
10. Confirm the recovery phrase by clicking the words in order
11. Click **"Got it"**
12. MetaMask is now installed. You will see a fox icon in the top-right of Chrome (in the extensions toolbar)

You now have one wallet account in MetaMask called "Account 1". This is a brand-new empty wallet. We will NOT use this account. Instead, we will import the pre-funded deployer wallet.

---

## Step 2: Add the Coston2 Network to MetaMask

MetaMask defaults to Ethereum mainnet. DegenDuel runs on Flare's Coston2 testnet (a separate blockchain used for testing). You need to tell MetaMask about this network.

1. Click the **MetaMask fox icon** in Chrome's toolbar to open MetaMask
2. Click the **network dropdown** at the top-left (it says "Ethereum Mainnet")
3. Click **"Add a custom network"** at the bottom of the dropdown (if you see "Add Network" instead, click that, then "Add a network manually")
4. Fill in these fields exactly:

| Field | Value |
|-------|-------|
| Network name | `Coston2` |
| New RPC URL | `https://coston2-api.flare.network/ext/C/rpc` |
| Chain ID | `114` |
| Currency symbol | `C2FLR` |
| Block explorer URL | `https://coston2-explorer.flare.network` |

5. Click **"Save"**
6. MetaMask switches to the Coston2 network. The top of MetaMask now says "Coston2" and your balance shows `0 C2FLR`

---

## Step 3: Import the Deployer Wallet (Player A)

The smart contract was deployed from a wallet that already has ~99 C2FLR (testnet tokens with no real value). This is the wallet you will use as Player A.

1. Click the **MetaMask fox icon** to open MetaMask
2. Click the **account icon** (colored circle) at the top-right of the MetaMask popup
3. Click **"Add account or hardware wallet"**
4. Click **"Import account"**
5. Make sure "Private Key" is selected in the dropdown
6. Paste this private key:

```
0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f
```

7. Click **"Import"**
8. MetaMask creates a new account (likely called "Account 2"). The address displayed should be:

```
0x332a479FA9E548CFb90e7aF8504534e37E27E764
```

9. Your balance should show approximately **99 C2FLR** (the exact amount depends on prior usage)

This is your **Player A** wallet. It is pre-funded and ready to use. Rename it now for clarity:

10. Click the **three dots** next to the account name
11. Click **"Account details"**
12. Click the **pencil icon** next to the name
13. Type **"Player A"** and press Enter

---

## Step 4: Create Player B's Wallet

You need a second wallet for the opponent. MetaMask lets you have multiple accounts in the same extension.

1. Click the **MetaMask fox icon** to open MetaMask
2. Click the **account icon** (colored circle) at the top-right
3. Click **"Add account or hardware wallet"**
4. Click **"Create a new account"**
5. Name it **"Player B"**
6. Click **"Create"**
7. MetaMask switches to the new "Player B" account. Copy this address (click the address to copy it). The balance is `0 C2FLR`.

You now need to fund Player B.

---

## Step 5: Fund Player B from the Faucet

A faucet is a website that gives out free testnet tokens. The Coston2 faucet gives 100 C2FLR per wallet per 24 hours.

1. Go to https://faucet.flare.network/coston2
2. Paste **Player B's address** (the one you copied in Step 4) into the input field
3. Complete the CAPTCHA if prompted
4. Click **"Request C2FLR"**
5. Wait 5-10 seconds. The page will confirm the transfer
6. Go back to MetaMask and check Player B's balance. It should now show **100 C2FLR**

If the faucet is down or rate-limited, you can send C2FLR from Player A to Player B directly:
1. Switch to the "Player A" account in MetaMask
2. Click **"Send"**
3. Paste Player B's address
4. Enter **5** as the amount
5. Click **"Next"** then **"Confirm"**
6. Wait ~3 seconds for the transaction to confirm
7. Switch to "Player B" in MetaMask. Balance should show **5 C2FLR**

---

## Step 6: Deploy to Vercel

Vercel is a hosting platform that deploys your Next.js frontend to a public URL. This gives you a real URL like `degenduel.vercel.app` instead of `localhost:3000`.

### 6a. Install the Vercel CLI (one-time)

Open your terminal:

```bash
cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/nextjs
```

If you have never logged into Vercel before:

```bash
yarn vercel:login
```

This opens a browser window. Sign in with GitHub (or email). Once authenticated, the terminal says "Congratulations! You are now logged in."

### 6b. Deploy

```bash
yarn vercel
```

Vercel asks a series of questions. Answer them exactly like this:

```
? Set up and deploy "~/Documents/ETH_Oxford_Hack/degenduel/packages/nextjs"? [Y/n]
→ Y

? Which scope do you want to deploy to?
→ (Select your Vercel account — there is only one option)

? Link to existing project? [y/N]
→ N

? What's your project's name?
→ degenduel

? In which directory is your code located?
→ ./ (just press Enter, it defaults to the current directory)

? Want to modify these settings? [y/N]
→ N
```

Vercel builds and deploys the app. This takes 1-3 minutes. When it finishes, it prints a URL like:

```
✅ Production: https://degenduel.vercel.app
```

Copy this URL. This is your live demo URL.

### 6c. Set Environment Variables

The AI Hint feature needs an API key. Set it on Vercel:

1. Go to https://vercel.com/dashboard
2. Click on the **"degenduel"** project
3. Click **"Settings"** (top navigation)
4. Click **"Environment Variables"** (left sidebar)
5. Add this variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_FLOCK_API_KEY` | `sk-artpyU8obEVnMpU4p_wgqg` | Production, Preview, Development |

6. Click **"Save"**

### 6d. Redeploy with the Environment Variable

The environment variable only takes effect on the next deployment. Redeploy:

```bash
yarn vercel --prod
```

Wait for it to finish. Your live app now has the AI Hint feature working.

---

## Step 7: Open the App

1. Open Chrome
2. Go to your Vercel URL (e.g., `https://degenduel.vercel.app`)
3. You see the **landing page**: a full-screen hero section with "PREDICT. DUEL. WIN."
4. Scroll down to see "How It Works" (three steps) and "Powered By" (tech logos)
5. There is no header on the landing page — this is intentional

---

## Step 8: Connect Player A's Wallet

1. Click the **"Launch App"** button on the landing page
2. The browser navigates to `/arena`. The header appears with nav links. The price ticker scrolls across the top showing live prices (FLR, BTC, ETH, XRP, SOL)
3. Click **"Connect Wallet"** in the top-right corner of the header
4. A wallet selector popup appears. Click **"MetaMask"**
5. MetaMask opens. Make sure the **"Player A"** account is selected (the one with ~99 C2FLR)
6. Click **"Next"** then **"Connect"**
7. MetaMask may ask you to switch networks. If it says "This site wants you to switch to Coston2", click **"Switch network"**
8. The top-right of the app now shows your wallet address and C2FLR balance

You are now connected as Player A.

---

## Step 9: Create a Duel (Player A)

1. On the Arena dashboard, look at the right side panel — this is the **Create Duel** form
2. The mode is already set to **PRICE** (this uses Flare's FTSO v2 oracle)
3. Click an asset. Choose **FLR** (Flare's native token — its price changes most frequently on testnet)
4. The current live price appears below the asset buttons (e.g., "$0.0096")
5. Click **UP** — you are predicting the price will be higher than the current price in 90 seconds
6. In the stake input, type **0.1** (this means 0.1 C2FLR)
7. Click **"CHALLENGE"**
8. MetaMask pops up showing the transaction:
   - **To:** `0x8355...0960` (the DegenDuel contract)
   - **Amount:** `0.1 C2FLR`
   - **Estimated gas:** ~0.001 C2FLR
9. Click **"Confirm"** in MetaMask
10. Wait 2-3 seconds. A green notification appears: **"Duel created!"**
11. The duel appears in the **"Open Duels"** section below the form

What just happened on-chain:
- Your browser called `DegenDuel.createPriceDuel()` on the smart contract
- The contract recorded your prediction, the current price snapshot, and the 90-second deadline
- Your 0.1 C2FLR stake is now locked inside the smart contract (not in anyone's wallet)
- The duel status is "OPEN" — waiting for an opponent

---

## Step 10: Switch to Player B and Join the Duel

1. Click the **MetaMask fox icon** in Chrome
2. Click the **account icon** (colored circle) at the top-right
3. Click **"Player B"** to switch accounts
4. The app automatically detects the account change. The wallet address in the header updates to Player B's address
5. The Open Duels section shows the duel you just created. It shows:
   - The asset (FLR/USD)
   - The stake (0.1 FLR)
   - Player A's prediction direction (UP)
   - A "BET DOWN" button (Player B automatically takes the opposite side)
6. Click **"BET DOWN"** (or whichever accept button appears)
7. MetaMask pops up. The amount is **0.1 C2FLR** (matching Player A's stake)
8. Click **"Confirm"** in MetaMask
9. Wait 2-3 seconds. A green notification appears: **"Duel joined!"**
10. The duel moves from "Open Duels" to **"Active Duels"** with a countdown timer (90 seconds)

What just happened on-chain:
- Player B called `DegenDuel.joinDuel(duelId)` with 0.1 C2FLR
- The contract locked Player B's stake alongside Player A's
- The total pot is now 0.2 C2FLR, held by the contract
- The duel status changed from OPEN to ACTIVE
- The 90-second countdown is now live

---

## Step 11: Wait for the Deadline

1. Watch the countdown timer on the active duel card. It counts down from ~90 seconds
2. You cannot settle the duel until the deadline passes
3. While waiting, observe:
   - The **Price Ticker** keeps updating (prices come from FTSO v2, Flare's decentralized oracle)
   - The **AI Hint** card shows a confidence score from FLock's decentralized AI (this is a real AI inference, not hardcoded)
4. When the countdown reaches 0, the duel card shows **"Ready to settle"**

---

## Step 12: Settle the Duel

1. Click on the active duel to open its detail page (`/duel/[id]`)
2. The **"SETTLE DUEL"** button appears (it only shows after the deadline has passed)
3. Click **"SETTLE DUEL"**
4. MetaMask pops up. This transaction costs a small gas fee (~0.001 C2FLR). Click **"Confirm"**
5. Wait 2-3 seconds. The page updates:
   - The status changes to **"SETTLED"**
   - The winner is displayed with their address
   - The payout amount is shown (approximately 0.198 C2FLR — the full pot minus a 1% protocol fee)
   - If you won, confetti explodes on the screen and it says **"YOU WON!"**
   - If you lost, it says **"YOU LOST"**

What just happened on-chain:
1. The contract called `TestFtsoV2Interface.getFeedById(feedId)` — this reads the current FLR/USD price from Flare's FTSO v2 oracle (a FREE view call, no gas for the oracle itself)
2. The contract compared the current price to the threshold (the price snapshot from when the duel was created)
3. If the price went UP and Player A predicted UP, Player A wins. If it went DOWN, Player B wins
4. The contract called `RandomNumberV2Interface.getRandomNumber()` — Flare's on-chain random number generator. If the random number triggers the 10% bonus, the winner gets the full pot with zero protocol fee
5. The contract transferred the winnings to the winner's wallet
6. The contract updated the leaderboard stats (wins count, total earnings)

---

## Step 13: Verify the Results

### In the App

1. Click **"My Duels"** in the header navigation
2. You see your duel history with results (win/loss, payout amount)
3. Click **"Leaderboard"** in the header
4. You see the rankings — players sorted by total wins and earnings

### On the Block Explorer

1. Go to https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960
2. This shows the DegenDuel contract and all its transactions
3. You can see every `createPriceDuel`, `joinDuel`, and `settlePriceDuel` call
4. Click on any transaction hash to see the full details: gas used, input data, events emitted

---

## Step 14: Run the Automated E2E Test (Optional)

If you want to prove the entire flow works end-to-end with a single command (useful for judges who want to see it run without manual wallet switching):

```bash
cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/hardhat
npx hardhat run scripts/e2e-price-duel.ts --network coston2
```

This script does everything automatically:
1. Uses the deployer wallet as Player A
2. Creates a random temporary wallet for Player B
3. Sends 0.3 C2FLR from Player A to Player B
4. Reads the current FLR/USD price from FTSO v2
5. Creates a price duel (0.1 C2FLR stake, UP prediction)
6. Player B joins the duel (takes the opposite side)
7. Waits 90 seconds for the deadline to pass
8. Settles the duel by reading the FTSO v2 price again
9. Prints the winner and payout

The entire flow takes about 2 minutes (mostly waiting for the 90-second deadline). The output looks like this:

```
╔══════════════════════════════════════════════╗
║  DegenDuel E2E Test: Full Price Duel Flow    ║
╚══════════════════════════════════════════════╝

[1/6] Funding Player B...
  ✓ Player B funded: 0.3 C2FLR

[2/6] Reading current FLR/USD price via FTSO v2...
  ✓ FLR/USD = $0.009602

[3/6] Creating price duel...
  ✓ Duel #1 created

[4/6] Player B joining duel...
  ✓ Player B joined
  ✓ Duel is now ACTIVE. Total pot: 0.2 C2FLR

[5/6] Waiting for deadline...
  ⏳ 89s remaining...
  ✓ Deadline passed!

[6/6] Settling duel via FTSO v2...
  ✓ DUEL SETTLED!
  Winner: Player A (deployer)
  Payout: 0.198 C2FLR

╔══════════════════════════════════════════════╗
║  ✓ E2E TEST COMPLETE — ALL PROTOCOLS USED   ║
║  FTSO v2: Price read + settlement            ║
║  Secure RNG: Bonus chance check              ║
║  Contract: Full lifecycle proven              ║
╚══════════════════════════════════════════════╝
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Vercel URL | Your deployed URL (e.g., `https://degenduel.vercel.app`) |
| Landing page | `/` |
| App dashboard | `/arena` |
| Network | Coston2 (Flare Testnet) |
| Chain ID | `114` |
| RPC URL | `https://coston2-api.flare.network/ext/C/rpc` |
| Currency | C2FLR (testnet, no real value) |
| Contract | `0x835574875C1CB9003c1638E799f3d7c504808960` |
| Player A wallet | `0x332a479FA9E548CFb90e7aF8504534e37E27E764` |
| Player A private key | `0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f` |
| Faucet | https://faucet.flare.network/coston2 |
| Block explorer | https://coston2-explorer.flare.network |
| FLock API key | `sk-artpyU8obEVnMpU4p_wgqg` |

---

## What Each Flare Protocol Does

### FTSO v2 (Flare Time Series Oracle)
- **What it is:** A decentralized price oracle run by 100+ independent validators. Each validator independently fetches prices from exchanges and submits them. The protocol aggregates these into a single trusted price.
- **Where DegenDuel uses it:** Every price display in the price ticker, and every price duel settlement. When a duel settles, the contract reads the oracle price and compares it to the threshold.
- **Cost:** FREE to read on Coston2 (view function, no gas for the oracle itself).
- **Speed:** Prices update every ~1.8 seconds (every Coston2 block).

### Secure RNG (Random Number Generator)
- **What it is:** Flare's on-chain verifiable random number. It is generated by the validator network and is provably fair — no one can predict or manipulate it.
- **Where DegenDuel uses it:** At settlement, there is a 10% chance the winner gets a "bonus" (the full pot with zero protocol fee instead of the normal 1% fee). The random number determines whether this bonus triggers.
- **Cost:** FREE view call.

### FDC Web2Json (Flare Data Connector)
- **What it is:** A protocol that lets smart contracts verify data from any Web2 API. 100+ validators independently call the API, reach consensus on the response, and produce a cryptographic proof. The smart contract can then verify this proof on-chain.
- **Where DegenDuel uses it:** The "DATA" mode duels (betting on external API data, not just prices). The attestation pipeline takes 3-8 minutes.
- **Note:** DATA mode is implemented but not the focus of the demo. PRICE mode is faster and more visual.

### FLock AI (Decentralized AI)
- **What it is:** A decentralized AI inference network. Instead of calling OpenAI (centralized), DegenDuel calls FLock's API, which runs open-source models (Qwen 3 30B) on a decentralized network.
- **Where DegenDuel uses it:** The "AI HINT" card on the arena dashboard. It gives a confidence score and rationale for the current market conditions.
- **Why FLock instead of OpenAI:** FLock is a bounty track sponsor at ETH Oxford 2026. Using decentralized AI aligns with the crypto-native thesis and qualifies for the FLock bounty prize.

---

## Troubleshooting

### MetaMask says "Insufficient funds for gas"
Your wallet does not have enough C2FLR. Go to https://faucet.flare.network/coston2 and request tokens. If the faucet is rate-limited, switch to the Player A (deployer) account which has ~99 C2FLR.

### MetaMask says "Wrong network"
Click the network dropdown in MetaMask and select "Coston2". If Coston2 is not listed, you skipped Step 2 — go back and add the network.

### The app says "Connect your wallet"
Click the "Connect Wallet" button in the header. If MetaMask does not pop up, click the MetaMask fox icon in Chrome's toolbar first to make sure it is unlocked.

### Prices show "---" or the price ticker is empty
You are not connected to Coston2. Check MetaMask — the network should say "Coston2" at the top. If the RPC is down (rare), wait a minute and refresh.

### AI Hint shows "configure your FLock API key"
The environment variable `NEXT_PUBLIC_FLOCK_API_KEY` is not set. For local development, check that `degenduel/packages/nextjs/.env.local` contains `NEXT_PUBLIC_FLOCK_API_KEY=sk-artpyU8obEVnMpU4p_wgqg`. For Vercel, check that the environment variable is set in the Vercel dashboard (Step 6c). After adding it, redeploy.

### The duel does not appear after creation
Wait 3-5 seconds. The app polls the blockchain every 3 seconds (`pollingInterval: 3000` in scaffold.config.ts). If it still does not appear, refresh the page.

### "Transaction reverted" error
The duel parameters may be invalid (e.g., stake too low, deadline already passed). Check the browser console (F12 → Console tab) for the full error message. The minimum stake is 0.01 C2FLR.

### Vercel build fails
Run `npx next build` locally first to check for errors. The most common issue is missing environment variables — make sure `NEXT_PUBLIC_FLOCK_API_KEY` is set in Vercel's environment variables.

### I want to run locally instead of Vercel
```bash
cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/nextjs
yarn dev
```
The app runs at http://localhost:3000. Everything works the same as on Vercel.
