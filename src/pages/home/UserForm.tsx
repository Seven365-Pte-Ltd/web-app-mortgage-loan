/* Packages */
import { useEffect, useRef, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
/* Components */
import { InputWithIcon } from "../../components/InputWithIcon";
import { Button } from "../../components/Button";
import { MainButton } from "../../components/MainButton";
import PopUpAsk from "../../components/PopUpAsk";
import { CompareRatesFormData } from "./CompareRates";

/* Icons */
import logoWhite from "../../assets/logo_white.svg";
import fixed from "../../assets/fixed.svg";
import both from "../../assets/both.svg";
import floating from "../../assets/floating.svg";
import user2 from "../../assets/user2.svg";
/* import call2 from "../../assets/call2.svg"; */
import email2 from "../../assets/email2.svg";

interface CombinedFormData extends CompareRatesFormData {
  rateType: string;
  email: string;
  name: string;
  contactNumber: string;
}
interface UserFormProps {
  nextStep: (combineData: CombinedFormData) => void;
  prevStep: () => void;
  compareRatesData: CompareRatesFormData;
  onDataReceived: (responseData: UserFormBankAxiosResponse[]) => void;
}
export interface UserFormBankAxiosResponse {
  bankId: number;
  bankName: string;
  bankLogo: string;
  rateTypeName: string;
  lockIn: number;
  interestRate: number;
  monthlyInstallment: number;
  contactNo: string;
  enquiryId: string;
}

const UserForm: React.FC<UserFormProps> = ({
  nextStep,
  prevStep,
  compareRatesData,
  onDataReceived,
}) => {
  const [selectedButton, setSelectedButton] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState<number>(0);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const contactNumberRef = useRef<HTMLDivElement>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const rateTypeRef = useRef<HTMLDivElement>(null);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleContactNumberChange = (value: string) => {
    setContactNumber(value);
  };
  const handleButtonClick = (buttonText: string) => {
    setSelectedButton(buttonText);
  };
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setIsCaptchaVerified(true);
    }
  };
  const handleSubmit = () => {
    const newErrors: string[] = [];
    const isNameValid = name.trim() !== "";
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const contactNumberWithoutCountryCode = contactNumber.substring(3);
    const isContactNumberValid = /^\d{7,}$/.test(contactNumberWithoutCountryCode);

    if (selectedButton === "") newErrors.push("Please select a rate type");
    if (!isNameValid) newErrors.push("Name is required");
    if (!isEmailValid) newErrors.push("Please enter a valid email");
    if (!isContactNumberValid) newErrors.push("Please enter a valid contact number");
    if (!isCaptchaVerified) newErrors.push("Please verify reCAPTCHA");

    if (newErrors.length === 0) {
      setShowConfirmation(true);
    } else {
      setErrors(newErrors);
      setCurrentErrorIndex(0);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      switch (errors[currentErrorIndex]) {
        case "Please select a rate type":
          rateTypeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        case "Name is required":
          nameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        case "Please enter a valid email":
          emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        case "Please enter a valid contact number":
          contactNumberRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        case "Please verify reCAPTCHA":
          recaptchaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          break;
        default:
          break;
      }
    }
  }, [errors, currentErrorIndex]);

  const handleConfirmSubmit = async () => {
    setShowConfirmation(false);
    const combinedData: CombinedFormData = {
      ...compareRatesData,
      rateType: selectedButton,
      name: name,
      email: email,
      contactNumber: contactNumber,
    };
    nextStep(combinedData);

    const apiData = {
      loanType: combinedData.isRefinance ? 1 : 0,
      propertyType:
        combinedData.selectedOption?.text === "Private Residential"
          ? 0
          : combinedData.selectedOption?.text === "Housing & Development Board"
          ? 1
          : combinedData.selectedOption?.text === "Commercial"
          ? 2
          : combinedData.selectedOption?.text === "Building Under Construction"
          ? 3
          : "",
      loanAmount: combinedData.loanAmount,
      loanTenure: combinedData.loanTenure,
      rateType:
        combinedData.rateType === "Both"
          ? 0
          : combinedData.rateType === "Fixed"
          ? 1
          : combinedData.rateType === "Floating"
          ? 2
          : "",
      fullName: combinedData.name,
      email: combinedData.email,
      contactNo: combinedData.contactNumber,
      bankId: combinedData.selectedOptionBank?.id,
    };

    try {
      const response = await axios.post("/enquiry", apiData);
      onDataReceived(response.data);
      localStorage.removeItem("compareRatesFormData");
    } catch (error) {
      console.log(error);
    }
  };
  /* Display the pop confirmation for submmission */
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="font-poppins text-[#0d0d0d]">
      <div className="absolute lg:top-[40px] lg:left-[48px] flex items-center gap-4 top-[25px] left-[25px]">
        <img src={logoWhite} alt="altasADV_logo" />
        <h1 className="uppercase leading-[29.05px] tracking-widest font-normal text-base font-inter text-white cursor-pointer"
        onClick={prevStep}>
          ATLASADV
        </h1>
      </div>
      {showConfirmation && (
        <div className="h-screen absolute lg:top-0 -bottom-24 left-0 w-full z-50 lg:bg-black/70 ">
          <div className="flex items-center justify-center h-full px-4 lg:px-0">
            <PopUpAsk
              onConfirm={handleConfirmSubmit}
              onCancel={handleCancelSubmit}
              text="Your information will be sent to the banks. Okay?"
            />
          </div>
        </div>
      )}
      <div
        className="lg:absolute top-[102px] left-[145px] bottom-[100px] p-[42px] flex flex-col gap-[24px] bg-white lg:w-[565px]
       lg:overflow-y-auto lg:max-h-[82vh] -mt-4"
      >
        <div className="border-b border-[#d8d8d8] flex flex-col gap-[10px] py-[10px]">
          <h1 className="uppercase leading-[29.05px] text-[24px] font-normal tracking-widest lg:text-left text-center">
            What are you looking for?
          </h1>
          <p className="font-light text-normal text-[.79em] lg:text-left text-center">
            Simply fill in the form below to use our free loan comparison
            service.
          </p>
        </div>
        <div ref={rateTypeRef} className="flex flex-col gap-[20px]">
          <h2 className="font-medium text-[16px] leading-[19.68px]">
            Rate Type
          </h2>
          <div className="flex items-center gap-[6px] w-full">
            <Button
              imgSrc={both}
              text="Both"
              onClick={() => handleButtonClick("Both")}
              isSelected={selectedButton === "Both"}
            />
            <Button
              imgSrc={fixed}
              text="Fixed"
              onClick={() => handleButtonClick("Fixed")}
              isSelected={selectedButton === "Fixed"}
            />
            <Button
              imgSrc={floating}
              text="Floating"
              onClick={() => handleButtonClick("Floating")}
              isSelected={selectedButton === "Floating"}
            />
          </div>
          {errors[currentErrorIndex] === "Please select a rate type" && (
            <p className="text-red-500 text-sm text-center flex flex-row items-center gap-2">
              <IoIosWarning />
              {errors[currentErrorIndex]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[14px]">
          <h2 ref={nameRef} className="font-medium text-[16px] leading-[19.68px]">Name</h2>
          <InputWithIcon
            imgSrc={user2}
            placeholder="Full Name"
            value={name}
            name="name"
            onChange={handleNameChange}
          />
          {errors[currentErrorIndex] === "Name is required" && (
            <p className="text-red-500 text-sm text-center flex flex-row items-center gap-2">
              <IoIosWarning />
              {errors[currentErrorIndex]}
            </p>
          )}

          <h2 ref={emailRef} className="font-medium text-[16px] leading-[19.68px]">Email</h2>
          <InputWithIcon
            imgSrc={email2}
            placeholder="example@email.com"
            value={email}
            name="email"
            onChange={handleEmailChange}
          />
          {errors[currentErrorIndex] === "Please enter a valid email" && (
            <p className="text-red-500 text-sm text-center flex flex-row items-center gap-2">
              <IoIosWarning />
              {errors[currentErrorIndex]}
            </p>
          )}
          <h2 ref={contactNumberRef} className="font-medium text-[16px] leading-[19.68px]">
            Contact Number
          </h2>
          <PhoneInput
            international
            defaultCountry="SG"
            value={contactNumber}
            onChange={handleContactNumberChange}
            placeholder="Enter phone number"
            className="border border-[#d8d8d8] px-6 hover:ring-1
             hover:ring-[#000fcd] transition-all duration-500 contact"
          />
          {errors[currentErrorIndex] ===
            "Please enter a valid contact number" && (
            <p className="text-red-500 text-sm text-center flex flex-row items-center gap-2">
              <IoIosWarning />
              {errors[currentErrorIndex]}
            </p>
          )}
          <div ref={recaptchaRef} className="flex items-center justify-center w-full md:bg-[#f4f4f4] py-2">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={handleCaptchaChange}
              size="normal"
            />
          </div>
          {errors[currentErrorIndex] === "Please verify reCAPTCHA" && (
            <p className="text-red-500 text-sm text-center flex flex-row items-center gap-2
            justify-center">
              <IoIosWarning />
              {errors[currentErrorIndex]}
            </p>
          )}
        </div>
        <div className="flex flex-row items-center w-full gap-4">
          <MainButton onClick={prevStep} text="Back" />
          <MainButton onClick={handleSubmit} text="Submit" />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
