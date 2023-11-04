import hre from "hardhat";
import deployConfig from "../deploy.config";

const Currency = "contracts/Currency/AUROx.sol:AUROx";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const config = deployConfig[hre.network.name as keyof typeof deployConfig];

  const currency = await hre.viem.deployContract(Currency, []);

  await deployments.save("Currency", currency);

  log(`Deployed ${Currency} to ${currency.address}`);

  currency.write.initialize([config.superTokenFactory]);

  return currency;
};

export default deploy;
export type Currency = Awaited<ReturnType<typeof deploy>>;
