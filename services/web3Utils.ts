import { Contract, Wallet, providers } from 'ethers';

// services
import getProvider from './provider';

// constants
import ContractTypes from '../constants/contractTypes';

// contract abis
import dishAbi from '../contracts/dish.abi.json';
import erc20Abi from '../contracts/erc20.abi.json';
import plotAbi from '../contracts/plot.abi.json';
import farmAbi from '../contracts/farm.abi.json';

interface GetContractOptions {
  isSignerRequired: boolean,
  privateKey?: string,
}

// utils
/**
 *
 * @param {string} address
 * @param {string} type
 * @param { isSignerRequired = false, privateKey } options
 * @returns Contract
 */
export const getContract = (
  address: string,
  type: string,
  options: GetContractOptions = { isSignerRequired: false },
) => {
  const web3Provider = getProvider();

  if (options.isSignerRequired && !options.privateKey) {
    throw new Error('wallet key not provided');
  }

  const web3ProviderOrSigner = options.isSignerRequired
    ? new Wallet(options.privateKey as string, web3Provider)
    : web3Provider;

  switch (type) {
    case ContractTypes.FARM:
      return new Contract(address, farmAbi, web3ProviderOrSigner);
    case ContractTypes.ERC20:
      return new Contract(address, erc20Abi, web3ProviderOrSigner);
    case ContractTypes.PLOT:
      return new Contract(address, plotAbi, web3ProviderOrSigner);
    case ContractTypes.DISH:
      return new Contract(address, dishAbi, web3ProviderOrSigner);
    default:
      throw new Error('Unknown contract type');
  }
};

export const getBalance = (address: string) => {
  const web3Provider = getProvider();

  return web3Provider.getBalance(address);
};

export const getErc20Balance = (
  erc20Address: string,
  walletAddress: string,
) => {
  const tokenContract = getContract(erc20Address, ContractTypes.ERC20, { isSignerRequired: false });

  if (!tokenContract) { throw new Error('Contract not found'); }

  return tokenContract.balanceOf(walletAddress);
};

export const generateWallet = () => Wallet.createRandom();

export const getCurrentBlockNumber = async (): Promise<number> => {
  const web3Provider: providers.JsonRpcProvider = getProvider();

  return web3Provider.getBlockNumber();
};

export const waitTx = async (tx: any): Promise<undefined> => (await tx).wait();
