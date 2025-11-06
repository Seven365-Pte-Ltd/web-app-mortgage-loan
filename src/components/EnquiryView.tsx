/* Icons */
/* import { useState } from "react"; */
import close from "../assets/close.svg";
import { IoSadOutline } from "react-icons/io5";

import { Enquiry } from "../pages/enquiries/EnquiriesPage";

interface InformationRowProps {
  label: string;
  value: string;
}

interface EnquiryViewProps {
  enquiry: Enquiry;
  onClose: () => void;
}

const base64ToImage = (base64String: string): string => {
  return `data:image/png;base64,${base64String}`;
};

export const InformationRow: React.FC<InformationRowProps> = ({ label, value }) => {
  let textColorClass = "";
  
  let displayValue = value;
  if (value === "NoBanks") {
    displayValue = "No Banks";
  } if (value === "Submitted") {
    displayValue = "Submitted";
  }
  switch (value) {
    case "Submitted":
      textColorClass = "text-green-600 bg-green-100 px-4 py-2 rounded-full";
      break;
    case "Failed":
      textColorClass = "text-red-600 bg-red-100 px-4 py-2 rounded-full"
      break;
    case "NoBanks":
      textColorClass = "text-blue-600 bg-blue-100 px-4 py-2 rounded-full";
      break;
    default:
      textColorClass = "";
  }

  return (
    <span className="flex items-center justify-between whitespace-nowrap gap-6 text-[12px] lg:text-normal overflow-hidden text-ellipsis">
      {label}
      <div className="border border-dotted border-[#303030] w-full text-[12px]" />
      {label === "Loan Type" && value === "NewPurchase" ? (
        <span className={textColorClass}>New Purchase</span>
      ) : label === "Property Type" && value === "PrivateResidential" ? (
        <span className={textColorClass}>Private Residential</span>
      ) : (
        <span className={`${textColorClass}`}>
        {displayValue}
        </span>
      )}
    </span>
  );
};

const EnquiryView: React.FC<EnquiryViewProps> = ({ enquiry, onClose }) => {
  const bankLogoData = enquiry.bankLogo;
  const bankName = enquiry.bankName || '';
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
  return (
    <div
      className="font-poppins w-full bg-white dark:bg-[#0d0d0d] dark:text-white h-full pb-8
    overflow-hidden"
    >
      <div
        className="flex flex-row items-center justify-between w-full py-[24px] lg:px-[42px] px-[12px]
        border-b border-[#d8d8d8] dark:border-[#303030]"
      >
        <h1 className="dark:text-white lg:text-[24px] leading-[29.52px] text-[18px]">
          {enquiry.enquiryNo}
        </h1>
        <img
          src={close}
          alt="close_icon"
          className="dark:invert"
          onClick={onClose}
        />
      </div>
      <div className="lg:p-[42px] space-y-[24px] flex flex-col px-[12px] py-[32px]">
        <div className="space-y-[24px] text-wrap overflow-hidden text-ellipsis">
          <h2 className="font-semibold text-xl">Personal Information</h2>
          <InformationRow label="Full name" value={enquiry.fullName} />
          <InformationRow label="Email" value={enquiry.email} />
          <InformationRow label="Phone Number" value={enquiry.contactNo} />
        </div>
        <div className="space-y-[24px]">
          <h2 className="font-semibold">Loan Information</h2>
          <InformationRow
            label="Loan Type"
            value={
              enquiry.loanTypeName === "NewPurchase"
                ? "New Purchase"
                : enquiry.loanTypeName
            }
          />
          <InformationRow
            label="Property Type"
            value={enquiry.propertyTypeName}
          />
          <InformationRow
            label="Loan Amount (SGD)"
            value={enquiry.loanAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          />
          <InformationRow
            label="Loan Tenure (Years)"
            value={enquiry.loanTenure.toString()}
          />
        </div>
        <div className="space-y-[24px]">
          <h2 className="font-semibold">Rate</h2>
          <InformationRow label="Rate Type" value={enquiry.rateTypeName} />
        </div>
        <div className="space-y-[24px]">
          <InformationRow
            label="Message Status"
            value={enquiry.whatsAppMessageStatusName}
          />
        </div>
        <div className="space-y-[24px]">
          <InformationRow
            label="Banker"
            value={enquiry.assignedBankerName}
          />
        </div>
      </div>
      <div className="lg:px-[42px] space-y-[18px] flex flex-col h-full w-full px-[12px]">
        <div
          className="lg:border border-[#d8d8d8] p-[24px] flex items-center gap-[24px]
       dark:border-[#303030] lg:min-w-[30rem]"
        >
          {bankName ? (
            <div className="flex lg:flex-row flex-col items-center justify-center gap-6 w-full">
              <div className="border border-[#d8d8d8] lg:w-full h-[100px] flex items-center justify-center bg-white w-full lg:max-w-sm">
                {bankLogoData ? (
                  <img src={base64ToImage(bankLogoData)} alt={bankName} />
                ) : (
                  <span className="text-red-500">No image found</span>
                )}
              </div>
              <div className="border-b w-full lg:hidden border-[#747474]" />
              <div className="w-full lg:max-w-xs max-w-xs">
                <p className="whitespace-normal text-center lg:text-left">
                  {bankName}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-red-500 text-center py-10 w-full flex flex-row items-center gap-4 justify-center">
              <IoSadOutline className="w-6 h-6" /> No Banks Available
            </div>
          )}
        </div>

        <h2 className="font-semibold">Enquiry Status</h2>
        <div
          className="bg-[#303030] py-[24px] px-[21px] text-center text-white
        lg:min-w-[30rem]"
        >
          {getDisplayName(enquiry.statusName)}
        </div>
      </div>
    </div>
  );
}

export default EnquiryView