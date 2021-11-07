import { useContext } from 'react';

import WalletContextProvider from '../context/wallet';

const useLocalWallet = () => {
  // TODO fix type, problematic contexts
  const walletContext: { wallet: {} } = useContext(WalletContextProvider as any);

  if (walletContext === null) {
    throw new Error('No parent <WalletContextProvider />');
  }

  return walletContext.wallet;
};

export default useLocalWallet;
