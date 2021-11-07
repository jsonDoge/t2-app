import { Contract, Wallet } from 'ethers';

// services
import getProvider from './provider';

// constants
import ContractTypes from '../constants/contractTypes';

// contract abis
import badgeAbi from '../contracts/badge.abi.json';
import erc20Abi from '../contracts/erc20.abi.json';
import plotAbi from '../contracts/plot.abi.json';
import farmAbi from '../contracts/farm.abi.json';
import contractTypes from '../constants/contractTypes';

interface getContractOptions {
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
  options: getContractOptions = { isSignerRequired: false },
) => {
  const web3Provider = getProvider();

  if (!web3Provider) return null;
  if (options.isSignerRequired && !options.privateKey) {
    throw new Error('wallet key not provided');
  }

  const web3ProviderOrSigner = options.isSignerRequired
    ? new Wallet(options.privateKey, web3Provider)
    : web3Provider;

  try {
    switch (type) {
      case ContractTypes.FARM:
        return new Contract(address, farmAbi, web3ProviderOrSigner);
      case ContractTypes.ERC20:
        return new Contract(address, erc20Abi, web3ProviderOrSigner);
      case ContractTypes.PLOT:
        return new Contract(address, plotAbi, web3ProviderOrSigner);
      case ContractTypes.BADGE:
        return new Contract(address, badgeAbi, web3ProviderOrSigner);
      default:
        return null;
    }
  } catch (e) {
    return null;
  }
};

export const getBalance = (address: string) => {
  const web3Provider = getProvider();

  if (!web3Provider) return null;

  return web3Provider.getBalance(address);
};

export const getErc20Balance = (
  erc20Address: string,
  walletAddress: string,
) => {
  const tokenContract = getContract(erc20Address, contractTypes.ERC20, { isSignerRequired: false });

  if (!tokenContract) { throw new Error('Contract not found') }

  return tokenContract.balanceOf(walletAddress);
};

export const generateWallet = () => Wallet.createRandom();
