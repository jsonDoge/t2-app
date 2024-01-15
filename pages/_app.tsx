import React, { Suspense } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'tailwindcss/tailwind.css';
import dynamic from 'next/dynamic';
import WalletContextProvider from '../context/wallet';
import GameContextProvider from '../context/game';
import ErrorContextProvider from '../context/error';
import Layout from '../components/layout';
import Spinner from '../components/spinner';

const Game = dynamic(() => import('../components/game'), { suspense: true, ssr: false });

function MyApp() {
  return (
    <WalletContextProvider>
      <GameContextProvider>
        <>
          <div className="absolute z-10 h-screen w-screen">
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Spinner className="h-10 w-10" /></div>}>
              <Game />
            </Suspense>
          </div>
          <ErrorContextProvider>
            <Layout />
          </ErrorContextProvider>
        </>
      </GameContextProvider>
    </WalletContextProvider>
  );
}

export default MyApp;
