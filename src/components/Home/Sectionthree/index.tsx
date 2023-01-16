import React, { useMemo, useState } from "react";
import { usePoolListStats } from "../../LaunchPad/List/hooks/useStats";
import Marquee from "react-fast-marquee";
import HoverImage from "@components/Common/HoverImage";
import Link from "next/link";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import moment from "moment";
import Button from "@atoms/Button";
import { getPercentage, getRingColor } from "@helpers/ringHelpers";
import { Circle } from "rc-progress";
import useSWR from "swr";
import shuffleArray from "@helpers/shuffleArray";

interface Props {
  marginSpace: string;
  classTag: string;
  bannerImg: string;
}

const SectionThree = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 20,
    loading: true,
  });
  const stats = usePoolListStats(updater);
  const [mergeArray, setMergeArray] = useState<any>([]);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: sponsersData, error } = useSWR(
    `https://ctf-backend.aticloud.atican.dev/api/v1/sponsors`,
    fetcher
  );

  React.useEffect(() => {
    if (sponsersData?.data) {
      const merged = [...stats.poolList, ...sponsersData.data];
      const shuffled = shuffleArray(merged);
      setMergeArray(shuffled);
    }
  }, [sponsersData, stats]);

  const getCircleSizeClass = (hardCap: number) => {
    if (hardCap > 0 && hardCap < 10) {
      return "w-[150px]";
    } else if (hardCap > 10 && hardCap < 50) {
      return "w-[180px]";
    } else if (hardCap > 50 && hardCap < 200) {
      return "w-[210px]";
    } else {
      return "w-[240px]";
    }
  };

  const project_status = (data: IPool) => {
    return data?.poolState === "0"
      ? moment.unix(Number(data?.startTime)).isAfter(moment())
        ? "upcoming"
        : moment.unix(Number(data?.startTime)).isBefore(moment()) &&
          moment.unix(Number(data?.endTime)).isAfter(moment())
        ? "sale live"
        : "sale ended"
      : "sale ended";
  };

  return (
    <div className=" overflow-hidden mt-28 lg:mt-36 mb-14">
      <div className="flex justify-center md:justify-between items-center mb-12 relative md:left-[100px]">
        <div className="relative ml-5">
          <h4 className="font-fonde uppercase text-4xl md:text-6xl 2xl:text-7xl">
            launchpad
          </h4>
          <Link href={"/launchpad/list"}>
            <Button
              variant="primary-sm"
              className="absolute uppercase text-xs sm:text-sm right-[0.1rem] cursor-pointer px-6 py-3 rounded-full">
              View all
            </Button>
          </Link>
        </div>
        <div className=" relative md:flex justify-between items-center hidden w-full pl-3">
          <Marquee
            gradient={false}
            speed={30}
            direction="left"
            pauseOnHover={true}>
            {mergeArray &&
              mergeArray.map((item: any, index: any) => {
                if (item.type == "sponsors") {
                  return;
                  // (
                  // <div
                  //   className="flex items-center justify-center relative mx-2.5"
                  //   key={index}>
                  //   <HoverImage
                  //     type="HomeBanner"
                  //     src={item.attributes.image}
                  //     borderRadius="rounded-full"
                  //     classTag={`object-cover rounded-full w-[200px] aspect-square`}
                  //     tagName={"promoted"}
                  //     textClass="text-lg my-1"
                  //     tokenName={`${item.attributes.title}`}
                  //     detailsLink={item.attributes.link}
                  //     outerlink={true}
                  //     startTime={item.startTime}
                  //     endTime={item.endTime}
                  //     time={`${
                  //       project_status(item) === "sale live"
                  //         ? item.endTime
                  //         : project_status(item) === "upcoming"
                  //         ? item.startTime
                  //         : ""
                  //     }`}
                  //   />
                  // </div>
                  // );
                }
                return (
                  <div
                    className="flex items-center justify-center relative mx-2.5"
                    key={index}>
                    <HoverImage
                      type="HomeBanner"
                      hardCap={item?.hardCap}
                      src={item.logourl}
                      borderRadius="rounded-full"
                      classTag={`object-cover rounded-full homeCircle aspect-square`}
                      tagName={project_status(item)}
                      textClass="text-lg my-1"
                      tokenName={`${item.poolDetails?.title ?? item.name}`}
                      detailsLink={
                        item.poolType == "1"
                          ? `private-sale/details/${item.poolAddress}`
                          : item.poolType == "2"
                          ? `fairlaunch/details/${item.poolAddress}`
                          : `launchpad/details/${item.poolAddress}`
                      }
                      startTime={item.startTime}
                      endTime={item.endTime}
                      time={`${
                        project_status(item) === "sale live"
                          ? item.endTime
                          : project_status(item) === "upcoming"
                          ? item.startTime
                          : ""
                      }`}
                    />
                  </div>
                );
              })}
          </Marquee>
          <div className="hidden md:block bg-white-lft absolute left-3 w-[20%] h-full z-20"></div>
        </div>
        <div className="bg-white-rt absolute right-24 w-[10%] h-full z-20"></div>
      </div>
      <div className="flex justify-between items-center mb-12 relative overflow-x-auto md:overflow-x-hidden">
        <Marquee
          gradient={false}
          speed={30}
          direction="right"
          pauseOnHover={true}>
          {mergeArray &&
            mergeArray.map((item: any, index: any) => {
              if (item.type == "sponsors") {
                return;
                // (
                //   <div
                //     className="flex items-center justify-center relative mx-2.5"
                //     key={index}>
                //     <HoverImage
                //       type="HomeBanner"
                //       src={item.attributes.image}
                //       borderRadius="rounded-full"
                //       classTag={`object-cover rounded-full w-[200px] aspect-square`}
                //       tagName={"promoted"}
                //       textClass="text-lg my-1"
                //       tokenName={`${item.attributes.title}`}
                //       detailsLink={item.attributes.link}
                //       outerlink={true}
                //       startTime={item.startTime}
                //       endTime={item.endTime}
                //       time={`${
                //         project_status(item) === "sale live"
                //           ? item.endTime
                //           : project_status(item) === "upcoming"
                //           ? item.startTime
                //           : ""
                //       }`}
                //     />
                //   </div>
                // );
              }
              return (
                <div
                  className="flex items-center justify-center relative mx-2.5"
                  key={index}>
                  <HoverImage
                    type="HomeBanner"
                    hardCap={item?.hardCap}
                    src={item.logourl}
                    borderRadius="rounded-full"
                    classTag={`object-cover rounded-full homeCircle  aspect-square`}
                    tagName={project_status(item)}
                    textClass="text-lg my-1"
                    tokenName={`${item.poolDetails?.title ?? item.name}`}
                    detailsLink={
                      item.poolType == "1"
                        ? `private-sale/details/${item.poolAddress}`
                        : item.poolType == "2"
                        ? `fairlaunch/details/${item.poolAddress}`
                        : `launchpad/details/${item.poolAddress}`
                    }
                    startTime={item.startTime}
                    endTime={item.endTime}
                    time={`${
                      project_status(item) === "sale live"
                        ? item.endTime
                        : project_status(item) === "upcoming"
                        ? item.startTime
                        : ""
                    }`}
                  />
                </div>
              );
            })}
        </Marquee>
        <div className="bg-white-rt absolute right-0 w-[10%] h-full z-20"></div>
        <div className="bg-white-lft absolute left-0 w-[10%] h-full z-20"></div>
      </div>
      <div className="md:flex justify-between items-center mb-12 relative hidden">
        <Marquee
          gradient={false}
          speed={30}
          direction="left"
          pauseOnHover={true}>
          {mergeArray &&
            mergeArray.map((item: any, index: any) => {
              if (item.type == "sponsors") {
                return;
                // (
                //   <div
                //     className="flex items-center justify-center relative mx-2.5"
                //     key={index}>
                //     <HoverImage
                //       type="HomeBanner"
                //       src={item.attributes.image}
                //       borderRadius="rounded-full"
                //       classTag={`object-cover rounded-full w-[200px] aspect-square`}
                //       tagName={"promoted"}
                //       textClass="text-lg my-1"
                //       tokenName={`${item.attributes.title}`}
                //       detailsLink={item.attributes.link}
                //       outerlink={true}
                //       startTime={item.startTime}
                //       endTime={item.endTime}
                //       time={`${
                //         project_status(item) === "sale live"
                //           ? item.endTime
                //           : project_status(item) === "upcoming"
                //           ? item.startTime
                //           : ""
                //       }`}
                //     />
                //   </div>
                // );
              }
              return (
                <div
                  className="flex items-center justify-center relative mx-2.5"
                  key={index}>
                  <HoverImage
                    type="HomeBanner"
                    hardCap={item?.hardCap}
                    src={item.logourl}
                    borderRadius="rounded-full"
                    classTag={`object-cover rounded-full homeCircle aspect-square`}
                    tagName={project_status(item)}
                    textClass="text-lg my-1"
                    tokenName={`${item.poolDetails?.title ?? item.name}`}
                    detailsLink={
                      item.poolType == "1"
                        ? `private-sale/details/${item.poolAddress}`
                        : item.poolType == "2"
                        ? `fairlaunch/details/${item.poolAddress}`
                        : `launchpad/details/${item.poolAddress}`
                    }
                    startTime={item.startTime}
                    endTime={item.endTime}
                    time={`${
                      project_status(item) === "sale live"
                        ? item.endTime
                        : project_status(item) === "upcoming"
                        ? item.startTime
                        : ""
                    }`}
                  />
                </div>
              );
            })}
        </Marquee>
        <div className="bg-white-rt absolute right-0 w-[10%] h-full z-20"></div>
        <div className="bg-white-lft absolute left-0 w-[10%] h-full z-20"></div>
      </div>
    </div>
  );
};

export default SectionThree;
