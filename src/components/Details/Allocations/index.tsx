import { confirmation2MultiSenderData } from "@constants/multisenderData";
import { IPoolDetailsData } from "@components/Details";
import { trimAddress } from "@constants/constant";
import CopyAddress from "@components/Details/CopyAddress";

export interface IAllocationDetail {
  address: string;
  amount: string;
}
const AllocationDetail = ({
  details,
  token,
}: {
  details: IAllocationDetail[];
  token: IPoolDetailsData["token"];
}) => {
  return (
    <div className="py-4 sm:py-6   mt-8 w-full rounded-2xl border ">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 pb-4 mb-4 border-b ">
        <p className="text-base font-medium">Address</p>
        <p className="text-base font-medium">Amount</p>
      </div>
      {details.map((data, index) => (
        <div
          key={index}
          className="flex justify-between text-sm font-medium gap-3 px-3 sm:px-4 md:px-6 sm:gap-5 border-b py-3 last:border-b-0">
          <p className="w-[150px] sm:w-auto overflow-x-scroll sm:overflow-x-auto ">
            <CopyAddress
              type={"address"}
              scale={false}
              address={data.address}
            />
          </p>
          <p>
            {parseFloat(data.amount) / 10 ** token.decimals}{" "}
            {token.symbol.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};
export default AllocationDetail;
