import React from "react";
import { STATUS_COLORS } from "./constants";

export const LeadTable = ({
  allLead,
  isLoading,
  pageNumber,
  pageLimit,
  toggleLeadSelection,
  getStatusColor,
  formatDateOnly,
  handleViewDetails,
  handleLeadOpen,
  handleSingleReassign,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg text-xs overflow-hidden">
      <div className="overflow-x-auto">
        <div
          className="relative"
          style={{
            maxHeight: pageLimit >= 50 ? "500px" : "auto",
            overflowY: pageLimit >= 50 ? "auto" : "visible",
          }}
        >
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-xs sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-xs">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Sr No
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Enquiry Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Mobile No.
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Enquiry Owner
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Enquiry Source
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  PMI
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Created On
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Age
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {allLead.leads?.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-8 text-gray-500 text-xs"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center text-xs">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      "No Enquiry Found"
                    )}
                  </td>
                </tr>
              ) : (
                allLead.leads?.map((data, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-xs"
                  >
                    <td className="py-3 px-4 text-xs">
                      <div className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={data.selected || false}
                          onChange={() => toggleLeadSelection(i)}
                          className="w-4 h-4 text-[#222fb9] focus:ring-[#222fb9]"
                        />
                        {(pageNumber - 1) * pageLimit + i + 1}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.lead_name || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.mobile || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.lead_owner || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.lead_source || "-"}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.PMI || data.vehicle_name || "-"}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          data.status,
                        )}`}
                      >
                        {data.status || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {formatDateOnly(data.created_at)}
                    </td>
                    <td className="py-3 px-4 text-gray-800 text-xs">
                      {data.lead_age ? `${data.lead_age} day(s)` : "-"}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="relative inline-block text-left group text-xs">
                        <button className="p-1 rounded hover:bg-gray-200 transition-colors text-xs">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-gray-600"
                          >
                            <circle cx="5" cy="12" r="2"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                            <circle cx="19" cy="12" r="2"></circle>
                          </svg>
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs">
                          {data.status === "Lost" && (
                            <button
                              className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                              onClick={() => handleLeadOpen(data)}
                            >
                              Lead Open
                            </button>
                          )}
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => handleViewDetails(data)}
                          >
                            View Details
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => handleSingleReassign(data)}
                          >
                            Reassign
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
