import { useState, useEffect } from "react";
import Input from "@atoms/Input";
import SetTimeAiredropModal from "@components/CreateAirDrop/setTimeAiredropModal";
import { ICreateAirdrop, ICreateAirdropFormData } from "..";
import useTokenInfo from "@hooks/useTokenInfo";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import { supportNetwork } from "@constants/network";
import Input2 from "@atoms/Input2";
import UploadImage from "@components/Common/UploadImage";
import DateTimePicker from "@atoms/DateTimeInput";
import TextArea from "@atoms/TextAreaV2";
import SocialLinkInput from "@atoms/SocialLinkInput";
import Dropdown3 from "@atoms/Dropdown3";

type ICreateStepOne = Omit<ICreateAirdrop, "prev">;

const Step1: React.FC<ICreateStepOne> = (props) => {
  const { formik, commonStats, setAirdropBannerImage, setAirdropImage } = props;

  const [showSetLocation, setShowSetLocation] = useState(false);
  const [airdropStartTime, setAirdropStartTime] = useState("");

  const closeModal = () => {
    return setShowSetLocation(!showSetLocation);
  };

  const { ethereum, chainId } = useAuth();

  const {
    tokenName,
    tokenSymbol,
    tokenBalance,
    decimals,
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
  }, [formik.values.tokenAddress]);

  useEffect(() => {
    if (tokenName) {
      formik.setFieldValue("name", tokenName);
      formik.setFieldValue("symbol", tokenSymbol);
      formik.setFieldValue("decimals", decimals);
      formik.setFieldValue("title", tokenName);
      formik.setFieldValue(
        "balance",
        (parseFloat(tokenBalance) / 10 ** parseFloat(decimals)).toString()
      );
    }
  }, [tokenName]);

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
