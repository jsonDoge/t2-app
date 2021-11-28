import React, { useEffect, useState } from 'react';
import plantTypes from '../constants/plantTypes';
import { getPlotInfos } from '../services/farm';
import { convertCenterToUpperLeftCorner, Plot, PlotInfo } from '../services/utils';
import Spinner from './spinner';

interface Props {
  centerX: number,
  centerY: number,
  walletAddress: string | undefined,
  refreshCounter: number,
  onSelect: (
    x: number,
    y: number,
    isOwner: boolean,
    isPlantOwner: boolean,
    isUnminted: boolean
  ) => void,
  onError: (error: string) => void,
}

const FieldGrid: React.FC<Props> = ({
  centerX, centerY, walletAddress, refreshCounter, onSelect, onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [grid, setGrid] = useState([] as JSX.Element[]);
  const [gridXAxis, setGridXAxis] = useState([] as JSX.Element[]);
  const [gridYAxis, setGridYAxis] = useState([] as JSX.Element[]);

  const getPlantTypeEmoji = (plantType: string) => {
    switch (plantType) {
      case plantTypes.POTATO:
        return '🥔🥔🥔🥔🥔';
      case plantTypes.CARROT:
        return '🥕🥕🥕🥕🥕';
      case plantTypes.CORN:
        return '🌽🌽🌽🌽🌽';
      default:
        return '';
    }
  };

  const getAllCoordinatesAround = (x: number, y: number) => {
    const coordinates = [];
    for (let dy = -2; dy < 3; dy += 1) {
      for (let dx = -2; dx < 3; dx += 1) {
        const sumX = x + dx;
        const sumY = y + dy;
        if (sumX > 999 || sumY > 999 || sumX < 0 || sumY < 0) { continue; }
        coordinates.push({ x: sumX, y: sumY });
      }
    }
    return coordinates;
  };

  const generateGrid = (plots: Plot[]): JSX.Element[] =>
    plots.map((p: Plot) => {
      const isOwner = p?.owner === walletAddress;
      const isPlantOwner = p?.plant?.owner === walletAddress;
      const isUnminted = !p?.owner && !p?.plant?.owner;
      let color = 'bg-green-200';
      if (isOwner || isPlantOwner) {
        color = 'bg-blue-200';
      } else if (!isUnminted) {
        color = 'bg-yellow-200';
      }
      return (
        <button
          key={`${p.x}${p.y}`}
          type="button"
          className={`flex h-20 w-20 items-center justify-center ${color}`}
          onClick={() => onSelect(p.x, p.y, isOwner, isPlantOwner, isUnminted)}
        >
          { p?.plant?.type ? getPlantTypeEmoji(p?.plant?.type) : '' }
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
    if (centerX > 997 || centerY > 997 || centerX < 2 || centerY < 2) {
      onError('Invalid center coordinates has to be between 997 and 2');
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

    setGridXAxis(generateGridAxis(centerX, true));
    setGridYAxis(generateGridAxis(centerY, false));
    setGrid(generateGrid(plots));
    setIsLoading(false);
  };

  useEffect(() => {
    if (!walletAddress) { return; }
    loadGrid();
  }, [centerX, centerY, walletAddress, refreshCounter]);

  return (
    <div>
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
          { isLoading && <div className="flex flex-col justify-center h-96"><Spinner /></div>}
        </div>
      </div>
      <div className="grid-cols-5 grid-cols-4" />
    </div>
  );
};

export default FieldGrid;
