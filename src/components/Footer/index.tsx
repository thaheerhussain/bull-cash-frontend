import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFacebook, BsInstagram, BsTelegram, BsTwitter } from "react-icons/bs";
import circleIcon from "@public/icons/svgs/circle-logo.svg";

const FooterLinks = [
  {
    title: "about",
    link: "/about",
  },
  {
    title: "blog",
    link: "/",
  },
  {
    title: "careers",
    link: "/",
  },
  {
    title: "jobs",
    link: "/",
  },
  {
    title: "In press",
    link: "/",
  },
  {
    title: "Contact us",
    link: "/",
  },
  {
    title: "Online chat",
    link: "/",
  },
  {
    title: "Whatsapp",
    link: "/",
  },
  {
    title: "Telegram",
    link: "/",
  },
  {
    title: "Ticketing",
    link: "/",
  },
  {
    title: "Account",
    link: "/",
  },
  {
    title: "Orders",
    link: "/",
  },
  {
    title: "Returns",
    link: "/",
  },
];

const Footer = ({ className }: { className?: string }) => {
  return (
    <div className="flex">
      <div
        className={`${className} transition-all ease-linear duration-200`}></div>
      <div
        className={`flex flex-col mb-4 border-t-2 pt-10 mt-16 md:mt-20 mx-auto container`}>
        <div className="flex text-sm font-normal flex-wrap gap-10 md:justify-between mx-6  md:mx-10 lg:mx-14">
          <div className="md:w-[40%]">
            <Link href={"/"}>
              <span className="flex w-max items-center gap-1 text-xl font-bold cursor-pointer mb-5">
                <Image src={circleIcon} alt="logo" height={22} width={22} />
                <span className="text-2xl">Circle</span>
              </span>
            </Link>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
              sed. Quibusdam tenetur ducimus, obcaecati ratione ipsam culpa.
            </p>
            <div className="flex flex-wrap gap-5 mt-6">
              <BsFacebook size={24} className="social-icon" />
              <BsTelegram size={24} className="social-icon" />
              <BsInstagram size={24} className="social-icon" />
              <BsTwitter size={24} className="social-icon" />
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold mb-5">About</h3>
            <div className="flex flex-col gap-3">
              {FooterLinks.slice(0, 5).map((al, index) => (
                <Link key={`al-${index}`} href={al.link}>
                  <p className="capitalize text-gray-500 cursor-pointer">
                    {al.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold mb-5">Support</h3>
            <div className="flex flex-col gap-3">
              {FooterLinks.slice(5, 9).map((al, index) => (
                <Link key={`al-${index}`} href={al.link}>
                  <p className="capitalize text-gray-500 cursor-pointer ">
                    {al.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold mb-5">FAQ</h3>
            <div className="flex flex-col gap-3">
              {FooterLinks.slice(9, FooterLinks.length).map((al, index) => (
                <Link key={`al-${index}`} href={al.link}>
                  <p className="capitalize text-gray-500 cursor-pointer">
                    {al.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-center font-normal mx-6  md:mx-10">
          &copy; {new Date().getFullYear() - 1}-{new Date().getFullYear()}, All
          Rights Reserved{" "}
        </p>
      </div>
    </div>
  );
};

export default Footer;
