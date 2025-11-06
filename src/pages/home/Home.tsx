/* Packages */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
/* Components */
import InquiryFormLayout from "./InquiryFormLayout";
import logoWhite from "../../assets/logo_white.svg";
/* Images */
import background1 from "../../assets/background1Optimized.jpeg";
import background2 from "../../assets/background2.jpeg";
import background3 from "../../assets/background3Optimized.jpeg";

const Home = () => {
  const [showDiv, setShowDiv] = useState(false);
  const [isClose, setIsClose] = useState(true);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [forceDesktopView, setForceDesktopView] = useState(false);
  const toggleDiv = () => {
    setShowDiv(!showDiv);
    setIsClose(!isClose);
  };
  const [step, setStep] = useState<number>(1);
  const [currentBackgroundSlide, setCurrentBackgroundSlide] =
    useState<number>(0);
  const [currentBackgroundSlideStable, setCurrentBackgroundSlideStable] =
    useState<number>(0);
  const [background, setBackground] = useState(background1);
  useEffect(() => {
    const fromTerms = sessionStorage.getItem("fromTerms");
    if (isMobile && fromTerms) {
      setForceDesktopView(true);
      setShowDiv(true);
      sessionStorage.removeItem("fromTerms");
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      setShowDiv(true);
    }
  }, [isMobile]);
  const slideTexts = [
    {
      title: "Are you on the lowest mortgage package in town?",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Which bank has the cheapest mortgage?",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title:
        "Do you know how much savings you can earn by refinancing your mortgage?",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Find the best mortgage in Singapore here.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Best mortgage rates for 2025.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Would you like to get preferential housing loan rates?",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Compare rates across 16 banks.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "We help you understand mortgage lingo and terms.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title: "Best solution for housing loan in Singapore.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title:
        "Make the most of refinancing to enjoy maximum savings on your home loan.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title:
        "Manage the biggest financial commitment well and make it work for you.",
      description: "Submit your enquiry and let us help you.",
    },
    {
      title:
        "SORA or SIBOR, fixed or floating, how to choose from so many confusing acronyms?",
      description: "Submit your enquiry and let us help you.",
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right
      setCurrentBackgroundSlideStable((prevSlide) =>
        prevSlide === 0 ? slideTexts.length - 1 : prevSlide - 1
      );
    } else if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      setCurrentBackgroundSlideStable((prevSlide) =>
        prevSlide === slideTexts.length - 1 ? 0 : prevSlide + 1
      );
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentBackgroundSlide(index);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = event.touches[0].clientX;
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundSlide(
        (prevSlide) => (prevSlide + 1) % slideTexts.length
      );
      switch (currentBackgroundSlide) {
        case 0:
          setBackground(background2);
          break;
        case 1:
          setBackground(background3);
          break;
        case 2:
          setBackground(background1);
          break;
        default:
          break;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBackgroundSlide, slideTexts.length]);
  useEffect(() => {
    if (!isMobile) {
      setShowDiv(true);
    }
  }, [isMobile]);

  return (
    <div className="lg:h-screen relative lg:block flex flex-col">
      {(isClose && !forceDesktopView) && (
        <div className="">
          {isMobile && (
            <div className="">
              <div className="relative">
                {/* Image */}
                <img
                  src={background}
                  alt="background_image"
                  className={`h-screen w-full object-cover transform scale-x-[-1] -z-10 ${
                    step === 3 ? "h-screen -z-10" : "h-[40vh]"
                  }`}
                  loading="lazy"
                />
                {/* Linear Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-5/6 bg-gradient-to-t from-black dark:from-black to-transparent" />
              </div>
              <div className="p-6 absolute top-0 flex flex-col justify-between h-full">
                <div className="flex items-center gap-4 top-[25px] left-[25px]">
                  <img src={logoWhite} alt="altasADV_logo" />
                  <h1 className="uppercase leading-[29.05px] tracking-widest font-normal text-base font-inter text-white">
                    ATLASADV
                  </h1>
                </div>
                <div
                  ref={containerRef}
                  className="flex flex-col items-center justify-center gap-10 overflow-hidden w-full container"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className="max-h-[50vh] overflow-hidden element">
                      <div className="text-black gap-[2px] text-center element">
                        <h1 className="text-[1.875rem] font-normal text-white text-shadow">
                          {slideTexts[currentBackgroundSlideStable].title}
                        </h1>
                        <p className="text-[0.875rem] font-normal max-w-md text-white element">
                          {slideTexts[currentBackgroundSlideStable].description}
                        </p>
                      </div>
                    </div>

                    {/* Current Slides */}
                    <div className="flex items-center gap-2">
                      {slideTexts.map((_, index) => (
                        <div
                          key={index}
                          className={`rounded-full p-1 ${
                            index <= currentBackgroundSlideStable
                              ? "bg-blue-700"
                              : "bg-white"
                          }`}
                          onClick={() => handleDotClick(index)}
                        />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={toggleDiv}
                    className="py-[24px] px-[21px] bg-[#000FDC] text-white
        font-normal text-[16px] leading-[19.68px] hover:bg-[#181818]
        transition-colors duration-500 w-full"
                  >
                    Mortgage Calculator
                  </button>
                  <div className="w-full">
                    <h2
                      className="xl:hidden font-light text-[16px] text-center mb-4 border-t border-[#d8d8d8] pt-2
                    text-white w-full"
                    >
                      Copyright © 2010-2025 Mortgage Inc.
                      <br /> All rights reserved.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {(showDiv || (isMobile && forceDesktopView)) && (
        <div className="relative">
          {/* Image */}
          <img
            src={background}
            alt="background_image"
            className={`lg:h-screen w-full object-cover transform scale-x-[-1] lg:-z-10 ${
              step === 3 ? "h-screen -z-10" : "h-[40vh]"
            }`}
            loading="lazy"
          />
          {/* Linear Gradient */}
          <div
            className="lg:absolute bottom-0 left-0 right-0 lg:h-full lg:bg-gradient-to-b from-black dark:from-black to-transparent
            mix-blend-overlay"
          />
          <div className="lg:absolute bottom-0 left-0 right-0 h-4/6 lg:bg-gradient-to-t from-black dark:from-black to-transparent" />
          {step === 3 && (
            <div className="absolute bottom-0 left-0 right-0 h-3/6 bg-gradient-to-t from-black dark:from-black to-transparent" />
          )}
          {step === 3 && (
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black dark:from-black to-transparent" />
          )}
          {/* Form */}
          <InquiryFormLayout
            step={step}
            nextStep={() => setStep(step + 1)}
            prevStep={() => setStep(step - 1)}
          />
          {/* Text Information */}
          {step !== 3 && (
            <div className="absolute right-0 border bottom-0">
              <div className="hidden xl:block relative">
                <AnimatePresence>
                  <motion.div
                    key={currentBackgroundSlide}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 1 }}
                    className="absolute bottom-[8.75rem] right-14 text-white gap-[8px] w-[30rem]"
                  >
                    <h1 className="text-[3.125rem] text-shadow">
                      {slideTexts[currentBackgroundSlide].title}
                    </h1>
                    <p className="text-[0.875rem] leading-[24px] font-normal max-w-lg">
                      {slideTexts[currentBackgroundSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Current Slide */}
                <div className="absolute bottom-[85px] right-[50px] flex items-center gap-2">
                  {slideTexts.map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-full p-1 ${
                        index <= currentBackgroundSlide
                          ? "bg-blue-700"
                          : "bg-white"
                      }`}
                      onClick={() => handleDotClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
