import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IWalletContext, useWallet } from '../context/wallet';
import { buySeed, getSeedBalance } from '../services/shop';
import plantTypes from '../constants/plantTypes';
import Button from '../components/button';

const Shop: NextPage = () => {
  const { isLoading, wallet }: IWalletContext = useWallet();
  const [balance, setbalance] = useState(0);

  const buyPotatoSeed = async () => {
    if (!wallet?.address || !wallet?.privateKey) { return; }
    await buySeed(plantTypes.POTATO, wallet?.privateKey);
    getSeedBalance(wallet?.address, plantTypes.POTATO).then(setbalance);
  };

  useEffect(() => {
    if (!isLoading && wallet?.address) {
      getSeedBalance(wallet?.address, plantTypes.POTATO).then(setbalance);
    }
  }, [isLoading, wallet?.address]);

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2 border-b w-full">
        <div>potato seed balance</div>
        <div>{balance}</div>
      </div>
      <div className="mb-2">
        <div>Shop</div>
        {
          !isLoading
            ? <Button onClick={() => buyPotatoSeed()}>Buy potato seeds</Button>
            : <span>Loading</span>
        }
      </div>
    </main>
  );
};

export default Shop;
