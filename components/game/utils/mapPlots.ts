import getConfig from 'next/config';
import { BigNumber } from 'ethers';
import { getGrowthBlockDuration, getPlantState } from '../../../services/farm';
import { SEED_TYPE } from '../../../utils/constants';
import { Coordinates, MappedPlotInfos } from './interfaces';
import { getDefaultPlotColor, getPlotColor } from './plotColors';

const { publicRuntimeConfig } = getConfig();

export const reduceContractPlots = (
  contractPlots: any[],
  currentBlock: number,
  walletAddress: string,
): MappedPlotInfos =>
  contractPlots.reduce((mp: MappedPlotInfos, plot: any, i) => {
    const plotCoords = { x: i % 7, y: Math.floor(i / 7) };

    const updatedMp = {
      ...mp,
      [plotCoords.x]: {
        ...mp[plotCoords.x],
      },
    };

    if (plot.owner === '0x0000000000000000000000000000000000000000') {
      const isOwner = false;
      const isPlantOwner = false;
      const isUnminted = true;

      updatedMp[plotCoords.x][plotCoords.y] = {
        isOwner: false,
        isPlantOwner: false,
        isUnminted: true,
        seedType: undefined,
        state: undefined,
        color: getPlotColor(isOwner, isPlantOwner, isUnminted),
        waterLevel: 0,
        waterAbsorbed: undefined,
      };

      return updatedMp;
    }

    const isOwner = plot.owner.toLowerCase() === walletAddress;
    const isPlantOwner = plot?.plant?.owner?.toLowerCase() === walletAddress;
    const isUnminted = false;

    const seedType: string = Object.values(SEED_TYPE).filter(
      (t) => publicRuntimeConfig[`C_${t}_SEED`]?.toLowerCase() === plot.plant.seed.toLowerCase(),
    )[0];

    if (!seedType) {
      updatedMp[plotCoords.x][plotCoords.y] = {
        isOwner,
        isPlantOwner,
        isUnminted,
        seedType: undefined,
        state: undefined,
        color: getPlotColor(isOwner, isPlantOwner, isUnminted),
        waterLevel: 0,
        waterAbsorbed: undefined,
      };

      return updatedMp;
    }

    const growthBlockDuration = getGrowthBlockDuration(seedType);

    const plantState = getPlantState(
      BigNumber.from(currentBlock),
      plot.plant.plantedBlockNumber,
      plot.plant.overgrownBlockNumber,
      BigNumber.from(growthBlockDuration),
    );

    updatedMp[plotCoords.x][plotCoords.y] = {
      isOwner,
      isPlantOwner,
      isUnminted,
      seedType,
      state: plantState,
      color: getPlotColor(isOwner, isPlantOwner, isUnminted),
      waterLevel: 0,
      waterAbsorbed: plot.plant.waterAbsorbed,
    };

    return updatedMp;
  }, {});

// eslint-disable-next-line import/prefer-default-export
export const generateEmptyMappedPlotInfos = (coords: Coordinates[]): MappedPlotInfos =>
  coords.reduce(
    (mpi: MappedPlotInfos, c: Coordinates) => ({
      ...mpi,
      [c.x]: {
        ...mpi[c.x],
        [c.y]: {
          isOwner: false,
          isPlantOwner: false,
          isUnminted: true,
          seedType: undefined,
          state: undefined,
          color: getDefaultPlotColor(),
          waterLevel: 0,
          waterAbsorbed: undefined,
        },
      },
    }),
    {},
  );
