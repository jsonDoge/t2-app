import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IWalletContext, useWallet } from '../context/wallet';
import { craftBadge, getBadgeBalance, getProductBalance } from '../services/barn';
import plantTypes from '../constants/plantTypes';
import Button from '../components/button';

const Barn: NextPage = () => {
  const { isLoading, wallet }: IWalletContext = useWallet();
  const [productBalance, setProductBalance] = useState(0);
  const [badgeBalance, setBadgeBalance] = useState(0);
  const [plantType0, setPlantType0] = useState(plantTypes.CARROT);
  const [plantType1, setPlantType1] = useState(plantTypes.CARROT);
  const [plantType2, setPlantType2] = useState(plantTypes.CARROT);

  useEffect(() => {
    if (isLoading || !wallet?.address) { return; }
    
    getProductBalance(wallet?.address, plantTypes.POTATO).then(setProductBalance);
    getBadgeBalance(wallet?.address, plantTypes.POTATO).then(setBadgeBalance);
  }, [isLoading, wallet?.address]);

  const onBadgeCraft = async () => {
    if (!wallet?.privateKey) { return; }
    await craftBadge(plantType0, plantType1, plantType2, wallet?.privateKey);
    getProductBalance(wallet?.address, plantTypes.POTATO).then(setProductBalance);
    getBadgeBalance(wallet?.address, plantTypes.POTATO).then(setBadgeBalance);
  }

  return (
    <main className="flex flex-col items-center justify-top w-full h-full flex-1 px-20 mt-20 text-center">
      <div className="mb-2 border-b w-full">
        <div>Barn</div>
      </div>
      <div className="mb-2 border-b">
        <div>Potatoes owned</div>
        <div>{productBalance}</div>
      </div>
      <div className="mb-2">
        <div>Badges owned</div>
        <div>{badgeBalance}</div>
      </div>
      <div className="mb-2">
        <div className="my-2">Badge ingredients</div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <select onChange={(e) => { setPlantType0(e.target.value) }} value={plantType0}>
              { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <select onChange={(e) => { setPlantType1(e.target.value) }} value={plantType1}>
              { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
            </select>
          </div>
          <div>
            <select onChange={(e) => { setPlantType2(e.target.value) }} value={plantType2}>
              { Object.values(plantTypes).map((v) => (<option key={v}>{v}</option>))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div>Craft badge (nft)</div>
        {
          !isLoading
            ? <Button onClick={onBadgeCraft}>
                Try craft badge
              </Button>
            : <span>Loading</span>
        }
      </div>
    </main>
  );
};

export default Barn;
