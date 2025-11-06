/* Components */
import { useState } from "react";
import BankRatesImport from "./BankRatesImport";
/* Icons  */
import rates from "../../assets/rates.svg";
import { MdKeyboardReturn } from "react-icons/md";

interface BankRatesProps {
  handleShowBankRates: () => void;
}
const EmptyRates: React.FC<BankRatesProps> = ({ handleShowBankRates }) => {
  const [isShowImportRates, setIsShowImportRates] = useState<boolean>(false);
  const handleShowImportRates = () => {
    setIsShowImportRates(true);
  };
  return (
    <div className="transition-colors duration-300 border border-[#d8d8d8] dark:border-black">
      <div className="w-full px-4 lg:py-[9.3rem]">
        {isShowImportRates ? (
          <div className="flex flex-col items-center gap-[48px]">
            <BankRatesImport handleShowBankRates={handleShowBankRates} />
          </div>
        ) : (
          <div className="flex flex-col items-center py-[7.6rem]">
            <div className="flex flex-col items-center gap-[48px]">
            <div className="flex items-center flex-col gap-[24px]">
              <img src={rates} alt="big_bank_icon" className="dark:invert" />
              <div className="flex flex-col items-center gap-[12px] justify-center">
                <h1 className="font-medium text-[1.5rem] lg:text-[32px] leading-[39.36px] text-center">
                  You currently do not have a list of mortgage rates for this bank
                </h1>
                <p className="text-center">
                  You can add or import a list of banks, import using an excel
                  file. <br />
                  Please refer to the{" "}
                  <span className="text-blue-700 hover:underline">
                    Importing Banks Guide
                  </span>
                </p>
              </div>
            </div>
            <div className="flex lg:flex-row items-center gap-8 flex-col w-full lg:justify-center">
              <button
                className="flex items-center gap-2 py-[12px] px-[28px] transition-colors duration-300
              bg-[#181818] text-white hover:bg-[#000FDC] content justify-center"
                onClick={handleShowBankRates}
              >
                <MdKeyboardReturn />
                Return
              </button>
              <button
                className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                      transition-colors duration-300"
                onClick={handleShowImportRates}
              >
                Import Rates
              </button>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyRates;
