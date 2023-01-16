import React, { useMemo, useState } from "react";
import HoverImage from "@components/Common/HoverImage";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AiOutlineSearch } from "react-icons/ai";
import { launchpads } from "@constants/launchpads";
import { useAirdropPoolListStats } from "@components/AirDrop/List/hooks/useStats";
import moment from "moment";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";

const AllAirDrops = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 8,
    loading: true,
  });
  const stats = useAirdropPoolListStats(updater);
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };
  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="">
          {stats.poolList.length <= 0 ? (
            <div className="text-center my-12">No data</div>
          ) : (
            <div className="border-t border-[#DFDADA] pt-12 mt-8">
              <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 750: 2, 1000: 3, 1280: 4 }}>
                <Masonry gutter={"20px"}>
                  {stats.poolList.map((lp, index) => {
                    const project_status = () => {
                      return lp?.poolState === "0"
                        ? moment.unix(Number(lp?.startTime)).isAfter(moment())
                          ? "upcoming"
                          : moment
                              .unix(Number(lp?.startTime))
                              .isBefore(moment())
                          ? "airdrop live"
                          : "airdrop ended"
                        : "airdrop ended";
                    };
                    return (
                      <HoverImage
                        src={lp.poolDetails.banner}
                        tokenName={`${lp.poolDetails.title ?? lp.token.name}`}
                        borderRadius="rounded-full cursor-pointer"
                        classTag="object-cover rounded-full min-h-[200px] sm:min-w-[220px] sm:min-h-[220px] w-full max-h-[320px] max-w-[320px] aspect-square"
                        tagName={project_status()}
                        textClass="text-base sm:text-[22px] p-2 font-medium"
                        tagClass="mb-2"
                        type="HomeBanner"
                        detailsLink={`airdrop/details/${lp.poolAddress}`}
                        key={`${index}`}
                        startTime={lp.startTime}
                        time={lp.startTime}
                        saleType="Airdrop"
                      />
                    );
                  })}
                </Masonry>
              </ResponsiveMasonry>
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.getTotalNumberOfPools + 1}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default AllAirDrops;
