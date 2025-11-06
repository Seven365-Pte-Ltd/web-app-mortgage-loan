/* Custom Hooks */
import useTab from "../hooks/useTab";
/* Router */
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
/* Icons */
import logo from "../assets/logo.svg";
import dashboard from "../assets/dashboard.svg";
import user from "../assets/user.svg";
import banks from "../assets/banks.svg";
import logout from "../assets/logout.svg";
import logoWhiteBlue from "../assets/logo_white_blue.svg";

interface SidebarProps {
  isDayMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isDayMode }) => {
  const tab = useTab();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('apiToken');
    navigate('/admin');
    toast.success('Logged out successfully');
  };

  const handleBankClick = () => {
    if (location.search === "?tab=banks") {
      navigate(0); // Refresh the page
    } else {
      navigate("/dashboard?tab=banks");
    }
  };
  return (
    <div
      className="hidden lg:flex flex-col justify-between py-[15px] h-screen w-[13.458vw] font-poppins
       dark:text-white dark:opacity-4 z-10"
    >
      <div className="flex flex-col gap-[24px]">
        <div className="py-[13px] px-[32px] mb-4">
          <div className="flex flex-row items-center gap-[10px]">
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
        </div>
        <Link to="/dashboard?tab=dashboard-main">
          <button
            className={`py-4 px-8 flex items-center gap-2 ${
              tab === "dashboard-main" ? "border-l-4 border-[#000FDC]" : ""
            }`}
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
        <button
          className={`py-4 px-8 flex items-center gap-2 ${
            tab === "banks" ? "border-l-4 border-[#000FDC]" : ""
          }`}
          onClick={handleBankClick}
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
  );
};

export default Sidebar;
