import { Contract, ethers } from 'ethers';
import getConfig from 'next/config'

// services
import { getContract } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';
import { getSeedAddress } from './utils';

const { publicRuntimeConfig } = getConfig();

export const buySeed = async (plantType: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(
    publicRuntimeConfig.C_FARM,
    ContractTypes.FARM,
    options
  );

  const seedAddress = getSeedAddress(plantType);

  const stableToken = getContract(
    publicRuntimeConfig.C_STABLE_TOKEN,
    ContractTypes.ERC20,
    options
  );

  await stableToken.approve(publicRuntimeConfig.C_FARM, 1, { gasPrice: 0 });
  await farm.buySeeds(seedAddress, 1, { gasPrice: 0 });
}

export const getSeedBalance = async (address: string, plantType: string): Promise<number> => {
  const seedAddress = getSeedAddress(plantType);

  const options = { isSignerRequired: false };
  const seed = getContract(
    seedAddress,
    ContractTypes.ERC20,
    options
  );

  const balance = await seed.balanceOf(address);
  return balance.toNumber();
}
