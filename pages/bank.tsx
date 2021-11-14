import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { mintStableToken, getStableTokenBalance } from '../services/bank';
import { IWalletContext, useWallet } from '../context/wallet';
import Button from '../components/button';
import Spinner from '../components/spinner';

const Bank: NextPage = () => {
  const { isLoading: isLoadingWallet, wallet }: IWalletContext = useWallet();
  const [balance, setbalance] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getLoan = async () => {
    setError('');
    if (!wallet?.address || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await mintStableToken(wallet.address, wallet.privateKey);
    } catch (e) {
      setError('Buying failed');
      setIsLoading(false);
      return;
    }
    await getStableTokenBalance(wallet.address).then(setbalance);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoadingWallet && wallet?.address) {
      getStableTokenBalance(wallet?.address).then(setbalance);
    }
  }, [isLoadingWallet, wallet?.address]);

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1">
      <div className="w-96 mt-20">
        <div className="flex justify-start items-start my-5">
          <div className="text-2xl">Bank</div>
        </div>

        <div className="flex flex-row bg-green-200 w-96 py-5 rounded-sm">
          <div className="font-bold w-1/3 text-center">USDT</div>
          <div className="w-2/3 text-right px-10">{balance}</div>
        </div>
        <div className="flex flex-col my-5">
          <div className="text-right">
            {
              !isLoadingWallet
                ? (
                  <Button disabled={isLoading} onClick={() => getLoan()}>
                    { !isLoading && <div>Get farmers loan</div> }
                    { isLoading && <Spinner /> }
                  </Button>
                )
                : <Spinner />
            }
          </div>
          <div className="text-center">
            { error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Bank;
