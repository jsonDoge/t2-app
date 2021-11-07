import React, {
  createContext, useContext, useState, useMemo, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Wallet } from 'ethers';

const WalletContext = createContext(null);

const getWallet = () => ({
  address: window.localStorage.getItem('wallet:address'),
  privateKey: window.localStorage.getItem('wallet:key'),
});

const saveWallet = (address: string, privateKey: string) => {
  window.localStorage.setItem('wallet:address', address);
  window.localStorage.setItem('wallet:key', privateKey);
};

const WalletContextProvider = ({ children }) => {
  const walletContext = useContext(WalletContext);

  if (walletContext) {
    throw new Error('walletContext has already been declared.');
  }

  const [localWallet, setLocalWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWallet = () => {
    setIsLoading(true);
    let wallet = getWallet();

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

WalletContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default WalletContextProvider;
