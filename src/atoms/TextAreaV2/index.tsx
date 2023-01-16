import React from "react";

interface ITextArea extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  className?: string;
  textAreaHeight?: string;
  error?: any;
}

const TextArea: React.FC<ITextArea> = ({
  label,
  className,
  textAreaHeight,
  error,
  ...rest
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={label}
          className={`block capitalize text-base font-semibold text-white mb-3`}>
          {label}
        </label>
      )}
      <div className={`flex flex-col  ${className}`}>
        <textarea
          id={label}
          {...rest}
          className={`${textAreaHeight} placeholder:text-secondary-green text-secondary-green min-h-[150px] border border-primary-green p-4 rounded-lg outline-none`}></textarea>
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </>
  );
};

export default TextArea;
