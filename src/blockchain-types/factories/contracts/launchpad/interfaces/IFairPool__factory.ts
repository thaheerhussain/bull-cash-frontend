/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IFairPool,
  IFairPoolInterface,
} from "../../../../contracts/launchpad/interfaces/IFairPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token_",
        type: "address",
      },
      {
        internalType: "address",
        name: "to_",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount_",
        type: "uint256",
      },
    ],
    name: "emergencyWithdrawLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "payaddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "emergencyWithdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolInfo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint8[]",
        name: "",
        type: "uint8[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "governance",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "softCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityLockDays",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "refundType",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "poolDetails",
            type: "string",
          },
        ],
        internalType: "struct LibPresale.FairLaunch",
        name: "presale",
        type: "tuple",
      },
      {
        internalType: "uint256[2]",
        name: "_fees",
        type: "uint256[2]",
      },
      {
        internalType: "address[3]",
        name: "_linkAddress",
        type: "address[3]",
      },
      {
        internalType: "uint8",
        name: "_version",
        type: "uint8",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "governance_",
        type: "address",
      },
    ],
    name: "setGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IFairPool__factory {
  static readonly abi = _abi;
  static createInterface(): IFairPoolInterface {
    return new utils.Interface(_abi) as IFairPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IFairPool {
    return new Contract(address, _abi, signerOrProvider) as IFairPool;
  }
}
