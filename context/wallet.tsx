import React, { createContext, useState, useEffect, useContext } from 'react';
import { Wallet as EtherWallet } from 'ethers';
import PropTypes from 'prop-types';
import { walletStore } from '../stores';
import { Wallet } from '../utils/interfaces';

interface IWalletContext {
  wallet: Wallet | undefined;
}

const WalletContext = createContext<IWalletContext>({ wallet: undefined });

const getWallet = () => {
  const address = window.localStorage.getItem('wallet:address');
  const privateKey = window.localStorage.getItem('wallet:key');

  if (!address || !privateKey) {
    return undefined;
  }

  return { address: address.toLowerCase(), privateKey };
};

const saveWallet = (address: string, privateKey: string) => {
  window.localStorage.setItem('wallet:address', address);
  window.localStorage.setItem('wallet:key', privateKey);
};

const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [localWallet, setLocalWallet] = useState<Wallet>();

  const loadWallet = () => {
    let wallet: EtherWallet;
    const existingWallet: Wallet | undefined = getWallet();

    if (!existingWallet) {
      wallet = EtherWallet.createRandom();
      const formattedWallet = {
        address: wallet.address.toLowerCase(),
        privateKey: wallet.privateKey,
      };

      saveWallet(formattedWallet.address, formattedWallet.privateKey);
      setLocalWallet({ ...formattedWallet });

      walletStore.setValue({ ...formattedWallet });
    } else {
      setLocalWallet((currentWallet) => currentWallet || { ...existingWallet });
      walletStore.setValue({ ...existingWallet });
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return <WalletContext.Provider value={{ wallet: localWallet }}>{children}</WalletContext.Provider>;
};

WalletContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WalletContextProvider;
export const useWallet = () => useContext(WalletContext);
