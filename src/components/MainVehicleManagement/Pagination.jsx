import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  pagesArray,
  goToPage,
  filteredVariants,
  pageSize,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs">
      <div className="text-xs text-gray-600">
        Showing{" "}
        {filteredVariants.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
        to {Math.min(currentPage * pageSize, filteredVariants.length)} of{" "}
        {filteredVariants.length} entries
      </div>

      {/* Show pagination only if there are records */}
      {filteredVariants.length > 0 ? (
        <div className="flex gap-1 flex-wrap justify-center text-xs">
          <button
            className={`px-3 py-2 border rounded text-xs ${
              currentPage === 1 || filteredVariants.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors cursor-pointer"
            }`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || filteredVariants.length === 0}
          >
            Previous
          </button>

          {pagesArray.map((page) => (
            <button
              key={page}
              className={`px-3 py-2 border rounded cursor-pointer text-xs ${
                currentPage === page
                  ? "bg-[#222fb9] text-white border-[#222fb9]"
                  : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className={`px-3 py-2 border rounded text-xs ${
              currentPage === totalPages || filteredVariants.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors cursor-pointer"
            }`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={
              currentPage === totalPages || filteredVariants.length === 0
            }
          >
            Next
          </button>
        </div>
      ) : (
        <div className="flex gap-1 flex-wrap justify-center text-xs">
          <button
            className="px-3 py-2 border rounded bg-gray-100 text-gray-400 cursor-not-allowed text-xs"
            disabled
          >
            Previous
          </button>
          <button
            className="px-3 py-2 border rounded bg-gray-100 text-gray-400 cursor-not-allowed text-xs"
            disabled
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
