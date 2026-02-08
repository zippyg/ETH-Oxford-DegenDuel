# DegenDuel — Demo Video Script (FINAL)

**Duration:** 3 minutes 30 seconds (210 seconds)
**Format:** Screen recording + voiceover (recorded separately, mixed in post)
**Voiceover budget:** ~525 words at 150 WPM
**Recording:** Pre-record full 5-min run, edit down. Have backup settled duel footage.

---

## PRE-RECORDING CHECKLIST

- [ ] Both Chrome profiles set up, MetaMask on Coston2, wallets funded
- [ ] Dev server running on localhost:3000
- [ ] Player A already connected on arena page
- [ ] Player B browser open to arena page, wallet connected
- [ ] No old duels cluttering the UI (or exactly 1-2 settled duels in leaderboard for context)
- [ ] Screen resolution: 1920x1080, browser zoom 100%
- [ ] Hide bookmark bar, minimize browser chrome
- [ ] Close all notifications (Do Not Disturb ON)
- [ ] Record voiceover SEPARATELY in a quiet room, mix later

---

## THE SCRIPT

### [0:00 - 0:12] HOOK (12 seconds)

**On screen:** Landing page hero section. Camera holds on the title/tagline.

**Video speed:** Real-time. Hold still.

**Voiceover (30 words):**
> "Every prediction market today relies on centralized oracles for settlement. DegenDuel settles trustlessly — using all three of Flare's enshrined data protocols in a single PvP game."

**Stage direction:** Don't scroll yet. Let the hero section breathe. Judges need to read the title.

**Why this works:** Opens with a problem statement that positions the project. "Enshrined data protocols" and "all three" are the two highest-value Flare keywords. "PvP" signals gaming track.

---

### [0:12 - 0:28] LANDING PAGE SCROLL (16 seconds)

**On screen:** Smooth scroll down through the landing page sections.

**Video speed:** 1.5x (subtle — feels purposeful, not rushed)

**Scroll choreography:**
- [0:12] Begin scroll
- [0:14] Pause 1.5s on **ProblemSection** (shows "Centralized oracles..." framing)
- [0:17] Continue scroll
- [0:19] Pause 1.5s on **HowItWorks** (3-step flow: Create > Duel > Win)
- [0:22] Continue scroll
- [0:24] Pause 2s on **TechShowcase** (Flare, Effect-TS, FLock, Scaffold-ETH logos)
- [0:27] Continue scroll to FinalCTA, then click "Enter Arena"

**Voiceover (40 words):**
> "Quick walkthrough of the landing. The game loop is simple — create a duel, predict a price direction, stake tokens, and the blockchain settles who was right. Built on Scaffold-ETH 2, Effect-TS service layer, FLock AI for strategy hints."

**Why this works:** Drops all four bounty names naturally. "Effect-TS service layer" is a keyword bomb for Effectful judges. "FLock AI" is a separate sponsor mention. Doesn't explain what any of these ARE — judges already know.

---

### [0:28 - 0:40] ARENA ARRIVES (12 seconds)

**On screen:** Arena page loads. PriceTicker marquee scrolling across top. Protocol stats bar visible (Duels / Settled / Volume). Main grid: ActiveDuel panel left, CreateDuel form right.

**Video speed:** Real-time. Let the page animate in (framer-motion staggered entrance).

**Voiceover (30 words):**
> "This is the arena. Live FTSO v2 price feeds scrolling at the top — FLR, BTC, ETH, XRP, SOL. All read concurrently via Effect.all from the FtsoService. Zero gas cost."

**Stage direction:** Mouse hovers slowly over the price ticker to draw attention. Then move to the stats bar.

**Why this works:** "Concurrently via Effect.all from the FtsoService" — one sentence, two bounty keyword hits (Effect + Flare). "Zero gas cost" shows you understand Coston2 view functions. Judges who built FTSO know this is correct.

---

### [0:40 - 1:10] CREATE A DUEL (30 seconds)

**On screen:** Player A's browser. CreateDuel form on the right.

**Action sequence + timing:**

| Time | Action | Speed |
|------|--------|-------|
| 0:40 | Mouse moves to PRICE mode toggle (should already be selected) | Real-time |
| 0:42 | Click **FLR** asset pill — it highlights green | Real-time |
| 0:44 | Brief pause — show "Current Price: $X.XXXX" updating below the pills | Real-time, 2s hold |
| 0:46 | Click **UP** prediction button — it glows neon green | Real-time |
| 0:48 | Click into stake input, type **0.5** | Real-time |
| 0:50 | Click **CHALLENGE** button | Real-time |
| 0:52 | MetaMask popup appears | Real-time |
| 0:53 | Click **Confirm** in MetaMask | Real-time |
| 0:54 | **JUMP CUT** — skip tx wait | Cut |
| 0:56 | Toast appears: "Duel created!" | Real-time |
| 0:58 | The ActiveDuel panel on the left populates: "WAITING FOR OPPONENT" | Real-time |
| 1:00 | Mouse moves to ActiveDuel panel to highlight it | Real-time |
| 1:10 | Hold on ActiveDuel panel showing duel details | Real-time |

**Voiceover (55 words):**
> "Player A selects FLR, predicts UP, stakes half a FLR. The contract locks the stake and waits for an opponent. Under the hood — the CreateDuel transaction calls the smart contract, which snapshots the current FTSO price as the entry point. That price wasn't fetched from an API — it's read directly from Flare's protocol-level oracle."

**Why this works:** "Protocol-level oracle" is the Flare differentiator vs. Chainlink. "Snapshots the current FTSO price as the entry point" shows you understand the settlement mechanic. Doesn't waste time explaining MetaMask.

---

### [1:10 - 1:35] PLAYER B JOINS (25 seconds)

**On screen:** Quick switch to Player B's browser. Already on arena page, wallet connected.

**Action sequence + timing:**

| Time | Action | Speed |
|------|--------|-------|
| 1:10 | **Cut to Player B browser** — arena page, different wallet address visible top-right | Instant cut |
| 1:12 | Mouse scrolls down to "Open Duels" section, Player A's duel visible | Real-time |
| 1:15 | Brief pause on DuelCard showing: asset, prediction, stake | 2s hold |
| 1:17 | Click **"Accept Duel"** / "BET DOWN" button | Real-time |
| 1:19 | MetaMask popup, click **Confirm** | Real-time |
| 1:20 | **JUMP CUT** — skip tx wait | Cut |
| 1:22 | Toast: "Duel joined! Battle begins!" | Real-time |
| 1:24 | ActiveDuel panel updates: "ACTIVE" status, countdown starts at 90 | Real-time |
| 1:26 | Mouse highlights the countdown timer | Real-time |
| 1:35 | Hold on active duel view: both players shown, countdown ticking | Real-time |

**Voiceover (45 words):**
> "Different browser, different wallet. Player B sees the open duel, takes the opposite side — DOWN — and matches the stake. The moment B joins, the contract records the FTSO start price and the 90-second clock begins. Both players are now locked in. Total pot: 1 FLR."

**Why this works:** "Different browser, different wallet" proves it's actually two players. "Records the FTSO start price" reinforces the settlement flow without over-explaining.

---

### [1:35 - 1:55] THE COUNTDOWN (20 seconds)

**On screen sequence:**

| Time | Screen | Speed |
|------|--------|-------|
| 1:35 | Countdown at 88... 87... 86... Price ticker updating. Show both players' predictions side by side. | Real-time, 5 seconds |
| 1:40 | **BRANDED TITLE CARD:** Dark background, "90 SECONDS LATER..." with DegenDuel logo + Flare watermark. Keep it clean. | Static, 5 seconds |
| 1:45 | **Cut back** — countdown at 5... 4... 3... 2... 1... 0. Status changes to "ENDED" or "READY TO SETTLE" | Real-time, 10 seconds |

**Voiceover (55 words):**
> [During countdown + title card]
> "While the duel runs, the architecture underneath is doing the heavy lifting. The entire off-chain layer is Effect-TS — 9 composable services, 12 distinct effect types. Typed error channels for every failure mode. The FDC attestation pipeline alone uses retry with exponential backoff, 10-minute timeouts, conditional polling, and fiber cancellation."

> [Countdown hits 0]
> "Time's up."

**Why this works:** This is the Effectful Programming bounty money shot. During dead screen time (title card), you drop the technical depth. "9 composable services, 12 distinct effect types" — the Effectful judges hear their exact criteria. "Fiber cancellation" shows you went deep, not surface-level. Flare judges hear "FDC attestation pipeline" and know you built the hard thing.

---

### [1:55 - 2:25] SETTLEMENT (30 seconds)

**On screen:** Back on arena page. Settle button should be visible on the ActiveDuel panel (the duel has ended).

**Action sequence + timing:**

| Time | Action | Speed |
|------|--------|-------|
| 1:55 | Mouse moves to "Settle Duel" button on the ActiveDuel panel | Real-time |
| 1:57 | Click **"Settle Duel"** | Real-time |
| 1:59 | MetaMask popup, click **Confirm** | Real-time |
| 2:00 | **JUMP CUT** — skip tx wait | Cut |
| 2:03 | Settlement animation plays (confetti if winner) | Real-time |
| 2:05 | ActiveDuel panel updates: "SETTLED", Winner shown, payout displayed | Real-time |
| 2:08 | **Hold on results** — show starting price, ending price, winner, payout amount | Real-time, 5s hold |
| 2:13 | If RNG bonus triggered: highlight "2X BONUS!" badge | Real-time |
| 2:15 | Mouse scrolls down to show the EffectPrices component and Leaderboard | Real-time |
| 2:25 | Hold on leaderboard showing updated win/loss record | Real-time |

**Voiceover (65 words):**
> "Settlement is permissionless — anyone can trigger it. The contract reads the final price from FTSO v2, compares it to the entry price, and determines the winner on-chain. No dispute resolution, no centralized oracle, no trust required. Player A called it — FLR went up. Winner takes 99% of the pot. The other 1% is protocol fee."
>
> [If RNG bonus:] "And the Secure RNG triggered a 2x bonus — provably fair, verifiable randomness."

**Why this works:** "Permissionless" is a blockchain-native term that signals you're not a tourist. "No dispute resolution, no centralized oracle, no trust required" — three negatives that define the value prop. Naming the 1% fee shows the smart contract has real economic design.

---

### [2:25 - 2:50] ARCHITECTURE + EFFECT-TS (25 seconds)

**On screen:** Scroll down to the **EffectPrices** component on the arena page — this shows the live Effect-TS service reading prices server-side. Then briefly show the codebase (pre-opened in a code editor tab or terminal).

**Screen sequence:**

| Time | Screen | Speed |
|------|--------|-------|
| 2:25 | EffectPrices component on arena page — shows 5 live prices with "Powered by Effect-TS" label | Real-time, 3s hold |
| 2:28 | **Cut to VS Code or terminal** showing `services/effectServices/` directory listing (9 files) | Real-time, 3s hold |
| 2:31 | Quick scroll through `FdcService.ts` — show the `fullAttestation` pipeline (the gen function with yield* steps) | 1.5x speed, 5s |
| 2:36 | Quick scroll through `errors.ts` — show the 11 TaggedError types | 1.5x speed, 4s |
| 2:40 | **Cut to** `index.ts` showing `AppLayerLive = Layer.mergeAll(...)` composition | Real-time, 3s hold |
| 2:43 | **Cut to** `/api/ftso-prices/route.ts` showing `Effect.runPromise()` | Real-time, 3s hold |
| 2:46 | **Cut back to app** | Instant |

**Voiceover (60 words):**
> "Under the hood — every blockchain interaction is an explicit Effect. FtsoService, FdcService, RngService, FlockService, EventService, DuelService — all composed via Layer into a single AppLayerLive. 11 tagged error types with discriminated unions. The FDC pipeline runs server-side via Effect.runPromise in a Next.js API route. This is Effect-TS in production, not a demo."

**Why this works:** You're speed-running the code while the voiceover does the explaining. Effectful judges hear the exact pattern names: "Layer", "AppLayerLive", "tagged error types", "discriminated unions", "Effect.runPromise", "production". Flare judges see the FDC pipeline code. Naming all 6 services in one breath shows you built something substantial.

---

### [2:50 - 3:10] FDC + FLARE DIFFERENTIATOR (20 seconds)

**On screen:** Back on the arena page. Show the DATA mode toggle on CreateDuel form (if it exists), or show a code snippet of the FDC attestation flow.

**Screen sequence:**

| Time | Screen | Speed |
|------|--------|-------|
| 2:50 | Arena page — hover over DATA/PRICE mode toggle on CreateDuel form | Real-time, 3s |
| 2:53 | **Cut to** terminal or code showing the FDC verifier request structure (URL, JQ transform, abiSignature) | Real-time, 5s |
| 2:58 | **Cut to** `/api/fdc/route.ts` showing the submit → poll → settle flow | 1.5x, 5s |
| 3:03 | **Cut back to arena** | Instant |

**Voiceover (50 words):**
> "Data Duels take this further. FDC Web2Json lets players bet on ANY data source — weather, sports, anything with a JSON API. The attestation flow goes through 100 independent validators. Prepare request, submit to FdcHub, wait for consensus, retrieve the Merkle proof, verify on-chain. Five steps, fully automated."

**Why this works:** "Any data source" is the Flare Bonus Track trigger phrase. "100 independent validators" — not "decentralized oracle" (too generic). Listing the 5 FDC steps proves you actually built it, not just read about it. "Merkle proof" shows cryptographic understanding.

---

### [3:10 - 3:30] CLOSE (20 seconds)

**On screen:** Arena page with settled duel results visible. Then slow zoom or fade to landing page hero section. End card with logo.

**Screen sequence:**

| Time | Screen | Speed |
|------|--------|-------|
| 3:10 | Arena page — full view with settled duel, leaderboard, price ticker all visible | Real-time, 5s |
| 3:15 | **Fade to** landing page or a clean end card: DegenDuel logo, "Built on Flare | ETH Oxford 2026", GitHub URL, Vercel URL | Static, 15s |

**Voiceover (55 words):**
> "That's DegenDuel. All three Flare enshrined protocols working together — FTSO for prices, FDC for real-world data attestation, Secure RNG for provably fair bonuses. This application is architecturally impossible on any other chain. Effect-TS orchestrates the entire off-chain pipeline. Open source, deployed on Coston2, playable right now. Built in 36 hours at ETH Oxford."

**Why this works:** This is the keyword recap. Judges write notes during videos — this gives them every checkbox in 15 seconds. "Architecturally impossible on any other chain" is the Flare money phrase. "36 hours" grounds it as a hackathon project, not vaporware. "Playable right now" invites them to try it.

---

## TOTAL VOICEOVER WORD COUNT

| Section | Words |
|---------|-------|
| Hook | 30 |
| Landing scroll | 40 |
| Arena arrives | 30 |
| Create duel | 55 |
| Player B joins | 45 |
| Countdown | 55 |
| Settlement | 65 |
| Architecture | 60 |
| FDC differentiator | 50 |
| Close | 55 |
| **TOTAL** | **485** |

At 150 WPM, this is **3 min 14 sec** of voiceover — leaves 16 seconds of breathing room for pauses and natural pacing. Perfect.

---

## KEYWORD HIT COUNT

| Audience | Keywords Hit | Where |
|----------|-------------|-------|
| **Flare Main** | "All three enshrined protocols" (x2), "FTSO v2" (x4), "FDC" (x3), "Secure RNG" (x2), "100 independent validators", "protocol-level oracle", "trustless", "permissionless", "architecturally impossible on any other chain", "Merkle proof", "zero gas cost" | Throughout |
| **Flare Bonus** | "Web2Json", "any data source", "weather/sports/JSON API", "5-step attestation flow", "FdcHub", "consensus", "Merkle proof" | 2:50-3:10 |
| **Gaming Track** | "PvP" (x2), "duel" (x6+), "90 seconds", "winner takes all", "provably fair", "leaderboard", "stake", "competitive" | Throughout |
| **Effectful** | "Effect-TS" (x3), "12 distinct effect types", "9 composable services", "typed error channels", "TaggedError", "discriminated unions", "Layer/AppLayerLive", "Effect.runPromise", "fiber cancellation", "exponential backoff", "service layer", "production not demo" | 1:35-1:55, 2:25-2:50 |

---

## RECORDING STRATEGY

### Voiceover Tips
1. **Record voiceover AFTER screen recording** — you can time it perfectly to the edit
2. **Speak slightly slower than normal** — 140 WPM feels more authoritative than 160 WPM
3. **Don't uptalk** — declarative statements, not questions
4. **Pause after key phrases** — "all three enshrined protocols" [beat] lets it land
5. **Don't say "um", "so", "basically"** — practice each section 3x before recording

### Screen Recording Tips
1. **Use OBS or QuickTime** at 1080p 60fps
2. **Pre-position windows** — Player A left half, Player B right half (or two separate recordings spliced)
3. **Slow, deliberate mouse movements** — no jittery cursor
4. **Click buttons dead center** — looks professional
5. **Wait for animations** — the framer-motion stagger is part of the polish

### Editing Tips
1. **Jump cuts at every transaction wait** — nobody needs to see MetaMask spinning
2. **The "90 SECONDS LATER" card** — make it on-brand (dark bg, neon text, Flare logo small in corner)
3. **Code snippets:** zoom to 150% so text is readable on a laptop screen
4. **Background music:** Low, ambient electronic. -12dB under voiceover. Kill music during settlement reveal.
5. **End card:** Hold 5 full seconds. Include GitHub URL and Vercel URL as text.

---

## FALLBACK PLAN

If anything breaks during recording:

1. **Transaction fails:** Use the pre-recorded backup footage. Splice at the MetaMask confirm click.
2. **Price ticker not updating:** Fine — mention "FTSO feeds update every ~90 seconds" and move on.
3. **Countdown UI glitch:** Use the jump cut anyway — the title card hides it.
4. **Settlement reverts:** Settle from debug page or Hardhat console. Cut in a clean settlement screen.
5. **RNG bonus doesn't trigger:** Say "there's a 10% chance of a 2x bonus via Secure RNG — provably fair, verifiable on-chain" and skip the visual. Or: record multiple settlements until one triggers, use that take.

---

## VOICEOVER SCRIPT (CLEAN COPY — for reading during recording)

> Every prediction market today relies on centralized oracles for settlement. DegenDuel settles trustlessly — using all three of Flare's enshrined data protocols in a single PvP game.
>
> Quick walkthrough of the landing. The game loop is simple — create a duel, predict a price direction, stake tokens, and the blockchain settles who was right. Built on Scaffold-ETH 2, Effect-TS service layer, FLock AI for strategy hints.
>
> This is the arena. Live FTSO v2 price feeds scrolling at the top — FLR, BTC, ETH, XRP, SOL. All read concurrently via Effect.all from the FtsoService. Zero gas cost.
>
> Player A selects FLR, predicts UP, stakes half a FLR. The contract locks the stake and waits for an opponent. Under the hood — the CreateDuel transaction calls the smart contract, which snapshots the current FTSO price as the entry point. That price wasn't fetched from an API — it's read directly from Flare's protocol-level oracle.
>
> Different browser, different wallet. Player B sees the open duel, takes the opposite side — DOWN — and matches the stake. The moment B joins, the contract records the FTSO start price and the 90-second clock begins. Both players are now locked in. Total pot: 1 FLR.
>
> While the duel runs, the architecture underneath is doing the heavy lifting. The entire off-chain layer is Effect-TS — 9 composable services, 12 distinct effect types. Typed error channels for every failure mode. The FDC attestation pipeline alone uses retry with exponential backoff, 10-minute timeouts, conditional polling, and fiber cancellation.
>
> Time's up.
>
> Settlement is permissionless — anyone can trigger it. The contract reads the final price from FTSO v2, compares it to the entry price, and determines the winner on-chain. No dispute resolution, no centralized oracle, no trust required. Player A called it — FLR went up. Winner takes 99% of the pot. The other 1% is protocol fee.
>
> [If RNG bonus:] And the Secure RNG triggered a 2x bonus — provably fair, verifiable randomness.
>
> Under the hood — every blockchain interaction is an explicit Effect. FtsoService, FdcService, RngService, FlockService, EventService, DuelService — all composed via Layer into a single AppLayerLive. 11 tagged error types with discriminated unions. The FDC pipeline runs server-side via Effect.runPromise in a Next.js API route. This is Effect-TS in production, not a demo.
>
> Data Duels take this further. FDC Web2Json lets players bet on ANY data source — weather, sports, anything with a JSON API. The attestation flow goes through 100 independent validators. Prepare request, submit to FdcHub, wait for consensus, retrieve the Merkle proof, verify on-chain. Five steps, fully automated.
>
> That's DegenDuel. All three Flare enshrined protocols working together — FTSO for prices, FDC for real-world data attestation, Secure RNG for provably fair bonuses. This application is architecturally impossible on any other chain. Effect-TS orchestrates the entire off-chain pipeline. Open source, deployed on Coston2, playable right now. Built in 36 hours at ETH Oxford.

---

## SILENT SCREEN RECORDING — STAGE DIRECTIONS (APP ONLY, NO CODE)

The voiceover is recorded separately and merged in post. This is just what to do on screen. No VS Code, no terminal — judges can check the GitHub repo for code.

### BEFORE YOU HIT RECORD

- Both Chrome profiles open, MetaMask on Coston2, wallets funded
- App running on `localhost:3000` (or use Vercel production URL)
- Player A connected on **landing page**
- Player B browser open to **arena page**, wallet connected
- 1920x1080, bookmark bar hidden, Do Not Disturb ON
- Slow deliberate mouse movements, click buttons dead center, wait for animations

---

### [0:00 - 0:12] HERO HOLD
- Start on landing page hero section
- **Do nothing.** No mouse, no scroll. Hold still for 12 seconds.

### [0:12 - 0:28] LANDING PAGE SCROLL
- **0:12** — Begin smooth scroll down
- **0:14** — Pause 1.5s on ProblemSection
- **0:17** — Resume scroll
- **0:19** — Pause 1.5s on HowItWorks (3-step flow)
- **0:22** — Resume scroll
- **0:24** — Pause 2s on TechShowcase (logos section)
- **0:27** — Scroll to FinalCTA, click **"Enter Arena"**

### [0:28 - 0:40] ARENA LOADS
- **0:28** — Arena page loads, let framer-motion animations play in
- **0:32** — Slowly hover mouse over the **price ticker** at the top
- **0:36** — Move mouse to **stats bar** (Duels / Settled / Volume)
- **0:40** — Rest mouse near CreateDuel form

### [0:40 - 1:10] CREATE A DUEL (Player A)
- **0:40** — Mouse to PRICE mode toggle (should already be selected)
- **0:42** — Click **FLR** asset pill
- **0:44** — Pause 2s — let "Current Price" update on screen
- **0:46** — Click **UP** prediction button
- **0:48** — Click stake input, type **0.5**
- **0:50** — Click **CHALLENGE**
- **0:52** — MetaMask popup appears
- **0:53** — Click **Confirm**
- **0:54** — **STOP** (jump cut the tx wait in editing)
- **0:56** — Resume when toast: "Duel created!"
- **0:58** — ActiveDuel panel populates: "WAITING FOR OPPONENT"
- **1:00** — Move mouse to ActiveDuel panel, hover over duel details
- **1:10** — Hold

### [1:10 - 1:35] PLAYER B JOINS
- **1:10** — **Switch to Player B's browser** (different Chrome profile)
- **1:12** — Scroll to "Open Duels" — Player A's duel visible
- **1:15** — Pause 2s on the DuelCard
- **1:17** — Click **"Accept Duel"** / **"BET DOWN"**
- **1:19** — MetaMask popup, click **Confirm**
- **1:20** — **STOP** (jump cut)
- **1:22** — Resume when toast: "Duel joined!"
- **1:24** — ActiveDuel updates to "ACTIVE", countdown starts at 90
- **1:26** — Hover mouse over countdown timer
- **1:35** — Hold on active duel view

### [1:35 - 1:55] THE COUNTDOWN
- **1:35** — Let countdown tick 5 real seconds (88... 87... 86...)
- **1:40** — **STOP** (insert "90 SECONDS LATER" title card in editing)
- **1:45** — **RESUME** when countdown is at ~5. Let it tick: 5... 4... 3... 2... 1... 0
- **1:55** — Status changes to "READY TO SETTLE"

### [1:55 - 2:25] SETTLEMENT
- **1:55** — Mouse to **"Settle Duel"** button
- **1:57** — Click it
- **1:59** — MetaMask popup, click **Confirm**
- **2:00** — **STOP** (jump cut)
- **2:03** — Resume when confetti / settlement animation plays
- **2:05** — "SETTLED" — winner shown, payout displayed
- **2:08** — Hold 5s on results (starting price, ending price, winner, payout)
- **2:13** — If "2X BONUS!" badge shows, hover over it
- **2:15** — Scroll down to **EffectPrices** component + **Leaderboard**
- **2:25** — Hold on leaderboard with updated stats

### [2:25 - 2:50] STAY ON ARENA — EFFECT PRICES + LEADERBOARD
- **2:25** — Scroll back to **EffectPrices** component, hold 3s (shows live prices, "Powered by Effect-TS" label)
- **2:28** — Slowly scroll through leaderboard entries, hold 3s
- **2:31** — Scroll back up to the settled duel result, hold 3s
- **2:34** — Hover over the price ticker again — prices still updating live
- **2:37** — Scroll to show the full arena: ActiveDuel + CreateDuel + Open Duels all visible
- **2:40** — Hover over the protocol stats bar (Duels / Settled / Volume — numbers should reflect the duel you just ran)
- **2:46** — Rest mouse near CreateDuel form

### [2:50 - 3:10] DATA DUELS — SHOW THE TOGGLE
- **2:50** — On CreateDuel form, **click the DATA mode toggle** (switch from PRICE to DATA)
- **2:53** — Pause 3s — let the form update to show data duel fields (URL input, description, etc.)
- **2:56** — Slowly hover over the data duel form fields to draw attention
- **2:59** — Hover over "API URL" or "Data Source" input field
- **3:02** — Switch back to **PRICE** mode toggle (shows it's a two-mode system)
- **3:05** — Pause on the full CreateDuel form for 5s

### [3:10 - 3:30] CLOSE
- **3:10** — Scroll up for full arena view — settled duel, price ticker, stats bar all visible
- **3:15** — **STOP** (insert end card in editing: DegenDuel logo, "Built on Flare | ETH Oxford 2026", GitHub URL, Vercel URL — hold 15s)

---

## JUMP CUTS TO MAKE IN EDITING

1. **0:54** — Cut the "Create Duel" tx wait
2. **1:20** — Cut the "Join Duel" tx wait
3. **1:40 → countdown at 5** — Insert "90 SECONDS LATER" title card
4. **2:00** — Cut the "Settle" tx wait
5. **3:15** — Insert static end card (15 seconds)

---

## TIPS

- **Mouse speed:** Slow and deliberate. No jittery cursor.
- **Button clicks:** Dead center on the button. Looks professional.
- **Animations:** Wait for framer-motion stagger to finish before moving on.
- **Two browsers:** Player A and Player B should have visibly different wallet addresses in the top right.
- **If anything breaks:** Record extra takes. You can splice the best parts in editing.
- **If RNG bonus doesn't trigger:** Record multiple settlements until one triggers, use that take. Or skip it — the voiceover mentions it either way.
