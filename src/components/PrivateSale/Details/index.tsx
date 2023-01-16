import React, { useMemo } from "react";
import DetailsPageComponent, { IInfoList } from "@components/Details";
import { useRouter } from "next/router";
import {
  useCommonStats,
  useAccountStats,
} from "@components/PrivateSale/Details/hooks/useStats";
import { formatPrice } from "@constants/contractHelper";
import moment from "moment";
import { trimAddress } from "@constants/constant";
import { title } from "case";
import { TIME_FORMAT } from "@constants/timeFormats";

const PrivateSaleDetails = () => {
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
  console.log("privateSaleData", data);
  console.log("accountData", accountData);

  const details = useMemo<IInfoList[]>(() => {
    return [
      {
        title: "Sale Type",
        value: `Private Sale`,
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
        title: "First token release after listing",
        value: `${data.tgeBps > 0 ? data.tgeBps / 100 : 100} %`,
      },
      {
        title: "Cycle (days)",
        value: `${data.cycle > 0 ? data.cycle / 60 / 60 / 24 : 0} %`,
      },
      {
        title: "Tokens release every cycle",
        value: `${data.cycleBps > 0 ? data.cycleBps / 0 : 0}`,
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
  const project_status = useMemo(() => {
    console.log(
      "project_status 1",
      moment.unix(Number(data.startTime)).isAfter(moment()),
      accountData.userWhitelisted,
      !!(data.tier2 || data.tier1),
      data.poolState
    );
    let startTime, endTime;
    if (
      parseInt(String(data.poolState)) === 1 ||
      parseInt(String(data.poolState)) === 2
    ) {
      return "sale ended";
    }
    if (moment.unix(Number(data.startTime)).isAfter(moment())) {
      if (data.tier2 || data.tier1) {
        if (accountData.userWhitelisted) {
          if (accountData.userTier == 2 && data.tier2) {
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
    accountData.userTier,
    accountData.userWhitelisted,
    data.poolState,
  ]);

  return (
    <DetailsPageComponent
      infoList={details}
      type={"privatesale"}
      data={{
        myClaim: accountData.userAvailableClaim,
        myContribution: accountData.contributionOf,
        status: project_status,
        logo: data?.poolDetails?.logo,
        banner: data?.poolDetails?.banner,
        title: `${
          data.poolDetails.title ? `${data.poolDetails.title}-Privatesale` : ""
        }`,
        token: {
          name: "",
          symbol: data.currencySymbol,
          decimals: 0,
          supply: 0,
          address: undefined,
        },
        total_sold: data.totalRaised,
        soft_cap: data.softCap,
        hard_cap: data.hardCap,
        start_time: data.startTime,
        end_time: data.endTime,
        description: data?.poolDetails?.description,
        sale_type: data.useWhitelisting ? "Whitelist" : "Public",
        pool_address: data.poolAddress,
        min_buy: data.minContribution,
        max_buy: data.maxContribution,
        poolOwner: String(data.governance),
        poolState: String(data.poolState),
        userWhitelisted: accountData.userWhitelisted,
        userTier: accountData.userTier,
        tier2: data.tier2,
        tier1: data.tier1,
      }}
    />
  );
};

export default PrivateSaleDetails;
