import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { OptionValue } from "../hooks/useOptionSelection";
import useChartOptions, { OptionValueChart } from "../hooks/useOptionChart";
import { useMediaQuery } from "react-responsive";
import * as XLSX from "xlsx";

/* Icons */
/* import mail from "../assets/mail.svg"; */
import exportIcon from "../assets/export.svg";
import check2 from "../assets/check2.svg";
import arrowdown from "../assets/arrowdown.svg";
import up from "../assets/up.svg";
import orangeBullet from "../assets/orangeBullet.svg";
import { MdKeyboardArrowDown } from "react-icons/md";

export interface ChartDataItem {
  description: string;
  count: number;
}
interface ChartDataProps {
  title: string;
  iconChart: string;
  data: ChartDataItem[];
  selectedOption: OptionValue;
  optionsChart?: OptionValueChart[];
  handleOptionClick: (option: OptionValue) => void;
  initialOptionChart: OptionValueChart;
  selectedOptionChart: OptionValueChart;
  growthRate?: number;
}

const ChartData: React.FC<ChartDataProps> = ({
  title,
  iconChart,
  data,
  optionsChart,
  initialOptionChart,
  handleOptionClick,
  growthRate
}) => {
  const { selectedOptionChart, handleOptionClickChart } =
    useChartOptions(initialOptionChart);
  const [showOptionsChart, setShowOptionsChart] = useState(false);
  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ChartData");
    XLSX.writeFile(workbook, "chart_data.xlsx");
  };
  return (
    <div className="mt-2 lg:mt-0 lg:chart-shadow lg:w-[1204px] h-[564px] bg-white flex flex-col dark:bg-[#0d0d0d] dark:text-white">
      <div className="flex flex-row items-center justify-between w-full p-[24px]">
        <div className="flex items-center gap-2">
          <img src={iconChart} alt="user_icon" className="dark:invert" />
          <h2>Number of {title}</h2>
        </div>
        <div className="lg:hidden flex flex-row items-center gap-4">
          <button
            className="flex flex-row items-center gap-2"
            onClick={() => setIsDropDownOpen(!isDropdownOpen)}
          >
            Action <MdKeyboardArrowDown />
          </button>
        </div>
        {isDropdownOpen && (
          <div
            className="absolute top-[20rem] lg:top-14 z-50 border dark:border-[#585757] dark:bg-[#0d0d0d] px-4 py-6 right-4
                bg-white border-gray-200"
          >
            <div className="flex items-center gap-6 flex-col">
              <div className="flex items-center gap-4 flex-col">
                {/* <button className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300">
                  <img src={mail} alt="user_icon" className="dark:invert" />
                  <h2>Email Data</h2>
                </button> */}
                <button className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300" onClick={exportToExcel}>
                  <img
                    src={exportIcon}
                    alt="user_icon"
                    className="dark:invert"
                  />
                  <h2>Export Data</h2>
                </button>
              </div>
              <button
                className="flex items-center gap-2 w-32 justify-center hover:text-[#3497F9] transition-colors duration-300"
                onClick={() => setShowOptionsChart(!showOptionsChart)}
              >
                <h2>{selectedOptionChart}</h2>
                <img
                  src={arrowdown}
                  alt="arrowdown_icon"
                  className="dark:invert"
                />
              </button>
              {showOptionsChart && (
                <div className="z-50 absolute top-[8.5rem] right-0 p-4 pop-shadow space-y-[10px] bg-white dark:bg-[#0d0d0d] dark:text-white\
                border w-[14rem]">
                  <div className="border-b border-[#d8d8d8] pb-[24px]">
                    <h2>View Inquiries</h2>
                  </div>
                  {optionsChart?.map((optionChart) => (
                    <div
                      key={optionChart}
                      className="pt-2 flex items-center gap-2 justify-between"
                      onClick={() => {
                        handleOptionClickChart(optionChart);
                        handleOptionClick(optionChart);
                      }}
                    >
                      <div className="cursor-pointer px-4">{optionChart}</div>
                      <div className="h-[24px] w-[24px] border border-[#0d0d0d] rounded-full flex-shrink-0 mr-4 relative">
                        {selectedOptionChart === optionChart && (
                          <div className="h-[100%] w-[100%] bg-green-500 rounded-full flex items-center justify-center absolute top-0 left-0">
                            <img src={check2} alt="activated_check" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="hidden lg:flex items-center gap-6 relative">
          <div className="flex flex-row items-center gap-4">
            {/* <button className="hidden lg:flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300">
              <img src={mail} alt="user_icon" className="dark:invert" />
              <h2>Email Data</h2>
            </button> */}
            <button className="hidden lg:flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300" onClick={exportToExcel}>
              <img src={exportIcon} alt="user_icon" className="dark:invert"/>
              <h2>Export Data</h2>
            </button>
          </div>
          <button
            className="hidden lg:flex items-center gap-2 w-32 justify-center hover:text-[#3497F9] transition-colors duration-300"
            onClick={() => setShowOptionsChart(!showOptionsChart)}
          >
            <h2>{selectedOptionChart}</h2>
            <img src={arrowdown} alt="arrowdown_icon" className="dark:invert" />
          </button>
          {showOptionsChart && (
            <div className="z-50 absolute top-14 right-4 p-4 pop-shadow space-y-[10px] bg-white dark:bg-[#0d0d0d] dark:text-white">
              <div className="border-b border-[#d8d8d8] pb-[24px]">
                <h2>View Inquiries</h2>
              </div>
              {optionsChart?.map((optionChart) => (
                <div
                  key={optionChart}
                  className="pt-2 flex items-center gap-2 justify-between"
                  onClick={() => {
                    handleOptionClickChart(optionChart);
                    handleOptionClick(optionChart);
                  }}
                >
                  <div className="cursor-pointer px-4">{optionChart}</div>
                  <div className="h-[24px] w-[24px] border border-[#0d0d0d] rounded-full flex-shrink-0 mr-4 relative">
                    {selectedOptionChart === optionChart && (
                      <div className="h-[100%] w-[100%] bg-green-500 rounded-full flex items-center justify-center absolute top-0 left-0">
                        <img src={check2} alt="activated_check" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-[32px]">
        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={orangeBullet} alt="bullet_icon" />
            Inquiries
          </div>
          <div className="flex items-center gap-2">
            <img
              src={up}
              alt="up_logo"
              className={`dark:invert ${
                growthRate && growthRate < 0 ? "transform rotate-180" : ""
              }`}
            />
            <h2>
              <span
                className={`mr-[4px] ${
                  growthRate && growthRate < 0
                    ? "text-red-500"
                    : "text-[#07cf79]"
                }`}
              >
                {growthRate}%
              </span>
              {selectedOptionChart === "Today" && "Today"}
              {selectedOptionChart === "This Week" && "This Week"}
              {selectedOptionChart === "This Month" && "This Month"}
              {selectedOptionChart === "This Year" && "This Year"}
            </h2>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
        <BarChart
          width={isMobile ? 400 : 1100}
          height={410}
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -30,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="description" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" stackId="a" fill="#EA6200" />
        </BarChart>
        </div>
      </div>
    </div>
  );
};

export default ChartData;
