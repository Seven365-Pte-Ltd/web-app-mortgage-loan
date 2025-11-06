/* Steps Pages */
import CompareRates from "./CompareRates";
import UserForm, { UserFormBankAxiosResponse } from "./UserForm";
import Inquiry from "./Inquiry";
import HomeFooter from "./HomeFooter";
import { CompareRatesFormData } from "../../pages/home/CompareRates";
import { useState } from "react";

interface InquiryFormLayoutProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

/* Steps Function */
const InquiryFormLayout: React.FC<InquiryFormLayoutProps> = ({
  step,
  nextStep,
  prevStep,
}) => {
  const [responseDataState, setResponseDataState] = useState<UserFormBankAxiosResponse[] | null>(null);
  const handleDataReceived = (data: UserFormBankAxiosResponse[]) => {
    setResponseDataState(data);
  };
  const [compareRatesData, setCompareRatesData] =
    useState<CompareRatesFormData>({
      isRefinance: false,
      isNewPurchaces: false,
      selectedOption: null,
      selectedOptionBank: null,
      purchasePrice: 0,
      loanAmount: 0,
      loanTenure: 0,
      consentChecked: false,
    });
  switch (step) {
    case 1:
      return (
        <div className="">
          <CompareRates
            nextStep={(formData: CompareRatesFormData) => {
              setCompareRatesData(formData);
              nextStep();
            }}
          />
          <HomeFooter currentStep={step} />{" "}
        </div>
      );
    case 2:
      return (
        <div>
          <UserForm
            nextStep={nextStep}
            prevStep={prevStep}
            compareRatesData={compareRatesData}
            onDataReceived={handleDataReceived}
          />
          <HomeFooter currentStep={step} />{" "}
        </div>
      );
    case 3:
      return (
        <div className="">
          <Inquiry step={step} responseData={responseDataState} />
          <div className="hidden lg:block">
            <HomeFooter currentStep={step} />{" "}
          </div>
        </div>
      );
    default:
      return <div>Error</div>;
  }
};

export default InquiryFormLayout;
