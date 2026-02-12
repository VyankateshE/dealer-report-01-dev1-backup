// import React, { forwardRef, useState, useEffect } from "react";
// import DealerFilter from "./DealerFilter";

// const FilterSection = forwardRef(
//   (
//     {
//       dealers,
//       filteredDealers,
//       selectedDealers,
//       setSelectedDealers,
//       dealerSearch,
//       setDealerSearch,
//       selectedDateFilter,
//       setSelectedDateFilter,
//       stats,
//       fetchData,
//       showApplyCancelButtons = true, // ✅ Add this prop
//     },
//     ref
//   ) => {
//     const [isSticky, setIsSticky] = useState(false);

//     useEffect(() => {
//       const handleScroll = () => {
//         if (window.scrollY > 50) {
//           setIsSticky(true);
//         } else {
//           setIsSticky(false);
//         }
//       };

//       window.addEventListener("scroll", handleScroll, { passive: true });

//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//       };
//     }, []);

//     return (
//       <>
//         {/* Original position - always visible in document flow */}
//         <div
//           ref={ref}
//           className={`bg-white border-b border-gray-200 transition-all duration-300 ${
//             isSticky ? "invisible" : "visible"
//           }`}
//         >
//           <div className="max-w-full mx-auto px-3 py-1">
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-2">
//               {/* Left Side - Filters */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
//                 {/* Dealer Filter */}

//                 {/* Date Filter */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
//                     Date Filter
//                   </span>
//                   <select
//                     className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9] min-w-[120px]"
//                     value={selectedDateFilter}
//                     onChange={(e) => setSelectedDateFilter(e.target.value)}
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
//                     <option value="YTD">Year to Date</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
//                     Dealer Filter
//                   </span>
//                   <DealerFilter
//                     filteredDealers={filteredDealers}
//                     selectedDealers={selectedDealers}
//                     setSelectedDealers={setSelectedDealers}
//                     dealerSearch={dealerSearch}
//                     setDealerSearch={setDealerSearch}
//                     showApplyCancelButtons={showApplyCancelButtons} // ✅ Pass the prop
//                   />
//                 </div>
//               </div>

//               {/* Stats in single line */}
//               <div className="flex flex-wrap items-center gap-3 sm:gap-2 w-full lg:w-auto justify-center sm:justify-start">
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.distinctUsers || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Active Users
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.saLeads || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Enquiries
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.followups || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Follow-ups
//                   </div>
//                 </div>
//                 {/* <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.testDrives || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     UTDs
//                   </div>
//                 </div> */}
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.enquiryCalls || 0} / {stats?.coldCalls || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Enquiry / Cold Calls
//                   </div>
//                 </div>
//               </div>

//               {/* Refresh Button */}
//               <button
//                 className="bg-[#222fb9] text-white hover:bg-gray-300 cursor-pointer px-2 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1 whitespace-nowrap w-full sm:w-auto justify-center"
//                 onClick={fetchData}
//               >
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 <span>Refresh</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Sticky clone - appears when scrolling down */}
//         <div
//           className={`bg-white border-b border-gray-200 fixed top-0 left-0 right-0 shadow-md z-30 transition-all duration-300 ${
//             isSticky
//               ? "visible transform translate-y-0"
//               : "invisible transform -translate-y-full"
//           }`}
//         >
//           <div className="max-w-full mx-auto px-3 py-1">
//             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-2">
//               {/* Left Side - Filters */}
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
//                 {/* Dealer Filter */}
//                 <div className="flex items-center gap-2">
//                   <span
//                     className="text-xs font-medium text-gray-700 cursor-pointer
//  whitespace-nowrap"
//                   >
//                     Dealer Filter
//                   </span>
//                   <DealerFilter
//                     filteredDealers={filteredDealers}
//                     selectedDealers={selectedDealers}
//                     setSelectedDealers={setSelectedDealers}
//                     dealerSearch={dealerSearch}
//                     setDealerSearch={setDealerSearch}
//                   />
//                 </div>

//                 {/* Date Filter */}
//                 <div className="flex items-center gap-2">
//                   <span
//                     className="text-xs cursor-pointer
//  font-medium text-gray-700 whitespace-nowrap"
//                   >
//                     Date Filter
//                   </span>
//                   <select
//                     className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9] cursor-pointer
//  min-w-[120px]"
//                     value={selectedDateFilter}
//                     onChange={(e) => setSelectedDateFilter(e.target.value)}
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
//                     <option value="YTD">Year to Date</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Stats in single line */}
//               <div className="flex flex-wrap items-center gap-3 sm:gap-2 w-full lg:w-auto justify-center sm:justify-start">
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.distinctUsers || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Active Users
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.saLeads || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Enquiries
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.followups || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Follow-ups
//                   </div>
//                 </div>
//                 {/* <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.testDrives || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     UTDs
//                   </div>
//                 </div> */}
//                 <div className="flex items-center gap-1">
//                   <div className="text-xs font-semibold text-gray-900">
//                     {stats?.enquiryCalls || 0} / {stats?.coldCalls || 0}
//                   </div>
//                   <div className="text-[10px] text-gray-600 uppercase font-medium">
//                     Enquiry / Cold Calls
//                   </div>
//                 </div>
//               </div>

//               {/* Refresh Button - Same size as original */}
//               <button
//                 className="bg-[#222fb9] text-white hover:bg-gray-300 cursor-pointer px-2 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1 whitespace-nowrap w-full sm:w-auto justify-center"
//                 onClick={fetchData}
//               >
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//                 <span>Refresh</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }
// );

// FilterSection.displayName = "FilterSection";

// export default FilterSection;
import React, { forwardRef, useState, useEffect } from "react";
import DealerFilter from "./DealerFilter";

const FilterSection = forwardRef(
  (
    {
      dealers,
      filteredDealers,
      selectedDealers,
      setSelectedDealers,
      dealerSearch,
      setDealerSearch,
      selectedDateFilter,
      setSelectedDateFilter,
      stats,
      fetchData,
      showApplyCancelButtons = true, // ✅ Add this prop
    },
    ref,
  ) => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return (
      <>
        {/* Original position - always visible in document flow */}
        <div
          ref={ref}
          className={`bg-white border-b border-gray-200 transition-all duration-300 ${
            isSticky ? "invisible" : "visible"
          }`}
        >
          <div className="max-w-full mx-auto px-3 py-1">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-2">
              {/* Left Side - Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    Date Filter
                  </span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9] min-w-[120px]"
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
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
                    <option value="YTD">Year to Date</option>
                  </select>
                </div>

                {/* Dealer Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    Dealer Filter
                  </span>
                  <DealerFilter
                    filteredDealers={filteredDealers}
                    selectedDealers={selectedDealers}
                    setSelectedDealers={setSelectedDealers}
                    dealerSearch={dealerSearch}
                    setDealerSearch={setDealerSearch}
                    showApplyCancelButtons={showApplyCancelButtons} // ✅ Pass the prop
                  />
                </div>
              </div>

              {/* Stats in single line */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-2 w-full lg:w-auto justify-center sm:justify-start">
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.distinctUsers || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Active Users
                  </div>
                </div>
                {/* <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.saLeads || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Enquiries
                  </div>
                </div> */}
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.followups || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Follow-ups
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.testDrives || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    TD
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.enquiryCalls || 0} / {stats?.coldCalls || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Enquiry / Cold Calls
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                className="bg-[#222fb9] text-white hover:bg-[#1a259c] cursor-pointer px-2 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1 whitespace-nowrap w-full sm:w-auto justify-center"
                onClick={fetchData}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sticky clone - appears when scrolling down */}
        <div
          className={`bg-white border-b border-gray-200 fixed top-0 left-0 right-0 shadow-md z-30 transition-all duration-300 ${
            isSticky
              ? "visible transform translate-y-0"
              : "invisible transform -translate-y-full"
          }`}
        >
          <div className="max-w-full mx-auto px-3 py-1">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-2">
              {/* Left Side - Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs cursor-pointer font-medium text-gray-700 whitespace-nowrap">
                    Date Filter
                  </span>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9] cursor-pointer min-w-[120px]"
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
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
                    <option value="YTD">Year to Date</option>
                  </select>
                </div>

                {/* Dealer Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-700 cursor-pointer whitespace-nowrap">
                    Dealer Filter
                  </span>
                  <DealerFilter
                    filteredDealers={filteredDealers}
                    selectedDealers={selectedDealers}
                    setSelectedDealers={setSelectedDealers}
                    dealerSearch={dealerSearch}
                    setDealerSearch={setDealerSearch}
                    showApplyCancelButtons={showApplyCancelButtons} // ✅ ADDED: Pass the prop in sticky version too
                  />
                </div>
              </div>

              {/* Stats in single line */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-2 w-full lg:w-auto justify-center sm:justify-start">
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.distinctUsers || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Active Users
                  </div>
                </div>
                {/* <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.saLeads || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Enquiries
                  </div>
                </div> */}
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.followups || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Follow-ups
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="text-xs font-semibold text-gray-900">
                    {stats?.enquiryCalls || 0} / {stats?.coldCalls || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 uppercase font-medium">
                    Enquiry / Cold Calls
                  </div>
                </div>
              </div>

              {/* Refresh Button - Same size as original */}
              <button
                className="bg-[#222fb9] text-white hover:bg-gray-300 cursor-pointer px-2 py-1 rounded text-xs transition-colors duration-200 flex items-center gap-1 whitespace-nowrap w-full sm:w-auto justify-center"
                onClick={fetchData}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  },
);

FilterSection.displayName = "FilterSection";

export default FilterSection;
