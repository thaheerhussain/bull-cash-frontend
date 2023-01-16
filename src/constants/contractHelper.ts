import { ethers } from "ethers";
import { getWeb3 } from "./connectors";
import { AbiItem } from "web3-utils";
import { Web3Provider } from "@ethersproject/providers";

export const getContract = (
  abi: any,
  address: string,
  library?: Web3Provider
) => {
  try {
    return new ethers.Contract(address, abi, library?.getSigner());
  } catch {
    return false;
  }
};

export const formatPrice = (num: string) => {
  return parseFloat(num).toFixed(3);
};

export const getWeb3Contract = (
  abi: AbiItem[] | AbiItem,
  address: string,
  chainId: number | string
) => {
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(abi, address);
};

export const mulDecimal = (amount: number | string, decimal: number) => {
  return ethers.utils.parseUnits(amount.toString(), decimal);
};
