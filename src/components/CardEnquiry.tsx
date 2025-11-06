interface CardsEnquiryProps {
  bankLogo: string;
  rateType: string;
  lockIn: string;
  interestRate: string;
  monthlyInstallment: string;
}

export const CardsEnquiry: React.FC<CardsEnquiryProps> = ({
  bankLogo,
  rateType,
  lockIn,
  interestRate,
  monthlyInstallment,
}) => {
  return (
    <div className="chart-shadow lg:p-6 p-4 flex flex-col lg:flex-row items-center justify-between rounded-xl bg-white space-y-4 lg:space-y-0">
      <div className="rounded-2xl border border-[#d8d8d8] flex items-center justify-center py-10 w-full lg:w-fit lg:h-[90px] lg:p-2 flex-1">
        <img
          src={bankLogo}
          alt="companyLogo"
          className="w-44 lg:h-full lg:w-full object-contain"
        />
      </div>
      <div className="flex-1 flex items-center justify-between lg:justify-center w-full px-4 lg:px-0">
        <span className="lg:hidden">Rate Type</span>
        <span>{rateType}</span>
      </div>
      <div className="flex-1 flex items-center justify-between lg:justify-center w-full px-4 lg:px-2">
        <span className="lg:hidden">Lock In</span>
        <span className="lg:ml-5">{lockIn}</span>
      </div>
      <div className="flex-1 flex items-center justify-between lg:justify-center w-full px-4 lg:px-2">
        <span className="lg:hidden">Interest Rate</span>
        <div className="flex flex-row lg:flex-col items-center text-right">
          {interestRate.split(", ").map((rate, index) => (
            <span key={index}>
            {`Year ${index + 1}: `}
            <span style={{ color: 'red' }}>{rate}%</span>
          </span>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-between lg:justify-center w-full px-4 lg:px-2">
        <span className="lg:hidden">Monthly Installment</span>
        <span className="text-green-500">{monthlyInstallment}</span>
      </div>
    </div>
  );
};
