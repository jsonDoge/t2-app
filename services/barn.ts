/* eslint-disable no-await-in-loop */
import getConfig from 'next/config';
import { getContract, waitTx } from './web3Utils';
import { getProductAddress } from './utils';
import { CONTRACT_TYPE } from '../utils/constants';

const { publicRuntimeConfig } = getConfig();

export const getProductBalance = async (address: string, productType: string): Promise<number> => {
  const productAddress = getProductAddress(productType);

  const options = { isSignerRequired: false };
  const product = getContract(productAddress, CONTRACT_TYPE.ERC20, options);

  const balance = await product.balanceOf(address);
  return balance.toNumber();
};

// supports up to 3 different products
export const convertToSeed = async (
  productType: string,
  quantity: number,
  walletAddress: string,
  privateKey: string,
): Promise<void> => {
  const options = { isSignerRequired: true, privateKey };
  const productAddress = getProductAddress(productType);

  const productContract = getContract(productAddress, CONTRACT_TYPE.ERC20, options);

  const allowance = await productContract.allowance(walletAddress, publicRuntimeConfig.C_FARM);

  if (allowance.toNumber() < quantity) {
    await waitTx(productContract.approve(publicRuntimeConfig.C_FARM, quantity - allowance.toNumber()));
  }

  const farm = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, options);

  await waitTx(farm.convertProductsToSeeds(productAddress, quantity));
};
