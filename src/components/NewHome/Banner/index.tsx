import React from "react";

const BannerSection = () => {
  return (
    <div className="pt-8 md:p-16 mb-20 md:mb-28">
      <div className=" text-primary-green text-7xl font-semibold">
        <div className="text-3xl md:text-6xl mb-3">Welcome to</div>
        <div className="text-5xl md:text-8xl">BullPad</div>
      </div>
      <div className="text-xl mt-6 text-primary-text ">
        Highly-vetted Web3 projects you can trust. Supported by industry-leading
        creators and funds.
      </div>
      <button className="flex justify-center items-center py-5 bg-primary-green w-full md:max-w-[250px] rounded-xl mt-16 text-xl">
        Upcoming
      </button>
    </div>
  );
};

export default BannerSection;
