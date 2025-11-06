import { useState, useEffect, useRef } from 'react';
import { OptionValue } from '../hooks/useOptionSelection';

interface InquiryCardProps {
  title: string
  userIcon: string;
  arrowDownIcon: string;
  checkIcon: string;
  upIcon: string;
  chartIcon: string;
  inquiryData: {
    count: number;
    growthRate: number;
  } | null;
  options: OptionValue[];
  selectedOption: OptionValue;
  handleOptionClick: (option: OptionValue) => void;
  handleChartData: () => void;
  customWidth: string;
  customHeight: string;
}

const DashCard: React.FC<InquiryCardProps> = ({
  title,
  userIcon,
  arrowDownIcon,
  checkIcon,
  upIcon,
  chartIcon,
  inquiryData,
  options,
  selectedOption,
  handleOptionClick,
  handleChartData,
  customWidth,
  customHeight,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showOptions]);
  return (
    <div className={`py-[25px] px-[32px] bg-white card-shadow w-full ${customWidth} ${customHeight} flex flex-col
     justify-between font-normal dark:bg-[#0d0d0d] dark:text-white transition-colors duration-300`}>
      <div className="flex flex-row items-center justify-between relative gap-2">
        <div className="flex items-center gap-2">
          <img src={userIcon} alt="user_icon" className="dark:invert" />
          <h2 className=''>{title}</h2>
        </div>
        <button
          className="flex items-center gap-2"
          onClick={() => setShowOptions(!showOptions)}
        >
          <h2>{selectedOption}</h2>
          <img src={arrowDownIcon} alt="arrowdown_icon" className="dark:invert" />
        </button>
        {showOptions && (
          <div ref={optionsRef} className="z-50 absolute top-8 right-20 p-4 pop-shadow space-y-[10px] bg-white translate-x-32 dark:bg-[#0d0d0d] dark:text-white">
            <div className="border-b border-[#d8d8d8] pb-[24px] dark:bg-[#0d0d0d] dark:text-white
            transition-colors duration-300">
              <h2>View Inquiries</h2>
            </div>
            {options.map((option) => (
              <div
                key={option}
                className="pt-2 flex items-center gap-2 justify-between cursor-pointer"
                onClick={() => {
                  handleOptionClick(option);
                }}
              >
                <div className="px-4">{option}</div>
                <div className="h-[24px] w-[24px] border border-[#0d0d0d] rounded-full flex-shrink-0 mr-4 relative dark:border-[#ffffff]
                transition-colors duration-300">
                  {selectedOption === option && (
                    <div className="h-[100%] w-[100%] bg-green-500 rounded-full flex items-center justify-center absolute top-0 left-0">
                      <img src={checkIcon} alt="activated_check" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
       <h1 className="text-lg">{inquiryData?.count}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={upIcon}
            alt="up_logo"
            className={`dark:invert ${inquiryData && inquiryData.growthRate < 0 ? "transform rotate-180" : ""}`}
          />
         <h2>
            <span className={`mr-[4px] ${inquiryData && inquiryData.growthRate < 0 ? "text-red-500" : "text-[#07cf79]"}`}>
              {inquiryData?.growthRate}%
            </span>
            {selectedOption === "Today" && "Today"}
            {selectedOption === "This Week" && "This Week"}
            {selectedOption === "This Month" && "This Month"}
            {selectedOption === "This Year" && "This Year"}
          </h2>
        </div>
        <button className="tooltip-container" onClick={handleChartData}>
          <img src={chartIcon} alt="chart_icon" className="cursor-pointer dark:invert" />
          <span className="tooltip-text bg-white pop-shadow text-[#0d0d0d] whitespace-nowrap transition duration-300
           ease-in-out">
            View Chart
          </span>
        </button>
      </div>
    </div>
  );
};

export default DashCard;
