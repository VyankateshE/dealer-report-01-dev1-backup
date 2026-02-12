import React from "react";

const FilterSection = ({
  itemsPerPage,
  selectedRange,
  searchTerm,
  hasAnyChanges,
  targetListLength,
  onItemsPerPageChange,
  onSelectRange,
  onSearchChange,
  onEditAll,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
      {/* Left: Records per page */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700">
          Records per page:
        </label>
        <select
          className="w-20 h-8 rounded-lg border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      {/* Right: Filters + Search + Update */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Filter buttons */}
        <div className="bg-white p-0.5 rounded-lg border border-gray-300 inline-flex gap-1">
          <button
            type="button"
            className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
              selectedRange === "MTD"
                ? "bg-[#222fb9] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onSelectRange("MTD")}
          >
            MTD
          </button>
          <button
            type="button"
            className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
              selectedRange === "QTD"
                ? "bg-[#222fb9] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onSelectRange("QTD")}
          >
            QTD
          </button>
          <button
            type="button"
            className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
              selectedRange === "YTD"
                ? "bg-[#222fb9] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => onSelectRange("YTD")}
          >
            YTD
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          className="sm:max-w-xs h-8 rounded-full border border-gray-300 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
          placeholder="Search users..."
          value={searchTerm}
          onChange={onSearchChange}
        />

        {/* Update button */}
        <button
          className="h-8 px-5 rounded-lg text-xs font-medium text-white bg-[#222fb9] hover:bg-[#1a2580] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={!hasAnyChanges || targetListLength === 0}
          onClick={onEditAll}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default FilterSection;
