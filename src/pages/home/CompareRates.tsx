/* Packages */
import { useState, useEffect, useRef, ChangeEvent } from "react";
import axios from "axios";
/* Components */
import PropertyTypeSelector from "../../components/PropertyTypeSelector";
import BankTypeSelector from "../../components/BankTypeSelector";
/* Icons */
import logoWhite from "../../assets/logo_white.svg";
import check from "../../assets/check3.svg";
import refinance from "../../assets/refinance.svg";
import house from "../../assets/house2.svg";
import bank2 from "../../assets/building.svg";
import bankIcon from "../../assets/bank2.svg";
import buc from "../../assets/buc.svg";
import { IoIosWarning } from "react-icons/io";
import { Link } from "react-router-dom";

export interface CompareRatesFormData {
  isRefinance: boolean;
  isNewPurchaces: boolean;
  selectedOption: Option | null;
  selectedOptionBank: Option | null;
  purchasePrice: number | undefined;
  loanAmount: number | undefined;
  loanTenure: number | undefined;
  consentChecked: boolean;
}

interface Bank {
  id: number;
  name: string;
}
export interface Option {
  text: string;
  icon: string;
  id: number | null;
}
interface CompareRatesProps {
  nextStep: (formData: CompareRatesFormData) => void;
}

const CompareRates: React.FC<CompareRatesProps> = ({ nextStep }) => {
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollToError, setShouldScrollToError] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isRefinance, setIsRefinance] = useState<boolean>(false);
  const [isNewPurchaces, setIsNewPurchaces] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isOpenBank, setIsOpenBank] = useState<boolean>(false);
  const [selectedOptionBank, setSelectedOptionBank] = useState<Option | null>(
    null
  );
  const [purchasePrice, setPurchasePrice] = useState<number | undefined>(
    1000000
  );
  const [loanAmount, setLoanAmount] = useState<number>();
  const [loanTenure, setLoanTenure] = useState<number | undefined>(30);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionsBank, setOptionsBank] = useState<Option[]>([]);
  const options: Option[] = [
    { text: "Private Residential", icon: house, id: null },
    { text: "Housing & Development Board", icon: house, id: null },
    { text: "Commercial", icon: bank2, id: null },
    { text: "Building Under Construction", icon: buc, id: null },
  ];
  /* Get Bank Dropdown */
  useEffect(() => {
    axios
      .get("/bank/dropdown")
      .then((response) => {
        const newData: Option[] = response.data.map((bank: Bank) => ({
          id: bank.id,
          text: bank.name,
          icon: bankIcon,
        }));
        setOptionsBank(newData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      localStorage.removeItem("compareRatesFormData");
    });
    const savedFormData = localStorage.getItem("compareRatesFormData");
    if (savedFormData) {
      const formData: CompareRatesFormData = JSON.parse(savedFormData);
      setIsRefinance(formData.isRefinance);
      setIsNewPurchaces(formData.isNewPurchaces);
      setSelectedOption(formData.selectedOption);
      setSelectedOptionBank(formData.selectedOptionBank);
      setPurchasePrice(formData.purchasePrice);
      setLoanAmount(formData.loanAmount);
      setLoanTenure(formData.loanTenure);
      setConsentChecked(formData.consentChecked);
    }
  }, []);

  const saveFormData = () => {
    const formData: CompareRatesFormData = {
      isRefinance,
      isNewPurchaces,
      selectedOption,
      selectedOptionBank,
      purchasePrice,
      loanAmount,
      loanTenure,
      consentChecked,
    };
    localStorage.setItem("compareRatesFormData", JSON.stringify(formData));
  };

  useEffect(() => {
    setShouldScrollToError(true);
  }, [error]);
  useEffect(() => {
    if (shouldScrollToError && error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      setShouldScrollToError(false);
    }
  }, [shouldScrollToError, error]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("compareRatesFormData");
    if (savedFormData) {
      const formData: CompareRatesFormData = JSON.parse(savedFormData);
      setIsRefinance(formData.isRefinance);
      setIsNewPurchaces(formData.isNewPurchaces);
      setSelectedOption(formData.selectedOption);
      setSelectedOptionBank(formData.selectedOptionBank);
      setPurchasePrice(formData.purchasePrice);
      setLoanAmount(formData.loanAmount);
      setLoanTenure(formData.loanTenure);
      setConsentChecked(formData.consentChecked);
    }
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  const handleRefinance = () => {
    setIsRefinance((prevState) => !prevState);
    setIsNewPurchaces(false);
  };
  const handleNewPurchases = () => {
    setIsNewPurchaces((prevState) => !prevState);
    setIsRefinance(false);
  };
  const handleOptionClick = (option: Option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
    setIsOpen(false);
  };
  const handleOptionClickBank = (optionBank: Option) => {
    setSelectedOptionBank((prevOption) =>
      prevOption === optionBank ? null : optionBank
    );
    setIsOpenBank(false);
  };
  const handleNextStep = () => {
    if (isRefinance && !selectedOptionBank) {
      setError("Please select a bank");
      setShouldScrollToError(true);
      return;
    }
    if (!isNewPurchaces && !isRefinance) {
      setError("Please select a loan type");
      setShouldScrollToError(true);
      return;
    }
    if (!selectedOption) {
      setError("Please select a property type");
      setShouldScrollToError(true);
      return;
    }
    if (!loanAmount) {
      setError("Please enter the loan amount");
      setShouldScrollToError(true);
      return;
    } else if (Number(loanAmount) < 100000) {
      setError("Loan amount must be at least 100,000");
      setShouldScrollToError(true);
      return;
    }
    if (!loanTenure) {
      setError("Please enter the loan tenure");
      setShouldScrollToError(true);
      return;
    } else if (Number(loanTenure) > 35) {
      setError("Loan tenure must not exceed 35 years");
      setShouldScrollToError(true);
      return;
    }
    if (!consentChecked) {
      setError("Please consent to the data collection");
      setShouldScrollToError(true);
      return;
    }

    const formData: CompareRatesFormData = {
      isRefinance,
      isNewPurchaces,
      selectedOption,
      selectedOptionBank,
      purchasePrice: Number(purchasePrice),
      loanAmount: Number(loanAmount),
      loanTenure: Number(loanTenure),
      consentChecked,
    };
    localStorage.setItem("compareRatesFormData", JSON.stringify(formData));
    nextStep(formData);
  };
  useEffect(() => {
    const calculatedLoanAmount = (
      price: number | undefined
    ): number | undefined => {
      if (!price) return undefined;
      return Math.floor(price * 0.75);
    };

    if (purchasePrice !== undefined && purchasePrice !== null) {
      setLoanAmount(calculatedLoanAmount(purchasePrice));
    } else {
      setLoanAmount(undefined);
    }
  }, [purchasePrice]);
  const formatNumberWithCommas = (number: number): string => {
    return number.toLocaleString();
  };

  const handleChangePP = (e: ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value.replace(/,/g, "");
    if (input === "") {
      setPurchasePrice(undefined);
    } else {
      const price = parseInt(input, 10);
      if (!isNaN(price)) {
        setPurchasePrice(price);
      } else {
        setPurchasePrice(undefined);
      }
    }
  };
  return (
    <div className="font-poppins text-[#0d0d0d]">
      <div className="absolute lg:top-[40px] lg:left-[48px] flex items-center gap-4 top-[25px] left-[25px]">
        <img src={logoWhite} alt="altasADV_logo" />
        <h1
          className="uppercase leading-[29.05px] tracking-widest font-normal text-base
                      font-inter text-white cursor-pointer"
          onClick={reloadPage}
        >
          ATLASADV
        </h1>
      </div>
      <div
        className="lg:absolute top-[102px] left-[145px] bottom-[100px] p-[42px]
              flex flex-col gap-[24px] bg-white lg:w-[565px] lg:overflow-y-auto lg:max-h-[82vh] -mt-4"
      >
        <div className="border-b border-[#d8d8d8] flex flex-col gap-[10px] py-[10px] text-center lg:text-left">
          <h1 className="uppercase leading-[29.05px] text-[24px] font-normal tracking-widest">
            What are you looking for?
          </h1>
          <p className="font-light text-normal text-[.79em]">
            Simply fill in the form below to use our free loan comparison
            service.
          </p>
        </div>
        <div className="flex flex-col gap-[20px]">
          <h2 className="font-medium text-[16px] leading-[19.68px]">
            Select Loan Type
          </h2>
          <div className="flex items-center gap-[24px] w-full">
            <button
              className={`invert-img flex flex-col items-center gap-[10px] py-[32px] w-full hover:bg-[#000fdc] ${
                isNewPurchaces ? "bg-[#000FDC] text-white" : "bg-[#f4f4f4]"
              } transition-colors duration-500 hover:text-white`}
              onClick={handleNewPurchases}
            >
              <img
                src={check}
                alt="check_icon"
                className={`hover:invert w-8 h-8 ${
                  isNewPurchaces ? "invert" : ""
                }`}
              />
              New Purchase
            </button>
            <button
              className={`invert-img flex flex-col items-center gap-[10px] py-[32px] w-full hover:bg-[#000fdc] ${
                isRefinance ? "bg-[#000FDC] text-white" : "bg-[#f4f4f4]"
              } transition-colors duration-500 hover:text-white`}
              onClick={handleRefinance}
            >
              <img
                src={refinance}
                alt="check_icon"
                className={`w-8 h-8 ${
                  isRefinance ? "invert" : ""
                } hover:invert`}
              />
              Refinance
            </button>
          </div>
          {error === "Please select a loan type" && (
            <div
              ref={errorRef}
              className="text-red-500 justify-center
            flex items-center gap-2"
            >
              <IoIosWarning />
              {error}
            </div>
          )}
        </div>
        {isRefinance && (
          <>
            <BankTypeSelector
              optionsBank={optionsBank}
              selectedOptionBank={selectedOptionBank}
              handleOptionClickBank={handleOptionClickBank}
              isOpenBank={isOpenBank}
              setIsOpenBank={setIsOpenBank}
            />
            {error === "Please select a bank" && (
              <div
                ref={errorRef}
                className="text-red-500 flex items-center gap-2"
              >
                <IoIosWarning />
                {error}
              </div>
            )}
          </>
        )}
        {/* Property Type Selector */}
        <div>
          <PropertyTypeSelector
            options={options}
            selectedOption={selectedOption}
            handleOptionClick={handleOptionClick}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          {error === "Please select a property type" && (
            <div
              ref={errorRef}
              className="text-red-500 flex items-center gap-2 mt-4"
            >
              <IoIosWarning />
              {error}
            </div>
          )}
        </div>
        {isNewPurchaces && (
          <div className="flex flex-col gap-[24px] w-full">
            <h2 className="font-medium text-[16px] leading-[19.68px]">
              Purchase Price
              <br className="md:hidden" />
            </h2>
            <input
              type="text"
              placeholder="135,000"
              className="border border-[#d8d8d8] py-[18px] pl-6 w-full
      outline-none hover:ring-1 hover:ring-[#000fcd] transition-all duration-500"
              value={
                purchasePrice !== undefined
                  ? formatNumberWithCommas(purchasePrice)
                  : ""
              }
              onChange={handleChangePP}
            />
          </div>
        )}
        <div className="flex items-center gap-[24px] justify-between w-full">
          <div className="flex flex-col gap-[24px] w-full">
            <h2 className="font-medium text-[16px] leading-[19.68px]">
              Loan Amount <br className="md:hidden" />
              (SGD)
            </h2>
            <input
              type="text"
              placeholder="100,000"
              className="border border-[#d8d8d8] py-[18px] pl-6 w-full
      outline-none hover:ring-1 hover:ring-[#000fcd] transition-all duration-500"
              value={
                loanAmount !== undefined ? loanAmount.toLocaleString() : ""
              }
              onChange={(e) => {
                const input = e.target.value.replace(/,/g, "");
                setLoanAmount(input !== "" ? parseInt(input) : 0); // Default to 0
              }}
            />
          </div>
          <div className="flex flex-col gap-[24px] w-full">
            <h2 className="font-medium text-[16px] leading-[19.68px]">
              Loan Tenure <br className="md:hidden" />
              (Years)
            </h2>
            <input
              type="number"
              placeholder="30"
              className="border border-[#d8d8d8] py-[18px] pl-6 w-full
                outline-none
                    hover:ring-1 hover:ring-[#000fcd] transition-all duration-500"
              value={loanTenure}
              onChange={(e) => setLoanTenure(parseInt(e.target.value))}
            />
          </div>
        </div>
        {error === "Please enter the loan amount" && (
          <div
            ref={errorRef}
            className="text-red-500 flex items-center justify-center gap-2"
          >
            <IoIosWarning />
            {error}
          </div>
        )}
        {error === "Loan amount must be at least 100,000" && (
          <div
            ref={errorRef}
            className="text-red-500 flex items-center justify-center gap-2"
          >
            <IoIosWarning />
            {error}
          </div>
        )}
        {error === "Please enter the loan tenure" && (
          <div
            ref={errorRef}
            className="text-red-500 flex items-center justify-center gap-2"
          >
            <IoIosWarning />
            {error}
          </div>
        )}
        {error === "Loan tenure must not exceed 35 years" && (
          <div
            ref={errorRef}
            className="text-red-500 flex items-center justify-center gap-2"
          >
            <IoIosWarning />
            {error}
          </div>
        )}
        {error === "Please consent to the data collection" && (
          <div
            ref={errorRef}
            className="text-red-500 flex items-center justify-center gap-2"
          >
            <IoIosWarning />
            {error}
          </div>
        )}
        <div className="flex gap-2 py-[12px] border-t border-[#d8d8d8]">
          <div>
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
            />
          </div>
          <p className="max-w-[500px] text-normal font-light font-sans text-[.9em]">
            I consent to the collection, use and disclosure of my personal data
            for the purposes set in our Privacy Notice as required by the{" "}
            <Link
              to="/terms-and-condition"
              className="text-[#000FDC] hover:underline"
              onClick={() => {
                saveFormData();
                sessionStorage.setItem("fromTerms", "true");
              }}
            >
              Personal Data Protection Act 2012
            </Link>
            .
          </p>
        </div>
        <button
          onClick={handleNextStep}
          className="py-[24px] px-[21px] bg-[#181818] text-white
                  font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                  transition-colors duration-500"
        >
          Compare Rates
        </button>
      </div>
    </div>
  );
};

export default CompareRates;
