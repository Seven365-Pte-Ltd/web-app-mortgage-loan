interface ButtonProps {
    onClick: () => void;
    text: string;
  }

export const MainButton: React.FC<ButtonProps> = ({ onClick, text }) => {
    return (
      <button
        onClick={onClick}
        className="py-[24px] px-[21px] bg-[#181818] text-white
        font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
        transition-colors duration-500 w-full"
      >
        {text}
      </button>
    );
  };