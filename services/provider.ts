import { ethers } from 'ethers';

let provider: ethers.providers.JsonRpcProvider;

/**
 * Triggered when provider's websocket is open.
 */
const startConnection = (): ethers.providers.JsonRpcProvider => {
  console.log('process.env.ETH_PROVIDER', process.env.ETH_PROVIDER)
  provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER, 420);
  return provider;
};

export default () => provider || startConnection();
