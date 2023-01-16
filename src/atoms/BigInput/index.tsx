import React from "react";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  error?: any;
}

const BigInput: React.FC<IInputProps> = (props) => {
  const { className, error, label, placeholder, ...rest } = props;
  return (
    <div className="w-full">
      <div className="font-medium text-4xl">{label}</div>
      <div className="my-4 w-full md:w-9/12 h-[62px] border border-[#E8E8E8] rounded-2xl p-2.5 flex items-center">
        <input
          placeholder={placeholder}
          className={`flex-1 h-[80%] outline-none border-none ${className}`}
          type="text"
          {...rest}
        />
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </div>
  );
};

export default BigInput;
