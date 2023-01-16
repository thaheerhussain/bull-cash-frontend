import Input from "@atoms/Input";
import React from "react";

const StandardTokenForm = () => {
  return (
    <>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Name*`} placeholder={"Ex: Ethereum"} />
        <Input label={`Symbol*`} placeholder={"Ex: ETH"} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Decimals*`} placeholder={"Ex: 20"} />
        <Input label={`Total supply*`} placeholder={"Ex: 200000"} />
      </div>
    </>
  );
};

export default StandardTokenForm;
