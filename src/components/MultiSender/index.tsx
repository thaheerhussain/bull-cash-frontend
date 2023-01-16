import React, { useCallback, useEffect, useMemo } from "react";
import Button from "@atoms/Button";
import CustomCheckbox from "@atoms/CheckBox";
import InfoGrid from "./InfoGrid";
import useTokenInfo from "@hooks/useTokenInfo";
import CSVUploader from "./CSVUploader";
import useAuth from "@hooks/useAuth";
import { ethers } from "ethers";
import erc20abi from "../../ABIs/ERC20/ERC20ABI.json";
import multisenderABI from "../../ABIs/Multisender/multisenderABI.json";
import { toast } from "react-toastify";
import RadioButtonGroup from "@atoms/RadioButtonGroup";
import Image from "next/image";
import BannerImage from "@public/images/multisenderBanner.png";
import TextArea from "@atoms/TextAreaV2";
import CustomSwitch from "@molecules/Switch";
import { contract } from "@constants/constant";

export type detailGrid = {
  title: string;
  value: string;
  showAddress?: true;
  showAddressText?: "View Address";
}[];

export type tokenAddressError = {
  address: string;
  line: number;
  amount: string;
  type?: string;
};

export type addressArray = { address: string; amount: string }[];

const MultiSenderComp = () => {
  const amountMethods = [
    {
      label: "Unlimited amount",
      name: "sale-methods",
    },
    {
      label: "Exact amount",
      name: "sale-methods",
    },
  ];

  const [type, setType] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [CSVData, setCSVData] = React.useState<[]>([]);
  const [manualData, setManualData] = React.useState<string[]>([]);
  const [addressArray, setAddressArray] = React.useState<addressArray>([]);
  const [detailGridData, setDetailGridData] = React.useState<detailGrid>([]);
  const [amountMethod, setAmountMethod] = React.useState("Exact amount");
  // const amountRadioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAmountMethod(event.target.value);
  // };

  const { ethereum, chainId, account } = useAuth();

  const [tokenAddressError, setTokenAddressError] = React.useState<
    tokenAddressError[]
  >([]);
  const [tokenAddressDuplicateError, setTokenAddressDuplicateError] =
    React.useState<tokenAddressError[]>([]);

  const csvFormater = useCallback(() => {
    if (CSVData) {
      const array: any = [];
      CSVData.forEach((data: any, index) => {
        //if (ethers.utils.isAddress(data[0]) && parseFloat(data[1]) > 0) {
        array.push({ address: data[0].trim(), amount: data[1].trim() });
        //}
      });
      setAddressArray(array);
      getAddressError();
      getAddressDuplicateError();
    }
  }, [CSVData]);

  const manualFormater = useCallback(() => {
    if (manualData) {
      const array: any = [];
      manualData.forEach((data: any, index) => {
        const upgradeArray = data.split(",");
        if (
          ethers.utils.isAddress(upgradeArray[0]) &&
          parseFloat(upgradeArray[1]) > 0
        ) {
          array.push({
            address: upgradeArray[0].trim(),
            amount: upgradeArray[1]?.trim(),
          });
        }
      });
      setAddressArray(array);
      console.log(array);
    }
  }, [manualData]);

  const textSample = useMemo(() => {
    let array: any = [];
    if (addressArray) {
      addressArray.forEach((item) => {
        array.push(`${item.address},${item.amount}`);
      });
      let joined = array.join("\n");
      return array;
    } else return [];
  }, [addressArray]);

  console.log("manualData", manualData);

  useEffect(() => {
    if (textSample.length > 0 && type) {
      setManualData(textSample);
      setType(false);
    }
  }, [textSample]);

  const handleTypeChange = () => {
    if (type) {
      setType(false);
    } else {
      setAddressArray([]);
      setType(true);
    }
  };

  useEffect(() => {
    if (type) {
      csvFormater();
    } else {
      manualFormater();
    }
  }, [manualData, CSVData]);

  const {
    address,
    tokenName,
    fetchTokenError,
    tokenSymbol,
    totalSupply,
    decimals,
    tokenBalance,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({ tokenAddress: tokenAddress, ethereum });

  useEffect(() => {
    if (tokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [tokenAddress]);

  const totalAmmount = useMemo(() => {
    let count = 0;
    addressArray.forEach((address) => {
      count += parseFloat(address.amount);
    });
    return count;
  }, [addressArray]);

  useEffect(() => {
    if (addressArray) {
      setDetailGridData([
        {
          title: "Total Address",
          value: addressArray.length.toString(),
          showAddress: true,
          showAddressText: "View Address",
        },
        { title: "Total amount to send", value: totalAmmount.toString() },
        { title: "No. of transaction", value: addressArray.length.toString() },
        {
          title: "Your token balance",
          value: (
            parseFloat(tokenBalance) /
            10 ** parseFloat(decimals)
          ).toString(),
        },
        { title: "Token Name", value: tokenName },
        { title: "Token Symbol", value: tokenSymbol },
      ]);
    }
  }, [addressArray, tokenBalance, tokenName]);

  const getManualDataArr = () => {
    const array: any = [];
    manualData.forEach((data: any, index) => {
      const upgradeArray = data.split(",");
      array.push({ address: upgradeArray[0], amount: upgradeArray[1] });
    });
    return array;
  };

  const getAddressError = () => {
    const newAddressArray: addressArray = getManualDataArr();
    if (newAddressArray.length > 0) {
      const tokenAddressErrorArr: tokenAddressError[] = [];
      const tokenAddressArr = newAddressArray.filter((item, index) => {
        if (!ethers.utils.isAddress(item.address)) {
          const errorObj = {
            line: index + 1,
            address: item.address,
            amount: item.amount,
            type: "address",
          };
          tokenAddressErrorArr.push(errorObj);
        } else if (isNaN(Number(item.amount))) {
          const errorObj = {
            line: index + 1,
            address: item.address,
            amount: item.amount,
            type: "amount",
          };
          tokenAddressErrorArr.push(errorObj);
        }
      });
      return setTokenAddressError(tokenAddressErrorArr);
    }
  };

  const getAddressDuplicateError = () => {
    if (addressArray.length > 0) {
      const tokenAddressDuplicateErrorArr: tokenAddressError[] = [];
      const uniqueIds = new Set();
      const unique = addressArray.filter((element, index) => {
        const isDuplicate = uniqueIds.has(element.address);
        uniqueIds.add(element.address);
        if (isDuplicate) {
          tokenAddressDuplicateErrorArr.push({ ...element, line: index + 1 });
        }
        return false;
      });
      setTokenAddressDuplicateError(tokenAddressDuplicateErrorArr);
    }
  };

  useEffect(() => {
    getAddressError();
  }, [addressArray]);

  useEffect(() => {
    getAddressDuplicateError();
  }, [manualData, addressArray]);

  const showDetailHandler = () => {
    if (addressArray && tokenAddress && !fetchTokenError) {
      setShowDetail(true);
    }
  };
  console.log("AM", amountMethod);

  const deleteErrorToken = () => {
    const newTokenErrorAdd =
      tokenAddressError &&
      tokenAddressError.map((item) => `${item.address},${item.amount}`);
    if (newTokenErrorAdd) {
      const myArray = manualData.filter((el) => !newTokenErrorAdd.includes(el));
      setManualData(myArray);
      setTokenAddressError([]);
    }
  };

  const ignoreDuplicateError = () => {
    setTokenAddressDuplicateError([]);
  };

  const duplicateCombineBalance = () => {
    let totalAddAmount: number = 0;
    const totalWalletAmount = addressArray.map((item) => {
      totalAddAmount = totalAddAmount + Number(item.amount);
    });
    const upgradeArray = manualData[0].split(",");
    upgradeArray[1] = totalAddAmount.toString();
    setManualData([upgradeArray.join(",")]);
  };

  const duplicateKeepOneLine = () => {
    setManualData([manualData[0]]);
  };

  console.log("amountMethod", amountMethod);

  const unlimitedAmmount: string = "2 ** 256 - 1";

  return (
    <>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#C6CED6]">
        <h1 className="text-black font-fonde text-4xl md:text-5xl lg:text-7xl font-normal">
          Multisender
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
        {/* <Image src={BannerImage} /> */}
      </div>
      <div className="mx-auto container mt-[36px]">
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl p-6">
          <div className="">
            <div className="my-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-10">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text3">
                    Token address*
                  </h3>
                  <div className="flex border border-[#CBD5E1] px-4 rounded-[69px] shadow-sm my-4 mt-2">
                    <input
                      type="text"
                      className="text-base overflow-hidden w-full outline-none"
                      placeholder="Enter token or LP token address"
                      onChange={(e) => setTokenAddress(e.target.value)}
                    />
                  </div>
                </div>
                <div className="">
                  <h3 className="text-base font-semibold text-text3">
                    Decimals
                  </h3>
                  <div className="border border-[#CBD5E1] rounded-[50px] my-4 mt-2 h-[52px] w-[100px] flex justify-center items-center">
                    {decimals}
                  </div>
                </div>
              </div>
              <div className="text-text3 text-xs">
                Multi-sender allows you to send ERC20 token in batch by easiest
                way. You can enter token address to send specific token or leave
                it blank to send chain token such as BNB....
              </div>
              {fetchTokenError && (
                <div className="text-sm text-red-text4 font-normal">
                  {fetchTokenError}
                </div>
              )}
            </div>
            <div className="mb-6">
              <div className="flex items-center justify-between my-3">
                <p className="text-base font-semibold text-text3">
                  Allocations
                </p>
                <div
                  className="text-sm font-medium cursor-pointer text-text3"
                  onClick={handleTypeChange}>
                  {type ? "Insert Manually" : "Upload CSV"}
                </div>
              </div>
              {type ? (
                <CSVUploader setCSVData={setCSVData} />
              ) : (
                <TextArea
                  value={manualData.join("\n")}
                  onChange={(e) => setManualData(e.target.value.split(/\r?\n/))}
                  placeholder="Insert Allocation: separate with breaks line. By format: address,amount or address amount"
                />
              )}
              <div className="text-red-text2 text-sm mt-3">
                {type ? "Sample CSV file" : "Recipients allocation is required"}
              </div>
            </div>
            {tokenAddressError &&
              tokenAddressError.length > 0 &&
              addressArray.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-red-500">
                    The below addresses cannot be processed{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={deleteErrorToken}>
                      Delete them
                    </span>
                  </div>
                  <div className="border bg-white p-5 mt-3">
                    <ul className="text-xs">
                      {tokenAddressError.map((item, index) => {
                        return (
                          <li className="text-red-500" key={index}>
                            Line {item.line}:{" "}
                            {item.type === "address"
                              ? `${item.address} is a invalid wallet address`
                              : `${item.amount} is a invalid wallet amount`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            {tokenAddressDuplicateError &&
              tokenAddressDuplicateError.length > 0 &&
              tokenAddressError?.length === 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-red-500">
                    Duplicated addresses
                    <div>
                      <span
                        className="underline cursor-pointer mr-4"
                        onClick={duplicateKeepOneLine}>
                        Keep the first one
                      </span>
                      <span
                        className="underline cursor-pointer mr-4"
                        onClick={duplicateCombineBalance}>
                        Combine balances
                      </span>
                      <span
                        className="underline cursor-pointer"
                        onClick={ignoreDuplicateError}>
                        Ignore
                      </span>
                    </div>
                  </div>
                  <div className="border bg-white p-5 mt-3">
                    <ul className="text-xs">
                      {tokenAddressDuplicateError.map((item, index) => {
                        return (
                          <li className="text-red-500" key={index}>
                            Line {item.line}: duplicate address {item.address}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
            <div className="mb-10 md:w-1/2 lg:w-1/3">
              <CustomSwitch
                backGroundClass="bg-[#C6CED6] !text-black"
                label="Amount to Approve"
                options={["Exact amount", "Unlimited amount"]}
                selectedOption={amountMethod}
                setSelectedOption={setAmountMethod}
              />
            </div>
            <div className="mb-6 flex justify-center sm:justify-end">
              {tokenAddressError.length === 0 &&
              tokenAddressDuplicateError.length === 0 ? (
                <Button
                  onClick={showDetailHandler}
                  variant="accent-2"
                  className="bg-[#C6CED6] text-black">
                  Next
                </Button>
              ) : (
                <Button
                  disabled
                  onClick={showDetailHandler}
                  variant="accent-2"
                  className="bg-[#C6CED6] text-black opacity-50">
                  Next
                </Button>
              )}
            </div>
            {showDetail && addressArray && (
              <>
                <div className="w-full">
                  <div className="text-xl font-semibold">Confirm Details</div>
                  <InfoGrid
                    gridData={detailGridData}
                    addressData={addressArray}
                  />
                </div>
                <div className="mt-10 flex justify-center sm:justify-end">
                  <Button
                    variant="accent-2"
                    className="bg-[#C6CED6] text-black"
                    loading={loading}
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        setLoading(true);
                        if (ethereum) {
                          const provider = new ethers.providers.Web3Provider(
                            ethereum
                          );
                          const signer = provider.getSigner();
                          const erc20 = new ethers.Contract(
                            tokenAddress,
                            erc20abi,
                            signer
                          );
                          const multisenderAddress =
                            contract[chainId || "default"].multiSenderAddress;
                          const allowance = await erc20.allowance(
                            account,
                            multisenderAddress
                          );
                          const amount = (
                            totalAmmount *
                            10 ** parseFloat(decimals)
                          ).toString();
                          if (allowance.lt(amount)) {
                            const approved = await erc20.approve(
                              multisenderAddress,
                              amountMethod == "Exact amount"
                                ? (
                                    totalAmmount *
                                    10 ** parseFloat(decimals)
                                  ).toString()
                                : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                            );
                            await approved.wait();
                          }
                          const multiSender = new ethers.Contract(
                            multisenderAddress,
                            multisenderABI,
                            signer
                          );

                          await multiSender.multiSend(
                            tokenAddress,
                            addressArray.map((e) => e.address),
                            addressArray.map((e) =>
                              (
                                parseFloat(e.amount) *
                                10 ** parseFloat(decimals)
                              ).toString()
                            ),
                            {
                              value: "300000000000000",
                            }
                          );
                          toast.success("Transfer Successfull");
                          setLoading(false);
                        }
                      } catch (err) {
                        setLoading(false);
                        toast.error("Something Went Wrong");
                        console.error("ERROR", err);
                      }
                    }}>
                    Confirm
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiSenderComp;
