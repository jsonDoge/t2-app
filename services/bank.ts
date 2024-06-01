import getConfig from 'next/config';
import { getContract, waitTx } from './web3Utils';
import { CONTRACT_TYPE } from '../utils/constants';

const { publicRuntimeConfig } = getConfig();

export const mintStableToken = async (address: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const stableToken = getContract(publicRuntimeConfig.C_STABLE_TOKEN, CONTRACT_TYPE.ERC20, options);

  await waitTx(stableToken.mint(address, 100));
};

export const getStableTokenBalance = async (address: string): Promise<number> => {
  const options = { isSignerRequired: false };
  const stableToken = getContract(publicRuntimeConfig.C_STABLE_TOKEN, CONTRACT_TYPE.ERC20, options);

  const balance = await stableToken.balanceOf(address);
  return balance.toNumber();
};
