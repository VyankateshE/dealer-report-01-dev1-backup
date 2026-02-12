import React from "react";

const TargetsTable = ({
  isLoading,
  paginatedTarget,
  currentPage,
  itemsPerPage,
  handleInputChange,
  handleKeyPress,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Sr No
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Email
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Enquiries
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Unique Test Drives
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Orders
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Loading State */}
          {isLoading && (
            <tr>
              <td colSpan="6" className="py-5 px-4 text-center text-xs">
                Loading...
              </td>
            </tr>
          )}

          {/* No Data State */}
          {!isLoading && paginatedTarget.length === 0 && (
            <tr>
              <td
                colSpan="6"
                className="py-5 px-4 text-center text-gray-500 text-xs"
              >
                No target found
              </td>
            </tr>
          )}

          {/* Data Rows */}
          {!isLoading &&
            paginatedTarget.map((target, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 px-4 text-xs">
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </td>
                <td className="py-2 px-4 text-xs">
                  {target.user?.name ||
                    `${target.user?.fname || ""} ${target.user?.lname || ""}`.trim() ||
                    "N/A"}
                </td>
                <td className="py-2 px-4 text-xs">
                  {target.user?.email || "N/A"}
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
                    value={
                      target.target.enquiries === 0
                        ? ""
                        : target.target.enquiries
                    }
                    onChange={(e) =>
                      handleInputChange(i, "enquiries", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    max={999}
                    min="0"
                    placeholder="0"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
                    value={
                      target.target.testDrives === 0
                        ? ""
                        : target.target.testDrives
                    }
                    onChange={(e) =>
                      handleInputChange(i, "testDrives", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    max={999}
                    min="0"
                    placeholder="0"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
                    value={
                      target.target.orders === 0 ? "" : target.target.orders
                    }
                    onChange={(e) =>
                      handleInputChange(i, "orders", e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    max={999}
                    min="0"
                    placeholder="0"
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TargetsTable;
