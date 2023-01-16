import { Circle } from "rc-progress";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import Lead from "@public/icons/svgs/lead.svg";
import Button from "@atoms/Button";
import { leaderBoardData } from "@constants/leaderboardData";
import useSWR from "swr";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import { useRouter } from "next/router";
import Loader from "@components/Loader";
import {
  IPool,
  usePoolListStats,
} from "@components/LaunchPad/List/hooks/useStats";
import { graphFetcher } from "@components/Home/Sectionone";
import { TIME_FORMAT } from "@constants/timeFormats";

interface ITopPerformerItem {
  id: string;
  type: string;
  totalRaised: number;
  startTime: number;
  poolDetails: string;
}

const TopPerformerItem: React.FC<IPool> = ({
  totalRaised,
  startTime,
  poolDetails,
  poolAddress,
  poolType,
  logourl,
}) => {
  const { chainId } = useAuth();
  const router = useRouter();
  const poolLink =
    poolType == "Private Sale"
      ? `private-sale/details/${poolAddress}`
      : poolType == "Fairlaunch"
      ? `fairlaunch/details/${poolAddress}`
      : `launchpad/details/${poolAddress}`;

  const viewPool = () => {
    router.push(poolLink);
  };

  return (
    <div className="font-normal py-2.5 border-b border-bordergraylight flex flex-wrap sm:flex-nowrap items-center justify-between md:px-3 gap-3">
      <div className="flex items-center">
        <div className=" h-10 w-10 rounded-full mr-2 md:mr-4">
          <Image
            src={logourl ?? Lead}
            height={40}
            width={40}
            objectFit="cover"
            className="rounded-full"
            alt=""
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-base">
            {poolDetails?.title ?? "Unknown"}
          </div>
          <div className="flex flex-col text-sm font-medium">
            <p className="">
              {parseFloat(totalRaised) / 10 ** 18}{" "}
              <span className="text-xs font-semibold">
                {supportNetwork[chainId || "default"]?.symbol}
              </span>
            </p>
            <p className="">
              <span className="text-[#64748B]">Listing time: </span>
              {moment.unix(Number(startTime)).utc().format(TIME_FORMAT)}
            </p>
          </div>
        </div>
      </div>
      <Button
        onClick={viewPool}
        className="rounded-full py-2 w-20  text-xs sm:text-sm md:text-base"
        variant="primary-xs">
        {"View"}
      </Button>
    </div>
  );
};

const TopPerformer = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 5,
    loading: true,
  });
  // const topPerformers = usePoolListStats(updater);

  const endDate = useMemo(() => moment().add(1, "minutes").unix(), []);
  const {
    data: topPerformers,
    error,
    isValidating: loading,
  } = useSWR(
    `{
     pools(orderBy: totalRaised, orderDirection: desc, where: {endTime_gt: ${endDate}}){
  id
  type
  totalRaised
  startTime
  poolDetails
  addresses
  }
  }`,
    graphFetcher
  );
  console.log("topPerformers", topPerformers);
  //   const loading = !error && !topPerformers;
  return (
    <div className="p-6 flex-1 rounded-3xl sm:rounded-[70px] shadow-boxShadow3 w-full max-w-3xl 2xl:max-w-5xl">
      <h2 className="text-2xl font-medium p-3 pb-0 mt-4">Trending</h2>
      <div className="mt-4 mb-10">
        {loading ? (
          <Loader />
        ) : topPerformers?.pools.length > 0 ? (
          <>
            {topPerformers?.pools?.map(
              (
                data: {
                  id: string;
                  type: string;
                  totalRaised: string;
                  startTime: string;
                  poolDetails: string;
                  addresses: string;
                },
                index: number
              ) => {
                const poolDetails = JSON.parse(data.poolDetails);
                return (
                  <TopPerformerItem
                    decimals={""}
                    name={""}
                    symbol={""}
                    endTime={""}
                    hardCap={""}
                    liquidityListingRate={""}
                    liquidityPercent={""}
                    maxContribution={""}
                    minContribution={""}
                    poolState={""}
                    rate={""}
                    softCap={""}
                    token={""}
                    percentageRaise={0}
                    key={index}
                    {...{
                      totalRaised: data.totalRaised,
                      startTime: data.startTime,
                      poolDetails,
                      poolAddress: data.id,
                      poolType: data.type,
                      logourl: poolDetails?.logo || "",
                    }}
                  />
                );
              }
            )}
          </>
        ) : (
          <div className="text-center font-normal text-base">
            {" "}
            No data found
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPerformer;
