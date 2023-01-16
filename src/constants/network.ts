export interface ISupportedNetwork {
  name: string;
  chainId: number;
  rpc: string;
  image: string;
  symbol: string;
  explorer: string;
  decimals: number;
}

export const supportNetwork: Record<number | string, ISupportedNetwork> = {
  80001: {
    name: "Polygon Mumbai",
    chainId: 80001,
    rpc: "https://rpc.ankr.com/polygon_mumbai",
    image: "",
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    decimals: 18,
  },
  137: {
    name: "Polygon",
    chainId: 137,
    rpc: "https://rpc.ankr.com/polygon",
    image: "",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    decimals: 18,
  },
  default: {
    name: "Polygon Mumbai",
    chainId: 80001,
    rpc: "https://rpc.ankr.com/polygon_mumbai",
    image: "",
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    decimals: 18,
  },
};

export const RPC_URLS = {
  // 56: "https://bsc-dataseed1.defibit.io/",
  // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  137: "https://rpc.ankr.com/polygon",
  80001: "https://rpc.ankr.com/polygon_mumbai",
};
