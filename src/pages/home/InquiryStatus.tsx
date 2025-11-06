/* Packages */
import axios from "axios";
import { toast } from "react-toastify";
import { useParams  } from "react-router-dom";
/* Image */
import background2 from "../../assets/background2.jpeg";
import logoWhite from "../../assets/logo_white.svg";
/* import dbsLogo from "../../assets/dbs.svg"; */
import bigCheck from "../../assets/bigCheck.svg";
/* Components */
import StatusTypeSelector from "../../components/StatusTypeSelector";
import { InformationRow } from "../../components/EnquiryView";
import { useState, useEffect, useRef } from "react";
import PopUpAsk from "../../components/PopUpAsk";

interface Bank {
  bankId: number;
  bankLogo: string;
  bankName: string;
}
interface Option {
  text: string;
}

interface InquiryData {
  id: number;
  enquiryNo: string;
  loanType: number;
  loanTypeName: string;
  propertyType: number;
  propertyTypeName: string;
  loanAmount: number;
  loanTenure: number;
  rateType: number;
  rateTypeName: string;
  fullName: string;
  email: string;
  contactNo: string;
  status: number;
  statusName: string;
  createdDate?: string;
  banks?: Bank[];
}

const base64ToImage = (base64String: string): string => {
  return `data:image/png;base64,${base64String}`;
};

const InquiryStatus = () => {
  const [inquiryData, setInquiryData] = useState<InquiryData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const options: Option[] = [
    { text: "Client Contacted" },
    { text: "Documents Submitted" },
    { text: "Pending Submission" },
    { text: "Considering" },
    { text: "Loan Accepted" },
    { text: "Not Interested" },
  ];
  const { id, bankId } = useParams<{ id: string; bankId: string }>();
  /* Get Enquiry Data */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios.get<InquiryData>(`/enquiry/${id}`);
          setInquiryData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, bankId]);
  /* Update Enquiry Status */
  const handleStatusUpdate = async (option: Option) => {
    if (inquiryData) {
      try {
        await axios.put(`/enquiry`, {
          id: inquiryData.id,
          status: getStatusValue(option.text),
        });
        setInquiryData((prevData) =>
          prevData ? { ...prevData, statusName: option.text } : null
        );
        toast.success("Status updated successfully.");
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error("Failed to update status. Please try again later.");
      }
    }
  };
  const getStatusValue = (statusName: string): number => {
    switch (statusName) {
      case "Client Contacted":
        return 0;
      case "Documents Submitted":
        return 1;
      case "Pending Submission":
        return 2;
      case "Considering":
        return 3;
      case "Loan Accepted":
        return 4;
      case "Not Interested":
        return 5;
      default:
        return -1;
    }
  };
  const getDisplayName = (statusName: string) => {
    switch (statusName) {
      case "ClientContacted":
        return "Client Contacted";
      case "DocumentsSubmitted":
        return "Documents Submitted";
      case "PendingSubmission":
        return "Pending Submission";
      case "Considering":
        return "Considering";
      case "LoanAccepted":
        return "Loan Accepted";
      case "NotInterested":
        return "Not Interested";
      default:
        return statusName;
    }
  };
  
  /* Option Click Handler */
  const handleOptionClick = (option: Option) => {
    setSelectedOption((prevOption) => (prevOption === option ? null : option));
    setIsOpen(false);
  };
  /* Sumbit Handler */
  const handleSubmit = () => {
    setShowConfirmation(true);
  };
  /* Confirm Submit Handler */
  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    try {
      if (selectedOption) {
        await handleStatusUpdate(selectedOption);
        setShowSuccessModal(true);
      } else {
        toast.error("Please select a status option.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again later.");
    }
  };
  /* Cancel Submit Handler */
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };
  /* Close Chart Data */
  useEffect(() => {
    /* Exit when clicked outside */
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuccessModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="lg:h-screen relative lg:block flex flex-col font-poppins">
      <img
        src={background2}
        alt="background_image"
        className={`lg:h-screen w-full object-cover transform scale-x-[-1] lg:-z-10`}
      />
      <div
        className="lg:absolute bottom-0 left-0 right-0 h-3/6 lg:bg-gradient-to-t
       from-black dark:from-black to-transparent"
      />
      {showConfirmation && (
        <div className="h-screen absolute lg:top-0 -bottom-24 left-0 w-full z-50 lg:bg-black/70">
          <div className="flex items-center justify-center h-full px-4 lg:px-0">
          <PopUpAsk
            onConfirm={handleConfirmSubmit}
            onCancel={handleCancelSubmit}
            text=""
          />
        </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="h-screen absolute lg:top-0 -bottom-24 left-0 w-full z-50 lg:bg-black/70
        flex items-center justify-center">
          <div
          ref={containerRef}
          className=" mx-4 border bg-white flex items-center justify-center w-full h-[300px] lg:max-w-lg pop-shadow"
        >
          <div className="flex flex-col items-center justify-center">
            <img src={bigCheck} alt="bigcheck" />
            <h2 className="text-[30px] font-medium">Status Sent</h2>
          </div>
        </div>
        </div>
      )}
      <div>
      <div className="absolute lg:top-[40px] lg:left-[48px] flex items-center gap-4 top-[25px] left-[25px]">
        <img src={logoWhite} alt="altasADV_logo" />
        <h1
          className="uppercase leading-[29.05px] tracking-widest font-normal text-base
                    font-inter text-white"
        >
          ATLASADV
        </h1>
      </div>
      <div className="lg:absolute w-full top-[102px] bottom-[100px]
       flex items-center justify-center lg:overflow-y-auto lg:max-h-[82vh]">
      {inquiryData && (
        <div
        className="flex items-center justify-center flex-col bg-white card-shadow
        w-full max-w-5xl"
      >
          <div
            className="w-full py-[24px] px-[42px] border-b border-[#d8d8d8]
        tracking-wide font-normal text-[24px]"
          >
            {inquiryData.enquiryNo}
          </div>
          <div className="w-full flex md:flex-row justify-between flex-col">
            <div className="p-[42px] space-y-[24px] flex flex-col w-full">
              <div className="space-y-[24px]">
                <h2 className="font-medium text-xl">Personal Information</h2>
                <InformationRow
                  label="Full name"
                  value={inquiryData.fullName}
                />
                <InformationRow label="Email" value={inquiryData.email} />
                <InformationRow
                  label="Phone Number"
                  value={inquiryData.contactNo}
                />
              </div>
              <div className="space-y-[24px]">
                <h2 className="font-medium">Loan Information</h2>
                <InformationRow
                  label="Loan Type"
                  value={inquiryData.loanTypeName}
                />
                <InformationRow
                  label="Property Type"
                  value={inquiryData.propertyTypeName}
                />
                <InformationRow
                  label="Loan Amount (SGD)"
                  value={inquiryData.loanAmount.toString()}
                />
                <InformationRow
                  label="Loan Tenure (Years)"
                  value={inquiryData.loanTenure.toString()}
                />
              </div>
              <div className="space-y-[24px]">
                <h2 className="font-medium">Rate</h2>
                <InformationRow
                  label="Rate Type"
                  value={inquiryData.rateTypeName}
                />
              </div>
            </div>
            <div className="p-[42px] space-y-[24px] flex flex-col w-full">
              <div className="border border-[#d8d8d8] p-[24px] flex items-center dark:border-[#303030] justify-center h-[253px]">
                {inquiryData.banks && inquiryData.banks.length > 0 ? (
                  <img
                    src={base64ToImage(inquiryData.banks[0].bankLogo)}
                    alt="bank_logo"
                    className="w-1/2 h-full object-contain"
                  />
                ) : (
                  <div className="w-1/2 h-full flex items-center justify-center text-gray-400">
                    {inquiryData.banks && inquiryData.banks.length > 0
                      ? `${inquiryData.banks[0].bankName} Logo Unavailable`
                      : "Logo Unavailable"}
                  </div>
                )}
              </div>

              <StatusTypeSelector
                options={options}
                selectedOption={selectedOption}
                handleOptionClick={handleOptionClick}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                currentStatus={getDisplayName(inquiryData.statusName)}
              />
              <button
                onClick={handleSubmit}
                className="py-[24px] px-[21px] bg-[#000FDC] text-white
                    font-normal text-[16px] leading-[19.68px] hover:bg-[#181818]
                    transition-colors duration-500 w-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <div>
        <div className="hidden relative lg:flex items-center justify-center w-full">
          <div
            className="lg:absolute bottom-2 border-t border-[#303030] w-full py-[14px]
                        flex flex-row items-center justify-between px-14 text-white "
          >
            <h2 className="font-light text-[12px]">
              Copyright © 2010-2025 Mortgage Inc. All rights reserved.
            </h2>
          </div>
        </div>
        <div>
          <h2 className="lg:hidden font-light text-[16px] text-center mb-4 border-t border-[#d8d8d8] pt-2">
            Copyright © 2010-2025 Mortgage Inc.
            <br /> All rights reserved.
          </h2>
        </div>
      </div>
      </div>
    </div>
  );
};

export default InquiryStatus;
