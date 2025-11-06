/* Routers */
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import NotFoundPage from "./pages/NotFoundPage";
/* import SignUpPage from "./pages/auth/SignUpPage"; */
import SignInPage from "./pages/auth/SignInPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Home from "./pages/home/Home";
import InquiryStatus from "./pages/home/InquiryStatus";

import { useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TermsAndCondition from "./pages/home/TermsAndCondition";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  useEffect(() => {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);
  }, []);
  return (
    <div>
      <ToastContainer position="top-right" theme={isDarkMode ? "dark" : "light"} />
      <div></div>
      <main>
        <Routes>
          {/* Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/terms-and-condition" element={<TermsAndCondition/>} />
          <Route path="/enquirystatus/:id" element={<InquiryStatus/>} />
          <Route path="/admin" element={<SignInPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
