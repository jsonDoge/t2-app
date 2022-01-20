import React, { useState } from 'react';
import type { NextPage } from 'next';
import { IGridContext, useGrid } from '../context/grid';
import Input from '../components/input';
import Button from '../components/button';

const Index: NextPage = () => {
  const {
    isLoading,
    error,
    updateCenter: updateGridCenter,
  }: IGridContext = useGrid();

  const [centerX, setCenterX] = useState(3);
  const [centerY, setCenterY] = useState(3);

  const updateCenter = () => {
    updateGridCenter(centerX, centerY);
  };

  return (
    <main className="flex flex-col items-center justify-bottom px-20 mt-20 text-center">
      <div className="mb-2">
        { error && <div className="text-red-500">{error}</div>}
      </div>
      <div className="flex flex-row gap-3 p-5 rounded-sm">
        <div className="flex flex-row items-center justify-center gap-2">
          <div>
            <label className="block text-white text-sm font-bold" htmlFor="coordinateX">
              X
            </label>
          </div>
          <Input
            id="coordinateX"
            name="coordinateX"
            type="number"
            value={centerX}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCenterX(parseInt(e.target.value, 10))}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <label className="block text-white text-sm font-bold" htmlFor="coordinateY">
            Y
          </label>
          <Input
            id="coordinateY"
            name="coordinateY"
            type="number"
            value={centerY}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCenterY(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <Button onClick={updateCenter}>Load</Button>
        </div>
      </div>
    </main>
  );
};

export default Index;
