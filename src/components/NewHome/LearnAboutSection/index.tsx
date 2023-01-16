import React from "react";
import LearnAbout1Pic from "@public/images/learnAbout1.jpg";
import LearnAbout2Pic from "@public/images/learnAbout2.jpg";
import DotedBGPic from "@public/images/dotedBG.jpg";
import Image, { StaticImageData } from "next/image";

interface IProps {
  image: StaticImageData;
  title: string;
  description?: string;
}

const CardSection: React.FC<IProps> = (props: IProps) => {
  return (
    <div className="aspect-[4/3] px-4 sm:px-10 xl:px-20 border border-primary-green-border rounded-xl pb-4">
      <div className="w-full h-full bg-transparent relative -top-[60px] md:-top-[80px] text-center md:text-start ">
        <div className="border border-primary-green-border rounded-xl w-full aspect-[5/3] relative ">
          <Image src={props.image} className="rounded-xl" layout="fill" />
        </div>
        <div className=" text-primary-green text-lg  md:text-xl lg:text-3xl 2xl:text-5xl mt-6 md:mt-4 lg:mt-8">
          {props.title}
        </div>
        {props.description && (
          <div className=" hidden sm:block text-primary-text md:text-base lg:text-xl mt-2.5 lg:mt-6">
            {props.description}
          </div>
        )}
      </div>
    </div>
  );
};

const LearnAboutSection = () => {
  return (
    <div className="mb-32">
      <div className=" text-primary-text text-4xl mb-32">
        Learn about BullPad
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-32 md:gap-12 xl:gap-24">
        <CardSection
          image={LearnAbout1Pic}
          title="How to participate in a BullPad IDO?"
          description="A good place to start is : what is BullPad? (We will give you the
          brief version)"
        />
        <CardSection
          image={LearnAbout2Pic}
          title="What is an IDO (Initial Decentralized Offering)"
        />
      </div>
    </div>
  );
};

export default LearnAboutSection;
