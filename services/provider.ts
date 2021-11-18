import { ethers } from 'ethers';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

let provider: ethers.providers.JsonRpcProvider;

/**
 * Triggered when provider's websocket is open.
 */
const startConnection = (): ethers.providers.JsonRpcProvider => {
  provider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.ETH_PROVIDER, 420);

  if (!provider) {
    throw new Error('provider not found');
  }

  return provider;
};

export default () => provider || startConnection();
