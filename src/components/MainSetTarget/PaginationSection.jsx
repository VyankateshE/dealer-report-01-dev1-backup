import React from "react";

const PaginationSection = ({
  currentPage,
  totalPages,
  visiblePages,
  filteredTeamLength,
  itemsPerPage,
  previousPage,
  nextPage,
  goToPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
      {/* Left: Info */}
      <div className="text-xs text-gray-600">
        {filteredTeamLength > 0 ? (
          <>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTeamLength)} of{" "}
            {filteredTeamLength} entries
          </>
        ) : (
          "Showing 0 entries"
        )}
      </div>

      {/* Right: Pagination */}
      <div className="flex items-center gap-2">
        <nav>
          <ul className="flex items-center gap-1">
            <li>
              <button
                className={`px-3 py-2 rounded text-xs font-medium ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {visiblePages.map((page) => (
              <li key={page}>
                <button
                  className={`px-3 py-2 rounded text-xs font-medium ${
                    page === currentPage
                      ? "bg-[#222fb9] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li>
              <button
                className={`px-3 py-2 rounded text-xs font-medium ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                }`}
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PaginationSection;
