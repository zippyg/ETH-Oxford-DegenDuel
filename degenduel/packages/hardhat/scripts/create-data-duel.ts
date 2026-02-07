/**
 * Create Data Duel Script
 * Creates a new data duel on the DegenDuel contract
 *
 * Usage:
 *   npx hardhat run scripts/create-data-duel.ts --network coston2
 *
 * Optional env vars:
 *   DUEL_THRESHOLD=60000  (default: 60000 USD - Bitcoin price threshold)
 *   DUEL_STAKE=0.1        (default: 0.1 C2FLR)
 *   DUEL_MINUTES=10       (default: 10 minutes from now)
 *   DUEL_PREDICTION=true  (default: true = "above threshold")
 */

import hre from "hardhat";

const DEGENDUEL_ADDRESS = "0x835574875C1CB9003c1638E799f3d7c504808960";

async function main() {
  console.log("\n=== DegenDuel: Create Data Duel ===\n");

  // Get config from env or use defaults
  const dataThreshold = process.env.DUEL_THRESHOLD || "60000"; // BTC price
  const stakeAmount = process.env.DUEL_STAKE || "0.1";
  const durationMinutes = parseInt(process.env.DUEL_MINUTES || "10");
  const prediction = process.env.DUEL_PREDICTION === "false" ? false : true;

  const deadline = Math.floor(Date.now() / 1000) + durationMinutes * 60;
  const stakeWei = hre.ethers.parseEther(stakeAmount);

  console.log("Configuration:");
  console.log(`  Threshold: ${dataThreshold} USD`);
  console.log(`  Stake: ${stakeAmount} C2FLR`);
  console.log(`  Deadline: ${durationMinutes} minutes (${new Date(deadline * 1000).toISOString()})`);
  console.log(`  Prediction: ${prediction ? "ABOVE" : "BELOW"} threshold`);
  console.log(`  Contract: ${DEGENDUEL_ADDRESS}`);
  console.log();

  // Get signer
  const [signer] = await hre.ethers.getSigners();
  console.log(`Creating duel from: ${signer.address}`);
  console.log();

  // Create contract instance
  const degenDuel = await hre.ethers.getContractAt(
    "DegenDuel",
    DEGENDUEL_ADDRESS,
    signer
  );

  // Check balance
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log(`Account balance: ${hre.ethers.formatEther(balance)} C2FLR`);

  if (balance < stakeWei) {
    throw new Error(
      `Insufficient balance. Need ${stakeAmount} C2FLR, have ${hre.ethers.formatEther(balance)} C2FLR`
    );
  }
  console.log();

  // Create the duel
  console.log("Creating data duel...");
  const tx = await degenDuel.createDataDuel(dataThreshold, deadline, prediction, {
    value: stakeWei,
  });

  console.log(`Transaction hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  console.log(`✓ Confirmed in block ${receipt!.blockNumber}`);
  console.log();

  // Parse the DuelCreated event to get the duel ID
  const eventInterface = degenDuel.interface;
  const duelCreatedEvent = receipt!.logs
    .map(log => {
      try {
        return eventInterface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });
      } catch {
        return null;
      }
    })
    .find(event => event?.name === "DuelCreated");

  if (duelCreatedEvent) {
    const duelId = duelCreatedEvent.args.duelId;
    console.log("===========================================");
    console.log(`DUEL CREATED SUCCESSFULLY!`);
    console.log(`===========================================`);
    console.log(`Duel ID: ${duelId}`);
    console.log(`Threshold: ${dataThreshold} USD`);
    console.log(`Stake: ${stakeAmount} C2FLR`);
    console.log(`Deadline: ${new Date(deadline * 1000).toISOString()}`);
    console.log(`Prediction: ${prediction ? "ABOVE" : "BELOW"}`);
    console.log(`Creator: ${signer.address}`);
    console.log();
    console.log("To settle this duel, run:");
    console.log(`  npx hardhat run scripts/fdc-pipeline.ts --network coston2 -- ${duelId}`);
    console.log("===========================================");
  } else {
    console.log("✓ Duel created (event parsing failed, check transaction on explorer)");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
