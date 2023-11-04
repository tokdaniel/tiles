import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import deployTileImplementation, { Tile } from "../deploy/02-tile";
import deployTileRegistry, { TileRegistry } from "../deploy/03-tile-registry";
import { expect } from "chai";

describe("TileRegistry", () => {
  let tileImplementation: Tile;
  let tileRegistry: TileRegistry;

  beforeEach(async () => {
    tileImplementation = await loadFixture(deployTileImplementation);
    tileRegistry = await loadFixture(deployTileRegistry);
  });
});
