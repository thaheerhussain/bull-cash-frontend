export const trimAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};
//Launchpad Contract
// deploying "CircleLocker" (tx: 0x313f2170c01974866e821aab7207e917c5eafab84fe6c961f23e7f793c1f11a6)...: deployed at 0x52DC8f042B147186D43d32a93D952e1dB95B73Bc with 3468620 gas
// Deploy CirclePoolManager Proxy done -> 0xb92e7e982CBDa643d65233c979c3755917b5570e
// Deploy CirclePoolFactory Proxy done -> 0x3498C08A783E3b5a278E0916E399b23BDD1120A9
export const contract: Record<string | number, any> = {
  80001: {
    airdropfactory: "0x15fA9F6F06f67226388DCa669e46208fB3CA7349",
    airdropmanager: "0x24190324791ae2CEeb6b414dc923b895022C15c6",
    poolfactory: "0xB6077275bF61d7aEAbF10a1a48d06a5e7d1d0985",
    poolmanager: "0x7DaE13a3417C891c1DfF2304Ecd1961bb56C6600",
    routeraddress: "0x8954AfA98594b838bda56FE4C12a09D7739D179b",
    multicallAddress: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
    multiSenderAddress: "0xDf180f4aD6BB4c6257BBA30A2Db301aC26ceA60A",
    lockAddress: "0x3BEFb864330514D462590A5B71b579E778b0E3B7",
    routername: "UniSwap",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/martianatwork/circle-mumbai",
  },
  137: {
    airdropfactory: "0xB69494680Ed6EeE3aB95A8A843400df4E681a183",
    airdropmanager: "0x49220117d83F00DfF76b1Da79229f9bEAf5fE366",
    poolfactory: "0xf8812EB5f8c163FBCE62f76FD815CDDB0224aca9",
    poolmanager: "0x8DDC57b894684ab185Ce5b58fb729dc6255ee5af",
    routeraddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    multicallAddress: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
    multiSenderAddress: "0x88b0DF2FC9cF670A0964fb19Ae2BeA90e577EE24",
    lockAddress: "0x7A39Ad93BaBd8C8331E7c6D08Fc1b6A6daaDc4c3",
    routername: "QuickSwap",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/martianatwork/circle-polygon",
  },
  default: {
    airdropfactory: "0x15fA9F6F06f67226388DCa669e46208fB3CA7349",
    airdropmanager: "0x24190324791ae2CEeb6b414dc923b895022C15c6",
    poolfactory: "0xB6077275bF61d7aEAbF10a1a48d06a5e7d1d0985",
    poolmanager: "0x7DaE13a3417C891c1DfF2304Ecd1961bb56C6600",
    routeraddress: "0x8954AfA98594b838bda56FE4C12a09D7739D179b",
    multicallAddress: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
    multiSenderAddress: "0xDf180f4aD6BB4c6257BBA30A2Db301aC26ceA60A",
    lockAddress: "0x3BEFb864330514D462590A5B71b579E778b0E3B7",
    routername: "Pancakeswap",
    subgraph:
      "https://api.thegraph.com/subgraphs/name/martianatwork/circle-mumbai",
  },
};
