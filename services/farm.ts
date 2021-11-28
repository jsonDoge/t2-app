import { Contract, BigNumber } from 'ethers';
import getConfig from 'next/config';

// services
import { getContract, waitTx } from './web3Utils';
import {
  getCoordinatesFromPlotId,
  getPlotIdFromCoordinates,
  getSeedAddress,
  PlotInfo,
} from './utils';

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

  await waitTx(seedContract.approve(publicRuntimeConfig.C_FARM, 1));

  const plot: Contract = getContract(
    publicRuntimeConfig.C_PLOT, ContractTypes.PLOT, { isSignerRequired: true, privateKey },
  );

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(plot.approve(publicRuntimeConfig.C_FARM, plotId));

  const farm: Contract = getContract(
    publicRuntimeConfig.C_FARM, ContractTypes.FARM, { isSignerRequired: true, privateKey },
  );
  await waitTx(farm.plant(seedAddress, plotId));
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

  await waitTx(stableToken.approve(publicRuntimeConfig.C_FARM, 1));

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(farm.buyPlot(plotId));
};

export const harvest = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(
    publicRuntimeConfig.C_FARM,
    ContractTypes.FARM,
    options,
  );

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(farm.harvest(plotId));
};

export const getUserPlots = async (address: string): Promise<({ x: number, y: number })[]> => {
  const farmContract: Contract = getContract(
    publicRuntimeConfig.C_FARM, ContractTypes.FARM, { isSignerRequired: false },
  );
  const plotContract: Contract = getContract(
    publicRuntimeConfig.C_PLOT, ContractTypes.PLOT, { isSignerRequired: false },
  );

  const plotsOwnedCount = await plotContract.balanceOf(address);
  const plantsOwned = await farmContract.getUserPlantIds(address);
  let plotsOwned: ({ x: number, y: number })[] = [];

  const plantCoordinates = plantsOwned
    .map((p: BigNumber) => getCoordinatesFromPlotId(p.toNumber()));
  plotsOwned = plotsOwned.concat(plantCoordinates);

  for (let i = 0; i <= plotsOwnedCount - 1; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const plotIdBn = await plotContract.tokenOfOwnerByIndex(address, i);
    plotsOwned.push(getCoordinatesFromPlotId(plotIdBn.toNumber()));
  }
  return plotsOwned;
};

export const getPlotInfos = async (x: number, y: number): Promise<((PlotInfo | undefined)[])> => {
  const farm: Contract = getContract(
    publicRuntimeConfig.C_FARM, ContractTypes.FARM, { isSignerRequired: false },
  );

  const plotId = getPlotIdFromCoordinates(x, y);

  const plots = await farm.getPlotView(plotId);

  return plots.map((p: any) => {
    if (p.owner === '0x0000000000000000000000000000000000000000') { return undefined; }

    const plantType: string = Object.values(PlantTypes)
      .filter((t) => publicRuntimeConfig[`C_${t}_SEED`]?.toLowerCase() === p.plant.seed.toLowerCase())[0];

    return {
      owner: p.owner.toLowerCase(),
      plant: {
        type: plantType,
        owner: p.plant.owner.toLowerCase(),
      },
    };
  });
};

// Depricated inefficient way
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
  // eslint-disable-next-line no-empty
  } catch (e) { }

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
