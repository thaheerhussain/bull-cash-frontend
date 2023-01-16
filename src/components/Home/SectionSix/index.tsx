import Image from "next/image";
import React from "react";
import Img from "public/images/retro-img.png";
import useWidth from "@hooks/useWidth";
import Button from "@atoms/Button";
import { Router, useRouter } from "next/router";

const SectionSix = () => {
  const width = useWidth();
  const router = useRouter();
  return (
    <div className="flex text-white rounded-3xl bg-dark-blue flex-col lg:flex-row justify-between items-center mx-6  md:mx-10  lg:mx-14 my-28 lg:my-36">
      <div className="flex px-4 py-6 sm:px-6 md:p-8 flex-1 xl:flex-[0.8] flex-col">
        <h4 className="font-fonde  text-4xl md:text-6xl 2xl:text-7xl">
          A Suite of Tools for Token Sales.
        </h4>
        <p className="text-xl md:text-2xl  md:leading-9 text-justify">
          Sign up our mailing list to receive our new presales, features, tips
          and reviews for next 100x projects. Sign up our mailing list to
          receive our new presales, features, tips and reviews for next 100x
          projects.
        </p>
        <div className="flex justify-center w-full md:justify-end mt-4">
          <Button
            variant="outline"
            className="rounded-full w-full sm:w-auto text-base font-medium"
            onClick={() => router.push("/launchpad/create")}>
            Create Launchpad
          </Button>
        </div>
      </div>
      <div className="hidden xl:flex justify-end self-stretch flex-[0.4]">
        <Image src={Img} alt={"retro-img"} objectFit={"cover"} />
      </div>
    </div>
  );
};

export default SectionSix;
