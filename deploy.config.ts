import { Address } from "viem";
import metadata from "@superfluid-finance/metadata";
import { parseEther } from "viem";

type NetworkName = "hardhat";

export interface NetworkSettings {
  superTokenFactory: Address;
  playerPrice: bigint;
}

export type NetworkConfig = Record<NetworkName, NetworkSettings>;

const config: NetworkConfig = {
  hardhat: {
    superTokenFactory: metadata.getNetworkByName("polygon-mumbai")!.contractsV1
      .superTokenFactory as Address,
    playerPrice: parseEther("10"),
  },
};

export default config;
