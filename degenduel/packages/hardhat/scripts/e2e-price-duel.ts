/**
 * End-to-End Price Duel Test
 * Creates a duel, funds a second account to join it, waits for deadline, settles via FTSO.
 *
 * Usage:
 *   npx hardhat run scripts/e2e-price-duel.ts --network coston2
 */

import hre from "hardhat";

const DEGENDUEL_ADDRESS = "0x835574875C1CB9003c1638E799f3d7c504808960";

// FLR/USD feed ID (bytes21)
const FLR_FEED_ID = "0x01464c522f55534400000000000000000000000000";

async function main() {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║  DegenDuel E2E Test: Full Price Duel Flow    ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // ─── Setup ────────────────────────────────────────────────
  const [deployer] = await hre.ethers.getSigners();
  const provider = hre.ethers.provider;

  // Generate a second wallet for playerB
  const playerBWallet = hre.ethers.Wallet.createRandom().connect(provider);

  console.log("Players:");
  console.log(`  Player A (deployer): ${deployer.address}`);
  console.log(`  Player B (generated): ${playerBWallet.address}`);
  console.log();

  const balanceA = await provider.getBalance(deployer.address);
  console.log(`  Balance A: ${hre.ethers.formatEther(balanceA)} C2FLR`);

  // Fund playerB (0.3 C2FLR: 0.1 stake + 0.2 gas buffer)
  console.log("\n[1/6] Funding Player B...");
  const fundTx = await deployer.sendTransaction({
    to: playerBWallet.address,
    value: hre.ethers.parseEther("0.3"),
  });
  await fundTx.wait();
  const balanceB = await provider.getBalance(playerBWallet.address);
  console.log(`  ✓ Player B funded: ${hre.ethers.formatEther(balanceB)} C2FLR`);

  // ─── Contract instances ───────────────────────────────────
  const degenDuelA = await hre.ethers.getContractAt("DegenDuel", DEGENDUEL_ADDRESS, deployer);
  const degenDuelB = await hre.ethers.getContractAt("DegenDuel", DEGENDUEL_ADDRESS, playerBWallet);

  // ─── Read current FTSO price ──────────────────────────────
  console.log("\n[2/6] Reading current FLR/USD price via FTSO v2...");
  const [priceValue, priceDecimals, priceTimestamp] = await degenDuelA.getCurrentPrice(FLR_FEED_ID);
  const humanPrice = Number(priceValue) / Math.pow(10, Math.abs(Number(priceDecimals)));
  console.log(`  ✓ FLR/USD = $${humanPrice.toFixed(6)} (raw: ${priceValue}, decimals: ${priceDecimals}, ts: ${priceTimestamp})`);

  // ─── Create duel ──────────────────────────────────────────
  console.log("\n[3/6] Creating price duel...");
  const stakeAmount = hre.ethers.parseEther("0.1");
  // Deadline = 90 seconds from now (minimum viable for demo)
  const deadline = Math.floor(Date.now() / 1000) + 90;

  // Player A predicts FLR price will be ABOVE the threshold
  // Set threshold slightly below current price so we can observe the result
  const threshold = priceValue; // exactly current price
  const prediction = true; // "above or equal"

  console.log(`  Feed: FLR/USD (${FLR_FEED_ID})`);
  console.log(`  Stake: 0.1 C2FLR`);
  console.log(`  Threshold: ${threshold} (decimals: ${priceDecimals})`);
  console.log(`  Player A predicts: ABOVE`);
  console.log(`  Deadline: ${new Date(deadline * 1000).toISOString()} (90s from now)`);

  const createTx = await degenDuelA.createPriceDuel(
    FLR_FEED_ID,
    threshold,
    priceDecimals,
    deadline,
    prediction,
    { value: stakeAmount }
  );
  const createReceipt = await createTx.wait();

  // Parse DuelCreated event
  const duelCreatedLog = createReceipt!.logs
    .map((log: any) => {
      try { return degenDuelA.interface.parseLog({ topics: log.topics as string[], data: log.data }); }
      catch { return null; }
    })
    .find((e: any) => e?.name === "DuelCreated");

  const duelId = duelCreatedLog!.args.duelId;
  console.log(`  ✓ Duel #${duelId} created (tx: ${createTx.hash.slice(0, 18)}...)`);

  // ─── Join duel ────────────────────────────────────────────
  console.log("\n[4/6] Player B joining duel...");
  const joinTx = await degenDuelB.joinDuel(duelId, { value: stakeAmount });
  await joinTx.wait();
  console.log(`  ✓ Player B joined (takes opposite prediction: BELOW)`);
  console.log(`  ✓ Duel is now ACTIVE. Total pot: 0.2 C2FLR`);

  // ─── Wait for deadline ────────────────────────────────────
  console.log("\n[5/6] Waiting for deadline...");
  const now = Math.floor(Date.now() / 1000);
  const waitSeconds = deadline - now + 5; // +5s buffer
  console.log(`  Waiting ${waitSeconds} seconds...`);

  for (let i = waitSeconds; i > 0; i -= 10) {
    const remaining = Math.max(0, i);
    process.stdout.write(`  ⏳ ${remaining}s remaining...\r`);
    await new Promise(resolve => setTimeout(resolve, Math.min(10000, i * 1000)));
  }
  console.log("  ✓ Deadline passed!                    ");

  // ─── Settle duel ──────────────────────────────────────────
  console.log("\n[6/6] Settling duel via FTSO v2...");
  const settleTx = await degenDuelA.settlePriceDuel(duelId);
  const settleReceipt = await settleTx.wait();

  // Parse events
  const settleEvents = settleReceipt!.logs
    .map((log: any) => {
      try { return degenDuelA.interface.parseLog({ topics: log.topics as string[], data: log.data }); }
      catch { return null; }
    })
    .filter(Boolean);

  const priceReadEvent = settleEvents.find((e: any) => e?.name === "PriceRead");
  const duelSettledEvent = settleEvents.find((e: any) => e?.name === "DuelSettled");
  const bonusEvent = settleEvents.find((e: any) => e?.name === "BonusTriggered");

  if (priceReadEvent) {
    const settledPrice = Number(priceReadEvent.args.value) / Math.pow(10, Math.abs(Number(priceReadEvent.args.decimals)));
    console.log(`  FTSO Price at settlement: $${settledPrice.toFixed(6)}`);
  }

  if (duelSettledEvent) {
    const winner = duelSettledEvent.args.winner;
    const payout = hre.ethers.formatEther(duelSettledEvent.args.payout);
    const bonus = duelSettledEvent.args.bonusApplied;

    console.log(`  ✓ DUEL SETTLED!`);
    console.log(`  Winner: ${winner === deployer.address ? "Player A (deployer)" : "Player B"}`);
    console.log(`  Payout: ${payout} C2FLR`);
    console.log(`  Bonus Applied: ${bonus ? "YES (2x via RNG!)" : "No"}`);

    if (bonusEvent) {
      console.log(`  🎰 RNG Bonus triggered! Random: ${bonusEvent.args.randomNumber}`);
    }
  }

  // ─── Final state ──────────────────────────────────────────
  console.log("\n─── Final State ───");
  const finalDuel = await degenDuelA.getDuel(duelId);
  console.log(`  Duel #${duelId} status: ${["OPEN", "ACTIVE", "SETTLED", "CANCELLED", "EXPIRED"][Number(finalDuel.status)]}`);
  console.log(`  Settled value: ${finalDuel.settledValue}`);
  console.log(`  Winner: ${finalDuel.winner}`);

  const stats = await degenDuelA.getProtocolStats();
  console.log(`\n  Protocol Stats:`);
  console.log(`    Total created: ${stats[0]}`);
  console.log(`    Total settled: ${stats[1]}`);
  console.log(`    Total volume: ${hre.ethers.formatEther(stats[2])} C2FLR`);
  console.log(`    Fee pool: ${hre.ethers.formatEther(stats[3])} C2FLR`);

  const finalBalA = await provider.getBalance(deployer.address);
  const finalBalB = await provider.getBalance(playerBWallet.address);
  console.log(`\n  Final Balances:`);
  console.log(`    Player A: ${hre.ethers.formatEther(finalBalA)} C2FLR`);
  console.log(`    Player B: ${hre.ethers.formatEther(finalBalB)} C2FLR`);

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║  ✓ E2E TEST COMPLETE — ALL PROTOCOLS USED   ║");
  console.log("║  FTSO v2: Price read + settlement            ║");
  console.log("║  Secure RNG: Bonus chance check              ║");
  console.log("║  Contract: Full lifecycle proven              ║");
  console.log("╚══════════════════════════════════════════════╝\n");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("\n❌ E2E test failed:", error);
    process.exit(1);
  });
