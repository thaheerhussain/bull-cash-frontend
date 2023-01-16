import React from "react";
import { useRouter } from "next/router";

interface IData {
  title: string;
  subtitle: string;
  amount: string;
  href: string;
}

interface ITableProps {
  tableHead: string[];
  data: IData[];
}

const CustomTable = (props: ITableProps) => {
  const router = useRouter();

  const onView = (href: string) => {
    router.push(`/locker/${href}`);
  };

  const { tableHead, data } = props;
  return (
    <div className="overflow-x-auto">
      <table className="table-zebra w-full">
        <thead className="border-b border-bordergraydark">
          <tr>
            {tableHead.map((head, index) => {
              return (
                <th
                  key={index}
                  className={`${
                    index < 2 ? "text-left" : ""
                  } bg-white text-lg font-medium w-3/12 p-4`}>
                  {head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((singleData, index) => {
            return (
              <tr
                key={index}
                className="hover border-b border-bordergraylight ">
                <td className="text-base font-medium text-left p-4">
                  {index + 1}
                </td>
                <td className="text-base font-medium text-left p-4">
                  <div className="text-base font-bold min-w-max ">
                    {singleData.title}
                  </div>
                  {singleData.subtitle && (
                    <div className="text-gray3">{singleData.subtitle}</div>
                  )}
                </td>
                <td className="text-base font-medium text-start md:text-center p-4">
                  {singleData.amount}
                </td>
                <td className="text-center">
                  <div
                    onClick={() => onView(singleData.href)}
                    className="bg-[#141414] px-4 py-3 inline-flex text-white rounded-[40px] mx-auto cursor-pointer">
                    View
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
