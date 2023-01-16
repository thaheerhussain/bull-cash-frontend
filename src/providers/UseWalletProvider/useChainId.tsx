import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";

const useChainId = () => {
  const [chainId, setChainId] = useState();
  const { status } = useWallet();

  const fetchChainId = useCallback(async () => {
    if (["disconnected", "error"].includes(status)) {
      setChainId(undefined);
    } else {
      if (window.ethereum) {
        const ethereum = window.ethereum;
        let chainId = await ethereum.request({
          method: "eth_chainId",
        });
        chainId = parseInt(chainId, 16);
        console.log("network changed");
        setChainId(chainId);
      }
    }
  }, [setChainId, status]);

  useEffect(() => {
    fetchChainId().catch((err) => console.error(err.stack));

    window?.ethereum?.on("networkChanged", fetchChainId);
    return () =>
      window?.ethereum?.removeListener("networkChanged", fetchChainId);
  }, [fetchChainId]);

  return chainId;
};

export default useChainId;
