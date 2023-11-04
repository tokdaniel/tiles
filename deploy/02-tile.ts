import hre from "hardhat";
import { Address } from "viem";
const Tile = "contracts/Tile/Tile.sol:Tile";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const tile = await hre.viem.deployContract(Tile, []);

  await deployments.save("Tile", tile);

  log(`Deployed ${Tile} to ${tile.address}`);

  return tile;
};

export default deploy;
export type Tile = Awaited<ReturnType<typeof deploy>>;
