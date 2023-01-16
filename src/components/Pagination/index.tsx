import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import ReactPaginate from "react-paginate";
import React from "react";

export interface IPaginationSelected {
  selected: number;
}
export interface IPagination {
  handlePageClick: (selectedItem: IPaginationSelected) => void;
  itemsLength: number;
  pageSize: number;
}

export default function Pagination({
  handlePageClick,
  itemsLength,
  pageSize,
}: IPagination) {
  let pageCount = Math.ceil(itemsLength / pageSize);

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={<MdOutlineKeyboardArrowRight size={30} />}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      initialPage={0}
      disabledClassName="text-gray-300"
      pageCount={pageCount !== 1 ? pageCount : 0}
      previousLabel={<MdOutlineKeyboardArrowLeft size={30} />}
      onPageChange={handlePageClick}
      containerClassName="pb-4 pt-12 pl-2 flex items-center gap-4 text-faded-80 overflow-auto justify-start sm:justify-center"
      activeClassName="outline outline-2 outline-[#4F4A4A] rounded-full"
      pageLinkClassName="border border-[#DCDBDB] h-10 w-10 rounded-full flex justify-center items-center"
      previousLinkClassName="bg-[#F6F6F6] h-10 w-10 rounded-full flex justify-center items-center"
      nextLinkClassName="bg-[#F6F6F6] h-10 w-10 rounded-full flex justify-center items-center"
      renderOnZeroPageCount={() => null}
    />
  );
}
