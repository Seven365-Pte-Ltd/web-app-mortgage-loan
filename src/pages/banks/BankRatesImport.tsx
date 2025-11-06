  /* Packages */
  import { useState } from "react";
  import axios from "axios";
  import { toast } from "react-toastify";
  /* Icons  */
  import bankBig from "../../assets/bankBig.svg";
  import { MdKeyboardReturn } from "react-icons/md";
  import check from "../../assets/check.svg";
  import refinance from "../../assets/refinance.svg";
  import { AiOutlineLoading3Quarters } from "react-icons/ai";

  interface BankRatesProps {
    handleShowBankRates: () => void;
  }
  const BankRatesImport: React.FC<BankRatesProps> = ({ handleShowBankRates }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<{
      purchaseRates: File | null;
      refinanceRates: File | null;
    }>({
      purchaseRates: null,
      refinanceRates: null,
    });
    const handleFileChange = (
      file: File | null,
      type: "purchaseRates" | "refinanceRates"
    ) => {
      setSelectedFiles((prev) => ({ ...prev, [type]: file }));
    };
    const handleUpload = async () => {
      setIsLoading(true);
      toast.info("Uploading file...");
      try {
        const formData = new FormData();
        formData.append(
          "NewPurchaseRateFile",
          selectedFiles.purchaseRates as File
        );
        formData.append(
          "RefinanceRateFile",
          selectedFiles.refinanceRates as File
        );
        await axios.post("/bank/rate/import/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("File uploaded successfully");
      } catch (error) {
        toast.error("Error uploading file");
      } finally {
        setIsLoading(false);
      }
    };
    const renderFileName = (
      file: File | null,
      type: "purchaseRates" | "refinanceRates"
    ) => {
      if (!file) {
        return type === "purchaseRates"
          ? "New Purchase Rates"
          : "Refinance Rates";
      }
      return file.name;
    };
    const handleButtonClick = (type: "purchaseRates" | "refinanceRates") => {
      const fileInput = document.getElementById(`fileInput_${type}`);
      if (fileInput) {
        fileInput.click();
      }
    };
    const handleDownloadTemplate = () => {
      const link = document.createElement("a");
      link.href = "/template.xlsx";
      link.download = "Import_Rates_Template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    return (
      <div className="space-y-8 py-10 lg:py-0">
        <div className="flex items-center flex-col gap-[24px]">
          <img src={bankBig} alt="big_bank_icon" className="dark:invert" />
          <div className="flex flex-col items-center gap-[12px] justify-center">
            <h1 className="font-medium text-[1.5rem] lg:text-[32px] leading-[39.36px] text-center">
              Imports Rates
            </h1>
            <p className="text-center">
              You can add or import a list of banks, import using an excel file.{" "}
              <br />
              Please download here:{" "}
              <span className="text-blue-700 hover:underline" onClick={handleDownloadTemplate}>
                Import rates excel template
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="border border-gray-400 dark:border-gray-800 p-8 flex flex-col
          lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-2 transition-colors duration-200">
              <img src={check} alt="" className="dark:invert" />
              <h2>
                {renderFileName(selectedFiles.purchaseRates, "purchaseRates")}
              </h2>
            </div>
            <input
              id="fileInput_purchaseRates"
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={(event) =>
                handleFileChange(
                  event.target.files && event.target.files[0],
                  "purchaseRates"
                )
              }
            />
            <button
              className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                        transition-colors duration-300"
              onClick={() => handleButtonClick("purchaseRates")}
            >
              Select Files
            </button>
          </div>
          <div
            className="border border-gray-400 p-8 flex flex-col lg:flex-row items-center justify-between
            dark:border-gray-800
          transition-colors duration-200 gap-6"
          >
            <div className="flex flex-row items-center gap-2">
              <img src={refinance} alt="" className="dark:invert" />
              <h2>
                {renderFileName(selectedFiles.refinanceRates, "refinanceRates")}
              </h2>
            </div>
            <input
              id="fileInput_refinanceRates"
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={(event) =>
                handleFileChange(
                  event.target.files && event.target.files[0],
                  "refinanceRates"
                )
              }
            />
            <button
              className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                        transition-colors duration-300"
              onClick={() => handleButtonClick("refinanceRates")}
            >
              Select Files
            </button>
          </div>
        </div>
        <div className="flex lg:flex-row items-center gap-8 flex-col w-full lg:justify-center">
          <button
            className="flex items-center gap-2 py-[12px] px-[28px] transition-colors duration-300
                bg-[#181818] text-white hover:bg-[#000FDC] content justify-center"
                onClick={() => {
                  handleShowBankRates();
                }}
          >
            <MdKeyboardReturn />
            Go Back
          </button>
          <button
            className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                        transition-colors duration-300"
            onClick={handleUpload}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <AiOutlineLoading3Quarters className="animate-spin text-[1.5rem]" />
              </div>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </div>
    );
  };

  export default BankRatesImport;
