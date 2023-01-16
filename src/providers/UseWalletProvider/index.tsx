import useChainId from "@providers/UseWalletProvider/useChainId";
import { useWallet, UseWalletProvider } from "use-wallet";
import { useEffect } from "react";
import { supportNetwork } from "@constants/network";

export enum Networks {
  MAINET = 137,
  MUMBAI = 80001,
}

async function switchEthereumChain({ chainId }: { chainId: number }) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: supportNetwork[chainId].name,
              nativeCurrency: {
                name: supportNetwork[chainId].name,
                symbol: supportNetwork[chainId].symbol, // 2-6 characters long
                decimals: supportNetwork[chainId].decimals,
              },
              blockExplorerUrls: [supportNetwork[chainId].explorer],
              rpcUrls: [supportNetwork[chainId].rpc],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
        throw addError;
      }
    } else {
      throw e;
    }
    // console.error(e)
  }
}

const Wallet = ({ children }: any) => {
  const chainId = useChainId();

  const { reset } = useWallet();

  useEffect(() => {
    if (!!chainId) {
      if (![Networks.MAINET, Networks.MUMBAI].includes(chainId)) {
        switchEthereumChain({
          chainId: supportNetwork["default"].chainId,
        }).catch((e) => {
          console.log("ERROR", e);
          reset();
        });
      }
    }
    // Do not add reset ad dependency, it causes double requests
  }, [chainId]);
  return children;
};

const UseWalletProviderWrapper = (props: any) => {
  return (
    <UseWalletProvider
      autoConnect={true}
      connectors={{
        injects: {
          chainId: [Networks.MAINET, Networks.MUMBAI],
        },
        frame: {},
      }}
      {...props}>
      <Wallet>{props.children}</Wallet>
    </UseWalletProvider>
  );
};

export default UseWalletProviderWrapper;
