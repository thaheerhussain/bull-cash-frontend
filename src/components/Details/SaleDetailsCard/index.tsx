import Button from "@atoms/Button";
import useWidth from "@hooks/useWidth";
import React, { useMemo, useState } from "react";
import { Line } from "rc-progress";
import { CountdownTimer } from "@atoms/CountdownTimer";
import BuyNowModal from "../BuyNowModal";
import { DetailsType, IPoolDetailsData } from "@components/Details";
import { useAccountStats } from "@components/LaunchPad/Details/hooks/useStats";
import { getWeb3 } from "@constants/connectors";
import { getContract } from "@constants/contractHelper";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import { parseEther } from "ethers/lib/utils";
import { toast } from "react-toastify";
import presalePoolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import { useRouter } from "next/router";
import moment from "moment";
import { da } from "date-fns/locale";

interface ISaleDetail {
  isSaleLive?: boolean;
  className?: string;
  status?: string;
  totalToken: number;
  tokenSymbol: string;
  tokenSold: number;
  startTime: string;
  endTime: string;
  type: DetailsType;
  data: IPoolDetailsData;
}

interface ITimeComp {
  value: number | string;
  unit: string;
}

const TimerComp: React.FC<ITimeComp> = ({ value, unit }) => {
  return (
    <div className="flex flex-col text-base font-medium">
      <span className="font-medium text-xl sm:text-2xl">{value}</span>
      <span className="text-gray9 text-sm">{unit}</span>
    </div>
  );
};

const BuySection = ({ data }: { data: IPoolDetailsData }) => {
  const { chainId, balance_formatted, balance, account, library } = useAuth();
  const accStats = useAccountStats({ address: data.pool_address });
  const [amount, setAmount] = useState(0);
  const [btndisabled, setBtndisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error_msg, setError_msg] = useState("");
  const router = useRouter();

  const handleChangeAmount = (e: any) => {
    setAmount(e.target.value);

    if (isNaN(e.target.value)) {
      setError_msg("please enter valid amount");
      setBtndisabled(true);
    } else if (parseFloat(e.target.value) === 0 || e.target.value === "") {
      setError_msg("amount must be greater than zero");
      setBtndisabled(true);
    } else if (
      parseFloat(e.target.value) < data.min_buy ||
      parseFloat(e.target.value) > data.max_buy
    ) {
      setError_msg(
        `amount must be between ${data.min_buy} and ${data.max_buy}`
      );
      setBtndisabled(true);
    } else {
      setError_msg("");
      setBtndisabled(false);
    }
    return;
  };

  const handleMaxAmount = () => {
    let maxamount = balance_formatted;
    if (maxamount < data.min_buy) {
      setError_msg(
        `amount must be between ${data.min_buy} and ${data.max_buy}`
      );
      setBtndisabled(true);
    }
    if (maxamount > data.max_buy) maxamount = data.max_buy;
    setAmount(parseFloat(maxamount.toFixed(4).toString()));
  };

  const handleSubmitContribution = async () => {
    setLoading(true);

    try {
      if (amount > 0 && amount < data.min_buy) {
        toast.error("Minimum buy is not valid");
        setLoading(false);
        return;
      } else if (amount > 0 && amount > data.max_buy) {
        toast.error("Maximum buy is not valid");
        setLoading(false);
        return;
      }
      if (amount > 0 && (data.max_buy > amount || data.min_buy < amount)) {
        if (account) {
          if (chainId) {
            if (balance_formatted >= amount) {
              let poolContract = getContract(
                presalePoolAbi,
                data.pool_address,
                library
              );

              // @ts-ignore
              let tx = await poolContract.contribute(
                parseEther(String(amount)),
                {
                  from: account,
                  value: parseEther(String(amount)),
                }
              );
              await toast.promise(tx.wait, {
                pending: "Waiting for confirmation 👌",
              });

              let web3 = getWeb3(chainId);
              var response = await web3.eth.getTransactionReceipt(tx.hash);
              if (response != null) {
                if (response.status) {
                  toast.success(
                    "success ! your last transaction is success 👍"
                  );
                  setLoading(false);
                  router.reload();
                } else if (!response.status) {
                  toast.error("error ! Your last transaction is failed.");
                  setLoading(false);
                } else {
                  toast.error("error ! something went wrong.");
                  setLoading(false);
                }
              }
            } else {
              toast.error("you don't have enough balance !");
              setLoading(false);
            }
          } else {
            toast.error("Please select Smart Chain Network !");
            setLoading(false);
          }
        } else {
          toast.error("Please Connect Wallet!");
          setLoading(false);
        }
      } else {
        toast.error("Please Enter Valid Amount !");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason);
      setLoading(false);
    }
  };
  return (
    <>
      {data.sale_type === "Whitelist" && !data.userWhitelisted && account && (
        <div className="flex  justify-center text-center items-center my-3 alert alert-error py-1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You're not whitelisted, You can not purchase the tokens!
        </div>
      )}
      {data.sale_type === "Whitelist" && data.userWhitelisted && (
        <div className="flex  justify-center text-center items-center my-3 alert alert-success py-1">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You're Whitelisted, You can purchase the tokens now!
        </div>
      )}
      <div className="flex  justify-between w-full rounded-full  outline outline-1 outline-gray-300 ">
        <input
          value={amount}
          onChange={handleChangeAmount}
          type="number"
          className="p-3 py-2.5 outline-none pr-0 rounded-lg w-full"
        />
        <div className="px-3 flex items-center border-l flex-shrink-0">
          <p
            className="cursor-pointer font-semibold uppercase"
            onClick={handleMaxAmount}>
            MAX
          </p>
          {/*<Image src={ETHIcon} className={"flex-shrink-0"} alt={"icon"} />*/}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row  justify-between text-sm mt-1 ">
        <p className="text-[#B0B0B0]">{"Your Balance"}</p>
        <span>
          {balance_formatted} {supportNetwork[chainId || "default"]?.symbol}
        </span>
      </div>
      <Button
        variant="orange"
        disabled={
          loading || (data.sale_type === "Whitelist" && !data.userWhitelisted)
        }
        loading={loading}
        className="w-full mt-4"
        onClick={() => {
          handleSubmitContribution();
        }}>
        Buy Now
      </Button>
    </>
  );
};

const SaleDetailsCard: React.FC<ISaleDetail> = ({
  isSaleLive,
  status,
  className,
  tokenSold,
  totalToken,
  startTime,
  endTime,
  tokenSymbol,
  data,
  type,
}) => {
  const router = useRouter();
  const width = useWidth();
  const percent = (tokenSold / totalToken) * 100;

  const pickTime = useMemo(() => {
    if (moment(startTime).isAfter(moment())) {
      if (data.tier1 || data.tier2) {
        if (data.userWhitelisted) {
          if (data.userTier == 2 && data.tier2) {
            const date = data?.tier2?.start_time
              ? moment.unix(data?.tier2?.start_time || 0)
              : moment(startTime);
            if (date.isAfter(moment())) {
              return String(date);
            } else {
              return endTime;
            }
          } else {
            const date = data?.tier1?.start_time
              ? moment.unix(data?.tier1?.start_time || 0)
              : moment(startTime);
            if (date.isAfter(moment())) {
              return String(date);
            } else {
              return endTime;
            }
          }
        } else {
          if (moment(startTime).isAfter(moment())) {
            return startTime;
          } else {
            return endTime;
          }
        }
      } else {
        if (moment(startTime).isAfter(moment())) {
          return startTime;
        } else {
          return endTime;
        }
      }
    } else {
      return endTime;
    }
  }, [endTime, startTime, data]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  return (
    <>
      {type === "airdrop" && (
        <div
          className={`grid gap-4 shadow-boxShadow6 h-max ${
            status === "airdrop live"
              ? "sm:grid-cols-2 sm:divide-x border-2"
              : ""
          }    rounded-3xl px-4 py-6 sm:p-6  bg-white ${className}`}>
          {status !== "upcoming" ? (
            <div className={`flex flex-col justify-between`}>
              <h1 className="font-medium text-3xl sm:text-4xl">{`${tokenSold} ${tokenSymbol}`}</h1>
              {tokenSold === 0 ? (
                <div className="w-full bg-[#F2F2F2] rounded-full h-3" />
              ) : (
                <Line
                  percent={percent}
                  strokeWidth={3}
                  strokeColor="#70FF00"
                  trailWidth={3}
                  trailColor={"#F2F2F2"}
                />
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray6">{`${tokenSold} ${tokenSymbol}`}</span>
                <span className="text-sm font-medium text-gray6">{`${totalToken} ${tokenSymbol}`}</span>
              </div>
            </div>
          ) : (
            <></>
          )}
          {status === "upcoming" ? (
            <>
              <p className="text-center text-base sm:text-lg font-semibold">
                {"Airdrop starts in"}
              </p>
              <CountdownTimer
                className="justify-center"
                variant={"new-box"}
                date={pickTime}
                callback={() => {
                  router.reload();
                }}
              />
            </>
          ) : status === "airdrop live" ? (
            <div className={"flex items-center sm:pl-5"}>
              <p className="text-base sm:text-lg font-semibold">
                {"Airdrop has been started"}
              </p>
            </div>
          ) : (
            <div className={"flex items-center sm:pl-5"}>
              <p className="text-base sm:text-lg font-semibold">
                {"Airdrop has been ended"}
              </p>
            </div>
          )}
        </div>
      )}
      {type !== "airdrop" && (
        <div
          className={`grid gap-4 shadow-boxShadow6 h-max ${
            status === "sale live" ? "sm:grid-cols-2" : ""
          }  border-2  rounded-3xl px-4 py-6 sm:p-6  bg-white ${className}`}>
          {status !== "upcoming" ? (
            <div className={`flex flex-col justify-start gap-2`}>
              <h1 className="font-medium text-3xl sm:text-4xl">{`${tokenSold} ${tokenSymbol}`}</h1>
              {tokenSold === 0 ? (
                <div className="w-full bg-[#F2F2F2] rounded-full h-3" />
              ) : (
                <Line
                  percent={percent}
                  strokeWidth={3}
                  strokeColor="#70FF00"
                  trailWidth={3}
                  trailColor={"#F2F2F2"}
                />
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-text2">{`${tokenSold} ${tokenSymbol}`}</span>
                <span className="text-sm font-medium text-text2">{`${totalToken} ${tokenSymbol}`}</span>
              </div>
            </div>
          ) : (
            <></>
          )}
          {status !== "sale ended" ? (
            <div
              className={`${
                status === "upcoming" ? "" : "sm:pl-5 sm:border-l"
              }`}>
              {status === "upcoming" ? (
                <>
                  <p className="text-base sm:text-lg text-center font-semibold mb-2">
                    {"Presale starts in"}
                  </p>
                  <CountdownTimer
                    className="w-full justify-center"
                    variant={"new-box"}
                    date={pickTime}
                    callback={() => {
                      router.reload();
                    }}
                  />
                </>
              ) : (
                <>
                  <p className="text-base sm:text-lg font-semibold mb-3">
                    {"Presale ends in"}
                  </p>
                  <CountdownTimer
                    className="w-full"
                    variant={"new-box"}
                    date={pickTime}
                  />
                </>
              )}
            </div>
          ) : (
            <></>
          )}
          {status === "sale live" && (
            <div className="sm:col-span-2 mt-4">
              <BuySection data={data} />
            </div>
          )}
        </div>
      )}
      {showBuyModal && (
        <BuyNowModal
          showModal={showBuyModal}
          data={data}
          setShowModal={setShowBuyModal}
        />
      )}
    </>
  );
};

export default SaleDetailsCard;
