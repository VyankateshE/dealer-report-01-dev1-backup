import React, { useState } from "react";

export const DateFilterPopup = ({
  tempStartDate,
  setTempStartDate,
  tempEndDate,
  setTempEndDate,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSelectedDateRangeMsg,
  setDateFilterApplied,
  setPageNumber,
  setShowDatePopup,
  isDateLoading,
  setIsDateLoading,
}) => {
  const [localTempStartDate, setLocalTempStartDate] = useState(tempStartDate);
  const [localTempEndDate, setLocalTempEndDate] = useState(tempEndDate);

  const applyDateFilter = async () => {
    if (!localTempStartDate || !localTempEndDate) {
      return;
    }

    const start = new Date(localTempStartDate);
    const end = new Date(localTempEndDate);

    if (end < start) {
      return;
    }

    setIsDateLoading(true);
    try {
      setStartDate(localTempStartDate);
      setEndDate(localTempEndDate);
      setTempStartDate(localTempStartDate);
      setTempEndDate(localTempEndDate);
      setSelectedDateRangeMsg(
        `Date Range: ${localTempStartDate} to ${localTempEndDate}`,
      );
      setDateFilterApplied(true);
      setShowDatePopup(false);
      setPageNumber(1);
    } catch (error) {
      console.error("Error applying date filter:", error);
    } finally {
      setIsDateLoading(false);
    }
  };

  const closeDatePopup = () => {
    setShowDatePopup(false);
  };

  const isEndDateInvalid =
    localTempStartDate &&
    localTempEndDate &&
    new Date(localTempEndDate) < new Date(localTempStartDate);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl relative w-96 shadow-lg text-xs">
        <button
          className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={closeDatePopup}
        >
          &times;
        </button>

        <h5 className="mb-4 font-bold text-xs">Select Date Range</h5>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
            value={localTempStartDate}
            onChange={(e) => setLocalTempStartDate(e.target.value)}
            max={localTempEndDate || undefined}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
            End Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
            value={localTempEndDate}
            onChange={(e) => setLocalTempEndDate(e.target.value)}
            min={localTempStartDate || undefined}
          />
          {isEndDateInvalid && (
            <p className="text-red-500 text-xs mt-1">
              ⚠️ End date cannot be before start date
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 text-xs">
          <button
            className="bg-white border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-gray-50 transition-colors text-xs"
            onClick={closeDatePopup}
          >
            Cancel
          </button>
          <button
            className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={applyDateFilter}
            disabled={
              !localTempStartDate || !localTempEndDate || isEndDateInvalid
            }
          >
            Apply
          </button>
        </div>

        {isDateLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-xl">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
