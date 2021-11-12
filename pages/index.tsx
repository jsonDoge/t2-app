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

const Home: NextPage = () => {
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();

  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [centerX, setCenterX] = useState(2);
  const [centerY, setCenterY] = useState(2);
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
  };

  const onBuyPlotConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await buyPlot(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    setIsBuyPlotModalShown(false);
    reLoadGrid();
  };

  const onPlantConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await plant(selectedPlot.x, selectedPlot.y, plantTypes.POTATO, wallet?.privateKey);
    setIsPlantModalShown(false);
    reLoadGrid();
  };

  const onHarvestConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await harvest(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
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
        <span>Farm field coordinates</span>
      </div>
      <div className="mb-2">
        { error && <span className="text-red-500">{error}</span>}
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
      <FieldGrid
        centerX={gridCenterX}
        centerY={gridCenterY}
        walletAddress={wallet?.address}
        onError={setError}
        onSelect={onPlotSelect}
      />
      <div className="mt-5 w-full border-t border-blue-200">
        <h2 className="text-3xl font-bold">Your owned plots</h2>
        {
          userPlots.map((plot) => (
            <div>
              {`[X : ${plot.x} Y : ${plot.y}]`}
            </div>
          ))
        }
      </div>
      {isBuyPlotModalShown
      && (
        <Modal
          title="Buy land plot?"
          description={`You are about to buy plot located at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText="Buy"
          cancelText="Cancel"
          onConfirm={() => onBuyPlotConfirm()}
          onCancel={() => hideModal()}
        />
      )}
      {isPlantModalShown
      && (
        <Modal
          title="Plant Potato?"
          description={`You are about to plant a potato at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText="Plant"
          cancelText="Regret forever"
          onConfirm={() => onPlantConfirm()}
          onCancel={() => hideModal()}
        />
      )}
      {isHarvestModalShown
      && (
        <Modal
          title="Harvest Potato?"
          description={`You are about to harvest a potato at [X : ${selectedPlot.x} | Y : ${selectedPlot.y}]`}
          confirmText="Harvest"
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
