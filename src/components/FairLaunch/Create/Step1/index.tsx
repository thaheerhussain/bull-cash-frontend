import { useEffect, useState } from "react";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import { Formik, Form, FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import Input from "@atoms/Input";
import { MdCloudUpload } from "react-icons/md";
import { ICreateFairLaunch } from "..";
import Dropdown from "@atoms/Dropdown";
import Button from "@atoms/Button";
import useAuth from "@hooks/useAuth";
import useTokenInfo from "@hooks/useTokenInfo";
import UploadImage from "@components/Common/UploadImage";
import { formatUnits } from "ethers/lib/utils";
import { supportNetwork } from "@constants/network";
import Input2 from "@atoms/Input2";
import Dropdown3 from "@atoms/Dropdown3";
import DateTimePicker from "@atoms/DateTimeInput";
import moment from "moment";
import SocialLinkInput from "@atoms/SocialLinkInput";
import TextArea from "@atoms/TextAreaV2";

type ICreateStepOne = Omit<ICreateFairLaunch, "prev">;

const Step1: React.FC<ICreateStepOne> = (props) => {
  const { formik, commonStats, setLaunchpadBannerImage, setLaunchpadImage } =
    props;

  const { ethereum, account, chainId, library } = useAuth();
  const currencySymbol = supportNetwork[chainId || "default"]?.symbol;

  const ListingOptions = ["Auto", "Manual"];
  const CurrencyList = [currencySymbol];
  const FeeOptions = [
    `5% ${currencySymbol} raised only`,
    `2% ${currencySymbol} raised + 2% token sold`,
  ];
  const {
    tokenName: name,
    tokenSymbol: symbol,
    tokenBalance,
    decimals,
    totalSupply,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({
    tokenAddress: formik.values.tokenAddress || "",
    ethereum,
  });

  useEffect(() => {
    if (formik.values.tokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [fetchTokenBalance, fetchtokenDetail, formik.values.tokenAddress]);

  useEffect(() => {
    formik.setFieldValue("currency", currencySymbol);
    formik.setFieldValue("feeOptions", `5% ${currencySymbol} raised only`);
  }, [chainId]);

  useEffect(() => {
    if (name) {
      formik.setFieldValue("name", name);
      formik.setFieldValue("symbol", symbol);
      formik.setFieldValue("decimals", decimals);
      formik.setFieldValue("title", name);
      formik.setFieldValue("totalSupply", formatUnits(totalSupply, decimals));
      formik.setFieldValue(
        "balance",
        (parseFloat(tokenBalance) / 10 ** parseFloat(decimals)).toString()
      );
    }
  }, [name]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-6">
        <h3 className="text-base font-semibold text-[#ffffff]">
          Token Address
        </h3>
        <div className="flex justify-between border border-primary-green px-4 rounded-lg shadow-sm mt-4 bg-secondary-dark">
          <input
            type="text"
            placeholder="Ex: dfjdkjd89l523v........"
            className="outline-none w-full bg-secondary-dark text-secondary-green placeholder-secondary-green"
            name="tokenAddress"
            onBlur={formik.handleBlur}
            value={formik.values.tokenAddress}
            onChange={formik.handleChange}
          />
        </div>
        {formik.touched.tokenAddress && formik.errors.tokenAddress ? (
          <p className="text-xs text-red-text capitalize font-medium leading-5">
            {formik.errors.tokenAddress as string}
          </p>
        ) : null}
        {fetchTokenError && formik.values.tokenAddress && (
          <div className="text-sm text-red-text4 font-normal">
            {fetchTokenError}
          </div>
        )}
        {commonStats.poolPrice > 0 && (
          <p className="text-right text-xs font-normal">
            Pool creation fee: {commonStats.poolPrice} {currencySymbol}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-between items-end my-10">
        <div>
          <Dropdown3
            selectedOption={formik.values.currency}
            setSelectedOption={(v) => {
              formik.setFieldValue("currency", v);
            }}
            dropdownList={CurrencyList}
            label={"Currency"}
            className="w-full selects"
          />
          {formik.touched.currency && formik.errors.currency ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.currency as string}
            </p>
          ) : null}
        </div>
        <div>
          <Dropdown3
            selectedOption={formik.values.feeOptions}
            setSelectedOption={(v) => formik.setFieldValue("feeOptions", v)}
            dropdownList={FeeOptions}
            label={"Fee Options"}
            className="w-full selects"
          />
          {formik.touched.feeOptions && formik.errors.feeOptions ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.feeOptions as string}
            </p>
          ) : null}
        </div>
        <div>
          <Dropdown3
            selectedOption={formik.values.listingOptions}
            setSelectedOption={(v) => formik.setFieldValue("listingOptions", v)}
            dropdownList={ListingOptions}
            label={"Listing Options"}
            className="w-full selects"
          />
          {formik.touched.listingOptions && formik.errors.listingOptions ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.listingOptions as string}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label className="text-white pb-8 text-base font-semibold">
          Connect your social media
        </label>
        <SocialLinkInput formik={formik} />
      </div>
      <div className="my-10">
        <TextArea
          label={`Description`}
          placeholder={"Ex: This is the best project (150-500 words)"}
          name="description"
          type={"textarea"}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />
      </div>
    </form>
  );
};

export default Step1;
