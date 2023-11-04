import hre from "hardhat";
import { Address } from "viem";

const World = "contracts/World/World.sol:World";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const tileImplementation = await deployments.get("Tile");
  const tileRegistryDeployment = await deployments.get("TileRegistry");
  const currency = await deployments.get("Currency");
  const player = await deployments.get("Player");

  const world = await hre.viem.deployContract(World, [
    currency.address as Address,
    player.address as Address,
    tileRegistryDeployment.address as Address,
    tileImplementation.address as Address,
  ]);

  await deployments.save("World", world);

  log(`Deployed ${World} to ${world.address}`);

  return player;
};

export default deploy;
export type World = Awaited<ReturnType<typeof deploy>>;
