import house from '../assets/house2.svg';
import { IoCloseCircleOutline } from "react-icons/io5";

type Option = {
  id: number | null;
  text: string;
  icon: string;
};

type PropertyTypeSelectorProps = {
    options: Option[];
    selectedOption: Option | null;
    handleOptionClick: (option: Option) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({ options, selectedOption, handleOptionClick, isOpen, setIsOpen }) => {
  return (
    <div className="flex flex-col gap-[24px]">
      <h2 className="font-medium text-[16px] leading-[19.68px]">
        Select Property Type
      </h2>
      <div className="flex items-center gap-[24px] w-full">
        <div className="flex items-center gap-[10px] w-full relative hover:ring-1 hover:ring-[#000fcd] transition-all duration-500">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <img src={selectedOption?.icon ?? house} alt="house_icon" />
          </div>
          <button
            type="button"
            className="border border-[#d8d8d8] py-[18px] pl-12 pr-4 w-full text-left bg-white shadow-sm focus:outline-none
              focus:ring-1 focus:ring-[#000fcd] transition-all duration-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedOption?.text ?? 'Select Property Type'}
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isOpen && (
            <div
              className="absolute -top-2 z-10 mt-1 w-full bg-white shadow-lg rounded-lg
              px-[24px] py-[24px] card-shadow border "
            >
              <div className="border-b border-[#d8d8d8] pb-[24px] font-medium mb-[18px]
              flex items-center justify-between">
                <span>Select Property Type</span>
                <IoCloseCircleOutline onClick={() => setIsOpen(false)} className='hover:scale-110 cursor-pointer
                 hover:text-red-500 transition-all duration-200 w-6 h-6'/>
              </div>
              {options.map((option) => (
                <button
                  key={option.text}
                  type="button"
                  className="w-full text-left p-[16px] flex items-center justify-between hover:bg-gray-100
                  transition-all duration-300"
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="mr-2">
                      <img src={option.icon} alt="option_icon" />
                    </div>
                    {option.text}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelector;
