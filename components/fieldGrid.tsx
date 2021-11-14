import React, { useEffect, useState } from 'react';
import { getPlotInfo } from '../services/farm';
import { Plot, PlotInfo } from '../services/utils';

interface Props {
  centerX: number,
  centerY: number,
  walletAddress: string | undefined,
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
  centerX, centerY, walletAddress, onSelect, onError,
}) => {
  const [grid, setGrid] = useState([] as JSX.Element[]);
  const [gridXAxis, setGridXAxis] = useState([] as JSX.Element[]);
  const [gridYAxis, setGridYAxis] = useState([] as JSX.Element[]);

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
      onError('Invalid coordinates has to be between 999 and 0');
      return;
    }

    setGrid([]);
    setGridYAxis([]);
    setGridXAxis([]);

    const coordinates = getAllCoordinatesAround(centerX, centerY);

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

  useEffect(() => {
    if (!walletAddress) { return; }
    loadGrid();
  }, [centerX, centerY, walletAddress]);

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
        </div>
      </div>
      <div className="grid-cols-5 grid-cols-4" />
    </div>
  );
};

export default FieldGrid;
