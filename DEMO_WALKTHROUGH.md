# DegenDuel — Demo Walkthrough (ETH Oxford 2026)

**Last Updated:** 2026-02-08
**Demo Type:** Two-player PvP prediction duel
**Duration:** ~5 minutes (including 90-second duel countdown)

---

## QUICK REFERENCE

### URLs
- **Local App:** http://localhost:3000
- **Vercel (Production):** https://degenduel-five.vercel.app
- **Landing Page:** http://localhost:3000 (or https://degenduel-five.vercel.app)
- **Arena Page:** http://localhost:3000/arena (or https://degenduel-five.vercel.app/arena)
- **Debug Page:** http://localhost:3000/debug (or https://degenduel-five.vercel.app/debug)
- **Faucet:** https://faucet.flare.network/
- **Block Explorer:** https://coston2-explorer.flare.network

### Network Details (Coston2 Testnet)
- **Chain ID:** 114
- **RPC URL:** https://coston2-api.flare.network/ext/C/rpc
- **Currency Symbol:** C2FLR
- **Block Explorer:** https://coston2-explorer.flare.network

### Contract
- **DegenDuel Address:** `0x835574875C1CB9003c1638E799f3d7c504808960`
- **Min Stake:** 0.01 FLR
- **Demo Stake:** 0.5 FLR (for visibility)
- **Duel Duration:** 90 seconds
- **Protocol Fee:** 1% on winnings
- **RNG Bonus:** 10% chance of 2x payout

### Player A (Deployer Wallet)
- **Address:** `0x332a479FA9E548CFb90e7aF8504534e37E27E764`
- **Private Key:** `0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f`
- **Balance:** ~98 C2FLR

### Player B (Second Wallet)
- **Generate new wallet in MetaMask**
- **Fund from faucet:** https://faucet.flare.network/

---

## PRE-DEMO SETUP

### IMPORTANT: Browser Profile Setup

You MUST use two separate Chrome profiles (not just two tabs). MetaMask is profile-specific.

#### Step 1: Create Two Chrome Profiles

- [ ] Open Chrome
- [ ] Click your profile icon (top right)
- [ ] Click "Add"
- [ ] Create "Profile 1 - Player A"
- [ ] Repeat to create "Profile 2 - Player B"
- [ ] You should now have two Chrome windows, each with a different profile

### Part A: Setting Up Profile 1 (Player A)

**Chrome Profile:** Profile 1 - Player A

#### Install MetaMask

- [ ] Open Chrome Profile 1
- [ ] Go to: https://metamask.io/download/
- [ ] Click "Install MetaMask for Chrome"
- [ ] Click "Add to Chrome" → "Add extension"
- [ ] MetaMask welcome page opens automatically

#### Create Initial Wallet (Required Before Import)

- [ ] Click "Create a new wallet"
- [ ] Click "I agree" to terms
- [ ] Create a password: `demo1234` (type it twice)
- [ ] Click "Create a new wallet"
- [ ] **Skip the seed phrase backup** — click "Remind me later" (this is just a temporary shell wallet)
- [ ] Click through any remaining setup prompts
- [ ] MetaMask dashboard opens (you'll see "Account 1" with 0 ETH)

#### Import the Deployer Private Key (Player A's Actual Wallet)

- [ ] Click the **account circle** icon in the top-right of MetaMask
- [ ] Click **"Import account"** (or **"Add account or hardware wallet"** → **"Import account"**)
- [ ] Select type: **"Private Key"** (should be default)
- [ ] Paste this private key exactly:
  ```
  0x91e6c551b499551eb5e0fb15b9db1557652db31fa830cce401c3572d2500699f
  ```
- [ ] Click **"Import"**
- [ ] You now see **"Account 2"** (or "Imported") — this is the deployer wallet
- [ ] Verify the address starts with: **0x332a...**
- [ ] **Make sure Account 2 is selected** (click on it if needed — it should show a checkmark)

#### Add Coston2 Network to MetaMask (Profile 1)

- [ ] Click the network dropdown at the top (shows "Ethereum Mainnet")
- [ ] Scroll down and click "Add network"
- [ ] Click "Add a network manually"
- [ ] Fill in the form:
  - **Network Name:** `Coston2`
  - **New RPC URL:** `https://coston2-api.flare.network/ext/C/rpc`
  - **Chain ID:** `114`
  - **Currency Symbol:** `C2FLR`
  - **Block Explorer URL:** `https://coston2-explorer.flare.network`
- [ ] Click "Save"
- [ ] Click "Switch to Coston2"
- [ ] Verify the network dropdown now shows "Coston2"
- [ ] Verify the account address shows: `0x332a479FA9E548CFb90e7aF8504534e37E27E764`
- [ ] Verify balance shows ~98 C2FLR

#### Verify Player A Wallet

- [ ] Click the MetaMask extension icon (jigsaw puzzle icon → MetaMask fox)
- [ ] Verify the network dropdown shows **"Coston2"** (if not, click it and select Coston2)
- [ ] Verify the selected account is **Account 2 (Imported)** — address starts with `0x332a...`
- [ ] Verify balance shows **~98 C2FLR** (may take a moment to load)
- [ ] If balance shows 0, you may still have Account 1 selected — switch to Account 2
- [ ] **Leave this Chrome window open (Player A)**

---

### Part B: Setting Up Profile 2 (Player B)

**Chrome Profile:** Profile 2 - Player B

#### Install MetaMask

- [ ] Open Chrome Profile 2
- [ ] Go to: https://metamask.io/download/
- [ ] Click "Install MetaMask for Chrome"
- [ ] Click "Add to Chrome" → "Add extension"
- [ ] MetaMask welcome page opens automatically
- [ ] Click **"Create a new wallet"**
- [ ] Click "I agree" to terms
- [ ] Create a password: `demo1234` (type it twice)
- [ ] Click "Create a new wallet"
- [ ] **Skip the seed phrase backup** — click "Remind me later" (this is a testnet-only wallet)
- [ ] Click through any remaining setup prompts
- [ ] MetaMask opens with **Account 1** and 0 ETH — this IS Player B's wallet (no import needed)

#### Add Coston2 Network to MetaMask (Profile 2)

- [ ] Click the network dropdown at the top (shows "Ethereum Mainnet")
- [ ] Scroll down and click "Add network"
- [ ] Click "Add a network manually"
- [ ] Fill in the form:
  - **Network Name:** `Coston2`
  - **New RPC URL:** `https://coston2-api.flare.network/ext/C/rpc`
  - **Chain ID:** `114`
  - **Currency Symbol:** `C2FLR`
  - **Block Explorer URL:** `https://coston2-explorer.flare.network`
- [ ] Click "Save"
- [ ] Click "Switch to Coston2"
- [ ] Verify the network dropdown now shows "Coston2"
- [ ] Verify balance shows 0 C2FLR

#### Fund Player B from Faucet

- [ ] Click the MetaMask extension icon
- [ ] Click on your account address (top center) to copy it
- [ ] You should see "Copied!" notification
- [ ] Open a new tab: https://faucet.flare.network/
- [ ] Select "Coston2" from the network dropdown
- [ ] Paste your Player B address in the address field
- [ ] Click "Request C2FLR"
- [ ] Wait for confirmation (usually 10-30 seconds)
- [ ] Go back to MetaMask
- [ ] Verify balance now shows ~100 C2FLR
- [ ] **Leave this Chrome window open (Player B)**

---

### Part C: Start the Dev Server (Localhost Demo)

**Terminal Window (Cmd+Space → type "Terminal" → Enter)**

- [ ] Open a new terminal window
- [ ] Kill any existing dev server on port 3000:
  ```bash
  lsof -ti:3000 | xargs kill -9 2>/dev/null; echo "Port 3000 cleared"
  ```
- [ ] Navigate to the project:
  ```bash
  cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/nextjs
  ```
- [ ] Start the dev server:
  ```bash
  yarn dev
  ```
- [ ] Wait for the message: **"Ready in Xs"** and **"http://localhost:3000"**
- [ ] **Leave this terminal running — do NOT close it**
- [ ] If you see errors about `.next/` cache, stop the server (Ctrl+C), then:
  ```bash
  rm -rf .next && yarn dev
  ```

---

## THE DEMO

### Part 1: Landing Page (Show to Judges)

**Chrome Profile:** Either profile (doesn't matter yet)
**URL:** http://localhost:3000

- [ ] Open http://localhost:3000 in Chrome
- [ ] **Point out to judges:** Clean landing page, no header
- [ ] **Point out:** Hero section with "Launch App" button
- [ ] **Scroll down to show:**
  - [ ] "How It Works" section (3 steps)
  - [ ] "Tech Showcase" with logos (Flare, ETH Oxford, Effect-TS, FLock, Scaffold-ETH)
  - [ ] Footer: "Built on Flare | ETH Oxford 2026"
- [ ] **Do NOT click anything yet**

**Talking Points:**
> "DegenDuel is a PvP prediction game on Flare's Coston2 testnet. Players duel by predicting price movements. We use all three Flare native protocols: FTSO v2 for price feeds, FDC for external data attestation, and Secure RNG for randomized bonuses. Let me show you a live duel."

---

### Part 2: Player A Creates a Duel

**Chrome Profile:** Profile 1 - Player A
**URL:** http://localhost:3000/arena

#### Navigate to Arena

- [ ] In Player A's browser (Profile 1), click "Launch App" button
- [ ] You are now at http://localhost:3000/arena
- [ ] **Point out to judges:**
  - [ ] Header with navigation: "Duels | Create | Leaderboard | My Duels | Debug"
  - [ ] Price ticker marquee scrolling at the top (live FTSO v2 feeds)
  - [ ] Left panel: "Live Duel" (empty for now)
  - [ ] Right panel: "CREATE A DUEL" form
  - [ ] Bottom left: Leaderboard (shows past results)
  - [ ] Bottom right: "LIVE PRICES" card (5 assets updating in real-time)

#### Connect MetaMask (Player A)

- [ ] Look at the top-right corner
- [ ] You may see a burner wallet address (starts with `0x...`) or "Connect Wallet" button
- [ ] **If you see a burner address:**
  - [ ] Click on the address/balance area (top right)
  - [ ] A dropdown appears
  - [ ] Click "Disconnect" at the bottom of the dropdown
  - [ ] The button now shows "Connect Wallet"
- [ ] Click "Connect Wallet" button (top right)
- [ ] RainbowKit modal appears with wallet options
- [ ] Click "MetaMask"
- [ ] MetaMask popup opens (asks to connect)
- [ ] Verify you see Player A's address: `0x332a479FA9E548CFb90e7aF8504534e37E27E764`
- [ ] Verify network is "Coston2"
- [ ] Click "Next"
- [ ] Click "Connect"
- [ ] The MetaMask popup closes
- [ ] The top-right corner now shows Player A's address: `0x332a...E764`
- [ ] Verify balance shows ~98 C2FLR

**Talking Points:**
> "I'm connecting Player A's wallet via MetaMask. This is a real Coston2 testnet wallet with actual C2FLR. The app uses Scaffold-ETH 2's RainbowKit integration for wallet connections."

#### Create a Price Duel

- [ ] In the "CREATE A DUEL" form, verify "PRICE" mode is selected (toggle at top)
- [ ] **Point out to judges:** "PRICE mode uses FTSO v2 feeds, DATA mode uses FDC attestations"
- [ ] Click one of the asset pills: **FLR**
- [ ] The pill turns green (selected)
- [ ] Below the pills, you see "Current Price: $0.0095" (or similar, updates every ~90s)
- [ ] **Point out to judges:** "This price comes from FTSO v2, Flare's decentralized oracle network"
- [ ] Click the "UP" button (predicts price will go up)
- [ ] The "UP" button turns neon green (selected)
- [ ] In the stake input field, clear any default value and type: `0.5`
- [ ] **Point out to judges:** "Minimum stake is 0.01 FLR, we're using 0.5 for demo visibility"
- [ ] Click the "CHALLENGE" button
- [ ] MetaMask popup appears
- [ ] **Point out to judges:** "MetaMask is asking Player A to sign the transaction and stake 0.5 C2FLR"
- [ ] In the MetaMask popup:
  - [ ] Verify "Amount: 0.5 C2FLR"
  - [ ] Verify "To: 0x8355...8960" (DegenDuel contract)
  - [ ] Verify network: "Coston2"
- [ ] Click "Confirm" in MetaMask
- [ ] Wait for the transaction to confirm (5-10 seconds)
- [ ] A success toast appears: "Duel created! Waiting for an opponent..."
- [ ] The "CREATE A DUEL" form resets
- [ ] **Note the duel ID** in the toast or from the "Open Duels" section below the form (e.g., "Duel #5")
- [ ] **Write down the duel ID:** `Duel #____`

**What You Should See After Creation:**

- [ ] The "Live Duel" panel on the left now shows:
  - [ ] "Duel #5 (or your duel ID)"
  - [ ] "Status: WAITING FOR OPPONENT"
  - [ ] A TradingView chart for FLR
  - [ ] Your prediction: "Player A: UP"
  - [ ] Stake: "0.5 FLR"
  - [ ] "Waiting for Player B..."
- [ ] The "Open Duels" section below the create form shows a card:
  - [ ] "Duel #5"
  - [ ] "Asset: FLR"
  - [ ] "Player A: UP"
  - [ ] "Stake: 0.5 FLR"
  - [ ] A "BET DOWN" button (opposite of Player A's prediction)

**Talking Points:**
> "Player A has created a duel predicting FLR price will go UP. The contract has locked their 0.5 C2FLR stake. Now we need Player B to join with the opposite prediction. The duel lasts 90 seconds from when Player B joins."

---

### Part 3: Player B Joins the Duel

**Chrome Profile:** Profile 2 - Player B
**URL:** http://localhost:3000/arena

#### Navigate to Arena

- [ ] Switch to Player B's Chrome window (Profile 2)
- [ ] Open http://localhost:3000/arena
- [ ] You are now at the arena page
- [ ] **Point out to judges:** "Player B is opening the same app in a different browser"

#### Connect MetaMask (Player B)

- [ ] Look at the top-right corner
- [ ] You may see a burner wallet address or "Connect Wallet" button
- [ ] **If you see a burner address:**
  - [ ] Click on the address/balance area (top right)
  - [ ] A dropdown appears
  - [ ] Click "Disconnect"
  - [ ] The button now shows "Connect Wallet"
- [ ] Click "Connect Wallet" button (top right)
- [ ] RainbowKit modal appears
- [ ] Click "MetaMask"
- [ ] MetaMask popup opens
- [ ] Verify you see Player B's address (different from Player A)
- [ ] Verify network is "Coston2"
- [ ] Click "Next"
- [ ] Click "Connect"
- [ ] The MetaMask popup closes
- [ ] The top-right corner now shows Player B's address
- [ ] Verify balance shows ~100 C2FLR

**Talking Points:**
> "Player B is connecting with a completely different wallet. They got C2FLR from Flare's testnet faucet."

#### Join Player A's Duel

- [ ] Scroll down to the "Open Duels" section (below the "CREATE A DUEL" form)
- [ ] **Point out to judges:** "Here are all open duels waiting for opponents"
- [ ] Find the duel created by Player A (Duel #5 or your noted ID)
- [ ] Verify the duel card shows:
  - [ ] "Duel #5"
  - [ ] "Asset: FLR"
  - [ ] "Player A: UP"
  - [ ] "Stake: 0.5 FLR"
  - [ ] A "BET DOWN" button (the opposite prediction)
- [ ] **Point out to judges:** "Player B must take the opposite side. If A bet UP, B must bet DOWN."
- [ ] Click the "BET DOWN" button
- [ ] MetaMask popup appears
- [ ] **Point out to judges:** "MetaMask is asking Player B to match the stake: 0.5 C2FLR"
- [ ] In the MetaMask popup:
  - [ ] Verify "Amount: 0.5 C2FLR"
  - [ ] Verify "To: 0x8355...8960" (DegenDuel contract)
  - [ ] Verify network: "Coston2"
- [ ] Click "Confirm" in MetaMask
- [ ] Wait for the transaction to confirm (5-10 seconds)
- [ ] A success toast appears: "Joined duel! Battle begins!"
- [ ] The "Open Duels" section updates (the duel disappears or status changes to "ACTIVE")

**What You Should See After Joining (Player B's View):**

- [ ] The "Live Duel" panel on the left now shows:
  - [ ] "Duel #5"
  - [ ] "Status: ACTIVE"
  - [ ] Countdown timer: "1:30" (90 seconds)
  - [ ] A TradingView chart for FLR
  - [ ] "Player A: UP | Player B: DOWN"
  - [ ] "Total Pot: 1.0 FLR"
  - [ ] Start Price: "$0.0095" (recorded when B joined)

**Switch to Player A's Window:**

- [ ] Switch to Player A's Chrome window (Profile 1)
- [ ] **Point out to judges:** "Player A's view updates automatically"
- [ ] Verify the "Live Duel" panel shows the same information:
  - [ ] "Status: ACTIVE"
  - [ ] Countdown timer ticking down
  - [ ] "Player A: UP | Player B: DOWN"
  - [ ] "Total Pot: 1.0 FLR"
  - [ ] Start Price

**Talking Points:**
> "The duel is now ACTIVE. Both players have staked 0.5 FLR for a total pot of 1.0 FLR. The contract recorded the starting price from FTSO v2 when Player B joined. In 90 seconds, we'll read the ending price and determine the winner. The contract also generates a random number via Flare's Secure RNG—there's a 10% chance the winner gets a 2x bonus payout."

---

### Part 4: Watch the Battle

**Chrome Profile:** Both profiles (switch between them to show judges)

#### Countdown Timer

- [ ] Watch the countdown timer in the "Live Duel" panel
- [ ] **Point out to judges:** "The timer counts down from 90 seconds"
- [ ] **Point out the TradingView chart:** "This is a live chart showing FLR price action"
- [ ] **Switch between Player A and Player B windows to show:**
  - [ ] Both see the same countdown
  - [ ] Both see the same start price
  - [ ] Both see their predictions highlighted

#### Price Ticker

- [ ] **Point out the marquee ticker at the top:**
  - [ ] "These prices update every ~1.8 seconds from FTSO v2"
  - [ ] "FTSO reads are FREE on Coston2—no gas costs"

#### AI Hint (Optional Demo)

- [ ] In Player A's window, scroll down to the "AI HINT" accordion (if visible)
- [ ] Click to expand
- [ ] **Point out to judges:** "We integrated FLock's AI agent to provide hints on price predictions. This is a decentralized AI bounty submission."
- [ ] (Skip this if you're short on time)

#### Wait for Timer to End

- [ ] Wait until the countdown reaches "0:00"
- [ ] The "Live Duel" panel status changes to "ENDED"
- [ ] **Point out to judges:** "The duel has ended. Now we need to settle it on-chain to determine the winner."

**Talking Points:**
> "The 90-second duel period has ended. The contract will now read the final price from FTSO v2 and compare it to the start price. If the price went UP, Player A wins. If it went DOWN, Player B wins. Let's settle the duel and see the results."

---

### Part 5: Settlement and Results

**Chrome Profile:** Either profile (you can use Player A or Player B to settle)
**URL:** http://localhost:3000/debug

#### Navigate to Debug Page

- [ ] In one of the browser windows (either Player A or Player B), click "Debug" in the header navigation
- [ ] You are now at http://localhost:3000/debug
- [ ] **Point out to judges:** "Scaffold-ETH 2 auto-generates a debug UI for all contract functions"

#### Locate the settlePriceDuel Function

- [ ] Scroll down the debug page to find "DegenDuel" contract section
- [ ] Look for the "settlePriceDuel" function (usually under "Write" functions)
- [ ] **Point out to judges:** "This function reads the final price from FTSO v2 and determines the winner"

#### Call settlePriceDuel

- [ ] In the "settlePriceDuel" form:
  - [ ] **Field:** `_duelId` (uint256)
  - [ ] **Type the duel ID you noted earlier:** e.g., `5`
  - [ ] (If you didn't note it, the duel ID was shown in the "Live Duel" panel, e.g., "Duel #5")
- [ ] Click "Send" or "Execute" button (depends on Scaffold-ETH 2 UI)
- [ ] MetaMask popup appears
- [ ] **Point out to judges:** "Anyone can settle a duel after it ends. Settlement costs a small amount of gas."
- [ ] In the MetaMask popup:
  - [ ] Verify "To: 0x8355...8960" (DegenDuel contract)
  - [ ] Verify "Function: settlePriceDuel"
  - [ ] Verify network: "Coston2"
- [ ] Click "Confirm" in MetaMask
- [ ] Wait for the transaction to confirm (5-10 seconds)
- [ ] A success toast appears: "Duel settled!" or similar

#### Alternative: Settle from Hardhat Console

If the debug page doesn't work or you prefer the CLI:

- [ ] Open a new terminal
- [ ] Navigate to hardhat directory:
  ```bash
  cd /Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/hardhat
  ```
- [ ] Start Hardhat console:
  ```bash
  npx hardhat console --network coston2
  ```
- [ ] Wait for the console prompt: `>`
- [ ] Run the following commands:
  ```javascript
  const duel = await ethers.getContractAt("DegenDuel", "0x835574875C1CB9003c1638E799f3d7c504808960")
  await (await duel.settlePriceDuel(5)).wait()
  ```
  (Replace `5` with your duel ID)
- [ ] Wait for "Transaction mined" confirmation
- [ ] Exit the console: `.exit`

#### View Results

- [ ] Switch back to the arena page: http://localhost:3000/arena
- [ ] The "Live Duel" panel now shows:
  - [ ] "Status: SETTLED"
  - [ ] "Winner: Player A" (or "Player B")
  - [ ] "Final Price: $0.0096" (or whatever the ending price was)
  - [ ] "Payout: 0.99 FLR" (99% of pot, 1% protocol fee)
  - [ ] **If RNG bonus triggered:** "RNG BONUS! 2x Payout: 1.98 FLR"

#### Check Leaderboard

- [ ] Scroll down to the "Leaderboard" section (bottom left)
- [ ] **Point out to judges:** "The leaderboard updates automatically with wins, losses, and total earnings"
- [ ] Find Player A and Player B in the leaderboard:
  - [ ] Winner shows: Wins +1, Earnings +0.99 FLR (or +1.98 if RNG bonus)
  - [ ] Loser shows: Losses +1, Earnings unchanged

#### Check Wallet Balances

- [ ] Click the MetaMask extension icon (in the winner's browser)
- [ ] Verify balance increased:
  - [ ] Player A started with ~98 C2FLR
  - [ ] Player B started with ~100 C2FLR
  - [ ] Winner's balance should be ~0.99 FLR higher (minus gas)
  - [ ] Loser's balance should be ~0.5 FLR lower (minus gas)

**Talking Points:**
> "Player [A/B] won! The contract read the final price from FTSO v2, compared it to the start price, and determined the winner. The winner received 99% of the total pot (1% goes to protocol fees). [If RNG bonus:] The RNG also triggered a 2x bonus, so the winner got double the payout! This shows all three Flare protocols working together: FTSO v2 for prices, FDC for data attestation (in DATA mode), and Secure RNG for randomized bonuses."

---

## TALKING POINTS (Summary)

### Opening (Landing Page)

> "DegenDuel is a PvP prediction game on Flare's Coston2 testnet. Players duel by predicting price movements or external data outcomes. We use all three Flare native protocols: FTSO v2 for decentralized price feeds, FDC for external data attestation, and Secure RNG for randomized bonuses."

### During Duel Creation (Player A)

> "Player A is creating a duel by predicting FLR price will go UP. The current price comes from FTSO v2, Flare's decentralized oracle network. Player A stakes 0.5 C2FLR on this prediction. The contract locks the stake and waits for an opponent."

### During Duel Join (Player B)

> "Player B is joining the duel with the opposite prediction: DOWN. They must match the stake, so they're also staking 0.5 C2FLR. When Player B joins, the contract records the starting price from FTSO v2 and starts a 90-second countdown."

### During Battle

> "The duel is now ACTIVE. Both players have staked 0.5 FLR for a total pot of 1.0 FLR. The contract recorded the starting price when Player B joined. In 90 seconds, we'll read the ending price and determine the winner. The contract also generates a random number via Flare's Secure RNG—there's a 10% chance the winner gets a 2x bonus payout."

### During Settlement

> "The duel has ended. Settlement reads the final price from FTSO v2 and compares it to the start price. If the price went UP, Player A wins. If it went DOWN, Player B wins. FTSO reads are FREE on Coston2—no gas costs for price queries. Settlement costs a small amount of gas, but anyone can trigger it."

### After Settlement

> "Player [A/B] won! The contract determined the winner based on FTSO v2 price data. The winner received 99% of the total pot (1% goes to protocol fees). [If RNG bonus:] The RNG also triggered a 2x bonus, doubling the payout! This demonstrates all three Flare protocols working together in a real-world application."

### Tech Stack

> "We built this on Scaffold-ETH 2 with Hardhat and Next.js. The frontend uses Effect-TS for type-safe async state management and DaisyUI for the dark neon theme. We integrated FLock's decentralized AI agent for prediction hints. Everything is open-source and deployed on Flare's Coston2 testnet."

---

## TROUBLESHOOTING

### MetaMask Not Showing Coston2 Network

**Issue:** You added Coston2 to MetaMask, but it's not appearing in the network dropdown.

**Fix:**
- [ ] Make sure you saved the network after adding it
- [ ] Try clicking "Add network" again and verify the Chain ID is exactly `114` (no extra spaces)
- [ ] If it still doesn't work, try adding via Chainlist: https://chainlist.org/?search=coston2

### MetaMask Not Connecting to App

**Issue:** You click "Connect Wallet" but nothing happens or MetaMask doesn't open.

**Fix:**
- [ ] Make sure MetaMask extension is installed and unlocked
- [ ] Refresh the page: http://localhost:3000/arena
- [ ] Try disconnecting the burner wallet first (click address dropdown → Disconnect)
- [ ] Clear browser cache and reload

### Burner Wallet Won't Disconnect

**Issue:** You click "Disconnect" but the burner wallet reconnects immediately.

**Fix:**
- [ ] Refresh the page after disconnecting
- [ ] Check `/packages/nextjs/scaffold.config.ts` — make sure `onlyLocalBurnerWallet: false`
- [ ] If it's set to `true`, change it to `false`, save, and restart the dev server

### Player B's Duel Doesn't Appear in Open Duels

**Issue:** Player A created a duel, but Player B doesn't see it in the "Open Duels" section.

**Fix:**
- [ ] Refresh Player B's browser
- [ ] Make sure Player A's transaction actually confirmed (check MetaMask activity)
- [ ] Check the console for errors (F12 → Console tab)
- [ ] Verify both browsers are connected to Coston2 network
- [ ] Wait 30 seconds and refresh again (block indexing delay)

### MetaMask Transaction Fails (Insufficient Funds)

**Issue:** MetaMask says "Insufficient funds" when trying to create or join a duel.

**Fix:**
- [ ] Check your wallet balance in MetaMask (top center)
- [ ] Make sure you have at least 0.6 C2FLR (0.5 stake + gas)
- [ ] If balance is low, go to https://faucet.flare.network/ and request more C2FLR
- [ ] Wait for faucet transaction to confirm (check MetaMask activity)

### Countdown Timer Not Starting

**Issue:** Player B joined, but the countdown doesn't start or shows "NaN" or "0:00".

**Fix:**
- [ ] Refresh both browsers
- [ ] Check the "Live Duel" panel for actual status (may be a UI bug)
- [ ] Open the debug page and read the duel data manually (call `getDuel(uint256)` with your duel ID)
- [ ] If the duel status is "ACTIVE" on-chain but UI doesn't update, it's a frontend caching issue—refresh

### Settlement Transaction Fails

**Issue:** You call `settlePriceDuel` but the transaction reverts or fails.

**Fix:**
- [ ] Make sure the duel has actually ended (wait 90 seconds after Player B joined)
- [ ] Make sure the duel hasn't already been settled (check status on debug page)
- [ ] Verify you're using the correct duel ID (not an old duel or wrong number)
- [ ] Check the console for error messages (F12 → Console tab)
- [ ] Try settling from the Hardhat console instead of the debug page

### Hardhat Console Won't Connect

**Issue:** `npx hardhat console --network coston2` fails or hangs.

**Fix:**
- [ ] Make sure you're in the correct directory: `/Users/zain/Documents/ETH_Oxford_Hack/degenduel/packages/hardhat`
- [ ] Check `hardhat.config.ts` — verify Coston2 network is configured with correct RPC URL
- [ ] Try pinging the RPC: `curl https://coston2-api.flare.network/ext/C/rpc`
- [ ] If it times out, the RPC may be down—wait and try again

### FTSO Prices Not Updating

**Issue:** The "LIVE PRICES" card or current price display shows old data or doesn't update.

**Fix:**
- [ ] FTSO feeds update every ~90 seconds on Coston2—this is normal
- [ ] Refresh the page to force a new fetch
- [ ] Check the console for errors (F12 → Console tab)
- [ ] Verify the Effect-TS layer is running (no errors about failed subscriptions)

### TradingView Chart Not Loading

**Issue:** The chart in the "Live Duel" panel is blank or shows an error.

**Fix:**
- [ ] TradingView widgets require internet access—make sure you're online
- [ ] Refresh the page
- [ ] Check browser console for CORS errors or blocked scripts
- [ ] If the chart still doesn't load, it's a UI-only issue—the duel logic still works on-chain

### Leaderboard Not Updating After Settlement

**Issue:** The duel settled, but the leaderboard still shows old data.

**Fix:**
- [ ] Refresh the page
- [ ] The leaderboard queries on-chain events—there may be a delay (wait 30 seconds)
- [ ] Check the debug page to verify the duel was actually settled (call `getDuel(uint256)`)
- [ ] If the duel is settled on-chain, it's a frontend caching issue—hard refresh (Cmd+Shift+R)

### Wrong Network in MetaMask

**Issue:** MetaMask is connected to the wrong network (e.g., Ethereum Mainnet).

**Fix:**
- [ ] Click the network dropdown in MetaMask (top center)
- [ ] Select "Coston2"
- [ ] If Coston2 isn't in the list, add it manually (see Pre-Demo Setup)
- [ ] Refresh the app after switching networks

### Transaction Pending Forever

**Issue:** MetaMask shows "Pending" for a long time, transaction never confirms.

**Fix:**
- [ ] Coston2 block times are ~2-5 seconds—if it's pending for >30 seconds, something is wrong
- [ ] Check the transaction hash on the block explorer: https://coston2-explorer.flare.network
- [ ] If the transaction isn't there, it may not have been broadcast—try canceling and resubmitting
- [ ] If the transaction shows "Failed" on the explorer, check the error message

### Can't Find Duel ID

**Issue:** You created a duel but forgot to note the ID, and now you can't settle it.

**Fix:**
- [ ] Check the "Open Duels" or "My Duels" section—the duel ID should be displayed
- [ ] Check the "Live Duel" panel—it shows "Duel #X" at the top
- [ ] Check MetaMask transaction history—find the "createPriceDuel" transaction and view it on the block explorer
- [ ] On the block explorer, look at the "Logs" tab—the `DuelCreated` event contains the duel ID
- [ ] In Hardhat console, call `nextDuelId()` to get the next ID, then subtract 1 to get the last created duel

### Player B Tries to Join Their Own Duel

**Issue:** Transaction fails with "Cannot join own duel" error.

**Fix:**
- [ ] You're using the same wallet for both players — Player A and Player B MUST be different wallets
- [ ] Make sure you're in the correct Chrome profile: Profile 1 = Player A, Profile 2 = Player B
- [ ] Check MetaMask — verify the address shown is different from the duel creator's address

### RNG Bonus Not Triggering (Expected in Demo)

**Issue:** You wanted to show the RNG bonus in the demo, but it didn't trigger.

**Fix:**
- [ ] The RNG bonus has a 10% chance—it's random!
- [ ] If you MUST show it in the demo, you can create multiple duels until it triggers
- [ ] OR modify the contract to increase the bonus chance (requires redeployment)
- [ ] OR just explain: "There's a 10% chance of a 2x bonus. In this case, it didn't trigger, but the winner still gets 99% of the pot."

---

## FINAL CHECKLIST (Before Demo)

### Pre-Demo (Do This 1 Hour Before)

- [ ] Verify dev server is running: http://localhost:3000
- [ ] Verify both Chrome profiles are set up and MetaMask is installed
- [ ] Verify Player A wallet has C2FLR (~98 FLR)
- [ ] Verify Player B wallet has C2FLR (~100 FLR)
- [ ] Verify both wallets are connected to Coston2 network
- [ ] Test create a duel with Player A (use 0.01 FLR to save funds)
- [ ] Test join with Player B
- [ ] Test settlement
- [ ] Verify leaderboard updates

### During Demo (Follow This Order)

1. [ ] Show landing page (30 seconds)
2. [ ] Navigate to arena, connect Player A (30 seconds)
3. [ ] Create duel with Player A (1 minute)
4. [ ] Switch to Player B, connect, join duel (1 minute)
5. [ ] Talk about architecture while countdown runs (90 seconds)
6. [ ] Settle duel and show results (1 minute)
7. [ ] Show leaderboard and wallet balances (30 seconds)

**Total Time:** ~5 minutes

---

## DEMO SCRIPT (Word-for-Word)

### Opening (30 seconds)

> "Hi, I'm Zain, and this is DegenDuel—a PvP prediction game on Flare. Players duel by predicting price movements. We use all three Flare native protocols: FTSO v2 for decentralized price feeds, FDC for external data attestation, and Secure RNG for randomized bonuses. Let me show you a live duel between two players."

### Landing Page (30 seconds)

> "This is the landing page. Clean UI, tech showcase at the bottom. Let me click 'Launch App' to go to the arena."

### Player A Connect (30 seconds)

> "I'm connecting Player A via MetaMask. This is a real Coston2 testnet wallet with actual C2FLR. Scaffold-ETH 2 uses RainbowKit for wallet connections. [Wait for MetaMask popup] There we go, Player A is connected."

### Create Duel (1 minute)

> "Player A is creating a duel. First, I'll select the asset—let's go with FLR. The current price is $0.0095, pulled from FTSO v2, Flare's decentralized oracle. Player A predicts the price will go UP. I'll stake 0.5 C2FLR on this prediction. [Click CHALLENGE] MetaMask asks for confirmation. [Confirm] The transaction is broadcasting... [Wait for toast] Done! The duel is created and waiting for an opponent."

### Player B Join (1 minute)

> "Now let me switch to Player B's browser—a completely different wallet, funded from Flare's testnet faucet. Player B connects via MetaMask. [Wait for connection] Now Player B sees the open duel created by Player A. Player B must take the opposite side—Player A bet UP, so Player B bets DOWN. [Click BET DOWN] MetaMask asks Player B to match the stake: 0.5 C2FLR. [Confirm] Transaction broadcasting... [Wait for toast] Done! The duel is now ACTIVE."

### Countdown (90 seconds)

> "The duel lasts 90 seconds. Both players staked 0.5 FLR for a total pot of 1.0 FLR. When Player B joined, the contract recorded the starting price from FTSO v2. When the countdown ends, we'll read the final price and determine the winner. The contract also uses Flare's Secure RNG to generate a random number—there's a 10% chance the winner gets a 2x bonus payout.
>
> While we wait, let me talk about the architecture. We built this on Scaffold-ETH 2 with Hardhat and Next.js. The frontend uses Effect-TS for type-safe async state management—this lets us compose FTSO reads, FDC attestations, and RNG calls as pure, testable effects. The UI is styled with DaisyUI in a dark neon theme. We also integrated FLock's decentralized AI agent for prediction hints—that's a separate bounty submission.
>
> For the Flare integration: FTSO v2 feeds update every ~90 seconds and are FREE to read on Coston2—no gas costs. FDC lets us attest external API data on-chain, like weather or sports scores. Secure RNG gives us verifiable randomness for the bonus payout. This demo shows FTSO v2 and RNG. In the full app, users can also duel on DATA mode using FDC to fetch and verify external APIs.
>
> [Countdown hits 0:00] Alright, the duel has ended. Let's settle it."

### Settlement (1 minute)

> "I'm navigating to the debug page. Scaffold-ETH 2 auto-generates a UI for all contract functions. Here's `settlePriceDuel`—I'll enter the duel ID and click Send. [MetaMask popup] Confirming... [Wait for toast] Done! The contract just read the final price from FTSO v2, compared it to the start price, and determined the winner."

### Results (30 seconds)

> "Back on the arena page... Player [A/B] won! The winner received 99% of the pot—0.99 FLR. The 1% protocol fee goes to the contract owner. [If RNG:] And look at this—the RNG bonus triggered! The winner got a 2x payout: 1.98 FLR instead of 0.99. The leaderboard updates automatically—Player [A/B] now has one more win and 1.98 FLR in total earnings. Player [A/B]'s MetaMask balance also went up.
>
> That's DegenDuel—three Flare protocols, one game, fully functional on Coston2 testnet. Thank you!"

---

## END OF DEMO WALKTHROUGH

**Document Version:** 1.0
**Last Updated:** 2026-02-08
**Contact:** Zain (ETH Oxford 2026)

**Good luck with the demo! 🎮⚡**
