
// services
import { getContract } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';
import PlantTypes from '../constants/plantTypes';

const getProductAddress = (type: string): string => {
  const productAddress: string = process.env[`C_${type}_PRODUCT`] || '';
  if (productAddress.length === 0) { throw new Error('invalid plant type'); }
  return productAddress;
}

const getSeedAddress = (type: string): string => {
  const seedAddress: string = process.env[`C_${type}_SEED`] || '';
  if (seedAddress.length === 0) { throw new Error('invalid plant type'); }
  return seedAddress;
}

export const plant = async (type: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const seedContract = getContract(
    getSeedAddress(type),
    ContractTypes.ERC20,
    options
  );

  // TODO add further planting logic
}