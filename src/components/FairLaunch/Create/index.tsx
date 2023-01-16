/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useMemo } from "react";
import Step2 from "./Step2";
import Step4 from "./Step4";
import Step1 from "./Step1";
import Step3 from "./Step3";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";
import { FormikContextType } from "formik/dist/types";
import {
  feesSetting,
  ICreateLaunchpadFormData,
} from "@components/LaunchPad/Create";
import { usePoolFees } from "@components/LaunchPad/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import Button from "@atoms/Button";
import { contract } from "@constants/constant";
import { getContract, mulDecimal } from "@constants/contractHelper";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import { parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import poolFactoryAbi from "../../../ABIs/PoolFactory/PoolFactory.json";
import { supportNetwork } from "@constants/network";
import StepsInfo from "@components/StepsInfo";
import { stepsInfoList } from "@constants/launchPadsStepsInfo";
import { FairLaunchStepData } from "@components/FairLaunch/Constant";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import BannerImage from "@public/images/fairlaunchBanner.png";
import Image from "next/image";
import TimerPreview from "@molecules/TimerPreview";
import UploadImage from "@components/Common/UploadImage";
import moment from "moment";
import axios from "axios";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import { CirclePoolFactory__factory } from "../../../blockchain-types";
import { LibPresale } from "../../../blockchain-types/contracts/launchpad/PoolFactory.sol/CirclePoolFactory";

const INITIAL_VALUES = {
  tokenAddress: "",
  title: "",
  name: "",
  symbol: "",
  decimals: "",
  balance: "",
  totalSupply: "",
  currency: "",
  feeOptions: "",
  listingOptions: "Auto",
  presaleRate: "",
  saleMethod: "Public",
  softcap: "",
  hardcap: "",
  minimumBuy: "",
  maximumBuy: "",
  refundType: "",
  router: "",
  liquidity: "",
  listingRate: "",
  startTime: moment().utc().add(30, "m").toISOString(),
  endTime: moment().utc().add(30, "m").toISOString(),
  publicStartTime: "",
  tier1EndTime: "",
  tier2EndTime: "",
  liquidityLockupDays: "",
  totalAmount: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  telegram: "",
  discord: "",
  reddit: "",
  description: "",
  TGEPercentage: "",
  CycleTime: "",
  CycleReleasePercent: "",
  isvesting: false,
  step: 1,
};

export type ICreateFairLaunchpadFormData = typeof INITIAL_VALUES;

export interface ICreateFairLaunch {
  commonStats: {
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  };
  formik: FormikContextType<ICreateFairLaunchpadFormData>;
  prev: () => void;
  next: () => void;
  launchpadImage?: string;
  setLaunchpadImage?: (value: string) => void;
  launchpadBannerImage?: string;
  setLaunchpadBannerImage?: (value: string) => void;
}

const CreateFairLaunch = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [imageUploaded, setImageUploaded] = useState<string>("");
  const [images, setImages] = useState<{
    name: string;
    media: {
      [uuid: string]: MediaLibrary.MediaAttributes;
    };
  }>({
    name: "",
    media: {},
  });
  const [bannerUploaded, setBannerUploaded] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [banners, setBanners] = useState<{
    name: string;
    media: {
      [uuid: string]: MediaLibrary.MediaAttributes;
    };
  }>({
    name: "",
    media: {},
  });

  const commonStats = usePoolFees({});

  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [currentStep, setCurrentStep] = useState(0);

  const { account, chainId, library } = useAuth();

  const handleApprove = async (
    value: ICreateFairLaunchpadFormData
  ): Promise<boolean> => {
    let success = false;
    if (account) {
      if (chainId) {
        try {
          const decimals = parseInt(value.decimals);
          if (value.tokenAddress && decimals > 0) {
            let poolfactoryAddress = contract[chainId]
              ? contract[chainId].poolfactory
              : contract["default"].poolfactory;
            let tokenContract = getContract(
              tokenAbi,
              value.tokenAddress,
              library
            );
            let amount = parseEther("1000000000000000000000000000").toString();
            // @ts-ignore
            const allowance = await tokenContract.allowance(
              account,
              poolfactoryAddress
            );
            if (allowance.gte(amount)) return true;
            // @ts-ignore
            let tx = await tokenContract.approve(poolfactoryAddress, amount, {
              from: account,
            });
            await toast.promise(tx.wait, {
              pending: "Waiting for confirmation 👌",
            });
            let web3 = getWeb3(chainId);
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              if (response.status) {
                success = true;
                toast.success("success ! your last transaction is success 👍");
              } else if (!response.status) {
                toast.error("error ! Your last transaction is failed.");
              } else {
                toast.error("error ! something went wrong.");
              }
            }
          } else {
            toast.error("Please enter valid token address !");
          }
        } catch (err: any) {
          toast.error(err.reason);
        }
      } else {
        toast.error("Please select Smart Chain Network !");
      }
    } else {
      toast.error("Please Connect Wallet!");
    }
    return success;
  };

  const handleCreateSale = async (value: ICreateFairLaunchpadFormData) => {
    try {
      if (account) {
        if (chainId) {
          let logo = imageUploaded,
            bannerImage = bannerUploaded;
          if (logo === "") {
            const { data: logoUpload } = await axios.post(
              `/upload/main`,
              images
            );
            if (logoUpload?.success) {
              logo = logoUpload.image_url;
              setImageUploaded(logo);
            }
          }
          if (bannerImage === "") {
            const { data: bannerUpload } = await axios.post(
              `/upload/cover`,
              banners
            );
            if (bannerUpload?.success) {
              bannerImage = bannerUpload.image_url;
              setBannerUploaded(bannerImage);
            }
          }
          if (!bannerImage || !logo) {
            toast.error("Image Upload Failed");
            return;
          }

          let para = [
            [
              value.tokenAddress,
              contract[chainId]
                ? contract[chainId].routeraddress
                : contract["default"].routeraddress,
              account,
            ], // 1
            [
              mulDecimal(value.softcap, 18).toString(),
              mulDecimal(
                value.totalAmount,
                parseFloat(value.decimals)
              ).toString(),
            ], //2
            [
              Math.floor(new Date(value.startTime).getTime() / 1000.0),
              Math.floor(new Date(value.endTime).getTime() / 1000.0),
              parseInt(value.liquidityLockupDays) * 60 * 60 * 24,
            ], //3
            [
              feesSetting[
                value.feeOptions ===
                `5% ${supportNetwork[chainId || "default"].symbol} raised only`
                  ? "1"
                  : "2"
              ].token,
              feesSetting[
                value.feeOptions ===
                `5% ${supportNetwork[chainId || "default"].symbol} raised only`
                  ? "1"
                  : "2"
              ].bnb,
            ], //4
            "2", // 5
            "2", //6
            [value.liquidity, value.refundType === "Refund" ? "0" : "1"], //7
            JSON.stringify({
              logo: logo,
              banner: bannerImage,
              title: value.title,
              description: value.description,
              socials: {
                website: value.website,
                facebook: value.facebook,
                twitter: value.twitter,
                instagram: value.instagram,
                github: value.github,
                telegram: value.telegram,
                discord: value.discord,
                reddit: value.reddit,
              },
            }),
            ["", "", ""],
          ];

          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory;

          const CirclePoolFactory = new CirclePoolFactory__factory(
            await library?.getSigner()
          );

          let factoryContract = CirclePoolFactory.attach(poolfactoryAddress);

          let feesCal = commonStats.poolPrice;
          const params: LibPresale.FairLaunchStruct = {
            totalToken: mulDecimal(
              value.totalAmount,
              parseFloat(value.decimals)
            ).toString(),
            token: value.tokenAddress,
            router: contract[chainId]
              ? contract[chainId].routeraddress
              : contract["default"].routeraddress,
            governance: account,
            paymentToken: "0x0000000000000000000000000000000000000000",
            softCap: mulDecimal(value.softcap, 18).toString(),
            startTime: String(
              Math.floor(new Date(value.startTime).getTime() / 1000.0)
            ),
            endTime: String(
              Math.floor(new Date(value.endTime).getTime() / 1000.0)
            ),
            feeIndex:
              value.feeOptions ===
              `5% ${supportNetwork[chainId || "default"].symbol} raised only`
                ? "0"
                : "1",
            liquidityLockDays: (
              parseInt(value.liquidityLockupDays) *
              60 *
              60 *
              24
            ).toString(),
            liquidityPercent: value.liquidity,
            refundType: value.refundType === "Refund" ? "0" : "1",
            poolDetails: JSON.stringify({
              logo: logo,
              banner: bannerImage,
              title: value.title,
              description: value.description,
              socials: {
                website: value.website,
                facebook: value.facebook,
                twitter: value.twitter,
                instagram: value.instagram,
                github: value.github,
                telegram: value.telegram,
                discord: value.discord,
                reddit: value.reddit,
              },
            }),
          };
          let tx = await factoryContract.createFairSale(params, {
            from: account,
            value: parseEther(feesCal.toFixed(8).toString()),
          });

          await toast.promise(tx.wait, {
            pending: "Waiting for confirmation 👌",
          });
          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("success ! your last transaction is success 👍");
              if (typeof response.logs[2] !== "undefined") {
                await router.push(
                  `/fairlaunch/details/${response.logs[2].address}`
                );
              } else {
                toast.error("something went wrong !");
              }
            } else if (!response.status) {
              toast.error("error ! Your last transaction is failed.");
            } else {
              toast.error("error ! something went wrong.");
            }
          }
        } else {
          toast.error("wrong network selected !");
        }
      } else {
        toast.error("Please Connect Wallet!");
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
    }
  };
  const submitForm = async (data: ICreateFairLaunchpadFormData) => {
    console.log("FairLaunch_Details>>", data);
    const approved = await handleApprove(data);
    if (approved) await handleCreateSale(data);
    // router.push(`/fairlaunch/details/${tempAddress}`);
    // getFairLaunchData(data);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const timeValidations = {
    startTime: Yup.date()
      .label("Start time")
      .test(
        "startTime",
        "Start time should be atleast 1 minutes in future",
        (value) => !value || value >= moment.utc().add(1, "m").toDate()
      )
      .required("Start Time Required"),
    endTime: Yup.date()
      .label("End time")
      .test(
        "endTime",
        "End time should be greater than start time",
        (value, context) => !value || value > context.parent.startTime
      )
      .required("End Time Required"),
  };

  const currentValidationSchema = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Yup.object().shape({
          presaleRate: Yup.number()
            .label("Presale rate")
            .moreThan(0)
            .typeError("Presale Rate Must be number")
            .required("Presale Rate Required"),
          saleMethod: Yup.string().label("Sale method"),
          softcap: Yup.number()
            .typeError("Must be number")
            .required("Softcap Required")
            .test(
              "moreThan",
              "softcap should be aleast 50% of hardcap",
              (value, context) =>
                !value || value >= parseFloat(context.parent.hardcap) / 2
            ),
          hardcap: Yup.number()
            .positive("Must be Positive")
            .min(
              Yup.ref("softcap"),
              "Hardcap must be greater than or equal to softcap."
            )
            .typeError("Must be number")
            .required("Hardcap Required"),
          minimumBuy: Yup.number()
            .label("Minimum buy")
            .typeError("Must be number")
            .max(
              Yup.ref("maximumBuy"),
              "Minimum buy must be less than or equal to maximum buy"
            )
            .moreThan(0)
            .required("Minimum Buy Required"),
          maximumBuy: Yup.number()
            .label("Maximum buy")
            .typeError("Must be number")
            .max(
              Yup.ref("hardcap"),
              "Maximum buy must be less than or equal to hardcap"
            )
            // .moreThan(Yup.ref("minimumBuy"))
            .required("Maximum Buy Required"),
          refundType: Yup.string()
            .required("Refund Type is required")
            .label("Refund type"),
          router: Yup.string().required("Router is Required"),
          liquidity: Yup.number()
            .moreThan(0)
            .typeError("Must be number")
            .required("Liquidity Required"),
          listingRate: Yup.number()
            .label("Listing rate")
            .moreThan(0)
            .typeError("Must be number")
            .required("Listing Rate Required"),

          liquidityLockupDays: Yup.number()
            .label("Liquidity lockup time")
            .min(30, "Lockup Time should be more than 30")
            .required("Lockup Time Required"),
          TGEPercentage: Yup.number()
            .label("TGE percentage")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("TGE Percentage Required"),
            }),
          CycleTime: Yup.number()
            .label("Cycle Time")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("Cycle Time Required"),
            }),
          CycleReleasePercent: Yup.number()
            .label("Cycle release percentage")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("Cycle Release Percentage Required"),
            }),
          ...timeValidations,
        });
      case 2:
        return Yup.object({
          website: Yup.string().url().required("Website Url Required"),
          facebook: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          twitter: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          instagram: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?instagram\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          github: Yup.string()
            .url()
            .matches(
              /^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9]{1,})+\/?$/i,
              "This URL is not valid"
            ),
          telegram: Yup.string()
            .url()
            .required("Telegram Url Required")
            .matches(
              /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/,
              "This URL is not valid"
            ),
          discord: Yup.string()
            .url()
            .matches(
              /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
              "This URL is not valid"
            ),
          reddit: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?reddit\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          description: Yup.string().min(10).max(500),
          ...timeValidations,
        });
      case 3:
        return Yup.object().shape({
          ...timeValidations,
        });
      default:
        return Yup.object().shape({
          tokenAddress: Yup.string()
            .label("Token Address")
            .required("Address Required"),
          // name: Yup.string().required("Token name Required"),
          // title: Yup.string().required("Title Required"),
          // symbol: Yup.string().required("Symbol Required"),
          // decimals: Yup.number()
          //   .typeError("Must be a number")
          //   .required("Decimals Required"),
          // balance: Yup.number()
          //   .typeError("Must be a number")
          //   .required("Decimals Required"),
          // totalSupply: Yup.number()
          //   .label("Total supply")
          //   .typeError("Must be a number")
          //   .required("Total Supply Required"),
          currency: Yup.string().required("Currency Required"),
          feeOptions: Yup.string()
            .label("Fee options")
            .required("Fee Options Required"),
          listingOptions: Yup.string()
            .label("Listing options")
            .required("Listing Required"),
          description: Yup.string()
            .required("Description is required")
            .min(150)
            .max(500),
          // ...timeValidations,
        });
    }
  }, [currentStep]);
  const formik = useFormik<ICreateFairLaunchpadFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      if (!image || !banner) {
        toast.error("Please select banner & logo!");
        return;
      }
      if (currentStep === 3) {
        await submitForm(values);
        actions.setSubmitting(false);
      } else {
        handleNextStep();
        actions.setTouched({});
        actions.setSubmitting(false);
      }
    },
  });

  const steps = [
    <Step1
      formik={formik}
      next={handleNextStep}
      commonStats={commonStats}
      launchpadImage={image}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      setLaunchpadImage={setImage}
    />,
    <Step2
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step3
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step4
      banner={banner}
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
  ];

  const DetailsStepOne = [
    {
      name: "Token Address",
      value: formik.values.tokenAddress || "-",
    },
    {
      name: "Name",
      value: formik.values.name || "-",
    },
    {
      name: "Symbol",
      value: formik.values.symbol || "-",
    },
    {
      name: "Decimals",
      value: formik.values.decimals || "-",
    },
    {
      name: "Total Supply",
      value: formik.values.totalSupply || "-",
    },
    {
      name: "Payment Currency",
      value: formik.values.currency || "-",
    },
    {
      name: "Select Fees",
      value: formik.values.feeOptions || "-",
    },
    {
      name: "Listing Mode",
      value: formik.values.listingOptions || "-",
    },
    {
      name: "Website",
      value: formik.values.website || "-",
    },
    {
      name: "Reddit",
      value: formik.values.reddit || "-",
    },
    {
      name: "Twitter",
      value: formik.values.twitter || "-",
    },
    {
      name: "Facebook",
      value: formik.values.facebook || "-",
    },
    {
      name: "Github",
      value: formik.values.github || "-",
    },
    {
      name: "Instagram",
      value: formik.values.instagram || "-",
    },
    {
      name: "Telegram",
      value: formik.values.telegram || "-",
    },
    {
      name: "Discord",
      value: formik.values.discord || "-",
    },
    {
      name: "Description",
      value: formik.values.description || "-",
    },
  ];

  const DetailsStepTwo = [
    {
      name: "Presale Rate",
      value: formik.values.presaleRate || "-",
    },
    {
      name: "Whitelist",
      value: formik.values.saleMethod === "Whitelist" ? "Yes" : "No",
    },
    {
      name: "Softcap (BNB)*",
      value: formik.values.softcap || "-",
    },
    {
      name: "Hardcap (BNB)*",
      value: formik.values.hardcap || "-",
    },
    {
      name: "Minimum Buy (BNB)*",
      value: formik.values.minimumBuy || "-",
    },
    {
      name: "Maximum Buy (BNB)*",
      value: formik.values.maximumBuy || "-",
    },
    {
      name: "Refund Type",
      value: formik.values.refundType || "-",
    },
    {
      name: "Router (BNB)*",
      value: formik.values.router || "-",
    },
    {
      name: "Liquidity (%)*",
      value: formik.values.liquidity || "-",
    },
    {
      name: "Listing Rate*",
      value: formik.values.listingRate || "-",
    },
    {
      name: "Start Time (UTC)*",
      time: `${new Date(formik.values.startTime).toLocaleString()}`,
    },
    {
      name: "End Time (UTC)*",
      time: `${new Date(formik.values.endTime).toLocaleString()}`,
    },
    {
      name: "Liquidity Lockup (Days)*",
      value: formik.values.liquidityLockupDays || "-",
    },
  ];

  const DetailsData = currentStep > 0 ? DetailsStepTwo : DetailsStepOne;

  return (
    <div className="py-8 xl:py-20 px-4 sm:px-10 xl:px-32 wallet-wrapper mt-10">
      <div
        className={`bg-no-repeat bg-cover bg-center md:h-[300px] lg:h-[350px] ${
          !banner && "bg-hero-forms"
        } rounded-2xl border border-primary-green overflow-hidden`}
        style={{ backgroundImage: `url(${banner})` }}>
        <div
          className={`${
            banner ? "bg-black/40 backdrop-blur-sm" : ""
          } flex justify-center h-full`}>
          <div
            className={`flex flex-col-reverse md:flex-row md:items-center justify-between mx-auto container px-10 pt-6 relative`}>
            <div
              className={`flex justify-between self-end pb-10 w-fit ${
                image || banner ? "" : "create-head"
              }`}>
              <h1 className="text-4xl md:text-6xl 2xl:text-7xl text-primary-green mt-4">
                {formik.values.title ? (
                  <div className="flex lg:max-w-[90%]">
                    <div className="truncate">{formik.values.title}</div>
                    <div className="min-w-fit ">-Fairlaunch</div>
                  </div>
                ) : (
                  "Create a Fairlaunch"
                )}
              </h1>
              {/* {image && formik.values.startTime && formik.values.endTime && (
                <TimerPreview
                  startTime={formik.values.startTime}
                  endTime={formik.values.endTime}
                  tier1StartTime={formik.values.startTime}
                  tier1EndTime={formik.values.tier1EndTime}
                  tier2StartTime={formik.values.startTime}
                  tier2EndTime={formik.values.tier2EndTime}
                />
              )} */}
            </div>
            {/* {image || banner ? (
              <></>
            ) : (
              <img
                className="w-[80%] md:w-[300px] lg:w-[450px] hidden md:block"
                src={BannerImage.src}
                alt=""
              />
            )} */}
            <div className="flex flex-col justify-end self-end pb-10">
              <div className="h-20 w-20 bg-gray8 mb-6 rounded-lg border border-primary-green profile-pic-upload self-end">
                {image && (
                  <Image
                    src={image}
                    className="w-full p-0 m-0"
                    alt="detail-img"
                    height={160}
                    width={160}
                    // objectFit="cover"
                  />
                )}
                <UploadImage
                  setImageValue={(v: string) => {
                    setImage(v);
                    setImageUploaded("");
                  }}
                  setImagesValue={setImages}
                  classTags="upload-bgImage-sec border border-dashed"
                />
              </div>
              <div className="profile-cover-pic text-white rounded-3xl items-center flex">
                <p className="text-md font-semibold mr-2">
                  {banner ? "Edit" : "Add"} Cover Photo
                </p>
                <div className="border border-primary-green text-black bg-primary-green rounded-sm">
                  <UploadImage
                    setImageValue={(v: string) => {
                      setBanner(v);
                      setBannerUploaded("");
                    }}
                    setImagesValue={setBanners}
                    classTags="upload-bgImage-sec border border-dashed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 lg:mt-14 flex flex-col-reverse lg:flex-row w-full justify-between">
        <div className="border border-primary-green shadow-boxShadow6 rounded-xl lg:w-1/2 lg:mr-20 bg-primary-dark h-fit">
          <StepperWrapper
            themeColor="red"
            data={FairLaunchStepData}
            activeStep={currentStep}>
            <>
              {steps[currentStep]}
              <div
                className={`flex w-full ${
                  currentStep === 0
                    ? "justify-center sm:justify-end"
                    : "justify-between"
                } items-center gap-4 sm:gap-6 mt-6`}>
                {currentStep > 0 ? (
                  <Button
                    disabled={formik.isSubmitting}
                    onClick={() => handlePreviousStep()}
                    variant="accent-1"
                    className="outline outline-2 outline-primary-green">
                    {"Back"}
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant="accent-2"
                  className="bg-primary-green disabled:bg-[#457457]/60 text-secondary-dark sm:px-40"
                  disabled={formik.isSubmitting}
                  onClick={() => {
                    if (Object.keys(formik.errors).length > 0) {
                      Object.keys(formik.errors).map((fieldName) =>
                        //@ts-ignore
                        toast.error(formik.errors[fieldName])
                      );
                    } else {
                      formik.handleSubmit();
                    }
                  }}>
                  {currentStep > 2
                    ? formik.isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </Button>
              </div>
            </>
          </StepperWrapper>
        </div>
        <div className="border border-primary-green lg:w-1/2 rounded-xl p-2 sm:p-10 bg-primary-dark mb-6 lg:mb-0 h-fit">
          <h2 className="text-white text-4xl font-semibold mb-6">Details</h2>
          {/* <div className="flex justify-between w-full text-white mb-2">
            <p>Token Address</p>
            <p className="text-primary-green">
              {formik.values.tokenAddress || "-"}
            </p>
          </div> */}
          {DetailsData.map(
            (element: { value?: string; name: string; time?: any }, index) => (
              <div
                key={index}
                className={`flex justify-between w-full text-white ${
                  index === 0
                    ? ""
                    : "border-t border-secondary-green py-1 text-base font-medium"
                } mb-2`}>
                <p className="mb-0">{element?.name}</p>
                <p className="mb-0 text-primary-green">
                  {element.value
                    ? element?.value?.length > 14
                      ? element?.value?.slice(0, 14) + ".."
                      : element?.value
                    : element?.time}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFairLaunch;
