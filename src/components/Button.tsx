interface ButtonProps {
  onClick: () => void;
  text: string;
  imgSrc?: string;
  isSelected: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  text,
  imgSrc,
  isSelected,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-[10px] py-[32px] w-full
        hover:bg-[#000fdc]  transition-colors duration-500 hover:text-white ${
          isSelected
            ? "bg-[#000fdc] invert-selected text-white"
            : "bg-[#f4f4f4] invert-img"
        }`}
    >
      {imgSrc && (
        <img src={imgSrc} alt="icon" className="hover:invert" />
      )}
      {text}
    </button>
  );
};
