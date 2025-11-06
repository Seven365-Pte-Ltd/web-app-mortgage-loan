import { IoCloseCircleOutline } from "react-icons/io5";
type Option = {
  text: string;
};

type StatusTypeSelectorProps = {
  options: Option[];
  selectedOption: Option | null;
  handleOptionClick: (option: Option) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentStatus: string;
};

const StatusTypeSelector: React.FC<StatusTypeSelectorProps> = ({
  options,
  selectedOption,
  handleOptionClick,
  isOpen,
  setIsOpen,
  currentStatus,
}) => {
  return (
    <div className="flex flex-col gap-[24px]">
      <h2 className="font-medium text-[16px] leading-[19.68px]">
        Enquiry Status
      </h2>
      <div className="flex items-center gap-[24px] w-full">
        <div className="flex items-center gap-[10px] w-full relative hover:ring-1 hover:ring-[#000fcd] transition-all duration-500">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none"></div>
          <button
            type="button"
            className="border border-[#d8d8d8] py-[18px]  w-full bg-white shadow-sm focus:outline-none
              focus:ring-1 focus:ring-[#000fcd] transition-all duration-500 text-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption ? selectedOption.text : currentStatus || 'Select Enquiry Status'}
          </button>
          {isOpen && (
            <div
              className="absolute -top-2 z-10 mt-1 w-full bg-white shadow-lg rounded-lg
              px-[24px] py-[24px] card-shadow border"
            >
              <div className="border-b border-[#d8d8d8] pb-[24px] font-medium mb-[18px]
              flex items-center justify-between">
                Select Enquiry Status
                <IoCloseCircleOutline onClick={() => setIsOpen(false)} className='hover:scale-110 cursor-pointer
                 hover:text-red-500 transition-all duration-200 w-6 h-6'/>
              </div>
              <div className="max-h-[150px] overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.text}
                  type="button"
                  className="w-full text-left p-[16px] flex items-center justify-between hover:bg-gray-100"
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="mr-2"></div>
                    {option.text}
                  </div>
                </button>
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusTypeSelector;
