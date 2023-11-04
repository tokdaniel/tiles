import hre, { getNamedAccounts, viem } from "hardhat";
import {
  Abi,
  Address,
  Hash,
  PublicClient,
  TestClient,
  decodeEventLog,
  fromHex,
  parseEther,
  toHex,
} from "viem";
import { expect } from "chai";

import { NetworkSettings } from "../deploy.config";
import getAllDeployments from "../utils/get-all-deployments";
import { Tile } from "../deploy/02-tile";
import { TileRegistry } from "../deploy/03-tile-registry";
import { Player } from "../deploy/05-player";
import { Currency } from "../deploy/04-currency";
import { Reserve } from "../deploy/01-reserve";
import { Resource } from "../deploy/00-resources";

describe("Player", () => {
  let config: NetworkSettings;
  let resources: Resource;
  let tileImplementation: Tile;
  let tileRegistry: TileRegistry;
  let player: Player;
  let currency: Currency;
  let reserve: Reserve;
  let publicClient: PublicClient;
  let createTxHash: Hash;
  let abiMap: Record<Address, Abi>;
  let testClient: TestClient;

  beforeEach(async () => {
    ({
      config,
      tileImplementation,
      tileRegistry,
      player,
      currency,
      resources,
      reserve,
    } = await getAllDeployments(hre));

    abiMap = {
      [resources.xionite.address]: resources.xionite.abi,
      [resources.yilium.address]: resources.yilium.abi,
      [resources.zephin.address]: resources.zephin.abi,
      [player.address]: player.abi,
      [tileRegistry.address]: tileRegistry.abi,
      [currency.address]: currency.abi,
      [reserve.address]: reserve.abi,
    };

    testClient = await hre.viem.getTestClient();

    publicClient = await hre.viem.getPublicClient();
    createTxHash = await player.write.create(
      [toHex("playername", { size: 32 })],
      {
        value: parseEther("100"),
      }
    );
  });

  describe("create", () => {
    it("should be able to create a player", async () => {
      const rc = await publicClient.waitForTransactionReceipt({
        hash: createTxHash,
      });

      const logs = await publicClient.getLogs(rc);

      const [, playerCreated] = logs
        .map((log) => {
          const abi = abiMap[log.address] ?? tileImplementation.abi;

          try {
            return decodeEventLog({
              abi,
              topics: log.topics,
              data: log.data,
            });
          } catch {
            return null;
          }
        })
        .filter((log) => log !== null);

      expect(playerCreated).to.deep.equal({
        eventName: "Player_Created",
        args: {
          playerId: 1n,
          name: toHex("playername", { size: 32 }),
        },
      });
    });
  });

  describe("getAttributes", () => {
    it("should be able to get the attributes of a player", async () => {
      const attributes = await player.read.getAttributes([1n]);

      expect(attributes).to.deep.equal({
        name: toHex("playername", { size: 32 }),
        location: { x: 0n, y: 0n, z: 0n },
        level: 1,
        movement: 10,
        xionite: 150,
        yilium: 150,
        zephin: 150,
      });
    });
  });

  describe("move", () => {
    it("should be able to move a player", async () => {
      const { deployer } = await getNamedAccounts();

      const hash = await player.write.move([0]);
      const rc = await publicClient.waitForTransactionReceipt({
        hash,
      });

      const logs = await publicClient.getLogs(rc);

      const decodedLogs = logs
        .map((log) => {
          try {
            const abi = abiMap[log.address] ?? tileImplementation.abi;

            return decodeEventLog({
              abi,
              topics: log.topics,
              data: log.data,
            });
          } catch {
            return null;
          }
        })
        .filter((log) => log !== null);

      expect(decodedLogs[3]).to.deep.equal({
        eventName: "TileRegistry_TileCreated",
        args: {
          tile: "0xfA370B24A670e83C269f961377Fd60Af67c976C1",
        },
      });

      expect(decodedLogs[7]).to.deep.equal({
        eventName: "Player_Moved",
        args: { playerId: 1n, direction: 0 },
      });

      const clone = await viem.getContractAt(
        "contracts/Tile/Tile.sol:Tile",
        (
          decodedLogs[3] as {
            eventName: "TileRegistry_TileCreated";
            args: { tile: Address };
          }
        ).args.tile
      );

      await testClient.mine({ blocks: 1 });

      console.log(await resources.xionite.read.balanceOf([clone.address]));

      expect(await clone.read).to.equal(deployer);

      expect((await player.read.getAttributes([1n])).location).to.deep.equal({
        x: -1n,
        y: 0n,
        z: 0n,
      });
    });
  });
});
