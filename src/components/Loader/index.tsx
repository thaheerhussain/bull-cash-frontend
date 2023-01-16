import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className={`flex justify-center items-center  ${className} my-10`}>
      <BiLoaderAlt className="h-12 w-12 animate-spin text-black" />
    </div>
  );
};

export default Loader;
