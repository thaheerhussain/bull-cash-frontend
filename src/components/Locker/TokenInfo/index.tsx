import React from "react";
import { useRouter } from "next/router";
import InfoGrid from "@molecules/InfoGrid";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import { trimAddress } from "@constants/constant";
import { formatUnits } from "ethers/lib/utils";
import Link from "next/link";
import moment from "moment";
import BannerImage from "@public/images/tokenBannerImage.png";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { TIME_FORMAT } from "@constants/timeFormats";
import useWidth from "@hooks/useWidth";

const tableHeader = [
  // "ID",
  "Wallet",
  "Amount",
  "Cycle(d)",
  "Cycle Release(%)",
  "TGE(%)",
  "Unlock time(UTC)",
];

const TokenInfoComp = () => {
  const router = useRouter();
  const width = useWidth();
  const address = router.query.id;
  const stats = useDetailsStats({
    address: Array.isArray(address) ? address[0] : address,
  });

  const onViewHandler = (address: string) => {
    router.push(`/locker/unlock-token/${address}`);
  };

  console.log("stats", stats);

  const tokenInfo = [
    {
      title: "Token Address",
      value: stats.TokenAddress,
      type: "address",
    },
    {
      title: "Total Locked Amount",
      value: `${stats.cumulativeLockInfo} ${stats.TokenSymbol.toUpperCase()}`,
    },
    {
      title: "Token Name",
      value: stats.TokenName,
    },
    {
      title: "Token Symbol",
      value: stats.TokenSymbol,
    },
    {
      title: "Token Decimals",
      value: stats.TokenDecimals,
    },
  ];

  return (
    <>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#F6DE8F]">
        <h1 className="text-black font-fonde text-4xl md:text-5xl lg:text-7xl font-normal mt-4">
          Token Info
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
        {/* <Image src={BannerImage} /> */}
      </div>
      <div className="container mx-auto mt-[36px]">
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl">
          <div className="mt-[60px]">
            <h4 className="text-2xl font-semibold border-b border-[#E5E7EB] pb-8 mt-8 pl-8">
              Token lock details
            </h4>
            <div
              className={`grid ${
                width < 450 ? "grid-cols-1" : "grid-cols-2"
              } md:grid-cols-3 lg:grid-cols-5 `}>
              {tokenInfo.map((data, index) => {
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
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl mt-6">
          <h4 className="text-2xl font-semibold border-b border-[#E5E7EB] pb-8 mt-8 pl-8">
            Lock Record
          </h4>
          <div className="overflow-x-auto p-6">
            <table className="table table-zebra w-full">
              <thead className="border-b border-bordergraydark">
                <tr>
                  {tableHeader.map((head, index) => {
                    return (
                      <th
                        key={index}
                        className="bg-white capitalize text-lg font-medium">
                        {head}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {stats.lockdata.map((singleData, index) => {
                  return (
                    <tr
                      key={index}
                      className="hover border-b border-bordergraylight ">
                      <td className="text-base font-medium ">
                        {trimAddress(singleData.owner)}
                      </td>
                      <td className="text-base font-normal">
                        {formatUnits(singleData.amount, stats.TokenDecimals)}
                      </td>
                      <td className="text-base font-normal">
                        {singleData.cycle ? singleData.cycle : "--"}
                      </td>
                      <td className="text-base font-normal">
                        {singleData.cycleBps ? singleData.cycleBps : "--"}
                      </td>
                      <td className="text-base font-normal">
                        {singleData.tgeBps ? singleData.tgeBps : "--"}
                      </td>
                      <td className="text-base font-normal">
                        {moment
                          .unix(Number(singleData.tgeDate))
                          .utc()
                          .format(TIME_FORMAT)}
                      </td>

                      <td onClick={() => onViewHandler(singleData.id)}>
                        <div className="bg-[#EB6D65] px-4 py-3 inline-flex text-white rounded-[40px] mx-auto cursor-pointer">
                          View
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenInfoComp;
