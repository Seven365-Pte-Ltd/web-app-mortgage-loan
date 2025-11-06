import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

interface FooterBankProps {
  colSpan: number;
  currentPage: number;
  totalPages: number;
  goToPrevPage: () => void;
  goToNextPage: () => void;
}
const FooterBank: React.FC<FooterBankProps> = ({
  colSpan,
  currentPage,
  totalPages,
  goToNextPage,
  goToPrevPage,
}) => {
  return (
    <tfoot>
      <tr>
        <td colSpan={colSpan} className="px-[32px] py-[14px]">
          <div className="flex items-center justify-center lg:justify-end">
            <button
              className="dark:text-white px-4 py-2 rounded-md transition-colors duration-300"
              onClick={goToPrevPage}
            >
              <MdArrowBackIos className="hover:text-[#3497F9] transition-colors duration-300" />
            </button>
            <span className="flex w-32 items-center justify-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="dark:text-white px-4 py-[13.5px] rounded-md"
              onClick={goToNextPage}
            >
              <MdArrowForwardIos className="hover:text-[#3497F9] transition-colors duration-300" />
            </button>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};

export default FooterBank;
