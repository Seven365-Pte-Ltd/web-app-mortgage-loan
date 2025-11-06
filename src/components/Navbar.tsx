/* React Packages */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useTab from "../hooks/useTab";
import { toast } from 'react-toastify';

/* Icons */
import logo from "../assets/logo.svg";
import logoWhiteBlue from "../assets/logo_white_blue.svg";
import { IoCloseSharp } from "react-icons/io5";
import dashboard from "../assets/dashboard.svg";
import user from "../assets/user.svg";
import banks from "../assets/banks.svg";
import logout from "../assets/logout.svg";

interface NavbarProps {
  isDayMode: boolean;
  toggleMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDayMode, toggleMode }) => {
  const tab = useTab();
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", !isDayMode);
    window.localStorage.setItem("theme", JSON.stringify(isDayMode));
  }, [isDayMode]);
  const username = localStorage.getItem("username");
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";
  /* Show sidebar */
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleLogout = () => {
    localStorage.removeItem('apiToken');
    navigate('/admin');
    toast.success('Logged out successfully');
  };
  return (
    <div
      className="py-4 font-poppins z-50 dark:text-white px-10 flex flex-row items-center
      justify-between xl:justify-end"
    >
      {showSidebar && (
        <div
          className="xl:hidden fixed top-0 left-0 h-screen z-50 w-full
        bg-white dark:bg-[#0d0d0d] dark:text-white px-4 py-4"
        >
          <div className="flex flex-col gap-4 h-full">
            <div className="border-b pb-4 flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-[10px] xl:hidden">
                {isDayMode ? (
                  <img src={logo} alt="AtlasADV_Logo" />
                ) : (
                  <img src={logoWhiteBlue} alt="AtlasADV_Logo" />
                )}
                <h1
                  className="uppercase leading-8 tracking-widest font-normal text-base
                    font-inter"
                >
                  Atlasadv
                </h1>
              </div>
              <button
                className="bg-[#000fdc] dark:bg-[#282828] p-2 rounded-full hover:bg-[#0d0d0d] dark:hover:bg-[#000fdc]
              text-white"
                onClick={toggleSidebar}
              >
                <IoCloseSharp className="" />
              </button>
            </div>
            <div className="flex flex-row items-center gap-4 py-4 border-b pb-6">
              <button className="rounded-full bg-[#000fdc] p-[10px] w-10 h-10">
                <h2 className="text-center text-white leading-[19.68px] font-normal">
                  {firstLetter}
                </h2>
              </button>
              <div className="flex flex-col">
                <h2 className="font-medium">{username}</h2>
                <span className="text-[12px]">Admin</span>
              </div>
            </div>
            <div className="flex flex-col gap-24 h-full justify-between">
              <div className="flex flex-col gap-[24px]">
                <Link to="/dashboard?tab=dashboard-main">
                  <button
                    className={`py-4 px-8 flex items-center gap-2 ${
                      tab === "dashboard-main"
                        ? "border-l-4 border-[#000FDC]"
                        : ""
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span>
                      <img
                        src={dashboard}
                        alt="dashboard_icon"
                        className="w-4 h-4 dark:invert"
                      />
                    </span>
                    <h2 className="leading-5 font-normal">Dashboard</h2>
                  </button>
                </Link>
                <Link to="/dashboard?tab=enquiries">
                  <button
                    className={`py-4 px-8 flex items-center gap-2 ${
                      tab === "enquiries" ? "border-l-4 border-[#000FDC]" : ""
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span>
                      <img
                        src={user}
                        alt="dashboard_icon"
                        className="w-4 h-4 dark:invert"
                      />
                    </span>
                    <h2 className="leading-[19.68px] font-normal">Enquiries</h2>
                  </button>
                </Link>
                <Link to="/dashboard?tab=banks">
                  <button
                    className={`py-4 px-8 flex items-center gap-2 ${
                      tab === "banks" ? "border-l-4 border-[#000FDC]" : ""
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span>
                      <img
                        src={banks}
                        alt="dashboard_icon"
                        className="w-4 h-4 dark:invert"
                      />
                    </span>
                    <h2 className="leading-[19.68px] font-normal">Banks</h2>
                  </button>
                </Link>
              </div>
              <button
                className="py-[16px] px-[32px] flex items-center
        gap-2"
                onClick={handleLogout}
              >
                <span>
                  <img
                    src={logout}
                    alt="dashboard_icon"
                    className="w-4 h-4 dark:invert"
                  />
                </span>
                <h2 className="leading-[19.68px] font-normal">Logout</h2>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row items-center gap-[10px] xl:hidden">
        {isDayMode ? (
          <img src={logo} alt="AtlasADV_Logo" />
        ) : (
          <img src={logoWhiteBlue} alt="AtlasADV_Logo" />
        )}
        <h1
          className="uppercase leading-8 tracking-widest font-normal text-base
                    font-inter"
        >
          Atlasadv
        </h1>
      </div>
      <div className="flex flex-row gap-6 lg:gap-12 items-center justify-end">
        <div className="flex flex-row items-center gap-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={toggleMode}
              checked={!isDayMode}
            />
            <div
              className="relative w-11 h-6 bg-gray-200 rounded-full peer
            dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
             peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
               dark:border-gray-600 peer-checked:bg-slate-900"
            ></div>
            <span className="hidden lg:block ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {isDayMode ? "Light Mode" : "Dark Mode"}
            </span>
          </label>
        </div>
        <div className="flex flex-row items-center gap-4">
          <button
            className="rounded-full bg-[#000fdc] p-[10px] w-10 h-10"
            onClick={toggleSidebar}
          >
            <h2 className="text-center text-white leading-[19.68px] font-normal">
              {firstLetter}
            </h2>
          </button>
          <div className="hidden lg:block">
            <h2>{username}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
