import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { HiOutlineExternalLink, HiUpload } from "react-icons/hi";
import { GoPrimitiveDot } from "react-icons/go";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import SaleDetailsCard from "./SaleDetailsCard";
import {
  BsDiscord,
  BsFacebook,
  BsGlobe,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";
import { FaGithub, FaInstagram } from "react-icons/fa";
import AddressComp from "./AddressComp";
import SocialIcon from "./SocialIcon";
import InfoGrid from "@molecules/InfoGrid";
import Actions from "./Actions";
import AllocationDetail from "./Allocations";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import {
  IPoolDetails,
  useWhitelistStats,
} from "@components/LaunchPad/Details/hooks/useStats";
import moment from "moment";
import { confirmation2MultiSenderData } from "@constants/multisenderData";
import { useAllocationStats } from "@components/AirDrop/Details/hooks/useStats";
import Footer from "@components/Footer";
import InfoList from "./InfoList";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import LockerInfo from "./LockerDetails";
import { capital, upper } from "case";
import { FcReddit } from "react-icons/fc";
import useSWR from "swr";
import Link from "next/link";
import WhitelistDetail from "@components/Details/Whitelists";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import Kyc from "@public/icons/svgs/tags/kyc.svg";
import Trusted from "@public/icons/svgs/tags/trusted.svg";
import Audit from "@public/icons/svgs/tags/audit.svg";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

export interface IInfoList {
  title: string;
  value: string | number;
  type?: "socials" | "address" | "txn";
}
interface IAddressList {
  addressType: string;
  address: string;
}
export type DetailsType =
  | "launchpad"
  | "fairlaunch"
  | "airdrop"
  | "privatesale"
  | "leaderboard";

export interface IPoolDetailsData {
  status: string;
  logo: string;
  banner: string;
  title: string;
  native_symbol?: string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    supply: number;
    address?: string;
  };
  liquidity?: {
    liquidityListingRate: number;
    liquidityLockDays: number;
    liquidityPercent: number;
    liquidityUnlockTime: number;
  };
  fees?: number;
  myClaim?: number;
  myContribution?: number;
  total_sold: number;
  soft_cap: number;
  hard_cap?: number;
  start_time: number;
  end_time: number;
  min_buy: number;
  max_buy: number;
  description: string;
  sale_type: string;
  pool_address: string;
  tokenAvailable?: number;
  poolOwner: string;
  poolState?: string;
  userWhitelisted?: boolean;
  userTier?: number;
  tier1?: {
    start_time: number;
    end_time: number;
  };
  tier2?: {
    start_time: number;
    end_time: number;
  };
}

interface IDetails {
  infoList: IInfoList[];
  type: DetailsType;
  data: IPoolDetailsData;
}

const AllocationsWithData = ({
  address,
  token,
}: {
  address: string;
  token: IPoolDetailsData["token"];
}) => {
  const allocations = useAllocationStats({
    address,
    page: 0,
    pageSize: 10,
    loading: false,
  });
  console.log("allocations", allocations);
  return allocations.length > 0 ? (
    <AllocationDetail details={allocations} token={token} />
  ) : (
    <></>
  );
};
const WhitelistWithData = ({
  address,
  token,
}: {
  address: string;
  token: IPoolDetailsData["token"];
}) => {
  const allocations = useWhitelistStats({
    address,
    page: 0,
    pageSize: 10,
    loading: false,
  });
  console.log("allocations", allocations);
  return (allocations || [])?.length > 0 ? (
    <WhitelistDetail details={allocations || []} token={token} />
  ) : (
    <></>
  );
};

const renderContent = (type: DetailsType, data: IDetails["data"]) => {
  switch (type) {
    case "fairlaunch":
    case "leaderboard":
      return <Actions type={type} data={data} />;
    case "launchpad":
    case "privatesale":
      return (
        <>
          <Actions type={type} data={data} />
          <WhitelistWithData address={data.pool_address} token={data.token} />
        </>
      );

    case "airdrop":
      return (
        <>
          <Actions type={type} data={data} />
          <AllocationsWithData address={data.pool_address} token={data.token} />
        </>
      );
  }
};

const DetailsPageComponent: React.FC<IDetails> = ({ infoList, type, data }) => {
  const { chainId } = useAuth();
  const { asPath } = useRouter();
  const [currentUrl, setCurrentUrl] = useState("");
  const socials = useMemo(
    () => infoList.filter((data) => data?.type === "socials"),
    [infoList]
  );
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: tagsData, error } = useSWR(
    `https://ctf-backend.aticloud.atican.dev/api/v1/presales/${data.pool_address.toLowerCase()}`,
    fetcher
  );
  const tagsList = useMemo(
    () => tagsData?.data?.attributes?.tags?.filter((a: any) => a.name !== ""),
    [tagsData]
  );
  const loading = !error && !tagsData;

  const RenderSaleStatus = ({
    isBadge,
    status,
    link,
  }: {
    isBadge?: boolean;
    status: string;
    link?: string;
  }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case "sale live":
        case "airdrop live":
          return "text-[#28B81B]";
        case "sale ended":
          return "text-[#FD3D39]";
        case "upcoming":
          return "text-[#4475F2]";
        case "promoted":
          return "text-[#91cae7]";
        case "sponsored":
          return "text-[#FE9526]";
        case "kyc":
          return "text-[#007A7A]";
        case "safu":
        case "trusted":
          return "text-[#C37400]";
        case "audit":
          return "text-[#686B2C]";
        default:
          return "text-orange-600";
      }
    };

    const getTagsIcon = () => {
      switch (status?.toLowerCase()) {
        case "kyc":
          return <Image src={Kyc} alt="" />;
        case "audit":
          return <Image src={Audit} alt="" />;
        case "safu":
          return <Image src={Trusted} alt="" />;
      }
    };

    return (
      <div
        className={`bg-white/90 ${getStatusColor()} px-3 py-1 capitalize text-sm sm:text-base font-medium rounded-full  w-fit  flex items-center gap-1`}>
        {isBadge ? (
          <>
            <div className="flex items-center justify-center">
              {getTagsIcon()}
            </div>
            {link ? (
              <Link href={link} passHref>
                <a target="_blank" rel="noopener noreferrer">
                  <span className="capitalize hover:underline cursor-pointer">
                    {status !== "KYC" ? status.toLowerCase() : status}
                  </span>
                </a>
              </Link>
            ) : (
              <span className="">
                {status !== "KYC" ? capital(status) : upper(status)}
              </span>
            )}
          </>
        ) : (
          <>
            <FaCircle size={12} />
            <p className="capitalize">{status}</p>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (window !== undefined) {
      const url = window.location.href;
      setCurrentUrl(url);
    }
  }, []);

  const shareLinkHandler = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link Copied");
  };
  return (
    <>
      <div
        style={{ backgroundImage: `url(${data?.banner})` }}
        className={` bg-no-repeat bg-cover bg-center`}>
        <div className="bg-black/40 backdrop-blur-sm flex justify-center">
          <div className="flex flex-col p-8 mx-auto container pb-[6.6rem]">
            <div className="mb-6">
              <Image
                src={data?.logo}
                className="bg-gray8 p-2.5 rounded-full "
                alt="detail-img"
                height={160}
                width={160}
                objectFit="cover"
              />
            </div>
            <h1 className="text-3xl sm:text-5xl  md:text-6xl lg:text-7xl font-argue text-white">
              {data.title ? data.title : data?.token.name}
            </h1>
            {
              <div className={`flex py-3 gap-3 items-center mb-2`}>
                <>
                  {socials.map((social, index) => {
                    let icon = BsGlobe;
                    switch (social.title.toLowerCase()) {
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
                        key={index}
                        Icon={icon}
                        Wrapper={({ children }: any) => (
                          <a
                            target={"_blank"}
                            href={social.value.toString()}
                            rel="noreferrer">
                            {children}
                          </a>
                        )}
                      />
                    );
                  })}
                </>
              </div>
            }
            <div className="flex gap-3 flex-wrap w-full">
              <RenderSaleStatus status={data.status} />
              {loading ? (
                <></>
              ) : (
                tagsList?.length > 0 &&
                tagsList?.map(
                  (t: { link: string; name: string }, i: number) => (
                    <RenderSaleStatus
                      key={i}
                      status={t.name}
                      link={t.link}
                      isBadge={true}
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col gap-6 xl:flex-row xl:justify-between mb-8 -mt-20 px-2 sm:px-6 w-full mx-auto container">
        <SaleDetailsCard
          data={data}
          type={type}
          tokenSold={data?.total_sold}
          totalToken={data?.hard_cap ?? data?.soft_cap}
          status={data.status}
          className="w-full flex-[0.65]"
          startTime={moment.unix(data?.start_time).toString()}
          endTime={moment.unix(data?.end_time).toString()}
          tokenSymbol={data.native_symbol || data.token.symbol}
        />
        <div className="flex flex-col bg-white flex-[0.4] shadow-boxShadow6 rounded-2xl border h-max">
          {[
            { Status: data.status },
            { "Sale Type": data.sale_type },
            {
              "Minimum Buy":
                data.min_buy + " " + (data.native_symbol ?? data.token.symbol),
            },
            {
              "Maximum Buy":
                data.max_buy + " " + (data.native_symbol ?? data.token.symbol),
            },
          ].map((d, i) => (
            <div
              key={i}
              className={`flex w-full items-center justify-between py-2.5 px-6 border-b last:border-0`}>
              <div className="text-sm  font-normal capitalize">
                {Object.keys(d)[0]}
              </div>
              <div className={`text-sm text-right font-medium capitalize `}>
                {Object.values(d)[0]}
              </div>
            </div>
          ))}
          {data.myClaim ? (
            <>
              <div
                className={`flex w-full items-center justify-between py-2.5 px-6 border-b last:border-0`}>
                <div className="text-sm  font-normal capitalize">
                  {"My Available Claim"}
                </div>
                <div className={`text-sm text-right font-medium capitalize `}>
                  {data.myClaim} {data.token.symbol.toUpperCase()}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          {data.myContribution ? (
            <>
              <div
                className={`flex w-full items-center justify-between py-2.5 px-6 border-b last:border-0`}>
                <div className="text-sm  font-normal capitalize">
                  {"My Contribution"}
                </div>
                <div className={`text-sm text-right font-medium capitalize `}>
                  {data.myContribution}{" "}
                  {data?.native_symbol?.toUpperCase() ??
                    supportNetwork[chainId || "default"].symbol}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="grid grid-col-1 lg:grid-cols-2 gap-x-12 gap-y-8 mt-16 px-4 sm:px-6 mx-auto container">
        <div className="w-full overflow-hidden">
          {data?.description && (
            <div className={`shadow-boxShadow6 rounded-2xl border mb-10 pb-4`}>
              <p className="border-b text-xl font-medium mb-2 pb-1 p-4">
                Description
              </p>
              <div className="p-4">
                <EditerMarkdown
                  source={data?.description}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </div>
              {/* <p className=" text-justify text-base font-normal mx-4">
                {data?.description}
              </p> */}
            </div>
          )}
          <div className="">{renderContent(type, data)}</div>

          {type !== "airdrop" && (
            <LockerInfo
              tokenAddress={data.token.address}
              token={data.token}
              liquidity={data.liquidity}
              fees={data.fees}
              hard_cap={data.hard_cap}
            />
          )}
        </div>
        <div className="mb-8">
          <InfoList data={infoList} />
          <div className="flex flex-wrap shadow-boxShadow6 rounded-2xl border p-4 gap-4 mt-8">
            <SocialIcon
              Icon={BsFacebook}
              Wrapper={FacebookShareButton}
              title={"Circle"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={BsTwitter}
              Wrapper={TwitterShareButton}
              title={"Circle"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={BsTelegram}
              Wrapper={TelegramShareButton}
              title={"Circle"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={HiUpload}
              name={"share"}
              handleClick={shareLinkHandler}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsPageComponent;
