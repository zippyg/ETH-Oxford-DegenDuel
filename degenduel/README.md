# ⚔️ DegenDuel

> **PvP Prediction Duels with Trustless Settlement via Flare's Enshrined Data Protocols**

Built for **ETH Oxford 2026** | Powered by [Flare Network](https://flare.network)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Effect-TS](https://img.shields.io/badge/Effect--TS-3.0-purple.svg)](https://effect.website/)

---

## 🎯 Elevator Pitch

Every prediction market today relies on centralized oracles to determine winners. **DegenDuel** is the first PvP prediction game where you bet on anything—crypto prices, weather, sports scores—and **Flare's 100 independent validators settle it trustlessly**. All three Flare protocols. Zero middlemen.

Two players enter a duel by staking equal amounts. They make opposing predictions about near-term real-world outcomes. **The blockchain itself verifies who won** using decentralized price feeds, Web2 data attestation, and provably fair randomness.

---

## 🎥 Demo

[![DegenDuel Promo](https://img.youtube.com/vi/PLACEHOLDER/maxresdefault.jpg)](https://www.youtube.com/watch?v=PLACEHOLDER)

**📺 [Watch the demo video](https://www.youtube.com/watch?v=PLACEHOLDER)** | **🎬 [Promo reel (45s Remotion video)](https://www.youtube.com/watch?v=PLACEHOLDER)**

<!-- Replace PLACEHOLDER with your actual YouTube video IDs after uploading -->

---

## ✨ Key Features

### 🔮 **Two Duel Types**

1. **Price Duels** - Predict cryptocurrency prices
   - "Will BTC be above $100K in 1 hour?"
   - Settles via **FTSO v2** (Fast Price Feeds) in ~2 seconds
   - Free gas for price reads on Coston2 testnet

2. **Data Duels** - Predict real-world events
   - "Will it rain in London today?"
   - "Will Team A win the match?"
   - Settles via **FDC Web2Json** with cryptographic proof from 100 validators
   - Any Web2 API can be attested on-chain (3-8 minute finalization)

### 🎲 **Provably Fair**
- Secure RNG for bonus multipliers (10% chance of 2x pot)
- All randomness verifiable on-chain via Flare's commit-reveal protocol

### ⚡ **Instant Settlement**
- No manual arbitration
- No trust required in game operators
- Winner determined by blockchain consensus

### 🏛️ **Decentralized Architecture**
- **Off-chain:** Effect-TS service/layer architecture (12 distinct effect types)
- **On-chain:** Solidity smart contracts on Flare Coston2 testnet
- **Data:** Trustless Web2 data via FDC, real-time prices via FTSO

---

## 🏗️ Architecture

```
┌─────────────────────┐       ┌──────────────────────┐       ┌─────────────────────┐
│                     │       │                      │       │                     │
│   FRONTEND          │◄─────►│   EFFECT-TS          │◄─────►│   SMART CONTRACTS   │
│   (Next.js)         │       │   PIPELINE           │       │   (Coston2)         │
│   + wagmi + viem    │       │   (Off-Chain)        │       │                     │
│                     │       │                      │       │                     │
└─────────────────────┘       └──────────────────────┘       └─────────────────────┘
         │                             │                               │
         │                             │                               │
         │                    ┌────────┴────────┐           ┌──────────┴──────────┐
         │                    │                 │           │                     │
         │              ┌─────┴─────┐           │      ┌────┴────┐  ┌──────┐  ┌──────┐
         │              │           │           │      │         │  │      │  │      │
         │         FDC Verifier  FLock AI       │    FTSO v2  FDC    RNG
         │         (Web2Json)  (Strategy)       │      │      Verif   │
         │              │           │           │      │         │    │
         └──────────────┴───────────┴───────────┘      │         │    │
                                                        │         │    │
                                                   100+ Data   100+  Protocol
                                                   Providers  Nodes   Level
```

### **Data Flow: Price Duel**

```
1. Player A creates: "BTC above $100K at 3pm" → stake C2FLR
2. Player B joins with opposite prediction → stake equal C2FLR
3. Both stakes locked in contract escrow
4. At deadline: settlePriceDuel(duelId)
   ├─→ Contract reads TestFtsoV2Interface.getFeedById(BTC_USD)
   ├─→ Gets live price from 100+ data providers
   ├─→ Compares price vs threshold
   └─→ Winner receives pot (minus 1% protocol fee)
```

### **Data Flow: Data Duel**

```
1. Player A creates: "Will it rain in London?" → stake C2FLR
2. Player B joins with opposite prediction → stake equal C2FLR
3. Off-chain Effect-TS pipeline:
   ├─→ POST to Flare Verifier /Web2Json/prepareRequest
   ├─→ Submit to FdcHub.requestAttestation() (pay ~0.01 C2FLR fee)
   ├─→ Wait 3-8 minutes for CCCR consensus (Collect→Choose→Commit→Reveal)
   ├─→ Retrieve Merkle proof from DA Layer
   └─→ Call settleDataDuel(duelId, proof)
4. Contract verifies proof via IFdcVerification.verifyWeb2Json()
5. Winner receives pot based on attested data
```

---

## 🔥 Built on Flare

### **Project Overview**

- **Network:** Flare Coston2 Testnet (Chain ID: 114)
- **Integrations:** FTSO v2 (price feeds), FDC Web2Json (external API attestation), Secure RNG (randomness)
- **Demo:** [Live App](https://degenduel-zains-projects-5be3a7a8.vercel.app) | [Demo Video](https://www.youtube.com/watch?v=PLACEHOLDER)
- **Setup:** See [Quick Start](#-quick-start) below
- **Deployed Contract:** [`0x835574875C1CB9003c1638E799f3d7c504808960`](https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960)

DegenDuel uses **all three** of Flare's enshrined data protocols in production to enable trustless settlement of arbitrary real-world predictions. This is the only blockchain where such a game is possible.

---

### **1. FTSO v2 (Fast Price Feeds)**

**What we use it for:** Real-time cryptocurrency price settlement for price-based duels.

**Integration:**
```solidity
import { TestFtsoV2Interface } from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

function settlePriceDuel(uint256 duelId) external {
    TestFtsoV2Interface ftsoV2 = ContractRegistry.getTestFtsoV2();
    (uint256 price, int8 decimals, uint64 timestamp) = ftsoV2.getFeedById(BTC_USD_FEED_ID);

    // Determine winner based on price vs threshold
    // ...
}
```

**Developer Experience:**
- ✅ **Excellent:** Free view calls on Coston2 testnet (no gas for reads)
- ✅ **Simple:** One function call returns price + decimals + timestamp
- ✅ **Reliable:** Updates every ~1.8 seconds (block-latency feeds from 100+ providers)
- ✅ **Well-documented:** Feed IDs clearly listed in [Flare docs](https://dev.flare.network/ftso/overview)

**Challenge:** Feed IDs are `bytes21` (not `bytes32`), which is unusual but documented in periphery contracts.

---

### **2. FDC Web2Json (External API Attestation)**

**What we use it for:** Trustless verification of real-world data from Web2 APIs (weather, sports scores, Bitcoin price) to settle data-based duels.

**The 5-Step Pipeline:**

```typescript
// 1. Prepare Request (Effect-TS pipeline)
const prepareAttestation = Effect.gen(function* () {
  const response = yield* HttpClient.post(FDC_VERIFIER_URL, {
    attestationType: "Web2Json",
    sourceId: "WEB",
    requestBody: {
      url: "https://api.weather.com/london",
      jsonQuery: "{ isRaining: .current.rain > 0 }"
    }
  });

  // 2. Submit On-Chain
  yield* submitToFdcHub(response.abiEncodedRequest);

  // 3. Wait for Finalization (3-8 minutes)
  yield* Effect.sleep(Duration.minutes(5));

  // 4. Retrieve Proof from DA Layer
  const proof = yield* fetchMerkleProof(votingRoundId);

  // 5. Verify On-Chain
  yield* settleDataDuel(duelId, proof);
});
```

**Solidity Verification:**
```solidity
import { IWeb2Json } from "@flarenetwork/flare-periphery-contracts/coston2/IWeb2Json.sol";
import { IFdcVerification } from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";

function settleDataDuel(uint256 duelId, IWeb2Json.Proof calldata proof) external {
    require(ContractRegistry.getFdcVerification().verifyWeb2Json(proof), "Invalid proof");

    uint256 attestedValue = abi.decode(proof.data.responseBody.abiEncodedData, (uint256));
    // Settle duel based on attested value...
}
```

**Developer Experience:**
- ✅ **Powerful:** Can attest ANY Web2 API data on-chain with cryptographic proof
- ✅ **Well-architected:** ContractRegistry pattern makes addresses dynamic
- ✅ **Testnet-friendly:** Default API key works (`00000000-0000-0000-0000-000000000000`)
- ⚠️ **Complex:** 5-step async workflow with 3 external dependencies
- ⚠️ **Long feedback cycle:** 5-8 minute wait for proof finalization makes debugging slow
- ⚠️ **Silent failures:** Malformed JQ filters only discovered after 5-8 minute wait

**What worked well:**
- Blockchain.info API (`https://blockchain.info/ticker`) is whitelisted on testnet
- JQ filter syntax is standard and powerful: `{ value: .USD.last }`
- [Systems Explorer](https://coston2-systems-explorer.flare.rocks) provides real-time visibility into voting rounds

**What was challenging:**
- **Proof structure mapping:** Converting DA layer JSON to `IWeb2Json.Proof` struct required careful field mapping
- **Timing calculation:** `votingRoundId = floor((timestamp - FIRST_VOTING_ROUND_START) / 90)` is critical but not prominent in docs
- **API whitelist discovery:** No public list of whitelisted APIs on testnet

**Recommended improvements:**
1. Add voting round ID calculation formula to main FDC docs
2. Publish list of whitelisted testnet APIs
3. Return specific errors for malformed JQ filters (currently generic "VALID")
4. Provide TypeScript SDK for proof retrieval from DA layer

---

### **3. Secure RNG (Random Number Generation)**

**What we use it for:** Provably fair bonus multipliers (10% chance of 2x pot payout).

**Integration:**
```solidity
import { RandomNumberV2Interface } from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

function settleDuel(uint256 duelId) internal {
    RandomNumberV2Interface rng = ContractRegistry.getRandomNumberV2();
    (uint256 randomNumber, bool isSecure, uint256 timestamp) = rng.getRandomNumber();
    require(isSecure, "Random number not secure");

    bool bonusTriggered = (randomNumber % 100) < 10; // 10% chance
    if (bonusTriggered) {
        potAmount = potAmount * 2; // Double the pot!
    }
}
```

**Developer Experience:**
- ✅ **Trivial to integrate:** Single view function call, no transactions needed
- ✅ **Free:** No gas cost to read
- ✅ **Secure by default:** `isSecure` flag tells you if commit-reveal succeeded
- ✅ **Perfect for games:** Updates every 90 seconds, deterministic but unpredictable

**Challenge:** Same random number for all callers in a 90-second window. For high-stakes use cases, combine with `block.prevrandao` or contract-level commit-reveal.

---

### **Performance & Reliability**

| Operation | Latency | Cost (Coston2 Testnet) |
|-----------|---------|------------------------|
| Create Duel | ~2 seconds | ~0.003 C2FLR gas + stake |
| Join Duel | ~2 seconds | ~0.002 C2FLR gas + stake |
| FTSO Settlement | ~2 seconds | ~0.002 C2FLR gas (FREE via view) |
| FDC Attestation Request | 3-8 minutes | ~0.01 C2FLR fee |
| FDC Settlement | ~5 seconds | ~0.004 C2FLR gas |
| RNG Check | Instant | FREE (view call) |

**Note:** On Flare mainnet, FTSO reads require fee payment. On Coston2, `TestFtsoV2Interface` makes them free `view` functions.

---

### **Why Flare Is Uniquely Suited for DegenDuel**

**The core problem:** Prediction markets need trustless settlement on arbitrary real-world outcomes. Traditional blockchains cannot access external data without centralized oracles.

**Flare's solution:**
1. **FTSO v2:** Decentralized price feeds from 100+ data providers with sub-2-second updates
2. **FDC Web2Json:** Arbitrary Web2 API data on-chain with cryptographic Merkle proofs
3. **Secure RNG:** Provably fair randomness for game mechanics

**Why this matters:** DegenDuel **literally cannot exist** on Ethereum, Solana, or any other chain. Flare is the **only blockchain** with enshrined protocols for trustless Web2 data attestation. This isn't "we could use Chainlink"—this is 100 validators independently fetching and verifying data at the protocol level.

---

### **Team Feedback**

**What we loved:**
- The vision of "Blockchain for Data" is compelling and technically sound
- All three protocols work as advertised on Coston2
- ContractRegistry pattern eliminates hardcoded addresses
- Testnet is stable and well-funded (faucet works reliably)
- DevRel team is accessible and helpful

**What surprised us (positively):**
- FTSO updates are genuinely sub-2-second (measured ~1.8s average)
- FDC consensus actually works—we successfully attested real BTC price data
- Web2Json is POWERFUL—arbitrary JQ transformations unlock creative use cases

**What we learned:**
- FDC is not "fire and forget"—must architect for 5-8 minute async workflows
- Debugging FDC requires patience and [Systems Explorer](https://coston2-systems-explorer.flare.rocks) monitoring
- Flare's cross-chain vision (Protocol Managed Wallets) positions it as infrastructure, not just another L1

**Would we build on Flare again?** Absolutely. For any application requiring real-world data settlement—insurance, prediction markets, reputation systems—Flare is the only credible option.

---

## 🚀 Quick Start

### **Prerequisites**

- [Node.js](https://nodejs.org/) (v20.18.3+)
- [Yarn](https://yarnpkg.com/) (v1 or v2+)
- [Git](https://git-scm.com/)
- Wallet with Coston2 C2FLR tokens: [Flare Faucet](https://faucet.flare.network/coston2)

### **Installation**

```bash
# Clone the repository
git clone https://github.com/zippyg/ETH-Oxford-DegenDuel.git
cd degenduel

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Add your deployer private key and RPC URLs to .env
```

### **Deploy Smart Contract**

```bash
cd packages/hardhat

# Deploy to Coston2 testnet
yarn deploy --network coston2

# Verify on block explorer
yarn verify --network coston2
```

### **Run Frontend**

```bash
cd packages/nextjs

# Start development server
yarn dev

# Visit http://localhost:3000
```

### **Test FDC Pipeline**

```bash
cd packages/hardhat

# 1. Check setup
yarn hardhat run scripts/check-setup.ts --network coston2

# 2. Create a data duel
yarn hardhat run scripts/create-data-duel.ts --network coston2

# 3. Run full FDC attestation + settlement
yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- <duelId>
```

See [`packages/hardhat/QUICK_START.md`](packages/hardhat/QUICK_START.md) for detailed instructions.

---

## 📁 Project Structure

```
degenduel/
├── packages/
│   ├── hardhat/               # Smart contracts + deployment
│   │   ├── contracts/
│   │   │   └── DegenDuel.sol  # Main game contract
│   │   ├── deploy/
│   │   │   └── 00_deploy_degen_duel.ts
│   │   ├── scripts/           # FDC pipeline scripts
│   │   └── test/
│   │
│   └── nextjs/                # Frontend application
│       ├── app/               # Next.js App Router
│       │   ├── page.tsx       # Dashboard (duels arena)
│       │   ├── create/        # Create duel page
│       │   ├── duel/[id]/     # Individual duel detail
│       │   ├── my-duels/      # User's duel history
│       │   ├── leaderboard/   # On-chain leaderboard
│       │   └── api/fdc/       # FDC server-side route
│       ├── components/
│       │   └── degenduel/     # DegenDuel-specific components
│       └── services/
│           └── effectServices/ # Effect-TS service layer
│
├── README.md                  # This file
└── .env.example               # Environment template
```

---

## 🛠️ Tech Stack

### **Blockchain**
- **Network:** [Flare Coston2 Testnet](https://coston2-explorer.flare.network/) (Chain ID: 114)
- **Smart Contracts:** Solidity 0.8.20+
- **Framework:** [Hardhat](https://hardhat.org/)
- **Flare Periphery:** [@flarenetwork/flare-periphery-contracts](https://www.npmjs.com/package/@flarenetwork/flare-periphery-contracts) v0.1.38+

### **Frontend**
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Web3 Libraries:** [wagmi](https://wagmi.sh/) + [viem](https://viem.sh/)
- **Wallet Connection:** [RainbowKit](https://www.rainbowkit.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)

### **Off-Chain Pipeline**
- **Effect System:** [Effect-TS](https://effect.website/) v3.0+
- **12 Effect Types:** Network I/O (tryPromise), Typed Errors (TaggedError), Timeout, Retry/Backoff (Schedule.exponential), Concurrency (Effect.all), Streaming (Stream), Configuration (Context.Tag), Logging (logInfo), Scheduling (Schedule.spaced), Resource Management (acquireRelease), State (Ref), Cancellation (Fiber.interrupt)
- **Architecture:** Service/Layer pattern with dependency injection

### **AI Integration** *(Optional)*
- **Provider:** [FLock.io](https://flock.io/)
- **Model:** Qwen3-30B-A3B-Instruct
- **Usage:** Strategy hints and duel outcome analysis

---

## 🎮 How to Play

### **1. Create a Duel**

Choose your duel type:
- **Price Duel:** "Will BTC be above $100K at 3pm today?"
- **Data Duel:** "Will it rain in London today?" (or any Web2 API data)

Set your prediction, stake amount, and deadline.

### **2. Wait for Opponent**

Another player joins with the **opposite** prediction and **equal** stake.

Both stakes are locked in the smart contract escrow.

### **3. Automatic Settlement**

At the deadline:
- **Price Duels:** Contract reads FTSO v2 price feeds → instant settlement
- **Data Duels:** Off-chain pipeline requests FDC attestation → settlement after proof verification (~5-10 min)

### **4. Winner Takes Pot**

Winner receives:
- Their stake back
- Opponent's stake
- Minus 1% protocol fee

**Bonus:** 10% chance of 2x pot via Secure RNG! 🎲

---

## 🔗 Important Links

### **Deployed Contract**
- **Address:** [`0x835574875C1CB9003c1638E799f3d7c504808960`](https://coston2-explorer.flare.network/address/0x835574875C1CB9003c1638E799f3d7c504808960)
- **Network:** Flare Coston2 Testnet (Chain ID: 114)
- **Block Explorer:** [Coston2 Explorer](https://coston2-explorer.flare.network/)

### **Flare Resources**
- **Developer Hub:** [dev.flare.network](https://dev.flare.network)
- **FDC Documentation:** [dev.flare.network/fdc](https://dev.flare.network/fdc)
- **FTSO Documentation:** [dev.flare.network/ftso](https://dev.flare.network/ftso)
- **Systems Explorer:** [coston2-systems-explorer.flare.rocks](https://coston2-systems-explorer.flare.rocks)
- **Telegram:** [@FlareNetwork](https://t.me/FlareNetwork)

### **Project Resources**
- **Repository:** [github.com/zippyg/ETH-Oxford-DegenDuel](https://github.com/zippyg/ETH-Oxford-DegenDuel)
- **Live App:** [degenduel-zains-projects-5be3a7a8.vercel.app](https://degenduel-zains-projects-5be3a7a8.vercel.app)
- **Demo Video:** Available in submission

---

## ⚡ Effect-TS Runtime Integration

DegenDuel demonstrates production server-side Effect-TS execution via a custom Next.js API route.

### **Server-Side Effect Orchestration**

The `/api/ftso-prices` route uses `Effect.runPromise()` to execute the FtsoService server-side, proving Effect-TS is **not just a frontend abstraction** but runs in production on the server.

**Key Effect-TS patterns demonstrated:**
- **Layer composition:** `ConfigServiceLive` + `FtsoServiceLive` dependency injection
- **Effect.gen:** Sequential async operations with type-safe error handling
- **Effect.runPromise:** Server-side runtime execution of Effect programs
- **Concurrent operations:** `Effect.all` to read multiple FTSO feeds in parallel
- **Retry strategies:** Exponential backoff with 3 retries on RPC failures

**API Route:** [`packages/nextjs/app/api/ftso-prices/route.ts`](packages/nextjs/app/api/ftso-prices/route.ts)

### **How to Test**

```bash
# Start the Next.js dev server
cd packages/nextjs
yarn dev

# In another terminal, call the API route
curl http://localhost:3000/api/ftso-prices
```

**Expected Response:**
```json
{
  "success": true,
  "timestamp": 1738961234567,
  "prices": [
    {
      "feedId": "0x01464c522f55534400000000000000000000000000",
      "value": "123456789",
      "decimals": 5,
      "timestamp": 1738961230,
      "formatted": 1234.56789
    },
    // ... BTC/USD, ETH/USD, XRP/USD, SOL/USD
  ],
  "meta": {
    "effectRuntime": "Effect.runPromise",
    "feedCount": 5,
    "chain": "Coston2 Testnet (Chain ID 114)"
  }
}
```

### **Why Server-Side?**

Effect-TS excels at orchestrating complex async workflows with:
- Type-safe error handling (12 distinct error types in DegenDuel)
- Composable retry/timeout policies
- Resource management (automatic cleanup)
- Structured concurrency (cancellation-safe)

The FDC attestation pipeline (5-step workflow with 3-8 minute async wait) is where Effect-TS truly shines.

---

## 🧪 Testing

```bash
# Run smart contract tests
cd packages/hardhat
yarn hardhat:test

# Run frontend tests (if configured)
cd packages/nextjs
yarn test
```

---

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Built For

**ETH Oxford 2026 Hackathon**
- **Main Track:** Decentralised Gaming and Social Media
- **Sponsor Tracks:** Flare Network, Rabot (Effectful Programming)

---

## 👥 Team

Built by **Zain** at ETH Oxford 2026

- **GitHub:** [@zippyg](https://github.com/zippyg)
- **Twitter:** [@zippyg](https://twitter.com/zippyg)

---

## 🙏 Acknowledgments

- **Flare Network** for enshrined data protocols and DevRel support
- **Scaffold-ETH 2** for the excellent development framework
- **ETH Oxford 2026** for hosting an incredible hackathon
- **Effect-TS community** for functional programming patterns

---

<div align="center">

**⚔️ DegenDuel - Trustless Predictions, Provable Fairness**

Built with 💜 on [Flare Network](https://flare.network)

[📖 Flare Docs](https://dev.flare.network) • [💬 Flare Discord](https://discord.gg/UxVG7ZtfuJ)

</div>
