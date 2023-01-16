import PadCard from "@molecules/PadCard";
import React from "react";

const RecentPadSection = () => {
  return (
    <div className="mb-32">
      <div className=" text-primary-text text-4xl mb-14">Recent Projects</div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-12 lg:gap-x-24">
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
        <PadCard
          title="Cryptoverse"
          subTitle="921 NFTs"
          description="A 3D Metaverse of Everything"
          date="Jan 7, 2022"
          totalRaised="$3,160,500"
          participants="4156"
        />
      </div>
      <div className="flex justify-center">
        <button className="w-full md:max-w-[253px] rounded-lg border border-primary-green py-3.5 mt-24 bg-card-green-bg3-color text-white">
          Explore Projects
        </button>
      </div>
    </div>
  );
};

export default RecentPadSection;
