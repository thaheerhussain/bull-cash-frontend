import React from "react";
import Img from "public/images/suite_img.png";
import Img2 from "public/images/suite_img2.png";

import Pic1 from "@public/images/img1.jpg";
import Pic2 from "@public/images/img2.jpg";
import Image from "next/image";

const SectionFive = () => {
  return (
    <div className="flex flex-col text-center xl:text-left xl:flex-row gap-8 items-center mx-6 md:mx-10  lg:mx-14 my-28 xl:my-36">
      <div className="flex w-[300px] sm:w-[420px] lg:flex-[0.4] relative">
        {/* <Image src={Img1} alt={"img-1"} className="absolute" /> */}
        <img
          src={Pic1.src}
          alt={"suite-img"}
          className="w-[70%] max-w-[330px] relative z-10 h-[350px] sm:h-[435px] rounded-[160px]"
        />
        <img
          src={Pic2.src}
          alt={"suite-img"}
          className="absolute max-w-[330px] right-0 z-0 w-[70%] h-[350px] sm:h-[435px] rounded-[160px]"
        />
      </div>

      <div className="flex flex-[0.6] flex-col">
        <h4 className="font-fonde  text-4xl md:text-6xl 2xl:text-7xl">
          A Suite of
          <br />
          Tools for
          <br />
          Token Sales.
        </h4>
        <p className="text-xl md:text-2xl  md:leading-9 px-3">
          Network is designed from the ground up to be as flexible as artists
          are creative. Today, we are making tokens easier and more efficient to
          use with an Ethereum sidechain, and have a roadmap to transition to an
          Ethereum Layer 2.
        </p>
      </div>
    </div>
  );
};

export default SectionFive;
