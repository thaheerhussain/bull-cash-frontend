import React, { useState } from "react";
import {
  BsFacebook,
  BsTelegram,
  BsTwitter,
  BsGlobe,
  BsDiscord,
  BsInstagram,
  BsYoutube,
  BsLinkedin,
  BsPinterest,
  BsGithub,
} from "react-icons/bs";
import { FaReddit } from "react-icons/fa";

interface SocialLinks {
  website: string;
  reddit: string;
  twitter: string;
  instagram: string;
  github: string;
  facebook: string;
  discord: string;
  telegram: string;
}

const socialMedias = {
  website: { name: "website", icon: <BsGlobe /> },
  reddit: { name: "reddit", icon: <FaReddit /> },
  twitter: { name: "twitter", icon: <BsTwitter /> },
  instagram: { name: "instagram", icon: <BsInstagram /> },
  github: { name: "github", icon: <BsGithub /> },
  facebook: { name: "facebook", icon: <BsFacebook /> },
  discord: { name: "linkedin", icon: <BsDiscord /> },
  telegram: { name: "pinterest", icon: <BsTelegram /> },
  // ...
};

const SocialLinkInput: React.FC<any> = (props) => {
  const { formik }: any = props;
  const [selectedSocial, setSelectedSocial] =
    useState<keyof SocialLinks>("twitter");

  const handleSocialSelection = (e: any) => {
    setSelectedSocial(e.currentTarget.value as keyof SocialLinks);
  };

  const handleSocialLinkChange = (e: any) => {
    const newSocialLinks = {
      ...formik.values,
      [selectedSocial]: e.target.value,
    };
    formik.setFormikState((state: any) => ({
      ...state,
      values: Object.assign({}, state.values, newSocialLinks),
    }));
  };

  return (
    <div className="relative rounded-md shadow-sm">
      <div className="flex justify-between">
        {Object.entries(socialMedias).map(([socialName, { name, icon }]) => (
          <button
            type="button"
            key={socialName}
            className={`relative z-10 inline-flex items-center px-1 sm:px-4 py-2 text-xl leading-5 font-medium focus:outline-none active:text-primary-green ${
              selectedSocial === socialName
                ? "text-primary-green"
                : "text-white"
            }`}
            onClick={handleSocialSelection}
            value={socialName}>
            {icon}
          </button>
        ))}
      </div>
      <input
        className="form-input py-3 px-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 bg-secondary-dark text-secondary-green placeholder-secondary-green outline-none border border-primary-green my-4 pl-14"
        type="text"
        placeholder={`Ex: https://www.${selectedSocial}.com`}
        onChange={handleSocialLinkChange}
        value={formik.values[selectedSocial]}
      />
      <div className="absolute inset-y-0 left-0 top-1/2 px-3 m-1 flex items-center border-r border-primary-green text-primary-green">
        {socialMedias[selectedSocial].icon}
      </div>
    </div>
  );
};

export default SocialLinkInput;
