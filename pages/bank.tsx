import React, { useEffect, useState, useContext } from 'react';
import type { NextPage } from 'next';
import { mintStableToken, getStableTokenBalance } from '../services/bank';
import { IWalletContext, useWallet } from '../context/wallet';
import Button from '../components/button';

const Bank: NextPage = () => {
  const { isLoading, wallet }: IWalletContext = useWallet();
  const [balance, setbalance] = useState(0);

  const getLoan = async () => {
    if (!wallet?.address || !wallet?.privateKey) { return }
    await mintStableToken(wallet.address, wallet.privateKey);
    getStableTokenBalance(wallet.address).then(setbalance)
  }

  useEffect(() => {
    if (!isLoading && wallet?.address) {
      getStableTokenBalance(wallet?.address).then(setbalance)
    }
  }, [isLoading, wallet?.address])

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2 border-b w-full">
        <div>balance</div>
        <div>{balance}</div>
      </div>
      <div></div>
        <div className="mb-2">
          <div>Bank</div>
          <div>{isLoading}</div>
          {
            !isLoading
              ? <Button onClick={() => getLoan()}>Get farmers loan</Button>
              : <span>Loading</span>
          }
        </div>
    </main>
  );
};

export default Bank;
