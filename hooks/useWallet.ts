import { useContext } from 'react';

import WalletContextProvider from '../context/wallet';

const useLocalWallet = () => {
  const walletContext = useContext(WalletContextProvider);

  if (walletContext === null) {
    throw new Error('No parent <WalletContextProvider />');
  }

  return walletContext.localWallet;
};

export default useLocalWallet;
