import getConfig from 'next/config';

// services
import { getContract, waitTx } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';
import { getDishAddress, getProductAddress } from './utils';

const { publicRuntimeConfig } = getConfig();

export const getProductBalance = async (address: string, plantType: string): Promise<number> => {
  const productAddress = getProductAddress(plantType);

  const options = { isSignerRequired: false };
  const product = getContract(
    productAddress,
    ContractTypes.ERC20,
    options,
  );

  const balance = await product.balanceOf(address);
  return balance.toNumber();
};

export const getDishBalance = async (address: string, plantType: string): Promise<number> => {
  const dishAddress = getDishAddress(plantType);

  const options = { isSignerRequired: false };
  const dish = getContract(
    dishAddress,
    ContractTypes.ERC20,
    options,
  );

  const balance = await dish.balanceOf(address);
  return balance.toNumber();
};

export const craftDish = async (
  plantType0: string, plantType1: string, plantType2: string, privateKey: string,
): Promise<void> => {
  const options = { isSignerRequired: true, privateKey };

  const productAddress0 = getProductAddress(plantType0);
  const productAddress1 = getProductAddress(plantType1);
  const productAddress2 = getProductAddress(plantType2);

  const allowancePerProduct = [productAddress0, productAddress1, productAddress2]
    .reduce((a: any, c: string) => ({ ...a, [c]: (a[c] || 0) + 1 }), {});

  // eslint-disable-next-line no-restricted-syntax
  for (const productAddress of Object.keys(allowancePerProduct)) {
    const productContract = getContract(
      productAddress,
      ContractTypes.ERC20,
      options,
    );

    // eslint-disable-next-line no-await-in-loop
    await waitTx(productContract.approve(
      publicRuntimeConfig.C_FARM, allowancePerProduct[productAddress],
    ));
  }

  const farm = getContract(
    publicRuntimeConfig.C_FARM,
    ContractTypes.FARM,
    options,
  );

  await waitTx(farm.convertProductsToDish(
    productAddress0,
    productAddress1,
    productAddress2,
  ));
};
