import { motion } from "framer-motion";

interface HomeFooterProps {
  currentStep: number;
}

const HomeFooter: React.FC<HomeFooterProps> = ({ currentStep }) => {
  return (
    <div className="">
      <div className="hidden relative lg:flex items-center justify-center">
        <div
          className="lg:absolute bottom-2 border-t border-[#303030] w-full py-[14px]
  flex flex-row items-center justify-between px-14 text-white "
        >
          <h2 className="font-light text-[12px]">
            Copyright © 2010-2025 Mortgage Inc. All rights reserved.
          </h2>
          <div className="flex flex-col gap-2 w-[240px]">
            <div className="flex items-center gap-8 justify-center font-light">
              <span>Step 1</span>
              <span>Step 2</span>
              <span>Step 3</span>
            </div>
            {/* Progress Bar */}
            <div className="w-50 h-[2px] bg-white rounded-full">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ type: "tween", duration: 0.5 }}
                style={{ background: "#007bff" }}
              />
            </div>
          </div>
        </div>
      </div>
     <div>
       <div className="lg:hidden flex items-center justify-center -mt-6 mb-6">
        <h2 className="font-medium text-[20px]">
          Step {currentStep}<span className="text-gray-500">/3</span>
        </h2>
      </div>
      <div>
        <h2 className="lg:hidden font-light text-[16px] text-center mb-4 border-t border-[#d8d8d8] pt-2">
          Copyright © 2010-2025 Mortgage Inc.
          <br /> All rights reserved.
        </h2>
      </div>
     </div>
    </div>
  );
};

export default HomeFooter;
