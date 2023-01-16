import React, { useMemo } from "react";
import DetailsPageComponent, { IInfoList } from "@components/Details";
import { useRouter } from "next/router";
import {
  useCommonStats,
  useAccountStats,
} from "@components/LaunchPad/Details/hooks/useStats";
import { formatPrice } from "@constants/contractHelper";
import moment from "moment";
import { title } from "case";
import { ar, da } from "date-fns/locale";
import { TIME_FORMAT } from "@constants/timeFormats";

const LaunchpadDetails = () => {
  const router = useRouter();
  const routerSlug = router?.query?.slug;

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
  console.log("accountData", accountData);
  const details = useMemo<IInfoList[]>(() => {
    let arr: IInfoList[] = [
      {
        title: "Sale Type",
        value: `Presale`,
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
        title: "Presale Rate",
        value: `1 ${data.currencySymbol} ~ ${formatPrice(
          data.rate.toString()
        )} ${data.tokenSymbol}`,
      },
      {
        title: "Maximum Buy",
        value: `${data.maxContribution} ${data.currencySymbol}`,
      },
      {
        title: "Minimum Buy",
        value: `${data.minContribution} ${data.currencySymbol}`,
      },
      {
        title: "Sale method",
        value: data.useWhitelisting ? "Whitelist" : "Public",
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
          .add(data.liquidityLockDays, "seconds")
          .format(TIME_FORMAT),
      },
      {
        title: "Listing rate",
        value: `1 ${data.currencySymbol} ~ ${formatPrice(
          data.liquidityListingRate.toString()
        )} ${data.tokenSymbol}`,
      },
      {
        title: "First token release after listing",
        value: `${data.tgeBps > 0 ? data.tgeBps / 100 : 100} %`,
      },
      {
        title: "Cycle (days)",
        value: `${data.cycle > 0 ? data.cycle / 60 / 60 / 24 : 0}`,
      },
      {
        title: "Tokens release every cycle",
        value: `${data.cycleBps > 0 ? data.cycleBps / 0 : 0} %`,
      },
      {
        title: "Softcap",
        value: `${data.softCap} ${data.currencySymbol}`,
      },
      {
        title: "Hardcap",
        value: `${data.hardCap} ${data.currencySymbol}`,
      },
      {
        title: "Start Time (UTC)",
        value: moment.unix(Number(data.startTime)).utc().format(TIME_FORMAT),
      },
      {
        title: "End Time (UTC)",
        value: moment.unix(Number(data.endTime)).utc().format(TIME_FORMAT),
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

    if (Number(data.tier1?.start_time) !== 0) {
      arr = [
        ...arr,
        {
          title: "Tier 1 Start Time (UTC)",
          value: moment
            .unix(Number(data?.tier1?.start_time))
            .utc()
            .format(TIME_FORMAT),
        },
        {
          title: "Tier 1 End Time (UTC)",
          value: moment
            .unix(Number(data?.tier1?.end_time))
            .utc()
            .format(TIME_FORMAT),
        },
      ];
    }
    if (Number(data.tier2?.start_time) !== 0) {
      arr = arr.concat([
        {
          title: "Tier 2 Start Time (UTC)",
          value: moment
            .unix(Number(data?.tier2?.start_time))
            .utc()
            .format(TIME_FORMAT),
        },
        {
          title: "Tier 2 End Time (UTC)",
          value: moment
            .unix(Number(data?.tier2?.end_time))
            .utc()
            .format(TIME_FORMAT),
        },
      ]);
    }

    return arr;
  }, [data]);

  const project_status = useMemo(() => {
    console.log(
      "project_status 1",
      moment.unix(Number(data.startTime)).isAfter(moment()),
      data.userWhitelisted,
      !!(data.tier2 || data.tier1),
      data.userTier,
      data.userTier == 2
    );
    let startTime, endTime;
    if (data.poolState === "1" || data.poolState === "2") {
      return "sale ended";
    }
    if (moment.unix(Number(data.startTime)).isAfter(moment())) {
      if (data.tier2 || data.tier1) {
        if (data.userWhitelisted) {
          if (data.userTier == 2 && data.tier2) {
            startTime = moment.unix(
              Number(data.tier2?.start_time || data.startTime)
            );
            if (startTime.isAfter(moment())) {
              return "upcoming";
            } else {
              return "sale live";
            }
          } else {
            startTime = moment.unix(
              Number(data.tier1?.start_time || data.startTime)
            );
            console.log("startTime ti", startTime.isAfter(moment()));
            if (startTime.isAfter(moment())) {
              return "upcoming";
            } else {
              return "sale live";
            }
          }
        } else {
          startTime = moment.unix(Number(data.startTime));
          if (startTime.isAfter(moment())) {
            return "upcoming";
          } else {
            return "sale live";
          }
        }
      } else {
        startTime = moment.unix(Number(data.startTime));
        if (startTime.isAfter(moment())) {
          return "upcoming";
        } else {
          return "sale live";
        }
      }
    } else {
      return moment.unix(Number(data?.startTime)).isBefore(moment()) &&
        moment.unix(Number(data?.endTime)).isAfter(moment())
        ? "sale live"
        : "sale ended";
    }
  }, [
    data?.endTime,
    data.startTime,
    data.tier1,
    data.tier2,
    data.userTier,
    data.userWhitelisted,
    data.poolState,
  ]);
  console.log("project_status", project_status);
  return (
    <DetailsPageComponent
      infoList={details}
      type={"launchpad"}
      data={{
        myClaim: accountData.userAvailableClaim,
        myContribution: accountData.contributionOf,
        status: project_status,
        logo: data?.poolDetails?.logo,
        banner: data?.poolDetails?.banner,
        title: `${
          data.poolDetails.title ? `${data.poolDetails.title}-Launchpad` : ""
        }`,
        native_symbol: data?.currencySymbol,
        liquidity: {
          liquidityPercent: data.liquidityPercent,
          liquidityListingRate: data.liquidityListingRate,
          liquidityLockDays: data.liquidityLockDays,
          liquidityUnlockTime: data.liquidityUnlockTime,
        },
        fees: data.ethFeePercent,
        token: {
          name: data.tokenName,
          symbol: data.tokenSymbol,
          decimals: data.tokenDecimal,
          supply: data.tokenSupply,
          address: data.token,
        },
        total_sold: data.totalRaised,
        soft_cap: data.softCap,
        hard_cap: data.hardCap,
        start_time: parseFloat(data.startTime),
        end_time: parseFloat(data.endTime),
        description: data?.poolDetails?.description,
        sale_type: data.useWhitelisting ? "Whitelist" : "Public",
        pool_address: data.poolAddress,
        min_buy: data.minContribution,
        max_buy: data.maxContribution,
        poolOwner: String(data.governance),
        poolState: data.poolState,
        userWhitelisted: data.userWhitelisted,
        userTier: data.userTier,
        tier2: data.tier2,
        tier1: data.tier1,
      }}
    />
  );
};

export default LaunchpadDetails;
