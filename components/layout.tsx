import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useWallet } from '../context/wallet';
import { getCurrentBlockNumber } from '../services/web3Utils';

const DynamicBacground = dynamic(
  () => import('./background'),
  { loading: () => <div>Loading...</div>, ssr: false },
);

const Layout: NextPage = ({ children }) => {
  const { wallet } = useWallet();
  const { asPath } = useRouter();

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    getCurrentBlockNumber().then(setBlockNumber);

    setInterval(() => {
      getCurrentBlockNumber().then(setBlockNumber);
    }, 60000);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute z-0 min-h-screen w-screen">
        <DynamicBacground />
      </div>
      <Head>
        <title>T2 Farm</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex flex-row h-16 z-10 bg-transparent">
        <div className="flex flex-col w-1/3 justify-center items-start pt-2">
          <h1 className="text-3xl font-bold pl-3">
            TokenToken farm
          </h1>
        </div>
        <div className="flex w-1/3 justify-center items-center pt-2 font-bold">
          <div className={`px-2 rounded-sm ${asPath === '/' && 'bg-green-200'}`}><Link href="/"><a><span className="text-bold">Plots</span></a></Link></div>
          <div className={`px-2 rounded-sm ${asPath === '/shop' && 'bg-green-200'}`}><Link href="/shop"><a><span className="text-bold">Shop</span></a></Link></div>
          <div className={`px-2 rounded-sm ${asPath === '/barn' && 'bg-green-200'}`}><Link href="/barn"><a><span className="text-bold">Barn</span></a></Link></div>
          <div className={`px-2 rounded-sm ${asPath === '/bank' && 'bg-green-200'}`}><Link href="/bank"><a><span className="text-bold">Bank</span></a></Link></div>
          <div className={`px-2 rounded-sm ${asPath === '/threeD' && 'bg-green-200'}`}><Link href="/threeD"><a><span className="text-bold">threeD</span></a></Link></div>
        </div>
        <div className="flex w-1/3 items-bottom justify-end items-center pr-10">
          <div className="font-bold mr-5">
            <div className="inline mr-1">
              Block:
            </div>
            <div className="inline">
              {blockNumber}
            </div>
          </div>
          <div className="font-bold">
            <span
              onClick={() => navigator.clipboard.writeText(wallet?.address || '')}
              onKeyPress={() => {}}
              role="button"
              tabIndex={0}
            >
              {`0x... ${wallet?.address.substr(38, 4)}`}
            </span>
          </div>
        </div>
      </header>
      <div className="z-10 bg-transparent">
        { children }
      </div>
      <footer className="flex w-full h-12 items-center justify-center">
        Powered by... electricity and tears ¯\_(ツ)_/¯
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
};

export default Layout;
