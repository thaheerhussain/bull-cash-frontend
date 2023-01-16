import Button from "@atoms/Button";
import RadioButtonGroup from "@atoms/RadioButtonGroup";
import React, { useEffect, useState } from "react";
import AddUserPopUp from "../AddUserPopUp";
import RemoveUserModal from "../RemoveUserModal";
import useAuth from "@hooks/useAuth";
import { getContract } from "@constants/contractHelper";
import poolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import privateAbi from "../../../ABIs/PrivatePool/PrivatePool.json";
import airdropAbi from "../../../ABIs/AirdropMaster/AirdropMaster.json";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { isValidAddress } from "@walletconnect/utils";
import { DetailsType, IPoolDetailsData } from "@components/Details";
import SetAllocationModal from "@components/CreateAirDrop/setAllocationModal";
import { IAllocationDetail } from "@components/Details/Allocations";
import { parseUnits } from "@ethersproject/units";
import moment from "moment";
import { contract } from "@constants/constant";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import { parseEther } from "ethers/lib/utils";
import { ICreateAirdropFormData } from "@components/CreateAirDrop";
import { useRouter } from "next/router";
import SetTime from "@components/Details/SetTime";

const saleMethods = [
  {
    label: "Public",
    name: "sale-methods",
  },
  {
    label: "Whitelist",
    name: "sale-methods",
  },
];

const Actions = ({
  data,
  type,
}: {
  data: IPoolDetailsData;
  type: DetailsType;
}) => {
  const { reload } = useRouter();
  const { account, chainId, library } = useAuth();
  const [showTime, setShowTime] = useState(false);
  const [addUser, setaddUser] = useState(false);
  const [waddloading, setWaddloading] = useState(false);
  const [finalizeLoading, setFinalLoading] = useState(false);
  const [wcLoading, setWcLoading] = useState(false);
  const [claimLoading, setCtLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [allocationsData, setAllocationsData] = useState<IAllocationDetail[]>(
    []
  );
  const [whitelistedUsers, setWhitelistedUsers] = useState("");
  const [tire, setTire] = useState("1");
  const [showRemoveUser, setShowRemoveUser] = useState(false);

  const setModal = () => {
    setaddUser(true);
  };
  const closeModal = () => {
    return setaddUser(false);
  };
  const [saleMethod, setSaleMethod] = useState<string>(data.sale_type);
  const saleRadioHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmed = confirm(
      "You are about to change the Sale Access, Are you sure?"
    );
    if (confirmed) {
      if (event.target.value != data.sale_type)
        await handleWhitelistStatus(event.target.value);
    }
  };

  useEffect(() => {
    setSaleMethod(data.sale_type);
  }, [data.sale_type]);

  const handleWhitelistStatus = async (_saleMethod: string) => {
    try {
      if (account && chainId) {
        if (chainId) {
          let whitelist_status = _saleMethod === "Whitelist";

          let poolContract = getContract(poolAbi, data.pool_address, library);

          let tx;
          if (whitelist_status) {
            // @ts-ignore
            tx = await poolContract.changeWhitelist(whitelist_status, {
              from: account,
            });
          } else {
            // @ts-ignore
            tx = await poolContract.startPublicSaleNow({
              from: account,
            });
          }
          await toast.promise(tx.wait, {
            pending: "Waiting for confirmation 👌",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("success ! your last transaction is success 👍");
              setSaleMethod(_saleMethod);
              reload();
            } else if (!response.status) {
              toast.error("error ! Your last transaction is failed.");
            } else {
              toast.error("error ! something went wrong.");
            }
          }
        } else {
          toast.error("Please select Smart Chain Network !");
        }
      } else {
        toast.error("Please Connect Wallet!");
      }
    } catch (err: any) {
      toast.error(err.reason);
    }
  };

  const handleApprove = async ({
    data,
    allocations,
  }: {
    allocations?: IAllocationDetail[];
    data: IPoolDetailsData;
  }): Promise<boolean> => {
    let success = false;
    if (account) {
      if (chainId) {
        try {
          const decimals = data.token.decimals;
          if (data.token.address && decimals > 0) {
            let poolfactoryAddress = data.pool_address;
            let tokenContract = getContract(
              tokenAbi,
              data.token.address,
              library
            );

            let amount = parseEther("1000000000000000000000000000").toString();
            // @ts-ignore
            const allowance = await tokenContract.allowance(
              account,
              poolfactoryAddress
            );
            if (allowance.gte(amount)) return true;
            // @ts-ignore
            let tx = await tokenContract.approve(poolfactoryAddress, amount, {
              from: account,
            });
            await toast.promise(tx.wait, {
              pending: "Waiting for confirmation 👌",
            });
            let web3 = getWeb3(chainId);
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              if (response.status) {
                success = true;
                toast.success("success ! your last transaction is success 👍");
              } else if (!response.status) {
                toast.error("error ! Your last transaction is failed.");
              } else {
                toast.error("error ! something went wrong.");
              }
            }
          } else {
            toast.error("Please enter valid token address !");
          }
        } catch (err: any) {
          toast.error(err.reason);
        }
      } else {
        toast.error("Please select Smart Chain Network !");
      }
    } else {
      toast.error("Please Connect Wallet!");
    }
    return success;
  };

  const handleSetWhitelist = async ({
    allocations,
  }: {
    allocations?: IAllocationDetail[];
  }) => {
    setWaddloading(true);
    try {
      let waddress = [];
      if (allocations) {
        waddress = allocations;
      } else {
        waddress = whitelistedUsers
          .split(/\r?\n/)
          .filter((address) => isValidAddress(address));
      }
      if (waddress.length > 0) {
        if (account && chainId) {
          let poolContract = getContract(
            allocations
              ? airdropAbi
              : type == "launchpad"
              ? poolAbi
              : privateAbi,
            data.pool_address,
            library
          );

          let tx;
          if (allocations && allocations.length > 0) {
            const success = await handleApprove({ data, allocations });
            if (!success) {
              toast.error("Failed to check allowance");
              setWaddloading(false);
              return;
            }
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(
              allocations.map((v) => v.address),
              allocations.map((v) => parseUnits(v.amount, data.token.decimals)),
              {
                from: account,
              }
            );
          } else {
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(waddress, tire, {
              from: account,
            });
          }

          await toast.promise(tx.wait, {
            pending: "Waiting for confirmation 👌",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("success ! your last transaction is success 👍");
              reload();
              setWaddloading(false);
            } else if (!response.status) {
              toast.error("error ! Your last transaction is failed.");
              setWaddloading(false);
            } else {
              toast.error("error ! something went wrong.");
              setWaddloading(false);
            }
          } else {
          }
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
      setWaddloading(false);
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };

  const handleRemoveWhitelist = async () => {
    setWaddloading(true);
    try {
      const waddress = whitelistedUsers
        .split(/\r?\n/)
        .filter((address) => isValidAddress(address));
      if (waddress.length > 0) {
        if (account && chainId) {
          let poolContract = getContract(poolAbi, data.pool_address, library);

          // @ts-ignore
          let tx = await poolContract.removeWhitelistedUsers(waddress, {
            from: account,
          });

          await toast.promise(tx.wait, {
            pending: "Waiting for confirmation 👌",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("success ! your last transaction is success 👍");
              setWaddloading(false);
              reload();
            } else if (!response.status) {
              toast.error("error ! Your last transaction is failed.");
              setWaddloading(false);
            } else {
              toast.error("error ! something went wrong.");
              setWaddloading(false);
            }
          }
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
      setWaddloading(false);
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };

  const handleFinalize = async () => {
    setFinalLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.finalize({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Waiting for confirmation",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("success ! your last transaction is success");
            setFinalLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("error ! Your last transaction is failed.");
            setFinalLoading(false);
          } else {
            toast.error("error ! something went wrong.");
            setFinalLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setFinalLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setFinalLoading(false);
    }
  };

  const handleWithdrawContribution = async () => {
    setWcLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.withdrawContribution({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Waiting for confirmation",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("success ! your last transaction is success");
            setWcLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("error ! Your last transaction is failed.");
            setWcLoading(false);
          } else {
            toast.error("error ! something went wrong.");
            setWcLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setWcLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWcLoading(false);
    }
  };

  const handleClaimToken = async () => {
    setCtLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.claim({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Waiting for confirmation",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("success ! your last transaction is success");
            setCtLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("error ! Your last transaction is failed.");
            setCtLoading(false);
          } else {
            toast.error("error ! something went wrong.");
            setCtLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCtLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCtLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.cancel({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Waiting for confirmation",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("success ! your last transaction is success");
            setCancelLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("error ! Your last transaction is failed.");
            setCancelLoading(false);
          } else {
            toast.error("error ! something went wrong.");
            setCancelLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCancelLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCancelLoading(false);
    }
  };

  return (
    <>
      {["launchpad", "fairlaunch", "privatesale"].includes(type) && (
        <div className="mb-8 shadow-boxShadow6 rounded-2xl pb-6 border">
          <p className="border-b-2 text-xl font-medium mb-8 pb-1 p-4">
            Pool Action
          </p>
          <div className="flex flex-col gap-4 mx-4">
            {(data.poolState === "0" &&
              moment
                .unix(parseFloat(String(data.end_time)))
                .isBefore(moment()) &&
              parseFloat(String(data.total_sold)) <
                parseFloat(String(data.soft_cap))) ||
            (String(data.poolState) == "2" &&
              (data.myContribution || 0) > 0) ? (
              <Button
                onClick={() => {
                  handleWithdrawContribution();
                }}
                disabled={wcLoading}
                loading={wcLoading}
                variant="orange">
                Withdraw Contribution
              </Button>
            ) : data.poolState === "1" &&
              (data.myClaim || data.myContribution || 0) > 0 ? (
              <Button
                onClick={() => {
                  handleClaimToken();
                }}
                disabled={claimLoading}
                loading={claimLoading}
                variant="success">
                Claim Token
              </Button>
            ) : (
              <p>No pool actions to show </p>
            )}
          </div>
        </div>
      )}
      {["airdrop"].includes(type) && (
        <div className="mb-8 shadow-boxShadow6 rounded-2xl pb-6 border">
          <p className="border-b-2 text-xl font-medium mb-8 pb-1 p-4">
            Pool Action
          </p>
          <div className="flex flex-col gap-4 mx-4">
            {(data?.myClaim || 0) > 0 ? (
              <Button
                onClick={() => {
                  handleClaimToken();
                }}
                disabled={claimLoading}
                loading={claimLoading}
                variant="success">
                Claim Token
              </Button>
            ) : (
              <p>No pool actions to show </p>
            )}
          </div>
        </div>
      )}
      {["launchpad", "fairlaunch", "privatesale"].includes(type) &&
        account === data.poolOwner && (
          <div className="shadow-boxShadow6 rounded-2xl pb-6 border">
            <p className="border-b-2 text-xl font-medium mb-6 pb-1 p-4">
              Owner zone
            </p>
            <div className="mx-4">
              {type !== "fairlaunch" && (
                <>
                  <RadioButtonGroup
                    label={"Sale Method"}
                    options={saleMethods}
                    onChange={saleRadioHandler}
                    className="mb-10 "
                    labelAlign="row"
                    selected={saleMethod.toString()}
                  />
                  <div className="flex flex-col gap-4 mb-4">
                    <Button variant="orange" onClick={setModal}>
                      Add users to whitelist
                    </Button>
                    <Button
                      onClick={() => setShowRemoveUser((prev) => !prev)}
                      variant="outline">
                      Delete users from whitelist
                    </Button>
                  </div>
                </>
              )}
              <div className="flex flex-col gap-4">
                <Button
                  variant="orange"
                  onClick={handleFinalize}
                  loading={finalizeLoading}
                  disabled={finalizeLoading}>
                  Finalize
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  loading={cancelLoading}
                  variant="outline">
                  Cancel Pool
                </Button>
                {/*<Button>Setting time to public</Button>*/}
                {/*<Button variant="orange">Disable whitelist</Button>*/}
              </div>
            </div>
          </div>
        )}
      {/* {["launchpad"].includes(type) && ( */}
      {["airdrop"].includes(type) && account === data.poolOwner && (
        <div className="shadow-boxShadow6 rounded-2xl pb-4 border">
          <p className="border-b-2 text-xl font-medium mb-6 pb-1 p-4">
            Owner zone
          </p>
          <div className="flex flex-col gap-4 mx-4">
            <Button onClick={setModal}>Set Allocations</Button>
            <Button
              onClick={() => setShowRemoveUser((prev) => !prev)}
              variant="orange">
              Delete users from whitelist
            </Button>
            <Button
              onClick={() => {
                handleCancel();
              }}
              disabled={cancelLoading}
              loading={cancelLoading}
              variant="cancel">
              Cancel
            </Button>
            {/*<Button>Setting time to public</Button>*/}
            {/*<Button variant="orange">Disable whitelist</Button>*/}
          </div>
        </div>
      )}
      {addUser && ["launchpad", "privatesale"].includes(type) && (
        <AddUserPopUp
          users={whitelistedUsers}
          setUsers={setWhitelistedUsers}
          setTire={setTire}
          tire={tire}
          handleSubmit={() => handleSetWhitelist({})}
          showModal={addUser}
          setShowModal={closeModal}
          loading={waddloading}
        />
      )}
      {addUser && ["airdrop"].includes(type) && (
        <SetAllocationModal
          showModal={addUser}
          setShowModal={closeModal}
          setAllocations={(AllocationsData: IAllocationDetail[]) =>
            handleSetWhitelist({ allocations: AllocationsData })
          }
          loading={waddloading}
        />
      )}

      {showRemoveUser && (
        <RemoveUserModal
          users={whitelistedUsers}
          handleSubmit={handleRemoveWhitelist}
          setUsers={setWhitelistedUsers}
          showModal={showRemoveUser}
          setShowModal={setShowRemoveUser}
          loading={waddloading}
        />
      )}

      {/*{showTime && (*/}
      {/*  <SetTime*/}
      {/*    type={type}*/}
      {/*    handleSubmit={handleWhitelistStatus}*/}
      {/*    showModal={showTime}*/}
      {/*    setShowModal={setShowTime}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default Actions;
