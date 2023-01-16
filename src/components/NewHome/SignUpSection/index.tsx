import React from "react";

const SignUpSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center border border-primary-green-border rounded-lg shadow-card-shadow-primary p-6 md:p-8 lg:p-16 gap-8">
      <div className="w-full text-center md:text-start">
        <div className=" text-primary-text text-xl mb-6">
          Never want to miss a sale?
        </div>
        <div className=" text-primary-green text-4xl">
          Sign up for our newsletter and get the latest news and updates.
        </div>
      </div>
      <div className="w-full xl:pl-20">
        <div className="flex flex-col md:flex-row gap-6 items-center border border-primary-green-border rounded-lg py-4 px-2 md:px-8">
          <input
            placeholder="Email Address*"
            type="email"
            className=" border-none outline-none text-primary-green bg-none md:flex-1 bg-transparent "
          />
          <div className=" h-[40px] w-full md:w-[140px] flex justify-center items-center cursur-pointer bg-primary-green rounded-lg ">
            Subscribe
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSection;
