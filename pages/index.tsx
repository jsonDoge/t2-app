import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  const generatedGrid = () => {
    const grid = [];
    for (let i = 0; i < 25; i += 1) {
      grid.push(<div className="flex h-20 w-20 bg-green-200 items-center justify-center">{i}</div>);
    }
    return grid;
  };

  return (
    <div className="flex flex-col min-h-screen  bg-green-100">
      <Head>
        <title>T2 Farm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex flex-row h-16">
        <div className="flex w-1/3 justify-start items-center pt-2">
          <h1 className="text-3xl font-bold pl-3">
            TokenToken farm
          </h1>
        </div>
        <div className="flex w-1/3 justify-center items-center pt-2 font-bold">
          <div className="mx-2"><button className="font-bold" type="button">Fields</button></div>
          <div className="mx-2"><button className="font-bold" type="button">Shop</button></div>
          <div className="mx-2"><button className="font-bold" type="button">Barn</button></div>
        </div>
        <div className="flex w-1/3 items-bottom justify-end items-center pr-10">
          <span className="font-bold">your address here</span>
        </div>
      </header>
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
      <footer className="flex w-full h-12 items-center justify-center">
        Powered by... electricity and tears ¯\_(ツ)_/¯
      </footer>
    </div>
  );
};

export default Home;
