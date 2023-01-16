import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoMdClose } from "react-icons/io";
import homeIcon from "@public/icons/svgs/sidebar/home.svg";
import airbaloonIcon from "@public/icons/svgs/sidebar/airdrop.svg";
import crownIcon from "@public/icons/svgs/crownicon.svg";
import lockIcon from "@public/icons/svgs/sidebar/lock.svg";
import shieldIcon from "@public/icons/svgs/sidebar/shield.svg";
import spaceshipIcon from "@public/icons/svgs/sidebar/launchpad.svg";
import users2Icon from "@public/icons/svgs/sidebar/multisender.svg";
import usersIcon from "@public/icons/svgs/sidebar/kyc.svg";
import globeIcon from "@public/icons/svgs/globeicon.svg";
import walletIcon from "@public/icons/svgs/walleticon.svg";
import circleDotIcon from "@public/icons/svgs/circle-dot.svg";
import createIcon from "@public/icons/svgs/create.svg";
import editIcon from "@public/icons/svgs/edit.svg";
import docsIcon from "@public/icons/svgs/docs.png";
import Accordian from "@molecules/Accordian";
import DiscordIcon from "@public/icons/svgs/socials/Discord.svg";
import FacebookIcon from "@public/icons/svgs/socials/Facebook.svg";
import TelegramIcon from "@public/icons/svgs/socials/Telegram.svg";
import TwitterIcon from "@public/icons/svgs/socials/Twitter.svg";
import YoutubeIcon from "@public/icons/svgs/socials/YouTube.svg";
import circleIcon from "@public/icons/svgs/circle-logo.svg";
// import circleIcon from "@public/images/circle-logo.jpg";

import Image from "next/image";
import useAuth from "@hooks/useAuth";
import Button from "@atoms/Button";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { useRouter } from "next/router";
import Link from "next/link";
import { supportNetwork } from "@constants/network";
import useWidth from "@hooks/useWidth";
import { toast } from "react-toastify";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const sideBarMenu = [
  {
    title: "Home",
    icon: homeIcon,
    link: "/",
  },
  {
    title: "Launchpad List",
    icon: spaceshipIcon,
    link: "/launchpad/list",
  },
  {
    title: "Launchpad",
    icon: spaceshipIcon,
    haveSubmenu: true,
    submenu: [
      {
        title: "Create Launchpad",
        link: "/launchpad/create",
        icon: createIcon,
      },
      {
        title: "Create Fair Launch",
        link: "/fairlaunch/create",
        icon: createIcon,
      },
    ],
  },
  {
    title: "Private Sale",
    icon: shieldIcon,
    haveSubmenu: true,
    submenu: [
      {
        title: "Create Private Sale",
        link: "/private-sale/create",
        icon: createIcon,
      },
    ],
  },
  {
    title: "Lockers",
    icon: lockIcon,
    haveSubmenu: true,
    submenu: [
      {
        title: "Create Lock",
        link: "/locker/create",
        icon: createIcon,
      },
      {
        title: "Token & Liquidity",
        link: "/locker/token-liquidity",
        icon: lockIcon,
      },
      // {
      //   title: "Liquidity",
      //   link: "/locker/liquidity",
      // },
    ],
  },
  {
    title: "Airdrop",
    icon: airbaloonIcon,
    haveSubmenu: true,
    submenu: [
      {
        title: "Create Airdrop",
        link: "/airdrop/create",
        icon: createIcon,
      },
      {
        title: "Airdrop List",
        link: "/airdrop/list",
        icon: airbaloonIcon,
      },
    ],
  },
  {
    title: "Leaderboard",
    icon: crownIcon,
    link: "/leaderboard",
  },
  {
    title: "Multisender",
    icon: usersIcon,
    link: "/multisender",
  },
  {
    title: "KYC & Audit",
    icon: users2Icon,
    link: "#",
  },
];

interface ISubmenu {
  title: string;
  link: string;
  icon: any;
}
interface ISideBarListComp {
  title: string;
  icon: any;
  haveSubmenu?: boolean;
  submenu?: ISubmenu[];
  link?: string;
  handleDrawer: (value: boolean) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const SideBarListComp = (props: ISideBarListComp) => {
  const router = useRouter();
  const width = useWidth();

  const {
    title,
    icon,
    haveSubmenu,
    submenu,
    link,
    handleDrawer,
    selectedTab,
    setSelectedTab,
  } = props;

  const linkHandler = (link: string, menutitle: string) => {
    router.push(link);
    if (width < 1024) {
      handleDrawer(false);
    }
    setSelectedTab(link);
  };
  return (
    <>
      {haveSubmenu ? (
        <Accordian
          title={title}
          icon={icon}
          defaultOpen={[...(submenu?.map((s) => s.link) ?? [])].includes(
            selectedTab
          )}>
          <ul>
            {submenu?.map((menu, index) => {
              return (
                <div
                  key={index}
                  className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer hover:bg-sidebarHover ${
                    selectedTab === menu.link ? "bg-sidebarSelected" : ""
                  }`}
                  onClick={() => linkHandler(menu.link, menu.title)}>
                  <div className="mr-3 h-[15px] w-[15px] relative">
                    <Image
                      layout="fill"
                      objectFit="fill"
                      src={menu.icon}
                      alt=""
                    />
                  </div>
                  <p className={` truncate`}>{menu.title}</p>
                </div>
              );
            })}
          </ul>
        </Accordian>
      ) : (
        <>
          {link && (
            <div
              onClick={() => linkHandler(link, title)}
              className={`flex items-center text-base font-medium px-6  py-3 cursor-pointer  hover:bg-sidebarHover ${
                selectedTab === link ? "bg-sidebarSelected" : ""
              }`}>
              <div className="mr-3 h-[18px] w-[18px] relative flex-shrink-0">
                <Image layout="fill" objectFit="fill" src={icon} alt="" />
              </div>
              <p className={` truncate`}>{title}</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

const SidebarComp = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(router.pathname);
  const width = useWidth();
  const {
    connect,
    isLoggedIn,
    account,
    balance_formatted,
    chainId,
    loading,
    ethereum,
  } = useAuth();
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  });

  const walletconnectHandler = () => {
    if (window.ethereum) {
      connect();
    } else {
      if (width > 1000) {
        toast.error("Install Metamask");
      } else {
        router.push("https://metamask.io/download");
      }
    }
  };

  return (
    <div
      className={`fixed top-0 z-50 left-0 h-screen custom-scrollbar  overflow-y-auto border-r-2 w-full max-w-[250px] bg-white transform duration-200 ${
        isMount ? "translate-x-0" : "-translate-x-[250px]"
      }`}>
      <div className="flex flex-col justify-between h-full">
        <div className="mt-[75px]">
          <div className="md:hidden flex items-center justify-around mt-10 mx-6">
            {!isLoggedIn || !account ? (
              <Button
                className="rounded-full text-base py-2.5 min-w-[140px]"
                variant="primary-sm"
                disabled={loading}
                onClick={walletconnectHandler}
                loading={loading}>
                {"Connect"}
              </Button>
            ) : (
              <div
                onClick={() => router.push("/me")}
                className="flex items-center bg-bordergraylight px-4 py-1 rounded-full cursor-pointer">
                <div>
                  <div className="text-sm font-medium">
                    {walletNameTrimmer(account)}
                  </div>
                  <div className="text-sm font-medium text-center ">
                    {balance_formatted.toFixed(6)}{" "}
                    <span className="font-semibold ">
                      {supportNetwork[
                        chainId || "default"
                      ]?.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-2 h-[18px] w-[18px] relative">
                  <Image
                    layout="fill"
                    objectFit="fill"
                    src={walletIcon}
                    alt=""
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mt-6">
            {sideBarMenu.map((menu, index) => {
              return (
                <SideBarListComp
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  key={index}
                  {...menu}
                  handleDrawer={setIsDrawerOpen}
                />
              );
            })}
          </div>
        </div>
        <div className="m-0 p-0">
          <div
            className="flex items-center text-base 2xl:text-lg font-medium px-6  py-3 cursor-pointer hover:bg-sidebarHover"
            onClick={() => {
              router.push("/");
              if (width < 1024) {
                setIsDrawerOpen(false);
              }
            }}>
            <div className="mr-3 h-[18px] w-[18px] relative ">
              <Image layout="fill" objectFit="fill" src={docsIcon} alt="" />
            </div>
            <div>{"Docs"}</div>
          </div>

          <div className="flex justify-between gap-3 px-6 py-3 ">
            <img className="h-5 social-icon" src={FacebookIcon.src} alt="" />
            <img className="h-5 social-icon" src={TwitterIcon.src} alt="" />
            <img className="h-5 social-icon" src={YoutubeIcon.src} alt="" />
            <img className="h-5 social-icon" src={TelegramIcon.src} alt="" />
            <img className="h-5 social-icon" src={DiscordIcon.src} alt="" />
          </div>
          <div className="bottom-0 bg-white z-[55] mb-30 flex 2xl:text-lg font-medium  justify-between items-center px-6  py-3">
            <div className="flex items-center gap-3">
              <div className="h-[18px] w-[18px] flex items-center">
                <Image objectFit="contain" src={circleIcon} alt="" />
              </div>
              <p className="">Circle</p>
            </div>
            <p className="text-sm font-bold">137$</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComp;
