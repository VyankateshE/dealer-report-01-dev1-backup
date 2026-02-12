import React from "react";

export const Pagination = ({
  pageNumber,
  totalPages,
  totalRecords,
  pageLimit,
  goToPage,
}) => {
  const showingFrom = totalRecords === 0 ? 0 : (pageNumber - 1) * pageLimit + 1;
  const showingTo = Math.min(pageNumber * pageLimit, totalRecords);

  const getPaginationRange = () => {
    const totalNumbers = 5;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, pageNumber - 1);
      const endPage = Math.min(totalPages - 1, pageNumber + 1);
      let pages = [1];

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
      return pages;
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs">
      <div className="text-xs text-gray-600">
        Showing {showingFrom} to {showingTo} of {totalRecords} entries
      </div>

      <div className="flex gap-1 flex-wrap justify-center text-xs">
        <button
          className={`px-3 py-2 border rounded text-xs ${
            pageNumber === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
          }`}
          onClick={() => goToPage(pageNumber - 1)}
          disabled={pageNumber === 1}
        >
          Previous
        </button>

        {getPaginationRange().map((page, index) => (
          <button
            key={index}
            className={`px-3 py-2 border rounded text-xs ${
              pageNumber === page
                ? "bg-[#222fb9] text-white border-[#222fb9]"
                : page === "..."
                  ? "bg-gray-100 text-gray-400 cursor-default"
                  : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
            }`}
            onClick={() => typeof page === "number" && goToPage(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}

        <button
          className={`px-3 py-2 border rounded text-xs ${
            pageNumber === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
          }`}
          onClick={() => goToPage(pageNumber + 1)}
          disabled={pageNumber === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};
