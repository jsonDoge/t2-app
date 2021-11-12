import { Contract } from 'ethers';
import getConfig from 'next/config';

// services
import { getContract } from './web3Utils';
import { getPlotIdFromCoordinates, getSeedAddress, PlotInfo } from './utils';

// constants
import ContractTypes from '../constants/contractTypes';
import PlantTypes from '../constants/plantTypes';

const { publicRuntimeConfig } = getConfig();

export const plant = async (x: number, y: number, type: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const seedAddress = getSeedAddress(type);

  const seedContract = getContract(
    seedAddress,
    ContractTypes.ERC20,
    options,
  );

  await seedContract.approve(publicRuntimeConfig.C_FARM, 1, { gasPrice: 0 });

  const plot: Contract = getContract(
    publicRuntimeConfig.C_PLOT, ContractTypes.PLOT, { isSignerRequired: true, privateKey },
  );

  const plotId = getPlotIdFromCoordinates(x, y);
  await plot.approve(publicRuntimeConfig.C_FARM, plotId, { gasPrice: 0 });

  const farm: Contract = getContract(
    publicRuntimeConfig.C_FARM, ContractTypes.FARM, { isSignerRequired: true, privateKey },
  );
  await farm.plant(seedAddress, plotId, { gasPrice: 0 });
};

export const buyPlot = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(
    publicRuntimeConfig.C_FARM,
    ContractTypes.FARM,
    options,
  );

  const stableToken = getContract(
    publicRuntimeConfig.C_STABLE_TOKEN,
    ContractTypes.ERC20,
    options,
  );

  await stableToken.approve(publicRuntimeConfig.C_FARM, 1, { gasPrice: 0 });

  const plotId = getPlotIdFromCoordinates(x, y);
  await farm.buyPlot(plotId, { gasPrice: 0 });
};

export const harvest = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(
    publicRuntimeConfig.C_FARM,
    ContractTypes.FARM,
    options,
  );

  const plotId = getPlotIdFromCoordinates(x, y);
  await farm.harvest(plotId, { gasPrice: 0 });
};

export const getPlotInfo = async (x: number, y: number): Promise<(PlotInfo | undefined)> => {
  const farm: Contract = getContract(
    publicRuntimeConfig.C_FARM, ContractTypes.FARM, { isSignerRequired: false },
  );
  const plot: Contract = getContract(
    publicRuntimeConfig.C_PLOT, ContractTypes.PLOT, { isSignerRequired: false },
  );

  const plotId = getPlotIdFromCoordinates(x, y);
  const plotPlant = await farm.getPlantByPlotId(plotId);
  let plotOwner;
  try {
    plotOwner = await plot.ownerOf(plotId);
  } catch (e) { console.error(e); }

  if (!plotOwner) {
    return undefined;
  }

  const plantType: string = Object.values(PlantTypes)
    .filter((t) => publicRuntimeConfig[`C_${t}_SEED`]?.toLowerCase() === plotPlant.seed.toLowerCase())[0];

  return {
    plant: {
      type: plantType,
      owner: plotPlant.owner.toLowerCase(),
    },
    owner: plotOwner.toLowerCase(),
  };
};
