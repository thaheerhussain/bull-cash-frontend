import { useEffect, useMemo, useState } from "react";
import {
  MulticallContractWeb3,
  multiCallContractConnect,
} from "@hooks/useContracts";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import presalePoolAbi from "../../../../ABIs/PresalePool/PresalePool.json";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";
import useAuth from "@hooks/useAuth";
import airdropFactoryAbi from "../../../../ABIs/AirdropMaster/AirdropMaster.json";
import { IAirdropDetails } from "@components/AirDrop/Details/hooks/useStats";
import moment from "moment";

export interface IPoolDetails {
  tier1?: {
    start_time: number;
    end_time: number;
  };
  tier2?: {
    start_time: number;
    end_time: number;
  };
  userWhitelisted?: boolean;
  userTier?: number;
  endTime: string;
  startTime: string;
  hardCap: number;
  softCap: number;
  liquidityListingRate: number;
  liquidityLockDays: number;
  liquidityPercent: number;
  liquidityUnlockTime: number;
  maxContribution: number;
  poolDetails: {
    logo: string;
    title: string;
    banner: string;
    description: string;
    socials: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      github: string;
      telegram: string;
      discord: string;
      reddit: string;
    };
  };
  poolState: string;
  rate: number;
  remainingContribution: number;
  tgeDate: number;
  tgeBps: number;
  cycleBps: number;
  token: string;
  totalClaimed: number;
  totalRaised: number;
  totalVestedTokens: number;
  useWhitelisting: number;
  minContribution: number;
  tokenName: string;
  tokenDecimal: number;
  tokenSymbol: string;
  percentageRaise: number;
  tokenSupply: number;
  refundType: number;
  cycle: number;
  poolAddress: string;
  governance: number;
  kyc: number;
  audit: number;
  auditStatus: number;
  kycStatus: number;
  ethFeePercent: number;
  currencySymbol: string;
  whitelists?: {
    address: string;
  }[];
}

export const useCommonStats = (
  update: { address: string },
  timer?: boolean,
  timeInterval?: number
): IPoolDetails => {
  const context = useAuth();
  const { chainId, account } = context;
  const urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId || "default");
  }, [chainId]);

  const poolContract = useMemo(() => {
    console.log("WHAT", !web3, urlAddress);
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const initialState: IPoolDetails = {
    endTime: "0",
    startTime: "0",
    hardCap: 0,
    softCap: 0,
    liquidityListingRate: 0,
    liquidityLockDays: 0,
    liquidityPercent: 0,
    liquidityUnlockTime: 0,
    maxContribution: 0,
    poolDetails: {
      title: "",
      logo: "",
      banner: "",
      description: "",
      socials: {
        website: "",
        facebook: "",
        twitter: "",
        instagram: "",
        github: "",
        telegram: "",
        discord: "",
        reddit: "",
      },
    },
    poolState: "0",
    rate: 0,
    remainingContribution: 0,
    tgeDate: 0,
    tgeBps: 0,
    cycleBps: 0,
    token: "",
    totalClaimed: 0,
    totalRaised: 0,
    totalVestedTokens: 0,
    useWhitelisting: 0,
    minContribution: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: "",
    percentageRaise: 0,
    tokenSupply: 0,
    refundType: 0,
    cycle: 0,
    poolAddress: "",
    governance: 0,
    kyc: 0,
    audit: 0,
    auditStatus: 0,
    kycStatus: 0,
    ethFeePercent: 0,
    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  };
  const [stats, setStats] = useState<IPoolDetails>(initialState);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.endTime(), //0
            poolContract.methods.startTime(), //1
            poolContract.methods.hardCap(), //2
            poolContract.methods.softCap(), //3
            poolContract.methods.liquidityListingRate(), //4
            poolContract.methods.liquidityLockDays(), //5
            poolContract.methods.liquidityPercent(), //6
            poolContract.methods.liquidityUnlockTime(), //7
            poolContract.methods.maxContribution(), //8
            poolContract.methods.poolDetails(), //9
            poolContract.methods.poolState(), //10
            poolContract.methods.rate(), //11,
            poolContract.methods.remainingContribution(), //12
            poolContract.methods.tgeDate(), //13
            poolContract.methods.tgeBps(), //14
            poolContract.methods.cycle(), //15
            poolContract.methods.cycleBps(), //16
            poolContract.methods.token(), //17
            poolContract.methods.totalClaimed(), //18
            poolContract.methods.totalRaised(), //19
            poolContract.methods.useWhitelisting(), //20
            poolContract.methods.minContribution(), //21
            poolContract.methods.refundType(), //22
            poolContract.methods.governance(), //23
            poolContract.methods.getTier("1"), //24
            poolContract.methods.getTier("2"), //25
            poolContract.methods.publicStartTime(), //26
            // poolContract.methods.kycStatus(), //27
            // poolContract.methods.ethFeePercent(), //28
          ]);
          let userData;
          if (account) {
            try {
              console.log("account", account);
              userData = await mc.aggregate([
                poolContract.methods.isWhitelisted(account), //0
                poolContract.methods.whitelistTier(account), //1
              ]);
              console.log("account", account);
            } catch (e) {
              console.error("Error while fetching isUserWhitelisted", e);
            }
          }

          // @ts-ignore
          let tokenContract = new web3.eth.Contract(tokenAbi, data[17]);

          const tokendata = await mc.aggregate([
            tokenContract.methods.name(),
            tokenContract.methods.decimals(),
            tokenContract.methods.symbol(),
            tokenContract.methods.totalSupply(),
          ]);

          const poolDetailsSplit = data[9].toString().includes("$#$")
            ? data[9].toString().split("$#$")
            : false;
          const startTIme = parseInt(data[1]);
          const tier1EndTime = parseInt(data[24]?.endTime);
          const tier2EndTime = parseInt(data[25]?.endTime);
          const publicStartTime = parseInt(data[26]);
          const userTier = userData
            ? parseInt(userData[1]) || undefined
            : undefined;
          let startTime = startTIme;
          if (tier2EndTime > 0) {
            startTime = tier2EndTime;
          }
          if (userTier == 1) {
            startTime = startTIme;
          }
          if (publicStartTime <= moment().unix() && publicStartTime > 0) {
            startTime = publicStartTime;
          }
          console.log(
            "startTime",
            userTier,
            moment().unix() >= tier2EndTime,
            moment().utc().isBefore(moment.unix(startTime)),
            startTIme,
            tier2EndTime,
            publicStartTime
          );
          setStats({
            tier1: {
              start_time: data[1],
              end_time: data[24]?.endTime,
            },
            tier2: {
              start_time: data[24]?.endTime,
              end_time: data[25]?.endTime,
            },
            userWhitelisted: userData ? userData[0] || undefined : undefined,
            userTier: userData ? userData[1] || undefined : undefined,
            endTime: data[0],
            startTime: String(startTime),
            hardCap: data[2] / Math.pow(10, 18),
            softCap: data[3] / Math.pow(10, 18),
            liquidityListingRate: data[4] / Math.pow(10, tokendata[1]),
            liquidityLockDays: data[5],
            liquidityPercent: data[6],
            liquidityUnlockTime: data[7],
            maxContribution: data[8] / Math.pow(10, 18),
            poolDetails: poolDetailsSplit
              ? {
                  logo: poolDetailsSplit[0],
                  banner: poolDetailsSplit[0],
                  description: poolDetailsSplit[11],
                  socials: {
                    website: "",
                    facebook: "",
                    twitter: "",
                    instagram: "",
                    github: "",
                    telegram: "",
                    discord: "",
                    reddit: "",
                  },
                }
              : JSON.parse(data[9].toString()),
            poolState: data[10],
            totalVestedTokens: 0,
            rate: data[11] / Math.pow(10, tokendata[1]),
            remainingContribution: data[12] / Math.pow(10, 18),
            tgeDate: data[13],
            tgeBps: data[14],
            cycleBps: data[16],
            token: data[17],
            totalClaimed: data[18],
            totalRaised: data[19] / Math.pow(10, 18),
            useWhitelisting: data[20],
            minContribution: data[21] / Math.pow(10, 18),
            tokenName: tokendata[0],
            tokenDecimal: tokendata[1],
            tokenSymbol: tokendata[2],
            percentageRaise:
              (data[19] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) *
              100,
            tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
            refundType: data[22],
            cycle: data[15],
            poolAddress: urlAddress,
            governance: data[23],
            kyc: 0,
            audit: 0,
            auditStatus: 0,
            kycStatus: 0,
            ethFeePercent: 5,
            currencySymbol: supportNetwork[chainId || "default"]
              ? supportNetwork[chainId || "default"].symbol
              : supportNetwork["default"].symbol,
          });
        } catch (err: any) {
          console.error("WHAT", err);
          toast.error("wrong network selected !");
        }
      };
      if (timer && timeInterval) {
        const interval = setInterval(() => {
          fetch();
        }, timeInterval * 1000);
        return () => clearInterval(interval);
      } else {
        fetch();
      }
    } else {
      setStats(initialState);
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract, account]);
  return stats;
};

export const useAccountStats = (updater: { address: string }) => {
  const context = useAuth();
  const { chainId, account } = context;
  const urlAddress = updater.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId);
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const mcc = useMemo(() => {
    return multiCallContractConnect(chainId);
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<{
    balance: number;
    contributionOf: number;
    userAvailableClaim: number;
  }>({
    balance: 0,
    contributionOf: 0,
    userAvailableClaim: 0,
  });

  useEffect(() => {
    if (mc && account && web3 && mcc && poolContract) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            mcc.methods.getEthBalance(account),
            poolContract.methods.contributionOf(account),
            poolContract.methods.userAvailableClaim(account),
          ]);
          console.log("data[1]", data);
          setStats({
            balance: data[0] / Math.pow(10, 18),
            contributionOf: data[1] / Math.pow(10, 18),
            userAvailableClaim: data[2] / Math.pow(10, 18),
          });
        } catch (err: any) {
          console.log("err", err);
          toast.error(err.reason);
          // history.push('/sale-list');
        }
      };
      fetch();
    } else {
      setStats({
        balance: 0,
        contributionOf: 0,
        userAvailableClaim: 0,
      });
    }
    // eslint-disable-next-line
  }, [account, chainId, mc, web3, poolContract]);

  return stats;
};

export const useWhitelistStats = (update: {
  address: string;
  page: number;
  pageSize: number;
  loading: boolean;
}): IPoolDetails["whitelists"] => {
  const context = useAuth();
  const { chainId } = context;
  const { page, pageSize } = update;
  const urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId || "default");
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<IPoolDetails["whitelists"]>([]);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.getNumberOfWhitelistedUsers(),
          ]);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const poolData = await mc.aggregate([
              poolContract.methods.getWhitelistedUsers(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);
            setStats(
              poolData[0].map((value: string, i: number) => ({
                address: value,
              }))
            );
          } else {
            setStats([]);
          }
        } catch (err: any) {
          console.error("WHAT", err);
          toast.error("wrong network selected !");
        }
      };
      fetch();
    } else {
      setStats([]);
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract]);

  return stats;
};
