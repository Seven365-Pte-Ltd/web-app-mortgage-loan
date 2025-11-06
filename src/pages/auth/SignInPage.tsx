import logoWhite from "../../assets/logo_white.svg";
import logo from "../../assets/logo.svg";
import background2 from "../../assets/background3.jpeg";
import axios, { AxiosError } from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { toast } from 'react-toastify';

interface ApiToken {
  token: string;
}

const SignInPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const usernameErrorRef = useRef<HTMLSpanElement>(null);
  const passwordErrorRef = useRef<HTMLSpanElement>(null);
  const termsErrorRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("apiToken");
    if (storedToken) {
      setToken(storedToken);
      navigate("/dashboard?tab=dashboard-main");
    }
  }, [navigate]);
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = (event.target as HTMLFormElement).username.value;
    const password = (event.target as HTMLFormElement).password.value;

    if (usernameErrorRef.current) {
      usernameErrorRef.current.textContent = "";
    }
    if (passwordErrorRef.current) {
      passwordErrorRef.current.textContent = "";
    }
    if (termsErrorRef.current) {
      termsErrorRef.current.textContent = "";
    }
    let isValid = true;
    if (username.trim() === "") {
      if (usernameErrorRef.current) {
        usernameErrorRef.current.textContent = "Username is required";
      }
      isValid = false;
    }
    if (password.trim() === "") {
      if (passwordErrorRef.current) {
        passwordErrorRef.current.textContent = "Password is required";
      }
      isValid = false;
    }
    const termsChecked = (event.target as HTMLFormElement).tandc.checked;
    if (!termsChecked) {
      if (termsErrorRef.current) {
        termsErrorRef.current.textContent = "Please check the terms";
      }
      toast.error("Please check the terms and conditions");
      isValid = false;
    }
    if (!isValid) return;

    try {
      setLoading(true);
      const response = await axios.post("/auth/login", { username, password });
      const apiToken: ApiToken = response.data;
      setToken(apiToken.token);
      localStorage.setItem("apiToken", apiToken.token);
      localStorage.setItem("username", username);
      console.log(token);
      toast.success("Successfully logged in");
      navigate("/dashboard?tab=dashboard-main");
    } catch (error) {
      console.error("Error fetching token:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          if (passwordErrorRef.current) {
            passwordErrorRef.current.textContent =
              "Incorrect username or password";
          }
          toast.error("Incorrect username or password");
        } else {
          console.error("Unexpected error:", error);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center md:h-screen w-full
     text-[#0d0d0d]">
      <div className="md:w-[565px] md:h-screen p-[30px] md:p-[42px] overflow-auto">
        <div className="space-y-[24px] flex flex-col">
          <div className="flex flex-row items-center gap-[10px]">
            <img src={logo} alt="AtlasADV_Logo" />
            <h1
              className="uppercase leading-8 tracking-widest font-normal text-base
                      font-inter"
            >
              Atlasadv
            </h1>
          </div>
          <div
            className="py-[12px] border-b-[1px] border-b-[#d8d8d8] space-y-[13px]
                  font-light font-poppins"
          >
            <h2 className="text-[24px] leading-[30px] tracking-widest">
              Sign in
            </h2>
            <div className="leading-[19.2px] text-[16px]">
              Login to your account below.
            </div>
          </div>
          <form action="" onSubmit={handleSignIn} className="w-full">
            <div className="flex flex-col mb-4">
              <div className="flex flex-col gap-[24px]">
                <label
                  htmlFor="username"
                  className="font-medium font-inter text-[#0D0D0D]"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter username.."
                  className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
                />
              </div>
              <div>
                {" "}
                {/* Wrapper for error message */}
                <span
                  ref={usernameErrorRef}
                  className="text-red-500 text-[14px] font-normal font-poppins"
                ></span>
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <div className="flex flex-col gap-[24px]">
                {" "}
                <label
                  htmlFor="password"
                  className="font-medium font-inter text-[#0D0D0D]"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter passowrd.."
                  className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
                />
              </div>
              <div>
                {" "}
                {/* Wrapper for error message */}
                <span
                  ref={passwordErrorRef}
                  className="text-red-500 text-[14px] font-normal font-poppins"
                ></span>
              </div>
            </div>
            <div className="py-[12px] border-t-[1px] border-[#d8d8d8] inline-flex gap-[12px]">
              <input
                type="checkbox"
                name="tandc"
                id="tandc"
                className="w-5 h-5 rounded border border-green-500 bg-transparent 
                    focus:ring-0 focus:border-green-500 
                    checked:bg-transparent checked:border-green-500"
              />
              <p className="font-myriad text-[14px] font-light leading-[24px]">
                Terms and conditions may not be legally required, but privacy
                policies and cookie policies are.
              </p>
            </div>
            <button
              type="submit"
              className="py-[24px] px-[21px] bg-[#181818] text-white
                  font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC] w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div
            className="border-t-[1px] border-[#d8d8d8] px-[16px] py-6 flex flex-row items-center
             justify-center md:hidden"
          >
            <p
              className="font-normal leading-[19.2px] text-center
              text-[#0D0D0D] font-poppins"
            >
              Copyright © 2010-2025 Mortgage Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <div className="md:w-[1335px] md:h-screen">
        <div className="absolute top-4 left-6 inline-flex gap-4 md:hidden">
          <img src={logoWhite} alt="AtlasADV_Logo" />
          <h1
            className="uppercase leading-8 tracking-widest font-normal text-base
                      font-inter text-white"
          >
            Atlasadv
          </h1>
        </div>
        <img
          src={background2}
          alt="Background"
          className="w-full h-[438.91px] md:h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default SignInPage;
