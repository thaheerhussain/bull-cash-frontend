import React from "react";
import Image from "next/image";

interface IProps {
  bannerImage?: string;
  logoImage?: string;
  tokenImage?: string;
  date?: string;
  title?: string;
  subTitle?: string;
  description?: string;
  totalRaised?: string;
  participants?: string;
}

const PadCard: React.FC<IProps> = (props: IProps) => {
  const { date, title, subTitle, description, totalRaised, participants } =
    props;
  return (
    <div className="border border-primary-green-border rounded-lg shadow-card-shadow-primary overflow-hidden">
      <div className="relative h-[276px] w-full">
        <div className=" absolute bottom-0 right-0 flex justify-end px-4 lg:px-6 py-1.5 w-full text-base text-primary-green bg-card-green-bg2-color ">
          <div className="flex justify-between min-w-fit lg:w-8/12">
            <div className="mr-2">Ended on</div>
            <div>{date}</div>
          </div>
        </div>
        <div className="absolute -bottom-4 left-6 h-[92px] w-[92px] border border-primary-green-border rounded-md"></div>
      </div>
      <div className="p-6 bg-card-green-bg-color">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-semibold text-primary-text">
            {title}
          </div>
          <Image src={""} height={42} width={42} />
        </div>
        <div className="text-primary-green text-base mt-1">{subTitle}</div>
        <div className="text-primary-text text-base mt-6">{description}</div>
        <div className="mt-8">
          <div className="flex justify-between items-center py-3 text-base text-primary-text border-b border-secondary-green-border">
            <div>Total raised</div>
            <div>{totalRaised}</div>
          </div>
          <div className="flex justify-between items-center py-3 text-base text-primary-text">
            <div>Participants</div>
            <div>{participants}</div>
          </div>
        </div>
      </div>
      <button className="py-1.5 flex justify-center items-center text-base font-semibold w-full rounded-t-lg bg-primary-green ">
        TOKEN SALE
      </button>
    </div>
  );
};

export default PadCard;
