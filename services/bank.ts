import getConfig from 'next/config';

// services
import { getContract, waitTx } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';

const { publicRuntimeConfig } = getConfig();

export interface Plant {
  type: string,
  owner: string
}

export const mintStableToken = async (address: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const stableToken = getContract(
    publicRuntimeConfig.C_STABLE_TOKEN,
    ContractTypes.ERC20,
    options,
  );

  await waitTx(stableToken.mint(address, 100));
};

export const getStableTokenBalance = async (address: string): Promise<number> => {
  const options = { isSignerRequired: false };
  const stableToken = getContract(
    publicRuntimeConfig.C_STABLE_TOKEN,
    ContractTypes.ERC20,
    options,
  );

  const balance = await stableToken.balanceOf(address);
  return balance.toNumber();
};
