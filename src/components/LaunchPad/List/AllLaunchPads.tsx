import React, {
  useState,
  useMemo,
  SetStateAction,
  Dispatch,
  useContext,
  useEffect,
} from "react";
import HoverImage from "@components/Common/HoverImage";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";
import moment from "moment";
import { Circle } from "rc-progress";
import { getPercentage, getRingColor } from "@helpers/ringHelpers";
import useSWR from "swr";
import shuffleArray from "@helpers/shuffleArray";
import dynamic from "next/dynamic";
import { GridItem } from "@components/LaunchPad/Grid/GridItem";
import useWidth from "@hooks/useWidth";
import { PackeryContext } from "@components/LaunchPad/Grid/Context";
import {
  getProjectStatus,
  getProjectTime,
} from "@components/LaunchPad/List/index";
const PackeryContainer = dynamic(
  () =>
    import("@components/LaunchPad/Grid/PackeryContainer").then(
      (m) => m.PackeryContainer
    ),
  {
    ssr: false,
  }
);

// Circle diameter
const getCircleSizeClass = (hardCap: number) => {
  if (hardCap > 0 && hardCap < 10) {
    return "grid-item--width1";
  } else if (hardCap > 10 && hardCap < 50) {
    return "grid-item--width2";
  } else if (hardCap > 50 && hardCap < 200) {
    return "grid-item--width3";
  } else {
    return "grid-item--width4";
  }
};
export interface IStats {
  getTotalNumberOfPools: number;
  page: number;
  pageSize: number;
  poolList: IPool[];
  loading: boolean;
  chainId?: number | undefined;
}

export interface IUpdater {
  page: number;
  pageSize: number;
  loading: boolean;
}

function RenderGid({ data }: { data: any }) {
  const { packeryInstance } = useContext(PackeryContext);
  useEffect(() => {
    if (packeryInstance) {
      setTimeout(() => {
        packeryInstance.layout();
      }, 100);
    }
  }, [data, packeryInstance]);

  return (
    data &&
    data.map((item: any, index: any) => {
      if (item.type == "sponsors") {
        return (
          <GridItem
            key={index}
            className={`${getCircleSizeClass(
              Number(item.attributes.hardcap)
            )}`}>
            <div key={index}>
              <HoverImage
                type="HomeBanner"
                hardCap={item.attributes.hardcap}
                src={item.attributes.image}
                borderRadius="rounded-full"
                classTag={`object-cover rounded-full aspect-square`}
                tagName={"promoted"}
                textClass="text-lg my-1"
                tokenName={`${item.attributes.title}`}
                detailsLink={item.attributes.link}
                outerlink={true}
                startTime={item.startTime}
                endTime={item.endTime}
                time={item.startTime}
                description={item?.attributes?.description}
              />
            </div>
          </GridItem>
        );
      }
      return (
        <GridItem
          key={index}
          className={`${getCircleSizeClass(Number(item.hardCap))}`}>
          <div key={index}>
            <HoverImage
              type="HomeBanner"
              src={item.logourl}
              hardCap={item.hardCap}
              borderRadius="rounded-full"
              classTag={`object-cover rounded-full aspect-square`}
              tagName={getProjectStatus(item)}
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
              time={`${getProjectTime(item)}`}
            />
          </div>
        </GridItem>
      );
    })
  );
}

const AllLaunchPadItem = ({
  launchpads,
  stats,
  updater,
  setUpdater,
  showSponsers,
}: {
  launchpads: IPool[];
  stats: IStats;
  updater: IUpdater;
  setUpdater: Dispatch<SetStateAction<IUpdater>>;
  showSponsers: boolean;
}) => {
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };

  const [mergeArray, setMergeArray] = useState<any>([]);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: sponsersData, error } = useSWR(
    `https://ctf-backend.aticloud.atican.dev/api/v1/sponsors`,
    fetcher
  );

  React.useEffect(() => {
    let merged = launchpads;
    if (sponsersData?.data) {
      merged = shuffleArray([...merged, ...sponsersData.data]);
    }
    setMergeArray(merged);
  }, [sponsersData, launchpads]);

  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="pt-12 mt-8">
          {launchpads.length > 0 ? (
            <>
              <PackeryContainer>
                <RenderGid data={showSponsers ? mergeArray : launchpads} />
              </PackeryContainer>
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.getTotalNumberOfPools + 1}
              />
            </>
          ) : (
            <div className="text-center py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};
export default AllLaunchPadItem;
