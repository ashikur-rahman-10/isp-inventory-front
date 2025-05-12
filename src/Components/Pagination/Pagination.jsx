import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination w-fit space-x-3 flex text-xs items-center font-semibold">
            <button className="bg-blue-500 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-700  text-white flex gap-1 items-center font-semibold " onClick={handlePrevious} disabled={currentPage === 1}>
                <IoIosArrowBack className="text-sm"></IoIosArrowBack> Previous

            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button className="bg-blue-500 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-700  text-white flex gap-1 items-center font-semibold " onClick={handleNext} disabled={currentPage === totalPages}>
                Next <IoIosArrowForward />
            </button>
        </div>
    );
};

export default Pagination;
