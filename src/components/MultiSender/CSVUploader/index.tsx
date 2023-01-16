import React, { useState } from "react";
import { useCSVReader, formatFileSize } from "react-papaparse";
import UploadIcon from "@public/icons/svgs/UploadIcon.svg";
import Image from "next/image";

interface Iprops {
  setCSVData: any;
}

const CSVUploader = (props: Iprops) => {
  const { setCSVData } = props;
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        setCSVData(results.data);
      }}>
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove,
      }: any) => (
        <>
          <div
            className={`h-[150px] p-4 w-full flex justify-center items-center rounded-xl border border-[#CBD5E1] ${
              !acceptedFile ? "cursor-pointer" : ""
            }`}
            {...getRootProps()}>
            {acceptedFile ? (
              <>
                <div className="w-full md:w-9/12 lg:w-1/2 flex flex-col items-center text-text3">
                  <div className="text-base font-medium">
                    <span className="mr-2.5">
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span>{acceptedFile.name}</span>
                  </div>
                  <div
                    className="my-5 cursor-pointer "
                    {...getRemoveFileProps()}
                    onMouseOver={(event: Event) => {
                      event.preventDefault();
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault();
                    }}>
                    <Remove />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="w-fit mx-auto">
                  <Image src={UploadIcon} />
                </div>
                <div className="font-semibold text-sm">
                  Drop CSV file here or click to upload
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
};

export default CSVUploader;
