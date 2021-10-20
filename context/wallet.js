import React, {
  createContext, useContext, useState, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Wallet } from 'ethers';

const WalletContext = createContext();

const getWallet = () => ({
  address: window.localStorage.getItem('wallet:address'),
  privateKey: window.localStorage.getItem('wallet:key'),
});

const saveWallet = (address, privateKey) => {
  window.localStorage.setItem('wallet:address', address);
  window.localStorage.setItem('wallet:key', privateKey);
};

const WalletContextProvider = ({ children }) => {
  const [localWallet, setLocalWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWallet = () => {
    setIsLoading(true);
    let wallet = getWallet();

    // if no local wallet exists yet generate one
    if (!wallet.address || !wallet.privateKey) {
      wallet = Wallet.createRandom();
      saveWallet(wallet.address, wallet.privateKey);
    }

    setLocalWallet(wallet);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const contextData = useMemo(() => ({
    wallet: localWallet,
    isLoading,
  }), [localWallet, isLoading]);

  return (
    <WalletContext.Provider value={{ wallet: contextData }}>
      {children}
    </WalletContext.Provider>
  );
};

const useWalletContext = () => useContext(WalletContext);

WalletContextProvider.propTypes = {
  children: PropTypes.node,
};

export {
  WalletContextProvider,
  useWalletContext,
};
