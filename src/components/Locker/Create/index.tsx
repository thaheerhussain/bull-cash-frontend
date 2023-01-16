import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Formik, useFormik } from "formik";
import Input from "@atoms/Input";
import Button from "@atoms/Button";
import CustomCheckbox from "@atoms/CheckBox";
import ERC20ABI from "../../../ABIs/ERC20/ERC20ABI.json";
import LockerABI from "../../../ABIs/Locker/lockerABI.json";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { getContract, mulDecimal } from "@constants/contractHelper";
import { parseUnits } from "@ethersproject/units";
import { isAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import erc20abi from "../../../ABIs/ERC20/ERC20ABI.json";
import useTokenInfo from "@hooks/useTokenInfo";
import { formatUnits, parseEther } from "ethers/lib/utils";
import { useRouter } from "next/router";
import Input2 from "@atoms/Input2";
import SmallSwitch from "@atoms/CustomSmallSwitch";
import BannerImage from "@public/images/lockerBannerImage.png";
import Image from "next/image";
import DateTimePicker from "@atoms/DateTimeInput";
import moment from "moment";

interface IFormValues {
  tokenOrLPTokenAddress: string;
  title: string;
  useAnotherOwner: boolean;
  ownerAddress: string;
  amount: string;
  lockUntil: string;
  TGEDate: string;
  TGEPercentage?: number;
  CycleTime?: number;
  CycleReleasePercent?: number;
  isvesting: boolean;
  islp: boolean;
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: string;
  balance: string;
  pair: string;
}

const LockerCreateComp = () => {
  const [loading, setLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<any>("");
  const router = useRouter();
  const { account, chainId, ethereum, library } = useAuth();

  const LockSchema = Yup.object().shape({
    balance: Yup.string(),
    pair: Yup.string(),
    name: Yup.string().required("Token name Required"),
    symbol: Yup.string().required("Symbol Required"),
    decimals: Yup.number()
      .typeError("Must be a number")
      .required("Decimals Required"),
    totalSupply: Yup.number()
      .label("Total supply")
      .typeError("Must be a number")
      .required("Total Supply Required"),
    tokenOrLPTokenAddress: Yup.string()
      .label("Token Address")
      .required("Address Required")
      .test("valid-address", "Invalid Address", (address, context) =>
        isAddress(address || "")
      ),

    title: Yup.string(),
    useAnotherOwner: Yup.boolean(),
    ownerAddress: Yup.string().when("useAnotherOwner", {
      is: true,
      then: Yup.string()
        .required("Address Required")
        .test("valid-address", "Invalid Address", (address, context) =>
          isAddress(address || "")
        ),
    }),
    amount: Yup.string()
      .required("Amount Required")
      .test("valid-amount", "Please Enter Valid Amount!", (value) => {
        const inputValue = value || "";
        const reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          return false;
        } else if (parseFloat(inputValue) > 0) {
          return true;
        }
        return true;
      }),
    lockUntil: Yup.date()
      .label("Lock time")
      .test(
        "LockTime",
        "Lock time should be atleast 15 minutes in future",
        (value) => !value || value >= moment.utc().add(15, "m").toDate()
      )
      .required("Date Required"),
    TGEDate: Yup.date()
      .label("TGE date")
      .when("isvesting", {
        is: true,
        then: Yup.date()
          .test(
            "TGEDate",
            "Time should be atleast 15 minutes in future",
            (value) => !value || value >= moment.utc().add(15, "m").toDate()
          )
          .required("Date Required"),
      }),
    TGEPercentage: Yup.number()
      .label("TGE Percentage")
      .when("isvesting", {
        is: true,
        then: Yup.number().max(99).moreThan(0).required("Percentage Required"),
      }),
    CycleTime: Yup.number()
      .label("Cycle")
      .when("isvesting", {
        is: true,
        then: Yup.number().moreThan(0).required("time Required"),
      }),
    CycleReleasePercent: Yup.number()
      .label("Cycle release percent")
      .when("isvesting", {
        is: true,
        then: Yup.number().max(99).moreThan(0).required("Percentage Required"),
      }),
  });

  const initialValues: IFormValues = {
    tokenOrLPTokenAddress: "",
    title: "",
    ownerAddress: "",
    amount: "",
    lockUntil: "",
    TGEDate: "",
    TGEPercentage: undefined,
    CycleTime: undefined,
    CycleReleasePercent: undefined,
    useAnotherOwner: false,
    isvesting: false,
    islp: false,
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    balance: "",
    pair: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LockSchema,
    onSubmit: async (values) => {
      await handleSubmitLock(values);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  const {
    tokenName: name,
    tokenSymbol: symbol,
    tokenBalance,
    decimals,
    totalSupply,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
    fetchLPTokenDetail,
    isLPToken,
    pair,
  } = useTokenInfo({
    tokenAddress: values.tokenOrLPTokenAddress || "",
    ethereum,
  });

  useEffect(() => {
    if (formik.values.tokenOrLPTokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
      fetchLPTokenDetail();
    }
  }, [formik.values.tokenOrLPTokenAddress]);

  useEffect(() => {
    if (name) {
      formik.setFieldValue("name", name);
      formik.setFieldValue("symbol", symbol);
      formik.setFieldValue("decimals", decimals);
      formik.setFieldValue("title", name);
      formik.setFieldValue("totalSupply", formatUnits(totalSupply, decimals));
      formik.setFieldValue("pair", pair);
      formik.setFieldValue(
        "balance",
        (parseFloat(tokenBalance) / 10 ** parseFloat(decimals)).toString()
      );
    }
  }, [name, pair]);

  const handleApprove = async (
    value: IFormValues,
    decimals: number
  ): Promise<boolean> => {
    let success = false;
    if (account && chainId && library) {
      try {
        if (value.tokenOrLPTokenAddress) {
          setLoading(true);
          const lockAddress = contract[chainId]
            ? contract[chainId].lockAddress
            : contract["default"].lockAddress;
          const tokenContract = getContract(
            ERC20ABI,
            value.tokenOrLPTokenAddress,
            library
          );
          // @ts-ignore
          const allowance = await tokenContract.allowance(account, lockAddress);
          let amount = parseUnits(value.amount, decimals).toString();
          if (allowance.gte(amount)) return true;
          // @ts-ignore
          let tx = await tokenContract.approve(lockAddress, amount, {
            from: account,
          });

          await toast.promise(tx.wait, {
            pending: "Waiting for confirmation 👌",
          });
          const web3 = getWeb3(chainId);
          const response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              success = true;
              toast.success("success ! your last transaction is success 👍");
              setLoading(false);
            } else if (!response.status) {
              toast.error("error ! Your last transaction is failed.");
              setLoading(false);
            } else {
              toast.error("error ! something went wrong.");
              setLoading(false);
            }
          }
        } else {
          toast.error("Please enter valid token address !");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("WHILE APPROVE", err);
        toast.error(err?.reason || "");
        setLoading(false);
      }
    } else {
      toast.error("Please Connect Wallet!");
      setLoading(false);
    }
    return success;
  };

  const handleSubmitLock = async (values: IFormValues) => {
    console.log(values);
    const erc20 = new ethers.Contract(
      values.tokenOrLPTokenAddress,
      erc20abi,
      library
    );
    const decimals = await erc20.decimals();
    const approved = await handleApprove(values, decimals);
    if (approved) {
      if (chainId && account && library) {
        try {
          let web3 = getWeb3(chainId);
          setLockLoading(true);
          let lockAddress = contract[chainId]
            ? contract[chainId].lockAddress
            : contract["default"].lockAddress;
          let lockContract = getContract(LockerABI, lockAddress, library);
          if (values.isvesting) {
            // @ts-ignore
            let tx = await lockContract.vestingLock(
              values.useAnotherOwner ? values.ownerAddress : account,
              values.tokenOrLPTokenAddress,
              values.islp,
              mulDecimal(values.amount, decimals),
              Math.floor(new Date(values.TGEDate).getTime() / 1000.0),
              (values?.TGEPercentage || 0) * 100,
              (values?.CycleTime || 0) * 60,
              (values?.CycleReleasePercent || 0) * 100,
              values.title,
              { from: account }
            );
            await toast.promise(tx.wait, {
              pending: "Waiting for confirmation 👌",
            });
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              if (response.status) {
                toast.success("success ! your last transaction is success 👍");
                setLockLoading(false);
                await router.push(`/locker/token-liquidity`);
              } else if (!response.status) {
                toast.error("error ! Your last transaction is failed.");
                setLockLoading(false);
              } else {
                toast.error("error ! something went wrong.");
                setLockLoading(false);
              }
            }
          } else {
            // @ts-ignore
            let tx = await lockContract.lock(
              values.useAnotherOwner ? values.ownerAddress : account,
              values.tokenOrLPTokenAddress,
              values.islp,
              mulDecimal(values.amount, decimals),
              web3.utils.toHex(
                Math.floor(new Date(values.lockUntil).getTime() / 1000.0)
              ),
              values.title,
              { from: account }
            );
            await toast.promise(tx.wait, {
              pending: "Waiting for confirmation 👌",
            });
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              console.log("response", response);
              if (response.status) {
                toast.success("success ! your last transaction is success 👍");
                setLockLoading(false);
                await router.push(`/locker/token-liquidity`);
              } else if (!response.status) {
                toast.error("error ! Your last transaction is failed.");
                setLockLoading(false);
              } else {
                toast.error("error ! something went wrong.");
                setLockLoading(false);
              }
            }
          }
        } catch (err: any) {
          console.log(err, "here");
          toast.error(err.reason ? err.reason : err.message);
          setLockLoading(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-locker">
        <h1 className="text-black mt-4 font-fonde text-4xl md:text-5xl lg:text-7xl font-normal">
          Create a Lock
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
      </div>
      <div className="container mx-auto">
        <div className="mt-12 md:mt-16 mb-4 w-full p-4 md:p-6 lg:p-8 border border-[#EFF0F7] shadow-boxShadow6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10">
            <Input2
              label="Token or LP Token address*"
              placeholder="Enter token or LP token address"
              name="tokenOrLPTokenAddress"
              onChange={handleChange}
              value={values.tokenOrLPTokenAddress}
              error={errors.tokenOrLPTokenAddress}
            />
            <Input2
              label="Title"
              name="title"
              placeholder="Ex: My Lock"
              onChange={handleChange}
              value={values.title}
              error={errors.title}
            />

            <div>
              <div className="text-base font-semibold text-[#64748B]">
                use another owner?
              </div>
              <SmallSwitch
                enableColor="bg-[#EB6D65]"
                className="mt-4"
                enabled={values.useAnotherOwner}
                setEnabled={(value) => {
                  setFieldValue("useAnotherOwner", value);
                }}
              />
            </div>
            {values.useAnotherOwner && (
              <div className="">
                <Input2
                  className=""
                  label="Owner"
                  name="ownerAddress"
                  placeholder="Enter owner address"
                  onChange={handleChange}
                  value={values.ownerAddress}
                  error={errors.ownerAddress}
                />
                <div className="text-xs mt-2">
                  the address you input here will be receive the tokens once
                  they are unlocked
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10 my-8">
            <Input2
              label={`Name*`}
              placeholder={"Ex: Ethereum"}
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && formik.errors.name}
              disabled
            />
            <Input2
              label={`Symbol*`}
              placeholder={"Ex: ETH"}
              name="symbol"
              value={formik.values.symbol}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.symbol && formik.errors.symbol}
              disabled
            />
            <Input2
              label={`Decimals*`}
              placeholder={"Ex: 20"}
              name="decimals"
              type={"number"}
              value={formik.values.decimals}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.decimals && formik.errors.decimals}
              disabled
            />
            <Input2
              label={`Total supply*`}
              placeholder={"Ex: 200000"}
              name="totalSupply"
              type={"number"}
              value={formik.values.totalSupply}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.totalSupply && formik.errors.totalSupply}
              disabled
            />
            {isLPToken && (
              <Input2
                label={`Pair`}
                placeholder={""}
                name="pair"
                value={formik.values.pair}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.pair && formik.errors.pair}
                disabled
              />
            )}
            <Input2
              label={`Balance`}
              placeholder={"30"}
              name="balance"
              type={"number"}
              value={formik.values.balance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.balance && formik.errors.balance}
              disabled
            />
            <Input2
              label="Amount*"
              name="amount"
              placeholder="Enter Amount"
              onChange={handleChange}
              value={values.amount}
              error={errors.amount}
            />
            <DateTimePicker
              label="Lock until (UTC)*"
              placeholder="Select Date"
              name="lockUntil"
              onChange={(v: any) => setFieldValue("lockUntil", v)}
              value={values.lockUntil}
              error={errors.lockUntil}
            />
          </div>
          {/* <div className="flex flex-col md:flex-row  justify-between items-start md:my-6">
            <div className="w-full md:mr-8 lg:mr-10">
              <CustomCheckbox
                isChecked={values.isvesting}
                setIsChecked={(value) => {
                  setFieldValue("isvesting", value);
                }}
                label="Use vesting?"
              />
            </div>
            
          </div> */}
          <div>
            <div className="text-base font-semibold text-[#64748B]">
              Use vesting?
            </div>
            <SmallSwitch
              enableColor="bg-[#EB6D65]"
              className="mt-4"
              enabled={values.isvesting}
              setEnabled={(value) => {
                setFieldValue("isvesting", value);
              }}
            />
          </div>
          {values.isvesting && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-10 mt-10">
                <DateTimePicker
                  label="TGE date (UTC)*"
                  placeholder="Enter date"
                  name="TGEDate"
                  onChange={(v: any) => setFieldValue("TGEDate", v)}
                  value={values.TGEDate}
                  error={errors.TGEDate}
                />
                <Input2
                  label="TGE percent*"
                  placeholder="%"
                  type="number"
                  name="TGEPercentage"
                  onChange={handleChange}
                  value={values.TGEPercentage}
                  error={errors.TGEPercentage}
                />
                <Input2
                  label="Cycle (Days)*"
                  placeholder="Ex. 30"
                  type="number"
                  name="CycleTime"
                  onChange={handleChange}
                  value={values.CycleTime}
                  error={errors.CycleTime}
                />
                <Input2
                  label="Cycle release percent*"
                  placeholder="%"
                  type="number"
                  name="CycleReleasePercent"
                  onChange={handleChange}
                  value={values.CycleReleasePercent}
                  error={errors.CycleReleasePercent}
                />
              </div>
            </>
          )}
          <div className="flex justify-center sm:justify-end items-center mt-2 ">
            <Button
              variant="accent-2"
              className="bg-locker text-black disabled:bg-locker/60"
              disabled={isSubmitting}
              type="submit">
              Lock
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LockerCreateComp;
