import { Contract, ethers } from 'ethers';
import getConfig from 'next/config'

// services
import { getContract } from './web3Utils';
import { getPlotIdFromCoordinates, Plant } from './utils';

// constants
import ContractTypes from '../constants/contractTypes';
import PlantTypes from '../constants/plantTypes';
import { getSeedAddress } from './utils';

const { publicRuntimeConfig } = getConfig();

export const plant = async (type: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const seedContract = getContract(
    getSeedAddress(type),
    ContractTypes.ERC20,
    options
  );

  // TODO add further planting logic
}

export const buyPlot = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(
    publicRuntimeConfig.C_FARM as string,
    ContractTypes.FARM,
    options
  );

  const stableToken = getContract(
    publicRuntimeConfig.C_STABLE_TOKEN as string,
    ContractTypes.ERC20,
    options
  );

  await stableToken.approve(publicRuntimeConfig.C_FARM as string, 1, { gasPrice: 0 });

  const plotId = getPlotIdFromCoordinates(x, y);
  await farm.buyPlot(plotId, { gasPrice: 0 });
}

export const getPlotInfo = async (x: number, y: number): Promise<({ type: string, owner: string } | undefined)> => {
  const farm: Contract = getContract(publicRuntimeConfig.C_FARM as string, ContractTypes.FARM, { isSignerRequired: false });
  const plot: Contract = getContract(publicRuntimeConfig.C_PLOT as string, ContractTypes.PLOT, { isSignerRequired: false });

  const plotId = getPlotIdFromCoordinates(x, y);
  const plant = await farm.getPlantByPlotId(plotId);
  let plotOwner;
  try {
    plotOwner = await plot.ownerOf(plotId);
  } catch (e) {}

  if (!plotOwner) {
    return undefined;
  }

  const plantType: string = Object.values(PlantTypes)
    .filter((t) => publicRuntimeConfig[`C_${t}_SEED`]?.toLowerCase() === plant.seed.toLowerCase())[0]

  return {
    type: plantType,
    owner: plotOwner.toLowerCase()
  }
}