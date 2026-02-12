import React from "react";

const VehicleFilterSection = ({
  pageSize,
  changePageSize,
  searchText,
  setSearchText,
  pageSizes = [10, 20, 50],
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center mb-2 text-xs">
      <div className="flex items-center pb-2 md:w-9/12">
        <select
          className="w-15 border cursor-pointer border-gray-300 rounded h-8 px-2 mr-2 text-xs"
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size} className="text-xs">
              {size}
            </option>
          ))}
        </select>
        <span className="ml-2 text-xs">records per page</span>
      </div>
      <div className="flex justify-end items-center pb-2 rounded-lg md:w-3/12">
        <input
          type="text"
          className="border border-gray-300 px-4 rounded-lg py-1 w-full max-w-xs text-xs"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
    </div>
  );
};

export default VehicleFilterSection;
