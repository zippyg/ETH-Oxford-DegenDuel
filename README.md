# DegenDuel

**PvP prediction battles settled trustlessly by Flare.**

Two players. One prediction. Settled by truth. Stake crypto and duel on anything — will BTC pump in 60 seconds, will it rain in London tomorrow, will Arsenal win tonight. Each duel is settled trustlessly by Flare's three native protocols:

- **FTSO** — crypto price duels settled by decentralized price feeds
- **FDC Web2Json** — real-world data duels (weather, sports) settled by 100-validator API attestation
- **Secure RNG** — randomized challenge selection and bonus multipliers

No middlemen. No disputes. Just verifiable truth.

## Built With

- **Flare (Coston2)** — FTSO v2, FDC Web2Json, Secure RNG
- **Scaffold-ETH 2** — Next.js + wagmi + viem frontend
- **Effect-TS** — Typed effect pipeline for oracle orchestration
- **FLock AI** — AI-powered prediction analysis
- **Solidity 0.8.25** — Smart contracts

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend   │────▶│  Effect-TS Layer  │────▶│  Smart Contract  │
│  (Next.js)   │◀────│   (Services)      │◀────│  (Coston2)       │
└─────────────┘     └──────────────────┘     └─────────────────┘
                           │                        │
                    ┌──────┴──────┐          ┌──────┴──────┐
                    │  FLock AI   │          │ FTSO│FDC│RNG │
                    └─────────────┘          └─────────────┘
```

## Quick Start

```bash
# Install dependencies
yarn install

# Start local dev
yarn start

# Deploy to Coston2
yarn deploy --network coston2
```

## Bounty Submissions

- **Flare Main Track** — Multi-protocol prediction game using FTSO + FDC + RNG
- **Flare Bonus Track** — Best FDC use case + All 3 protocols
- **Effectful Programming** — Effect-TS typed pipeline with 10+ effect types
- **Main Track: Gaming & Social**

## Team

Built at ETH Oxford 2026.

## Flare Developer Experience Feedback

_To be completed after build._
