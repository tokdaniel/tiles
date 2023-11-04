import hre from "hardhat";
import { Address } from "viem";
import deploymentConfig from "../deploy.config";

const Player = "contracts/Player/Player.sol:Player";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const config =
    deploymentConfig[hre.network.name as keyof typeof deploymentConfig];

  const tileRegistryDeployment = await deployments.get("TileRegistry");
  const currencyDeployment = await deployments.get("Currency");
  const reserveDeployment = await deployments.get("Reserve");

  const player = await hre.viem.deployContract(Player, [
    config.playerPrice,
    currencyDeployment.address as Address,
    tileRegistryDeployment.address as Address,
  ]);

  await deployments.save("Player", player);

  const tileRegistry = await hre.viem.getContractAt(
    "contracts/Tile/TileRegistry.sol:TileRegistry",
    tileRegistryDeployment.address as Address
  );

  const owner = await tileRegistry.read.OWNER_ROLE();
  await tileRegistry.write.grantRole([owner, player.address]);

  const currency = await hre.viem.getContractAt(
    "contracts/Currency/AUROx.sol:AUROx",
    currencyDeployment.address as Address
  );

  const minter = await currency.read.MINTER_ROLE();
  await currency.write.grantRole([minter, player.address]);

  const reserve = await hre.viem.getContractAt(
    "contracts/Reserve/Reserve.sol:Reserve",
    reserveDeployment.address as Address
  );

  await reserve.write.initialize([config.superTokenFactory, player.address]);

  log(`Deployed ${Player} to ${player.address}`);

  return player;
};

export default deploy;
export type Player = Awaited<ReturnType<typeof deploy>>;
