import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";

import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-deploy";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const RPC_URLS = {
  mumbai: process.env.MUMBAI_RPC_URL ?? "",
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: RPC_URLS.mumbai,
      },
    },

    mumbai: {
      chainId: 80001,
      url: RPC_URLS.mumbai,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      0: PRIVATE_KEY != undefined ? PRIVATE_KEY : 0,
    },
  },
};

export default config;
