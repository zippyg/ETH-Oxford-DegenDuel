# DegenDuel — All Submission Copy (Ready to Paste)
## ETH Oxford 2026

All text below is finalized and ready to paste into DoraHacks, TAIKAI, and Mintycode submission forms.

---

## COMMON FIELDS (Same Across All Platforms)

**Project Name:** DegenDuel

**Tagline:**
```
PvP prediction duels with trustless settlement via Flare's enshrined data protocols
```

**GitHub Repository:**
```
https://github.com/zippyg/ETH-Oxford-DegenDuel
```

**Live Demo URL:**
```
https://degenduel-zains-projects-5be3a7a8.vercel.app
```

**Demo Video:**
```
https://www.youtube.com/watch?v=PLACEHOLDER
```
> Replace PLACEHOLDER with your YouTube video ID after uploading.

**Deployed Contract Address:**
```
0x835574875C1CB9003c1638E799f3d7c504808960
```

**Block Explorer:**
```
https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960
```

**Network:**
```
Flare Coston2 Testnet (Chain ID: 114)
```

**Technologies:**
```
Solidity, Flare, FTSO v2, FDC Web2Json, Secure RNG, Effect-TS, Next.js, TypeScript, Hardhat, Scaffold-ETH 2, wagmi, viem, DaisyUI, FLock AI
```

---

## 1. DORAHACKS BUIDL SUBMISSION

**URL:** https://dorahacks.io/hackathon/ethoxford26/detail
**Password:** `ETH-Oxford-26`

### Track Selection

| Field | Selection |
|-------|-----------|
| Main Track | **Decentralised Gaming and Social Media** |
| Sponsor Track 1 | **Flare** |
| Sponsor Track 2 | **Rabot - Effectful Programming** |

**Flare Submission Note (add to description):**
> Submitting to BOTH Flare Main Track ($5k/$2k/$1k) and Flare Bonus Track ($1k x2 — most innovative external data source use case).

### Short Description (paste into short description field)

```
DegenDuel is a PvP prediction game where two players stake equal amounts and make opposing predictions about real-world outcomes — crypto prices, weather, sports. Flare's 100 independent validators settle duels trustlessly using FTSO v2 (price feeds), FDC Web2Json (external API attestation), and Secure RNG (provable fairness). Built with Scaffold-ETH 2, Effect-TS, and Next.js.
```

### Full Description (paste into long description field)

```markdown
## Elevator Pitch

Every prediction market today relies on centralized oracles to determine winners. **DegenDuel** is the first PvP prediction game where you bet on anything — crypto prices, weather, sports scores — and **Flare's 100 independent validators settle it trustlessly**. All three Flare protocols. Zero middlemen.

## What It Does

Two players enter a duel by staking equal amounts of C2FLR. They make opposing predictions about near-term real-world outcomes. The blockchain itself verifies who won using:

- **FTSO v2** for cryptocurrency price duels (instant, free settlement)
- **FDC Web2Json** for arbitrary real-world data (weather, sports, any API with cryptographic proof)
- **Secure RNG** for provably fair bonus multipliers (10% chance of 2x payout)

Winner takes the pot. No manual arbitration. No trust required.

## How We Built It

### Smart Contracts (Solidity 0.8.20)
- Deployed to Flare Coston2 testnet: `0x835574875C1CB9003c1638E799f3d7c504808960`
- Integrates all 3 Flare enshrined protocols via ContractRegistry
- Price duels settle in ~2 seconds via FTSO v2 view calls (zero gas for reads)
- Data duels settle via FDC Merkle proof verification on-chain
- Secure RNG generates verifiable randomness for bonus payouts

### Off-Chain Pipeline (Effect-TS v3.19)
- 12 distinct Effect types across 9 service files
- Full service/layer architecture with Context.Tag dependency injection
- Orchestrates 5-step FDC attestation pipeline:
  1. POST to Flare Verifier with API URL + JQ filter
  2. Submit on-chain to FdcHub
  3. Wait for CCCR consensus across 100 validators
  4. Retrieve Merkle proof from DA Layer
  5. Submit settlement transaction with proof
- Typed error channels: 11 TaggedError types with discriminated unions
- Production runtime via Effect.runPromise in Next.js API routes

### Frontend (Next.js 15 + wagmi)
- Scaffold-ETH 2 base with custom DegenDuel components
- Live FTSO price ticker (5 feeds: FLR, BTC, ETH, XRP, SOL)
- Real-time duel updates, countdown timers, settlement confetti
- Dark neon cyberpunk theme with DaisyUI + Framer Motion
- Wallet connection via RainbowKit

### AI Integration (FLock.io)
- Qwen3-30B model provides strategy hints via FLock API
- Duel outcome analysis and recommendations
- Graceful fallback if API unavailable

## Why Flare?

This application is architecturally impossible on any other blockchain. It requires three capabilities enshrined at the protocol level: decentralized price oracles, trustless Web2 data attestation, and verifiable randomness. On Ethereum you'd need Chainlink + API3 + Chainlink VRF — three separate trust assumptions. On Flare, it's zero.

## Challenges

1. **FDC complexity:** 5-step async workflow with 3-8 minute finalization. Debugging requires patience.
2. **Proof structure mapping:** Converting DA Layer JSON to `IWeb2Json.Proof` struct required careful ABI encoding.
3. **Effect-TS architecture:** Modeling 12 distinct effect types for blockchain interactions.

## Accomplishments

- All 3 Flare protocols integrated and working together
- End-to-end FDC pipeline (successfully attested Bitcoin price from Blockchain.info API)
- 12 Effect-TS effect types in production service/layer architecture
- Deployed, verified, and live on Coston2 testnet + Vercel

**Flare Submission Note:** Submitting to BOTH Main Track ($5k/$2k/$1k) and Bonus Track ($1k x2).
```

---

## 2. TAIKAI SUBMISSION (Main Track)

**URL:** https://taikai.network/en/home-dao/hackathons/ethoxford
**Track:** Decentralised Gaming and Social Media

Use the same Short Description and Full Description from DoraHacks above.

---

## 3. MINTYCODE — FLARE SPONSOR BOUNTY

**URL:** https://mintycode.io/hackathon/eth-oxford
**Bounty:** Flare — Best Use of Flare Protocols ($5k/$2k/$1k Main + $1k x2 Bonus)

### Submission Title
```
DegenDuel - PvP Prediction Duels with Trustless Settlement
```

### Submission Description (paste this)

```
DegenDuel is a PvP prediction duel game that uses ALL THREE of Flare's enshrined data protocols for trustless settlement. Players create opposing predictions on crypto prices or real-world data, stake C2FLR, and the blockchain itself determines the winner.

**Flare Protocols Used:**

1. **FTSO v2** — Real-time price settlement for crypto duels (BTC, ETH, FLR, XRP, SOL). Live price ticker reads 5 feeds simultaneously via getPrices(). Zero gas cost for reads on Coston2.

2. **FDC Web2Json** — External API data attestation for data duels. Full 5-step pipeline: prepare request -> submit to FdcHub -> wait for CCCR consensus across 100 validators -> retrieve Merkle proof from DA Layer -> verify on-chain via IFdcVerification.verifyWeb2Json().

3. **Secure RNG** — Provably fair 10% bonus multiplier on settlement. RandomNumberV2Interface provides verifiable randomness for 2x pot payouts.

**Technical Highlights:**
- Smart contract deployed on Coston2: 0x835574875C1CB9003c1638E799f3d7c504808960
- Effect-TS service layer with 12 distinct effect types
- Cyberpunk dark UI with live FTSO price ticker, countdown timers
- FLock AI integration for strategy hints

**Why Flare:** DegenDuel literally cannot exist on any other blockchain. No other chain has enshrined protocols for decentralized price feeds AND arbitrary Web2 data attestation AND secure randomness.

**Flare Submission Note:** Submitting to BOTH Main Track and Bonus Track (most innovative external data source use case — FDC Web2Json enables predictions on ANY Web2 API).

Repo: https://github.com/zippyg/ETH-Oxford-DegenDuel
Live: https://degenduel-zains-projects-5be3a7a8.vercel.app
```

---

## 4. MINTYCODE — EFFECTFUL PROGRAMMING BOUNTY

**Bounty:** Rabot — Effectful Programming ($1k / $500)

### Submission Title
```
DegenDuel - 12 Effect Types in Production DApp
```

### Submission Description (paste this)

```
DegenDuel's off-chain service layer demonstrates 12 distinct Effect-TS types in a real production blockchain application. The entire backend pipeline — from FTSO price streaming to FDC attestation to AI strategy hints — is built as composable Effect services with typed errors, retry logic, streaming, and resource management.

**12 Effect Types Demonstrated:**

| # | Effect Type | Where Used | Purpose |
|---|------------|------------|---------|
| 1 | Network I/O (Effect.tryPromise) | All services | HTTP calls to Flare APIs |
| 2 | Typed Errors (Data.TaggedError) | errors.ts | 11 distinct error types |
| 3 | Timeout (Effect.timeout) | FlockService (10s), FdcService (10min) | Bounded async operations |
| 4 | Retry/Backoff (Schedule.exponential) | FdcService, FtsoService | Exponential backoff |
| 5 | Concurrency (Effect.all parallel) | FtsoService.getMultiplePrices | Parallel price feed reads |
| 6 | Streaming (Stream) | FtsoService.streamPrices, EventService | Real-time price/event streams |
| 7 | Configuration (Context.Tag) | ConfigService | Dependency-injected config |
| 8 | Logging (Effect.logInfo) | All services | Structured logging |
| 9 | Scheduling (Schedule.spaced) | EventService, FtsoService | Polling intervals |
| 10 | Resource Management (Effect.acquireRelease) | EventService | WebSocket lifecycle |
| 11 | State (Ref) | DuelService | Pipeline state tracking |
| 12 | Cancellation (Fiber.interrupt) | DuelService | Cancel long-running attestations |

**Architecture:**
- 9 service files composing into AppLayerLive via Layer.mergeAll
- Full service/layer pattern with Context.Tag dependency injection
- Error types are TaggedError with discriminated unions
- FDC pipeline: 4-step attestation (all Effect-based with retries + timeouts)
- Production runtime: Effect.runPromise in Next.js API routes (not just types)

**EFFECT.md:** Full documentation with line-number references: https://github.com/zippyg/ETH-Oxford-DegenDuel/blob/main/EFFECT.md

**Why This Matters:**
This isn't "we imported Effect and used tryPromise." The FDC attestation pipeline alone uses 6 different effect types. Service composition, resource management, cancellation, streaming, and typed errors all work together in a real blockchain application.

Repo: https://github.com/zippyg/ETH-Oxford-DegenDuel
```

---

## 5. YOUTUBE VIDEO METADATA

### Demo Video (3.5 min, unlisted)

**Title:**
```
DegenDuel — PvP Prediction Duels on Flare | ETH Oxford 2026 Demo
```

**Description:**
```
DegenDuel is a PvP prediction game built on Flare Network for ETH Oxford 2026.

Two players stake equal amounts and make opposing predictions about crypto prices or real-world data. The blockchain settles trustlessly using Flare's enshrined data protocols:
- FTSO v2 for real-time price feeds
- FDC Web2Json for external API attestation
- Secure RNG for provably fair bonus payouts

Built with Scaffold-ETH 2, Effect-TS, Next.js, and FLock AI.

Live App: https://degenduel-zains-projects-5be3a7a8.vercel.app
GitHub: https://github.com/zippyg/ETH-Oxford-DegenDuel
Contract: https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960

Deployed on Flare Coston2 Testnet (Chain ID: 114)

#ETHOxford #Flare #FTSO #FDC #EffectTS #Web3 #Hackathon #PredictionMarket #DeFi #Gaming
```

**Visibility:** Unlisted
**Tags:** ETH Oxford, Flare, FTSO, FDC, Web2Json, Effect-TS, Prediction Market, PvP, Gaming, Hackathon, 2026, Scaffold-ETH

### Promo Video (45s Remotion, unlisted)

**Title:**
```
DegenDuel — 45s Promo | ETH Oxford 2026
```

**Description:**
```
45-second promotional trailer for DegenDuel — a PvP prediction duel game built on Flare Network at ETH Oxford 2026.

Full demo: [link to demo video]
Live App: https://degenduel-zains-projects-5be3a7a8.vercel.app
GitHub: https://github.com/zippyg/ETH-Oxford-DegenDuel

#ETHOxford #Flare #Web3 #Hackathon
```

**Visibility:** Unlisted

---

## SUBMISSION CHECKLIST

### DoraHacks
- [ ] Account created (Google/GitHub login)
- [ ] Password: `ETH-Oxford-26`
- [ ] Project name: DegenDuel
- [ ] Short description pasted
- [ ] Full description pasted (markdown)
- [ ] GitHub URL: `https://github.com/zippyg/ETH-Oxford-DegenDuel`
- [ ] Demo video URL pasted
- [ ] Live demo URL: `https://degenduel-zains-projects-5be3a7a8.vercel.app`
- [ ] Contract: `0x835574875C1CB9003c1638E799f3d7c504808960`
- [ ] Main track: **Decentralised Gaming and Social Media**
- [ ] Sponsor tracks: **Flare** + **Rabot**
- [ ] Flare note added: "Submitting to BOTH Main Track and Bonus Track"
- [ ] Team info filled
- [ ] Preview checked, submitted

### TAIKAI
- [ ] Account created
- [ ] Same content pasted from DoraHacks
- [ ] Track: Decentralised Gaming and Social Media
- [ ] Submitted

### Mintycode — Flare Bounty
- [ ] Account created
- [ ] Flare submission description pasted
- [ ] Links added (repo, demo, contract)
- [ ] Note: "Main Track + Bonus Track"
- [ ] Submitted

### Mintycode — Effectful Programming Bounty
- [ ] Effectful Programming description pasted
- [ ] EFFECT.md link included
- [ ] Links added (repo)
- [ ] Submitted

### YouTube
- [ ] Demo video uploaded (unlisted)
- [ ] Title + description pasted
- [ ] Tags added
- [ ] Video ID copied
- [ ] README updated with video ID
- [ ] DoraHacks updated with video URL
- [ ] Promo video uploaded (unlisted) — optional

---

## POST-SUBMISSION

After all submissions are in:
1. Replace all `PLACEHOLDER` values in README with actual YouTube video IDs
2. Commit and push to GitHub
3. Verify all links work (repo is public, video plays, Vercel loads)
4. Take screenshots of all submission confirmations
