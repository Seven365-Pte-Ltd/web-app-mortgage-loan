/* Components */
import { MainButton } from "./MainButton"
/* Icons */
import question from "../assets/question.svg"


interface PopUpAskProps {
    onConfirm: () => void;
    onCancel: () => void;
    text: string;
  }

  const PopUpAsk: React.FC<PopUpAskProps> = ({ onConfirm, onCancel, text }) => {
    return (
      <div className="flex items-center justify-center lg:w-[564px] w-full">
        <div className="flex flex-col items-center justify-center py-[58px] px-[48px] chart-shadow bg-white gap-[28px] w-full">
          <img src={question} alt="question_icon" />
          <h1 className="text-[24px] leading-[29.05px] font-medium text-center">
            Are you sure?
          </h1>
          <h2>{text}</h2>
          <div className="flex items-center gap-4 w-full">
            <MainButton onClick={onCancel} text="No" />
            <MainButton onClick={onConfirm} text="Yes" />
          </div>
        </div>
      </div>
    );
  };

export default PopUpAsk