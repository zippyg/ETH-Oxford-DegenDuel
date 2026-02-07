import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployDegenDuel: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("DegenDuel", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployDegenDuel;

deployDegenDuel.tags = ["DegenDuel"];
