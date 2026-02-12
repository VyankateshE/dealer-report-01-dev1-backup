// import React, { useState, useEffect, useRef } from "react";
// import { toast } from "react-toastify";

// const FilterBar = ({
//   selectedFilter,
//   customStartDate,
//   customEndDate,
//   invalidDateRange,
//   dealerSearch,
//   selectedDealers,
//   tempSelectedDealers,
//   isSticky,
//   headerRef,
//   getFilterLabel,
//   onFilterChange,
//   onCustomStartDateChange,
//   onCustomEndDateChange,
//   onDealerSearchChange,
//   onValidateCustomDates,
//   onApplyCustomDate,
//   onResetCustomDate,
//   onRefresh,
//   refreshingSA,
//   dealers,
//   filteredDealers,
//   isDealerTempSelected,
//   areAllTempSelected,
//   onToggleTempDealerSelection,
//   onToggleTempSelectAll,
//   onClearTempSelection,
//   onApplyDealerSelection,
//   onCancelDealerSelection,
//   userRole,
//   dropdownOpen,
//   setDropdownOpen,
//   customFilterPending,
// }) => {
//   const [localInvalidDateRange, setLocalInvalidDateRange] = useState(false);
//   const [localCustomStartDate, setLocalCustomStartDate] = useState("");
//   const [localCustomEndDate, setLocalCustomEndDate] = useState("");
//   const toastIdRef = useRef(null);

//   const showDealerDropdown = userRole === "GM";

//   useEffect(() => {
//     if (selectedFilter === "CUSTOM" && customStartDate && customEndDate) {
//       setLocalCustomStartDate(customStartDate);
//       setLocalCustomEndDate(customEndDate);
//     } else if (selectedFilter !== "CUSTOM") {
//       setLocalCustomStartDate("");
//       setLocalCustomEndDate("");
//     }
//   }, [selectedFilter, customStartDate, customEndDate]);

//   const validateDates = () => {
//     if (localCustomStartDate && localCustomEndDate) {
//       const invalid =
//         new Date(localCustomStartDate) > new Date(localCustomEndDate);
//       setLocalInvalidDateRange(invalid);
//       if (onValidateCustomDates) {
//         onValidateCustomDates();
//       }
//     } else {
//       setLocalInvalidDateRange(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedFilter === "CUSTOM") {
//       validateDates();
//     }
//   }, [localCustomStartDate, localCustomEndDate, selectedFilter]);

//   const handleApplyClick = () => {
//     // Always clear any existing toast
//     if (toastIdRef.current) {
//       toast.dismiss(toastIdRef.current);
//     }

//     // Validate that both dates are selected
//     if (!localCustomStartDate || !localCustomEndDate) {
//       toastIdRef.current = toast.error(
//         "Please select both start and end dates",
//         {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "light",
//           style: {
//             background: "white",
//             color: "black",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//           },
//           onClose: () => {
//             toastIdRef.current = null;
//           },
//         },
//       );
//       return;
//     }

//     // Validate date range
//     if (new Date(localCustomEndDate) < new Date(localCustomStartDate)) {
//       toastIdRef.current = toast.error(
//         "End date cannot be earlier than start date",
//         {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           theme: "light",
//           style: {
//             background: "white",
//             color: "black",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//           },
//           onClose: () => {
//             toastIdRef.current = null;
//           },
//         },
//       );
//       return;
//     }

//     // If validation passes, apply the dates
//     onCustomStartDateChange(localCustomStartDate);
//     onCustomEndDateChange(localCustomEndDate);
//     onApplyCustomDate();
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const CustomDateFilter = () => (
//     <div className="custom-date-filter flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//         <input
//           type="date"
//           value={localCustomStartDate}
//           onChange={(e) => {
//             setLocalCustomStartDate(e.target.value);
//             onCustomStartDateChange(e.target.value);
//             validateDates();
//           }}
//           className="custom-date px-2 py-1 border border-gray-300 rounded text-sm w-full sm:w-32"
//         />
//         <span className="text-gray-400 hidden sm:inline">-</span>
//         <input
//           type="date"
//           value={localCustomEndDate}
//           onChange={(e) => {
//             setLocalCustomEndDate(e.target.value);
//             onCustomEndDateChange(e.target.value);
//             validateDates();
//           }}
//           className="custom-date px-2 py-1 border border-gray-300 rounded text-sm w-full sm:w-32"
//         />
//       </div>
//       <div className="flex gap-1">
//         <button
//           onClick={handleApplyClick}
//           className="apply-btn px-3 py-1.5 sm:px-2 sm:py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] flex-1 sm:flex-none transition-colors"
//         >
//           Apply
//         </button>
//         <button
//           onClick={() => {
//             setLocalCustomStartDate("");
//             setLocalCustomEndDate("");
//             onResetCustomDate();
//           }}
//           className="reset-btn px-3 py-1.5 sm:px-2 sm:py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex-1 sm:flex-none transition-colors"
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="relative">
//       {customFilterPending && selectedFilter === "CUSTOM" && (
//         <div className="mb-2 px-2">
//           {/* Uncomment below if you want to show the warning message */}
//           {/* <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-2 rounded border border-yellow-300 flex items-center gap-2">
//             <i className="fas fa-exclamation-triangle text-xs"></i>
//             <span>
//               Please select custom dates and click "Apply" to view data
//             </span>
//           </div> */}
//         </div>
//       )}

//       <div className="border border-gray-100 rounded-lg bg-white mb-0">
//         <div
//           ref={headerRef}
//           className={`filter-bar bg-white transition-all duration-300 rounded-lg ${
//             isSticky ? "fixed top-0 left-0 right-0 z-30 shadow-md" : "relative"
//           }`}
//         >
//           <div className="max-w-full mx-auto px-2 sm:px-4">
//             <div className="px-2 sm:px-2 py-1">
//               <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
//                 {/* Left Side - All filters */}
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full lg:w-auto">
//                   {/* Filter Message */}
//                   {selectedFilter && (
//                     <div className="text-sm text-gray-600 w-full sm:w-auto">
//                       Showing results for:{" "}
//                       <span className="font-semibold">{getFilterLabel()}</span>
//                     </div>
//                   )}

//                   {/* Time Period Filter */}
//                   <select
//                     value={selectedFilter}
//                     onChange={(e) => onFilterChange(e.target.value)}
//                     className="time-filter w-full sm:w-auto px-3 py-0.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none text-sm"
//                   >
//                     <option value="DAY">Today</option>
//                     <option value="YESTERDAY">Yesterday</option>
//                     <option value="WEEK">This Week</option>
//                     <option value="LAST_WEEK">Last Week</option>
//                     <option value="MTD">This Month</option>
//                     <option value="LAST_MONTH">Last Month</option>
//                     <option value="QTD">This Quarter</option>
//                     <option value="LAST_QUARTER">Last Quarter</option>
//                     <option value="SIX_MONTH">Last 6 Months</option>
//                     <option value="YTD">This Year</option>
//                     <option value="LIFETIME">Lifetime</option>
//                     <option value="CUSTOM">Custom Range</option>
//                   </select>

//                   {/* Custom Date Range */}
//                   {selectedFilter === "CUSTOM" && <CustomDateFilter />}

//                   {/* Dealer Selection - Only visible for GM role */}
//                   {showDealerDropdown && (
//                     <div
//                       className={`dropdown relative flex-shrink-0 w-full sm:w-auto ${
//                         dropdownOpen ? "show" : ""
//                       }`}
//                     >
//                       <button
//                         className="dealer-dropdown w-full sm:w-auto px-3 py-0.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] sm:min-w-[210px] flex justify-between items-center cursor-pointer text-sm"
//                         onClick={toggleDropdown}
//                       >
//                         <span className="truncate">
//                           {selectedDealers.length > 0
//                             ? `Dealers (${selectedDealers.length})`
//                             : "All Dealers"}
//                         </span>
//                         <i
//                           className={`fas fa-chevron-down ml-1 text-[10px] transition-transform ${
//                             dropdownOpen ? "rotate-180" : ""
//                           }`}
//                         ></i>
//                       </button>

//                       {dropdownOpen && (
//                         <>
//                           <div
//                             class="dropdown-menu absolute top-full left-0 right sm:left-auto
//   bg-white border border-gray-300 rounded-lg shadow-lg
//   overflow-hidden z-50 mt-1 w-full sm:min-w-[250px] sm:max-w-[30vw]"
//                           >
//                             {/* <div className="dropdown-menu absolute top-full left-0 right-0 sm:left-auto bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 w-full sm:min-w-[250px] sm:max-w-[30vw]"> */}
//                             {/* Search Input */}
//                             {/* <div className="p-2 border-b border-gray-200">
//                               <input
//                                 type="text"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9]"
//                                 placeholder="Search dealers..."
//                                 value={dealerSearch}
//                                 onChange={(e) =>
//                                   onDealerSearchChange(e.target.value)
//                                 }
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                             </div> */}
//                             {/* Search Input */}
//                             <div className="p-2 border-b border-gray-200">
//                               <input
//                                 type="text"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9]"
//                                 placeholder="Search dealers..."
//                                 value={dealerSearch || ""}
//                                 onChange={(e) => {
//                                   const value = e.target.value.trimStart(); // <-- important
//                                   onDealerSearchChange(value);
//                                 }}
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                             </div>
//                             {/* Select All & Clear */}
//                             <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200">
//                               <label className="flex items-center justify-between text-sm cursor-pointer w-full">
//                                 <div className="flex items-center">
//                                   <input
//                                     type="checkbox"
//                                     className="mr-2 w-4 h-4 text-[#222fb9] rounded cursor-pointer focus:ring-[#222fb9]"
//                                     checked={areAllTempSelected()}
//                                     onChange={onToggleTempSelectAll}
//                                     onClick={(e) => e.stopPropagation()}
//                                   />
//                                   Select All ({tempSelectedDealers.length})
//                                 </div>
//                               </label>
//                               <button
//                                 type="button"
//                                 className="text-red-600 text-sm cursor-pointer hover:text-red-800 transition-colors ml-4"
//                                 onClick={(e) => {
//                                   onClearTempSelection();
//                                   e.stopPropagation();
//                                 }}
//                               >
//                                 Clear
//                               </button>
//                             </div>

//                             {/* Dealer List */}
//                             <div className="max-h-40 overflow-y-auto">
//                               {filteredDealers.length > 0 ? (
//                                 filteredDealers.map((dealer) => (
//                                   <div
//                                     key={dealer.dealerId}
//                                     className="dropdown-item px-3 py-2 flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//                                     onClick={(e) => e.stopPropagation()}
//                                   >
//                                     <input
//                                       type="checkbox"
//                                       className="mr-3 w-4 h-4 text-[#222fb9] cursor-pointer rounded focus:ring-[#222fb9]"
//                                       checked={isDealerTempSelected(dealer)}
//                                       onChange={() =>
//                                         onToggleTempDealerSelection(dealer)
//                                       }
//                                     />
//                                     <span
//                                       className="text-sm flex-1 cursor-pointer truncate"
//                                       onClick={() =>
//                                         onToggleTempDealerSelection(dealer)
//                                       }
//                                     >
//                                       {dealer.dealerName}
//                                     </span>
//                                   </div>
//                                 ))
//                               ) : (
//                                 <div className="text-gray-500 text-center py-3 text-sm">
//                                   {dealers.length === 0
//                                     ? "Loading dealers..."
//                                     : "No dealers found"}
//                                 </div>
//                               )}
//                             </div>

//                             {/* Cancel and Apply Buttons */}
//                             <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
//                               <button
//                                 onClick={onCancelDealerSelection}
//                                 className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition-colors"
//                               >
//                                 Cancel
//                               </button>
//                               <button
//                                 onClick={onApplyDealerSelection}
//                                 className="px-4 py-2 text-sm bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors"
//                                 disabled={tempSelectedDealers.length === 0}
//                               >
//                                 Apply ({tempSelectedDealers.length})
//                               </button>
//                             </div>
//                           </div>

//                           {/* Backdrop */}
//                           <div
//                             className="fixed inset-0 z-40"
//                             onClick={() => setDropdownOpen(false)}
//                           ></div>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Right Side - Refresh Button */}
//                 <div className="flex-shrink-0 self-end sm:self-auto">
//                   <button
//                     className="bg-[#222fb9] text-white hover:bg-[#1b258f] cursor-pointer px-4 py-1 sm:px-3 sm:py-1 rounded text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
//                     onClick={onRefresh}
//                     disabled={refreshingSA}
//                   >
//                     {refreshingSA ? (
//                       <>
//                         <i className="fas fa-spinner fa-spin"></i>
//                         Refreshing...
//                       </>
//                     ) : (
//                       "Refresh"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilterBar;
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const FilterBar = ({
  selectedFilter,
  customStartDate,
  customEndDate,
  invalidDateRange,
  dealerSearch,
  selectedDealers,
  tempSelectedDealers,
  isSticky,
  headerRef,
  getFilterLabel,
  onFilterChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onDealerSearchChange,
  onValidateCustomDates,
  onApplyCustomDate,
  onResetCustomDate,
  onRefresh,
  refreshingSA,
  dealers,
  filteredDealers,
  isDealerTempSelected,
  areAllTempSelected,
  onToggleTempDealerSelection,
  onToggleTempSelectAll,
  onClearTempSelection,
  onApplyDealerSelection,
  onCancelDealerSelection,
  userRole,
  dropdownOpen,
  setDropdownOpen,
  customFilterPending,
  customDatesApplied, // Add this prop
}) => {
  const [localInvalidDateRange, setLocalInvalidDateRange] = useState(false);
  const [localCustomStartDate, setLocalCustomStartDate] = useState("");
  const [localCustomEndDate, setLocalCustomEndDate] = useState("");
  const toastIdRef = useRef(null);

  const showDealerDropdown = userRole === "GM";

  // Update local dates when parent dates change
  useEffect(() => {
    if (selectedFilter === "CUSTOM" && customStartDate && customEndDate) {
      setLocalCustomStartDate(customStartDate);
      setLocalCustomEndDate(customEndDate);
    } else if (selectedFilter !== "CUSTOM") {
      setLocalCustomStartDate("");
      setLocalCustomEndDate("");
    }
  }, [selectedFilter, customStartDate, customEndDate]);

  const validateDates = () => {
    if (localCustomStartDate && localCustomEndDate) {
      const invalid =
        new Date(localCustomStartDate) > new Date(localCustomEndDate);
      setLocalInvalidDateRange(invalid);
      if (onValidateCustomDates) {
        onValidateCustomDates();
      }
    } else {
      setLocalInvalidDateRange(false);
    }
  };

  useEffect(() => {
    if (selectedFilter === "CUSTOM") {
      validateDates();
    }
  }, [localCustomStartDate, localCustomEndDate, selectedFilter]);

  // 🔴 FIXED: handleApplyClick - Pass dates directly to onApplyCustomDate
  const handleApplyClick = () => {
    // Always clear any existing toast
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    // Validate that both dates are selected
    if (!localCustomStartDate || !localCustomEndDate) {
      toastIdRef.current = toast.error(
        "Please select both start and end dates",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          style: {
            background: "white",
            color: "black",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          onClose: () => {
            toastIdRef.current = null;
          },
        },
      );
      return;
    }

    // Validate date range
    if (new Date(localCustomEndDate) < new Date(localCustomStartDate)) {
      toastIdRef.current = toast.error(
        "End date cannot be earlier than start date",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          style: {
            background: "white",
            color: "black",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
          onClose: () => {
            toastIdRef.current = null;
          },
        },
      );
      return;
    }

    // 🔴 CRITICAL FIX: Update parent state FIRST
    onCustomStartDateChange(localCustomStartDate);
    onCustomEndDateChange(localCustomEndDate);

    // 🔴 CRITICAL FIX: Pass dates directly to onApplyCustomDate
    onApplyCustomDate(localCustomStartDate, localCustomEndDate);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const CustomDateFilter = () => (
    <div className="custom-date-filter flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="date"
          value={localCustomStartDate}
          onChange={(e) => {
            const value = e.target.value;
            setLocalCustomStartDate(value);
            onCustomStartDateChange(value);
            validateDates();
          }}
          className="custom-date px-2 py-1 border border-gray-300 rounded text-sm w-full sm:w-32"
        />
        <span className="text-gray-400 hidden sm:inline">-</span>
        <input
          type="date"
          value={localCustomEndDate}
          onChange={(e) => {
            const value = e.target.value;
            setLocalCustomEndDate(value);
            onCustomEndDateChange(value);
            validateDates();
          }}
          className="custom-date px-2 py-1 border border-gray-300 rounded text-sm w-full sm:w-32"
        />
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleApplyClick}
          className="apply-btn px-3 py-1.5 sm:px-2 sm:py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] flex-1 sm:flex-none transition-colors"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setLocalCustomStartDate("");
            setLocalCustomEndDate("");
            onResetCustomDate();
          }}
          className="reset-btn px-3 py-1.5 sm:px-2 sm:py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex-1 sm:flex-none transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {customFilterPending && selectedFilter === "CUSTOM" && (
        <div className="mb-2 px-2">
          <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-2 rounded border border-yellow-300 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle text-xs"></i>
            <span>
              Please select custom dates and click "Apply" to view data
            </span>
          </div>
        </div>
      )}

      <div className="border border-gray-100 rounded-lg bg-white mb-0">
        <div
          ref={headerRef}
          className={`filter-bar bg-white transition-all duration-300 rounded-lg ${
            isSticky ? "fixed top-0 left-0 right-0 z-30 shadow-md" : "relative"
          }`}
        >
          <div className="max-w-full mx-auto px-2 sm:px-4">
            <div className="px-2 sm:px-2 py-1">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
                {/* Left Side - All filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 w-full lg:w-auto">
                  {/* Filter Message */}
                  {selectedFilter && (
                    <div className="text-sm text-gray-600 w-full sm:w-auto">
                      Showing results for:{" "}
                      <span className="font-semibold">{getFilterLabel()}</span>
                    </div>
                  )}

                  {/* Time Period Filter */}
                  <select
                    value={selectedFilter}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="time-filter w-full sm:w-auto px-3 py-0.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none text-sm"
                  >
                    <option value="DAY">Today</option>
                    <option value="YESTERDAY">Yesterday</option>
                    <option value="WEEK">This Week</option>
                    <option value="LAST_WEEK">Last Week</option>
                    <option value="MTD">This Month</option>
                    <option value="LAST_MONTH">Last Month</option>
                    <option value="QTD">This Quarter</option>
                    <option value="LAST_QUARTER">Last Quarter</option>
                    <option value="SIX_MONTH">Last 6 Months</option>
                    <option value="YTD">This Year</option>
                    <option value="LIFETIME">Lifetime</option>
                    <option value="CUSTOM">Custom Range</option>
                  </select>

                  {/* Custom Date Range */}
                  {selectedFilter === "CUSTOM" && <CustomDateFilter />}

                  {/* Dealer Selection - Only visible for GM role */}
                  {showDealerDropdown && (
                    <div
                      className={`dropdown relative flex-shrink-0 w-full sm:w-auto ${
                        dropdownOpen ? "show" : ""
                      }`}
                    >
                      <button
                        className="dealer-dropdown w-full sm:w-auto px-3 py-0.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] sm:min-w-[210px] flex justify-between items-center cursor-pointer text-sm"
                        onClick={toggleDropdown}
                      >
                        <span className="truncate">
                          {selectedDealers.length > 0
                            ? `Dealers (${selectedDealers.length})`
                            : "All Dealers"}
                        </span>
                        <i
                          className={`fas fa-chevron-down ml-1 text-[10px] transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        ></i>
                      </button>

                      {dropdownOpen && (
                        <>
                          <div
                            className="dropdown-menu absolute top-full left-0 right sm:left-auto 
  bg-white border border-gray-300 rounded-lg shadow-lg 
  overflow-hidden z-50 mt-1 w-full sm:min-w-[250px] sm:max-w-[30vw]"
                          >
                            {/* Search Input */}
                            <div className="p-2 border-b border-gray-200">
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9]"
                                placeholder="Search dealers..."
                                value={dealerSearch || ""}
                                onChange={(e) => {
                                  const value = e.target.value.trimStart();
                                  onDealerSearchChange(value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            {/* Select All & Clear */}
                            <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200">
                              <label className="flex items-center justify-between text-sm cursor-pointer w-full">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="mr-2 w-4 h-4 text-[#222fb9] rounded cursor-pointer focus:ring-[#222fb9]"
                                    checked={areAllTempSelected()}
                                    onChange={onToggleTempSelectAll}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  Select All ({tempSelectedDealers.length})
                                </div>
                              </label>
                              <button
                                type="button"
                                className="text-red-600 text-sm cursor-pointer hover:text-red-800 transition-colors ml-4"
                                onClick={(e) => {
                                  onClearTempSelection();
                                  e.stopPropagation();
                                }}
                              >
                                Clear
                              </button>
                            </div>

                            {/* Dealer List */}
                            <div className="max-h-40 overflow-y-auto">
                              {filteredDealers.length > 0 ? (
                                filteredDealers.map((dealer) => (
                                  <div
                                    key={dealer.dealerId}
                                    className="dropdown-item px-3 py-2 flex items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <input
                                      type="checkbox"
                                      className="mr-3 w-4 h-4 text-[#222fb9] cursor-pointer rounded focus:ring-[#222fb9]"
                                      checked={isDealerTempSelected(dealer)}
                                      onChange={() =>
                                        onToggleTempDealerSelection(dealer)
                                      }
                                    />
                                    <span
                                      className="text-sm flex-1 cursor-pointer truncate"
                                      onClick={() =>
                                        onToggleTempDealerSelection(dealer)
                                      }
                                    >
                                      {dealer.dealerName}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-500 text-center py-3 text-sm">
                                  {dealers.length === 0
                                    ? "Loading dealers..."
                                    : "No dealers found"}
                                </div>
                              )}
                            </div>

                            {/* Cancel and Apply Buttons */}
                            <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
                              <button
                                onClick={onCancelDealerSelection}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={onApplyDealerSelection}
                                className="px-4 py-2 text-sm bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors"
                                disabled={tempSelectedDealers.length === 0}
                              >
                                Apply ({tempSelectedDealers.length})
                              </button>
                            </div>
                          </div>

                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setDropdownOpen(false)}
                          ></div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side - Refresh Button */}
                <div className="flex-shrink-0 self-end sm:self-auto">
                  <button
                    className="bg-[#222fb9] text-white hover:bg-[#1b258f] cursor-pointer px-4 py-1 sm:px-3 sm:py-1 rounded text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                    onClick={onRefresh}
                    disabled={refreshingSA}
                  >
                    {refreshingSA ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Refreshing...
                      </>
                    ) : (
                      "Refresh"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
