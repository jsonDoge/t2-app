/* eslint-disable no-param-reassign */
import React, {
  Suspense, useEffect, useRef, useState,
} from 'react';
import { debounce } from 'lodash';
import { Canvas } from '@react-three/fiber';
import Grid from './three/grid';
import { IGridContext, useGrid } from '../context/grid';
import Modal from './modal';
import {
  buyPlot, getPlotInfos, harvest, plant,
} from '../services/farm';
import { convertCenterToUpperLeftCorner, Plot, PlotInfo } from '../services/utils';
import { getAllCoordinatesAround } from '../utils';
import { IWalletContext, useWallet } from '../context/wallet';
import { MappedPlots } from './three/utils/interfaces';
import Spinner from './spinner';
import PlantModal from './plantModal';
import plantTypes from '../constants/plantTypes';
import { getDefaultPlotColor, getPlotColor } from './three/utils/plotColors';

const Background: React.FC<{}> = () => {
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();
  const { centerRef, subscribeToCenter }: IGridContext = useGrid();

  const coordinates = getAllCoordinatesAround(3, 3);
  const generateEmptyPlots = (coords) =>
    coords.reduce((mp: MappedPlots, c: { x: number, y: number }) => {
      if (!mp[c.x]) {
        mp[c.x] = {};
      }

      mp[c.x][c.y] = {
        color: getDefaultPlotColor(),
      };
      return mp;
    }, {});

  const mappedPlots = useRef(generateEmptyPlots(coordinates));

  // TODO: show axis
  // const [gridXAxis, setGridXAxis] = useState([]);
  // const [gridYAxis, setGridYAxis] = useState([]);

  const isMappedPlotsEmpty = useRef(true);
  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });

  // TODO: show errors
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // modals
  const [isAlreadyOwnedModalShown, setIsAlreadyOwnedModalShown] = useState(false);
  const [isBuyPlotModalShown, setIsBuyPlotModalShown] = useState(false);
  const [isPlantModalShown, setIsPlantModalShown] = useState(false);
  const [isHarvestModalShown, setIsHarvestModalShown] = useState(false);

  const mapPlotInfo = (plots: Plot[]): MappedPlots =>
    plots.reduce((mp: MappedPlots, plot: Plot) => {
      const isOwner = plot?.owner === wallet?.address;
      const isPlantOwner = plot?.plant?.owner === wallet?.address;
      const isUnminted = !plot?.owner && !plot?.plant?.owner;

      if (!mp[plot.x]) {
        mp[plot.x] = {};
      }

      mp[plot.x][plot.y] = {
        isOwner,
        isPlantOwner,
        isUnminted,
        plantType: plot?.plant?.type,
        color: getPlotColor(isOwner, isPlantOwner, isUnminted),
      };

      return mp;
    }, {});

  const resetGrid = () => {
    if (isMappedPlotsEmpty.current) { return; }
    mappedPlots.current = generateEmptyPlots(coordinates);
    isMappedPlotsEmpty.current = true;
  };

  const loadGrid = async (centerX: number, centerY: number) => {
    if (centerX > 997 || centerY > 997 || centerX < 2 || centerY < 2) {
      setError('Invalid center coordinates has to be between 997 and 2');
      return;
    }

    console.info('LOAD GRID');

    // setIsLoading(true);

    // mappedPlots.current = {};
    // setGridYAxis([]);
    // setGridXAxis([]);

    const { x: cornerX, y: cornerY } = convertCenterToUpperLeftCorner(centerX, centerY);

    const plotInfo: (PlotInfo | undefined)[] = await getPlotInfos(cornerX, cornerY);

    const plots = plotInfo.map((p, i) => {
      let plot: Plot = { ...coordinates[i] };
      if (p?.plant) { plot = { ...plot, plant: p.plant }; }
      if (p?.owner) { plot = { ...plot, owner: p.owner }; }
      return plot;
    });

    mappedPlots.current = mapPlotInfo(plots);
    isMappedPlotsEmpty.current = false;

    // setIsLoading(false);
  };

  const onPlotSelect = (
    x: number,
    y: number,
  ) => {
    selectPlot({ x, y });
    const absoluteX = (x - (centerRef.current.x - 3));
    const absoluteY = (y - (centerRef.current.y - 3));

    const {
      isUnminted,
      isPlantOwner,
      isOwner,
    } = mappedPlots?.current?.[absoluteX]?.[absoluteY];
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

  const onBuyPlotConfirm = async () => {
    setError('');
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    console.log('onBuyPlotConfirm ~ selectedPlot', selectedPlot);
    try {
      await buyPlot(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    } catch (e) {
      setIsLoading(false);
      setIsBuyPlotModalShown(false);
      setError('Buy failed, check if you have enough USDT funds');
      return;
    }
    setIsLoading(false);
    setIsBuyPlotModalShown(false);
    // getUserPlots(wallet?.address).then(setUserPlots);
    loadGrid(centerRef.current.x, centerRef.current.y);
  };

  const onPlantConfirm = async (seedType: string) => {
    setError('');
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await plant(selectedPlot.x, selectedPlot.y, seedType, wallet?.privateKey);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsPlantModalShown(false);
      setError('Planting failed, check if you have necessary seed');
      return;
    }
    setIsLoading(false);
    setIsPlantModalShown(false);
    loadGrid(centerRef.current.x, centerRef.current.y);
  };

  const onHarvestConfirm = async () => {
    setError('');
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await harvest(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsHarvestModalShown(false);
      setError('Harvest failed :(');
      return;
    }
    setIsLoading(false);
    setIsHarvestModalShown(false);
    loadGrid(centerRef.current.x, centerRef.current.y);
  };

  useEffect(() => {
    loadGrid(centerRef.current.x, centerRef.current.y);
  }, []);

  const debouncedLoadGrid = debounce(loadGrid, 2000);

  return (
    <>
      <Canvas shadows className="min-h-screen w-screen">
        <Suspense fallback={(<>Loading...</>)}>
          <Grid
            onPlotSelect={onPlotSelect}
            mappedPlots={mappedPlots}
            centerRef={centerRef}
            onCenterMove={(x: number, y: number) => {
              resetGrid();
              debouncedLoadGrid(x, y);
            }}
            subscribeToCenter={subscribeToCenter}
          />
        </Suspense>
      </Canvas>
      {isAlreadyOwnedModalShown
      && (
        <Modal
          title="This plot is owned by another farmer"
          description="Better luck next time"
          confirmText="Okay"
          onConfirm={() => hideModal()}
        />
      )}
      {isBuyPlotModalShown
      && (
        <Modal
          title="Buy land plot?"
          description={`You are about to buy plot located at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Buy'}
          cancelText="Cancel"
          onConfirm={() => onBuyPlotConfirm()}
          onCancel={() => hideModal()}
        />
      )}
      {isPlantModalShown
      && (
        <PlantModal
          title="Plant seed?"
          seedTypes={Object.values(plantTypes)}
          description={`You are about to plant at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Plant'}
          cancelText="Regret forever"
          onConfirm={(seedType) => onPlantConfirm(seedType)}
          onCancel={() => hideModal()}
        />
      )}
      {isHarvestModalShown
      && (
        <Modal
          title="Harvest?"
          description={`You are about to harvest at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Harvest'}
          cancelText="Cancel"
          onConfirm={() => onHarvestConfirm()}
          onCancel={() => hideModal()}
        />
      )}
    </>
  );
};

export default Background;
