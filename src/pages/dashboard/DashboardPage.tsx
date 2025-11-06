/* React Packages */
import { useState, useEffect } from "react";
/* Custom Hooks */
import useTab from "../../hooks/useTab";
import useSystemTheme from "../../hooks/useSystemTheme";
/* Components */
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
/* Pages */
import EnquiriesPage from "../enquiries/EnquiriesPage";
import BanksPage from "../banks/BanksPage";
/* Icons */
import background3 from "../../assets/background3Optimized.jpeg";
import background2 from "../../assets/background2Optimized.jpeg";
import background1 from "../../assets/background1Optimized.jpeg";
import DashboardCards from "./DashboardCards";
import DashboardTable from "./DashboardTable";

const DashboardPage = () => {
  const tab = useTab();
  const systemTheme = useSystemTheme();
  const [background, setBackground] = useState(background3);
  const [isDayMode, setDayMode] = useState(systemTheme === "light");
  const toggleMode = () => {
    setDayMode((prevMode) => !prevMode);
  };
  const changeBackground = (tab: string) => {
    switch (tab) {
      case "dashboard-main":
        setBackground(background3);
        break;
      case "enquiries":
        setBackground(background2);
        break;
      case "banks":
        setBackground(background1);
        break;
      default:
        setBackground(background3);
    }
  };
  useEffect(() => {
    changeBackground(tab);
  }, [tab]);
  return (
    <div className="dark:bg-[#0d0d0d] h-screen">
      <div className="fixed top-0 left-0 right-0">
        <div className="opacity-40 transform relative dark:opacity-10">
          <img
            src={background}
            alt="background"
            className="w-full h-[74.9vh] object-cover transform scale-x-[-1]"
          />
          <div className="absolute bottom-0 left-0 right-0 h-5/6 bg-gradient-to-t
           from-white dark:from-black to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-1/2 dark:h-1/8 bg-gradient-to-b
           from-white dark:from-black to-transparent" />
        </div>
      </div>
      <div
        className="flex flex-row-reverse relative top-0 overflow-hidden h-screen
      hide-scroll"
      >
        <div className="content overflow-y-auto z-10 hide-scroll w-full">
          <Navbar isDayMode={isDayMode} toggleMode={toggleMode} />
          <div
            className="border xl:w-[84.5vw] lg:w-[97vw] md:w-[95vw] h-fit rounded-t-3xl bg-[#E3E7EBB2] z-10
      pt-[38px] lg:pt-[64px] px-[20px] lg:px-[52px] dark:bg-[#181818B2] dark:border-[#0d0d0d] mx-4 pb-0
      transition-colors duration-300 relative"
          >
            {tab == "dashboard-main" && (
              <div className="space-y-[24px]">
                <DashboardCards /> <DashboardTable />
              </div>
            )}
            {tab == "enquiries" && <EnquiriesPage />}
            {tab == "banks" && <BanksPage />}
          </div>
        </div>
        <div className="relative">
          <div className="hidden xl:block sidebar overflow-y-auto h-screen hide-scroll z-10">
            <Sidebar isDayMode={isDayMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
