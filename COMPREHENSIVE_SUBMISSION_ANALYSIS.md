# Comprehensive Submission Analysis - ETH Oxford 2026
**Date:** 2026-02-07 (Saturday Night)
**Deadline:** Sunday 12:00 noon (13 hours remaining)

---

## ⚠️ CORRECTIONS TO PREVIOUS REPORTS

### 1. Flag Capture Time - I MADE AN ERROR
**What I said:** "Your last flag captured at 22:08 Friday"
**THE TRUTH:** That was Discord user "Tom" and "Luke", NOT you!

**Your ACTUAL capture times (from on-chain data):**
- **Merchant Flag:** Last updated 06.02.2026 UTC **20:50**
- **Staking Flag:** No exact timestamp in WRITEUP.md
- **Moving Window Flag:** No exact timestamp in WRITEUP.md
- **Lootbox Flag:** Approximate ~22:08 (Friday), but this was INFERRED, not verified on-chain

**The 54 holders:** Came from Suiscan collection data showing 54 unique wallet addresses own at least one flag.

**ACTION NEEDED:** If you want to know your EXACT competitive position, we need to:
1. Use Sui CLI: `sui client object <object-id> --json` for each flag
2. Or check transaction digests on Suiscan to get exact timestamps

**Current status:** You have 4/4 flags ✅, but exact capture times unknown. Given only ~54 holders total and you have ALL 4 flags, you're in strong position regardless.

---

## 🎯 YOUR TRACK ALIGNMENT (From Master Plan Analysis)

Based on your Master Plan and DoraHacks tracks, here's your optimal submission strategy:

### **Main Track: Prediction Markets + DeFi** ✅ PERFECT FIT

**Why:**
- DegenDuel is LITERALLY a PvP prediction game with DeFi mechanics
- DoraHacks description: "Prediction Markets allow participants to trade contracts whose prices reflect the market's collective probability estimates"
- Your project: Real-time head-to-head prediction duels with staking/settlement

**Judging Criteria Match:**
1. ✅ **Novelty:** First prediction game using Flare's enshrined protocols for trustless settlement
2. ✅ **Technical Sophistication:** FTSO v2 + FDC Web2Json + Secure RNG + Effect-TS architecture
3. ✅ **Commercial Upside:** Clear path to real-money markets, extensible to sports/weather/events

**Prize:** $10,000 investment (uncapped SAFE) + Gala Dinner invite + potential $350k follow-on

---

### **Sponsor Track 1: Flare ($10,000)** ✅ CONFIRMED

**Tracks:**
- **Main Track:** $5k + $2k + $1k = $8,000
- **Bonus Track:** $1k x2 = $2,000

**Your Qualification:**
- ✅ Uses FTSO v2 (price feeds)
- ✅ Uses FDC Web2Json (external API attestation)
- ✅ Uses Secure RNG (provably fair matchmaking)
- ✅ Addresses real-world problem (trustless prediction settlement)

**⚠️ CRITICAL MISSING REQUIREMENT:**
- **"Add Feedback in the README describing your experience with building on Flare"**
- **Status:** NOT in current README (still default Scaffold-ETH template)
- **Solution:** Comprehensive section drafted by agent (see below)

---

### **Sponsor Track 2: Rabot - Effectful Programming ($1,500)** ✅ PERFECT FIT

**Why:**
- You're using Effect-TS extensively (12 effect types, service/layer architecture)
- Master Plan explicitly targets this: "Very High (60-70%)" confidence
- Prize: $1,000 (1st) + $500 (2nd)

**Requirements:**
- Effectful programming must be "core architectural paradigm"
- Must use Effect-TS, Cats Effect (Scala), ZIO, or Fio (F#)

**Your Status:**
- ✅ Effect-TS is your entire off-chain orchestration layer
- ✅ FDC pipeline is pure Effect (HttpClient, Stream, Schedule, etc.)
- ✅ Service/Layer pattern throughout

**Submission Criteria Link:** https://docs.google.com/document/d/1p2QDqPtt-aHHPdYxdTWNjU9PRnjfaIikBVhcG0wXYY4/edit

---

## ⚠️ CANNOT SUBMIT TO:

**Plasma ($5k)** - Your project is NOT about stablecoin payments
**Sui ($10k)** - CTF already submitted separately, can't double-dip
**WeRate ($1k)** - Your project is NOT about local business databases

---

## 📋 SUBMISSION REQUIREMENTS ACROSS PLATFORMS

### **DoraHacks (Main Submission Hub)**
**URL:** https://dorahacks.io/hackathon/ethoxford26/detail
**Password:** `ETH-Oxford-26` (already used)

**Required:**
- ✅ GitHub/Gitlab/Bitbucket link
- ✅ Demo video (3 min, max 4 min)

**Account:** YES, you need a DoraHacks account
- Can sign up with Google/GitHub
- Free, takes 2 minutes

**Submission Process:**
1. Click "Submit BUIDL" button
2. Fill form with project details
3. Select tracks: "Prediction Markets + DeFi" (main) + "Flare" + "Rabot"
4. Upload video link
5. Paste GitHub repo URL

---

### **TAIKAI (Mentioned in Discord)**
**URL:** https://taikai.network/en/home-dao/hackathons/ethoxford

**Status:** May be redundant with DoraHacks? Checking...
- Discord mentioned TAIKAI for "main track"
- DoraHacks also has main tracks

**ACTION:** Submit to DoraHacks FIRST (confirmed official), then check TAIKAI as backup

---

### **Mintycode (Mentioned in Discord)**
**URL:** https://mintycode.io/hackathon/eth-oxford

**Status:** Likely for sponsor-specific bounty submissions
- May require separate Flare/Rabot submissions

**ACTION:** Check after DoraHacks submission

---

## 🎥 PITCH VIDEO STRATEGY

### **Should it be universal or track-specific?**

**ANSWER: Universal with Strategic Emphasis**

**Structure (3 minutes):**

1. **Hook (15 sec):** "Every prediction market relies on centralized oracles. We built the first PvP prediction game with 100% decentralized settlement using Flare's enshrined protocols."

2. **Demo: FTSO Price Duel (45 sec)**
   - Show two players creating BTC price prediction
   - Show instant settlement via FTSO v2
   - Emphasize: "Free, sub-2-second price reads from 100 data providers"

3. **Demo: FDC Web2Json Duel (45 sec)**
   - Show weather/sports API attestation
   - Show Merkle proof verification on-chain
   - Emphasize: "The ONLY blockchain with trustless Web2 data attestation"

4. **Tech Stack Highlight (30 sec)**
   - Quick flythrough of Effect-TS architecture
   - "12 distinct effect types, full service/layer pattern"
   - Show code snippet of FDC pipeline

5. **Commercial Upside (30 sec)**
   - "Extensible to sports, weather, events, real-money markets"
   - "Flare is the ONLY chain where this is possible"

6. **Closing (15 sec):** "DegenDuel. Trustless predictions. Provable fairness. Built on Flare."

**Key:** The SAME video works for all 3 tracks by highlighting:
- **Prediction Markets track:** Game mechanics and DeFi staking
- **Flare track:** All 3 protocols in action
- **Effectful track:** Effect-TS architecture (30-second segment)

---

## 📝 WHAT TO SUBMIT (Exact Requirements)

### **1. GitHub Repository**
**URL:** Your repo link
**Must include:**
- ✅ README.md with Flare feedback section (see below)
- ✅ Deployed contract address + verification
- ✅ Setup instructions
- ✅ Architecture diagram

### **2. Demo Video**
**Format:** 3 minutes (max 4 minutes)
**Upload:** YouTube (unlisted) or Vimeo
**Content:** See structure above

### **3. DoraHacks Submission Form**
**Fields:**
- Project name: DegenDuel
- Tagline: "PvP prediction duels with trustless settlement via Flare's enshrined protocols"
- Description: Your one-paragraph from Master Plan
- Tracks: Select "Prediction Markets + DeFi", "Flare", "Rabot"
- Team members: Up to 3 (are you solo?)
- GitHub link
- Video link
- Live demo URL (if frontend deployed)

---

## 🔥 CRITICAL: FLARE README FEEDBACK SECTION

### **Current Status:** ❌ NOT IN README

Your README is still the default Scaffold-ETH 2 template. Flare judging criteria REQUIRES:
> "Add Feedback in the README describing your experience with building on Flare"

**Solution:** Agent drafted a comprehensive 1,500-word section covering:
- ✅ All 3 protocol integrations (FTSO, FDC, RNG)
- ✅ Developer experience (what worked, what was challenging)
- ✅ Performance metrics
- ✅ Setup instructions
- ✅ Why Flare is uniquely suited for DegenDuel
- ✅ Architecture diagram

**File location:** See agent output above for full draft

**Action:** Copy this section into `degenduel/README.md` BEFORE submitting

---

## 🤖 FLOCK AI - CONFIRMED SPONSOR

### **YES, Flock AI is a sponsor at ETH Oxford 2026!**

**Bounty:** Estimated $1,500 - $5,000
**Status:** Listed as co-host/sponsor on TAIKAI

**API Key:**
1. **Self-service:** Sign up at https://platform.flock.io/ (free, instant)
2. **Hackathon credits:** Check Discord for any Flock-specific codes
3. **In-person:** Visit Flock booth at venue

**Your Project:**
- ✅ Already has FlockService implemented
- ✅ Graceful fallback if API unavailable
- ✅ Optional for submission (nice-to-have, not required)

**Action:** Sign up now, add API key to `.env` if you have time

**Research Files:**
- `.claude/agent_logs/RESEARCH_FLOCK_API_LATEST.md` (967 lines)
- `.claude/agent_logs/DEEP_DIVE_FLOCK_CHAINLINK.md` (858 lines)

---

## ✅ FINAL SUBMISSION CHECKLIST

### **URGENT (Do Tonight - 2-3 Hours)**

- [ ] **Add Flare feedback section to README** (30 min)
  - Copy drafted section from agent output
  - Customize with any additional learnings
  - Commit to GitHub

- [ ] **Create DoraHacks account** (5 min)
  - https://dorahacks.io/
  - Sign up with Google/GitHub

- [ ] **Record demo video** (2 hours)
  - Follow 3-minute structure above
  - Multiple takes OK
  - Upload to YouTube (unlisted)

### **TOMORROW MORNING (Final 3-4 Hours)**

- [ ] **Test full demo flow** (30 min)
  - Create FTSO price duel
  - Create FDC data duel
  - Ensure both settlement types work

- [ ] **Deploy frontend** (if not already) (1 hour)
  - Vercel/Netlify quick deploy
  - Add live demo link to README

- [ ] **Submit to DoraHacks** (30 min)
  - Fill submission form
  - Select 3 tracks: Prediction Markets + DeFi, Flare, Rabot
  - Upload video + GitHub links
  - Screenshot confirmation

- [ ] **Check TAIKAI** (30 min)
  - See if separate submission needed
  - If yes, reuse DoraHacks content

- [ ] **Check Mintycode** (30 min)
  - See if Flare/Rabot need separate bounty submissions
  - If yes, submit

- [ ] **Flock API key** (10 min) [OPTIONAL]
  - Sign up at platform.flock.io
  - Add to `.env`
  - Quick test

---

## 🎯 EXPECTED OUTCOMES

### **Conservative Estimate:**
- Main Track: Top 10 shortlist (invite to pitch) - $10k SAFE potential
- Flare: Top 3 ($1k-$5k range) - Very strong (all 3 protocols)
- Rabot: 1st or 2nd ($500-$1k) - Excellent fit (60-70% confidence)
- **Total: $1,500 - $16,000**

### **Optimistic Estimate:**
- Main Track: Winner ($10k SAFE + Gala + $350k follow-on)
- Flare Main: 1st ($5k)
- Flare Bonus: Winner ($1k)
- Rabot: 1st ($1k)
- **Total: $17,000 + $350k potential**

### **Floor:**
- Rabot: 2nd place ($500)
- **Already secured: $500 (Sui CTF)**
- **Total floor: $1,000**

---

## 🚨 HIGHEST PRIORITY FIXES

1. **README Flare Feedback** - Takes 30 min, REQUIRED for Flare judging
2. **Demo Video** - Takes 2 hours, REQUIRED for all submissions
3. **DoraHacks Submission** - Takes 30 min, PRIMARY submission platform

Everything else is secondary.

---

## 📞 SUPPORT CONTACTS

- **Discord:** Already logged in, check #flare, #rabot channels for questions
- **DoraHacks:** Message button on platform
- **Flare DevRel:** Filip Koprivec (j00sko) on Telegram
- **Venue:** Ask at sponsor booths

---

## ⏰ TIME REMAINING

**Deadline:** Sunday, Feb 8, 2026 - 12:00 noon
**Current time:** Saturday, Feb 7, 2026 - ~11:00 PM
**Hours remaining:** ~13 hours

**Realistic timeline:**
- Tonight (3 hours): README + Video recording
- Sleep (4 hours)
- Tomorrow AM (4 hours): Testing + Submissions
- Buffer (2 hours): Emergency fixes

**You can do this!** 🚀

---

**End of Analysis**
