import { Contract, ethers } from 'ethers';

// services
import { getContract } from './web3Utils';

// constants
import ContractTypes from '../constants/contractTypes';
import PlantTypes from '../constants/plantTypes';

export interface Plant {
  type: string,
  owner: string
}

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

export const getPlotInfo = async (x: number, y: number): Promise<(Plant | undefined)> => {
  const farm: Contract = getContract(process.env.C_FARM, ContractTypes.FARM, { isSignerRequired: false });

  const plotId = x + y * 1000;
  const plant = await farm.getPlantByPlotId(plotId);
  if (plant.owner === ethers.constants.AddressZero) {
    return undefined;
  }

  const plantType: string = Object.values(PlantTypes)
    .filter((t) => process.env[`C_${t}_SEED`]?.toLowerCase() === plant.seed.toLowerCase())[0]

  return {
    type: plantType,
    owner: plant.owner
  }
}