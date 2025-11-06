/* Packages */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; 

/* Component */
import { InputWithIcon } from "../../components/InputWithIcon";

/* Icons */
import { BsBank } from "react-icons/bs";
import {
  MdOutlineArrowBackIos,
  MdOutlineDelete,
  MdArrowBackIos,
  MdArrowForwardIos,
} from "react-icons/md";
import { FaAddressCard } from "react-icons/fa6";
import { FaUserTie, FaPhoneAlt, FaUserEdit } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { GrStatusGoodSmall } from "react-icons/gr";
import { IoRadioButtonOff } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import search from "../../assets/search.svg";
import user from "../../assets/user2.svg";
import mail from "../../assets/email2.svg";
import phone from "../../assets/whatsapp.svg";
import question from "../../assets/question_delete.svg";

/* Types */
interface BankersProps {
  handleShowBankers: (data: BankDataBanker) => void;
  selectedBankerBank: BankDataBanker | null;
}
interface BankDataBanker {
  bankId: string;
  bankName: string;
}

interface Banker {
  id: string;
  bankId: string;
  enquiryCountAssigned: number;
  bankerName: string;
  bankerEmail: string;
  bankerPhone: string;
  bankerTelegramId: string;
  bankerStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface BankersApiResponse {
  bankers: Banker[];
  currentPage: number;
  totalPages: number;
}

const Bankers: React.FC<BankersProps> = ({
  handleShowBankers,
  selectedBankerBank,
}) => {
  /* States */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAddBanker, setIsLoadingAddBanker] = useState<boolean>(false);
  const [isLoadingEditBanker, setIsLoadingEditBanker] = useState<boolean>(false);
  const [isLoadingDeleteBanker, setIsLoadingDeleteBanker] = useState<boolean>(false);
  const [isShowAddBanker, setIsShowAddBanker] = useState<boolean>(false);
  const [isShowEditBanker, setIsShowEditBanker] = useState<boolean>(false);
  const [isShowDeleteBanker, setIsShowDeleteBanker] = useState<boolean>(false);
  const [bankersData, setBankersData] = useState<BankersApiResponse | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [selectedBankerId, setSelectedBankerId] = useState<string | null>(null);

  useEffect(() => {
    fetchBankers(
      currentPage,
      debouncedSearchTerm,
      selectedBankerBank?.bankId || null
    );
  }, [currentPage, debouncedSearchTerm, selectedBankerBank?.bankId]);

  /* Fetch Bankers */
  const fetchBankers = async (
    page: number,
    searchTerm: string,
    bankId: string | null
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.get<BankersApiResponse>(`/banker`, {
        params: {
          pageNumber: page,
          searchTerm: searchTerm || undefined,
          bankId: bankId || undefined,
        },
      });
      setBankersData(response.data);
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  /* Add Banker */
  const handleAddBanker = async () => {
    setIsLoadingAddBanker(true);
    try {
      await axios.post("/banker", {
        bankId: selectedBankerBank?.bankId,
        bankerName: name,
        bankerEmail: email,
        bankerPhone: contactNumber,
        bankerStatus: "Active",
      });
      fetchBankers(currentPage, debouncedSearchTerm, selectedBankerBank?.bankId || null);
      setName("");
      setEmail("");
      setContactNumber("");
      setIsShowAddBanker(false);
      toast.success("Banker Added Successfully");
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsLoadingAddBanker(false);
    }
  };

  /* Edit Banker */
  const handleEditBanker = async () => {
    if (!selectedBankerId) return;
    setIsLoadingEditBanker(true);
    try {
      await axios.put(`/banker`, {
        id: selectedBankerId,
        bankId: selectedBankerBank?.bankId,
        bankerName: name,
        bankerEmail: email,
        bankerPhone: contactNumber,
        bankerStatus: status,
      });
      fetchBankers(currentPage, debouncedSearchTerm, selectedBankerBank?.bankId || null);
      setName("");
      setEmail("");
      setContactNumber("");
      setStatus("");
      setIsShowEditBanker(false);
      toast.success("Banker Updated Successfully");
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsLoadingEditBanker(false);
    }
  }
  const handleConfirmEdit = (bankerId: string) => {
    const selectedBanker = bankersData?.bankers.find(
      (banker) => banker.id === bankerId
    );
    if (selectedBanker) {
      setName(selectedBanker.bankerName);
      setEmail(selectedBanker.bankerEmail);
      setContactNumber(selectedBanker.bankerPhone);
      setStatus(selectedBanker.bankerStatus);
    }
    setSelectedBankerId(bankerId);
    setIsShowEditBanker(true);
  };

  /* Delete Banker */
  const handleDeleteBanker = async () => {
    if (!selectedBankerId) return;

    setIsLoadingDeleteBanker(true);
    try {
      await axios.delete(`/banker/${selectedBankerId}`);
      fetchBankers(currentPage, debouncedSearchTerm, selectedBankerBank?.bankId || null);
      setIsShowDeleteBanker(false);
      toast.success("Banker Deleted Successfully");
    } catch (error) {
      toast.error("Failed to Delete Banker");
    } finally {
      setIsLoadingDeleteBanker(false);
    }
  };
  const handleConfirmDelete = (bankerId: string) => {
    setSelectedBankerId(bankerId);
    setIsShowDeleteBanker(true);
  };

  /* Show Add Bankers */
  const handleShowAddBankers = () => {
    setIsShowAddBanker(!isShowAddBanker);
  };

  /* Show Edit Bankers */
  const handleShowEditBanker = () => {
    setName("");
    setEmail("");
    setContactNumber("");
    setStatus("");
    setIsShowEditBanker(!isShowEditBanker);
  };

  /* Delete Banker Popup */
  const handleShowDeleteBanker = () => {
    setIsShowDeleteBanker(!isShowDeleteBanker);
  }

  /* Search Debounce */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  /* Search */
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  /* Next Page */
  const handleNextPage = () => {
    if (bankersData && currentPage < bankersData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /* Previous Page */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div
      className="w-full bg-white font-poppins dark:bg-[#0d0d0d] dark:text-white transition-colors
    duration-300 h-full"
    >
      {/* Add Bankers */}
      {isShowAddBanker && (
        <div className="fixed md:absolute h-full z-50 top-0 w-full left-0 bg-black/5 backdrop-blur-md">
          <div className="flex items-center justify-center h-screen md:h-full">
            <div
              className="py-10 px-8 rounded-lg flex flex-col items-center justify-center dark:bg-[#181818] gap-2
            bg-gray-300"
            >
              <div className="flex flex-row items-center justify-between border-b border-gray-300 pb-4 w-full">
                <h2 className="dark:text-white">Add Banker</h2>
                <IoCloseCircleOutline
                  className="dark:text-white w-6 h-6 dark:hover:text-red-700 hover:scale-125 
               transition-all duration-300 hover:text-red-700"
                  onClick={handleShowAddBankers}
                />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <InputWithIcon
                  imgSrc={user}
                  placeholder="Banker Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputWithIcon
                  imgSrc={mail}
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputWithIcon
                  imgSrc={phone}
                  placeholder="Whatsapp Number"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <button
                  disabled={isLoadingAddBanker}
                  onClick={handleAddBanker}
                  className="py-[18px] px-[21px] bg-[#181818] text-white
                          font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                          transition-colors duration-500 w-full dark:bg-[#000fdc] dark:hover:bg-[#202020]"
                >
                  {isLoadingAddBanker ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
                    </div>
                  ) : (
                    <p>Submit</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Banker */}
      {isShowEditBanker && (
        <div className="fixed md:absolute h-full z-50 top-0 w-full left-0 bg-black/5 backdrop-blur-md">
          <div className="flex items-center justify-center h-screen md:h-full">
            <div
              className="py-10 px-8 rounded-lg flex flex-col items-center justify-center dark:bg-[#181818] gap-2
            bg-gray-300"
            >
              <div className="flex flex-row items-center justify-between border-b border-gray-300 pb-4 w-full">
                <h2 className="dark:text-white">Edit Banker</h2>
                <IoCloseCircleOutline
                  className="dark:text-white w-6 h-6 dark:hover:text-red-700 hover:scale-125 
               transition-all duration-300 hover:text-red-700"
                  onClick={handleShowEditBanker}
                />
              </div>
              <div className="flex flex-col gap-4 mt-4">
                <InputWithIcon
                  imgSrc={user}
                  placeholder="Banker Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <InputWithIcon
                  imgSrc={mail}
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputWithIcon
                  imgSrc={phone}
                  placeholder="Contact Number"
                  name="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <label className="dark:text-white">Status:</label>
                  <div className="flex items-center justify-around p-2 rounded-xl dark:bg-slate-800 bg-slate-400">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="Active"
                        checked={status === "Active"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-radio text-blue-600"
                      />
                      <span className="dark:text-white">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="status"
                        value="InActive"
                        checked={status === "InActive"}
                        onChange={(e) => setStatus(e.target.value)}
                        className="form-radio text-red-600"
                      />
                      <span className="dark:text-white">Inactive</span>
                    </label>
                  </div>
                </div>
                <button
                  disabled={isLoadingEditBanker}
                  onClick={handleEditBanker}
                  className="py-[18px] px-[21px] bg-[#181818] text-white
                          font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                          transition-colors duration-500 w-full dark:bg-[#000fdc] dark:hover:bg-[#202020]"
                >
                  {isLoadingEditBanker ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
                    </div>
                  ) : (
                    <p>Update</p>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Banker */}
      {isShowDeleteBanker && (
        <div className="fixed md:absolute h-full z-50 top-0 w-full left-0 bg-black/5 backdrop-blur-md">
          <div className="flex items-center justify-center h-screen md:h-full">
            <div
              className="py-10 px-8 rounded-lg flex flex-col items-center justify-center dark:bg-[#181818] gap-2
            bg-gray-300"
            >
              <img src={question} alt="question_icon" className="w-14 h-14" />
              <h2 className="dark:text-white text-[2rem] font-medium">
                Are you sure ?
              </h2>
              <p className="dark:text-white mb-4">
                You are about to delete this banker from your list.
              </p>
              <div className="flex items-center gap-10 w-full">
                <button
                  onClick={handleShowDeleteBanker}
                  className="py-[24px] px-[21px] bg-[#0d0d0d] text-white
                  font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                  transition-colors duration-500 w-full"
                >
                  No
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleDeleteBanker}
                  className="py-[24px] px-[21px] bg-[#0d0d0d] text-white
                   font-normal text-[16px] leading-[19.68px] hover:bg-red-700
                   transition-colors duration-500 w-full"
                >
                  {isLoadingDeleteBanker ? (
                    <div className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin" />
                    </div>
                  ) : (
                    <span>Yes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Menu */}
      <div
        className="flex items-center justify-between border-b border-[#d8d8d8] text-normal
                 dark:border-black w-full lg:px-8 transition-colors duration-300 py-6"
      >
        <div className="flex flex-col md:flex-row lg:gap-16 content justify-between w-full">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-10 md:pl-4 lg:pl-0 relative">
            <div className="flex flex-row items-center w-full justify-between">
              <div className="flex flex-row items-center gap-2 pl-4">
                <button
                  className="border p-4 rounded-full hover:dark:bg-slate-800 hover:bg-slate-200
             transition-colors duration-300"
                  onClick={() => handleShowBankers(selectedBankerBank!)}
                >
                  <MdOutlineArrowBackIos />
                </button>
                <div className="flex flex-row items-center gap-2">
                  <BsBank />
                  <h2>{selectedBankerBank?.bankName || "Bank"}</h2>
                </div>
              </div>
              <button
                className="flex items-center gap-2 px-6 hover:text-blue-500 transition-colors duration-300 md:hidden"
                onClick={handleShowAddBankers}
              >
                <span className="md:hidden rounded-full border border-blue-500 text-blue-500">
                  <IoMdAdd />
                </span>
                <span className="hidden md:block">
                  <FaAddressCard />
                </span>
                <span className="hidden md:block">Add Bankers</span>
              </button>
            </div>
            <div className="relative w-[93%]">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="px-[21px] py-[24px] pr-[40px] bg-[#F5F5F5] rounded-l-md rounded-r-md outline-none
                    lg:w-[481px] dark:bg-[#252525] transition-colors duration-300 w-full"
                placeholder="Search Name, Email, Phone, Status"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <img src={search} alt="search_icon" className="dark:invert" />
              </div>
            </div>
          </div>
          <button
            className="md:flex items-center gap-2 px-6 hover:text-blue-500 transition-colors duration-300 hidden"
            onClick={handleShowAddBankers}
          >
            <span className="md:hidden rounded-full border border-blue-500 text-blue-500">
              <IoMdAdd />
            </span>
            <span className="hidden md:block">
              <FaAddressCard />
            </span>
            <span className="hidden md:block">Add Banker</span>
          </button>
        </div>
      </div>
      {/* Table Data */}
      {isLoading ? (
        <div className="flex items-center justify-center my-10">
          <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
        </div>
      ) : (
        <div className="px-8 py-6 w-full flex flex-col gap-4">
          {bankersData?.bankers && bankersData.bankers.length > 0 ? (
            bankersData?.bankers.map((banker) => (
              <div
                key={banker.id}
                className="py-6 px-4 rounded-xl flex flex-col md:flex-row items-center justify-between
          bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:bg-gradient-to-r dark:from-gray-800
          dark:via-gray-900 dark:to-gray-800 gap-2 md:gap-0"
              >
                <div className="flex flex-row items-center gap-2 w-full overflow-hidden md:pr-2">
                  <FaUserTie />
                  <span className="truncate">{banker.bankerName}</span>
                </div>
                <div
                  className={`flex flex-row items-center gap-2 w-full md:w-[40rem] ${
                    banker.bankerStatus === "Active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {banker.bankerStatus === "Active" ? (
                    <GrStatusGoodSmall />
                  ) : (
                    <IoRadioButtonOff />
                  )}
                  <span>{banker.bankerStatus}</span>
                </div>
                <div className="flex flex-row items-center gap-2 w-full overflow-hidden md:pr-2">
                  <IoMailOutline />
                  <span className="truncate">{banker.bankerEmail}</span>
                </div>
                <div className="flex flex-row items-center gap-2 w-full overflow-hidden md:pr-2">
                  <FaPhoneAlt />
                  <span className="truncate">{banker.bankerPhone}</span>
                </div>
                <div className="flex flex-row items-center gap-4 px-6 py-2 rounded-full dark:bg-slate-950 bg-slate-600 mt-4 md:mt-0 w-full md:w-auto justify-around">
                  <button
                    className="text-green-500 text-[1.5rem] hover:scale-110 transition-all duration-300 flex flex-row gap-2 items-center md:flex-none"
                    onClick={() => handleConfirmEdit(banker.id)}
                  >
                    <FaUserEdit />
                    <span className="md:hidden text-[.8rem] font-semibold">
                      Edit
                    </span>
                  </button>
                  <button
                    className="text-red-500 text-[1.8rem] hover:scale-110 transition-all duration-300 flex flex-row gap-2 items-center md:flex-none"
                    onClick={() => handleConfirmDelete(banker.id)}
                  >
                    <MdOutlineDelete />
                    <span className="md:hidden text-[.8rem] font-semibold">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center my-10 text-gray-600 dark:text-gray-300">
              No bankers found.
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t dark:border-gray-800 py-4 px-8">
        <div className="flex items-center justify-center lg:justify-end">
          <button
            className="dark:text-white px-4 py-2 rounded-md cursor-pointer"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <MdArrowBackIos className="hover:text-[#3497F9] transition-colors duration-300" />
          </button>
          <span className="flex w-32 items-center justify-center">
            Page {bankersData?.currentPage} of {bankersData?.totalPages}
          </span>
          <button
            className="dark:text-white px-4 py-[13.5px] rounded-md cursor-pointer"
            onClick={handleNextPage}
            disabled={
              (bankersData && currentPage === bankersData.totalPages) ||
              undefined
            }
          >
            <MdArrowForwardIos className="hover:text-[#3497F9] transition-colors duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bankers;
