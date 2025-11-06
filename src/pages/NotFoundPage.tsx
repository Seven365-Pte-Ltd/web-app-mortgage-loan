import { useEffect, useState } from "react";
import notfound from "../assets/notfound.svg";
const NotFoundPage = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);
  }, []);
  
  return (
    <div className={`h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}
    flex flex-col justify-center items-center`}>
      <img src={notfound} alt="not_found" className="w-[300px] h-[300px] animate-pulse"/>
      <h1 className="text-red-500 font-bold text-[2.5rem] font-poppins
      tracking-wide animate-pulse">Page Not Found</h1>
    </div>
  );
};

export default NotFoundPage;
