import Input from "@atoms/Input";
import React from "react";

const LiquidityGeneratorForm = () => {
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
        <Input
          label={`Transaction fee to generate yield (%)`}
          placeholder={"0-100"}
        />
        <Input
          label={`Transaction fee to generate liquidity (%)`}
          placeholder={"0-100"}
        />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Max transaction percent (%)*`} placeholder={"0-100"} />
        <Input label={`Charity address`} placeholder={"Ex: 0x.."} />
      </div>
      <div className="mb-8 flex w-[50%] flex-col md:flex-row gap-8">
        <Input label={`Charity percent (%)*`} placeholder={"0-100"} />
      </div>
    </>
  );
};

export default LiquidityGeneratorForm;
