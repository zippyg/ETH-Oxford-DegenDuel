# DoraHacks Submission Guide - Step-by-Step

## 🎯 What is a DoraHacks "BUIDL"?

**BUIDL** = DoraHacks' term for a hackathon project submission. It's their platform for:
- Showcasing your project
- Submitting to multiple tracks
- Getting discovered by judges
- Community voting (if enabled)

Think of it like creating a "project page" that includes your video, repo, description, and team info.

---

## ⏱️ How Long Does It Take?

**Total time: 15-30 minutes**

- Account creation: 2 minutes (if using Google/GitHub login)
- Form filling: 10-15 minutes
- Upload video/links: 5 minutes
- Review and submit: 5 minutes

**DO THIS TONIGHT** - Don't wait until morning!

---

## 📝 Step-by-Step Submission Process

### **Step 1: Access DoraHacks (2 minutes)**

1. Go to: https://dorahacks.io/hackathon/ethoxford26/detail
2. You'll see password gate - enter: `ETH-Oxford-26`
3. Click "Submit BUIDL" button (top right, green button)

### **Step 2: Create/Login to Account (2 minutes)**

**If you already have an account:**
- Click "Log in" (top right)
- Use your existing credentials

**If you DON'T have an account:**
1. Click "Submit BUIDL" → will prompt you to sign up
2. Choose sign-up method:
   - **Recommended:** "Continue with GitHub" (2 clicks, instant)
   - Or: "Continue with Google" (2 clicks, instant)
   - Or: Email + password (longer)
3. Accept terms of service
4. You're logged in!

### **Step 3: Create Your BUIDL (10-15 minutes)**

Click "Submit BUIDL" again - you'll see a form with these sections:

---

#### **Section A: Basic Info**

**1. Project Name**
```
DegenDuel
```

**2. Tagline** (1 sentence, max ~100 chars)
```
PvP prediction duels with trustless settlement via Flare's enshrined data protocols
```

**3. Project Logo** (optional but recommended)
- If you have one: Upload PNG/JPG (square, 512x512 ideal)
- If not: Skip for now, can add later

**4. Project Banner** (optional)
- If you have one: Upload wide image (1200x400 ideal)
- If not: Skip

---

#### **Section B: Description**

**5. Short Description** (2-3 sentences)
```
DegenDuel is a PvP prediction game where two players stake equal amounts and make opposing predictions about real-world outcomes—crypto prices, weather, sports. Flare's 100 independent validators settle duels trustlessly using FTSO v2 (price feeds), FDC Web2Json (external API attestation), and Secure RNG (provable fairness). Built with Scaffold-ETH 2, Effect-TS, and Next.js.
```

**6. Full Description** (Markdown supported, 500-2000 words)

Copy-paste this:

```markdown
## Elevator Pitch

Every prediction market today relies on centralized oracles to determine winners. **DegenDuel** is the first PvP prediction game where you bet on anything—crypto prices, weather, sports scores—and **Flare's 100 independent validators settle it trustlessly**. All three Flare protocols. Zero middlemen.

## What It Does

Two players enter a duel by staking equal amounts of C2FLR. They make opposing predictions about near-term real-world outcomes. The blockchain itself verifies who won using:

- **FTSO v2** for cryptocurrency price duels (instant, free settlement)
- **FDC Web2Json** for arbitrary real-world data (weather, sports, any API with cryptographic proof)
- **Secure RNG** for provably fair bonus multipliers

Winner takes the pot. No manual arbitration. No trust required.

## How We Built It

### Smart Contracts (Solidity)
- Deployed to Flare Coston2 testnet: `0x835574875C1CB9003c1638E799f3d7c504808960`
- Integrates all 3 Flare enshrined protocols via ContractRegistry pattern
- Price duels settle in ~2 seconds via FTSO v2 view calls
- Data duels settle via FDC Merkle proof verification on-chain

### Off-Chain Pipeline (Effect-TS)
- 12 distinct Effect types in service/layer architecture
- Orchestrates 5-step FDC attestation pipeline:
  1. POST to Flare Verifier with API URL + JQ filter
  2. Submit on-chain to FdcHub (~0.01 C2FLR fee)
  3. Wait 3-8 minutes for CCCR consensus
  4. Retrieve Merkle proof from DA Layer
  5. Submit settlement transaction with proof

### Frontend (Next.js + wagmi)
- Scaffold-ETH 2 base with custom DegenDuel components
- Real-time duel updates via WebSocket (Effect Stream)
- Wallet connection via RainbowKit
- Dark neon theme with DaisyUI

### Optional AI (FLock.io)
- Qwen3-30B model provides strategy hints
- Duel outcome analysis and recommendations
- Graceful fallback if API unavailable

## Challenges

1. **FDC complexity:** 5-step async workflow with 3 external dependencies. Debugging requires patience—5-8 minute wait per iteration.
2. **Proof structure mapping:** Converting DA Layer JSON to `IWeb2Json.Proof` struct required careful field mapping.
3. **Effect-TS learning curve:** Advanced functional programming patterns for orchestration.

## Accomplishments

- ✅ **All 3 Flare protocols integrated** (one of few projects using FTSO + FDC + RNG together)
- ✅ **End-to-end FDC pipeline working** (successfully attested Bitcoin price from Blockchain.info API)
- ✅ **12 Effect-TS effect types** in production service/layer architecture
- ✅ **Deployed and verified** on Coston2 testnet

## What We Learned

- **Flare is the ONLY chain** where this game is possible (trustless Web2 data attestation at protocol level)
- **FDC Web2Json is incredibly powerful** but requires architectural planning for async workflows
- **FTSO v2 is production-ready** - sub-2-second updates, free reads on testnet
- **Effect-TS** enables bulletproof error handling for complex pipelines

## What's Next

- Extend to sports betting (NFL, Premier League) via sports APIs
- Mainnet deployment on Flare Network
- Mobile app with push notifications for duel results
- Tournament mode with leaderboards and prizes
- Integration with prediction market aggregators
```

---

#### **Section C: Technical Details**

**7. GitHub Repository URL**
```
https://github.com/YOUR_USERNAME/degenduel
```
(Replace with your actual repo URL)

**8. Demo Video URL**
```
https://www.youtube.com/watch?v=PLACEHOLDER
```
(Replace PLACEHOLDER with your actual YouTube video ID once uploaded)

**9. Live Demo URL** (optional)
```
https://degenduel.vercel.app
```
(Or leave blank if not deployed yet)

**10. Deployed Contract Address**
```
0x835574875C1CB9003c1638E799f3d7c504808960
```

**11. Deployed Network**
```
Flare Coston2 Testnet (Chain ID: 114)
```

---

#### **Section D: Tracks**

**12. Main Track** (select ONE)
- ✅ **Prediction Markets + DeFi** ← SELECT THIS

**13. Sponsor Tracks** (select up to 2)
- ✅ **Flare** ← SELECT THIS
- ✅ **Rabot - Effectful Programming** ← SELECT THIS

**IMPORTANT:** You'll see a note on Flare: "[please mention if submitting to MAIN or BONUS on submission form]"

Add this to your description:
```
**Flare Submission Note:** Submitting to BOTH Main Track ($5k/$2k/$1k) and Bonus Track ($1k x2).
```

---

#### **Section E: Team**

**14. Team Name**
```
[Your Team Name] or just "DegenDuel Team"
```

**15. Team Members** (add up to 3)
- Click "Add Member"
- Enter name, email, role (e.g., "Full Stack Developer")
- If solo: Just add yourself

**16. Contact Email**
```
your.email@example.com
```

---

#### **Section F: Additional Info** (optional)

**17. Technologies Used** (tags/keywords)
```
Solidity, Flare, FTSO, FDC, Effect-TS, Next.js, TypeScript, Hardhat, wagmi, viem
```

**18. Additional Links** (optional)
- Twitter: `https://twitter.com/YOUR_HANDLE`
- Telegram: Your handle
- Documentation: Link to your README

---

### **Step 4: Upload Demo Video (5 minutes)**

**BEFORE submitting BUIDL:**
1. Record your 3-minute demo
2. Upload to YouTube:
   - Click "Upload" on YouTube
   - Select "Unlisted" visibility (so only people with link can see)
   - Title: "DegenDuel - ETH Oxford 2026 Demo"
   - Description: Brief project summary + links
   - Wait for processing (2-5 minutes)
3. Copy the YouTube URL (e.g., `https://www.youtube.com/watch?v=abc123xyz`)
4. Paste into DoraHacks form

---

### **Step 5: Review and Submit (5 minutes)**

1. **Preview:** Click "Preview" to see how your BUIDL looks
2. **Check:**
   - All links work
   - Video plays correctly
   - Images display (if uploaded)
   - Description renders properly (Markdown)
3. **Submit:** Click "Submit BUIDL" button
4. **Confirmation:** You'll see success message
5. **Screenshot:** Take screenshot of confirmation page

---

## 🔍 After Submission: What Happens Next?

1. **Your BUIDL goes live** on DoraHacks platform
2. **Judges receive notification** - they review video + repo
3. **Community can view** (if hackathon has public voting)
4. **You can edit** before deadline (if needed)
5. **Selected teams** get notified for in-person pitches (Sunday 14:00-16:00)

---

## 🚨 CRITICAL: Do You Need TAIKAI and Mintycode Too?

### **SHORT ANSWER: DoraHacks is PRIMARY. TAIKAI and Mintycode are SECONDARY/OPTIONAL.**

### **Here's the breakdown:**

#### **DoraHacks** ✅ REQUIRED
- **Official hackathon submission platform** per the hackathon details page
- **Main track judging** happens here
- **Sponsor bounties** (Flare, Rabot) can be submitted here
- **ONE submission** covers all tracks you select

#### **TAIKAI** ⚠️ UNCLEAR/OPTIONAL
- Mentioned in Discord as potential platform
- May be alternative/mirror of DoraHacks
- **ACTION:** Check https://taikai.network/en/home-dao/hackathons/ethoxford AFTER DoraHacks submission
- If ETH Oxford 2026 exists there, submit as backup (reuse BUIDL content)
- **Time:** 10-15 minutes if needed

#### **Mintycode** ⚠️ SPONSOR-SPECIFIC
- May be for sponsor-specific bounty submissions only
- **ACTION:** Check https://mintycode.io/hackathon/eth-oxford AFTER DoraHacks
- If Flare/Rabot bounties listed separately, submit there too
- **Time:** 10-15 minutes if needed

### **Recommended Strategy:**

**TONIGHT (Priority 1):**
1. ✅ Complete DoraHacks BUIDL submission (15-30 min)
   - This covers main track + Flare + Rabot
2. ✅ Screenshot confirmation

**TOMORROW MORNING (Priority 2):**
1. ⚠️ Check TAIKAI - if ETH Oxford 2026 is there, submit (10-15 min)
2. ⚠️ Check Mintycode - if bounties listed separately, submit (10-15 min)

**Why DoraHacks first?**
- It's the official platform with password gate
- All tracks can be selected in ONE submission
- Most efficient use of time

---

## 📋 Pre-Submission Checklist

Before clicking "Submit BUIDL", verify:

- [ ] Project name: "DegenDuel"
- [ ] Tagline is clear and concise
- [ ] Description includes elevator pitch, technical details, challenges, accomplishments
- [ ] GitHub repo URL is correct and public
- [ ] Demo video URL is correct and plays (YouTube unlisted)
- [ ] Contract address: `0x835574875C1CB9003c1638E799f3d7c504808960`
- [ ] Network: Flare Coston2 (Chain ID: 114)
- [ ] Main track selected: "Prediction Markets + DeFi"
- [ ] Sponsor tracks selected: "Flare" + "Rabot"
- [ ] Team members added (1-3 people)
- [ ] Contact email is valid
- [ ] Flare submission note added (MAIN + BONUS tracks)
- [ ] Preview looks good (no broken links/images)

---

## 💡 Pro Tips

1. **Save draft frequently** - DoraHacks autosaves, but click "Save Draft" periodically
2. **Use Markdown** in description for better formatting (headers, lists, links)
3. **Test video link** in incognito browser to ensure it's not private
4. **Keep it concise** - judges have 100+ projects to review
5. **Lead with impact** - "First PvP prediction game with trustless settlement" vs technical jargon
6. **Emphasize all 3 protocols** - FTSO + FDC + RNG (few projects use all three)
7. **Show, don't just tell** - Video demo is most important part

---

## 🆘 Troubleshooting

### **Problem: "Password incorrect"**
- **Solution:** Use `ETH-Oxford-26` exactly (case-sensitive)

### **Problem: "GitHub repo not found"**
- **Solution:** Make repo public (Settings → Danger Zone → Change visibility)

### **Problem: "Video won't embed"**
- **Solution:** Use YouTube (not Google Drive/Dropbox). Set to "Unlisted" not "Private"

### **Problem: "Can't select multiple tracks"**
- **Solution:** Main track = ONE choice. Sponsor tracks = up to TWO choices (separate field)

### **Problem: "Submit button greyed out"**
- **Solution:** Fill all required fields (marked with red asterisk *)

### **Problem: "Already submitted, want to edit"**
- **Solution:** Find your BUIDL, click "Edit" (available until deadline)

---

## ⏰ Timeline

**TONIGHT (11:00 PM - 12:00 AM):**
- [ ] Record demo video (if not done)
- [ ] Upload to YouTube (unlisted)
- [ ] Complete DoraHacks BUIDL submission
- [ ] Screenshot confirmation
- [ ] Sleep!

**TOMORROW (9:00 AM - 11:00 AM):**
- [ ] Test frontend one more time
- [ ] Check TAIKAI (submit if needed)
- [ ] Check Mintycode (submit if needed)
- [ ] Buffer time for issues

**DEADLINE: Sunday 12:00 PM (noon)**

---

## 🏁 You Got This!

DoraHacks submission is **straightforward** - just fill the form, add your video and repo, select tracks, and submit.

**Key points:**
- Takes 15-30 minutes
- DoraHacks is primary platform
- TAIKAI/Mintycode are secondary (check tomorrow)
- Save draft frequently
- Lead with impact in description

**The hard work (coding) is done. Now just package it up and submit!** 🚀

---

**Questions? Check #help channel on ETH Oxford Discord or DM organizers.**
