import Modal from "@molecules/Modal";
import React, { Dispatch, SetStateAction, useState } from "react";
import Button from "@atoms/Button";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import { IPoolDetailsData } from "@components/Details";
import { useAccountStats } from "@components/LaunchPad/Details/hooks/useStats";
import { getContract } from "@constants/contractHelper";
import presalePoolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import { parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import { toast } from "react-toastify";

interface Iprops {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  data: IPoolDetailsData;
}

const BuyNowModal = (props: Iprops) => {
  const { showModal, setShowModal, data } = props;
  const { chainId, balance_formatted, balance, account, library } = useAuth();

  const accStats = useAccountStats({ address: data.pool_address });
  const [amount, setAmount] = useState(0);
  const [btndisabled, setBtndisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error_msg, setError_msg] = useState("");

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
    let maxamount = parseFloat(balance);
    if (maxamount < data.min_buy || maxamount > data.max_buy) {
      setError_msg(
        `amount must be between ${data.min_buy} and ${data.max_buy}`
      );
      setBtndisabled(true);
    }
    setAmount(parseFloat(maxamount.toFixed(4).toString()));
  };

  const handleSubmitContribution = async () => {
    setLoading(true);
    if (amount < data.min_buy) {
      toast.error("Minimum buy is not valid");
    } else if (amount > data.max_buy) {
      toast.error("Maximum buy is not valid");
    } else {
      try {
        if (amount > 0 && (data.max_buy > amount || data.min_buy < amount)) {
          if (account) {
            console.log("balance", balance, amount);
            if (chainId) {
              if (parseFloat(balance) >= amount) {
                let poolContract = getContract(
                  presalePoolAbi,
                  data.pool_address,
                  library
                );

                // @ts-ignore
                let tx = await poolContract.contribute({
                  from: account,
                  value: parseEther(String(amount)),
                });
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
                    setShowModal(false);
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
    }
  };

  return (
    <Modal
      isOpen={showModal}
      setIsOpen={setShowModal}
      className="mx-1 md:mx-2.5 p-6 pt-9 w-full max-w-[387px]  bg-white rounded-xl">
      <div className="">
        <h3 className="text-lg font-semibold leading-6 text-gray-900 text-center">
          Participate
        </h3>
        <div className="flex mt-8 justify-between w-full rounded-lg  outline outline-1 outline-gray-300 ">
          <input
            value={amount}
            onChange={handleChangeAmount}
            type="number"
            className="p-3 py-2.5 outline-none pr-0 rounded-lg w-full max-w-[230px]"
          />
          <div className="bg-black px-2 flex items-center rounded-r-lg flex-shrink-0">
            <p
              className="text-white cursor-pointer font-medium uppercase"
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

        <div className="flex justify-center w-full mt-16">
          <Button
            disabled={loading}
            className="w-full sm:w-56"
            onClick={() => {
              handleSubmitContribution();
            }}>
            Buy Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BuyNowModal;
