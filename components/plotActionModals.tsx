/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import getConfig from 'next/config';

// components
import { buyPlot, harvest, plant } from '../services/farm';
import PlantModal from './plantModal';
import Spinner from './spinner';
import PlotModal from './plotModal';

// context
import { useWallet } from '../context/wallet';
import { useGame } from '../context/game';
import { useBlockchain } from '../context/blockchain';
import { useError } from '../context/error';
import { selectPlotStore } from '../stores';

// interfaces
import { Coordinates, PlotInfo } from './game/utils/interfaces';

// constants
import { SEED_TYPE, SeedType } from '../utils/constants';
import { calculateSeason, getSeasonSeedTypes } from './game/utils/seasons';

const { publicRuntimeConfig } = getConfig();

const mapSeedTypeToWaterRequired = (seedType?: SeedType) => {
  switch (seedType) {
    case SEED_TYPE.CARROT:
      return parseInt(publicRuntimeConfig.CARROT_MIN_WATER || '0', 10);
    case SEED_TYPE.CORN:
      return parseInt(publicRuntimeConfig.CORN_MIN_WATER || '0', 10);
    case SEED_TYPE.POTATO:
      return parseInt(publicRuntimeConfig.POTATO_MIN_WATER || '0', 10);
    default:
      return undefined;
  }
};

const mapSeedTypeToGrowthDuration = (seedType?: SeedType) => {
  switch (seedType) {
    case SEED_TYPE.CARROT:
      return parseInt(publicRuntimeConfig.CARROT_GROWTH_DURATION || '0', 10);
    case SEED_TYPE.CORN:
      return parseInt(publicRuntimeConfig.CORN_GROWTH_DURATION || '0', 10);
    case SEED_TYPE.POTATO:
      return parseInt(publicRuntimeConfig.POTATO_GROWTH_DURATION || '0', 10);
    default:
      return undefined;
  }
};

const PlotActionModals: React.FC = () => {
  const { wallet } = useWallet();
  const { currentBlock } = useBlockchain();
  const { uiActionCompleted } = useGame();
  const { setError } = useError();

  // TODO: show errors
  const [isLoading, setIsLoading] = useState(false);

  // modals
  const [isAlreadyOwnedModalShown, setIsAlreadyOwnedModalShown] = useState(false);
  const [isBuyPlotModalShown, setIsBuyPlotModalShown] = useState(false);
  const [isPlantModalShown, setIsPlantModalShown] = useState(false);
  const [isHarvestModalShown, setIsHarvestModalShown] = useState(false);
  const [seasonSeedTypes, setSeasonSeedTypes] = useState<SeedType[]>([]);
  const [waterLevel, setWaterLevel] = useState(0);
  const [waterRequired, setWaterRequired] = useState<number | undefined>(undefined);
  const [blocksGrown, setBlocksGrown] = useState<number | undefined>(undefined);
  const [blocksRequired, setBlockRequired] = useState<number | undefined>(undefined);
  const [plantedOnBlock, setPlantedOnBlock] = useState<number | undefined>(undefined);
  const [blocksTillOvergrown, setBlocksTillOvergrown] = useState<number | undefined>(undefined);
  const [waterAbsorbed, setWaterAbsorbed] = useState<number | undefined>(undefined);
  const [selectedCoords, setSelectedCoords] = useState<Coordinates>();

  const onPlotSelect = (x: number, y: number, plotInfo: PlotInfo, currentBlock_: number) => {
    setSelectedCoords({ x, y });
    setWaterLevel(plotInfo.waterLevel);
    setWaterAbsorbed(plotInfo.waterAbsorbed);
    setWaterRequired(mapSeedTypeToWaterRequired(plotInfo.seedType as SeedType));
    // the game can lag behind the current block, so we need to make sure the plotsGrown is not negative
    setBlocksGrown(plotInfo?.plantedBlockNumber ? Math.max(currentBlock_ - plotInfo.plantedBlockNumber, 0) : undefined);
    setBlockRequired(mapSeedTypeToGrowthDuration(plotInfo.seedType as SeedType));

    setBlocksTillOvergrown(
      plotInfo.overgrownBlockNumber ? Math.max(plotInfo.overgrownBlockNumber - currentBlock_, 0) : undefined,
    );
    setPlantedOnBlock(plotInfo.plantedBlockNumber);

    setSeasonSeedTypes(
      getSeasonSeedTypes(calculateSeason(currentBlock_, parseInt(publicRuntimeConfig.SEASON_DURATION_BLOCKS, 10))),
    );

    const { isUnminted, isPlantOwner, isOwner } = plotInfo;

    if (isUnminted) {
      setIsBuyPlotModalShown(true);
      return;
    }

    if (isOwner && !isPlantOwner) {
      setIsPlantModalShown(true);
      return;
    }

    if (isPlantOwner) {
      setIsHarvestModalShown(true);
      return;
    }

    // only condition left is either !isUnminted && !isOwner && !isPlantOwner
    setIsAlreadyOwnedModalShown(true);
  };

  const hideModal = () => {
    setIsBuyPlotModalShown(false);
    setIsPlantModalShown(false);
    setIsHarvestModalShown(false);
    setIsAlreadyOwnedModalShown(false);
  };

  const onModalConfirm = async (
    fn: (walletPrivateKey: string) => Promise<any>,
    onFinish: () => void,
    errorMessage: string,
  ) => {
    setError('');
    if (!wallet?.privateKey) {
      setError('Wallet not loaded yet... Please try again later');
      return;
    }
    setIsLoading(true);
    try {
      await fn(wallet.privateKey);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      onFinish();
      setError(errorMessage);
      return;
    }
    setIsLoading(false);
    onFinish();
    uiActionCompleted();
  };

  const defaultBuyErrorMessage = 'Buy failed, check if you have enough USDT funds';
  const onBuyPlotConfirm = async (coords: Coordinates) =>
    onModalConfirm(
      (walletPrivateKey: string) => buyPlot(coords.x, coords.y, walletPrivateKey),
      () => setIsBuyPlotModalShown(false),
      defaultBuyErrorMessage,
    );

  const defaultPlantErrorMessage = 'Planting failed, check if you have necessary seed';
  const onPlantConfirm = async (coords: Coordinates, seedType_: string) =>
    onModalConfirm(
      (walletPrivateKey: string) => plant(coords.x, coords.y, seedType_, walletPrivateKey),
      () => setIsPlantModalShown(false),
      defaultPlantErrorMessage,
    );

  const defaultHarvestErrorMessage = 'Harvest failed :(';
  const onHarvestConfirm = async (coords: Coordinates) =>
    onModalConfirm(
      (walletPrivateKey: string) => harvest(coords.x, coords.y, walletPrivateKey),
      () => setIsHarvestModalShown(false),
      defaultHarvestErrorMessage,
    );

  useEffect(
    () =>
      selectPlotStore.onChange(({ x, y, plotInfo }) => {
        onPlotSelect(x, y, plotInfo, currentBlock);
      }),
    [currentBlock],
  );

  return (
    <>
      {/* TODO: probably a good idea to create separate modals for each action - split into self-contained components */}
      {isAlreadyOwnedModalShown && (
        <PlotModal
          title="This plot is owned by another farmer 🛑"
          description="Better luck next time"
          confirmText="Okay"
          onConfirm={() => hideModal()}
          waterLevel={waterLevel}
        />
      )}
      {isBuyPlotModalShown && selectedCoords && (
        <PlotModal
          title="Buy land plot? 💸"
          description={`You are about to buy plot located at [X : ${selectedCoords.x} | Y : ${selectedCoords.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Buy'}
          cancelText="Cancel"
          onConfirm={() => onBuyPlotConfirm(selectedCoords)}
          onCancel={() => hideModal()}
          waterLevel={waterLevel}
        />
      )}
      {isPlantModalShown && selectedCoords && (
        <PlantModal
          title="Plant seed? 🌱"
          seedTypes={Object.values(SEED_TYPE)}
          seasonSeedTypes={seasonSeedTypes}
          description={`You are about to plant at [X : ${selectedCoords.x} | Y : ${selectedCoords.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Plant'}
          cancelText="Regret forever"
          onConfirm={(seedType_) => onPlantConfirm(selectedCoords, seedType_)}
          onCancel={() => hideModal()}
          waterLevel={waterLevel}
        />
      )}
      {isHarvestModalShown && selectedCoords && (
        <PlotModal
          title="Harvest? 👨‍🌾"
          description={`You are about to harvest at [X : ${selectedCoords.x} | Y : ${selectedCoords.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Harvest'}
          cancelText="Cancel"
          onConfirm={() => onHarvestConfirm(selectedCoords)}
          onCancel={() => hideModal()}
          waterAbsorbed={waterAbsorbed}
          waterLevel={waterLevel}
          waterRequired={waterRequired}
          blocksGrown={blocksGrown}
          blocksRequired={blocksRequired}
          plantedOnBlock={plantedOnBlock}
          blocksTillOvergrown={blocksTillOvergrown}
        />
      )}
    </>
  );
};

export default PlotActionModals;
