import hre from "hardhat";
import { Address } from "viem";
import deployConfig from "../deploy.config";

const Reserve = "contracts/Reserve/Reserve.sol:Reserve";

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const xioniteDeployment = await deployments.get("Xionite");
  const yiliumDeployment = await deployments.get("Yilium");
  const zephinDeployment = await deployments.get("Zephin");

  const reserve = await hre.viem.deployContract(Reserve, [
    xioniteDeployment.address as Address,
    yiliumDeployment.address as Address,
    zephinDeployment.address as Address,
  ]);

  await deployments.save("Reserve", reserve);

  log(`Deployed ${Reserve} to ${reserve.address}`);

  return reserve;
};

export default deploy;
export type Reserve = Awaited<ReturnType<typeof deploy>>;
