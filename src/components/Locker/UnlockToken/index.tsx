import React, { useState } from "react";
import lockAbi from "../../../ABIs/Locker/lockerABI.json";
import { CountdownTimer } from "@atoms/CountdownTimer";
import InfoGrid from "@molecules/InfoGrid";
import {
  useDetailsStats,
  useRecordStats,
} from "@components/Locker/Token/hooks/useStats";
import { useRouter } from "next/router";
import { contract, trimAddress } from "@constants/constant";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import { getContract } from "@constants/contractHelper";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import Button from "@atoms/Button";
import useWidth from "@hooks/useWidth";
import BannerImage from "@public/images/unlockTokenBanner.png";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { TIME_FORMAT } from "@constants/timeFormats";

const UnlockTokenComp = () => {
  const router = useRouter();
  const address = router.query.id;
  const stats = useRecordStats({
    lockId: Array.isArray(address) ? address[0] : address,
  });

  console.log("stats", stats);

  type ISpacing = { title: string; value: string }[];

  const { account, library, chainId } = useAuth();
  const [ctLoading, setCtLoading] = useState(false);
  const [extraSpacing, setExtraSpacing] = useState<ISpacing>([
    { title: "", value: "" },
    { title: "", value: "" },
  ]);

  const width = useWidth();

  const handleUnlock = async () => {
    setCtLoading(true);
    try {
      if (account && chainId) {
        let lockAddress = contract[chainId]
          ? contract[chainId].lockAddress
          : contract["default"].lockAddress;
        let lockContract = getContract(lockAbi, lockAddress, library);

        // @ts-ignore
        let tx = await lockContract.unlock(stats.id, {
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Waiting for confirmation",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("success ! your last transaction is success");
            setCtLoading(false);
          } else if (!response.status) {
            toast.error("error ! Your last transaction is failed.");
            setCtLoading(false);
          } else {
            toast.error("error ! something went wrong.");
            setCtLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCtLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCtLoading(false);
    }
  };

  React.useEffect(() => {
    if (width > 765) {
      setExtraSpacing([
        { title: "", value: "" },
        { title: "", value: "" },
      ]);
    } else setExtraSpacing([]);
  }, [width]);

  const tokenInfoData: (
    | {
        title: string;
        value: string;
        type: string;
      }
    | {
        title: string;
        value: string;
        type?: undefined;
      }
  )[] = [
    {
      title: "Token Address",
      value: stats.TokenAddress,
      type: "address",
    },
    { title: "Token Name", value: stats.TokenName },
    { title: "Token Symbol", value: stats.TokenSymbol },
    { title: "Token Decimals", value: stats.TokenDecimals },
    ...extraSpacing,
  ];

  const lockInfoData = [
    { title: "Title", value: stats.description },
    {
      title: "Total Amount Locked",
      value: `${stats.amount} ${stats.TokenSymbol.toUpperCase()}`,
    },
    {
      title: "Owner",
      value: stats.owner,
      type: "address",
    },
    {
      title: "Lock Date",
      value: moment.unix(stats.lockDate).utc().format(TIME_FORMAT),
    },
    {
      title: "Unlock Date",
      value: moment.unix(stats.tgeDate).utc().format(TIME_FORMAT),
    },
    {
      title: "Unlocked Amount",
      value: stats.unlockedAmount.toString(),
    },
  ];

  return (
    <>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#C6CED6]">
        <h1 className="text-black font-fonde text-4xl md:text-5xl lg:text-7xl font-normal">
          Unlock Token
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
        {/* <Image src={BannerImage} /> */}
      </div>
      <div className="container mx-auto mt-10 px-5 ">
        <div className="shadow-boxShadow6 rounded-xl overflow-hidden mx-auto border border-[#EFF0F7] 2xl:max-w-[60%]">
          <div className="font-semibold text-2xl text-center py-4 border-b border-[#E5E7EB]">
            Unlocks In
          </div>
          <div className="p-4">
            <CountdownTimer
              date={String(stats.tgeDate)}
              isTimeUnix
              variant={width < 700 ? "simple" : ""}
            />
          </div>
        </div>
        {account && account.toLowerCase() === stats.owner.toLowerCase() && (
          <div className="flex justify-center items-center my-[36px]">
            <div className="flex justify-center items-center text-2xl font-medium w-full">
              <Button disabled={ctLoading} onClick={handleUnlock}>
                Unlock
              </Button>
            </div>
          </div>
        )}

        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl mt-9 overflow-hidden">
          <h4 className="text-2xl font-semibold border-b border-[#E5E7EB] bg-[#BCD3F1] p-8">
            Token info
          </h4>
          <div
            className={`grid ${
              width < 450 ? "grid-cols-1" : "grid-cols-2"
            } md:grid-cols-3 lg:grid-cols-5 `}>
            {tokenInfoData.map((data, index) => {
              return (
                <div key={index} className="px-8 py-4">
                  <div className="text-base font-semibold">
                    {data.type == "address"
                      ? walletNameTrimmer(data.value)
                      : data.value}
                  </div>
                  <div className="text-[#94A3B8] text-sm font-normal">
                    {data.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl mt-9 overflow-hidden">
          <h4 className="text-2xl font-semibold border-b border-[#E5E7EB] bg-[#BCD3F1] p-8">
            Lock info
          </h4>
          <div
            className={`grid ${
              width < 450 ? "grid-cols-1" : "grid-cols-2"
            } md:grid-cols-3 lg:grid-cols-5 `}>
            {lockInfoData.map((data, index) => {
              return (
                <div key={index} className="px-8 py-4">
                  <div className="text-base font-semibold">
                    {data.type == "address"
                      ? walletNameTrimmer(data.value)
                      : data.value}
                  </div>
                  <div className="text-[#94A3B8] text-sm font-normal">
                    {data.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnlockTokenComp;
