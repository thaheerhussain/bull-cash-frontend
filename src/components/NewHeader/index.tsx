import React, { useState, useRef, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
// import { Popover } from "@headlessui/react";
import circleIcon from "@public/icons/svgs/circle-logo.svg";
import hamburgerMenuIcon from "@public/icons/svgs/hamburgermenulogo.svg";
import { FaListUl } from "react-icons/fa";
import {
  HiMenu,
  HiOutlineArrowNarrowRight,
  HiOutlineChevronDown,
} from "react-icons/hi";
import useWidth from "@hooks/useWidth";
import { Popover, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const MyPopover = ({ title }: { title: string }) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [openState, setOpenState] = useState(false);

  const toggleMenu = (open: boolean) => {
    setOpenState((openState) => !openState);
    buttonRef?.current?.click();
  };

  const onHover = (open: boolean, action: "onMouseEnter" | "onMouseLeave") => {
    if (
      (!open && !openState && action === "onMouseEnter") ||
      (open && openState && action === "onMouseLeave")
    ) {
      toggleMenu(open);
    }
  };

  const handleClick = (open: boolean) => {
    setOpenState(!open);
  };

  const handleClickOutside = (event: any) => {
    if (buttonRef.current && !buttonRef.current?.contains(event.target)) {
      event.stopPropagation();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <Popover className="mx-auto">
      {({ open }) => (
        <div
          onMouseEnter={() => onHover(open, "onMouseEnter")}
          onMouseLeave={() => onHover(open, "onMouseLeave")}
          className="flex flex-col">
          <Popover.Button
            ref={buttonRef}
            className={"outline-none border-none"}>
            <div
              className={`cursor-pointer capitalize px-3 py-2 rounded-sm hover:bg-card-green-bg3-color ${
                open ? "bg-[#1B2332]" : ""
              }`}
              onClick={() => handleClick(open)}>
              <span className="capitalize text-primary-green ">
                {title}
                <HiOutlineChevronDown
                  className={classNames(
                    open ? "rotate-180" : "",
                    "h-3 w-3 inline-block ml-1",
                    "transform transition-all duration-500"
                  )}
                  aria-hidden="true"
                />
              </span>
            </div>
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition duration-500 ease-in-out"
            enterFrom="transform opacity-0"
            enterTo="transform  opacity-100"
            leave="transition duration-1000 ease-in-out"
            leaveFrom="transform  opacity-100"
            leaveTo="transform opacity-0">
            <Popover.Panel
              static
              className="z-10 w-[700px]  min-h-max absolute top-12 left-0 bg-card-green-bg-color p-3 rounded-lg border border-primary-green">
              <Transition.Child
                as="div"
                className="z-50 grid grid-cols-2 gap-4 "
                appear={true}
                enter="transition ease-in duration-250"
                enterFrom="opacity-0 translate-x-96"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-out duration-250"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Submenu />
                <Submenu />
                <Submenu />
                <Submenu />
              </Transition.Child>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

const Submenu = () => {
  const [showArrow, setshowArrow] = useState(false);

  return (
    <div
      className="flex gap-4 items-center cursor-pointer p-2 text-primary-green rounded-lg hover:bg-card-green-bg3-color "
      onMouseEnter={() => setshowArrow(true)}
      onMouseLeave={() => setshowArrow(false)}>
      <div className=" flex items-center justify-center h-8 w-8 bg-transparent  rounded-sm">
        <FaListUl color="white" />
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold">Projects</p>
        <p className=" text-xs">Browse upcoming sales</p>
      </div>
      <HiOutlineArrowNarrowRight
        size={26}
        className={`${showArrow ? "block" : "hidden"} ml-auto`}
      />
    </div>
  );
};

const NewHeader = () => {
  const [showMenus, setshowMenus] = useState(false);
  const width = useWidth();

  return (
    <div className="flex justify-between items-center bg-[#030C03] py-3 px-4 fixed top-0 w-full z-50 border-b border-primary-green-border ">
      <div className="flex gap-8 items-center">
        {/* logo */}
        <Link href={"/"}>
          <div className="flex gap-2 items-center cursor-pointer lg:mx-20">
            {/* <div className="h-[24px] w-[24px]">
              <Image objectFit="contain" src={circleIcon} alt="" />
            </div> */}
            <div className="text-white font-semibold text-3xl">BullPad</div>
          </div>
        </Link>
        {/* nav items */}
        {width > 1400 ? (
          <div className="relative">
            <div className="text-[#94A7C6] flex items-center gap-4 text-sm ">
              <MyPopover title={"Launchpad"} />
              <MyPopover title={"Fairlaunch"} />
              <MyPopover title={"MultiSender"} />
              <MyPopover title={"Leaderboard"} />
              <p className="cursor-pointer capitalize px-3 py-2 rounded-sm hover:bg-card-green-bg3-color text-primary-green ">
                KYC
              </p>
            </div>
            {showMenus && <Submenu />}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-center">
        {/* connect buttons */}
        {width > 1400 ? (
          // <button className="text-black text-sm font-semibold bg-white hover:opacity-80 rounded-sm  py-[12px] px-[24px]">
          //   Connect Wallet
          // </button>
          <button className="w-full md:max-w-[253px] rounded-lg border border-primary-green py-[12px] px-[24px] bg-card-green-bg3-color text-white min-w-fit">
            Connect Wallet
          </button>
        ) : (
          <></>
        )}
        {width < 1400 ? (
          <div className="cursor-pointer">
            <HiMenu color="#94A7C6" size={32} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NewHeader;

// #1B2332 (hover & submenu bg)
// #94A7C6 (menuitem text)
