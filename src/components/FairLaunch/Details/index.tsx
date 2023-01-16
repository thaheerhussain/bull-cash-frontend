import React, { useMemo } from "react";
import DetailsPageComponent, { IInfoList } from "@components/Details";
import { useRouter } from "next/router";
import {
  useCommonStats,
  useAccountStats,
} from "@components/FairLaunch/Details/hooks/useStats";
import { formatPrice } from "@constants/contractHelper";
import moment from "moment/moment";
import { title } from "case";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import { TIME_FORMAT } from "@constants/timeFormats";

const FairLaunchDetails = () => {
  const router = useRouter();
  const routerSlug = router?.query?.slug;
  const { chainId } = useAuth();
  const data = useCommonStats(
    {
      address: Array.isArray(routerSlug) ? routerSlug[0] : routerSlug || "",
    },
    true,
    3
  );

  const accountData = useAccountStats({
    address: Array.isArray(routerSlug) ? routerSlug[0] : routerSlug || "",
  });

  const details = useMemo<IInfoList[]>(() => {
    return [
      {
        title: "Sale Type",
        value: `Fair Launch`,
      },
      {
        title: "Total Raised",
        value: `${data.totalRaised} ${data.currencySymbol.toUpperCase()}`,
      },
      {
        title: "Presale Address",
        value: data.poolAddress,
        type: "address",
      },
      {
        title: "Token Address",
        value: data.token || "",
        type: "address",
      },
      {
        title: "Token name",
        value: data.tokenName,
      },
      {
        title: "Token symbol",
        value: data.tokenSymbol,
      },
      {
        title: "Token decimals",
        value: data.tokenDecimal,
      },
      {
        title: "Total Supply",
        value: `${data.tokenSupply} ${data.tokenSymbol}`,
      },
      {
        title: "Tokens For Presale",
        value: `${data.totalPresaleToken} ${data.tokenSymbol}`,
      },
      {
        title: "Refund Type",
        value: data.refundType === 0 ? "Refund" : "Burn",
      },
      {
        title: "Liquidity Percent",
        value: `${data.liquidityPercent}%`,
      },
      {
        title: "Liquidity Lockup Time (After Pool Ends)",
        value: `${data.liquidityLockDays / 60 / 60 / 24} Days`,
      },
      {
        title: "Liquidity Unlock Date (UTC)",
        value: moment
          .unix(Number(data.endTime))
          .utc()
          .add(data.liquidityLockDays / 60 / 60 / 24, "days")
          .format(TIME_FORMAT),
      },
      {
        title: "Softcap",
        value: `${data.softCap} ${data.currencySymbol}`,
      },
      {
        title: "Start Time (UTC)",
        value: moment.unix(data.startTime).utc().format(TIME_FORMAT),
      },
      {
        title: "End Time (UTC)",
        value: moment.unix(data.endTime).utc().format(TIME_FORMAT),
      },
      ...Object.keys(data.poolDetails?.socials)
        // @ts-ignore
        ?.filter((v) => !!data.poolDetails?.socials[v])
        ?.map((social) => ({
          title: title(social),
          // @ts-ignore
          value: data.poolDetails?.socials[social] || "",
          type: "socials" as "socials",
        })),
    ];
  }, [data]);
  console.log("data", data);
  const project_status = useMemo(() => {
    return data?.poolState === 0
      ? moment.unix(data?.startTime).isAfter(moment())
        ? "upcoming"
        : moment.unix(data?.startTime).isBefore(moment()) &&
          moment.unix(data?.endTime).isAfter(moment())
        ? "sale live"
        : "sale ended"
      : "sale ended";
  }, [data?.endTime, data?.poolState, data?.startTime]);
  return (
    <DetailsPageComponent
      infoList={details}
      type={"fairlaunch"}
      data={{
        myClaim: accountData.userAvailableClaim,
        myContribution: accountData.contributionOf,
        status: project_status,
        logo: data?.poolDetails?.logo,
        banner: data?.poolDetails?.banner,
        title: `${
          data.poolDetails.title ? `${data.poolDetails.title}-Fairlaunch` : ""
        }`,
        liquidity: {
          liquidityPercent: data.liquidityPercent,
          liquidityLockDays: data.liquidityLockDays,
          liquidityUnlockTime: data.liquidityUnlockTime,
          liquidityListingRate: 1,
        },
        fees: 5,
        token: {
          name: data.tokenName,
          symbol: data.tokenSymbol,
          decimals: data.tokenDecimal,
          supply: data.tokenSupply,
          address: data.token,
        },
        total_sold: data.totalRaised,
        soft_cap: data.softCap,
        hard_cap: data.softCap,
        start_time: parseFloat(String(data.startTime)),
        end_time: parseFloat(String(data.endTime)),
        description: data?.poolDetails?.description,
        sale_type: "Public",
        pool_address: data.poolAddress,
        min_buy: 0,
        max_buy: data.softCap,
        poolOwner: String(data.governance),
        poolState: String(data.poolState),
        native_symbol: data?.currencySymbol,
      }}
    />
  );
};

export default FairLaunchDetails;
