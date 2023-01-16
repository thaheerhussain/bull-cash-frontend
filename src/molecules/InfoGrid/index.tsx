import React, { useMemo } from "react";
import styles from "./infogrid.module.scss";
import {
  BsFacebook,
  BsTwitter,
  BsTelegram,
  BsDiscord,
  BsGlobe,
} from "react-icons/bs";
import { FaGithub, FaInstagram } from "react-icons/fa";
import SocialIcon from "@components/Details/SocialIcon";
import CopyAddress from "@components/Details/CopyAddress";
import { FcReddit } from "react-icons/fc";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Iprops {
  title: string;
  value: string | number;
  fullWidth?: boolean;
  specialClass?: string;
  gridClass?: string;
  type?: "socials" | "address" | "tx" | string;
}

const GridInfoTab = (props: Iprops) => {
  const { title, value, specialClass, type, fullWidth, gridClass } = props;
  if (type === "socials") {
    let icon = BsGlobe;
    switch (title.toLowerCase()) {
      case "facebook":
        icon = BsFacebook;
        break;
      case "twitter":
        icon = BsTwitter;
        break;
      case "instagram":
        icon = FaInstagram;
        break;
      case "github":
        icon = FaGithub;
        break;
      case "reddit":
        icon = FcReddit;
        break;
      case "telegram":
        icon = BsTelegram;
        break;
      case "discord":
        icon = BsDiscord;
        break;
    }
    return (
      <SocialIcon
        Icon={icon}
        Wrapper={({ children }: any) => (
          <a target={"_blank"} href={value.toString()} rel="noreferrer">
            {children}
          </a>
        )}
      />
    );
  }
  if (type === "address" || type === "tx") {
    return (
      <div
        className={`${styles.tab} ${
          fullWidth ? "col-span-2 md:col-span-3" : ""
        } text-left relative`}>
        <CopyAddress
          containerClass={`text-base text-text1 font-semibold capitalize ${specialClass}`}
          type={type}
          address={value as string}
        />
        <div className="text-sm font-normal text-text2 capitalize">{title}</div>
      </div>
    );
  }

  return (
    <div
      className={`${styles.tab} ${gridClass} ${
        fullWidth ? "col-span-2 md:col-span-3" : ""
      } text-left relative`}>
      <div
        className={`text-base text-text1 font-semibold capitalize ${specialClass}`}>
        {value}
      </div>
      <div className="text-sm text-text2 font-normal capitalize">{title}</div>
    </div>
  );
};

export interface IInfoGridProps {
  data: Iprops[];
  specialPosition?: number[];
  specialClass?: string;
  gridClass?: string;
}

const InfoGrid = (props: IInfoGridProps) => {
  const { data, specialClass, specialPosition, gridClass } = props;
  const socials = useMemo(
    () => data.filter((data) => data?.type === "socials"),
    [data]
  );
  const description = useMemo(
    () => data.filter((data) => data?.title === "Description")[0],
    [data]
  );
  return (
    <>
      <div
        className={`${styles.container}  shadow-boxShadow6 px-4 py-3 rounded-lg`}>
        {data
          .filter(
            (data) => data?.type !== "socials" && data?.title !== "Description"
          )
          .map((data, index) => {
            if (specialPosition?.includes(index)) {
              return (
                <GridInfoTab
                  specialClass={specialClass}
                  key={index}
                  {...data}
                />
              );
            }
            return <GridInfoTab gridClass={gridClass} key={index} {...data} />;
          })}
      </div>

      {description ? (
        <div
          className={`bg-white flex flex-wrap gap-4 my-8 items-center shadow-boxShadow6 px-4 py-3 rounded-lg`}>
          <p className="text-sm font-normal capitalize text-text2">
            <EditerMarkdown
              source={description.value.toString()}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </p>
        </div>
      ) : null}

      {socials.length > 0 && (
        <div
          className={`bg-white flex flex-wrap gap-4 my-8 items-center shadow-boxShadow6 px-4 py-3 rounded-lg`}>
          {data
            .filter((data) => data?.type === "socials")
            .map((data, index) => {
              if (specialPosition?.includes(index)) {
                return (
                  <GridInfoTab
                    specialClass={specialClass}
                    key={index}
                    {...data}
                  />
                );
              }
              return (
                <GridInfoTab gridClass={gridClass} key={index} {...data} />
              );
            })}
        </div>
      )}
    </>
  );
};

export default InfoGrid;
