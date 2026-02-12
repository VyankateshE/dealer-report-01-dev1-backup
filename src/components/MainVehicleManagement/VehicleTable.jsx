import React from "react";

const VehicleTable = ({
  pagedVariants,
  filteredVariants,
  loading,
  currentPage,
  pageSize,
  editVariant,
  formatTypeForDisplay,
}) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 text-xs">
          <tr className="border-b border-gray-200 text-xs">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              Sr No
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              Model Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              Variant Name
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              VIN
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              Type
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              YOM
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
              Alias
            </th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {filteredVariants.length === 0 ? (
            <tr>
              <td
                colSpan="8"
                className="text-center py-8 text-gray-500 text-xs"
              >
                {loading ? (
                  <div className="flex justify-center items-center text-xs">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  "No Variants Found"
                )}
              </td>
            </tr>
          ) : (
            pagedVariants.map((data, i) => (
              <tr
                key={`${data.vehicle_id}-${i}`}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-xs"
              >
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {(currentPage - 1) * pageSize + i + 1}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {data.vehicle_name || "-"}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {data.variant || "-"}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs font-mono">
                  {data.VIN || "-"}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {formatTypeForDisplay(data.type) || "-"}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {data.YOM || "-"}
                </td>
                <td className="text-left py-3 px-4 text-gray-800 text-xs">
                  {data.identity || "-"}
                </td>
                <td className="text-center py-3 px-4 text-xs">
                  <div className="flex justify-center space-x-1 text-xs">
                    <button
                      onClick={() => editVariant(data)}
                      className="bg-[#222fb9] cursor-pointer hover:bg-[#1b258f] text-white p-1 rounded shadow transition-colors text-xs flex items-center justify-center w-6 h-6"
                      title="Edit"
                    >
                      <span className="text-[10px]">✏️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
