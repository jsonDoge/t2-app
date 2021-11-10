import {
  createContext, useState, useEffect, useContext,
} from 'react';
import { Wallet } from 'ethers';
import PropTypes from 'prop-types';

export interface IWalletContext {
  isLoading: boolean,
  wallet: IWallet | undefined
}

interface IWallet {
  address: string,
  privateKey: string
}
const WalletContext = createContext<IWalletContext>({ isLoading: false, wallet: undefined });

const getWallet = () => {
  const address = window.localStorage.getItem('wallet:address');
  const privateKey = window.localStorage.getItem('wallet:key');

  if (!address || !privateKey) {
    return undefined;
  }

  return { address, privateKey }
};

const saveWallet = (address: string, privateKey: string) => {
  window.localStorage.setItem('wallet:address', address);
  window.localStorage.setItem('wallet:key', privateKey);
};

const WalletContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [localWallet, setLocalWallet] = useState<IWallet|undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const loadWallet = () => {
    setIsLoading(true);
    let wallet: Wallet;
    let existingWallet: IWallet | undefined = getWallet();

    if (!existingWallet) {
      wallet = Wallet.createRandom();
      saveWallet(wallet.address, wallet.privateKey);
      setLocalWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    } else {
      setLocalWallet(existingWallet);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return (
    <WalletContext.Provider value={{ isLoading, wallet: localWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

WalletContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default WalletContextProvider;
export const useWallet = () => useContext(WalletContext);