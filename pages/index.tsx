import React from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const generatedGrid = () => {
    const grid = [];
    for (let i = 0; i < 25; i += 1) {
      grid.push(<div className="flex h-20 w-20 bg-green-200 items-center justify-center" />);
    }
    return grid;
  };

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2">
        <span>Farm field coordinates</span>
      </div>
      <div className="flex flex-row items-center justify-center">
        <div className="mx-2">
          <label htmlFor="coordinateX">
            X:
            <input id="coordinateX" name="coordinateX" className="input" type="number" />
          </label>
        </div>
        <div className="mx-2">
          <label htmlFor="coordinateY">
            Y:
            <input id="coordinateY" name="coordinateY" className="input" type="number" />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-10">
        { generatedGrid() }
      </div>
    </main>
  );
};

export default Home;
