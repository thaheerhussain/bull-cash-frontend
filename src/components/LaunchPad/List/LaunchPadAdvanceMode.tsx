import CheckBoxDropdown from "@atoms/CheckboxDropdown";
import { CountdownTimer } from "@atoms/CountdownTimer";
import millify from "millify";
import {
  CoinOptions,
  HCOptions,
  KycOptions,
  LockUpTimeOptions,
  NameOptions,
  ProgressOptions,
} from "@constants/tableDropdownOptions";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useMemo,
  useId,
} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { MdSwitchLeft, MdOutlineSearch } from "react-icons/md";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import moment from "moment";
import Link from "next/link";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";
import { IStats, IUpdater } from "./AllLaunchPads";
import { title } from "case";
import Button from "@atoms/Button";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import { BsFillCaretUpFill, BsFillCaretDownFill } from "react-icons/bs";
import useSWR from "swr";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { Tooltip as ReactTooltip } from "react-tooltip";

const LaunchPadAdvanceMode = ({
  launchpads,
  stats,
  updater,
  setUpdater,
}: {
  launchpads: IPool[];
  stats: IStats;
  updater: IUpdater;
  setUpdater: Dispatch<SetStateAction<IUpdater>>;
}) => {
  const router = useRouter();
  const { chainId } = useAuth();
  const [checkedHC, setCheckedHC] = useState<{ [key: string]: any }>({});
  const [checkedProgress, setCheckedProgress] = useState<{
    [key: string]: any;
  }>({});
  const [checkedKyc, setCheckedKyc] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const [filteredData, setFilteredData] = useState<IPool[]>([]);
  const [sortingLiquidity, setSortingLiquidity] = useState("");
  const [sortingCountdown, setSortingCountdown] = useState("");

  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };

  const tableHeader = [
    {
      title: "Name",
      icon: MdOutlineSearch,
      isDropdown: true,
      isSearch: true,
      widthClass: "min-w-[8rem]",
    },
    {
      title: "HC",
      icon: IoIosArrowDown,
      isDropdown: true,
      options: HCOptions,
      checkedItems: checkedHC,
      setCheckedItems: setCheckedHC,
      widthClass: "min-w-[3rem]",
    },
    {
      title: "Liquidity%",
      icon: MdSwitchLeft,
      widthClass: "min-w-[6rem]",
      sorting: "liquidity",
    },
    {
      title: "Coin",
      widthClass: "min-w-[5rem]",
    },
    {
      title: "Symbol",
      widthClass: "min-w-[5rem]",
    },
    {
      title: "Progress",
      icon: IoIosArrowDown,
      isDropdown: true,
      options: ProgressOptions,
      checkedItems: checkedProgress,
      setCheckedItems: setCheckedProgress,
      widthClass: "min-w-[5rem]",
    },
    {
      title: "KYC/Audit",
      //icon: IoIosArrowDown,
      //isDropdown: true,
      //options: KycOptions,
      //checkedItems: checkedKyc,
      //setCheckedItems: setCheckedKyc,
      widthClass: "min-w-[5.6rem]",
    },
    {
      title: "Countdown",
      icon: MdSwitchLeft,
      widthClass: "min-w-[6rem]",
      sorting: "countdown",
    },
  ];

  const project_status = (singleData: IPool) => {
    return singleData?.poolState === "0"
      ? moment.unix(Number(singleData?.startTime)).isAfter(moment())
        ? "upcoming"
        : moment.unix(Number(singleData?.startTime)).isBefore(moment()) &&
          moment.unix(Number(singleData?.endTime)).isAfter(moment())
        ? "sale live"
        : "sale ended"
      : "sale ended";
  };

  useEffect(() => {
    if (searchValue.length > 2) {
      const data = launchpads.filter(
        (item) =>
          item.name.toLowerCase().indexOf(searchValue.toLowerCase()) != -1
      );
      setFilteredData(data);
    } else {
      setFilteredData(launchpads);
    }
  }, [searchValue]);

  useEffect(() => {
    if (
      (checkedHC && checkedHC.Fairlaunch === true) ||
      checkedHC.Presale === true ||
      checkedHC["Private Sale"] === true
    ) {
      const data = launchpads.filter((item) => {
        return (
          item.poolType === (checkedHC.Fairlaunch ? "2" : "") ||
          item.poolType === (checkedHC.Presale ? "0" : "") ||
          item.poolType === (checkedHC["Private Sale"] ? "1" : "")
        );
      });
      setFilteredData(data);
    } else {
      setFilteredData(launchpads);
    }
  }, [checkedHC]);

  useEffect(() => {
    if (
      (checkedProgress && checkedProgress.Live === true) ||
      checkedProgress.Ended === true ||
      checkedProgress.Upcoming === true
    ) {
      const data = launchpads.filter((item) => {
        return (
          project_status(item) === (checkedProgress.Live ? "sale live" : "") ||
          project_status(item) ===
            (checkedProgress.Ended ? "sale ended" : "") ||
          project_status(item) === (checkedProgress.Upcoming ? "upcoming" : "")
        );
      });
      setFilteredData(data);
    } else {
      setFilteredData(launchpads);
    }
  }, [checkedProgress]);

  const setSortingParams = (value: string) => {
    const sortType =
      value === "liquidity" ? sortingLiquidity : sortingCountdown;
    const sortSetType =
      value === "liquidity" ? setSortingLiquidity : setSortingCountdown;
    if (sortType === "" || sortType === "down") {
      sortSetType("up");
    } else {
      sortSetType("down");
    }
  };

  const activeIcon = (value: string) => {
    const sortType =
      value === "liquidity" ? sortingLiquidity : sortingCountdown;
    if (sortType === "up") {
      return "icon-up";
    }
    if (sortType === "down") {
      return "icon-down";
    }
  };

  useEffect(() => {
    if (sortingLiquidity === "up") {
      const data = filteredData.sort(
        (a, b) => Number(b.liquidityPercent) - Number(a.liquidityPercent)
      );
      setFilteredData(data);
    } else {
      const data = filteredData.sort(
        (a, b) => Number(a.liquidityPercent) - Number(b.liquidityPercent)
      );
      setFilteredData(data);
    }
  }, [sortingLiquidity]);

  useEffect(() => {
    if (sortingCountdown === "up") {
      const data = filteredData.sort(
        (a, b) => Number(b.startTime) - Number(a.startTime)
      );
      setFilteredData(data);
    } else {
      const data = filteredData.sort(
        (a, b) => Number(a.startTime) - Number(b.startTime)
      );
      setFilteredData(data);
    }
  }, [sortingCountdown]);

  const SingleRow = (singleData: IPool, key: number) => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data: tagsData, error } = useSWR(
      `https://ctf-backend.aticloud.atican.dev/api/v1/presales/${singleData.poolAddress.toLowerCase()}`,
      fetcher
    );
    const tagsList = useMemo(
      () => tagsData?.data?.attributes?.tags?.filter((a: any) => a.name !== ""),
      [tagsData]
    );
    const loading = !error && !tagsData;

    const subKyc = (type: string, color: string) => {
      const id = type + "-" + singleData.poolAddress.substring(0, 5);

      if (
        tagsList?.find(
          (e: { name: string }) => e.name.toLowerCase() === type.toLowerCase()
        )
      ) {
        return (
          <>
            <BiCheckCircle size={18} color={color} id={id} />
            <ReactTooltip anchorId={id} place="top" content={type} />
          </>
        );
      } else {
        return <BiXCircle size={18} color="#cdcfce" />;
      }
    };

    const renderKycAudit = () => {
      return (
        <>
          {loading ? (
            <></>
          ) : (
            <div className="flex gap-1 items-center">
              {subKyc("KYC", "rgb(16, 185, 129)")}
              {subKyc("Audit", "rgb(63, 129, 207)")}
              {subKyc("Safu", "rgb(223, 95, 248) ")}
            </div>
          )}
        </>
      );
    };

    const poolLink =
      singleData.poolType == "1"
        ? `private-sale/details/${singleData.poolAddress}`
        : singleData.poolType == "2"
        ? `fairlaunch/details/${singleData.poolAddress}`
        : `launchpad/details/${singleData.poolAddress}`;
    const symbol =
      singleData.poolType.toString() == "1"
        ? "Private Sale"
        : singleData.symbol;

    const hardCap =
      singleData.poolType == "2" ? (
        <p className="text-[#28B81B] text-sm">{"Fairlaunch"}</p>
      ) : (
        <p className="text-[#ff8a00]">
          {millify(Number(singleData.hardCap), {
            precision: 2,
          })}
        </p>
      );
    return (
      <tr className="border-b border-bordergraylight">
        <td className="text-[15px] font-medium flex items-center p-4 cursor-pointer">
          <Link href={`/${poolLink}`}>
            <div className="flex items-center">
              <div className="flex shrink-0">
                <img
                  src={singleData.logourl}
                  alt={""}
                  className="w-8 h-8 rounded-full mr-2 bg-[#ccc] object-cover"
                />
              </div>
              <span className="w-[7.6rem] truncate">
                {singleData.name ? singleData.name : "---"}
              </span>
            </div>
          </Link>
        </td>
        <td className="text-[15px] font-semibold p-4">
          {hardCap ? hardCap : "---"}
        </td>
        <td className="text-[15px] font-medium p-4">
          {singleData.liquidityPercent.toString() === "0"
            ? "Manual"
            : singleData.liquidityPercent + "%"}
        </td>
        <td className="text-[15px] font-medium p-4">
          {supportNetwork[chainId || "default"]?.symbol ?? "---"}
        </td>
        <td className="text-[15px] font-medium p-4">{symbol ?? "---"}</td>
        <td className="text-[15px] font-medium p-4">
          {title(project_status(singleData)) ?? "---"}
        </td>
        <td className="text-[15px] font-medium p-4">
          {/* {singleData.Audit ? singleData.Audit : "---"} */}
          {renderKycAudit()}
        </td>
        <td className="text-[15px] font-medium p-4">
          <CountdownTimer
            date={`${singleData.startTime}`}
            variant={"inBox"}
            className={"justify-start"}
            isTimeUnix
          />
        </td>
        <td>
          <span className=" px-3 py-[6px] cursor-pointer bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2  text-[15px] font-medium rounded-lg">
            <Link href={`/${poolLink}`}>view</Link>
          </span>
        </td>
      </tr>
    );
  };

  useEffect(() => {
    setFilteredData(launchpads);
  }, [launchpads]);

  return (
    <div className="mt-10">
      {stats.loading ? (
        <Loader />
      ) : (
        <>
          {launchpads.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead className="border-b border-[#DFDADA] bg-white">
                    <tr className="">
                      {tableHeader.map((head, index) => {
                        return (
                          <th
                            key={index}
                            className="bg-white capitalize text-[15px] font-semibold p-4 py-2">
                            {head.isDropdown ? (
                              <CheckBoxDropdown
                                checkedItems={head.checkedItems}
                                setCheckedItems={head.setCheckedItems}
                                title={head.title}
                                options={head.options}
                                Icon={head.icon}
                                isSearch={head.isSearch}
                                widthClass={head.widthClass}
                                getSearchValue={(search: string) =>
                                  setSearchValue(search)
                                }
                              />
                            ) : (
                              <div
                                className={`flex justify-between text-[15px] font-semibold  items-center w-full ${head.widthClass} `}>
                                {head.title}
                                {head.icon && head.sorting && (
                                  <div
                                    className="sorting-icon cursor-pointer"
                                    onClick={() =>
                                      setSortingParams(head.sorting)
                                    }>
                                    <BsFillCaretUpFill
                                      size="12"
                                      className={`icon-color ${
                                        activeIcon(head.sorting) ===
                                          "icon-up" && "active"
                                      }`}
                                    />
                                    <BsFillCaretDownFill
                                      size="12"
                                      className={`icon-color  ${
                                        activeIcon(head.sorting) ===
                                          "icon-down" && "active"
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </th>
                        );
                      })}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-6">
                          No Data Found{" "}
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((singleData, index) => (
                        <SingleRow {...singleData} key={index} />
                      ))
                    )}
                    <tr>
                      <td colSpan={9} className="text-center h-24"></td>
                    </tr>
                  </tbody>

                  {/* <tbody>
                    {filteredData.map((singleData, index) => (
                      <SingleRow {...singleData} key={index} />
                    ))}
                  </tbody> */}
                </table>
              </div>
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.getTotalNumberOfPools + 1}
              />
            </>
          ) : (
            <div className="text-center py-20">No Data Found </div>
          )}
        </>
      )}
    </div>
  );
};
export default LaunchPadAdvanceMode;
