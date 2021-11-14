import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IWalletContext, useWallet } from '../context/wallet';
import { craftBadge, getBadgeBalance, getProductBalance } from '../services/barn';
import plantTypes from '../constants/plantTypes';
import Button from '../components/button';
import Spinner from '../components/spinner';

const Barn: NextPage = () => {
  const { isLoading: isLoadingWallet, wallet }: IWalletContext = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const [potatoBalance, setPotatoBalance] = useState(0);
  const [carrotBalance, setCarrotBalance] = useState(0);
  const [cornBalance, setCornBalance] = useState(0);
  const [potatoBadgeBalance, setPotatoBadgeBalance] = useState(0);
  const [carrotBadgeBalance, setCarrotBadgeBalance] = useState(0);
  const [cornBadgeBalance, setCornBadgeBalance] = useState(0);
  const [plantType0, setPlantType0] = useState(plantTypes.CARROT);
  const [plantType1, setPlantType1] = useState(plantTypes.CARROT);
  const [plantType2, setPlantType2] = useState(plantTypes.CARROT);

  const refreshBalances = async (walletAddress: string) => {
    getProductBalance(walletAddress, plantTypes.POTATO).then(setPotatoBalance);
    getProductBalance(walletAddress, plantTypes.CARROT).then(setCarrotBalance);
    getProductBalance(walletAddress, plantTypes.CORN).then(setCornBalance);

    getBadgeBalance(walletAddress, plantTypes.POTATO).then(setPotatoBadgeBalance);
    getBadgeBalance(walletAddress, plantTypes.CARROT).then(setCarrotBadgeBalance);
    getBadgeBalance(walletAddress, plantTypes.CORN).then(setCornBadgeBalance);
  };

  useEffect(() => {
    if (isLoadingWallet || !wallet?.address) { return; }

    refreshBalances(wallet?.address);
  }, [isLoadingWallet, wallet?.address]);

  const onBadgeCraft = async () => {
    setError('');
    if (!wallet?.privateKey) { return; }
    setIsLoading(true);
    try {
      await craftBadge(plantType0, plantType1, plantType2, wallet?.privateKey);
    } catch (e) {
      setError('Craft failed or non-existent combo');
      setIsLoading(false);
      return;
    }
    refreshBalances(wallet?.address);
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1">
      <div className="w-96 mt-20">
        <div className="flex justify-start items-start my-5">
          <div className="text-2xl">Barn</div>
        </div>
        <div className="flex justify-start items-start">
          <div className="text-lg">Products</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 rounded-sm">
          <div className="font-bold w-1/3 text-center">Potatoes</div>
          <div className="w-2/3 text-right px-10">{potatoBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">Carrots</div>
          <div className="w-2/3 text-right px-10">{carrotBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">Corn</div>
          <div className="w-2/3 text-right px-10">{cornBalance}</div>
        </div>
        <div className="flex justify-start items-start mt-4">
          <div className="text-lg">Badges</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 rounded-sm">
          <div className="font-bold w-1/3 text-center">3x Potato</div>
          <div className="w-2/3 text-right px-10">{potatoBadgeBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">3x Carrot</div>
          <div className="w-2/3 text-right px-10">{carrotBadgeBalance}</div>
        </div>
        <div className="flex flex-row bg-green-200 py-5 mt-2 rounded-sm">
          <div className="font-bold w-1/3 text-center">3x Corn</div>
          <div className="w-2/3 text-right px-10">{cornBadgeBalance}</div>
        </div>
        <div className="flex justify-start items-start my-5">
          <div className="text-xl">Craft badge (nft)</div>
        </div>
        <div className="mb-2 mt-4">
          <div className="my-2">Ingredients</div>
          <div className="grid grid-cols-3 gap-3 bg-green-200 py-3 rounded-sm">
            <div className="text-center">
              <select onChange={(e) => { setPlantType0(e.target.value); }} value={plantType0}>
                { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
            <div className="text-center">
              <select onChange={(e) => { setPlantType1(e.target.value); }} value={plantType1}>
                { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
            <div className="text-center">
              <select onChange={(e) => { setPlantType2(e.target.value); }} value={plantType2}>
                { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col my-5">
          <div className="text-right">
            {
              !isLoadingWallet
                ? (
                  <Button onClick={onBadgeCraft}>
                    { !isLoading && <div>Try craft badge</div> }
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

export default Barn;
