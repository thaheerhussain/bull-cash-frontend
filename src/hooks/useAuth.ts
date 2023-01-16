import { useWallet } from "use-wallet";
import { ethers } from "ethers";

const useAuth = () => {
  const wallet = useWallet();
  const activate = (connector: string) => wallet.connect(connector);

  return {
    ethereum: wallet.ethereum,
    chainId:
      wallet.status === "connected" && wallet.account
        ? wallet.chainId
        : undefined,
    balance: wallet.balance,
    balance_formatted: parseInt(wallet.balance || "0") / 10 ** 18,
    connect: () => activate("injected"),
    loading: wallet.status === "connecting",
    account: wallet.account,
    disconnect: wallet.reset,
    isLoggedIn: wallet.status === "connected",
    library: wallet.ethereum
      ? new ethers.providers.Web3Provider(wallet.ethereum)
      : undefined,
  };
};

export default useAuth;
