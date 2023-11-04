import { HardhatRuntimeEnvironment } from "hardhat/types";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

import deployTileImplementation, { Tile } from "../deploy/02-tile";
import deployTileRegistry, { TileRegistry } from "../deploy/03-tile-registry";
import deployPlayer, { Player } from "../deploy/05-player";
import deployCurrency, { Currency } from "../deploy/04-currency";
import deployReserve, { Reserve } from "../deploy/01-reserve";
import deployResources, { Resource } from "../deploy/00-resources";
import deployWorld, { World } from "../deploy/99-world";
import deploymentConfig from "../deploy.config";

const getAllDeployments = async (hre: HardhatRuntimeEnvironment) => {
  const config =
    deploymentConfig[hre.network.name as keyof typeof deploymentConfig];

  const resources: Resource = await loadFixture(deployResources);
  const reserve: Reserve = await loadFixture(deployReserve);
  const currency: Currency = await loadFixture(deployCurrency);
  const tileImplementation: Tile = await loadFixture(deployTileImplementation);
  const tileRegistry: TileRegistry = await loadFixture(deployTileRegistry);
  const player: Player = await loadFixture(deployPlayer);
  const world: World = await loadFixture(deployWorld);

  return {
    config,
    resources,
    reserve,
    currency,
    tileImplementation,
    tileRegistry,
    player,
    world,
  };
};

export default getAllDeployments;
