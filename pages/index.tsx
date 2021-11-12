import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import {
  buyPlot, getPlotInfo, plant, harvest,
} from '../services/farm';
import type { Plot, PlotInfo } from '../services/utils';
import Modal from '../components/modal';
import Button from '../components/button';
import { IWalletContext, useWallet } from '../context/wallet';
import plantTypes from '../constants/plantTypes';

const Home: NextPage = () => {
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();

  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [centerX, setCenterX] = useState(2);
  const [centerY, setCenterY] = useState(2);
  const [grid, setGrid] = useState([] as JSX.Element[]);
  const [gridXAxis, setGridXAxis] = useState([] as JSX.Element[]);
  const [gridYAxis, setGridYAxis] = useState([] as JSX.Element[]);
  const [isBuyPlotModalShown, setIsBuyPlotModalShown] = useState(false);
  const [isPlantModalShown, setIsPlantModalShown] = useState(false);
  const [isHarvestModalShown, setIsHarvestModalShown] = useState(false);

  const onPlotSelect = (x: number, y: number, isOwner: boolean, isPlantOwner: boolean) => {
    selectPlot({ x, y });

    if (!isOwner && !isPlantOwner) {
      setIsBuyPlotModalShown(true);
      return;
    }

    if (isOwner && !isPlantOwner) {
      setIsPlantModalShown(true);
      return;
    }

    // only conditions left are if isPlantOwner is truthy
    setIsHarvestModalShown(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getAllCoordinates = (centerX: number, centerY: number) => {
    const coordinates = [];
    for (let dy = -2; dy < 3; dy += 1) {
      for (let dx = -2; dx < 3; dx += 1) {
        const x = centerX + dx;
        const y = centerY + dy;
        if (x > 999 || y > 999 || x < 0 || y < 0) { continue; }
        coordinates.push({ x: centerX + x, y: centerY + y });
      }
    }
    return coordinates;
  };

  const generateGrid = (plots: Plot[]): JSX.Element[] =>
    plots.map((p: Plot) => {
      const isOwner = p?.owner === wallet?.address;
      const isPlantOwner = p?.plant?.owner === wallet?.address;
      const color = isOwner || isPlantOwner ? 'bg-blue-200' : 'bg-green-200';
      return (
        <button
          type="button"
          className={`flex h-20 w-20 items-center justify-center ${color}`}
          onClick={() => onPlotSelect(p.x, p.y, isOwner, isPlantOwner)}
        >
          { p?.plant?.type || '' }
        </button>
      );
    });

  const generateGridAxis = (center: number, isX: boolean): JSX.Element[] => {
    const axis = [];
    const size = isX ? 'w-20' : 'h-20';
    for (let a = center - 2; a <= center + 2; a += 1) {
      if (a >= 0 && a <= 999) {
        axis.push(
          <div key={a} className={`flex items-center justify-center ${size} `}>
            { a }
          </div>,
        );
      }
    }
    return axis;
  };

  const loadGrid = async () => {
    if (centerX > 999 || centerY > 999 || centerX < 0 || centerY < 0) {
      setError('Invalid coordinates has to be between 999 and 0');
      return;
    }
    setError('');

    setGrid([]);
    setGridYAxis([]);
    setGridXAxis([]);

    const coordinates = getAllCoordinates(centerX, centerY);

    const plotInfo: (PlotInfo | undefined)[] = await Promise.all(
      coordinates.map((c) => getPlotInfo(c.x, c.y)),
    );

    const plots = plotInfo.map((p, i) => {
      let plot: Plot = { ...coordinates[i] };
      if (p?.plant) { plot = { ...plot, plant: p.plant }; }
      if (p?.owner) { plot = { ...plot, owner: p.owner }; }
      return plot;
    });

    setGridXAxis(generateGridAxis(centerX, true));
    setGridYAxis(generateGridAxis(centerY, false));
    setGrid(generateGrid(plots));
  };

  const onBuyPlotConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await buyPlot(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    setIsBuyPlotModalShown(false);
    loadGrid();
  };

  const onPlantConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await plant(selectedPlot.x, selectedPlot.y, plantTypes.POTATO, wallet?.privateKey);
    setIsPlantModalShown(false);
    loadGrid();
  };

  const onHarvestConfirm = async () => {
    if (isWalletLoading || !wallet?.privateKey) { return; }
    await harvest(selectedPlot.x, selectedPlot.y, wallet?.privateKey);
    setIsHarvestModalShown(false);
    loadGrid();
  };

  const hideModal = () => {
    setIsBuyPlotModalShown(false);
    setIsPlantModalShown(false);
    setIsHarvestModalShown(false);
  };

  useEffect(() => {
    if (isWalletLoading || !wallet?.address) { return; }
    loadGrid();
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
          <Button onClick={() => loadGrid()}>Load</Button>
        </div>
      </div>
      <div className="mt-10">
        <div className="grid grid-cols-12">
          <div className="grid-cols-1" />
          <div className={`grid gap-1 col-span-11 grid-cols-${gridXAxis.length}`}>
            { gridXAxis }
          </div>
        </div>
        <div className="grid grid-cols-12">
          <div className="grid col-span-1 grid-cols-1 gap-1">{ gridYAxis }</div>
          <div className={`grid gap-1 col-span-11 grid-cols-${gridXAxis.length}`}>
            { grid }
          </div>
        </div>
        <div className="grid-cols-5 grid-cols-4" />
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
    </main>
  );
};

export default Home;
