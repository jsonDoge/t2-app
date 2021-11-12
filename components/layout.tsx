import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useWallet } from '../context/wallet';

const Layout: NextPage = ({ children }) => {
  const { wallet } = useWallet();

  return (
    <div className="flex flex-col min-h-screen bg-green-100">
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
          <div className="mx-2"><Link href="/"><a><span className="text-bold">Fields</span></a></Link></div>
          <div className="mx-2"><Link href="/shop"><a><span className="text-bold">Shop</span></a></Link></div>
          <div className="mx-2"><Link href="/barn"><a><span className="text-bold">Barn</span></a></Link></div>
          <div className="mx-2"><Link href="/bank"><a><span className="text-bold">Bank</span></a></Link></div>
        </div>
        <div className="flex w-1/3 items-bottom justify-end items-center pr-10">
          <span className="font-bold">{wallet?.address}</span>
        </div>
      </header>
      { children }
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
