// services
import { getContract } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';
import { getProductAddress } from './utils';

export const getProductBalance = async (address: string, plantType: string): Promise<number> => {
  const productAddress = getProductAddress(plantType);

  const options = { isSignerRequired: false };
  const product = getContract(
    productAddress,
    ContractTypes.ERC20,
    options
  );

  const balance = await product.balanceOf(address);
  return balance.toNumber();
}
