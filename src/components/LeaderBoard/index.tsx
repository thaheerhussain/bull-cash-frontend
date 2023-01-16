import { leaderBoardData } from "@constants/leaderboardData";
import React from "react";
import LeaderBoardList from "./LeaderBoardList";
import BannerImage from "@public/images/multisenderBanner.png";
import useSWR from "swr";
import moment from "moment";
import { graphFetcher } from "@components/Home/Sectionone";

interface IWeekType {
  weekNumber: number;
  weekYear: number;
  startDate: string;
  endDate: string;
}

const LeaderBoardComp: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [startDate, setStartDate] = React.useState("1668998336");
  const [endDate, setEndDate] = React.useState("1669516736");
  const [totalWeek, setTotalWeek] = React.useState([]);
  const { data, error } = useSWR(
    `{
      pools(orderBy: totalRaised, orderDirection: desc, where: {startTime_gte: ${startDate}, endTime_lte: ${endDate}}) {
        id
        logo
        banner
        token
        startTime
        totalRaised
        type
        poolDetails
      }
    }`,
    graphFetcher
  );
  const getWeeksYear = () => {
    const startDate = "Nov 01 2022";
    const startWeek = moment(startDate).startOf("isoWeek").toDate();
    const diffStartDateWeek = moment(startDate).diff(moment(startWeek), "days");

    const currentDate = [
      moment(new Date()).year(),
      moment(new Date()).month(),
      moment(new Date()).date(),
    ];
    const endWeek = moment(currentDate).endOf("isoWeek").toDate();
    const diffEndDateWeek = moment(endWeek).diff(moment(currentDate), "days");
    const gapBetweenCurrent =
      moment(currentDate).diff(moment(startDate), "days") +
      diffStartDateWeek +
      diffEndDateWeek +
      1;

    const numberOfWeeks = gapBetweenCurrent / 7;

    let totalWeekArr: any = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      if (i == 0) {
        const currentWeekNo = moment(
          moment(startDate).startOf("isoWeek").toDate()
        ).isoWeeks();
        const currentWeekYear = moment(startDate).year();
        const cuurentWeekStartDate = moment(
          moment(startDate).startOf("isoWeek").toDate()
        ).format("M/D/Y");
        const cuurentWeekEndDate = moment(
          moment(startDate).endOf("isoWeek").toDate()
        ).format("M/D/Y");
        totalWeekArr.push({
          weekNumber: currentWeekNo,
          weekYear: currentWeekYear,
          startDate: cuurentWeekStartDate,
          endDate: cuurentWeekEndDate,
        });
      } else {
        const currentWeekStartDate = moment
          .unix(moment(totalWeekArr[i - 1].endDate).unix() + 86400)
          .format("M/D/Y");
        const currentWeekNo = moment(
          moment(currentWeekStartDate).startOf("isoWeek").toDate()
        ).isoWeeks();
        const currentWeekYear = moment(currentWeekStartDate).year();
        const cuurentWeekEndDate = moment(
          moment(currentWeekStartDate).endOf("isoWeek").toDate()
        ).format("M/D/Y");
        totalWeekArr.push({
          weekNumber: currentWeekNo,
          weekYear: currentWeekYear,
          startDate: currentWeekStartDate,
          endDate: cuurentWeekEndDate,
        });
      }
    }
    return setTotalWeek(totalWeekArr.reverse());
  };

  React.useEffect(() => {
    getWeeksYear();
    const startDateOfWeek = moment(moment().startOf("isoWeek").toDate()).unix();
    const endDateOfWeek = moment(moment().endOf("isoWeek").toDate()).unix();
    setStartDate(startDateOfWeek.toString());
    setEndDate(endDateOfWeek.toString());
    setCurrentTab(0);
  }, []);

  const getCurrentTab = (index: number, data: IWeekType) => {
    setCurrentTab(index);
    const startDateOfWeek = moment(
      moment(data.startDate).startOf("isoWeek").toDate()
    ).unix();
    const endDateOfWeek = moment(
      moment(data.endDate).endOf("isoWeek").toDate()
    ).unix();
    setStartDate(startDateOfWeek.toString());
    setEndDate(endDateOfWeek.toString());
  };

  return (
    <>
      <div className="md:h-[350px] lg:h-[480px] flex flex-col-reverse md:flex-row items-center justify-around py-6 bg-[#798998]">
        <h1 className="text-white font-fonde text-4xl md:text-5xl lg:text-7xl font-normal mt-4 md:mt-0 mx-4">
          Leaderboard
        </h1>
        <img
          className="w-[80%] md:w-[300px] lg:w-[450px]"
          src={BannerImage.src}
          alt=""
        />
      </div>
      <div className="container mx-auto mt-[36px] p-2.5">
        <div className="border border-[#EFF0F7] shadow-boxShadow6 rounded-xl p-3 md:p-6">
          <div className="flex flex-wrap lg:flex-nowrap w-full justify-between mt-8">
            <div className="w-full">
              <ul className="flex justify-between md:justify-start text-base font-normal w-full p-2 bg-[#E2E8F0] rounded-xl overflow-x-auto">
                {totalWeek &&
                  totalWeek.map((data: IWeekType, index) => {
                    return (
                      <li
                        key={index}
                        className={`cursor-pointer text-lg font-semibold min-w-fit px-6 py-3 rounded-md ${
                          currentTab === index ? "bg-white" : ""
                        }`}
                        onClick={() => getCurrentTab(index, data)}>
                        {`Week ${data.weekNumber}/${data.weekYear}`}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="mt-3">
            {data &&
              data.pools &&
              data.pools.map((data: any, index: number) => {
                return <LeaderBoardList key={index} {...data} />;
              })}
            {data && data.pools.length === 0 && (
              <p className="text-center mt-10 mb-5">No Data</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoardComp;
