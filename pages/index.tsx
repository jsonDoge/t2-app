import React from 'react';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { getPlotInfo } from '../services/farm';
import type { Plant } from '../services/farm';

const Home: NextPage = () => {
  const getAllCoordinates = (centerX: number, centerY: number) => {
    let coordinates = []
    for (let y = -2; y < 3; y += 1) {
      for (let x = -2; x < 3; x += 1) {
        const cx = centerX + x;
        const cy = centerY + y
        if (cx > 999 || y > 999 || cx < 0 || cy < 0) { continue; }
        coordinates.push({ x: centerX + x, y: centerY + y });
      }
    }
    return coordinates
  } 

  const generatedGrid = (plants: (Plant | undefined)[]): JSX.Element[] => {
    return plants.map((p: (Plant | undefined), i: number) =>
      <div key={i} className="flex h-20 w-20 bg-green-200 items-center justify-center">
        {p ? 'Plant' : 'x'}
      </div>
    )
  };

  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [grid, setGrid] = useState([] as JSX.Element[]);

  const loadGrid = async () => {
    const coordinates = getAllCoordinates(x, y);
    const plants: (Plant | undefined)[] = await Promise.all(coordinates.map((c) => getPlotInfo(c.x, c.y)))
    setGrid(generatedGrid(plants))
  }

  const plant = async () => {

  }

  useEffect(() => { loadGrid() }, [])

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2">
        <span>Farm field coordinates</span>
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
              onChange={(e) => setX(parseInt(e.target.value))}
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
              onChange={(e) => setY(parseInt(e.target.value))}
            />
          </label>
        </div>
        <div>
          <button onClick={() => loadGrid()}>Load</button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-10">
        { grid }
      </div>
    </main>
  );
};

export default Home;
