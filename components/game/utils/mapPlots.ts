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

        // plant
        seedType: undefined,
        plantState: undefined,
        waterAbsorbed: undefined,
        plantedBlockNumber: undefined,
        overgrownBlockNumber: undefined,

        // plot
        color: getPlotColor(isOwner, isPlantOwner, isUnminted),
        lastStateChangeBlock: plot.waterLog?.blockNumber?.toNumber() || 0,
        waterLevel: plot.waterLog?.waterLevel?.toNumber() || parseInt(publicRuntimeConfig.PLOT_MAX_WATER, 10),
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

        // plant
        seedType: undefined,
        plantState: undefined,
        waterAbsorbed: undefined,
        plantedBlockNumber: undefined,
        overgrownBlockNumber: undefined,

        // plot
        color: getPlotColor(isOwner, isPlantOwner, isUnminted),
        lastStateChangeBlock: plot.waterLog?.blockNumber?.toNumber() || 0,
        waterLevel: plot.waterLog?.waterLevel?.toNumber() || parseInt(publicRuntimeConfig.PLOT_MAX_WATER, 10),
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

      // plant
      seedType,
      plantState,
      waterAbsorbed: plot.plant.waterAbsorbed,
      plantedBlockNumber: plot.plant.plantedBlockNumber.toNumber(),
      overgrownBlockNumber: plot.plant.overgrownBlockNumber.toNumber(),

      // plot
      color: getPlotColor(isOwner, isPlantOwner, isUnminted),
      lastStateChangeBlock: plot.waterLog?.blockNumber?.toNumber() || 0,
      waterLevel: plot.waterLog?.waterLevel?.toNumber() || parseInt(publicRuntimeConfig.PLOT_MAX_WATER, 10),
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

          // plant
          seedType: undefined,
          plantState: undefined,
          waterAbsorbed: undefined,
          plantedBlockNumber: undefined,
          overgrownBlockNumber: undefined,
          // plot
          color: getDefaultPlotColor(),
          lastStateChangeBlock: 0,
          waterLevel: parseInt(publicRuntimeConfig.PLOT_MAX_WATER, 10),
        },
      },
    }),
    {},
  );
