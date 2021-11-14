import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IWalletContext, useWallet } from '../context/wallet';
import { buySeed, getSeedBalance } from '../services/shop';
import plantTypes from '../constants/plantTypes';
import Button from '../components/button';
import Spinner from '../components/spinner';
import { toSentenceCase } from '../services/utils';

const Shop: NextPage = () => {
  const { isLoading: isLoadingWallet, wallet }: IWalletContext = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedType, setSeedType] = useState(plantTypes.POTATO);
  const [carrotSeedBalance, setCarrotSeedBalance] = useState(0);
  const [potatoSeedBalance, setPotatoSeedBalance] = useState(0);
  const [cornSeedBalance, setCornSeedBalance] = useState(0);

  const refreshBalances = async (walletAddress: string) => {
    getSeedBalance(walletAddress, plantTypes.POTATO).then(setPotatoSeedBalance);
    getSeedBalance(walletAddress, plantTypes.CARROT).then(setCarrotSeedBalance);
    getSeedBalance(walletAddress, plantTypes.CORN).then(setCornSeedBalance);
  };

  const onBuySeed = async () => {
    setError('');
    if (!wallet?.address || !wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await buySeed(seedType, wallet?.privateKey);
    } catch (e) {
      setError('Buying failed');
      setIsLoading(false);
      return;
    }
    refreshBalances(wallet.address);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoadingWallet || !wallet?.address) { return; }
    refreshBalances(wallet.address);
  }, [isLoadingWallet, wallet?.address]);

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1">
      <div className="w-96 mt-20">
        <div className="flex flex-col justify-start items-start my-5">
          <div className="text-2xl">Shop</div>
          <div>(all seeds 1USDT)</div>
        </div>
        <div className="flex flex-row bg-green-200 w-96 py-5 rounded-sm">
          <div className="font-bold w-1/3 text-center">Potato seeds</div>
          <div className="w-2/3 text-right px-10">{potatoSeedBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 w-96 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">Carrot seeds</div>
          <div className="w-2/3 text-right px-10">{carrotSeedBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 w-96 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">Corn seeds</div>
          <div className="w-2/3 text-right px-10">{cornSeedBalance}</div>
        </div>
        <div className="flex flex-col mt-10">
          <div className="flex flex-row w-full">
            <div className="w-1/3 text-left">
              <div>
                <select onChange={(e) => { setSeedType(e.target.value); }} value={seedType}>
                  { Object.values(plantTypes).map((v) => (
                    <option key={v} value={v}>{toSentenceCase(v)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-2/3 text-right">
              {
                !isLoadingWallet
                  ? (
                    <Button onClick={() => onBuySeed()}>
                      { !isLoading && <div>Buy seed</div> }
                      { isLoading && <Spinner /> }
                    </Button>
                  ) : <Spinner />
              }
            </div>
          </div>
          <div className="text-center">
            { error && <div className="text-red-500">{error}</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Shop;
