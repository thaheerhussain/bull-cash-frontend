import Input from "@atoms/Input";
import React from "react";

const BabyTokenForm = () => {
  return (
    <>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Name*`} placeholder={"Baby token test"} />
        <Input label={`Symbol*`} placeholder={"Ex: BTT"} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Router*`} placeholder={"Ex: Pancakeswap"} />
        <Input label={`Total supply*`} placeholder={"Ex: 10000000"} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Reward token*`} placeholder={"Ex: 0x"} />
        <div className="w-full">
          <Input
            label={`Minimum token balance for dividends*`}
            placeholder={"Ex: 10000000"}
          />
          <p className="text-xs text-blue1 font-normal mt-2">
            Min hold each wallet must be over $50 to receive rewards.
          </p>
        </div>
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Token reward fee (%)*`} placeholder={"0-100"} />
        <Input label={`Auto add liquidity (%)*`} placeholder={"0-100"} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Marketing fee (%)*`} placeholder={"0-100"} />
        <Input label={`Marketing wallet*`} placeholder={"Ex: 0x.."} />
      </div>
    </>
  );
};

export default BabyTokenForm;
