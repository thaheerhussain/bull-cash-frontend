import { trimAddress } from "@constants/constant";
import { getExplorerLink } from "@helpers/getExplorerLink";
import useAuth from "@hooks/useAuth";
import React from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";

interface ICopyAddress {
  containerClass?: string;
  addressClass?: string;
  iconSize?: number;
  address: string;
  scale?: boolean;
  type?: "address" | "tx";
}

const CopyAddress: React.FC<ICopyAddress> = ({
  containerClass,
  addressClass,
  iconSize,
  address,
  type,
  scale = true,
}) => {
  const { chainId } = useAuth();
  const addressCopyHandler = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success(`Address Copied`);
  };
  return (
    <div className={`flex items-center ${containerClass}`}>
      <a
        target="_blank"
        href={getExplorerLink(address, chainId, type)}
        rel="noopener noreferrer">
        <span className={`hover:underline w-full ${addressClass}`}>
          {trimAddress(address)}
        </span>
      </a>
      <AiOutlineCopy
        onClick={() => addressCopyHandler(address)}
        size={iconSize ? iconSize : 22}
        className={`ml-2 cursor-pointer ${
          scale ? "hover:scale-110" : "hover:text-red-400"
        } transform duration-100`}
      />
    </div>
  );
};

export default CopyAddress;
