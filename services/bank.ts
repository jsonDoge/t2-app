// services
import { getContract } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';

export interface Plant {
  type: string,
  owner: string
}

export const mintStableToken = async (address: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const stableToken = getContract(
    process.env.C_STABLE_TOKEN as string,
    ContractTypes.ERC20,
    options
  );

  await stableToken.mint(address, 100, { gasPrice: 0 });
}

export const getStableTokenBalance = async (address: string): Promise<number> => {
  const options = { isSignerRequired: false };
  const stableToken = getContract(
    process.env.C_STABLE_TOKEN as string,
    ContractTypes.ERC20,
    options
  );

  const balance = await stableToken.balanceOf(address);
  return balance.toNumber();
}
