/* Packages */
import { useState } from "react";
/* Icons */
import banks from "../../assets/banks.svg";
import exportIcon from "../../assets/export.svg";
import rates from "../../assets/rates.svg";
import { MdKeyboardReturn } from "react-icons/md";
/* Components */
import EmptyRates from "./EmptyRates";
import BankRatesImport from "./BankRatesImport";

interface Rate {
  year: number;
  propertyType: number;
  propertyTypeName: string;
  rateType: number;
  rateTypeName: string;
  interestRate: number;
  monthlyInstallment: number;
}

interface BankRatesProps {
  name?: string;
  updatedAt?: string;
  newPurchaseRates?: Rate[];
  refinanceRates?: Rate[];
  handleShowBankRates: () => void;
}

const BanksRates: React.FC<BankRatesProps> = ({
  name,
  updatedAt,
  newPurchaseRates,
  refinanceRates,
  handleShowBankRates,
}) => {
  const [loanType, setLoanType] = useState<string>("New Purchase");
  const [propertyType, setPropertyType] =
    useState<string>("PrivateResidential");
  const [isShowBankImportRates, setIsShowBankImportRates] =
    useState<boolean>(false);
  const handleShowImportRates = () => {
    setIsShowBankImportRates(!isShowBankImportRates);
  };
  /* Empty Rates */
  const isRatesEmpty = !newPurchaseRates || newPurchaseRates.length === 0;
  /* Format Date */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  /* Select Loan Type */
  const handleLoanTypeSelect = (type: string) => {
    setLoanType(type);
  };

  const handlePropertyTypeSelect = (type: string) => {
    setPropertyType(type);
  };
  const filteredRates =
    loanType === "New Purchase" ? newPurchaseRates : refinanceRates;

  const filteredRatesByPropertyType = filteredRates?.filter(
    (rate) => rate.propertyTypeName === propertyType
  );
  const formattedDate = formatDate(updatedAt);
  return (
    <div className="">
      <div
        className="w-full bg-white font-poppins dark:bg-[#0d0d0d] dark:text-white transition-colors
     duration-300"
      >
        <div>
          <div>
            <div
              className="flex items-center justify-between border-b border-[#d8d8d8] text-normal
                 dark:border-black w-full lg:px-8 transition-colors duration-300 py-6"
            >
              <div className="flex items-center lg:gap-16 content justify-between w-full">
                <div className="flex items-center gap-2 pl-4 lg:pl-0">
                  <img src={banks} alt="user_icon" className="dark:invert" />
                  <h2>{name}</h2>
                </div>
                <div>
                  {isRatesEmpty ? (
                    <button
                      className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                      onClick={handleShowImportRates}
                    >
                      <img
                        src={exportIcon}
                        alt="user_icon"
                        className="dark:invert"
                      />
                      <h2 className="pr-4 lg:pr-0">Import Rates</h2>
                    </button>
                  ) : (
                    <div className="flex flex-row items-center gap-2 pr-4">
                      <img
                        src={rates}
                        alt="icon"
                        className="dark:invert lg:w-6 w-4"
                      />
                      <h2 className="text-[12px] lg:text-normal">
                        Rates updated: {formattedDate}
                      </h2>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {isShowBankImportRates ? (
          <div className="flex items-center justify-center lg:py-[9rem]">
            <div className="max-w-lg px-4 lg:px-0">
              <BankRatesImport handleShowBankRates={handleShowBankRates} />
            </div>
          </div>
        ) : (
          <div>
            {isRatesEmpty ? (
              <EmptyRates handleShowBankRates={handleShowBankRates} />
            ) : (
              <>
                <div>
                  <div className="flex flex-row items-center justify-between py-6">
                    <button
                      className={`w-full p-4 ${
                        loanType === "New Purchase"
                          ? "border-b border-[#000fdc]"
                          : "border-b border-[#d8d8d8]"
                      } pb-4 transition-colors duration-300`}
                      onClick={() => handleLoanTypeSelect("New Purchase")}
                    >
                      New Purchase
                    </button>
                    <button
                      className={`w-full p-4 ${
                        loanType === "Refinance"
                          ? "border-b border-[#000fdc]"
                          : "border-b border-[#d8d8d8]"
                      } pb-4 transition-colors duration-300`}
                      onClick={() => handleLoanTypeSelect("Refinance")}
                    >
                      Refinance
                    </button>
                  </div>
                </div>
                <div className="">
                  <div className="border border-[#d8d8d8] dark:border-gray-800 m-4 rounded-lg overflow-hidden">
                    <div
                      className="flex flex-row items-center justify-between text-center
                border-b border-gray-800 overflow-x-auto"
                    >
                      <h2
                        className={`w-full p-4 ${
                          propertyType === "PrivateResidential"
                            ? "bg-[#000fdc] text-white"
                            : ""
                        } cursor-pointer transition-colors duration-300`}
                        onClick={() =>
                          handlePropertyTypeSelect("PrivateResidential")
                        }
                      >
                        <span className="hidden lg:inline-block">Private</span>{" "}
                        Residential
                      </h2>
                      <h2
                        className={`w-full p-4 ${
                          propertyType === "HDB"
                            ? "bg-[#000fdc] text-white"
                            : ""
                        } cursor-pointer transition-colors duration-300`}
                        onClick={() => handlePropertyTypeSelect("HDB")}
                      >
                        HDB
                      </h2>
                      <h2
                        className={`w-full p-4 ${
                          propertyType === "Commercial"
                            ? "bg-[#000fdc] text-white"
                            : ""
                        } cursor-pointer transition-colors duration-300`}
                        onClick={() => handlePropertyTypeSelect("Commercial")}
                      >
                        Commercial
                      </h2>
                      <h2
                        className={`w-full p-4 ${
                          propertyType === "BUC"
                            ? "bg-[#000fdc] text-white"
                            : ""
                        } cursor-pointer transition-colors duration-300`}
                        onClick={() => handlePropertyTypeSelect("BUC")}
                      >
                        BUC
                      </h2>
                    </div>
                    <div
                      className="hidden lg:flex flex-row items-center justify-between p-4 bg-gray-200
                dark:bg-[#181818] transition-colors duration-300 gap-10"
                    >
                      <h2 className="w-full text-center">Rate Type</h2>
                      <h2 className="w-full text-center">Lock In</h2>
                      <h2 className="w-full text-center">Interest Rate</h2>
                      <h2 className="w-full text-center">
                        Monthly Installment
                      </h2>
                    </div>
                    <div className="h-[50vh] overflow-y-auto hide-scroll">
                      {filteredRatesByPropertyType?.map((rate, index) => (
                        <div
                          key={index}
                          className="flex flex-col lg:flex-row items-center justify-between p-4 transition-colors duration-300
                     gap-4 lg:gap-10 border-b border-gray-800 overflow-y-auto"
                        >
                          <h2 className="w-full text-center flex-mobile">
                            <span className="lg:hidden">Rate Type</span>{" "}
                            {rate.rateTypeName}
                          </h2>
                          <h2 className="w-full text-center flex-mobile">
                            <span className="lg:hidden">Lock In</span>{" "}
                            {rate.year} Year
                          </h2>
                          <h2 className="w-full text-center flex-mobile">
                            <span className="lg:hidden">Interest Rate</span>{" "}
                            <span className="text-green-500">
                              {rate.interestRate}%
                            </span>
                          </h2>
                          <h2 className="w-full text-center flex-mobile">
                            <span className="lg:hidden">
                              Monthly Installment
                            </span>$
                            {rate.monthlyInstallment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </h2>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center lg:justify-end justify-between px-6 mb-[4px] lg:gap-10 -mt-3">
                    <button
                      className="flex items-center gap-2 py-6 hover:text-[#3497F9] transition-colors duration-300"
                      onClick={handleShowBankRates}
                    >
                      <MdKeyboardReturn />
                      Return
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BanksRates;
