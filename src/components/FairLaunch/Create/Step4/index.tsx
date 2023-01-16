import InfoGrid, { IInfoGridProps } from "@molecules/InfoGrid";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import { ICreateFairLaunch, ICreateFairLaunchpadFormData } from "..";
import { useMemo } from "react";
import { Formik, Form, FormikValues } from "formik";
import Button from "@atoms/Button";
import {
  feesSetting,
  ICreateLaunchpadFormData,
} from "@components/LaunchPad/Create";
import { title } from "case";
import { trimAddress } from "@constants/constant";
import moment from "moment";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import HoverImage from "@components/Common/HoverImage";
import { string } from "yup";
import { TIME_FORMAT } from "@constants/timeFormats";

interface IProps extends ICreateFairLaunch {
  banner: string;
}

const Step4: React.FC<IProps> = (props) => {
  const { formik, banner } = props;

  const { values: data, handleSubmit } = formik;

  const getKeyValue =
    <U extends keyof T, T extends object>(key: U) =>
    (obj: T): string =>
      String(obj[key]);

  const { chainId } = useAuth();

  const details = useMemo<IInfoGridProps["data"]>(() => {
    const map = Object.keys(data)
      ?.filter(
        (k: any) =>
          getKeyValue<
            keyof ICreateFairLaunchpadFormData,
            ICreateFairLaunchpadFormData
          >(k)(data) !== ""
      )
      ?.filter((key) => !["isvesting", "step"].includes(key))
      ?.map((key: any) => {
        const value = getKeyValue<
          keyof ICreateFairLaunchpadFormData,
          ICreateFairLaunchpadFormData
        >(key)(data);
        if (["tokenAddress"].includes(key)) {
          return {
            title: title(key),
            value: value,
            type: "address",
          };
        }
        if (["liquidityLockupDays"].includes(key)) {
          return {
            title: "Liquidity Unlock Date (UTC)",
            value: `${moment(data.endTime)
              .utc()
              .add(value, "days")
              .format(TIME_FORMAT)}`,
          };
        }
        if (["liquidity"].includes(key)) {
          return {
            title: title(key),
            value: `${value}%`,
          };
        }
        if (["startTime", "endTime", "TGEDate"].includes(key)) {
          return {
            title: title(key) + " " + "(UTC)",
            value: moment(value).utc().format(TIME_FORMAT),
          };
        }
        if (
          ["softcap", "hardcap", "maximumBuy", "minimumBuy"].includes(key) &&
          chainId
        ) {
          return {
            title: title(key),
            value: value + " " + supportNetwork[chainId]?.symbol,
          };
        }
        if (["listingRate"].includes(key) && chainId) {
          return {
            title: title(key),
            value: `1 ${supportNetwork[chainId]?.symbol} = ${value} ${formik.values.symbol}`,
          };
        }
        if (
          [
            "website",
            "facebook",
            "twitter",
            "instagram",
            "github",
            "telegram",
            "discord",
            "reddit",
          ].includes(key)
        ) {
          return {
            title: title(key),
            type: "socials",
            value: value,
          };
        }
        return {
          title: title(key),
          fullWidth: ["description"].includes(key.toLowerCase()),
          value: String(value),
        };
      });
    const fees =
      feesSetting[
        data.feeOptions ===
        `5% ${supportNetwork[chainId || "default"].symbol} raised only`
          ? "1"
          : "2"
      ].token;
    const percent =
      (parseFloat(data.liquidity) * parseFloat(data.totalAmount)) / 100;
    const feesValue = (parseFloat(data.totalAmount) * fees) / 100;
    const requiredTokens = parseFloat(data.totalAmount) + percent + feesValue;
    map.push({
      title: "Required Tokens",
      value: `${requiredTokens.toString()} ${data.symbol}`,
    });
    return map || [];
  }, [chainId, data]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <p className="text-xl font-semibold">Details</p>
      <InfoGrid data={details} />
      <div className="flex justify-center mt-4">
        <HoverImage
          type="staticImageWithHover"
          borderRadius="rounded-full"
          classTag="rounded-[120px] w-[318px] h-[318px] object-cover"
          src={banner}
          title={formik.values.title}
          startTime={formik.values.startTime}
          endTime={formik.values.endTime}
        />
      </div>
    </form>
  );
};

export default Step4;
