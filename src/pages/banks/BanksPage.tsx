import { useState, useEffect, useRef } from "react";
import axios from "axios";
import FooterBank from "./FooterBank";
import { toast } from "react-toastify";
import { FaFileDownload } from "react-icons/fa";
import search from "../../assets/search.svg";
import banks from "../../assets/banks.svg";
import banker from "../../assets/bank2.svg";
import add from "../../assets/add.svg";
import more from "../../assets/more.svg";
import question from "../../assets/question_delete.svg";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { InputWithIcon } from "../../components/InputWithIcon";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaMoneyBillAlt, FaUserTie } from "react-icons/fa";
/* import * as XLSX from "xlsx"; */
import EmptyBank from "./EmptyBank";
import BanksRates from "./BanksRates";
import BankRatesImport from "./BankRatesImport";
import Bankers from "./Bankers";
interface Rate {
  year: number;
  propertyType: number;
  propertyTypeName: string;
  rateType: number;
  rateTypeName: string;
  interestRate: number;
  monthlyInstallment: number;
}

interface BankDataBanker {
  bankId: string;
  bankName: string;
}
interface BankData {
  name: string;
  bankLogo: string;
}

export interface BankType {
  id: string;
  name: string;
  bankLogo: string;
  newPurchaseRates: Rate[];
  refinanceRates: Rate[];
  updatedAt: string;
}

export interface BankApiResponse {
  id: string;
  name: string;
  bankLogo: string;
  newPurchaseRates: Rate[];
  refinanceRates: Rate[];
  updatedAt: string;
}

const base64ToImage = (base64String: string): string => {
  return `data:image/png;base64,${base64String}`;
};
const BanksPage = () => {
  const [selectedBankData, setSelectedBankData] = useState<BankType | null>(
    null
  );
  const [isShowBankRates, setIsShowBankRates] = useState<boolean>(false);
  const [banksData, setBankData] = useState<BankType[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredBanks, setFilteredBanks] = useState<BankType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [menuStates, setMenuStates] = useState<{ [key: string]: boolean }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAddBankModal, setShowAddBankModal] = useState<boolean>(false);
  const [isLoadingBank, setIsLoadingBank] = useState<boolean>(false);
  const [addBankId, setAddBankId] = useState<string | null>(null);
  const [editBankId, setEditBankId] = useState<string | null>(null);
  const [deleteBankId, setDeleteBankId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editedBankData, setEditedBankData] = useState<BankData>({
    name: "",
    bankLogo: "",
  });
  const [isShowBankImportRates, setIsShowBankImportRates] =
    useState<boolean>(false);
  const handleShowRates = () => {
    setIsShowBankRates(!isShowBankRates);
  };
  const handleShowUploadRates = () => {
    setIsShowBankImportRates(!isShowBankImportRates);
  };
  const handleShowBanksRates = async (bank: BankType) => {
    setIsShowBankRates(!isShowBankRates);
    setSelectedBankData({ ...bank, updatedAt: "" });
    try {
      const response = await axios.get<BankApiResponse>(`/bank/${bank.id}`);
      const { data } = response;
      setSelectedBankData({
        id: data.id,
        name: data.name,
        bankLogo: data.bankLogo,
        newPurchaseRates: data.newPurchaseRates,
        refinanceRates: data.refinanceRates,
        updatedAt: data.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching bank updatedAt:", error);
      toast.error("Error fetching bank updatedAt");
    }
  };

  /* Bankers */
  const [isBankerShow, setIsBankerShow] = useState<boolean>(false);
  const [selectedBankerBank, setSelectedBankerBank] = useState<BankDataBanker | null>(null);
  const handleShowBankers = (data: BankDataBanker) => {
    setSelectedBankerBank(data);
    setIsBankerShow(!isBankerShow);
  };

  /* Close Handler */
  const handleEditBankClose = () => {
    setEditBankId(null);
    setLogoFile(null);
    setMenuStates({});
  };
  /* Close if clicked outside the div */
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuStates({});
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  /* Fetching banks and pagination */
  const perPage = 8;
  useEffect(() => {
    const fetchBankData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/bank");
        setBankData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBankData();
  }, [editBankId, deleteBankId, addBankId]);
  /* Delete Bank */
  const handleDeleteBank = (bankId: string) => {
    setDeleteBankId(bankId);
  };
  const deleteBank = async () => {
    if (!deleteBankId) return;
    setIsLoading(true);
    try {
      await axios.delete(`/bank/${deleteBankId}`);
      toast.success("Bank deleted successfully");
      setBankData((prev) => prev.filter((bank) => bank.id !== deleteBankId));
      setFilteredBanks((prev) =>
        prev.filter((bank) => bank.id !== deleteBankId)
      );
    } catch (err) {
      console.error(err);
      toast.error("Error deleting bank");
    } finally {
      setDeleteBankId(null);
      setIsLoading(false);
    }
  };
  /* Manual Add Bank */
  const handleAddBank = async () => {
    try {
      setIsLoadingBank(true);
      const response = await axios.post("/bank", bankAddData);
      console.log("Bank added successfully", response.data);
      setBankAddData({
        name: "",
        bankLogo: "",
      });
      toast.success("Bank added successfully");
      setAddBankId(response.data.id);
    } catch (error) {
      console.error("Error adding bank:", error);
      toast.error("Error adding bank");
    } finally {
      setIsLoadingBank(false);
      setShowAddBankModal(false);
    }
  };
  const handleConfirmDelete = () => {
    deleteBank();
  };
  /* Function to handle logo file change */
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };
  /* Edit Bank Handler */
  const handleShowEditBank = (bankId: string) => {
    setEditBankId(bankId);
    const selectedBank = banksData.find((bank) => bank.id === bankId);
    if (selectedBank) {
      setEditedBankData({
        name: selectedBank.name,
        bankLogo: selectedBank.bankLogo,
      });
      setLogoFile(null);
    }
  };
  const handleUpdateBank = async () => {
    setIsLoadingBank(true);
    try {
      if (editBankId !== null) {
        const updatedBankData = { ...editedBankData, id: editBankId };
        const response = await axios.put(`/bank`, updatedBankData);
        console.log("Bank updated successfully", response.data);
        toast.success("Bank updated successfully");
        if (logoFile) {
          const formData = new FormData();
          formData.append("Id", editBankId.toString());
          formData.append("Logo", logoFile);

          await axios.put(`/bank/logo`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }
      } else {
        console.error("editBankId is null");
        toast.error("Error updating bank: editBankId is null");
      }
    } catch (error) {
      console.error("Error updating bank or uploading logo:", error);
      toast.error("Error updating bank or uploading logo");
    } finally {
      setEditBankId(null);
      setIsLoadingBank(false);
    }
  };
  const handleMenu = (bankId: string) => {
    setMenuStates((prevStates) => ({
      ...prevStates,
      [bankId]: !prevStates[bankId],
    }));
  };
  useEffect(() => {
    const filteredData = banksData.filter((bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBanks(filteredData);
    setTotalPages(Math.ceil(filteredData.length / perPage));
    setCurrentPage(1);
  }, [banksData, searchQuery]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  /* Add Bank */
  const handleAddShowBank = () => {
    setShowAddBankModal(!showAddBankModal);
  };
  const [bankAddData, setBankAddData] = useState<BankData>({
    name: "",
    bankLogo: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankAddData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Delete Bank */}
      {deleteBankId && (
        <div className="absolute h-screen z-50 top-0 w-full left-0 bg-black/5 backdrop-blur-md">
          <div className="flex items-center justify-center h-full">
            <div
              className="py-10 px-10 rounded-lg flex flex-col items-center justify-center dark:bg-[#181818] gap-2
            bg-gray-300"
            >
              <img src={question} alt="question_icon" className="w-14 h-14" />
              <h2 className="dark:text-white text-[2rem] font-medium">
                Are you sure ?
              </h2>
              <p className="dark:text-white mb-4">
                You are about to delete this bank from your list.
              </p>
              <div className="flex items-center gap-10 w-full">
                <button
                  onClick={() => setDeleteBankId(null)}
                  className="py-[24px] px-[21px] bg-[#0d0d0d] text-white
                  font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                  transition-colors duration-500 w-full"
                >
                  No
                </button>
                <button
                  disabled={isLoading}
                  onClick={handleConfirmDelete}
                  className="py-[24px] px-[21px] bg-[#0d0d0d] text-white
                   font-normal text-[16px] leading-[19.68px] hover:bg-red-700
                   transition-colors duration-500 w-full"
                >
                  {isLoading ? (
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
      {/* Edit Bank */}
      {editBankId && (
        <div
          className="fixed lg:absolute h-screen z-50 top-0 w-full left-0 bg-black/5 backdrop-blur-md
         px-4 lg:px-0"
        >
          <div className="flex items-center justify-center h-full">
            <div
              className="transition-colors duration-300 bg-white
             dark:bg-[#1b1b1b] px-4 py-6 z-50 rounded-lg pop-shadow right-4 lg:right-0
             lg:w-[24rem]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center justify-between border-b border-gray-300 pb-4">
                  <h2 className="dark:text-white">Edit Bank</h2>
                  <IoCloseCircleOutline
                    className="dark:text-white w-6 h-6 dark:hover:text-red-700 hover:scale-125 
               transition-all duration-300 hover:text-red-700"
                    onClick={handleEditBankClose}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <InputWithIcon
                    imgSrc={banker}
                    placeholder="Bank Name"
                    name="name"
                    value={editedBankData.name}
                    onChange={(e) =>
                      setEditedBankData((prevData) => ({
                        ...prevData,
                        name: e.target.value,
                      }))
                    }
                  />
                  <div className="w-full rounded-sm overflow-hidden p-2">
                    <h1 className="dark:text-white mb-2 font-medium">
                      Bank Logo
                    </h1>
                    <div className="flex items-center justify-center">
                      {logoFile ? (
                        <img
                          src={URL.createObjectURL(logoFile)}
                          alt="Selected Logo"
                          className="lg:min-w-[10rem] h-[10rem] object-fit"
                        />
                      ) : editedBankData.bankLogo ? (
                        <img
                          src={base64ToImage(editedBankData.bankLogo)}
                          alt="Bank Logo"
                          className="lg:w-full h-[10rem] object-fit"
                        />
                      ) : (
                        <div className="text-red-500">No Logo Available</div>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileChange}
                    className="w-full border border-[#d8d8d8] py-[18px] pl-4 pr-4 shadow-sm
                    focus:outline-none focus:ring-1 focus:ring-[#000fcd] transition-all duration-500
                    dark:bg-[#0d0d0d] dark:text-white dark:border-none"
                  />
                  <button
                    disabled={isLoadingBank}
                    onClick={handleUpdateBank}
                    className="py-[24px] px-[21px] bg-[#181818] text-white
                          font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                          transition-colors duration-500 w-full dark:bg-[#000fdc] dark:hover:bg-[#202020]"
                  >
                    {isLoadingBank ? (
                      <div className="flex items-center justify-center">
                        <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
                      </div>
                    ) : (
                      <p>Apply</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="card-shadow flex items-center justify-center w-full relative">
        {/* Bankers */}
        {isBankerShow && (
          <div className="w-full h-full absolute top-0 right-0 z-50">
            <Bankers
              handleShowBankers={handleShowBankers}
              selectedBankerBank={selectedBankerBank}
            />
          </div>
        )}
        {/* Bank Rates */}
        {isShowBankImportRates ? (
          <div
            className="w-full flex items-center justify-center lg:py-[9rem]
             bg-white font-poppins dark:bg-[#0d0d0d] dark:text-white transition-colors
           duration-300"
          >
            <div className="max-w-lg px-4 lg:px-0 ">
              <BankRatesImport handleShowBankRates={handleShowUploadRates} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isShowBankRates ? (
              <BanksRates
                name={selectedBankData?.name}
                updatedAt={selectedBankData?.updatedAt}
                newPurchaseRates={selectedBankData?.newPurchaseRates}
                refinanceRates={selectedBankData?.refinanceRates}
                handleShowBankRates={handleShowRates}
              />
            ) : (
              <table
                className="w-full bg-white font-poppins dark:bg-[#0d0d0d] dark:text-white transition-colors
           duration-300"
              >
                <thead>
                  <tr>
                    <td
                      className="flex items-center justify-between border-b border-[#d8d8d8] text-normal
                   dark:border-black
            w-full lg:px-8 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-16 content justify-between">
                        <div className="flex items-center gap-2 pl-4 lg:pl-0">
                          <img
                            src={banks}
                            alt="user_icon"
                            className="dark:invert"
                          />
                          <h2>Banks</h2>
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
                             outline-none
                    lg:w-[481px] dark:bg-[#252525] w-full transition-colors duration-300"
                                placeholder="Search Bank"
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
                            className="transition-colors duration-300 px-[21px] py-[24px] pr-[40px] bg-[#F5F5F5]
                         rounded-l-md rounded-r-md outline-none lg:w-[481px] dark:bg-[#252525] w-full"
                            placeholder="Search Bank"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <img
                              src={search}
                              alt="search_icon"
                              className="dark:invert"
                            />
                          </div>
                        </div>
                        {isDropdownOpen && (
                          <div className="absolute top-14 z-50 right-4">
                            <div
                              className="transition-colors duration-300  border dark:border-[#585757] dark:bg-[#0d0d0d]
                           px-4 py-6
                    bg-white border-gray-200"
                            >
                              <div className="items-center gap-12 flex flex-col">
                                <button
                                  className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                                  onClick={handleShowUploadRates}
                                >
                                  <FaFileDownload />
                                  <h2>Import Banks</h2>
                                </button>
                                <button
                                  className="flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                                  onClick={handleAddShowBank}
                                >
                                  <img
                                    src={add}
                                    alt="user_icon"
                                    className="dark:invert"
                                  />
                                  <h2>Add New Bank</h2>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="justify-end items-center gap-12 flex lg:relative lg:w-[20rem]">
                        <button
                          className="hidden lg:flex items-center gap-2 hover:text-[#3497F9] transition-colors duration-300"
                          onClick={handleShowUploadRates}
                        >
                          <FaFileDownload />
                          <h2>Import Rates</h2>
                        </button>
                        <button
                          className="hidden lg:flex items-center gap-2 hover:text-[#3497F9] transition-colors
                       duration-200"
                          onClick={handleAddShowBank}
                        >
                          <img
                            src={add}
                            alt="user_icon"
                            className="dark:invert"
                          />
                          <h2>Add New Bank</h2>
                        </button>
                        {showAddBankModal && (
                          <div
                            className="transition-colors duration-300 absolute top-[13.3rem] lg:top-10 bg-white
                              dark:bg-[#1b1b1b] px-4 py-6 z-50 rounded-lg pop-shadow right-0 left-0 lg:right-0"
                          >
                            <div className="flex flex-col gap-4">
                              <h2 className="border-b pb-4">Add Bank</h2>
                              <div className="flex flex-col gap-4">
                                <InputWithIcon
                                  imgSrc={banker}
                                  placeholder="Bank Name"
                                  name="name"
                                  value={bankAddData.name}
                                  onChange={handleChange}
                                />
                                <button
                                  onClick={handleAddBank}
                                  className="py-[24px] px-[21px] bg-[#181818] text-white
                          font-normal text-[16px] leading-[19.68px] hover:bg-[#000FDC]
                          transition-colors duration-500 w-full dark:bg-[#000fdc] dark:hover:bg-[#202020]"
                                >
                                  {isLoadingBank ? (
                                    <div className="flex items-center justify-center">
                                      <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
                                    </div>
                                  ) : (
                                    <p>Apply</p>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </thead>
                {isLoading ? (
                  <div className="flex items-center justify-center mt-10">
                    <AiOutlineLoading3Quarters className="animate-spin text-[2rem]" />
                  </div>
                ) : (
                  <tbody>
                    {filteredBanks.length === 0 ? (
                      /* Empty Bank */
                      <EmptyBank
                        handleShowAddBank={handleAddShowBank}
                        importBanksFromExcel={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      />
                    ) : (
                      filteredBanks
                        .slice(
                          (currentPage - 1) * perPage,
                          currentPage * perPage
                        )
                        .map((bank) => (
                          <tr
                            key={bank.id}
                            className="transition-colors duration-300 border-b border-[#d8d8d8] dark:border-black"
                          >
                            <td className="py-[25px] px-[32px]">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-6">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={banks}
                                    alt="hashtag_icon"
                                    className="dark:invert"
                                  />
                                  <span>{bank.name}</span>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4 justify-between">
                                  <div className="flex flex-col md:flex-row gap-2 w-[80%] md:w-full">
                                    <button
                                      className="py-[12px] px-[21px] bg-[#181818] text-white font-normal
                                 text-normal hover:bg-[#000FDC]
                          transition-colors duration-300 w-full md:w-auto"
                                      onClick={() =>
                                        handleShowBanksRates({
                                          id: bank.id,
                                          name: bank.name,
                                          bankLogo: bank.bankLogo,
                                          newPurchaseRates:
                                            bank.newPurchaseRates,
                                          refinanceRates: bank.refinanceRates,
                                          updatedAt: bank.updatedAt,
                                        })
                                      }
                                    >
                                      <FaMoneyBillAlt className="inline-block mr-2" />
                                      Mortgage Rate
                                    </button>
                                    <button
                                      className="py-[12px] px-[21px] bg-[#181818] text-white font-normal
                                 text-normal hover:bg-[#000FDC]
                          transition-colors duration-300"
                                      onClick={() =>
                                        handleShowBankers({
                                          bankId: bank.id,
                                          bankName: bank.name,
                                        })
                                      }
                                    >
                                      <FaUserTie className="inline-block mr-2" />
                                      Bankers
                                    </button>
                                  </div>
                                  <div className="relative">
                                    <button onClick={() => handleMenu(bank.id)}>
                                      <img
                                        src={more}
                                        alt="more_icon"
                                        className="dark:invert hover:scale-125 transition-all duration-300"
                                      />
                                    </button>
                                    {menuStates[bank.id] && (
                                      <div
                                        ref={menuRef}
                                        className="absolute -top-24 right-10 bg-white dark:bg-[#181818]
                                     z-40 p-4 flex flex-col gap-4 card-shadow dark:border-[#0d0d0d] border"
                                      >
                                        <h2 className="border-b w-full pb-4">
                                          Option
                                        </h2>
                                        <button
                                          className="w-full px-4 hover:dark:bg-[#0d0d0d] py-2 transition-colors
                                       duration-300 rounded-lg flex items-center justify-between gap-10
                                        hover:bg-gray-200"
                                          onClick={() =>
                                            handleShowEditBank(bank.id)
                                          }
                                        >
                                          Edit{" "}
                                          <MdOutlineEdit className="w-6 h-6" />
                                        </button>
                                        <button
                                          className="w-full hover:dark:bg-[#973f3f] hover:bg-[#de6363]
                                       py-2 transition-colors duration-300 rounded-lg
                                flex items-center justify-between gap-10 px-4"
                                          onClick={() =>
                                            handleDeleteBank(bank.id)
                                          }
                                        >
                                          Delete{" "}
                                          <MdDeleteOutline className="w-6 h-6" />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                )}
                {/* Footer and Pagination */}
                <FooterBank
                  colSpan={6}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToNextPage={goToNextPage}
                  goToPrevPage={goToPrevPage}
                />
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BanksPage;
