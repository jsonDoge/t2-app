import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Grid from './three/grid';
import { IGridContext, useGrid } from '../context/grid';
import Modal from './modal';
import { getPlotInfos } from '../services/farm';
import { convertCenterToUpperLeftCorner, Plot, PlotInfo } from '../services/utils';
import { getAllCoordinatesAround } from '../utils';
import { IWalletContext, useWallet } from '../context/wallet';

interface MappedPlot {
  x: number,
  y: number,
  isOwner: boolean,
  isPlantOwner: boolean,
  isUnminted: boolean,
  plantType: string | undefined
}

const Background: React.FC<{}> = () => {
  // const { isLoading }: IGridContext = useGrid();
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();
  const { center }: IGridContext = useGrid();

  const [grid, setGrid] = useState([] as MappedPlot[]);
  const [gridXAxis, setGridXAxis] = useState([]);
  const [gridYAxis, setGridYAxis] = useState([]);
  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // modals
  const [isAlreadyOwnedModalShown, setIsAlreadyOwnedModalShown] = useState(false);

  const generateGrid = (plots: Plot[]): Array<MappedPlot> =>
    plots.map((p: Plot) => {
      const isOwner = p?.owner === wallet?.address;
      const isPlantOwner = p?.plant?.owner === wallet?.address;
      const isUnminted = !p?.owner && !p?.plant?.owner;
      let color = 'bg-green-200';
      if (isOwner || isPlantOwner) {
        color = 'bg-blue-200';
      } else if (!isUnminted) {
        color = 'bg-yellow-200';
      }
      return {
        x: p.x,
        y: p.y,
        isOwner,
        isPlantOwner,
        isUnminted,
        plantType: p?.plant?.type,
      };
    });

  const loadGrid = async (centerX: number, centerY: number) => {
    if (centerX > 997 || centerY > 997 || centerX < 2 || centerY < 2) {
      setError('Invalid center coordinates has to be between 997 and 2');
      return;
    }
    setIsLoading(true);

    setGrid([]);
    setGridYAxis([]);
    setGridXAxis([]);

    const { x: cornerX, y: cornerY } = convertCenterToUpperLeftCorner(centerX, centerY);
    const coordinates = getAllCoordinatesAround(centerX, centerY);

    const plotInfo: (PlotInfo | undefined)[] = await getPlotInfos(cornerX, cornerY);

    // const plotInfo: (PlotInfo | undefined)[] = await Promise.all(
    //   coordinates.map((c) => getPlotInfo(c.x, c.y)),
    // );

    const plots = plotInfo.map((p, i) => {
      let plot: Plot = { ...coordinates[i] };
      if (p?.plant) { plot = { ...plot, plant: p.plant }; }
      if (p?.owner) { plot = { ...plot, owner: p.owner }; }
      return plot;
    });

    setGrid(generateGrid(plots));
    setIsLoading(false);
  };

  const onPlotSelect = (
    x: number,
    y: number,
    isOwner: boolean,
    isPlantOwner: boolean,
    isUnminted: boolean,
  ) => {
    console.log(x);
    console.log(y);
    selectPlot({ x, y });

    // if (isUnminted) {
    //   setIsBuyPlotModalShown(true);
    //   return;
    // }

    // if (isOwner && !isPlantOwner) {
    //   setIsPlantModalShown(true);
    //   return;
    // }

    // if (isPlantOwner) {
    //   setIsHarvestModalShown(true);
    //   return;
    // }

    // only condition left is either !isUnminted && !isOwner && !isPlantOwner
    setIsAlreadyOwnedModalShown(true);
  };

  const hideModal = () => {
    // setIsBuyPlotModalShown(false);
    // setIsPlantModalShown(false);
    // setIsHarvestModalShown(false);
    setIsAlreadyOwnedModalShown(false);
  };

  return (
    <>
      <Canvas shadows className="min-h-screen w-screen">
        <Suspense fallback={(<>Loading...</>)}>
          <Grid
            onPlotSelect={onPlotSelect}
            center={center}
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
    </>
  );
};

export default Background;
