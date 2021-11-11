import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IWalletContext, useWallet } from '../context/wallet';
import { getProductBalance } from '../services/barn';
import plantTypes from '../constants/plantTypes';

const Barn: NextPage = () => {
  const { isLoading, wallet }: IWalletContext = useWallet();
  const [balance, setbalance] = useState(0);

  useEffect(() => {
    if (!isLoading && wallet?.address) {
      getProductBalance(wallet?.address, plantTypes.POTATO).then(setbalance)
    }
  }, [isLoading])

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2 border-b w-full">
        <div>Barn</div>
        <div>{isLoading}</div>
      </div>
      <div className="mb-2">
        <div>potato balance</div>
        <div>{balance}</div>
      </div>
    </main>
  );
};

export default Barn;
