// Reusable Input Component
export const InputWithIcon: React.FC<{
  imgSrc: string;
  placeholder: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ imgSrc, placeholder, value, name, onChange }) => {
  return (
    <div className="relative hover:ring-1 hover:ring-[#000fcd] transition-all duration-500">
      <div className="absolute inset-y-0 left-0 -top-[1px] flex items-center pl-6 pointer-events-none">
        <img src={imgSrc} alt="icon" className="max-w-6"/>
      </div>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        className="w-full border border-[#d8d8d8] py-[18px] pl-14 pr-4 shadow-sm
         focus:outline-none focus:ring-1 focus:ring-[#000fcd] transition-all duration-500
         dark:bg-[#0d0d0d] dark:text-white dark:border-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
