import React, { useState } from "react";
import ballonIcon from "@public/icons/svgs/ballonicon.svg";
import stackIcon from "@public/icons/svgs/stackicon.svg";
import pieChartIcon from "@public/icons/svgs/piecharticon.svg";
import AllAirDrops from "./AllAirDrops";
import Image from "next/image";
import MyAirDrop from "./MyAirDrop";
import CreatedByYou from "./CreatedByYou";
import BannerImage from "@public/images/airdroplist.png";

const Tabs = [
  {
    title: "All Airdrop",
    icon: ballonIcon,
  },
  {
    title: "Created By You",
    icon: pieChartIcon,
  },
];

const AirDropListComp = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
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
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#9e94ce]">
        <h1 className="text-white font-fonde text-4xl md:text-5xl lg:text-7xl font-normal mt-4 md:mt-0 mx-4">
          Airdrop List
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
      </div>
      <div className="px-6 md:px-10 container mx-auto">
        <div className="flex flex-wrap gap-6 w-full justify-between mt-8">
          <div className="w-full flex xl:self-end lg:w-auto">
            <div className="overflow-x-auto">
              <ul className="flex text-base font-normal w-full">
                {Tabs.map((tab, index) => renderTab(index))}
              </ul>
            </div>
          </div>
        </div>
        {currentTab === 0 && <AllAirDrops />}
        {currentTab === 1 && <CreatedByYou />}
      </div>
    </>
  );
};

export default AirDropListComp;
