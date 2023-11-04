import hre from "hardhat";

const Resource = {
  Xionite: "contracts/Resource/Xionite.sol:Xionite",
  Yilium: "contracts/Resource/Yilium.sol:Yilium",
  Zephin: "contracts/Resource/Zephin.sol:Zephin",
} as const;

const deploy = async () => {
  const { deployments } = hre;
  const { log } = deployments;

  const xionite = await hre.viem.deployContract(Resource.Xionite, []);

  await deployments.save("Xionite", xionite);

  log(`Deployed ${Resource.Xionite} to ${xionite.address}`);

  const yilium = await hre.viem.deployContract(Resource.Yilium, []);

  await deployments.save("Yilium", yilium);

  log(`Deployed ${Resource.Yilium} to ${yilium.address}`);

  const zephin = await hre.viem.deployContract(Resource.Zephin, []);

  await deployments.save("Zephin", zephin);

  log(`Deployed ${Resource.Zephin} to ${zephin.address}`);

  const SuperToken =
    "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol:ISuperToken";

  const x = await hre.viem.getContractAt(SuperToken, xionite.address);
  const y = await hre.viem.getContractAt(SuperToken, yilium.address);
  const z = await hre.viem.getContractAt(SuperToken, zephin.address);

  return { xionite: x, yilium: y, zephin: z };
};

export default deploy;
export type Resource = Awaited<ReturnType<typeof deploy>>;
