import bankBig from "../../assets/bankBig.svg";

interface BankEmptyProps {
  handleShowAddBank: () => void;
  importBanksFromExcel: () => void;
}
const EmptyBank: React.FC<BankEmptyProps> = ({ handleShowAddBank}) => {
  return (
    <tr className="transition-colors duration-300 border border-[#d8d8d8] dark:border-black">
      <td className="w-full px-4 py-32 lg:py-[14.5rem]">
        <div className="flex flex-col items-center gap-[48px]">
          <div className="flex items-center flex-col gap-[24px]">
            <img src={bankBig} alt="big_bank_icon" className="dark:invert" />
            <div className="flex flex-col items-center gap-[12px] justify-center">
              <h1 className="font-medium text-[1.5rem] lg:text-[32px] leading-[39.36px] text-center">
                You currently do not have a list of Banks
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
            {/* <button
              className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                      transition-colors duration-300"
              onClick={importBanksFromExcel}
            >
              Import Bank
            </button> */}
            <button
              className="w-full lg:w-[160px] py-[12px] px-[28px] bg-[#181818] text-white hover:bg-[#000FDC]
                      transition-colors duration-300"
              onClick={handleShowAddBank}
            >
              Add Bank
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default EmptyBank;
