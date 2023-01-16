import CustomTable from "./Table";
import React, { useState } from "react";
import BannerImage from "@public/images/multisenderBanner.png";
import {
  useCommonLpStats,
  useCommonStats,
  useMyLpLockStats,
  useMyTokenLockStats,
} from "@components/Locker/Token/hooks/useStats";
import { formatUnits } from "ethers/lib/utils";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";

const Tabs = ["Token Lock", "Liquidity", "My Lock", "My Liquidity Lock"];

const TokenLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useCommonStats(updater);
  console.log("stats", stats);
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
        <div className="border-t border-[#DFDADA] pt-12 mt-8">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/token-info/${tk.token}`,
                }))}
              />
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
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

const LiquidityLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useCommonLpStats(updater);
  console.log("stats", stats);

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
        <div className="border-t border-[#DFDADA] pt-12 mt-8">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/liquidity-info/${tk.token}`,
                }))}
              />
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
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

const MyTokenLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useMyTokenLockStats(updater);
  console.log("stats", stats);

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
        <div className="border-t border-[#DFDADA] pt-12 mt-8">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/token-info/${tk.token}`,
                }))}
              />
              {/* <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
              /> */}
            </>
          ) : (
            <div className="text-center py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};
const MyLpLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useMyLpLockStats(updater);
  console.log("stats", stats);
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
        <div className="border-t border-[#DFDADA] pt-12 mt-8">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/liquidity-info/${tk.token}`,
                }))}
              />
              {/* <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
              /> */}
            </>
          ) : (
            <div className="text-center py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};

const TokenAndLiquidityComp = () => {
  const [currentTab, setCurrentTab] = React.useState("Token Lock");

  const tableHandler = () => {
    switch (currentTab) {
      case "Token Lock":
        return <TokenLockComponent />;
      case "Liquidity":
        return <LiquidityLockComponent />;
      case "My Lock":
        return <MyTokenLockComponent />;
      default:
        return <MyLpLockComponent />;
    }
  };

  return (
    <>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#798998]">
        <h1 className="text-white font-fonde text-4xl md:text-5xl lg:text-7xl font-normal mt-4 md:mt-0 mx-4">
          Token and Liquidity
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
      </div>
      <div className="container mx-auto mt-[36px] p-2.5">
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl p-3 md:p-6">
          <div className="flex flex-wrap lg:flex-nowrap w-full justify-between ">
            <div className="w-full">
              <ul className="flex justify-between md:justify-start text-base font-normal w-full p-2 bg-[#E2E8F0] rounded-xl overflow-x-auto">
                {Tabs.map((data, index) => {
                  return (
                    <li
                      key={index}
                      className={`cursor-pointer text-lg font-semibold min-w-fit px-6 py-3 rounded-md ${
                        currentTab === data ? "bg-white" : ""
                      }`}
                      onClick={() => setCurrentTab(data)}>
                      {data}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className=" mt-[20px] md:mt-[40px]">{tableHandler()}</div>
        </div>
      </div>
    </>
  );
};

export default TokenAndLiquidityComp;
