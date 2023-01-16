import React from "react";
import { IconType } from "react-icons/lib";

type IVariant = "primary" | "icon" | "title" | "icon-type2" | "bright";
interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  variant?: IVariant;
  Icon?: IconType;
  error?: any;
  titleText?: string;
}

const Input2: React.FC<IInputProps> = ({
  label,
  className,
  type,
  placeholder,
  variant = "primary",
  error,
  Icon,
  titleText,
  ...rest
}) => {
  const returnVariant = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return "";
      case "title":
      case "icon":
        return "flex items-center border rounded-[50px] overflow-hidden";
    }
  };

  const returnInputClass = () => {
    switch (variant) {
      case "primary":
        return "border border-dull-green rounded-lg bg-secondary-dark px-4 py-3 placeholder:text-white text-white";
      case "bright":
        return "border border-primary-green bg-secondary-green rounded-lg px-4 py-3 placeholder:text-primary-green text-primary-green";
      case "title":
        return "flex-1 px-4 py-3 border-r";
      case "icon":
        return "flex-1 px-4 py-3 border-l";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* {(variant === "icon" || variant === "title") && label ? (
        <label
          htmlFor={label}
          className={`block text-base font-semibold text-[#64748B] mb-3`}>
          {label}
        </label>
      ) : null} */}
      <div className={`${returnVariant(variant)}`}>
        {/* {variant === "primary" && label && (
          <label
            htmlFor={label}
            className={`block text-base font-semibold text-[#64748B] mb-3`}>
            {label}
          </label>
        )} */}
        {variant === "icon" && Icon && (
          <div className="flex items-center justify-center h-full w-12 ">
            <Icon size={24} color="#CBD5E1" className="flex-shrink-0" />
          </div>
        )}
        <input
          type={type}
          id={label}
          placeholder={placeholder}
          {...rest}
          className={`text-base font-normal disabled:bg-slate-100 disabled:bg-opacity-40 block w-full outline-none ${returnInputClass()}`}
        />
        {variant === "title" && (
          <p className="hidden sm:block w-max px-3 sm:px-4 text-xs sm:text-sm font-semibold capitalize">{`-${titleText}`}</p>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input2;
