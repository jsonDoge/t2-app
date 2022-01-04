/* eslint-disable no-param-reassign */
import React, {
  Suspense, useEffect, useRef, useState,
} from 'react';
import { debounce } from 'lodash';
import { Canvas } from '@react-three/fiber';
import Grid from './three/grid';
import { IGridContext, useGrid } from '../context/grid';
import Modal from './modal';
import { getPlotInfos } from '../services/farm';
import { convertCenterToUpperLeftCorner, Plot, PlotInfo } from '../services/utils';
import { getAllCoordinatesAround } from '../utils';
import { IWalletContext, useWallet } from '../context/wallet';
import { MappedPlots } from './three/utils/interfaces';

const Background: React.FC<{}> = () => {
  // const { isLoading }: IGridContext = useGrid();
  const { isLoading: isWalletLoading, wallet }: IWalletContext = useWallet();
  const { center }: IGridContext = useGrid();

  const mappedPlots = useRef<MappedPlots>({});
  const [gridXAxis, setGridXAxis] = useState([]);
  const [gridYAxis, setGridYAxis] = useState([]);
  const [selectedPlot, selectPlot] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // modals
  const [isAlreadyOwnedModalShown, setIsAlreadyOwnedModalShown] = useState(false);

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
      };

      return mp;
    }, {});

  const loadGrid = async (centerX: number, centerY: number) => {
    if (centerX > 997 || centerY > 997 || centerX < 2 || centerY < 2) {
      setError('Invalid center coordinates has to be between 997 and 2');
      return;
    }
    setIsLoading(true);

    mappedPlots.current = {};
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

    mappedPlots.current = mapPlotInfo(plots);
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

  useEffect(() => {
    loadGrid(center.x, center.y);
  }, []);

  return (
    <>
      <Canvas shadows className="min-h-screen w-screen">
        <Suspense fallback={(<>Loading...</>)}>
          <Grid
            onPlotSelect={onPlotSelect}
            mappedPlots={mappedPlots}
            center={center}
            onCenterMove={debounce(loadGrid, 1000)}
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
