import React, { useMemo } from "react";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import { trimAddress } from "@constants/constant";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
import { useRouter } from "next/router";
import Button from "@atoms/Button";
import { IPoolDetailsData } from "@components/Details";
import dynamic from "next/dynamic";
import { TIME_FORMAT } from "@constants/timeFormats";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ILockerInfo {
  tokenAddress?: string;
  token: IPoolDetailsData["token"];
  liquidity?: IPoolDetailsData["liquidity"];
  hard_cap?: IPoolDetailsData["hard_cap"];
  fees?: IPoolDetailsData["fees"];
}

const tableHeader = [
  "Wallet",
  "Amount",
  "Cycle(d)",
  "Cycle Release(%)",
  "TGE(%)",
  "Unlock time(UTC)",
];

const LockerInfo: React.FC<ILockerInfo> = ({
  tokenAddress,
  token,
  liquidity,
  hard_cap,
  fees,
}) => {
  const lockerStats = useDetailsStats({
    address: tokenAddress,
  });

  const labels = useMemo(() => {
    const data = ["Total Supply"];
    if (liquidity && hard_cap && fees) data.push("Liquidity");
    lockerStats.lockdata.forEach((l) => {
      data.push(l.description);
    });
    return data;
  }, [fees, hard_cap, liquidity, lockerStats.lockdata]);

  const series = useMemo(() => {
    const data: number[] = [];
    if (liquidity && hard_cap && fees) {
      const liquidityTokens = parseFloat(
        (
          (hard_cap *
            liquidity.liquidityListingRate *
            liquidity.liquidityPercent) /
          100
        ).toFixed(2)
      );
      data.push(liquidityTokens);
    }
    lockerStats.lockdata.forEach((l) => {
      data.push(
        parseFloat((Number(l.amount) / 10 ** token.decimals).toFixed(2))
      );
    });
    const supply = parseFloat(
      (
        token.supply - (data.length > 0 ? data?.reduce((p, c) => p + c) : 0)
      ).toFixed(2)
    );
    return [supply].concat(data);
  }, [
    fees,
    hard_cap,
    liquidity,
    lockerStats.lockdata,
    token.decimals,
    token?.supply,
  ]);

  const router = useRouter();

  const onViewHandler = (address: string) => {
    router.push(`/locker/unlock-token/${address}`);
  };

  if (lockerStats.lockdata.length === 0) {
    return <></>;
  }

  return (
    <div>
      {series?.length > 1 && (
        <div className={`shadow-boxShadow1  p-4 rounded-2xl border mt-8`}>
          <p className="border-b text-xl font-medium mb-2 pb-1">
            Token Metrics
          </p>
          <div className="overflow-x-scroll my-6">
            <ReactApexChart
              options={{
                labels: labels,
              }}
              series={series}
              type="donut"
              width={"100%"}
            />
          </div>
        </div>
      )}

      {lockerStats.lockdata.length > 0 && (
        <div className={`shadow-boxShadow6 rounded-2xl border mt-8 pb-4`}>
          <p className="border-b text-xl font-medium mb-2 pb-1 p-4">
            Lock Records
          </p>
          <div className="overflow-x-scroll mx-4">
            <table className="table-auto">
              <thead className="border-b">
                <tr>
                  {tableHeader.map((head, index) => {
                    return (
                      <th
                        key={index}
                        className="bg-white capitalize text-sm font-semibold min-w-max whitespace-nowrap first:pr-20 pr-6 text-left  py-2">
                        {head}
                      </th>
                    );
                  })}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lockerStats.lockdata.map((singleData, index) => {
                  return (
                    <tr
                      key={index}
                      className="border-b last:border-b-0 text-text1 even:bg-[#F1F5F9]">
                      <td className="text-sm font-semibold  py-4 pl-3 ">
                        {trimAddress(singleData.owner)}
                      </td>
                      <td className="text-sm font-normal">
                        {formatUnits(
                          singleData.amount,
                          lockerStats.TokenDecimals
                        )}
                      </td>
                      <td className="text-sm font-normal">
                        {singleData.cycle ? singleData.cycle : "--"}
                      </td>
                      <td className="text-sm font-normal">
                        {singleData.cycleBps ? singleData.cycleBps : "--"}
                      </td>
                      <td className="text-sm font-normal">
                        {singleData.tgeBps ? singleData.tgeBps : "--"}
                      </td>
                      <td className="text-sm font-normal">
                        {moment
                          .unix(Number(singleData.tgeDate))
                          .format(TIME_FORMAT)}
                      </td>

                      <td
                        onClick={() => onViewHandler(singleData.id)}
                        className="pr-3">
                        <Button
                          className="rounded-full my-2 py-[6px] w-20  text-xs sm:text-sm"
                          variant="primary-xs">
                          {"View"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockerInfo;
