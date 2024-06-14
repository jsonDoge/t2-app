import { BigNumber, Contract } from 'ethers';
import getConfig from 'next/config';
import { getContract, waitTx } from './web3Utils';
import { getCoordinatesFromPlotId, getPlotIdFromCoordinates, getSeedAddress } from './utils';
import { CONTRACT_TYPE } from '../utils/constants';
import { PlantState } from '../utils/enums';

const { publicRuntimeConfig } = getConfig();

export const plant = async (x: number, y: number, type: string, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const seedAddress = getSeedAddress(type);

  const seedContract = getContract(seedAddress, CONTRACT_TYPE.ERC20, options);

  await waitTx(seedContract.approve(publicRuntimeConfig.C_FARM, 1));

  const plot: Contract = getContract(publicRuntimeConfig.C_PLOT, CONTRACT_TYPE.PLOT, {
    isSignerRequired: true,
    privateKey,
  });

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(plot.approve(publicRuntimeConfig.C_FARM, plotId));

  const farm: Contract = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, {
    isSignerRequired: true,
    privateKey,
  });
  await waitTx(farm.plant(seedAddress, plotId));
};

export const buyPlot = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, options);

  const stableToken = getContract(publicRuntimeConfig.C_STABLE_TOKEN, CONTRACT_TYPE.ERC20, options);

  await waitTx(stableToken.approve(publicRuntimeConfig.C_FARM, 1));

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(farm.buyPlot(plotId));
};

export const harvest = async (x: number, y: number, privateKey: string) => {
  const options = { isSignerRequired: true, privateKey };
  const farm = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, options);

  const plotId = getPlotIdFromCoordinates(x, y);
  await waitTx(farm.harvest(plotId));
};

export const getUserPlots = async (address: string): Promise<{ x: number; y: number }[]> => {
  const farmContract: Contract = getContract(publicRuntimeConfig.C_FARM, CONTRACT_TYPE.FARM, {
    isSignerRequired: false,
  });
  const plotContract: Contract = getContract(publicRuntimeConfig.C_PLOT, CONTRACT_TYPE.PLOT, {
    isSignerRequired: false,
  });

  const plotsOwnedCount = await plotContract.balanceOf(address);
  const plantsOwned = await farmContract.getUserPlantIds(address);
  let plotsOwned: { x: number; y: number }[] = [];

  const plantCoordinates = plantsOwned.map((p: BigInt) => getCoordinatesFromPlotId(Number(p)));
  plotsOwned = plotsOwned.concat(plantCoordinates);

  for (let i = 0; i <= plotsOwnedCount - 1; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const plotIdBn = await plotContract.tokenOfOwnerByIndex(address, i);
    plotsOwned.push(getCoordinatesFromPlotId(plotIdBn.toNumber()));
  }
  return plotsOwned;
};

// TODO: can be moved to env or fetched from contracts and stored
export const getGrowthBlockDuration = (seedType: string): number =>
  parseInt(publicRuntimeConfig[`${seedType}_GROWTH_DURATION`], 10);

export const getPlantState = (
  currentBlock: BigNumber,
  plantedBlock: BigNumber,
  overgrownBlock: BigNumber,
  growthDuration: BigNumber,
) => {
  if (currentBlock.gte(overgrownBlock)) {
    return PlantState.OVERGROWN;
  }
  if (plantedBlock.sub(currentBlock).abs().gte(growthDuration)) {
    return PlantState.READY;
  }

  return PlantState.GROWING;
};
