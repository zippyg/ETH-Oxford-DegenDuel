/**
 * Check Setup Script
 * Validates the environment and contract setup before running FDC pipeline
 *
 * Usage:
 *   npx hardhat run scripts/check-setup.ts --network coston2
 */

import hre from "hardhat";

const DEGENDUEL_ADDRESS = "0x835574875C1CB9003c1638E799f3d7c504808960";
const FDC_HUB_ADDRESS = "0x48aC463d7975828989331F4De43341627b9c5f1D";
const FEE_CONFIG_ADDRESS = "0x191a1282Ac700edE65c5B0AaF313BAcC3eA7fC7e";
const VERIFIER_URL = "https://fdc-verifiers-testnet.flare.network";

async function main() {
  console.log("\n=== DegenDuel Setup Validation ===\n");

  const [signer] = await hre.ethers.getSigners();

  console.log("Network Information:");
  console.log(`  Network: ${hre.network.name}`);
  console.log(`  Chain ID: ${(await hre.ethers.provider.getNetwork()).chainId}`);
  console.log();

  console.log("Account Information:");
  console.log(`  Address: ${signer.address}`);
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log(`  Balance: ${hre.ethers.formatEther(balance)} C2FLR`);

  if (balance < hre.ethers.parseEther("0.2")) {
    console.log(`  ⚠️  Warning: Low balance. Consider getting more C2FLR from faucet.`);
  } else {
    console.log(`  ✓ Balance sufficient`);
  }
  console.log();

  console.log("Contract Checks:");

  // Check DegenDuel contract
  try {
    const degenDuelCode = await hre.ethers.provider.getCode(DEGENDUEL_ADDRESS);
    if (degenDuelCode === "0x") {
      console.log(`  ❌ DegenDuel contract not found at ${DEGENDUEL_ADDRESS}`);
    } else {
      console.log(`  ✓ DegenDuel contract deployed at ${DEGENDUEL_ADDRESS}`);

      const degenDuel = await hre.ethers.getContractAt("DegenDuel", DEGENDUEL_ADDRESS, signer);
      const nextDuelId = await degenDuel.nextDuelId();
      console.log(`    Next Duel ID: ${nextDuelId}`);

      const stats = await degenDuel.getProtocolStats();
      console.log(`    Total Duels Created: ${stats[0]}`);
      console.log(`    Total Duels Settled: ${stats[1]}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Error checking DegenDuel: ${error.message}`);
  }
  console.log();

  // Check FdcHub
  try {
    const fdcHubCode = await hre.ethers.provider.getCode(FDC_HUB_ADDRESS);
    if (fdcHubCode === "0x") {
      console.log(`  ❌ FdcHub not found at ${FDC_HUB_ADDRESS}`);
    } else {
      console.log(`  ✓ FdcHub found at ${FDC_HUB_ADDRESS}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Error checking FdcHub: ${error.message}`);
  }

  // Check FeeConfig
  try {
    const feeConfigCode = await hre.ethers.provider.getCode(FEE_CONFIG_ADDRESS);
    if (feeConfigCode === "0x") {
      console.log(`  ❌ FeeConfig not found at ${FEE_CONFIG_ADDRESS}`);
    } else {
      console.log(`  ✓ FeeConfig found at ${FEE_CONFIG_ADDRESS}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Error checking FeeConfig: ${error.message}`);
  }
  console.log();

  // Check FDC Verifier API
  console.log("External Service Checks:");
  try {
    const response = await fetch(`${VERIFIER_URL}/verifier/api-doc`, {
      method: "GET",
    });
    if (response.ok) {
      console.log(`  ✓ FDC Verifier API accessible`);
    } else {
      console.log(`  ⚠️  FDC Verifier API returned status ${response.status}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Cannot reach FDC Verifier API: ${error.message}`);
  }

  // Check default data API
  try {
    const response = await fetch("https://blockchain.info/ticker");
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✓ Default API (Blockchain.info) accessible`);
      console.log(`    Current BTC Price: $${data.USD.last}`);
    } else {
      console.log(`  ⚠️  Default API returned status ${response.status}`);
    }
  } catch (error: any) {
    console.log(`  ❌ Cannot reach default API: ${error.message}`);
  }
  console.log();

  console.log("=== Setup Validation Complete ===");
  console.log();

  if (balance >= hre.ethers.parseEther("0.2")) {
    console.log("✓ Ready to create and settle duels!");
    console.log();
    console.log("Next steps:");
    console.log("  1. Create a duel: yarn hardhat run scripts/create-data-duel.ts --network coston2");
    console.log("  2. Wait for deadline");
    console.log("  3. Settle duel: yarn hardhat run scripts/fdc-pipeline.ts --network coston2 -- <duelId>");
  } else {
    console.log("⚠️  Get more C2FLR from: https://faucet.flare.network/coston2");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
