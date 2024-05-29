import { ethers } from 'ethers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

let provider: ethers.providers.StaticJsonRpcProvider;

/**
 * Triggered when provider's websocket is open.
 */
const startConnection = (): ethers.providers.StaticJsonRpcProvider => {
  provider = new ethers.providers.StaticJsonRpcProvider(
    publicRuntimeConfig.ETH_PROVIDER,
    parseInt(publicRuntimeConfig.ETH_CHAIN_ID, 10),
  );

  provider.pollingInterval = 5000;

  if (!provider) {
    throw new Error('provider not found');
  }

  return provider;
};

export default () => provider || startConnection();
