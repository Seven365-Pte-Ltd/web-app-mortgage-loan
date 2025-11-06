import background from "../../assets/background.svg";
import logo from "../../assets/logo.svg";
import google from "../../assets/google.svg";
import outlook from "../../assets/outlook.svg";
import logoWhite from "../../assets/logo_white.svg";

const SignUpPage = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center md:h-screen w-full text-[#0d0d0d]">
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
                font-light"
          >
            <h2 className="text-[24px] leading-[30px] tracking-widest font-poppins">
              Sign up
            </h2>
            <div className="leading-[19.2px] text-[16px] font-myriad">
              Enter your details below to create your account or sign up with
              google or outlook and get started.
            </div>
          </div>
          <button
            className="border-[1px] border-[#d8d8d8] inline-flex items-center justify-center
                font-normal py-[24px] px-[21px] space-x-[10px] hover:bg-gray-100 font-poppins"
          >
            <span>Sign up with Google</span>
            <img src={google} alt="Google_Logo" />
          </button>
          <button
            className="border-[1px] border-[#d8d8d8] inline-flex items-center justify-center
                font-normal py-[24px] px-[21px] space-x-[10px] hover:bg-gray-100 font-poppins"
          >
            <span>Sign up with Outlook</span>
            <img src={outlook} alt="Outlook_Logo" />
          </button>
          <div className="flex flex-col gap-[24px]">
            <label
              htmlFor="full_name"
              className="font-medium font-inter text-[#0D0D0D]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              placeholder="Enter full name.."
              className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
            />
          </div>
          <div className="flex flex-col gap-[24px]">
            <label
              htmlFor="email"
              className="font-medium font-inter text-[#0D0D0D]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address.."
              className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
            />
          </div>
          <div className="flex flex-col gap-[24px]">
            <label
              htmlFor="date_of_birth"
              className="font-medium font-inter text-[#0D0D0D]"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="date"
              placeholder="mm/dd/yyyy"
              className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
            />
          </div>
          <div className="flex flex-col gap-[24px]">
            <label
              htmlFor="phone_number"
              className="font-medium font-inter text-[#0D0D0D]"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter phone number.."
              className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
            />
          </div>
          <div className="flex flex-col gap-[24px]">
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
          <div className="flex flex-col gap-[24px]">
            <label
              htmlFor="confirm_password"
              className="font-medium font-inter text-[#0D0D0D]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm_password"
              placeholder="Enter confirm password.."
              className="border-[1px] border-[#d8d8d8] px-[21px] py-[24px]"
            />
          </div>
          <div className="py-[12px] border-t-[1px] border-[#d8d8d8] inline-flex gap-[12px]">
            <input type="checkbox" name="tandc" id="tandc" className="w-5 h-5 rounded border border-green-500 bg-transparent 
                  focus:ring-0 focus:border-green-500 
                  checked:bg-transparent checked:border-green-500"/>
            <p className="font-myriad text-[14px] font-light leading-[24px]">
              Terms and conditions may not be legally required, but privacy
              policies and cookie policies are.
            </p>
          </div>
          <button
            type="submit"
            className="py-[24px] px-[21px] bg-[#181818] text-white
                font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]"
          >
            Sign Up
          </button>
          <div className="border-t-[1px] border-[#d8d8d8] px-[16px] py-6 flex flex-row items-center justify-center
          md:hidden">
            <p className="font-normal leading-[19.2px] text-center
            text-[#0D0D0D]">Copyright © 2010-2025 Mortgage Inc. All rights reserved.</p>
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
          src={background}
          alt="Background"
          className="w-full h-[438.91px] md:h-full object-cover"
        />
      </div>
    </div>
  );
}

export default SignUpPage