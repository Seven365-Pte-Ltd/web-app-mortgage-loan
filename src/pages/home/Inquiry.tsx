/* Components */
import { CardsEnquiry } from "../../components/CardEnquiry";
import { UserFormBankAxiosResponse } from "./UserForm";
import HomeFooter from "./HomeFooter";
import logoWhite from "../../assets/logo_white.svg";
import { MdHome } from "react-icons/md";
/* import { useEffect } from "react";
import axios from "axios"; */

interface InquiryFormLayoutProps {
  step: number;
  responseData: UserFormBankAxiosResponse[] | null;
}

const Inquiry: React.FC<InquiryFormLayoutProps> = ({ step, responseData }) => {
  function convertBase64ToImage(base64String: string) {
    return `data:image/png;base64,${base64String}`;
  }
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="lg:static fixed top-0 lg:overflow-hidden overflow-y-auto lg:h-fit h-screen pb-10 lg:pb-0">
      <div
        className="lg:absolute lg:top-[40px] lg:left-[48px] flex items-center gap-4 top-[25px] left-[25px] ml-6 mt-8 mb-10
      lg:ml-0 lg:mt-0 lg:mb-0"
      >
        <img src={logoWhite} alt="altasADV_logo" />
        <h1
          className="uppercase leading-[29.05px] tracking-widest font-normal text-base font-inter text-white cursor-pointer"
          onClick={reloadPage}
        >
          ATLASADV
        </h1>
      </div>
      <div
        className="lg:absolute lg:top-[102px] bottom-[100px] w-full lg:overflow-y-auto lg:max-h-[82vh]
        flex item-center justify-center"
      >
        <div className="lg:max-w-[70vw] px-4 lg:px-0">
          {responseData?.length !== 0 ? (
            <div>
              <div className="flex flex-row items-center justify-between border-b border-[#d8d8d8]">
                <div
                  className="md:bg-transparent flex flex-col py-[24px] gap-[13px] text-white
                rounded-xl md:rounded-none px-6 md:px-0 backdrop-blur-md bg-black/40 md:backdrop-filter-none
                "
                >
                  <h2 className="text-[32px] leading-[38.73px] font-medium md:text-left text-center">
                    Thank you for your enquiry.
                  </h2>
                  <p className="text-[.8rem] md:text-left text-center">
                    We've identified the best deals for you and have forwarded
                    your enquiry to the selected banks listed below.
                    <br className="hidden lg:block" /> We will promptly update
                    you with the most suitable package available.
                  </p>
                </div>
                <div className="hidden-mobile">
                  <button
                    onClick={reloadPage}
                    className="py-[12px] px-[21px] bg-[#181818] text-white font-normal text-[16px] 
             leading-[19.68px] hover:bg-[#000FDC] transition-colors duration-500 w-full
             flex items-center justify-center rounded-full"
                  >
                    <MdHome className="w-4 h-4 mr-2 dark:invert" />
                    Return Home Page
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex flex-row items-center py-4 px-6 text-white justify-center w-full">
                <div className="flex flex-row items-center justify-between w-full text-center">
                  <h2 className="w-full">Bank</h2>
                  <h2 className="w-full">Rate Type</h2>
                  <h2 className="w-full">Lock In</h2>
                  <h2 className="w-full">Interest Rate</h2>
                  <h2 className="w-full">Monthly Installment</h2>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-b border-[#d8d8d8] flex flex-col py-[24px] gap-[13px] text-white">
              <h2 className="text-[32px] leading-[38.73px] font-medium lg:text-left text-center">
                Oppsss, we couldn't find any suitable banks for you.
              </h2>
              <p className="text-[.8rem] lg:text-left text-center">
                We've identified that there are no deals for you.
                <br className="hidden lg:block" /> We will promptly update you
                with the most suitable package available.
              </p>
            </div>
          )}
          {responseData && (
            <div className="flex flex-col font-medium mt-6 lg:mt-0 gap-4">
              {responseData.map((bank) => (
                <CardsEnquiry
                  key={bank.bankId}
                  bankLogo={convertBase64ToImage(bank.bankLogo)}
                  rateType={bank.rateTypeName}
                  lockIn={`${bank.lockIn} years`}
                  interestRate={`${bank.interestRate}`}
                  monthlyInstallment={`$${bank.monthlyInstallment.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}`}
                />
              ))}
            </div>
          )}
          <div className="p-[24px] bg-[#000FDC] mt-6 rounded-lg text-white text-center lg:text-left">
            <p>
              <span className="text-[.9rem]">
                In the meantime, if you require any clarifications, please feel
                free to contact us at +65 80535055 or email us at
                <a
                  href="mailto:atlasadvisorypl@gmail.com"
                  className="underline hover:text-gray-300 ml-1"
                >
                  atlasadvisorypl@gmail.com
                </a>
              </span>
            </p>
          </div>
          <div className="mt-2 md:hidden">
            <button
              onClick={reloadPage}
              className="py-[24px] px-[21px] bg-[#181818] text-white font-normal text-[16px] 
             leading-[19.68px] hover:bg-[#000FDC] transition-colors duration-500 w-full
             flex items-center justify-center"
            >
              <MdHome className="w-4 h-4 mr-2 dark:invert" />
              Return Home Page
            </button>
          </div>
          <div className="block lg:hidden mt-12 text-white">
            <HomeFooter currentStep={step} />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
