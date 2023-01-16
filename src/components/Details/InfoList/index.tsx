import React, { useMemo } from "react";
import CopyAddress from "@components/Details/CopyAddress";

interface Iprops {
  title: string;
  value: string | number;
  fullWidth?: boolean;
  specialClass?: string;
  gridClass?: string;
  type?: "socials" | "address" | "tx" | string;
}

const InfoTab = (props: Iprops) => {
  const { title, value, specialClass, type, fullWidth, gridClass } = props;
  if (type === "address" || type === "tx") {
    return (
      <div
        className={`flex px-6 items-center justify-between py-2.5 border-b last:border-0`}>
        <div className="text-sm font-normal capitalize">{title}</div>
        <CopyAddress
          containerClass={`text-sm text-red-text font-medium text-right capitalize ${specialClass}`}
          type={type}
          iconSize={18}
          address={value as string}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between py-2.5 px-6 border-b last:border-0`}>
      <div className="text-sm  font-normal capitalize">{title}</div>
      <div
        className={`text-sm  font-medium capitalize text-right ${specialClass}`}>
        {value}
      </div>
    </div>
  );
};

export interface IInfoListProps {
  data: Iprops[];
  specialPosition?: number[];
  specialClass?: string;
  gridClass?: string;
}

const InfoList = (props: IInfoListProps) => {
  const { data, specialClass, specialPosition, gridClass } = props;
  return (
    <>
      <div className={`shadow-boxShadow6  rounded-2xl border pb-6`}>
        <p className="border-b text-xl font-medium mb-2 pb-1 pt-4 px-6">
          Details
        </p>
        {data
          .filter(
            (data) => data?.type !== "socials" && data?.title !== "Description"
          )
          .map((data, index) => {
            if (specialPosition?.includes(index)) {
              return (
                <InfoTab specialClass={specialClass} key={index} {...data} />
              );
            }
            return <InfoTab gridClass={gridClass} key={index} {...data} />;
          })}
      </div>
    </>
  );
};

export default InfoList;
