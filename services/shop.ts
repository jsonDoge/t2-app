import getConfig from 'next/config';
import { getContract, waitTx } from './web3Utils';
import { CONTRACT_TYPE } from '../utils/constants';
import { getSeedAddress } from './utils';

const { publicRuntimeConfig } = getConfig();

export const buySeed = async (seedType: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, options);

  const seedAddress = getSeedAddress(seedType);

  const stableToken = getContract(publicRuntimeConfig.C_STABLE_TOKEN, CONTRACT_TYPE.ERC20, options);

  await waitTx(stableToken.approve(publicRuntimeConfig.C_FARM, 1));
  await waitTx(farm.buySeeds(seedAddress, 1));
};

export const getSeedBalance = async (address: string, seedType: string): Promise<number> => {
  const seedAddress = getSeedAddress(seedType);

  const options = { isSignerRequired: false };
  const seed = getContract(seedAddress, CONTRACT_TYPE.ERC20, options);

  const balance = await seed.balanceOf(address);
  return balance.toNumber();
};
