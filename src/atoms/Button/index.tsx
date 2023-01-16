import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

type IVariant =
  | "outline"
  | "primary"
  | "primary-sm"
  | "success"
  | "cancel"
  | "orange"
  | "primary-xs"
  | "new-black"
  | "new-outline"
  | "accent-1"
  | "accent-2";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode | string;
  type?: "button" | "submit" | "reset";
  variant?: IVariant;
  disabled?: boolean;
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  className,
  children,
  type = "button",
  disabled,
  variant = "primary",
  onClick,
  loading,
  ...rest
}) => {
  const returnBg = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return "bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 rounded-full px-4 sm:px-6 lg:px-16 py-3 min-w-[180px]";
      case "primary-sm":
        return "bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 px-[25px] py-[12px] md:py-[20px]";
      case "primary-xs":
        return "bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 px-3 ";
      case "outline":
        return "bg-white rounded-full border border-gray2 text-gray2 hover:bg-gray2 hover:text-white px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "success":
        return "bg-btn-success text-white rounded-full  hover:bg-btn-success/90 px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "cancel":
        return "bg-white text-red4 border rounded-full  border-red4 hover:bg-gray-100 px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "orange":
        return "bg-theme-orange cursor-pointer text-white outline rounded-full disabled:opacity-70 hover:outline hover:outline-1 hover:outline-theme-orange hover:bg-white hover:text-theme-orange   px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "new-black":
        return "text-xl bg-black rounded-lg text-white px-8 py-4 my-4";
      case "new-outline":
        return "text-xl bg-white border-black border rounded-lg text-black px-8 py-4 my-4";
      case "accent-1":
        return `text-lg sm:text-xl md:px-20 rounded-lg text-primary-green py-3 my-4 w-full md:w-auto`;
      case "accent-2":
        return `text-lg sm:text-xl md:px-20 rounded-lg py-3 my-0 w-full md:w-auto sm:my-4`;
    }
  };

  return (
    <button
      className={`${returnBg(
        variant
      )}  font-normal flex justify-center items-center ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {loading ? (
        <div className="animate-spin inline-flex h-full">
          <AiOutlineLoading className=" font-medium" size={24} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
