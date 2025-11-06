/* Packages */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";

/* Components */
import EnquiryView from "../../components/EnquiryView";

/* Icons */
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsBank } from "react-icons/bs";
import {
  FaPhone,
  FaFileAlt,
  FaHourglassHalf,
  FaSearch,
  FaCheck,
  FaTimes,
  FaEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import exportIcon from "../../assets/export.svg";
import hashtag from "../../assets/hashtag.svg";
import user from "../../assets/user.svg";
import mail from "../../assets/mail.svg";
import check from "../../assets/check.svg";
import phone from "../../assets/phone.svg";
import calendar from "../../assets/calendar.svg";
import search from "../../assets/search.svg";
import refinance from "../../assets/refinance.svg";
import arrowDownIcon from "../../assets/arrowdown.svg";
import checkIcon from "../../assets/check2.svg";

interface Bank {
  bankLogo: string;
  bankName: string;
}
export interface Enquiry {
  id: string;
  enquiryNo: string;
  loanType: number;
  loanTypeName: string;
  propertyType: number;
  propertyTypeName: string;
  loanAmount: number;
  loanTenure: number;
  rateType: number;
  rateTypeName: string;
  fullName: string;
  email: string;
  contactNo: string;
  status: number;
  whatsAppMessageStatus: number;
  whatsAppMessageStatusName: string;
  statusName: string;
  createdDate?: string;
  bankName?: string;
  bankLogo?: string;
  assignedBankerName: string;
  banks?: Bank[];
}

const EnquiriesPage = () => {
  /* Main State Declaration */
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEnquiryViewLoading, setIsEnquiryViewLoading] = useState<
    string | null
  >(null);
  /* Enquiry View States */
  const [showEnquiryView, setShowEnquiryView] = useState<boolean>(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  /* Search States */
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const debounceTimeoutRef = useRef<number | null>(null);
  /* Date Filter State */
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  /* Loan and Property Type Filter State */
  const [loanType, setLoanType] = useState<number | null>(null);
  const [propertyType, setPropertyType] = useState<number | null>(null);
  const options = [
    "All",
    "NewPurchase",
    "Refinance",
    "PrivateResidential",
    "HDB",
    "Commercial",
    "BUC",
  ];
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  /* Hidden Inquiry State */
  const [visibleEnquiries, setVisibleEnquiries] = useState(new Set());
  /* Pages State */
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  /* GET Enquiry Data from the API */
  useEffect(() => {
    const fetchEnquiries = async () => {
      setLoading(true);
      try {
        const adjustedDateFrom = dateFrom
          ? new Date(dateFrom.getTime() - 7 * 60 * 60 * 1000).toISOString()
          : null;
        const adjustedDateTo = dateTo
          ? new Date(dateTo.getTime() + 17 * 60 * 60 * 1000).toISOString()
          : null;
        const response = await axios.get("/enquiry", {
          params: {
            DateFrom: adjustedDateFrom,
            DateTo: adjustedDateTo,
            LoanType: loanType,
            PropertyType: propertyType,
            SearchTerm: debouncedSearchQuery,
            PageNumber: pageNumber,
          },
        });
        setEnquiries(response.data.enquiries);
        setPageNumber(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        toast.error("Failed to fetch enquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [
    dateFrom,
    dateTo,
    loanType,
    propertyType,
    debouncedSearchQuery,
    pageNumber,
  ]);

  /* GET Enquiry Data by ID */
  const fetchEnquiryDetails = async (id: string) => {
    try {
      const response = await axios.get(`/enquiry/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch enquiry details", error);
      throw error;
    }
  };

  /* Display Enquiry Data Dialog */
  const handleEnquiryView = async (enquiry: Enquiry) => {
    setIsEnquiryViewLoading(enquiry.id);
    try {
      setSelectedEnquiry(enquiry);

      const details = await fetchEnquiryDetails(enquiry.id);

      setSelectedEnquiry((prevState) => {
        if (prevState) {
          return {
            ...prevState,
            whatsAppMessageStatusName: details.whatsAppMessageStatusName,
            bankLogo: details.banks[0]?.bankLogo,
            bankName: details.banks[0]?.bankName,
          };
        }
        return {
          ...enquiry,
          whatsAppMessageStatusName: details.whatsAppMessageStatusName,
          bankLogo: details.banks[0]?.bankLogo,
          bankName: details.banks[0]?.bankName,
        };
      });
      setShowEnquiryView(!showEnquiryView);
    } catch (error) {
      toast.error("Failed to fetch enquiries");
    } finally {
      setIsEnquiryViewLoading(null);
    }
  };

  /* Enquiry View Exit */
  const handleCloseEnquiryView = () => {
    setShowEnquiryView(false);
  };

  /* Search Debounce */
  useEffect(() => {
    debounceTimeoutRef.current && clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => {
      debounceTimeoutRef.current && clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery]);

  /* Search */
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  /* Export to EXCEL */
  const exportToExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      const filteredEnquiries = enquiries.map((enquiry) => ({
        enquiryNo: enquiry.enquiryNo,
        bankName: enquiry.bankName,
        loanTypeName: enquiry.loanTypeName,
        propertyTypeName: enquiry.propertyTypeName,
        loanAmount: enquiry.loanAmount,
        loanTenure: enquiry.loanTenure,
        rateTypeName: enquiry.rateTypeName,
        fullName: enquiry.fullName,
        email: enquiry.email,
        contactNo: enquiry.contactNo,
        statusName: enquiry.statusName,
        bankerName: enquiry.assignedBankerName,
        createdDate: enquiry.createdDate,
      }));
      const ws = XLSX.utils.json_to_sheet(filteredEnquiries);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "EnquiriesData");
      XLSX.writeFile(wb, "enquiries_data.xlsx");
    } catch (error) {
      toast.error("Failed to export");
    }
  };

  /* Date Filter */
  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      setDateFrom(start);
      setDateTo(end);
    } else {
      setDateFrom(null);
      setDateTo(null);
    }
  };

  /* Clear Calender Filter */
  const clearCalendarFilter = () => {
    setDateFrom(null);
    setDateTo(null);
  };

  /* Filter Option */
  const handleOptionClick = (option: string) => {
    switch (option) {
      case "NewPurchase":
        setLoanType(0);
        break;
      case "Refinance":
        setLoanType(1);
        break;
      case "PrivateResidential":
        setPropertyType(0);
        break;
      case "HDB":
        setPropertyType(1);
        break;
      case "Commercial":
        setPropertyType(2);
        break;
      case "BUC":
        setPropertyType(3);
        break;
      default:
        setLoanType(null);
        setPropertyType(null);
        break;
    }
    setSelectedOption(option === "All" ? null : option);
    setShowOptions(false);
  };

  /* Filter Option Outside Exit */
  const optionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showOptions]);

  /* Dropdown Other Inquiry View */
  const handleToggleEnquiry = (enquiryNo: string) => {
    setVisibleEnquiries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(enquiryNo)) {
        newSet.delete(enquiryNo);
      } else {
        newSet.add(enquiryNo);
      }
      return newSet;
    });
  };

  /* Next Page */
  const goToNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  /* Previous Page */
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  /* Format the status name */
  const getDisplayName = (statusName: string) => {
    switch (statusName) {
      case "ClientContacted":
        return "Client Contacted";
      case "DocumentsSubmitted":
        return "Documents Submitted";
      case "PendingSubmission":
        return "Pending Submission";
      case "Considering":
        return "Considering";
      case "LoanAccepted":
        return "Loan Accepted";
      case "NotInterested":
        return "Not Interested";
      default:
        return statusName;
    }
  };
  /* Icons every enquiry status */
  const getStatusIcon = (statusName: string) => {
    switch (statusName) {
      case "ClientContacted":
        return <FaPhone />;
      case "DocumentsSubmitted":
        return <FaFileAlt />;
      case "PendingSubmission":
        return <FaHourglassHalf />;
      case "Considering":
        return <FaSearch />;
      case "LoanAccepted":
        return <FaCheck />;
      case "NotInterested":
        return <FaTimes />;
      default:
        return null;
    }
  };

  return (
    <div className="card-shadow flex items-center justify-center mobile-relative">
      <div className="card-shadow flex items-center justify-center mobile-relative">
        {showEnquiryView && selectedEnquiry && (
          <div
            className="hidden lg:block absolute z-40 lg:right-4 lg:top-0
          border dark:border-[#303030] left-only right-2 h-screen"
          >
            <EnquiryView
              enquiry={selectedEnquiry}
              onClose={handleCloseEnquiryView}
            />
          </div>
        )}
      </div>
      <div
        className="w-full bg-white font-poppins dark:bg-[#0d0d0d] dark:text-white relative
      transition-colors duration-300"
      >
        <div
          className="lg:flex items-center justify-between border-b border-[#d8d8d8]
            lg:px-[24px] text-normal dark:border-black lg:py-0 transition-colors duration-300"
        >
          <div className="flex items-center lg:gap-16 content justify-between relative">
            <div className="flex items-center gap-2 px-2 lg:px-0">
              <img src={user} alt="user_icon" className="dark:invert w-6" />
              <h2>Enquiries</h2>
            </div>
            <div className="lg:hidden flex flex-row items-center gap-4">
              <button
                className="flex flex-row items-center gap-2"
                onClick={() => setIsDropDownOpen(!isDropdownOpen)}
              >
                Action <MdKeyboardArrowDown />
              </button>
              <button
                className="dark:bg-[#7d7d7d] py-4 px-[20px] rounded-sm dark:hover:bg-[#656565]
                  transition-colors duration-300 bg-[#c9c9c9]"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <FiSearch />
              </button>
            </div>
            {isSearchOpen && (
              <div className="absolute top-14 w-full z-50">
                <div className="relative flex w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="px-[21px] py-[24px] pr-[40px] bg-[#F5F5F5] rounded-l-md rounded-r-md
                         outline-none dark:bg-[#252525] w-full transition-colors duration-300"
                    placeholder="Search ID, Name, Email, Phone Number"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <img
                      src={search}
                      alt="search_icon"
                      className="dark:invert"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="relative hidden lg:block">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="px-[21px] py-[24px] pr-[40px] bg-[#F5F5F5] rounded-l-md rounded-r-md outline-none
                    lg:w-[481px] dark:bg-[#252525] transition-colors duration-300"
                placeholder="Search ID, Name, Email, Phone Number"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <img src={search} alt="search_icon" className="dark:invert" />
              </div>
            </div>
          </div>
          {isDropdownOpen && (
            <div
              className="absolute top-14 z-50 border dark:border-[#585757] dark:bg-[#0d0d0d]
                   px-4 py-6 right-4
                bg-white border-gray-200 transition-colors duration-300"
            >
              <div className="items-center gap-8 lg:hidden flex flex-col">
                <button
                  className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                  onClick={exportToExcel}
                >
                  <img
                    src={exportIcon}
                    alt="user_icon"
                    className="dark:invert"
                  />
                  <h2>Export Data</h2>
                </button>
                <div className="relative flex-initial w-[160px] flex items-center justify-center">
                  <button
                    className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <img
                      src={calendar}
                      alt="calendar_icon"
                      className="dark:invert"
                    />
                    <h2 style={{ color: showCalendar ? "red" : "inherit" }}>
                      {showCalendar ? "Close Calendar" : "Filter by Date"}
                    </h2>
                  </button>
                  {showCalendar && (
                    <div
                      className="absolute z-50 top-32 -right-4 bg-white p-4 rounded-lg shadow-md
                    border border-slate-400"
                    >
                      <DatePicker
                        selected={dateFrom}
                        onChange={handleDateChange}
                        startDate={dateFrom}
                        endDate={dateTo}
                        selectsRange
                        inline
                      />
                      <button
                        className="w-full p-4 text-white bg-black hover:bg-red-800
                 transition-colors duration-300"
                        onClick={clearCalendarFilter}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative w-[8.3vw] flex flex-row justify-center items-center z-50">
                  <button
                    className="flex items-center gap-2 justify-center hover:text-[#3497F9]
                         transition-colors duration-300"
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    <h2 className="text-center">
                      {selectedOption ? selectedOption : "Filter by Category"}
                    </h2>
                    <img
                      src={arrowDownIcon}
                      alt="arrowdown_icon"
                      className="dark:invert"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-8 justify-end w-full">
            <button
              className="items-center gap-2 hover:text-[#3497F9] transition-colors duration-300
                   hidden lg:flex w-full ml-4 justify-center"
              onClick={exportToExcel}
            >
              <img src={exportIcon} alt="user_icon" className="dark:invert" />
              <h2 className="hidden xl:block">Export Data</h2>
            </button>
          </div>
          <div className="relative flex-initial items-center justify-center hidden lg:flex w-full">
            <button
              className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <img src={calendar} alt="calendar_icon" className="dark:invert" />
              <h2
                style={{ color: showCalendar ? "red" : "inherit" }}
                className="hidden xl:block"
              >
                {showCalendar ? "Close Calendar" : "Filter by Date"}
              </h2>
            </button>
            {showCalendar && (
              <div
                className="absolute z-50 top-12 -left-14 bg-white p-4 rounded-lg shadow-md
                    border border-slate-400 flex items-center flex-col gap-2"
              >
                <DatePicker
                  selected={dateFrom}
                  onChange={handleDateChange}
                  startDate={dateFrom}
                  endDate={dateTo}
                  selectsRange
                  inline
                />
                <button
                  className="w-full p-4 text-white bg-black hover:bg-red-800
                 transition-colors duration-300"
                  onClick={clearCalendarFilter}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          <div className="relative flex flex-row justify-center items-center w-full">
            <button
              className="items-center gap-2 justify-center hover:text-[#3497F9] transition-colors
                     duration-300
                    hidden lg:flex"
              onClick={() => setShowOptions(!showOptions)}
            >
              <h2 className="text-center hidden xl:block">
                {selectedOption ? selectedOption : "Filter by Category"}
              </h2>
              <img
                src={arrowDownIcon}
                alt="arrowdown_icon"
                className="dark:invert"
              />
            </button>
            {showOptions && (
              <div
                className="z-50 absolute top-8 right-28 p-4 pop-shadow space-y-[10px] bg-white
                     translate-x-32 dark:bg-[#0d0d0d] dark:text-white transition-colors duration-300"
              >
                <div
                  className="border-b border-[#d8d8d8] pb-[24px] dark:bg-[#0d0d0d] dark:text-white
                      transition-colors duration-300"
                >
                  <h2>Filter Catergory</h2>
                </div>
                {options.map((option) => (
                  <div
                    key={option}
                    className="pt-2 flex items-center gap-2 justify-between cursor-pointer"
                    onClick={() => {
                      handleOptionClick(option);
                    }}
                  >
                    <div className="px-4">{option}</div>
                    <div
                      className="h-[24px] w-[24px] border border-[#0d0d0d] rounded-full
                             flex-shrink-0 mr-4
                           relative dark:border-[#ffffff] transition-colors duration-300"
                    >
                      {selectedOption === option && (
                        <div
                          className="h-[100%] w-[100%] bg-green-500 rounded-full flex
                               items-center justify-center absolute top-0 left-0"
                        >
                          <img src={checkIcon} alt="activated_check" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center mt-10">
            <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
          </div>
        ) : (
          <div>
            {enquiries
              .filter((enquiry, index, self) => {
                return (
                  index ===
                  self.findIndex((e) => e.enquiryNo === enquiry.enquiryNo)
                );
              })
              .map((enquiry) => {
                const relatedEnquiries = enquiries.filter(
                  (e) =>
                    e.enquiryNo === enquiry.enquiryNo && e.id !== enquiry.id
                );

                return (
                  <div
                    key={enquiry.id}
                    className="border-t lg:border-b lg:border-[#d8d8d8] lg:dark:border-black dark:border-gray-800
                     w-full flex flex-col"
                  >
                    <div
                      className="py-[25px] px-[12px] flex items-center lg:justify-between relative w-full
                     justify-center lg:max-w-full"
                    >
                      <div className="w-full relative">
                        <div className="flex flex-col lg:flex-row justify-between w-full gap-4 lg:gap-4 lg:items-center">
                          <div className="flex items-center gap-2 flex-grow px-2 lg:w-full">
                            <img
                              src={hashtag}
                              alt="hashtag_icon"
                              className="dark:invert"
                            />
                            <span className="text-[#3497F9]">
                              {enquiry.enquiryNo}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 flex-grow overflow-hidden px-2 whitespace-nowrap lg:w-full">
                            <div className="flex flex-row items-center gap-2">
                              <img
                                src={user}
                                alt="user_icon"
                                className="dark:invert"
                              />
                              <span className="text-ellipsis overflow-hidden">
                                {enquiry.fullName}
                              </span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <BsBank />
                              <span className="text-ellipsis overflow-hidden">
                                {enquiry.bankName}
                              </span>
                            </div>
                          </div>
                          <div
                            className="flex flex-col gap-2 flex-grow 
                            overflow-hidden px-2 lg:w-full whitespace-nowrap"
                          >
                            <div className="flex flex-row gap-2 items-center">
                              <img
                                src={mail}
                                alt="hashtag_icon"
                                className="dark:invert"
                              />
                              <span className="text-ellipsis overflow-hidden">
                                {enquiry.email}
                              </span>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                              <img
                                src={phone}
                                alt="hashtag_icon"
                                className="dark:invert"
                              />
                              <span className="text-ellipsis overflow-hidden">
                                {enquiry.contactNo}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 flex-grow px-2 lg:w-full">
                            <div className="flex flex-row items-center gap-2">
                              {enquiry.loanTypeName === "NewPurchase" ? (
                                <img
                                  src={check}
                                  alt="check_icon"
                                  className="dark:invert"
                                />
                              ) : (
                                <img
                                  src={refinance}
                                  alt="refinance_icon"
                                  className="dark:invert"
                                />
                              )}
                              <span>
                                {enquiry.loanTypeName === "NewPurchase"
                                  ? "New Purchase"
                                  : "Refinance"}
                              </span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                              <span>{getStatusIcon(enquiry.statusName)}</span>
                              <span>{getDisplayName(enquiry.statusName)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 lg:w-fit w-full">
                            <button
                              className="py-[12px] px-[21px] bg-[#181818] text-white font-normal text-normal
                               hover:bg-[#000FDC] w-full transition-colors duration-300 whitespace-nowrap
                               flex items-center justify-center"
                              onClick={() =>
                                handleToggleEnquiry(enquiry.enquiryNo)
                              }
                            >
                              {visibleEnquiries.has(enquiry.enquiryNo) ? (
                                <FaEyeSlash />
                              ) : (
                                <FaRegEye />
                              )}
                            </button>
                          </div>
                          <div className="flex items-center gap-2 relative w-full">
                            <button
                              className="py-[12px] px-[21px] bg-[#181818] text-white font-normal text-normal
                               hover:bg-[#000FDC] w-full transition-colors duration-300 whitespace-nowrap
                               flex items-center justify-center"
                              onClick={() => handleEnquiryView(enquiry)}
                              disabled={isEnquiryViewLoading === enquiry.id}
                            >
                              {isEnquiryViewLoading === enquiry.id ? (
                                <AiOutlineLoading3Quarters className="animate-spin text-[1.5rem]" />
                              ) : (
                                "View Enquiry Details"
                              )}
                            </button>
                          </div>
                        </div>
                        {/* Dropdown related enquiries */}
                        {visibleEnquiries.has(enquiry.enquiryNo) ? (
                          <div className="py-4 mt-2 -mb-10">
                            {relatedEnquiries.length > 0 ? (
                              relatedEnquiries.map((relatedEnquiry) => (
                                <div
                                  key={relatedEnquiry.id}
                                  className="flex flex-col lg:flex-row justify-between w-full gap-4 lg:gap-4 my-4 bg-gradient-to-r
                                 from-gray-100 via-gray-200 to-gray-100 dark:bg-gradient-to-r dark:from-gray-800
                                  dark:via-gray-900 dark:to-gray-800 p-2 rounded-lg shadow-md"
                                >
                                  <div className="flex items-center gap-2 flex-grow px-2 lg:w-full">
                                    <img
                                      src={hashtag}
                                      alt="hashtag_icon"
                                      className="dark:invert"
                                    />
                                    <span className="text-[#3497F9]">
                                      {enquiry.enquiryNo}
                                    </span>
                                  </div>
                                  <div className="flex flex-row items-center gap-2 px-2 lg:w-full">
                                    <BsBank />
                                    <span className="text-ellipsis overflow-hidden">
                                      {relatedEnquiry.bankName &&
                                      relatedEnquiry.bankName.length > 0 ? (
                                        <span>{relatedEnquiry.bankName}</span>
                                      ) : (
                                        <span>No banks available</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-center px-2 lg:w-full">
                                    <div className="flex flex-row items-center gap-2">
                                      <span>
                                        {getStatusIcon(
                                          relatedEnquiry.statusName
                                        )}
                                      </span>
                                      <span>
                                        {getDisplayName(
                                          relatedEnquiry.statusName
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-row items-center gap-2 w-full">
                                    <button
                                      className="py-[12px] px-[21px] bg-[#181818] text-white font-normal text-normal
                                     hover:bg-[#000FDC] w-full transition-colors duration-300 whitespace-nowrap
                                     flex items-center justify-center"
                                      onClick={() =>
                                        handleEnquiryView(relatedEnquiry)
                                      }
                                      disabled={
                                        isEnquiryViewLoading ===
                                        relatedEnquiry.id
                                      }
                                    >
                                      {isEnquiryViewLoading ===
                                      relatedEnquiry.id ? (
                                        <AiOutlineLoading3Quarters className="animate-spin text-[1.5rem]" />
                                      ) : (
                                        "View Enquiry Details"
                                      )}
                                    </button>
                                  </div>
                                  {showEnquiryView &&
                                    selectedEnquiry?.id ===
                                      relatedEnquiry.id && (
                                      <div className="lg:hidden absolute z-40 top-0 w-full border dark:border-[#303030]">
                                        <EnquiryView
                                          enquiry={selectedEnquiry}
                                          onClose={handleCloseEnquiryView}
                                        />
                                      </div>
                                    )}
                                </div>
                              ))
                            ) : (
                              <div
                                className="text-center flex flex-col lg:flex-row justify-center w-full gap-4 lg:gap-4 my-4 bg-gradient-to-r
                                 from-gray-100 via-gray-200 to-gray-100 dark:bg-gradient-to-r dark:from-gray-800
                                  dark:via-gray-900 dark:to-gray-800 p-2 rounded-lg shadow-md"
                              >
                                No related enquiries available
                              </div>
                            )}
                          </div>
                        ) : (
                          <span></span>
                        )}
                        {showEnquiryView &&
                          selectedEnquiry &&
                          selectedEnquiry.id === enquiry.id && (
                            <div className="lg:hidden absolute z-40 lg:right-4 lg:top-4 border dark:border-[#303030] top-0 w-full">
                              <EnquiryView
                                enquiry={selectedEnquiry}
                                onClose={handleCloseEnquiryView}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <div className="px-[32px] py-[14px]">
          <div className="flex items-center justify-center lg:justify-end">
            <button
              className="dark:text-white px-4 py-2 rounded-md"
              onClick={goToPrevPage}
            >
              <MdArrowBackIos className="hover:text-[#3497F9] transition-colors duration-300" />
            </button>
            <span className="flex w-32 items-center justify-center">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              className="dark:text-white px-4 py-[13.5px] rounded-md"
              onClick={goToNextPage}
            >
              <MdArrowForwardIos className="hover:text-[#3497F9] transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;
