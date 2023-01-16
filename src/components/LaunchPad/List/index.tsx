import React, { useCallback, useEffect, useMemo, useState } from "react";
import spaceshipIcon from "@public/icons/svgs/spaceshipicon.svg";
import advanceModeIcon from "@public/icons/svgs/advanceModeIcon.svg";
import myContributionIcon from "@public/icons/svgs/myContributionIcon.svg";
import Image from "next/image";
import AllLaunchPadItem from "./AllLaunchPads";
import LaunchPadAdvanceMode from "./LaunchPadAdvanceMode";
import MyContributionLaunchPad from "./MyContributionLaunchPad";
import Dropdown from "@atoms/Dropdown";
import { filterByList, sortByList } from "@constants/dropdownItems";
import moment from "moment";
import { IPool, usePoolListStats, usePoolListUser } from "./hooks/useStats";
import SearchInputV1 from "@atoms/SearchInputV1";
import { AiOutlineSearch } from "react-icons/ai";
import DropdownV1 from "@atoms/DropdownV1";
import { launchpads } from "@constants/launchpads";
import { da } from "date-fns/locale";

const Tabs = [
  {
    title: "All Launchpads",
    icon: spaceshipIcon,
  },

  {
    title: "Advanced Mode",
    icon: advanceModeIcon,
  },
  {
    title: "My Contribution",
    icon: myContributionIcon,
  },
];

export const getProjectTime = (lp: IPool) => {
  const data = lp;
  const startTime = moment.unix(Number(data.startTime));
  const endTime = moment.unix(Number(data.endTime));
  if (moment(startTime).isAfter(moment())) {
    if (data.tier1 || data.tier2) {
      if (data.userWhitelisted) {
        if (data.userTier == 2 && data.tier2) {
          const date = data?.tier2?.start_time
            ? moment.unix(data?.tier2?.start_time || 0)
            : moment(startTime);
          if (date.isAfter(moment())) {
            return date.unix();
          } else {
            return endTime.unix();
          }
        } else {
          const date = data?.tier1?.start_time
            ? moment.unix(data?.tier1?.start_time || 0)
            : moment(startTime);
          if (date.isAfter(moment())) {
            return date.unix();
          } else {
            return endTime.unix();
          }
        }
      } else {
        if (moment(startTime).isAfter(moment())) {
          return startTime.unix();
        } else {
          return endTime.unix();
        }
      }
    } else {
      if (moment(startTime).isAfter(moment())) {
        return startTime.unix();
      } else {
        return endTime.unix();
      }
    }
  } else {
    return endTime.unix();
  }
};
export const getProjectStatus = (lp: IPool) => {
  const data = lp;
  let startTime, endTime;
  if (data.poolState === "1" || data.poolState === "2") {
    return "sale ended";
  }

  if (moment.unix(Number(data.startTime)).isAfter(moment())) {
    if (data.tier2 || data.tier1) {
      if (data.userWhitelisted) {
        if (data.userTier == 2 && data.tier2) {
          startTime = moment.unix(
            Number(data.tier2?.start_time || data.startTime)
          );
          if (startTime.isAfter(moment())) {
            return "upcoming";
          } else {
            return "sale live";
          }
        } else {
          console.log("tier1?.start_time", data.tier1?.start_time);
          startTime = moment.unix(
            Number(data.tier1?.start_time || data.startTime)
          );
          console.log("startTime ti", startTime.isAfter(moment()));
          if (startTime.isAfter(moment())) {
            return "upcoming";
          } else {
            return "sale live";
          }
        }
      } else {
        startTime = moment.unix(Number(data.startTime));
        if (startTime.isAfter(moment())) {
          return "upcoming";
        } else {
          return "sale live";
        }
      }
    } else {
      startTime = moment.unix(Number(data.startTime));
      if (startTime.isAfter(moment())) {
        return "upcoming";
      } else {
        return "sale live";
      }
    }
  } else {
    return moment.unix(Number(data?.startTime)).isBefore(moment()) &&
      moment.unix(Number(data?.endTime)).isAfter(moment())
      ? "sale live"
      : "sale ended";
  }
};
const LaunchPadComp = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [query, setQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string | undefined>(filterByList[0]);
  const [sortBy, setSortBy] = useState<string | undefined>(sortByList[0]);
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 25,
    loading: true,
  });
  const [advancedUpdater, setAdvancedUpdater] = useState({
    page: 0,
    pageSize: 25,
    loading: true,
  });
  const stats = usePoolListStats(updater);
  const advancedStats = usePoolListStats(advancedUpdater);

  // console.log("stats", stats);

  const launchpads = useMemo(() => {
    return stats.poolList;
  }, [stats.poolList]);

  const containStatus = useCallback(
    (lp: IPool) => {
      const status = getProjectStatus(lp);
      if (filterBy?.toLowerCase() === "all status") {
        return true;
      }
      if (status === filterBy?.toLowerCase()) {
        return true;
      }
      return false;
    },
    [filterBy]
  );

  const filterSortedItems = useMemo(() => {
    let filteredItems = [];
    for (const lp of launchpads) {
      if (query && !lp.name.toLowerCase().includes(query.toLowerCase())) {
        continue;
      }

      if (!containStatus(lp)) {
        continue;
      }
      filteredItems.push(lp);
    }

    return filteredItems.sort((a, b) => {
      const { hardCap, softCap, startTime, endTime } = a;
      const {
        hardCap: hardCapB,
        softCap: softCapB,
        startTime: startTimeB,
        endTime: endTimeB,
      } = b;

      switch (sortBy) {
        case sortByList[0]:
          return 0;
        case sortByList[1]:
          return Number(hardCapB) - Number(hardCap);
        case sortByList[2]:
          return Number(softCapB) - Number(softCap);
        case sortByList[3]:
          return Number(startTimeB) - Number(startTime);
        case sortByList[4]:
          return Number(endTimeB) - Number(endTime);
        default:
          return 0;
      }
    });
  }, [launchpads, query, containStatus, sortBy]);

  const renderTab = (tabIndex: number) => {
    return (
      <li
        className="mr-5 min-w-[10rem] cursor-pointer flex gap-2 items-center"
        onClick={() => setCurrentTab(tabIndex)}>
        <Image
          height={20}
          width={20}
          src={Tabs[tabIndex].icon}
          className="flex-shrink-0"
          alt={`tab-${tabIndex}`}
        />{" "}
        <div className="py-2 relative">
          <div
            className={`whitespace-nowrap ${
              currentTab === tabIndex ? "font-semibold" : ""
            }`}>
            {Tabs[tabIndex].title}
          </div>
          <div
            className={`${
              currentTab === tabIndex
                ? "block absolute w-full h-[5px] bottom-0 bg-black"
                : "hidden"
            }`}></div>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="">
        <div className="px-6 mx-auto container">
          <div className="flex flex-col gap-6 w-full justify-between mt-8 py-8 sm:py-10 lg:py-14 px-4 sm:px-6 md:px-8 xl:px-12 rounded-[40px] md:rounded-66 shadow-boxShadow4 border border-borderv1">
            <div className="w-full lg:w-auto">
              <h3 className="text-[#141414] font-fonde text-4xl md:text-6xl font-medium mb-2.5">
                Current Presales
              </h3>
              <div className="overflow-x-auto">
                <ul className="flex text-base font-normal w-full">
                  {Tabs.map((tab, index) => renderTab(index))}
                </ul>
              </div>
            </div>

            {currentTab === 0 && (
              <div className="flex flex-wrap gap-6 w-full justify-between items-center my-2">
                <SearchInputV1
                  placeholder={"Enter Token Name or Token Symbol"}
                  Icon={AiOutlineSearch}
                  className="sm:max-w-2xl sm:min-w-[240px]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex flex-wrap sm:flex-nowrap gap-6">
                  <DropdownV1
                    selectedOption={filterBy}
                    setSelectedOption={setFilterBy}
                    dropdownList={filterByList}
                    label={"Filter By"}
                    className="w-40"
                  />
                  <DropdownV1
                    selectedOption={sortBy}
                    setSelectedOption={setSortBy}
                    dropdownList={sortByList}
                    label={"Sort By"}
                    className="w-40"
                  />
                </div>
              </div>
            )}
          </div>
          {currentTab === 0 && (
            <AllLaunchPadItem
              showSponsers={
                !query && filterBy == filterByList[0] && sortBy == sortByList[0]
              }
              launchpads={filterSortedItems}
              stats={stats}
              updater={updater}
              setUpdater={setUpdater}
            />
          )}
          {currentTab === 1 && (
            <LaunchPadAdvanceMode
              launchpads={advancedStats.poolList}
              stats={advancedStats}
              updater={advancedUpdater}
              setUpdater={setAdvancedUpdater}
            />
          )}
          {currentTab === 2 && <MyContributionLaunchPad />}
        </div>
      </div>
    </>
  );
};

export default LaunchPadComp;
