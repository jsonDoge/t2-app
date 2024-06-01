/* eslint-disable no-await-in-loop */
import getConfig from 'next/config';
import { CONTRACT_TYPE } from '../utils/constants';
import { getDishAddress, getProductAddress } from './utils';
import { getContract, waitTx } from './web3Utils';

const { publicRuntimeConfig } = getConfig();

export const getDishBalance = async (address: string, productType: string): Promise<number> => {
  const dishAddress = getDishAddress(productType);

  const options = { isSignerRequired: false };
  const dish = getContract(dishAddress, CONTRACT_TYPE.ERC20, options);

  const balance = await dish.balanceOf(address);
  return balance.toNumber();
};

// supports up to 3 different products
export const craftDish = async (
  productTypes: string[],
  quantities: number[],
  walletAddress: string,
  privateKey: string,
): Promise<void> => {
  if (productTypes.length !== quantities.length || productTypes.length > 3) {
    throw new Error('Invalid productTypes or quantities');
  }

  const options = { isSignerRequired: true, privateKey };
  const productAddresses = productTypes.map((type) => getProductAddress(type));

  // eslint-disable-next-line no-restricted-syntax
  for (const [index, productAddress] of productAddresses.entries()) {
    const productContract = getContract(productAddress, CONTRACT_TYPE.ERC20, options);

    const allowance = await productContract.allowance(walletAddress, publicRuntimeConfig.C_FARM);

    if (allowance.toNumber() >= quantities[index]) {
      continue;
    }

    await waitTx(productContract.approve(publicRuntimeConfig.C_FARM, quantities[index] - allowance.toNumber()));
  }

  const farm = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, options);

  await waitTx(farm.convertProductsToDish(productAddresses, quantities));
};
