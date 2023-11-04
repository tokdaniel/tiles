import hre from "hardhat";
import { Address } from "viem";

const TileRegistry = "contracts/Tile/TileRegistry.sol:TileRegistry";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const tileDeployment = await deployments.get("Tile");
  const reserveDeployment = await deployments.get("Reserve");

  const xioniteDeployment = await deployments.get("Xionite");
  const yiliumDeployment = await deployments.get("Yilium");
  const zephinDeployment = await deployments.get("Zephin");

  const tileRegistry = await hre.viem.deployContract(TileRegistry, [
    tileDeployment.address as Address,
    reserveDeployment.address as Address,
    xioniteDeployment.address as Address,
    yiliumDeployment.address as Address,
    zephinDeployment.address as Address,
  ]);

  await deployments.save("TileRegistry", tileRegistry);

  const reserve = await hre.viem.getContractAt(
    "contracts/Reserve/Reserve.sol:Reserve",
    reserveDeployment.address as Address
  );

  const owner = await reserve.read.OWNER_ROLE();
  await reserve.write.grantRole([owner, tileRegistry.address]);

  log(`Deployed ${TileRegistry} to ${tileRegistry.address}`);

  return tileRegistry;
};

export default deploy;
export type TileRegistry = Awaited<ReturnType<typeof deploy>>;
