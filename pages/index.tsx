import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import {
  buyPlot, plant, harvest, getUserPlots,
} from '../services/farm';
import Modal from '../components/modal';
import Button from '../components/button';
import { IWalletContext, useWallet } from '../context/wallet';
import plantTypes from '../constants/plantTypes';
import FieldGrid from '../components/fieldGrid';
import PlantModal from '../components/plantModal';
import Spinner from '../components/spinner';

const Home: NextPage = () => {
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [centerX, setCenterX] = useState(2);
  const [centerY, setCenterY] = useState(2);
  const [gridRefreshCounter, setGridRefreshCounter] = useState(0);
  const [gridCenterX, setGridCenterX] = useState(2);
  const [gridCenterY, setGridCenterY] = useState(2);
  const [userPlots, setUserPlots] = useState([] as ({ x: number, y: number })[]);

  const [isBuyPlotModalShown, setIsBuyPlotModalShown] = useState(false);
  const [isPlantModalShown, setIsPlantModalShown] = useState(false);
  const [isHarvestModalShown, setIsHarvestModalShown] = useState(false);
  const [isAlreadyOwnedModalShown, setIsAlreadyOwnedModalShown] = useState(false);

  const onPlotSelect = (
    x: number,
    y: number,
    isOwner: boolean,
    isPlantOwner: boolean,
    isUnminted: boolean,
  ) => {
    selectPlot({ x, y });

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

  const reLoadGrid = async () => {
    setError('');
    setGridCenterX(centerX);
    setGridCenterY(centerY);
    setGridRefreshCounter(gridRefreshCounter + 1);
  };

  const onBuyPlotConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await buyPlot(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    } catch (e) {
      setIsLoading(false);
      setIsBuyPlotModalShown(false);
      setError('Buy failed, check if you have enough USDT funds');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setIsLoading(false);
    setIsBuyPlotModalShown(false);
    reLoadGrid();
  };

  const onPlantConfirm = async (seedType: string) => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await plant(selectedPlot.x, selectedPlot.y, seedType, wallet?.privateKey);
    } catch (e) {
      setIsLoading(false);
      setIsPlantModalShown(false);
      setError('Planting failed, check if you have necessary seed');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setIsLoading(false);
    setIsPlantModalShown(false);
    reLoadGrid();
  };

  const onHarvestConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await harvest(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    } catch (e) {
      setIsLoading(false);
      setIsHarvestModalShown(false);
      setError('Harvest failed :(');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setIsLoading(false);
    setIsHarvestModalShown(false);
    reLoadGrid();
  };

  const hideModal = () => {
    setIsBuyPlotModalShown(false);
    setIsPlantModalShown(false);
    setIsHarvestModalShown(false);
    setIsAlreadyOwnedModalShown(false);
  };

  useEffect(() => {
    if (isWalletLoading || !wallet?.address) { return; }
    reLoadGrid();
    getUserPlots(wallet?.address).then(setUserPlots);
  }, [isWalletLoading, wallet?.address]);

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2">
        <span>Farm fields - coordinates [0-999]</span>
      </div>
      <div className="mb-2">
        { error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="mx-2">
          <label htmlFor="coordinateX">
            X:
            <input
              id="coordinateX"
              name="coordinateX"
              className="input"
              type="number"
              onChange={(e) => setCenterX(parseInt(e.target.value, 10))}
            />
          </label>
        </div>
        <div className="mx-2">
          <label htmlFor="coordinateY">
            Y:
            <input
              id="coordinateY"
              name="coordinateY"
              className="input"
              type="number"
              onChange={(e) => setCenterY(parseInt(e.target.value, 10))}
            />
          </label>
        </div>
        <div>
          <Button onClick={() => reLoadGrid()}>Load</Button>
        </div>
      </div>
      <div className="mt-5">
        <FieldGrid
          centerX={gridCenterX}
          centerY={gridCenterY}
          walletAddress={wallet?.address}
          onError={setError}
          onSelect={onPlotSelect}
          refreshCounter={gridRefreshCounter}
        />
      </div>
      <div className="my-2">
        <div>Color map</div>
        <div className="flex flex-row gap-2">
          <div className="bg-green-200 px-2">Not owned</div>
          <div className="bg-yellow-200 px-2">Owned by Others</div>
          <div className="bg-blue-200 px-2">Yours</div>
        </div>
      </div>
      <div className="mt-8 w-full">
        <h2 className="text-3xl font-bold">Your owned plots</h2>
        {
          userPlots.map((plot) => (
            <div key={plot.x.toString() + plot.y.toString()}>
              {`[X : ${plot.x} Y : ${plot.y}]`}
            </div>
          ))
        }
        {userPlots.length === 0 && (
          <div>You don&apos;t own any plots YET, go take a loan from the bank and buy some!</div>
        )}
      </div>
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
          title="Harvest Potato?"
          description={`You are about to harvest a potato at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText={isLoading ? <Spinner /> : 'Harvest'}
          cancelText="Cancel"
          onConfirm={() => onHarvestConfirm()}
          onCancel={() => hideModal()}
        />
      )}
      {isAlreadyOwnedModalShown
      && (
        <Modal
          title="This plot is owned by another farmer"
          description="Better luck next time"
          confirmText="Okay"
          onConfirm={() => hideModal()}
        />
      )}
    </main>
  );
};

export default Home;
