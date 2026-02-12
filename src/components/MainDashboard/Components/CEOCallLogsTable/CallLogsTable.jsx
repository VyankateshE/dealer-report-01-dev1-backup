// NOT PREVENTED CODE OF BG SCROLL BEHIND WHEN MODAL OPENS
// import React, { useState, useEffect, useMemo } from "react";
// import BarChart from "./BarChart";
// import UserCallLogsSubTable from "./UserCallLogsSubTable";

// const CallLogsTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   userCallLogs,
//   loadingUsers,
//   dealerSummaryCallsViewType,
//   dealerSummaryCallsDataType, // Main table data type
//   onSetDealerSummaryCallsViewType,
//   onSetDealerSummaryCallsDataType, // Main table setter
//   onGetDealerCalls,
//   onGetSortedCallLogs,
//   // ✅ ADD: New prop for custom filter pending state
//   customFilterPending, // This comes from parent CEODashboard
//   // ✅ ADD: Function to get filter label
//   getFilterLabel, // Function to get readable filter label
// }) => {
//   const [dealerCallsData, setDealerCallsData] = useState({});
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showCallLogsModal, setShowCallLogsModal] = useState(false);
//   const [modalDataType, setModalDataType] = useState("combinedCalls"); // Separate state for modal
//   const [modalUsersData, setModalUsersData] = useState({}); // Store user data per filter

//   // Fix loadingUsers prop - handle both boolean and object cases
//   const isLoading = React.useMemo(() => {
//     // console.log("📞 Raw loadingUsers prop:", loadingUsers);
//     // console.log("📞 Type of loadingUsers:", typeof loadingUsers);

//     // Handle different cases for loadingUsers
//     if (loadingUsers === undefined || loadingUsers === null) {
//       return false;
//     }

//     if (typeof loadingUsers === "boolean") {
//       return loadingUsers;
//     }

//     if (typeof loadingUsers === "object") {
//       // If it's an object, check if it has any truthy values that indicate loading
//       if (loadingUsers.loading !== undefined) {
//         return Boolean(loadingUsers.loading);
//       }
//       if (loadingUsers.isLoading !== undefined) {
//         return Boolean(loadingUsers.isLoading);
//       }
//       // If it's an empty object, assume not loading
//       return Object.keys(loadingUsers).length > 0;
//     }

//     // Default case
//     return Boolean(loadingUsers);
//   }, [loadingUsers]);

//   // Debug logs
//   useEffect(() => {
//     // console.log("📞 CallLogsTable - Total dealers:", dealers?.length);
//     // console.log(
//     //   "📞 CallLogsTable - Selected dealers:",
//     //   selectedDealers?.length
//     // );
//     // console.log("📞 CallLogsTable - userCallLogs:", userCallLogs);
//     // console.log("📞 CallLogsTable - Final isLoading:", isLoading);
//     // console.log("📞 CallLogsTable - customFilterPending:", customFilterPending);

//     // Check if onGetDealerCalls function exists and works
//     if (dealers && dealers.length > 0 && onGetDealerCalls) {
//       // console.log("🔄 Testing onGetDealerCalls function...");
//       const testDealer = dealers[0];
//       const testResult = onGetDealerCalls(
//         testDealer,
//         dealerSummaryCallsDataType
//       );
//       // console.log("📞 Test result for first dealer:", testResult);
//     }
//   }, [
//     dealers,
//     selectedDealers,
//     userCallLogs,
//     onGetDealerCalls,
//     isLoading,
//     dealerSummaryCallsDataType,
//     customFilterPending,
//   ]);

//   // Load dealer calls data based on main table filter
//   useEffect(() => {
//     if (dealers && dealers.length > 0 && onGetDealerCalls) {
//       const callsData = {};
//       dealers.forEach((dealer) => {
//         const dealerId = dealer.dealerId || dealer.id;
//         const calls = onGetDealerCalls(dealer, dealerSummaryCallsDataType);
//         // console.log(
//         //   `📞 Data for ${dealer.dealerName} (${dealerSummaryCallsDataType}):`,
//         //   calls
//         // );
//         callsData[dealerId] = calls;
//       });
//       setDealerCallsData(callsData);
//       // console.log("📞 All dealer calls data:", callsData);
//     }
//   }, [dealers, onGetDealerCalls, dealerSummaryCallsDataType]);

//   // Handle dealer click to open modal
//   const handleDealerClick = (dealer) => {
//     // console.log(
//     //   "📞 Opening call logs modal for dealer:",
//     //   dealer.dealerName || dealer.name
//     // );
//     setSelectedDealer(dealer);
//     setModalDataType(dealerSummaryCallsDataType); // Initialize modal with current main table filter

//     // Pre-load user data for the current filter
//     if (onGetSortedCallLogs && dealer?.dealerId) {
//       const initialUsers = onGetSortedCallLogs(
//         dealer.dealerId,
//         dealerSummaryCallsDataType
//       );
//       setModalUsersData((prev) => ({
//         ...prev,
//         [`${dealer.dealerId}_${dealerSummaryCallsDataType}`]: initialUsers,
//       }));
//     }

//     setShowCallLogsModal(true);
//   };

//   // Handle modal filter change
//   const handleModalFilterChange = (newDataType) => {
//     // console.log("🔄 Changing modal filter to:", newDataType);
//     setModalDataType(newDataType);

//     // Pre-fetch user data when filter changes
//     if (selectedDealer && onGetSortedCallLogs) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;
//       const usersData = onGetSortedCallLogs(dealerId, newDataType);
//       setModalUsersData((prev) => ({
//         ...prev,
//         [`${dealerId}_${newDataType}`]: usersData,
//       }));
//     }
//   };

//   const closeModal = () => {
//     setShowCallLogsModal(false);
//     setSelectedDealer(null);
//   };

//   // Direct data access function for main table
//   const getDealerCalls = (dealer) => {
//     const dealerId = dealer.dealerId || dealer.id;

//     // Method 1: Check if we have pre-loaded data
//     if (dealerCallsData[dealerId]) {
//       return dealerCallsData[dealerId];
//     }

//     // Method 2: Use the function directly
//     if (onGetDealerCalls) {
//       const calls = onGetDealerCalls(dealer, dealerSummaryCallsDataType);
//       return calls;
//     }

//     // Fallback: Return empty data
//     return {
//       totalCalls: 0,
//       outgoing: 0,
//       incoming: 0,
//       connectedCalls: 0,
//       declined: 0,
//       duration: 0,
//       avgConnected: 0,
//       callsAbove1Min: 0,
//     };
//   };

//   // Direct data access function for modal (uses modal's data type)
//   const getDealerCallsForModal = (dealer) => {
//     if (onGetDealerCalls && dealer) {
//       return onGetDealerCalls(dealer, modalDataType);
//     }

//     return {
//       totalCalls: 0,
//       outgoing: 0,
//       incoming: 0,
//       connectedCalls: 0,
//       declined: 0,
//       duration: 0,
//       avgConnected: 0,
//       callsAbove1Min: 0,
//     };
//   };

//   // Get cached user data for modal
//   const getModalUsersData = (dealerId) => {
//     const cacheKey = `${dealerId}_${modalDataType}`;
//     return modalUsersData[cacheKey] || [];
//   };

//   const getSortedDealersForCallLogs = () => {
//     // If custom filter is pending, return empty array
//     if (customFilterPending) {
//       return [];
//     }

//     const list = selectedDealers.length > 0 ? selectedDealers : dealers;
//     // console.log("📞 getSortedDealersForCallLogs - Input list:", list?.length);

//     if (!list || list.length === 0) {
//       return [];
//     }

//     const sorted = [...list].sort((a, b) => {
//       const dealerCallsA = getDealerCalls(a);
//       const dealerCallsB = getDealerCalls(b);
//       const totalA = dealerCallsA?.totalCalls ?? 0;
//       const totalB = dealerCallsB?.totalCalls ?? 0;

//       // console.log(
//       //   `📞 Sorting dealers: ${a.dealerName} (${totalA}) vs ${b.dealerName} (${totalB})`
//       // );
//       return totalB - totalA;
//     });

//     // console.log(
//     //   "📞 Sorted dealers for call logs:",
//     //   sorted.map((d) => ({
//     //     name: d.dealerName,
//     //     calls: getDealerCalls(d),
//     //   }))
//     // );
//     return sorted;
//   };

//   // Enhanced CSV Export Function
//   const exportToCSV = () => {
//     try {
//       const dealersData = getSortedDealersForCallLogs().slice(0, tableLength);

//       if (!dealersData || dealersData.length === 0) {
//         alert("No data available to export");
//         return;
//       }

//       // console.log("📞 Exporting CSV for dealers:", dealersData.length);

//       const headers = [
//         "Dealer Name",
//         "Total Calls",
//         "Outgoing Calls",
//         "Incoming Calls",
//         "Connected Calls",
//         "Declined Calls",
//         "Total Duration",
//         "Avg Duration",
//         "Calls > 1m",
//       ];

//       const csvRows = dealersData.map((dealer) => {
//         const dealerCalls = getDealerCalls(dealer);
//         return [
//           `"${(dealer.dealerName || "Unknown Dealer").replace(/"/g, '""')}"`,
//           dealerCalls?.totalCalls || 0,
//           dealerCalls?.outgoing || 0,
//           dealerCalls?.incoming || 0,
//           dealerCalls?.connectedCalls || 0,
//           dealerCalls?.declined || 0,
//           `"${dealerCalls?.duration || 0}"`,
//           `"${dealerCalls?.avgConnected || 0}"`,
//           dealerCalls?.callsAbove1Min || 0,
//         ];
//       });

//       const csvContent = [
//         headers.join(","),
//         ...csvRows.map((row) => row.join(",")),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);

//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `dealer-calls-summary-${new Date().toISOString().split("T")[0]}.csv`
//       );
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       // console.error("❌ Error exporting CSV:", error);
//       alert("Error exporting data. Please check console for details.");
//     }
//   };

//   // Export PNG Function using html-to-image
//   const exportToPNG = () => {
//     try {
//       // Get the table element
//       const tableElement = document.querySelector(".calls-table");

//       if (!tableElement) {
//         alert("Table not found for export");
//         return;
//       }

//       // Use html-to-image to capture the table as PNG
//       import("html-to-image")
//         .then((htmlToImage) => {
//           htmlToImage
//             .toPng(tableElement, {
//               quality: 1.0,
//               pixelRatio: 2,
//               backgroundColor: "#ffffff",
//               style: {
//                 margin: "0",
//                 padding: "0",
//               },
//             })
//             .then((dataUrl) => {
//               // Create download link
//               const link = document.createElement("a");
//               link.download = `dealer-calls-summary-${
//                 new Date().toISOString().split("T")[0]
//               }.png`;
//               link.href = dataUrl;
//               link.click();
//             });
//         })
//         .catch((error) => {
//           // console.error("❌ Error loading html-to-image:", error);
//           alert("Error exporting PNG. Please check console for details.");
//         });
//     } catch (error) {
//       // console.error("❌ Error exporting PNG:", error);
//       alert("Error exporting PNG. Please check console for details.");
//     }
//   };

//   const getChartData = () => {
//     const dealersData = getSortedDealersForCallLogs().slice(0, tableLength);

//     return {
//       labels: dealersData.map((d) => d.dealerName || d.name),
//       datasets: [
//         {
//           label: "Total Calls",
//           data: dealersData.map((d) => getDealerCalls(d).totalCalls || 0),
//           backgroundColor: "#222fb9",
//         },
//         {
//           label: "Connected Calls",
//           data: dealersData.map((d) => getDealerCalls(d).connectedCalls || 0),
//           backgroundColor: "#10b981",
//         },
//         {
//           label: "Declined Calls",
//           data: dealersData.map((d) => getDealerCalls(d).declined || 0),
//           backgroundColor: "#ef4444",
//         },
//       ],
//     };
//   };

//   const sortedDealers = getSortedDealersForCallLogs();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

//   // console.log("📞 Final displayed dealers:", displayedDealers.length);
//   // console.log("📞 Is loading?", isLoading);
//   // console.log("📞 Modal data type:", modalDataType);
//   // console.log("📞 Custom filter pending:", customFilterPending);

//   // ✅ ADD: Helper function to get readable filter label
//   const getReadableFilterLabel = (filter) => {
//     if (getFilterLabel && typeof getFilterLabel === "function") {
//       return getFilterLabel(filter);
//     }

//     const labels = {
//       DAY: "Today",
//       YESTERDAY: "Yesterday",
//       WEEK: "This Week",
//       LAST_WEEK: "Last Week",
//       MTD: "This Month",
//       LAST_MONTH: "Last Month",
//       QTD: "This Quarter",
//       LAST_QUARTER: "Last Quarter",
//       SIX_MONTH: "Last 6 Months",
//       YTD: "This Year",
//       LIFETIME: "Lifetime",
//       CUSTOM: "Custom Range",
//     };
//     return labels[filter] || filter;
//   };

//   return (
//     <>
//       <div className="table-section bg-white rounded-lg shadow-sm border border-gray-200 mx-auto w-full overflow-hidden">
//         {/* Compact Table Header */}
//         <div className="table-header px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//           <div>
//             <h2 className="table-title text-xs font-bold text-gray-900">
//               Dealer Summary — Calls
//             </h2>
//             <div className="text-xs text-gray-600 mt-1">
//               {dealerSummaryCallsDataType === "enquiries"
//                 ? "Enquiries"
//                 : dealerSummaryCallsDataType === "coldcalls"
//                 ? "Cold Calls"
//                 : "Both"}
//             </div>
//           </div>

//           {/* Only show actions when not loading and not custom filter pending */}
//           {!isLoading && !customFilterPending && (
//             <div className="table-actions flex items-center gap-2 w-full sm:w-auto">
//               <div id="tabs" className="flex gap-1 flex-wrap">
//                 {/* Compact Data Type Dropdown */}
//                 <div className="nav-button-group">
//                   <select
//                     value={dealerSummaryCallsDataType}
//                     onChange={(e) =>
//                       onSetDealerSummaryCallsDataType(e.target.value)
//                     }
//                     className="time-dropdown px-2 py-1 cursor-pointer text-xs font-semibold border border-gray-300 rounded-sm bg-white hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-transparent w-full"
//                   >
//                     <option value="enquiries">Enquiries</option>
//                     <option value="coldcalls">Cold Calls</option>
//                     <option value="combinedCalls">Both</option>
//                   </select>
//                 </div>
//               </div>

//               {dealerSummaryCallsViewType === "table" && (
//                 <div className="flex gap-2">
//                   <button
//                     className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c]  flex items-center gap-1 transition-colors"
//                     onClick={exportToCSV}
//                   >
//                     <i className="fas fa-download text-[10px]"></i>
//                     Export CSV
//                   </button>
//                   <button
//                     className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c]  flex items-center gap-1 transition-colors"
//                     onClick={exportToPNG}
//                   >
//                     <i className="fas fa-image text-[10px]"></i>
//                     Export PNG
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Main Content Area */}
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center p-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222fb9] mb-4"></div>
//             <div className="text-gray-500 text-sm">
//               Loading call logs data...
//             </div>
//           </div>
//         ) : customFilterPending ? (
//           // ✅ ADDED: Custom filter pending message
//           <div className="flex flex-col items-center justify-center p-8">
//             <div className="text-gray-500 text-sm">
//               Please select custom dates and click "Apply" in the filter bar
//               above to view call logs data.
//             </div>
//           </div>
//         ) : dealerSummaryCallsViewType === "table" ? (
//           <div className="table-container p-2">
//             {(!dealers || dealers.length === 0) && !isLoading ? (
//               <div className="flex justify-center items-center p-8">
//                 <div className="text-gray-500 text-sm">Loading dealers...</div>
//               </div>
//             ) : displayedDealers.length === 0 ? (
//               <div className="flex justify-center items-center p-8">
//                 <div className="text-gray-500 text-sm">
//                   {dealers && dealers.length > 0
//                     ? "Loading call data..."
//                     : "Loading dealers..."}
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="table-scroll overflow-auto">
//                   <table className="data-table calls-table w-full compact-table min-w-[800px]">
//                     <thead className="table-thead bg-gray-50">
//                       <tr>
//                         <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20">
//                           Dealer
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Total
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Outgoing
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Incoming
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Connected
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Declined
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Duration
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Avg Duration (in mins)
//                         </th>
//                         <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                           Calls w Duration &gt; 1m
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {displayedDealers.map((dealer, index) => {
//                         const dealerId = dealer.dealerId || dealer.id;
//                         const dealerCalls = getDealerCalls(dealer);

//                         // console.log(
//                         //   `📞 Rendering row for ${dealer.dealerName}:`,
//                         //   dealerCalls
//                         // );

//                         return (
//                           <tr
//                             key={dealerId}
//                             className={`table-row hover:bg-blue-50 transition-colors dealer-row cursor-pointer ${
//                               index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                             }`}
//                             onClick={() => handleDealerClick(dealer)}
//                           >
//                             {/* Dealer Name Column - Left Aligned */}
//                             <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-3 py-2 text-left text-gray-900 min-w-[100px]">
//                               <button className="expand-btn flex items-center gap-1 cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group">
//                                 <span className="font-semibold text-xs truncate group-hover:underline">
//                                   {dealer.dealerName}
//                                 </span>
//                                 <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
//                               </button>
//                             </td>

//                             {/* Total calls */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div
//                                 className={`flex items-center justify-center gap-1 ${
//                                   dealerCalls.totalCalls < 60
//                                     ? "text-red-600 font-bold"
//                                     : "text-gray-900 font-semibold"
//                                 }`}
//                               >
//                                 <svg
//                                   className="w-2 h-2"
//                                   fill="currentColor"
//                                   viewBox="0 0 16 16"
//                                 >
//                                   <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
//                                 </svg>
//                                 <span className="text-xs">
//                                   {dealerCalls.totalCalls}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Outgoing */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center text-green-600">
//                                 <span className="text-xs mr-0.5 font-semibold">
//                                   ↑
//                                 </span>
//                                 <span className="text-xs font-semibold">
//                                   {dealerCalls.outgoing}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Incoming */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center text-green-600">
//                                 <span className="text-xs mr-0.5 font-semibold">
//                                   ↓
//                                 </span>
//                                 <span className="text-xs font-semibold">
//                                   {dealerCalls.incoming}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Connected */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center">
//                                 <span
//                                   className={`flex items-center justify-center w-3 h-3 rounded-full text-white text-[10px] font-bold mr-1 ${
//                                     dealerCalls.connectedCalls < 30
//                                       ? "bg-red-500"
//                                       : "bg-[#222fb9]"
//                                   }`}
//                                 >
//                                   ✓
//                                 </span>
//                                 <span
//                                   className={`text-xs font-semibold ${
//                                     dealerCalls.connectedCalls < 30
//                                       ? "text-red-500"
//                                       : "text-[#222fb9]"
//                                   }`}
//                                 >
//                                   {dealerCalls.connectedCalls ?? "0"}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Declined */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center">
//                                 <span className="flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[10px] font-bold mr-1">
//                                   ✗
//                                 </span>
//                                 <span className="text-red-500 text-xs font-semibold">
//                                   {dealerCalls.declined}
//                                 </span>
//                               </div>
//                             </td>

//                             {/* Duration */}
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center text-gray-700">
//                                 <span className="text-xs font-semibold">
//                                   {dealerCalls.duration}
//                                 </span>
//                               </div>
//                             </td>

//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center text-gray-700">
//                                 <span className="text-xs font-semibold">
//                                   {dealerCalls.avgConnected ?? "0"}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                               <div className="flex items-center justify-center text-gray-700">
//                                 <span className="text-xs font-semibold">
//                                   {dealerCalls.callsAbove1Min ?? "0"}
//                                 </span>
//                               </div>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Compact Show More/Less buttons - Hide when customFilterPending */}
//                 {!customFilterPending && (
//                   <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
//                     <div className="text-xs font-semibold text-gray-500">
//                       Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
//                       {sortedDealers.length} dealers
//                     </div>
//                     <div className="flex gap-1 self-end sm:self-auto">
//                       {tableLength < sortedDealers.length && (
//                         <button
//                           className="btn btn-primary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm  hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                           onClick={() => setTableLength((prev) => prev + 10)}
//                         >
//                           <i className="fas fa-chevron-down text-xs"></i>
//                           Show More
//                         </button>
//                       )}
//                       {tableLength > 10 && sortedDealers.length > 10 && (
//                         <button
//                           className="btn btn-secondary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm  hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                           onClick={() => setTableLength(10)}
//                         >
//                           <i className="fas fa-chevron-up text-xs"></i>
//                           Show Less
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         ) : // ✅ ADDED: Check for customFilterPending in chart view too
//         customFilterPending ? (
//           <div className="p-8 flex flex-col items-center justify-center">
//             <div className="text-yellow-600 text-lg mb-3">
//               ⚠️ Custom Date Range Selected
//             </div>
//             <div className="text-gray-600 text-sm max-w-md text-center mb-4">
//               Please select custom dates and click "Apply" in the filter bar
//               above to view call logs chart.
//             </div>
//             <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
//               Filter: {getReadableFilterLabel("CUSTOM")}
//             </div>
//           </div>
//         ) : (
//           <div className="p-2">
//             <BarChart
//               data={getChartData()}
//               title="Dealer-wise Calls Analysis"
//               height={500}
//               showLegend={true}
//             />
//           </div>
//         )}
//       </div>

//       {/* Call Logs Modal - Only show if not in customFilterPending state */}
//       {showCallLogsModal && selectedDealer && !customFilterPending && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm p-4"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl w-full h-full max-h-[90vh] overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - Responsive */}
//             <div className="p-4 sm:p-6 border-b border-gray-300 flex-shrink-0">
//               {/* Mobile layout - hidden on desktop */}
//               <div className="sm:hidden flex flex-col gap-3">
//                 {/* Top row: Title and close button */}
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h2 className="text-lg font-bold text-gray-800">
//                       Call Logs
//                     </h2>
//                     <div className="text-sm text-gray-600 mt-1">
//                       {selectedDealer.dealerName || selectedDealer.name}
//                     </div>
//                   </div>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-400 hover:text-gray-600 text-xl flex-shrink-0"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>

//                 {/* Second row: Call count and filter */}
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
//                     {getDealerCallsForModal(selectedDealer).totalCalls || 0}{" "}
//                     total calls
//                   </span>

//                   {/* Filter dropdown for mobile */}
//                   <select
//                     value={modalDataType}
//                     onChange={(e) => handleModalFilterChange(e.target.value)}
//                     className="px-3 py-1.5 cursor-pointer text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent flex-1 min-w-[120px]"
//                   >
//                     <option value="enquiries">Enquiries</option>
//                     <option value="coldcalls">Cold Calls</option>
//                     <option value="combinedCalls">Both</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Desktop layout - hidden on mobile */}
//               <div className="hidden sm:flex justify-between items-center">
//                 {/* Left side: Title and call count */}
//                 <div className="flex items-center gap-3">
//                   <h2 className="text-xl font-bold text-gray-800">
//                     Call Logs -{" "}
//                     {selectedDealer.dealerName || selectedDealer.name}
//                   </h2>
//                   <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                     {getDealerCallsForModal(selectedDealer).totalCalls || 0}{" "}
//                     total calls
//                   </span>
//                 </div>

//                 {/* Right side: Filter and close button */}
//                 <div className="flex items-center gap-3">
//                   {/* Modal Data Type Dropdown - NOW ON RIGHT SIDE */}
//                   <div className="flex items-center gap-2">
//                     <select
//                       value={modalDataType}
//                       onChange={(e) => handleModalFilterChange(e.target.value)}
//                       className="time-dropdown px-3 py-1.5 cursor-pointer text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                     >
//                       <option value="enquiries">Enquiries</option>
//                       <option value="coldcalls">Cold Calls</option>
//                       <option value="combinedCalls">Both</option>
//                     </select>
//                   </div>

//                   <button
//                     onClick={closeModal}
//                     className="text-gray-400 hover:text-gray-600 text-2xl"
//                   >
//                     <i className="fas fa-times"></i>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Dealer Summary Section - Added margin top */}
//             <div className="mt-5 mb-5 flex-shrink-0 px-4 sm:px-6">
//               <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
//                 Dealer Call Summary -{" "}
//                 {selectedDealer.dealerName || selectedDealer.name}
//                 <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
//                   {modalDataType === "enquiries"
//                     ? "Enquiries"
//                     : modalDataType === "coldcalls"
//                     ? "Cold Calls"
//                     : "Both"}
//                 </span>
//               </h3>

//               {(() => {
//                 const currentDealerCalls =
//                   getDealerCallsForModal(selectedDealer);

//                 return (
//                   <div
//                     className="overflow-x-auto"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor: "#d1d5db #f3f4f6",
//                     }}
//                   >
//                     <style>{`
//                 .overflow-x-auto::-webkit-scrollbar {
//                   height: 6px;
//                 }
//                 .overflow-x-auto::-webkit-scrollbar-track {
//                   background: #f3f4f6;
//                   border-radius: 3px;
//                 }
//                 .overflow-x-auto::-webkit-scrollbar-thumb {
//                   background: #d1d5db;
//                   border-radius: 3px;
//                 }
//                 .overflow-x-auto::-webkit-scrollbar-thumb:hover {
//                   background: #9ca3af;
//                 }
//               `}</style>
//                     <table className="w-full border-collapse text-xs min-w-max">
//                       <thead>
//                         <tr className="bg-gray-100 border-b border-gray-300">
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Total Calls
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Outgoing
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Incoming
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Connected
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Declined
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Duration
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Avg Duration (in mins)
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
//                             Calls &gt; 1m
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className="bg-white border-b border-gray-200">
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {currentDealerCalls.totalCalls}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-green-600">
//                             {currentDealerCalls.outgoing}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-green-600">
//                             {currentDealerCalls.incoming}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-blue-600">
//                             {currentDealerCalls.connectedCalls}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-red-600">
//                             {currentDealerCalls.declined}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-gray-700">
//                             {currentDealerCalls.duration}
//                           </td>
//                           <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-gray-700">
//                             {currentDealerCalls.avgConnected || "0"}
//                           </td>
//                           <td className="px-2 py-1.5 text-center font-semibold text-gray-700">
//                             {currentDealerCalls.callsAbove1Min}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 );
//               })()}
//             </div>

//             {/* User Call Logs Content */}
//             <div className="flex-1 overflow-hidden px-4 sm:px-6">
//               <div className="h-full w-full">
//                 <UserCallLogsSubTable
//                   dealer={selectedDealer}
//                   userCallLogs={getModalUsersData(
//                     selectedDealer.dealerId || selectedDealer.id
//                   )}
//                   onGetSortedCallLogs={onGetSortedCallLogs}
//                   dealerSummaryCallsDataType={modalDataType}
//                   key={`${selectedDealer.dealerId}_${modalDataType}`}
//                 />
//               </div>
//             </div>

//             {/* Modal Footer with Close Button - Added more padding */}
//             <div className="mt-6 mb-3 pt-4 pb-3 border-t border-gray-300 flex justify-end flex-shrink-0 px-4 sm:px-6">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-2.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium text-sm flex items-center gap-2"
//               >
//                 {/* <i className="fas fa-times"></i> */}
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CallLogsTable;

// PREVENTION OF BG SCROLL WHEN I OPEN THE MODAL
import React, { useState, useEffect, useMemo, useRef } from "react";
import BarChart from "./BarChart";
import UserCallLogsSubTable from "./UserCallLogsSubTable";

const CallLogsTable = ({
  dealers,
  selectedDealers,
  tableLength,
  setTableLength,
  userCallLogs,
  loadingUsers,
  dealerSummaryCallsViewType,
  dealerSummaryCallsDataType, // Main table data type
  onSetDealerSummaryCallsViewType,
  onSetDealerSummaryCallsDataType, // Main table setter
  onGetDealerCalls,
  onGetSortedCallLogs,
  // ✅ ADD: New prop for custom filter pending state
  customFilterPending, // This comes from parent CEODashboard
  // ✅ ADD: Function to get filter label
  getFilterLabel, // Function to get readable filter label
}) => {
  const [dealerCallsData, setDealerCallsData] = useState({});
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showCallLogsModal, setShowCallLogsModal] = useState(false);
  const [modalDataType, setModalDataType] = useState("combinedCalls"); // Separate state for modal
  const [modalUsersData, setModalUsersData] = useState({}); // Store user data per filter
  const userLogsRef = useRef(null);

  // ✅ ADD: Scroll prevention effect for modal
  useEffect(() => {
    const body = document.body;

    if (showCallLogsModal) {
      // Store current scroll position
      const scrollY = window.scrollY;
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
    } else {
      // Restore scrolling
      const scrollY = body.style.top;
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      // Cleanup in case component unmounts with modal open
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
    };
  }, [showCallLogsModal]);

  // Fix loadingUsers prop - handle both boolean and object cases
  const isLoading = React.useMemo(() => {
    // console.log("📞 Raw loadingUsers prop:", loadingUsers);
    // console.log("📞 Type of loadingUsers:", typeof loadingUsers);

    // Handle different cases for loadingUsers
    if (loadingUsers === undefined || loadingUsers === null) {
      return false;
    }

    if (typeof loadingUsers === "boolean") {
      return loadingUsers;
    }

    if (typeof loadingUsers === "object") {
      // If it's an object, check if it has any truthy values that indicate loading
      if (loadingUsers.loading !== undefined) {
        return Boolean(loadingUsers.loading);
      }
      if (loadingUsers.isLoading !== undefined) {
        return Boolean(loadingUsers.isLoading);
      }
      // If it's an empty object, assume not loading
      return Object.keys(loadingUsers).length > 0;
    }

    // Default case
    return Boolean(loadingUsers);
  }, [loadingUsers]);

  // Debug logs
  useEffect(() => {
    // console.log("📞 CallLogsTable - Total dealers:", dealers?.length);
    // console.log(
    //   "📞 CallLogsTable - Selected dealers:",
    //   selectedDealers?.length
    // );
    // console.log("📞 CallLogsTable - userCallLogs:", userCallLogs);
    // console.log("📞 CallLogsTable - Final isLoading:", isLoading);
    // console.log("📞 CallLogsTable - customFilterPending:", customFilterPending);

    // Check if onGetDealerCalls function exists and works
    if (dealers && dealers.length > 0 && onGetDealerCalls) {
      // console.log("🔄 Testing onGetDealerCalls function...");
      const testDealer = dealers[0];
      const testResult = onGetDealerCalls(
        testDealer,
        dealerSummaryCallsDataType,
      );
      // console.log("📞 Test result for first dealer:", testResult);
    }
  }, [
    dealers,
    selectedDealers,
    userCallLogs,
    onGetDealerCalls,
    isLoading,
    dealerSummaryCallsDataType,
    customFilterPending,
  ]);
  const DealerCallSummaryTable = ({ dealer, dataType = modalDataType }) => {
    const dealerCalls = getDealerCalls(dealer, dataType);
    const dealerSummaryData = {
      totalCalls: dealerCalls?.totalCalls || 0,
      outgoing: dealerCalls?.outgoing || 0,
      incoming: dealerCalls?.incoming || 0,
      connectedCalls: dealerCalls?.connectedCalls || 0,
      rejected: dealerCalls?.declined || 0,
      duration: dealerCalls?.duration || 0,
      avgConnected: dealerCalls?.avgConnected || 0,
      callsAbove1Min: dealerCalls?.callsAbove1Min || 0,
    };

    return (
      <div className="mb-4 flex-shrink-0">
        <div
          className="overflow-x-auto border border-gray-200 rounded-sm"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          <style>{`
            .overflow-x-auto::-webkit-scrollbar {
              height: 6px;
            }
            .overflow-x-auto::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            .overflow-x-auto::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 3px;
            }
            .overflow-x-auto::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
          `}</style>
          <table className="w-full border-collapse text-xs min-w-max bg-red-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Total Calls
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Outgoing
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Incoming
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Connected
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Declined
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Duration
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Avg Duration (in mins)
                </th>
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                  Calls Above 1 Min
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b border-gray-200">
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
                  {dealerSummaryData.totalCalls || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
                  {dealerSummaryData.outgoing || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
                  {dealerSummaryData.incoming || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
                  {dealerSummaryData.connectedCalls || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-red-600">
                  {dealerSummaryData.rejected || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
                  {dealerSummaryData.duration || 0}
                </td>
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
                  {dealerSummaryData.avgConnected || 0}
                </td>
                <td className="px-3 py-2 text-center font-semibold text-gray-700">
                  {dealerSummaryData.callsAbove1Min || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Load dealer calls data based on main table filter
  useEffect(() => {
    if (dealers && dealers.length > 0 && onGetDealerCalls) {
      const callsData = {};
      dealers.forEach((dealer) => {
        const dealerId = dealer.dealerId || dealer.id;
        const calls = onGetDealerCalls(dealer, dealerSummaryCallsDataType);
        // console.log(
        //   `📞 Data for ${dealer.dealerName} (${dealerSummaryCallsDataType}):`,
        //   calls
        // );
        callsData[dealerId] = calls;
      });
      setDealerCallsData(callsData);
      // console.log("📞 All dealer calls data:", callsData);
    }
  }, [dealers, onGetDealerCalls, dealerSummaryCallsDataType]);

  // Handle dealer click to open modal
  const handleDealerClick = (dealer) => {
    // console.log(
    //   "📞 Opening call logs modal for dealer:",
    //   dealer.dealerName || dealer.name
    // );
    setSelectedDealer(dealer);
    setModalDataType(dealerSummaryCallsDataType); // Initialize modal with current main table filter

    // Pre-load user data for the current filter
    if (onGetSortedCallLogs && dealer?.dealerId) {
      const initialUsers = onGetSortedCallLogs(
        dealer.dealerId,
        dealerSummaryCallsDataType,
      );
      setModalUsersData((prev) => ({
        ...prev,
        [`${dealer.dealerId}_${dealerSummaryCallsDataType}`]: initialUsers,
      }));
    }

    setShowCallLogsModal(true);
  };

  // Handle modal filter change
  const handleModalFilterChange = (newDataType) => {
    // console.log("🔄 Changing modal filter to:", newDataType);
    setModalDataType(newDataType);

    // Pre-fetch user data when filter changes
    if (selectedDealer && onGetSortedCallLogs) {
      const dealerId = selectedDealer.dealerId || selectedDealer.id;
      const usersData = onGetSortedCallLogs(dealerId, newDataType);
      setModalUsersData((prev) => ({
        ...prev,
        [`${dealerId}_${newDataType}`]: usersData,
      }));
    }
  };

  const closeModal = () => {
    setShowCallLogsModal(false);
    setSelectedDealer(null);

    // ✅ ADDED: Restore body scroll
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = "";
    body.style.top = "";
    body.style.width = "";
    body.style.overflow = "";

    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  };

  // Direct data access function for main table
  const getDealerCalls = (dealer) => {
    const dealerId = dealer.dealerId || dealer.id;

    // Method 1: Check if we have pre-loaded data
    if (dealerCallsData[dealerId]) {
      return dealerCallsData[dealerId];
    }

    // Method 2: Use the function directly
    if (onGetDealerCalls) {
      const calls = onGetDealerCalls(dealer, dealerSummaryCallsDataType);
      return calls;
    }

    // Fallback: Return empty data
    return {
      totalCalls: 0,
      outgoing: 0,
      incoming: 0,
      connectedCalls: 0,
      declined: 0,
      duration: 0,
      avgConnected: 0,
      callsAbove1Min: 0,
    };
  };

  // Direct data access function for modal (uses modal's data type)
  const getDealerCallsForModal = (dealer) => {
    if (onGetDealerCalls && dealer) {
      return onGetDealerCalls(dealer, modalDataType);
    }

    return {
      totalCalls: 0,
      outgoing: 0,
      incoming: 0,
      connectedCalls: 0,
      declined: 0,
      duration: 0,
      avgConnected: 0,
      callsAbove1Min: 0,
    };
  };

  // Get cached user data for modal
  const getModalUsersData = (dealerId) => {
    const cacheKey = `${dealerId}_${modalDataType}`;
    return modalUsersData[cacheKey] || [];
  };

  const getSortedDealersForCallLogs = () => {
    // If custom filter is pending, return empty array
    if (customFilterPending) {
      return [];
    }

    const list = selectedDealers.length > 0 ? selectedDealers : dealers;
    // console.log("📞 getSortedDealersForCallLogs - Input list:", list?.length);

    if (!list || list.length === 0) {
      return [];
    }

    const sorted = [...list].sort((a, b) => {
      const dealerCallsA = getDealerCalls(a);
      const dealerCallsB = getDealerCalls(b);
      const totalA = dealerCallsA?.totalCalls ?? 0;
      const totalB = dealerCallsB?.totalCalls ?? 0;

      // console.log(
      //   `📞 Sorting dealers: ${a.dealerName} (${totalA}) vs ${b.dealerName} (${totalB})`
      // );
      return totalB - totalA;
    });

    // console.log(
    //   "📞 Sorted dealers for call logs:",
    //   sorted.map((d) => ({
    //     name: d.dealerName,
    //     calls: getDealerCalls(d),
    //   }))
    // );
    return sorted;
  };

  // Enhanced CSV Export Function
  const exportToCSV = () => {
    try {
      const dealersData = getSortedDealersForCallLogs().slice(0, tableLength);

      if (!dealersData || dealersData.length === 0) {
        alert("No data available to export");
        return;
      }

      // console.log("📞 Exporting CSV for dealers:", dealersData.length);

      const headers = [
        "Dealer Name",
        "Total Calls",
        "Outgoing Calls",
        "Incoming Calls",
        "Connected Calls",
        "Declined Calls",
        "Total Duration",
        "Avg Duration",
        "Calls > 1m",
      ];

      const csvRows = dealersData.map((dealer) => {
        const dealerCalls = getDealerCalls(dealer);
        return [
          `"${(dealer.dealerName || "Unknown Dealer").replace(/"/g, '""')}"`,
          dealerCalls?.totalCalls || 0,
          dealerCalls?.outgoing || 0,
          dealerCalls?.incoming || 0,
          dealerCalls?.connectedCalls || 0,
          dealerCalls?.declined || 0,
          `"${dealerCalls?.duration || 0}"`,
          `"${dealerCalls?.avgConnected || 0}"`,
          dealerCalls?.callsAbove1Min || 0,
        ];
      });

      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `dealer-calls-summary-${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // console.error("❌ Error exporting CSV:", error);
      alert("Error exporting data. Please check console for details.");
    }
  };

  // Export PNG Function using html-to-image
  const exportToPNG = () => {
    try {
      // Get the table element
      const tableElement = document.querySelector(".calls-table");

      if (!tableElement) {
        alert("Table not found for export");
        return;
      }

      // Use html-to-image to capture the table as PNG
      import("html-to-image")
        .then((htmlToImage) => {
          htmlToImage
            .toPng(tableElement, {
              quality: 1.0,
              pixelRatio: 2,
              backgroundColor: "#ffffff",
              style: {
                margin: "0",
                padding: "0",
              },
            })
            .then((dataUrl) => {
              // Create download link
              const link = document.createElement("a");
              link.download = `dealer-calls-summary-${
                new Date().toISOString().split("T")[0]
              }.png`;
              link.href = dataUrl;
              link.click();
            });
        })
        .catch((error) => {
          // console.error("❌ Error loading html-to-image:", error);
          alert("Error exporting PNG. Please check console for details.");
        });
    } catch (error) {
      // console.error("❌ Error exporting PNG:", error);
      alert("Error exporting PNG. Please check console for details.");
    }
  };

  const getChartData = () => {
    const dealersData = getSortedDealersForCallLogs().slice(0, tableLength);

    return {
      labels: dealersData.map((d) => d.dealerName || d.name),
      datasets: [
        {
          label: "Total Calls",
          data: dealersData.map((d) => getDealerCalls(d).totalCalls || 0),
          backgroundColor: "#222fb9",
        },
        {
          label: "Connected Calls",
          data: dealersData.map((d) => getDealerCalls(d).connectedCalls || 0),
          backgroundColor: "#10b981",
        },
        {
          label: "Declined Calls",
          data: dealersData.map((d) => getDealerCalls(d).declined || 0),
          backgroundColor: "#ef4444",
        },
      ],
    };
  };

  const sortedDealers = getSortedDealersForCallLogs();
  const displayedDealers = sortedDealers.slice(0, tableLength);

  // console.log("📞 Final displayed dealers:", displayedDealers.length);
  // console.log("📞 Is loading?", isLoading);
  // console.log("📞 Modal data type:", modalDataType);
  // console.log("📞 Custom filter pending:", customFilterPending);

  // ✅ ADD: Helper function to get readable filter label
  const getReadableFilterLabel = (filter) => {
    if (getFilterLabel && typeof getFilterLabel === "function") {
      return getFilterLabel(filter);
    }

    const labels = {
      DAY: "Today",
      YESTERDAY: "Yesterday",
      WEEK: "This Week",
      LAST_WEEK: "Last Week",
      MTD: "This Month",
      LAST_MONTH: "Last Month",
      QTD: "This Quarter",
      LAST_QUARTER: "Last Quarter",
      SIX_MONTH: "Last 6 Months",
      YTD: "This Year",
      LIFETIME: "Lifetime",
      CUSTOM: "Custom Range",
    };
    return labels[filter] || filter;
  };

  return (
    <>
      <div className="table-section bg-white rounded-lg shadow-sm border border-gray-200 mx-auto w-full overflow-hidden">
        {/* Compact Table Header */}
        <div className="table-header px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="table-title text-xs font-bold text-gray-900">
              Dealer Summary — Calls
            </h2>
            <div className="text-xs text-gray-600 mt-1">
              {dealerSummaryCallsDataType === "enquiries"
                ? "Enquiries"
                : dealerSummaryCallsDataType === "coldcalls"
                  ? "Cold Calls"
                  : "Both"}
            </div>
          </div>

          {/* Only show actions when not loading and not custom filter pending */}
          {!isLoading && !customFilterPending && (
            <div className="table-actions flex items-center gap-2 w-full sm:w-auto">
              <div id="tabs" className="flex gap-1 flex-wrap">
                {/* Compact Data Type Dropdown */}
                <div className="nav-button-group">
                  <select
                    value={dealerSummaryCallsDataType}
                    onChange={(e) =>
                      onSetDealerSummaryCallsDataType(e.target.value)
                    }
                    className="time-dropdown px-2 py-1 cursor-pointer text-xs font-semibold border border-gray-300 rounded-sm bg-white hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-transparent w-full"
                  >
                    <option value="enquiries">Enquiries</option>
                    <option value="coldcalls">Cold Calls</option>
                    <option value="combinedCalls">Both</option>
                  </select>
                </div>
              </div>

              {dealerSummaryCallsViewType === "table" && (
                <div className="flex gap-2 self-end sm:self-auto">
                  <button
                    className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c]  flex items-center gap-1 transition-colors"
                    onClick={exportToPNG}
                  >
                    <i className="fas fa-image text-xs"></i>
                    Export PNG
                  </button>
                  <button
                    className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c]  flex items-center gap-1 transition-colors"
                    onClick={exportToCSV}
                  >
                    <i className="fas fa-download text-xs"></i>
                    Export CSV
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222fb9] mb-4"></div>
            <div className="text-gray-500 text-sm">
              Loading call logs data...
            </div>
          </div>
        ) : customFilterPending ? (
          // ✅ ADDED: Custom filter pending message
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-gray-500 text-sm">
              Please select custom dates and click "Apply" in the filter bar
              above to view call logs data.
            </div>
          </div>
        ) : dealerSummaryCallsViewType === "table" ? (
          <div className="table-container p-2">
            {(!dealers || dealers.length === 0) && !isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-500 text-sm">Loading dealers...</div>
              </div>
            ) : displayedDealers.length === 0 ? (
              <div className="flex justify-center items-center p-8">
                <div className="text-gray-500 text-sm">
                  {dealers && dealers.length > 0
                    ? "Loading call data..."
                    : "Loading dealers..."}
                </div>
              </div>
            ) : (
              <>
                <div className="table-scroll overflow-auto">
                  <table className="data-table calls-table w-full compact-table min-w-[800px]">
                    <thead className="table-thead bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20">
                          Dealer
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Total
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Outgoing
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Incoming
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Connected
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Declined
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Duration
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Avg Duration (in mins)
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                          Calls w Duration &gt; 1m
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedDealers.map((dealer, index) => {
                        const dealerId = dealer.dealerId || dealer.id;
                        const dealerCalls = getDealerCalls(dealer);

                        // console.log(
                        //   `📞 Rendering row for ${dealer.dealerName}:`,
                        //   dealerCalls
                        // );

                        return (
                          <tr
                            key={dealerId}
                            className={`table-row hover:bg-blue-50 transition-colors dealer-row cursor-pointer ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                            onClick={() => handleDealerClick(dealer)}
                          >
                            {/* Dealer Name Column - Left Aligned */}
                            <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-3 py-2 text-left text-gray-900 min-w-[100px]">
                              <button className="expand-btn flex items-center gap-1 cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group">
                                <span className="font-semibold text-xs truncate group-hover:underline">
                                  {dealer.dealerName}
                                </span>
                                <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
                              </button>
                            </td>

                            {/* Total calls */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div
                                className={`flex items-center justify-center gap-1 ${
                                  dealerCalls.totalCalls < 60
                                    ? "text-red-600 font-bold"
                                    : "text-gray-900 font-semibold"
                                }`}
                              >
                                <svg
                                  className="w-2 h-2"
                                  fill="currentColor"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                                </svg>
                                <span className="text-xs">
                                  {dealerCalls.totalCalls}
                                </span>
                              </div>
                            </td>

                            {/* Outgoing */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center text-green-600">
                                <span className="text-xs mr-0.5 font-semibold">
                                  ↑
                                </span>
                                <span className="text-xs font-semibold">
                                  {dealerCalls.outgoing}
                                </span>
                              </div>
                            </td>

                            {/* Incoming */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center text-green-600">
                                <span className="text-xs mr-0.5 font-semibold">
                                  ↓
                                </span>
                                <span className="text-xs font-semibold">
                                  {dealerCalls.incoming}
                                </span>
                              </div>
                            </td>

                            {/* Connected */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <span
                                  className={`flex items-center justify-center w-3 h-3 rounded-full text-white text-[10px] font-bold mr-1 ${
                                    dealerCalls.connectedCalls < 30
                                      ? "bg-red-500"
                                      : "bg-[#222fb9]"
                                  }`}
                                >
                                  ✓
                                </span>
                                <span
                                  className={`text-xs font-semibold ${
                                    dealerCalls.connectedCalls < 30
                                      ? "text-red-500"
                                      : "text-[#222fb9]"
                                  }`}
                                >
                                  {dealerCalls.connectedCalls ?? "0"}
                                </span>
                              </div>
                            </td>

                            {/* Declined */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center">
                                <span className="flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[10px] font-bold mr-1">
                                  ✗
                                </span>
                                <span className="text-red-500 text-xs font-semibold">
                                  {dealerCalls.declined}
                                </span>
                              </div>
                            </td>

                            {/* Duration */}
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center text-gray-700">
                                <span className="text-xs font-semibold">
                                  {dealerCalls.duration}
                                </span>
                              </div>
                            </td>

                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center text-gray-700">
                                <span className="text-xs font-semibold">
                                  {dealerCalls.avgConnected ?? "0"}
                                </span>
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                              <div className="flex items-center justify-center text-gray-700">
                                <span className="text-xs font-semibold">
                                  {dealerCalls.callsAbove1Min ?? "0"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Compact Show More/Less buttons - Hide when customFilterPending */}
                {!customFilterPending && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
                    <div className="text-xs font-semibold text-gray-500">
                      Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
                      {sortedDealers.length} dealers
                    </div>
                    <div className="flex gap-1 self-end sm:self-auto">
                      {tableLength < sortedDealers.length && (
                        <button
                          className="btn btn-primary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm  hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
                          onClick={() => setTableLength((prev) => prev + 10)}
                        >
                          <i className="fas fa-chevron-down text-xs"></i>
                          Show More
                        </button>
                      )}
                      {tableLength > 10 && sortedDealers.length > 10 && (
                        <button
                          className="btn btn-secondary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm  hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
                          onClick={() => setTableLength(10)}
                        >
                          <i className="fas fa-chevron-up text-xs"></i>
                          Show Less
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : // ✅ ADDED: Check for customFilterPending in chart view too
        customFilterPending ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="text-yellow-600 text-lg mb-3">
              ⚠️ Custom Date Range Selected
            </div>
            <div className="text-gray-600 text-sm max-w-md text-center mb-4">
              Please select custom dates and click "Apply" in the filter bar
              above to view call logs chart.
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
              Filter: {getReadableFilterLabel("CUSTOM")}
            </div>
          </div>
        ) : (
          <div className="p-2">
            <BarChart
              data={getChartData()}
              title="Dealer-wise Calls Analysis"
              height={500}
              showLegend={true}
            />
          </div>
        )}
      </div>

      {/* Call Logs Modal - Only show if not in customFilterPending state */}
      {showCallLogsModal && selectedDealer && !customFilterPending && (
        <div
          className="fixed inset-0 flex  items-center  justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[95vw] h-[95vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Responsive */}
            <div className="p-4 sm:p-6 border-b border-gray-300 flex-shrink-0">
              {/* Mobile layout - hidden on desktop */}
              <div className="sm:hidden flex flex-col gap-3 border">
                {/* Top row: Title and close button */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      Call Logs
                    </h2>
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedDealer.dealerName || selectedDealer.name}
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-xl flex-shrink-0"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {/* Second row: Call count and filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                    {getDealerCallsForModal(selectedDealer).totalCalls || 0}{" "}
                    total calls
                  </span>

                  {/* Filter dropdown for mobile */}
                  <select
                    value={modalDataType}
                    onChange={(e) => handleModalFilterChange(e.target.value)}
                    className="px-3 py-1.5 cursor-pointer text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent flex-1 min-w-[120px]"
                  >
                    <option value="enquiries">Enquiries</option>
                    <option value="coldcalls">Cold Calls</option>
                    <option value="combinedCalls">Both</option>
                  </select>
                </div>
              </div>

              {/* Desktop layout - hidden on mobile */}
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    Call Logs -{" "}
                    {selectedDealer.dealerName || selectedDealer.name}
                  </h2>

                  {/* <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
      {getDealerCallsForModal(selectedDealer).totalCalls || 0} total calls
    </span> */}
                  <select
                    value={modalDataType}
                    onChange={(e) => handleModalFilterChange(e.target.value)}
                    className="time-dropdown px-3 py-1.5 cursor-pointer text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9]"
                  >
                    <option value="enquiries">Enquiries</option>
                    <option value="coldcalls">Cold Calls</option>
                    <option value="combinedCalls">Both</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => userLogsRef.current?.exportPNG()}
                      className="btn-export px-3 py-1.5 bg-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] flex items-center gap-2 transition-colors"
                    >
                      <i className="fas fa-image"></i>
                      Export PNG
                    </button>

                    <button
                      onClick={() => userLogsRef.current?.exportCSV()}
                      className="btn-export px-3 py-1.5 bg-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] flex items-center gap-2 transition-colors"
                    >
                      <i className="fas fa-download"></i>
                      Export CSV
                    </button>
                  </div>

                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl ml-2"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>

              {/* <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-800">
                    Call Logs -{" "}
                    {selectedDealer.dealerName || selectedDealer.name}
                  </h2>
                  <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
                    {getDealerCallsForModal(selectedDealer).totalCalls || 0}{" "}
                    total calls
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={modalDataType}
                      onChange={(e) => handleModalFilterChange(e.target.value)}
                      className="time-dropdown px-3 py-1.5 cursor-pointer text-sm font-semibold border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
                    >
                      <option value="enquiries">Enquiries</option>
                      <option value="coldcalls">Cold Calls</option>
                      <option value="combinedCalls">Both</option>
                    </select>
                  </div>

                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div> */}
            </div>

            {/* Dealer Summary Section - Added margin top */}
            {/* <div className=" mb-5 flex-shrink-0 px-4 sm:px-6"> */}
            {/* <h3 className="text-sm font-semibold text-gray-800 mb-3 px-1">
                Dealer Call Summary -{" "}
                {selectedDealer.dealerName || selectedDealer.name}
                <span className="ml-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {modalDataType === "enquiries"
                    ? "Enquiries"
                    : modalDataType === "coldcalls"
                      ? "Cold Calls"
                      : "Both"}
                </span>
               
              </h3> */}

            {/* {(() => {
                const currentDealerCalls =
                  getDealerCallsForModal(selectedDealer);

                return (
                  <div
                    className="overflow-x-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#d1d5db #f3f4f6",
                    }}
                  >
                    <style>{`
                .overflow-x-auto::-webkit-scrollbar {
                  height: 6px;
                }
                .overflow-x-auto::-webkit-scrollbar-track {
                  background: #f3f4f6;
                  border-radius: 3px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb {
                  background: #d1d5db;
                  border-radius: 3px;
                }
                .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                  background: #9ca3af;
                }
              `}</style>
                    <table className="w-full border-collapse text-xs min-w-max">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Total Calls
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Outgoing
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Incoming
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Connected
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Declined
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Duration
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                            Avg Duration (in mins)
                          </th>
                          <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
                            Calls &gt; 1m
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b border-gray-200">
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
                            {currentDealerCalls.totalCalls}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-green-600">
                            {currentDealerCalls.outgoing}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-green-600">
                            {currentDealerCalls.incoming}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-blue-600">
                            {currentDealerCalls.connectedCalls}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-red-600">
                            {currentDealerCalls.declined}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-gray-700">
                            {currentDealerCalls.duration}
                          </td>
                          <td className="px-2 py-1.5 text-center border-r border-gray-200 font-semibold text-gray-700">
                            {currentDealerCalls.avgConnected || "0"}
                          </td>
                          <td className="px-2 py-1.5 text-center font-semibold text-gray-700">
                            {currentDealerCalls.callsAbove1Min}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()} */}
            {/* </div> */}

            {/* User Call Logs Content */}
            <div className="flex-1 overflow-hidden px-4 mt-4 sm:px-6">
              <UserCallLogsSubTable
                ref={userLogsRef}
                dealer={selectedDealer}
                userCallLogs={getModalUsersData(
                  selectedDealer.dealerId || selectedDealer.id,
                )}
                onGetSortedCallLogs={onGetSortedCallLogs}
                dealerSummaryCallsDataType={modalDataType}
                dealerSummaryRow={
                  <DealerCallSummaryTable
                    dealer={selectedDealer}
                    dataType={modalDataType}
                  />
                }
                key={`${selectedDealer.dealerId}_${modalDataType}`}
              />
            </div>

            {/* Modal Footer with Close Button - Added more padding */}
            <div className="mt-6 mb-3 pt-4 pb-3 border-t border-gray-300 flex justify-end flex-shrink-0 px-4 sm:px-6">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium text-sm flex items-center gap-2"
              >
                {/* <i className="fas fa-times"></i> */}
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallLogsTable;
