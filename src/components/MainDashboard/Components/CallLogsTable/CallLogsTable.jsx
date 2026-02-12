// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { toPng } from "html-to-image";
// import BarChart from "./BarChart";
// import UserCallLogsSubTable from "./UserCallLogsSubTable";

// const CallLogsTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   expandedCallLogsRows,
//   userCallLogs,
//   loadingUsers,
//   dealerSummaryCallsViewType,
//   dealerSummaryCallsDataType,
//   // ✅ ADD: Separate props for modal data type control
//   modalCallsDataType,
//   onSetModalCallsDataType,
//   onToggleCallLogsRow,
//   onSetDealerSummaryCallsDataType,
//   onGetDealerCalls,
//   onGetSortedCallLogs,
//   onExpandAllCallLogsRows,
//   onCollapseAllCallLogsRows,
//   areAllCallLogsRowsExpanded,
// }) => {
//   const [dealerCallsData, setDealerCallsData] = useState({});
//   const [localLoading, setLocalLoading] = useState(false);
//   const [selectedDealerForModal, setSelectedDealerForModal] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalUserData, setModalUserData] = useState([]);
//   const [exportingPNG, setExportingPNG] = useState(false);
//   const [exportingModalPNG, setExportingModalPNG] = useState(false);
//   const [exportingModalCSV, setExportingModalCSV] = useState(false);
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // ✅ ADD: Ref for UserCallLogsSubTable to access export functions
//   const userCallLogsTableRef = useRef(null);

//   // Add refs for PNG export
//   const tableRef = useRef(null);
//   const tableContainerRef = useRef(null);
//   const modalRef = useRef(null);
//   const modalContentRef = useRef(null);

//   // ✅ ADD: Effect to reset loading when dealers data loads
//   useEffect(() => {
//     if (dealers) {
//       setIsDataLoading(false);
//     }
//   }, [dealers]);

//   // ✅ UPDATED: Handle filter change in modal - use modalCallsDataType prop
//   const handleFilterChangeInModal = useCallback(
//     async (newDataType) => {
//       if (!selectedDealerForModal || !onGetSortedCallLogs) return;

//       const dealerId =
//         selectedDealerForModal.dealerId || selectedDealerForModal.id;
//       setModalLoading(true);

//       try {
//         const userData = await onGetSortedCallLogs(dealerId, newDataType);

//         if (Array.isArray(userData)) {
//           setModalUserData(userData);
//         } else {
//           setModalUserData([]);
//         }
//       } catch (error) {
//         alert("Error loading filtered data. Please try again.");
//         setModalUserData([]);
//       } finally {
//         setModalLoading(false);
//       }
//     },
//     [selectedDealerForModal, onGetSortedCallLogs],
//   );

//   // ✅ UPDATED: Effect to load modal data when modalCallsDataType changes
//   useEffect(() => {
//     if (isModalOpen && selectedDealerForModal && onGetSortedCallLogs) {
//       handleFilterChangeInModal(modalCallsDataType);
//     }
//   }, [
//     modalCallsDataType,
//     isModalOpen,
//     selectedDealerForModal,
//     onGetSortedCallLogs,
//     handleFilterChangeInModal,
//   ]);

//   const handleExportPNG = async () => {
//     if (!tableRef.current || !tableContainerRef.current) {
//       return;
//     }

//     setExportingPNG(true);

//     try {
//       const exportContainer = document.createElement("div");
//       exportContainer.style.cssText = `
//       position: fixed;
//       left: -9999px;
//       top: 0;
//       background: white;
//       z-index: 99999;
//       overflow: visible;
//       box-sizing: border-box;
//       opacity: 1;
//       padding: 0;
//       margin: 0;
//     `;

//       const containerClone = tableContainerRef.current.cloneNode(true);
//       const table = containerClone.querySelector("table");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       const originalRect = tableContainerRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       containerClone.style.overflow = "visible";
//       containerClone.style.position = "static";

//       const scrollableContainer =
//         containerClone.querySelector(".overflow-auto");
//       if (scrollableContainer) {
//         scrollableContainer.style.overflow = "visible";
//         scrollableContainer.style.maxHeight = "none";
//       }

//       table.style.width = "100%";
//       table.style.position = "static";
//       table.style.display = "table";

//       const stickyElements = containerClone.querySelectorAll(".sticky");
//       stickyElements.forEach((el) => {
//         el.style.position = "static";
//         el.style.left = "auto";
//         el.style.zIndex = "auto";
//       });

//       const interactiveElements = containerClone.querySelectorAll(
//         "button, select, input, .export-button",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       exportContainer.appendChild(containerClone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           containerClone.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const cloneRect = containerClone.getBoundingClientRect();
//       const captureWidth = Math.ceil(cloneRect.width);
//       const captureHeight = Math.ceil(cloneRect.height);

//       const paddedWidth = Math.ceil(captureWidth + 20);
//       const paddedHeight = Math.ceil(captureHeight + 20);

//       const dataUrl = await toPng(containerClone, {
//         quality: 1,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         width: paddedWidth,
//         height: paddedHeight,
//         style: {
//           transform: "none",
//           transformOrigin: "top left",
//           overflow: "visible",
//           margin: "0",
//           padding: "10px",
//           display: "block",
//           width: `${paddedWidth}px`,
//           boxSizing: "border-box",
//         },
//         filter: (node) => {
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           if (node.classList && node.classList.contains("export-button")) {
//             return false;
//           }
//           return true;
//         },
//       });

//       document.body.removeChild(exportContainer);

//       const link = document.createElement("a");
//       link.download = `dealer-calls-summary-${
//         new Date().toISOString().split("T")[0]
//       }.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error exporting PNG:", error);
//       alert("Failed to export PNG. Please try again.");
//     } finally {
//       setExportingPNG(false);
//     }
//   };

//   // ✅ ADD: Function to handle export PNG from modal
//   const handleExportModalPNG = async () => {
//     if (userCallLogsTableRef.current) {
//       setExportingModalPNG(true);
//       try {
//         await userCallLogsTableRef.current.handleExportPNG();
//       } catch (error) {
//         alert("Failed to export PNG. Please try again.");
//       } finally {
//         setExportingModalPNG(false);
//       }
//     }
//   };

//   // ✅ ADD: Function to handle export CSV from modal
//   const handleExportModalCSV = () => {
//     if (userCallLogsTableRef.current) {
//       setExportingModalCSV(true);
//       try {
//         userCallLogsTableRef.current.exportUserLogsToCSV();
//       } catch (error) {
//         alert("Failed to export CSV. Please try again.");
//       } finally {
//         setExportingModalCSV(false);
//       }
//     }
//   };

//   // Fix loadingUsers prop - handle both boolean and object cases
//   const isLoading = React.useMemo(() => {
//     if (loadingUsers === undefined || loadingUsers === null) {
//       return false;
//     }

//     if (typeof loadingUsers === "boolean") {
//       return loadingUsers;
//     }

//     if (typeof loadingUsers === "object") {
//       if (loadingUsers.loading !== undefined) {
//         return Boolean(loadingUsers.loading);
//       }
//       if (loadingUsers.isLoading !== undefined) {
//         return Boolean(loadingUsers.isLoading);
//       }
//       return Object.keys(loadingUsers).length > 0;
//     }

//     return Boolean(loadingUsers);
//   }, [loadingUsers]);

//   // ✅ COMBINE loading states
//   const isTableLoading = isLoading || isDataLoading;

//   // Load dealer calls data
//   useEffect(() => {
//     if (dealers && dealers.length > 0 && onGetDealerCalls) {
//       const callsData = {};
//       dealers.forEach((dealer) => {
//         const dealerId = dealer.dealerId || dealer.id;
//         const calls = onGetDealerCalls(dealer);
//         callsData[dealerId] = calls;
//       });
//       setDealerCallsData(callsData);
//     }
//   }, [dealers, onGetDealerCalls]);

//   // ✅ UPDATED: Handle dealer click to open modal - use modalCallsDataType prop
//   const handleDealerClick = useCallback(
//     async (dealer) => {
//       const dealerId = dealer.dealerId || dealer.id;

//       if (!dealerId) {
//         alert("Error: No dealer ID found");
//         return;
//       }

//       setSelectedDealerForModal(dealer);
//       setModalLoading(true);
//       setIsModalOpen(true);
//       setModalUserData([]);

//       try {
//         const userData = await onGetSortedCallLogs(
//           dealerId,
//           modalCallsDataType,
//         );
//         if (Array.isArray(userData)) {
//           setModalUserData(userData);
//         } else {
//           setModalUserData([]);
//         }
//       } catch (error) {
//         setModalUserData([]);
//       } finally {
//         setModalLoading(false);
//       }
//     },
//     [modalCallsDataType, onGetSortedCallLogs],
//   );

//   // ✅ UPDATED: Close modal - reset modal state
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedDealerForModal(null);
//     setModalLoading(false);
//     setModalUserData([]);
//     setExportingModalPNG(false);
//     setExportingModalCSV(false);
//   };

//   // Get dealer calls data with data type filtering - UPDATED to accept dataType parameter
//   const getDealerCalls = (dealer, dataType = dealerSummaryCallsDataType) => {
//     const dealerId = dealer.dealerId || dealer.id;
//     let rawCallsData = dealerCallsData[dealerId];

//     if (!rawCallsData && onGetDealerCalls) {
//       rawCallsData = onGetDealerCalls(dealer);
//     }

//     if (!rawCallsData) {
//       return {
//         totalCalls: 0,
//         outgoing: 0,
//         incoming: 0,
//         connectedCalls: 0,
//         declined: 0,
//         duration: 0,
//       };
//     }

//     // Filter data based on dataType parameter
//     switch (dataType) {
//       case "enquiries":
//         if (rawCallsData.enquiries) {
//           return {
//             totalCalls: rawCallsData.enquiries.totalCalls || 0,
//             outgoing: rawCallsData.enquiries.outgoing || 0,
//             incoming: rawCallsData.enquiries.incoming || 0,
//             connectedCalls: rawCallsData.enquiries.connectedCalls || 0,
//             declined: rawCallsData.enquiries.declined || 0,
//             duration: rawCallsData.enquiries.duration || 0,
//             avgConnected: rawCallsData.enquiries.avgConnected || 0,
//             callsAbove1Min: rawCallsData.enquiries.callsAbove1Min || 0,
//           };
//         }
//         break;

//       case "coldcalls":
//         if (rawCallsData.coldcalls) {
//           return {
//             totalCalls: rawCallsData.coldcalls.totalCalls || 0,
//             outgoing: rawCallsData.coldcalls.outgoing || 0,
//             incoming: rawCallsData.coldcalls.incoming || 0,
//             connectedCalls: rawCallsData.coldcalls.connectedCalls || 0,
//             declined: rawCallsData.coldcalls.declined || 0,
//             duration: rawCallsData.coldcalls.duration || 0,
//             avgConnected: rawCallsData.coldcalls.avgConnected || 0,
//             callsAbove1Min: rawCallsData.coldcalls.callsAbove1Min || 0,
//           };
//         }
//         break;

//       case "combinedCalls":
//         if (rawCallsData.combinedCalls) {
//           const combined = rawCallsData.combinedCalls;
//           return {
//             totalCalls: combined.totalCalls || 0,
//             outgoing: combined.outgoing || 0,
//             incoming: combined.incoming || 0,
//             connectedCalls: combined.connectedCalls || 0,
//             declined: combined.declined || 0,
//             duration: combined.duration || 0,
//             avgConnected: combined.avgConnected || 0,
//             callsAbove1Min: combined.callsAbove1Min || 0,
//           };
//         }
//         break;

//       default:
//         break;
//     }

//     return {
//       totalCalls: rawCallsData.totalCalls || 0,
//       outgoing: rawCallsData.outgoing || 0,
//       incoming: rawCallsData.incoming || 0,
//       connectedCalls: rawCallsData.connectedCalls || 0,
//       declined: rawCallsData.declined || 0,
//       duration: rawCallsData.duration || 0,
//       avgConnected: rawCallsData.avgConnected || 0,
//       callsAbove1Min: rawCallsData.callsAbove1Min || 0,
//     };
//   };

//   // ✅ UPDATED: Dealer Call Summary Table Component for Modal - uses modalCallsDataType prop
//   const DealerCallSummaryTable = ({
//     dealer,
//     dataType = modalCallsDataType,
//   }) => {
//     const dealerCalls = getDealerCalls(dealer, dataType);
//     const dealerSummaryData = {
//       totalCalls: dealerCalls?.totalCalls || 0,
//       outgoing: dealerCalls?.outgoing || 0,
//       incoming: dealerCalls?.incoming || 0,
//       connectedCalls: dealerCalls?.connectedCalls || 0,
//       rejected: dealerCalls?.declined || 0,
//       duration: dealerCalls?.duration || 0,
//       avgConnected: dealerCalls?.avgConnected || 0,
//       callsAbove1Min: dealerCalls?.callsAbove1Min || 0,
//     };

//     return (
//       <div className="mb-4 flex-shrink-0">
//         <div
//           className="overflow-x-auto border border-gray-200 rounded-sm"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#d1d5db #f3f4f6",
//           }}
//         >
//           <style>{`
//             .overflow-x-auto::-webkit-scrollbar {
//               height: 6px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-track {
//               background: #f3f4f6;
//               border-radius: 3px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-thumb {
//               background: #d1d5db;
//               border-radius: 3px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-thumb:hover {
//               background: #9ca3af;
//             }
//           `}</style>
//           <table className="w-full border-collapse text-xs min-w-max bg-white">
//             <thead>
//               <tr className="bg-gray-100 border-b border-gray-300">
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Total Calls
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Outgoing
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Incoming
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Connected
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Declined
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Duration
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Avg Duration (in mins)
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
//                   Calls Above 1 Min
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="bg-white border-b border-gray-200">
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                   {dealerSummaryData.totalCalls || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
//                   {dealerSummaryData.outgoing || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
//                   {dealerSummaryData.incoming || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                   {dealerSummaryData.connectedCalls || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-red-600">
//                   {dealerSummaryData.rejected || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
//                   {dealerSummaryData.duration || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
//                   {dealerSummaryData.avgConnected || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center font-semibold text-gray-700">
//                   {dealerSummaryData.callsAbove1Min || 0}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const getSortedDealersForCallLogs = () => {
//     const list = selectedDealers.length > 0 ? selectedDealers : dealers;

//     if (!list || list.length === 0) {
//       return [];
//     }

//     const sorted = [...list].sort((a, b) => {
//       const dealerCallsA = getDealerCalls(a);
//       const dealerCallsB = getDealerCalls(b);
//       const totalA = dealerCallsA?.totalCalls ?? 0;
//       const totalB = dealerCallsB?.totalCalls ?? 0;
//       return totalB - totalA;
//     });

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

//       const headers = [
//         "Dealer Name",
//         "Total Calls",
//         "Outgoing Calls",
//         "Incoming Calls",
//         "Connected Calls",
//         "Declined Calls",
//         "Total Duration",
//         "Avg Duration",
//         "Calls w Duration > 1m",
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
//           dealerCalls?.avgConnected || 0,
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
//         `dealer-calls-summary-${new Date().toISOString().split("T")[0]}.csv`,
//       );
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("❌ Error exporting CSV:", error);
//       alert("Error exporting data. Please check console for details.");
//     }
//   };

//   const sortedDealers = getSortedDealersForCallLogs();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

//   return (
//     <div className="table-section bg-white rounded-lg shadow-sm border border-gray-200 mx-auto w-full overflow-hidden">
//       {/* Compact Table Header */}
//       <div className="table-header px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//         <div>
//           <h2 className="table-title text-xs font-bold text-gray-900">
//             Dealer Summary — Calls
//           </h2>
//         </div>

//         {/* ✅ UPDATED: Use combined loading state */}
//         {!isTableLoading && (
//           <div className="table-actions flex items-center gap-2 w-full sm:w-auto">
//             <div id="tabs" className="flex gap-1 flex-wrap">
//               {/* Compact Data Type Dropdown - Controls MAIN TABLE filter */}
//               <div className="nav-button-group">
//                 <select
//                   value={dealerSummaryCallsDataType}
//                   onChange={(e) =>
//                     onSetDealerSummaryCallsDataType(e.target.value)
//                   }
//                   className="time-dropdown px-2 py-1 cursor-pointer text-xs font-semibold border border-gray-300 rounded-sm bg-white hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-transparent w-full"
//                 >
//                   <option value="enquiries">Enquiries</option>
//                   <option value="coldcalls">Cold Calls</option>
//                   <option value="combinedCalls">Both</option>
//                 </select>
//               </div>
//             </div>

//             {dealerSummaryCallsViewType === "table" && (
//               <div className="flex gap-2">
//                 {/* PNG Export Button */}
//                 <button
//                   className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1e27a3] flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={handleExportPNG}
//                   disabled={exportingPNG}
//                 >
//                   {exportingPNG ? (
//                     <i className="fas fa-spinner fa-spin text-[10px]"></i>
//                   ) : (
//                     <i className="fas fa-image text-[10px]"></i>
//                   )}
//                   {exportingPNG ? "Exporting..." : "Export PNG"}
//                 </button>
//                 {/* CSV Export Button */}
//                 <button
//                   className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c] flex items-center gap-1 transition-colors"
//                   onClick={exportToCSV}
//                 >
//                   <i className="fas fa-download text-[10px]"></i>
//                   Export CSV
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ✅ UPDATED: Main Content Area with proper loading states */}
//       {isTableLoading ? (
//         <div className="flex flex-col items-center justify-center p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222fb9] mb-4"></div>
//           <div className="text-gray-500 text-sm">Loading call logs data...</div>
//         </div>
//       ) : dealerSummaryCallsViewType === "table" ? (
//         <div className="table-container p-2" ref={tableContainerRef}>
//           {!dealers || dealers.length === 0 ? (
//             <div className="flex justify-center items-center p-8">
//               <div className="text-gray-500 text-sm">
//                 {!dealers
//                   ? "Loading dealers..."
//                   : dealers.length === 0 && isTableLoading === false
//                     ? "Loading dealers"
//                     : "Loading dealers..."}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div ref={tableRef} className="table-scroll overflow-auto">
//                 <table className="data-table calls-table w-full compact-table min-w-[800px] bg-white">
//                   <thead className="table-thead bg-gray-50">
//                     <tr>
//                       <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20">
//                         Dealer
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Total
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Outgoing
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Incoming
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Connected
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Declined
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Duration
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Avg Duration (in mins)
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Calls w Duration &gt; 1m
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedDealers.map((dealer, index) => {
//                       const dealerId = dealer.dealerId || dealer.id;
//                       const dealerCalls = getDealerCalls(dealer);

//                       return (
//                         <tr
//                           key={dealerId}
//                           className={`table-row hover:bg-blue-50 transition-colors dealer-row ${
//                             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                           }`}
//                         >
//                           {/* Dealer Name Column - Clickable for Modal */}
//                           <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-3 py-2 text-left text-gray-900 min-w-[100px]">
//                             <button
//                               className="dealer-name-btn flex items-center gap-1 cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                               onClick={() => handleDealerClick(dealer)}
//                             >
//                               <span className="font-semibold text-xs truncate hover:underline">
//                                 {dealer.dealerName}
//                               </span>
//                               <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                             </button>
//                           </td>

//                           {/* Total calls */}
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div
//                               className={`flex items-center justify-center gap-1 ${
//                                 dealerCalls.totalCalls < 60
//                                   ? "text-red-600 font-bold"
//                                   : "text-gray-900 font-semibold"
//                               }`}
//                             >
//                               <svg
//                                 className="w-2 h-2"
//                                 fill="currentColor"
//                                 viewBox="0 0 16 16"
//                               >
//                                 <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
//                               </svg>
//                               <span className="text-xs">
//                                 {dealerCalls.totalCalls}
//                               </span>
//                             </div>
//                           </td>

//                           {/* Other table cells */}
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-green-600">
//                               <span className="text-xs mr-0.5 font-semibold">
//                                 ↑
//                               </span>
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.outgoing}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-green-600">
//                               <span className="text-xs mr-0.5 font-semibold">
//                                 ↓
//                               </span>
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.incoming}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center">
//                               <span
//                                 className={`flex items-center justify-center w-3 h-3 rounded-full text-white text-[10px] font-bold mr-1 ${
//                                   dealerCalls.connectedCalls < 30
//                                     ? "bg-red-500"
//                                     : "bg-[#222fb9]"
//                                 }`}
//                               >
//                                 ✓
//                               </span>
//                               <span
//                                 className={`text-xs font-semibold ${
//                                   dealerCalls.connectedCalls < 30
//                                     ? "text-red-500"
//                                     : "text-[#222fb9]"
//                                 }`}
//                               >
//                                 {dealerCalls.connectedCalls}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center">
//                               <span className="flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[10px] font-bold mr-1">
//                                 ✗
//                               </span>
//                               <span className="text-red-500 text-xs font-semibold">
//                                 {dealerCalls.declined}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.duration}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.avgConnected}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.callsAbove1Min}
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Compact Show More/Less buttons */}
//               <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
//                 <div className="text-xs font-semibold text-gray-500">
//                   Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
//                   {sortedDealers.length} dealers
//                 </div>
//                 <div className="flex gap-1 self-end sm:self-auto">
//                   {tableLength < sortedDealers.length && (
//                     <button
//                       className="btn btn-primary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                       onClick={() => setTableLength((prev) => prev + 10)}
//                     >
//                       <i className="fas fa-chevron-down text-xs"></i>
//                       Show More
//                     </button>
//                   )}
//                   {tableLength > 10 && sortedDealers.length > 10 && (
//                     <button
//                       className="btn btn-secondary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                       onClick={() => setTableLength(10)}
//                     >
//                       <i className="fas fa-chevron-up text-xs"></i>
//                       Show Less
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="p-2">
//           <BarChart
//             data={[]}
//             title="Dealer-wise Calls Analysis"
//             height={500}
//             showLegend={true}
//           />
//         </div>
//       )}

//       {/* Popup Modal for User Call Logs */}
//       {isModalOpen && selectedDealerForModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={handleCloseModal}
//         >
//           <div
//             ref={modalRef}
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - MATCHING Dealer Summary modal structure */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               {/* Left side: Title and filters (on laptop) */}
//               <div className="hidden md:flex items-center gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   User Call Logs — {selectedDealerForModal.dealerName}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   {/* ✅ FIXED: Modal Filter dropdown */}
//                   <select
//                     value={modalCallsDataType}
//                     onChange={(e) => {
//                       onSetModalCallsDataType(e.target.value);
//                     }}
//                     className="px-3 py-1.5 cursor-pointer text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent transition-colors"
//                   >
//                     <option value="enquiries">Enquiries</option>
//                     <option value="coldcalls">Cold Calls</option>
//                     <option value="combinedCalls">Both</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Mobile: Top header with title and close cross */}
//               <div className="md:hidden flex items-center justify-between w-full">
//                 <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                   User Call Logs
//                   <br />
//                   <span className="text-sm font-normal">
//                     {selectedDealerForModal.dealerName}
//                   </span>
//                 </h2>
//                 <button
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>

//               {/* ✅ ADDED: Right side: Export buttons and Close button for laptop */}
//               <div className="hidden md:flex items-center gap-2">
//                 {/* ✅ ADD: Export PNG button */}
//                 <button
//                   onClick={handleExportModalPNG}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={exportingModalPNG}
//                 >
//                   {exportingModalPNG ? (
//                     <i className="fas fa-spinner fa-spin text-xs"></i>
//                   ) : (
//                     <i className="fas fa-image text-xs"></i>
//                   )}
//                   {exportingModalPNG ? "Exporting..." : "Export PNG"}
//                 </button>

//                 {/* ✅ ADD: Export CSV button */}
//                 <button
//                   onClick={handleExportModalCSV}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={exportingModalCSV}
//                 >
//                   {exportingModalCSV ? (
//                     <i className="fas fa-spinner fa-spin text-xs"></i>
//                   ) : (
//                     <i className="fas fa-download text-xs"></i>
//                   )}
//                   {exportingModalCSV ? "Exporting..." : "Export CSV"}
//                 </button>

//                 {/* Close Button */}
//                 <button
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//             </div>

//             {/* MOBILE ONLY: Additional row for mobile export buttons */}
//             <div className="md:hidden mb-4 flex gap-2 justify-end">
//               <button
//                 onClick={handleExportModalPNG}
//                 className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                 disabled={exportingModalPNG}
//               >
//                 {exportingModalPNG ? (
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                 ) : (
//                   <i className="fas fa-image text-xs"></i>
//                 )}
//                 {exportingModalPNG ? "Exporting..." : "Export PNG"}
//               </button>

//               <button
//                 onClick={handleExportModalCSV}
//                 className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                 disabled={exportingModalCSV}
//               >
//                 {exportingModalCSV ? (
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                 ) : (
//                   <i className="fas fa-download text-xs"></i>
//                 )}
//                 {exportingModalCSV ? "Exporting..." : "Export CSV"}
//               </button>
//             </div>

//             {/* Modal Body - REMOVED extra padding to match Dealer Summary modal */}
//             <div ref={modalContentRef} className="flex-1 overflow-auto min-h-0">
//               <DealerCallSummaryTable
//                 dealer={selectedDealerForModal}
//                 dataType={modalCallsDataType}
//               />

//               {modalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-8">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-600 text-lg">
//                     Loading user call data for{" "}
//                     {selectedDealerForModal.dealerName}...
//                   </div>
//                 </div>
//               ) : (
//                 <UserCallLogsSubTable
//                   ref={userCallLogsTableRef}
//                   dealer={selectedDealerForModal}
//                   userCallLogs={modalUserData}
//                   onGetSortedCallLogs={onGetSortedCallLogs}
//                   isModal={true}
//                   skipAutoLoad={true}
//                   dealerSummaryCallsDataType={modalCallsDataType}
//                   onDataTypeChange={onSetModalCallsDataType}
//                 />
//               )}
//             </div>

//             {/* Modal Footer - MATCHING Dealer Summary modal structure */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={handleCloseModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallLogsTable;

// CODE WITHOUR PREVENTING BG SCROLL
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { toPng } from "html-to-image";
// import BarChart from "./BarChart";
// import UserCallLogsSubTable from "./UserCallLogsSubTable";

// const CallLogsTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   expandedCallLogsRows,
//   userCallLogs,
//   loadingUsers,
//   dealerSummaryCallsViewType,
//   dealerSummaryCallsDataType,
//   // ✅ ADD: Separate props for modal data type control
//   modalCallsDataType,
//   onSetModalCallsDataType,
//   onToggleCallLogsRow,
//   onSetDealerSummaryCallsDataType,
//   onGetDealerCalls,
//   onGetSortedCallLogs,
//   onExpandAllCallLogsRows,
//   onCollapseAllCallLogsRows,
//   areAllCallLogsRowsExpanded,
// }) => {
//   const [dealerCallsData, setDealerCallsData] = useState({});
//   const [localLoading, setLocalLoading] = useState(false);
//   const [selectedDealerForModal, setSelectedDealerForModal] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalUserData, setModalUserData] = useState([]);
//   const [exportingPNG, setExportingPNG] = useState(false);
//   const [exportingModalPNG, setExportingModalPNG] = useState(false);
//   const [exportingModalCSV, setExportingModalCSV] = useState(false);
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // ✅ ADD: Ref for UserCallLogsSubTable to access export functions
//   const userCallLogsTableRef = useRef(null);

//   // Add refs for PNG export
//   const tableRef = useRef(null);
//   const tableContainerRef = useRef(null);
//   const modalRef = useRef(null);
//   const modalContentRef = useRef(null);

//   // ✅ ADD: Effect to reset loading when dealers data loads
//   useEffect(() => {
//     if (dealers) {
//       setIsDataLoading(false);
//     }
//   }, [dealers]);

//   // ✅ UPDATED: Handle filter change in modal - use modalCallsDataType prop
//   const handleFilterChangeInModal = useCallback(
//     async (newDataType) => {
//       if (!selectedDealerForModal || !onGetSortedCallLogs) return;

//       const dealerId =
//         selectedDealerForModal.dealerId || selectedDealerForModal.id;
//       setModalLoading(true);

//       try {
//         const userData = await onGetSortedCallLogs(dealerId, newDataType);

//         if (Array.isArray(userData)) {
//           setModalUserData(userData);
//         } else {
//           setModalUserData([]);
//         }
//       } catch (error) {
//         alert("Error loading filtered data. Please try again.");
//         setModalUserData([]);
//       } finally {
//         setModalLoading(false);
//       }
//     },
//     [selectedDealerForModal, onGetSortedCallLogs],
//   );

//   // ✅ UPDATED: Effect to load modal data when modalCallsDataType changes
//   useEffect(() => {
//     if (isModalOpen && selectedDealerForModal && onGetSortedCallLogs) {
//       handleFilterChangeInModal(modalCallsDataType);
//     }
//   }, [
//     modalCallsDataType,
//     isModalOpen,
//     selectedDealerForModal,
//     onGetSortedCallLogs,
//     handleFilterChangeInModal,
//   ]);
//   const handleExportPNG = async () => {
//     if (!tableRef.current || !tableContainerRef.current) {
//       return;
//     }

//     setExportingPNG(true);

//     try {
//       const exportContainer = document.createElement("div");
//       exportContainer.style.cssText = `
//       position: fixed;
//       left: -9999px;
//       top: 0;
//       background: white;
//       z-index: 99999;
//       overflow: visible;
//       box-sizing: border-box;
//       opacity: 1;
//       padding: 0;
//       margin: 0;
//     `;

//       const containerClone = tableContainerRef.current.cloneNode(true);
//       const table = containerClone.querySelector("table");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       const originalRect = tableContainerRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       containerClone.style.overflow = "visible";
//       containerClone.style.position = "static";

//       const scrollableContainer =
//         containerClone.querySelector(".overflow-auto");
//       if (scrollableContainer) {
//         scrollableContainer.style.overflow = "visible";
//         scrollableContainer.style.maxHeight = "none";
//       }

//       table.style.width = "100%";
//       table.style.position = "static";
//       table.style.display = "table";

//       const stickyElements = containerClone.querySelectorAll(".sticky");
//       stickyElements.forEach((el) => {
//         el.style.position = "static";
//         el.style.left = "auto";
//         el.style.zIndex = "auto";
//       });

//       const interactiveElements = containerClone.querySelectorAll(
//         "button, select, input, .export-button",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       exportContainer.appendChild(containerClone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           containerClone.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const cloneRect = containerClone.getBoundingClientRect();
//       const captureWidth = Math.ceil(cloneRect.width);
//       const captureHeight = Math.ceil(cloneRect.height);

//       const paddedWidth = Math.ceil(captureWidth + 20);
//       const paddedHeight = Math.ceil(captureHeight + 20);

//       const dataUrl = await toPng(containerClone, {
//         quality: 1,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         width: paddedWidth,
//         height: paddedHeight,
//         style: {
//           transform: "none",
//           transformOrigin: "top left",
//           overflow: "visible",
//           margin: "0",
//           padding: "10px",
//           display: "block",
//           width: `${paddedWidth}px`,
//           boxSizing: "border-box",
//         },
//         filter: (node) => {
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           if (node.classList && node.classList.contains("export-button")) {
//             return false;
//           }
//           return true;
//         },
//       });

//       document.body.removeChild(exportContainer);

//       const link = document.createElement("a");
//       link.download = `dealer-calls-summary-${
//         new Date().toISOString().split("T")[0]
//       }.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error("Error exporting PNG:", error);
//       alert("Failed to export PNG. Please try again.");
//     } finally {
//       setExportingPNG(false);
//     }
//   };
//   // const handleExportPNG = async () => {
//   //   if (!tableRef.current || !tableContainerRef.current) {
//   //     return;
//   //   }

//   //   setExportingPNG(true);

//   //   try {
//   //     const exportContainer = document.createElement("div");
//   //     exportContainer.style.cssText = `
//   //     position: fixed;
//   //     left: -9999px;
//   //     top: 0;
//   //     background: white;
//   //     z-index: 99999;
//   //     overflow: visible;
//   //     box-sizing: border-box;
//   //     opacity: 1;
//   //     padding: 0;
//   //     margin: 0;
//   //   `;

//   //     const containerClone = tableContainerRef.current.cloneNode(true);
//   //     const table = containerClone.querySelector("table");

//   //     if (!table) {
//   //       throw new Error("Table not found in clone");
//   //     }

//   //     const originalRect = tableContainerRef.current.getBoundingClientRect();
//   //     exportContainer.style.width = `${originalRect.width}px`;
//   //     exportContainer.style.height = "auto";

//   //     containerClone.style.overflow = "visible";
//   //     containerClone.style.position = "static";

//   //     const scrollableContainer =
//   //       containerClone.querySelector(".overflow-auto");
//   //     if (scrollableContainer) {
//   //       scrollableContainer.style.overflow = "visible";
//   //       scrollableContainer.style.maxHeight = "none";
//   //     }

//   //     table.style.width = "100%";
//   //     table.style.position = "static";
//   //     table.style.display = "table";

//   //     const stickyElements = containerClone.querySelectorAll(".sticky");
//   //     stickyElements.forEach((el) => {
//   //       el.style.position = "static";
//   //       el.style.left = "auto";
//   //       el.style.zIndex = "auto";
//   //     });

//   //     const interactiveElements = containerClone.querySelectorAll(
//   //       "button, select, input, .export-button",
//   //     );
//   //     interactiveElements.forEach((el) => {
//   //       el.remove();
//   //     });

//   //     exportContainer.appendChild(containerClone);
//   //     document.body.appendChild(exportContainer);

//   //     await new Promise((resolve) => {
//   //       requestAnimationFrame(() => {
//   //         containerClone.offsetHeight;
//   //         resolve();
//   //       });
//   //     });

//   //     await new Promise((resolve) => setTimeout(resolve, 300));

//   //     const cloneRect = containerClone.getBoundingClientRect();
//   //     const captureWidth = Math.ceil(cloneRect.width);
//   //     const captureHeight = Math.ceil(cloneRect.height);

//   //     const paddedWidth = Math.ceil(captureWidth + 20);
//   //     const paddedHeight = Math.ceil(captureHeight + 20);

//   //     const dataUrl = await toPng(containerClone, {
//   //       quality: 1,
//   //       pixelRatio: 2,
//   //       backgroundColor: "#ffffff",
//   //       width: paddedWidth,
//   //       height: paddedHeight,
//   //       style: {
//   //         transform: "none",
//   //         transformOrigin: "top left",
//   //         overflow: "visible",
//   //         margin: "0",
//   //         padding: "10px",
//   //         display: "block",
//   //         width: `${paddedWidth}px`,
//   //         boxSizing: "border-box",
//   //       },
//   //       filter: (node) => {
//   //         if (node.style && node.style.display === "none") {
//   //           return false;
//   //         }
//   //         if (node.classList && node.classList.contains("export-button")) {
//   //           return false;
//   //         }
//   //         return true;
//   //       },
//   //     });

//   //     document.body.removeChild(exportContainer);

//   //     const link = document.createElement("a");
//   //     link.download = `dealer-calls-summary-${
//   //       new Date().toISOString().split("T")[0]
//   //     }.png`;
//   //     link.href = dataUrl;
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);
//   //   } catch (error) {
//   //     console.error("Error exporting PNG:", error);
//   //     alert("Failed to export PNG. Please try again.");
//   //   } finally {
//   //     setExportingPNG(false);
//   //   }
//   // };

//   // ✅ ADD: Function to handle export PNG from modal
//   const handleExportModalPNG = async () => {
//     if (userCallLogsTableRef.current) {
//       setExportingModalPNG(true);
//       try {
//         await userCallLogsTableRef.current.handleExportPNG();
//       } catch (error) {
//         alert("Failed to export PNG. Please try again.");
//       } finally {
//         setExportingModalPNG(false);
//       }
//     }
//   };

//   // ✅ ADD: Function to handle export CSV from modal
//   const handleExportModalCSV = () => {
//     if (userCallLogsTableRef.current) {
//       setExportingModalCSV(true);
//       try {
//         userCallLogsTableRef.current.exportUserLogsToCSV();
//       } catch (error) {
//         alert("Failed to export CSV. Please try again.");
//       } finally {
//         setExportingModalCSV(false);
//       }
//     }
//   };

//   // Fix loadingUsers prop - handle both boolean and object cases
//   const isLoading = React.useMemo(() => {
//     if (loadingUsers === undefined || loadingUsers === null) {
//       return false;
//     }

//     if (typeof loadingUsers === "boolean") {
//       return loadingUsers;
//     }

//     if (typeof loadingUsers === "object") {
//       if (loadingUsers.loading !== undefined) {
//         return Boolean(loadingUsers.loading);
//       }
//       if (loadingUsers.isLoading !== undefined) {
//         return Boolean(loadingUsers.isLoading);
//       }
//       return Object.keys(loadingUsers).length > 0;
//     }

//     return Boolean(loadingUsers);
//   }, [loadingUsers]);

//   // ✅ COMBINE loading states
//   const isTableLoading = isLoading || isDataLoading;

//   // Load dealer calls data
//   useEffect(() => {
//     if (dealers && dealers.length > 0 && onGetDealerCalls) {
//       const callsData = {};
//       dealers.forEach((dealer) => {
//         const dealerId = dealer.dealerId || dealer.id;
//         const calls = onGetDealerCalls(dealer);
//         callsData[dealerId] = calls;
//       });
//       setDealerCallsData(callsData);
//     }
//   }, [dealers, onGetDealerCalls]);

//   // ✅ UPDATED: Handle dealer click to open modal - use modalCallsDataType prop
//   const handleDealerClick = useCallback(
//     async (dealer) => {
//       const dealerId = dealer.dealerId || dealer.id;

//       if (!dealerId) {
//         alert("Error: No dealer ID found");
//         return;
//       }

//       setSelectedDealerForModal(dealer);
//       setModalLoading(true);
//       setIsModalOpen(true);
//       setModalUserData([]);

//       try {
//         const userData = await onGetSortedCallLogs(
//           dealerId,
//           modalCallsDataType,
//         );
//         if (Array.isArray(userData)) {
//           setModalUserData(userData);
//         } else {
//           setModalUserData([]);
//         }
//       } catch (error) {
//         setModalUserData([]);
//       } finally {
//         setModalLoading(false);
//       }
//     },
//     [modalCallsDataType, onGetSortedCallLogs],
//   );

//   // ✅ UPDATED: Close modal - reset modal state
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedDealerForModal(null);
//     setModalLoading(false);
//     setModalUserData([]);
//     setExportingModalPNG(false);
//     setExportingModalCSV(false);
//   };

//   // Get dealer calls data with data type filtering - UPDATED to accept dataType parameter
//   const getDealerCalls = (dealer, dataType = dealerSummaryCallsDataType) => {
//     const dealerId = dealer.dealerId || dealer.id;
//     let rawCallsData = dealerCallsData[dealerId];

//     if (!rawCallsData && onGetDealerCalls) {
//       rawCallsData = onGetDealerCalls(dealer);
//     }

//     if (!rawCallsData) {
//       return {
//         totalCalls: 0,
//         outgoing: 0,
//         incoming: 0,
//         connectedCalls: 0,
//         declined: 0,
//         duration: 0,
//       };
//     }

//     // Filter data based on dataType parameter
//     switch (dataType) {
//       case "enquiries":
//         if (rawCallsData.enquiries) {
//           return {
//             totalCalls: rawCallsData.enquiries.totalCalls || 0,
//             outgoing: rawCallsData.enquiries.outgoing || 0,
//             incoming: rawCallsData.enquiries.incoming || 0,
//             connectedCalls: rawCallsData.enquiries.connectedCalls || 0,
//             declined: rawCallsData.enquiries.declined || 0,
//             duration: rawCallsData.enquiries.duration || 0,
//             avgConnected: rawCallsData.enquiries.avgConnected || 0,
//             callsAbove1Min: rawCallsData.enquiries.callsAbove1Min || 0,
//           };
//         }
//         break;

//       case "coldcalls":
//         if (rawCallsData.coldcalls) {
//           return {
//             totalCalls: rawCallsData.coldcalls.totalCalls || 0,
//             outgoing: rawCallsData.coldcalls.outgoing || 0,
//             incoming: rawCallsData.coldcalls.incoming || 0,
//             connectedCalls: rawCallsData.coldcalls.connectedCalls || 0,
//             declined: rawCallsData.coldcalls.declined || 0,
//             duration: rawCallsData.coldcalls.duration || 0,
//             avgConnected: rawCallsData.coldcalls.avgConnected || 0,
//             callsAbove1Min: rawCallsData.coldcalls.callsAbove1Min || 0,
//           };
//         }
//         break;

//       case "combinedCalls":
//         if (rawCallsData.combinedCalls) {
//           const combined = rawCallsData.combinedCalls;
//           return {
//             totalCalls: combined.totalCalls || 0,
//             outgoing: combined.outgoing || 0,
//             incoming: combined.incoming || 0,
//             connectedCalls: combined.connectedCalls || 0,
//             declined: combined.declined || 0,
//             duration: combined.duration || 0,
//             avgConnected: combined.avgConnected || 0,
//             callsAbove1Min: combined.callsAbove1Min || 0,
//           };
//         }
//         break;

//       default:
//         break;
//     }

//     return {
//       totalCalls: rawCallsData.totalCalls || 0,
//       outgoing: rawCallsData.outgoing || 0,
//       incoming: rawCallsData.incoming || 0,
//       connectedCalls: rawCallsData.connectedCalls || 0,
//       declined: rawCallsData.declined || 0,
//       duration: rawCallsData.duration || 0,
//       avgConnected: rawCallsData.avgConnected || 0,
//       callsAbove1Min: rawCallsData.callsAbove1Min || 0,
//     };
//   };

//   // ✅ UPDATED: Dealer Call Summary Table Component for Modal - uses modalCallsDataType prop
//   const DealerCallSummaryTable = ({
//     dealer,
//     dataType = modalCallsDataType,
//   }) => {
//     const dealerCalls = getDealerCalls(dealer, dataType);
//     const dealerSummaryData = {
//       totalCalls: dealerCalls?.totalCalls || 0,
//       outgoing: dealerCalls?.outgoing || 0,
//       incoming: dealerCalls?.incoming || 0,
//       connectedCalls: dealerCalls?.connectedCalls || 0,
//       rejected: dealerCalls?.declined || 0,
//       duration: dealerCalls?.duration || 0,
//       avgConnected: dealerCalls?.avgConnected || 0,
//       callsAbove1Min: dealerCalls?.callsAbove1Min || 0,
//     };

//     return (
//       <div className="mb-4 flex-shrink-0">
//         <div
//           className="overflow-x-auto border border-gray-200 rounded-sm"
//           style={{
//             scrollbarWidth: "thin",
//             scrollbarColor: "#d1d5db #f3f4f6",
//           }}
//         >
//           <style>{`
//             .overflow-x-auto::-webkit-scrollbar {
//               height: 6px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-track {
//               background: #f3f4f6;
//               border-radius: 3px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-thumb {
//               background: #d1d5db;
//               border-radius: 3px;
//             }
//             .overflow-x-auto::-webkit-scrollbar-thumb:hover {
//               background: #9ca3af;
//             }
//           `}</style>
//           <table className="w-full border-collapse text-xs min-w-max bg-white">
//             <thead>
//               <tr className="bg-gray-100 border-b border-gray-300">
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Total Calls
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Outgoing
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Incoming
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Connected
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Declined
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Duration
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                   Avg Duration (in mins)
//                 </th>
//                 <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
//                   Calls Above 1 Min
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="bg-white border-b border-gray-200">
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                   {dealerSummaryData.totalCalls || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
//                   {dealerSummaryData.outgoing || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-green-600">
//                   {dealerSummaryData.incoming || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                   {dealerSummaryData.connectedCalls || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-red-600">
//                   {dealerSummaryData.rejected || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
//                   {dealerSummaryData.duration || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
//                   {dealerSummaryData.avgConnected || 0}
//                 </td>
//                 <td className="px-3 py-2 text-center font-semibold text-gray-700">
//                   {dealerSummaryData.callsAbove1Min || 0}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const getSortedDealersForCallLogs = () => {
//     const list = selectedDealers.length > 0 ? selectedDealers : dealers;

//     if (!list || list.length === 0) {
//       return [];
//     }

//     const sorted = [...list].sort((a, b) => {
//       const dealerCallsA = getDealerCalls(a);
//       const dealerCallsB = getDealerCalls(b);
//       const totalA = dealerCallsA?.totalCalls ?? 0;
//       const totalB = dealerCallsB?.totalCalls ?? 0;
//       return totalB - totalA;
//     });

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

//       const headers = [
//         "Dealer Name",
//         "Total Calls",
//         "Outgoing Calls",
//         "Incoming Calls",
//         "Connected Calls",
//         "Declined Calls",
//         "Total Duration",
//         "Avg Duration",
//         "Calls w Duration > 1m",
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
//           dealerCalls?.avgConnected || 0,
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
//         `dealer-calls-summary-${new Date().toISOString().split("T")[0]}.csv`,
//       );
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("❌ Error exporting CSV:", error);
//       alert("Error exporting data. Please check console for details.");
//     }
//   };

//   const sortedDealers = getSortedDealersForCallLogs();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

//   return (
//     <div className="table-section bg-white rounded-lg shadow-sm border border-gray-200 mx-auto w-full overflow-hidden">
//       {/* Compact Table Header */}
//       <div className="table-header px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//         <div>
//           <h2 className="table-title text-xs font-bold text-gray-900">
//             Dealer Summary — Calls
//           </h2>
//         </div>

//         {/* ✅ UPDATED: Use combined loading state */}
//         {!isTableLoading && (
//           <div className="table-actions flex items-center gap-2 w-full sm:w-auto">
//             <div id="tabs" className="flex gap-1 flex-wrap">
//               {/* Compact Data Type Dropdown - Controls MAIN TABLE filter */}
//               <div className="nav-button-group">
//                 <select
//                   value={dealerSummaryCallsDataType}
//                   onChange={(e) =>
//                     onSetDealerSummaryCallsDataType(e.target.value)
//                   }
//                   className="time-dropdown px-2 py-1 cursor-pointer text-xs font-semibold border border-gray-300 rounded-sm bg-white hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-transparent w-full"
//                 >
//                   <option value="enquiries">Enquiries</option>
//                   <option value="coldcalls">Cold Calls</option>
//                   <option value="combinedCalls">Both</option>
//                 </select>
//               </div>
//             </div>

//             {dealerSummaryCallsViewType === "table" && (
//               <div className="flex gap-2">
//                 {/* PNG Export Button */}
//                 <button
//                   className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1e27a3] flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={handleExportPNG}
//                   disabled={exportingPNG}
//                 >
//                   {exportingPNG ? (
//                     <i className="fas fa-spinner fa-spin text-[10px]"></i>
//                   ) : (
//                     <i className="fas fa-image text-[10px]"></i>
//                   )}
//                   {exportingPNG ? "Exporting..." : "Export PNG"}
//                 </button>
//                 {/* CSV Export Button */}
//                 <button
//                   className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c] flex items-center gap-1 transition-colors"
//                   onClick={exportToCSV}
//                 >
//                   <i className="fas fa-download text-[10px]"></i>
//                   Export CSV
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* ✅ UPDATED: Main Content Area with proper loading states */}
//       {isTableLoading ? (
//         <div className="flex flex-col items-center justify-center p-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222fb9] mb-4"></div>
//           <div className="text-gray-500 text-sm">Loading call logs data...</div>
//         </div>
//       ) : dealerSummaryCallsViewType === "table" ? (
//         <div className="table-container p-2" ref={tableContainerRef}>
//           {!dealers || dealers.length === 0 ? (
//             <div className="flex justify-center items-center p-8">
//               <div className="text-gray-500 text-sm">
//                 {!dealers
//                   ? "Loading dealers..."
//                   : dealers.length === 0 && isTableLoading === false
//                     ? "Loading dealers"
//                     : "Loading dealers..."}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div ref={tableRef} className="table-scroll overflow-auto">
//                 <table className="data-table calls-table w-full compact-table min-w-[800px] bg-white">
//                   <thead className="table-thead bg-gray-50">
//                     <tr>
//                       <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 border-r border-gray-200 sticky left-0 bg-gray-50 z-20">
//                         Dealer
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Total
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Outgoing
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Incoming
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Connected
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Declined
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Duration
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Avg Duration (in mins)
//                       </th>
//                       <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
//                         Calls w Duration &gt; 1m
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedDealers.map((dealer, index) => {
//                       const dealerId = dealer.dealerId || dealer.id;
//                       const dealerCalls = getDealerCalls(dealer);

//                       return (
//                         <tr
//                           key={dealerId}
//                           className={`table-row hover:bg-blue-50 transition-colors dealer-row ${
//                             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                           }`}
//                         >
//                           {/* Dealer Name Column - Clickable for Modal */}
//                           <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-3 py-2 text-left text-gray-900 min-w-[100px]">
//                             <button
//                               className="dealer-name-btn flex items-center gap-1 cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                               onClick={() => handleDealerClick(dealer)}
//                             >
//                               <span className="font-semibold text-xs truncate hover:underline">
//                                 {dealer.dealerName}
//                               </span>
//                               <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                             </button>
//                           </td>

//                           {/* Total calls */}
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div
//                               className={`flex items-center justify-center gap-1 ${
//                                 dealerCalls.totalCalls < 60
//                                   ? "text-red-600 font-bold"
//                                   : "text-gray-900 font-semibold"
//                               }`}
//                             >
//                               <svg
//                                 className="w-2 h-2"
//                                 fill="currentColor"
//                                 viewBox="0 0 16 16"
//                               >
//                                 <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
//                               </svg>
//                               <span className="text-xs">
//                                 {dealerCalls.totalCalls}
//                               </span>
//                             </div>
//                           </td>

//                           {/* Other table cells */}
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-green-600">
//                               <span className="text-xs mr-0.5 font-semibold">
//                                 ↑
//                               </span>
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.outgoing}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-green-600">
//                               <span className="text-xs mr-0.5 font-semibold">
//                                 ↓
//                               </span>
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.incoming}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center">
//                               <span
//                                 className={`flex items-center justify-center w-3 h-3 rounded-full text-white text-[10px] font-bold mr-1 ${
//                                   dealerCalls.connectedCalls < 30
//                                     ? "bg-red-500"
//                                     : "bg-[#222fb9]"
//                                 }`}
//                               >
//                                 ✓
//                               </span>
//                               <span
//                                 className={`text-xs font-semibold ${
//                                   dealerCalls.connectedCalls < 30
//                                     ? "text-red-500"
//                                     : "text-[#222fb9]"
//                                 }`}
//                               >
//                                 {dealerCalls.connectedCalls}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center">
//                               <span className="flex items-center justify-center w-3 h-3 rounded-full bg-red-500 text-white text-[10px] font-bold mr-1">
//                                 ✗
//                               </span>
//                               <span className="text-red-500 text-xs font-semibold">
//                                 {dealerCalls.declined}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.duration}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.avgConnected}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
//                             <div className="flex items-center justify-center text-gray-700">
//                               <span className="text-xs font-semibold">
//                                 {dealerCalls.callsAbove1Min}
//                               </span>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Compact Show More/Less buttons */}
//               <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
//                 <div className="text-xs font-semibold text-gray-500">
//                   Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
//                   {sortedDealers.length} dealers
//                 </div>
//                 <div className="flex gap-1 self-end sm:self-auto">
//                   {tableLength < sortedDealers.length && (
//                     <button
//                       className="btn btn-primary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                       onClick={() => setTableLength((prev) => prev + 10)}
//                     >
//                       <i className="fas fa-chevron-down text-xs"></i>
//                       Show More
//                     </button>
//                   )}
//                   {tableLength > 10 && sortedDealers.length > 10 && (
//                     <button
//                       className="btn btn-secondary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
//                       onClick={() => setTableLength(10)}
//                     >
//                       <i className="fas fa-chevron-up text-xs"></i>
//                       Show Less
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="p-2">
//           <BarChart
//             data={[]}
//             title="Dealer-wise Calls Analysis"
//             height={500}
//             showLegend={true}
//           />
//         </div>
//       )}

//       {/* Popup Modal for User Call Logs */}
//       {isModalOpen && selectedDealerForModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={handleCloseModal}
//         >
//           <div
//             ref={modalRef}
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - MATCHING Dealer Summary modal structure */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               {/* Left side: Title and filters (on laptop) */}
//               <div className="hidden md:flex items-center gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   User Call Logs — {selectedDealerForModal.dealerName}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   {/* ✅ FIXED: Modal Filter dropdown */}
//                   <select
//                     value={modalCallsDataType}
//                     onChange={(e) => {
//                       onSetModalCallsDataType(e.target.value);
//                     }}
//                     className="px-3 py-1.5 cursor-pointer text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent transition-colors"
//                   >
//                     <option value="enquiries">Enquiries</option>
//                     <option value="coldcalls">Cold Calls</option>
//                     <option value="combinedCalls">Both</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Mobile: Top header with title and close cross */}
//               <div className="md:hidden flex items-center justify-between w-full">
//                 <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                   User Call Logs
//                   <br />
//                   <span className="text-sm font-normal">
//                     {selectedDealerForModal.dealerName}
//                   </span>
//                 </h2>
//                 <button
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>

//               {/* ✅ ADDED: Right side: Export buttons and Close button for laptop */}
//               <div className="hidden md:flex items-center gap-2">
//                 {/* ✅ ADD: Export PNG button */}
//                 <button
//                   onClick={handleExportModalPNG}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={exportingModalPNG}
//                 >
//                   {exportingModalPNG ? (
//                     <i className="fas fa-spinner fa-spin text-xs"></i>
//                   ) : (
//                     <i className="fas fa-image text-xs"></i>
//                   )}
//                   {exportingModalPNG ? "Exporting..." : "Export PNG"}
//                 </button>

//                 {/* ✅ ADD: Export CSV button */}
//                 <button
//                   onClick={handleExportModalCSV}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={exportingModalCSV}
//                 >
//                   {exportingModalCSV ? (
//                     <i className="fas fa-spinner fa-spin text-xs"></i>
//                   ) : (
//                     <i className="fas fa-download text-xs"></i>
//                   )}
//                   {exportingModalCSV ? "Exporting..." : "Export CSV"}
//                 </button>

//                 {/* Close Button */}
//                 <button
//                   onClick={handleCloseModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//             </div>

//             {/* MOBILE ONLY: Additional row for mobile export buttons */}
//             <div className="md:hidden mb-4 flex gap-2 justify-end">
//               <button
//                 onClick={handleExportModalPNG}
//                 className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                 disabled={exportingModalPNG}
//               >
//                 {exportingModalPNG ? (
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                 ) : (
//                   <i className="fas fa-image text-xs"></i>
//                 )}
//                 {exportingModalPNG ? "Exporting..." : "Export PNG"}
//               </button>

//               <button
//                 onClick={handleExportModalCSV}
//                 className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                 disabled={exportingModalCSV}
//               >
//                 {exportingModalCSV ? (
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                 ) : (
//                   <i className="fas fa-download text-xs"></i>
//                 )}
//                 {exportingModalCSV ? "Exporting..." : "Export CSV"}
//               </button>
//             </div>

//             {/* Modal Body - REMOVED DealerCallSummaryTable from here to avoid duplication */}
//             <div ref={modalContentRef} className="flex-1 overflow-auto min-h-0">
//               {modalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-8">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-600 text-lg">
//                     Loading user call data for{" "}
//                     {selectedDealerForModal.dealerName}...
//                   </div>
//                 </div>
//               ) : (
//                 <UserCallLogsSubTable
//                   ref={userCallLogsTableRef}
//                   dealer={selectedDealerForModal}
//                   userCallLogs={modalUserData}
//                   onGetSortedCallLogs={onGetSortedCallLogs}
//                   isModal={true}
//                   skipAutoLoad={true}
//                   dealerSummaryCallsDataType={modalCallsDataType}
//                   onDataTypeChange={onSetModalCallsDataType}
//                   dealerSummaryRow={
//                     <DealerCallSummaryTable
//                       dealer={selectedDealerForModal}
//                       dataType={modalCallsDataType}
//                     />
//                   }
//                 />
//               )}
//             </div>

//             {/* Modal Footer - MATCHING Dealer Summary modal structure */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={handleCloseModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CallLogsTable;

// CODE WITH PREVENTING SCROLL BG SCROLL ON OPEN OF SCROLL
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import BarChart from "./BarChart";
import UserCallLogsSubTable from "./UserCallLogsSubTable";

const CallLogsTable = ({
  dealers,
  selectedDealers,
  tableLength,
  setTableLength,
  expandedCallLogsRows,
  userCallLogs,
  loadingUsers,
  dealerSummaryCallsViewType,
  dealerSummaryCallsDataType,
  // ✅ ADD: Separate props for modal data type control
  modalCallsDataType,
  onSetModalCallsDataType,
  onToggleCallLogsRow,
  onSetDealerSummaryCallsDataType,
  onGetDealerCalls,
  onGetSortedCallLogs,
  onExpandAllCallLogsRows,
  onCollapseAllCallLogsRows,
  areAllCallLogsRowsExpanded,
}) => {
  const [dealerCallsData, setDealerCallsData] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const [selectedDealerForModal, setSelectedDealerForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalUserData, setModalUserData] = useState([]);
  const [exportingPNG, setExportingPNG] = useState(false);
  const [exportingModalPNG, setExportingModalPNG] = useState(false);
  const [exportingModalCSV, setExportingModalCSV] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ✅ ADD: Ref for UserCallLogsSubTable to access export functions
  const userCallLogsTableRef = useRef(null);

  // Add refs for PNG export
  const tableRef = useRef(null);
  const tableContainerRef = useRef(null);
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);

  // ✅ ADD: Scroll prevention effect for modal
  useEffect(() => {
    const body = document.body;

    if (isModalOpen) {
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
  }, [isModalOpen]);

  // ✅ ADD: Effect to reset loading when dealers data loads
  useEffect(() => {
    if (dealers) {
      setIsDataLoading(false);
    }
  }, [dealers]);

  // ✅ UPDATED: Handle filter change in modal - use modalCallsDataType prop
  const handleFilterChangeInModal = useCallback(
    async (newDataType) => {
      if (!selectedDealerForModal || !onGetSortedCallLogs) return;

      const dealerId =
        selectedDealerForModal.dealerId || selectedDealerForModal.id;
      setModalLoading(true);

      try {
        const userData = await onGetSortedCallLogs(dealerId, newDataType);

        if (Array.isArray(userData)) {
          setModalUserData(userData);
        } else {
          setModalUserData([]);
        }
      } catch (error) {
        alert("Error loading filtered data. Please try again.");
        setModalUserData([]);
      } finally {
        setModalLoading(false);
      }
    },
    [selectedDealerForModal, onGetSortedCallLogs],
  );

  // ✅ UPDATED: Effect to load modal data when modalCallsDataType changes
  useEffect(() => {
    if (isModalOpen && selectedDealerForModal && onGetSortedCallLogs) {
      handleFilterChangeInModal(modalCallsDataType);
    }
  }, [
    modalCallsDataType,
    isModalOpen,
    selectedDealerForModal,
    onGetSortedCallLogs,
    handleFilterChangeInModal,
  ]);
  const handleExportPNG = async () => {
    if (!tableRef.current || !tableContainerRef.current) {
      return;
    }

    setExportingPNG(true);

    try {
      const exportContainer = document.createElement("div");
      exportContainer.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      background: white;
      z-index: 99999;
      overflow: visible;
      box-sizing: border-box;
      opacity: 1;
      padding: 0;
      margin: 0;
    `;

      const containerClone = tableContainerRef.current.cloneNode(true);
      const table = containerClone.querySelector("table");

      if (!table) {
        throw new Error("Table not found in clone");
      }

      const originalRect = tableContainerRef.current.getBoundingClientRect();
      exportContainer.style.width = `${originalRect.width}px`;
      exportContainer.style.height = "auto";

      containerClone.style.overflow = "visible";
      containerClone.style.position = "static";

      const scrollableContainer =
        containerClone.querySelector(".overflow-auto");
      if (scrollableContainer) {
        scrollableContainer.style.overflow = "visible";
        scrollableContainer.style.maxHeight = "none";
      }

      table.style.width = "100%";
      table.style.position = "static";
      table.style.display = "table";

      const stickyElements = containerClone.querySelectorAll(".sticky");
      stickyElements.forEach((el) => {
        el.style.position = "static";
        el.style.left = "auto";
        el.style.zIndex = "auto";
      });

      // ✅ FIXED: Preserve dealer names while removing interactivity
      // First, handle dealer name buttons specifically
      const dealerNameButtons =
        containerClone.querySelectorAll(".dealer-name-btn");
      dealerNameButtons.forEach((button) => {
        // Extract the dealer name text from the button
        const dealerNameSpan = button.querySelector("span");
        const dealerName = dealerNameSpan
          ? dealerNameSpan.textContent
          : button.textContent;

        // Create a div to replace the button, preserving the styling
        const dealerNameDiv = document.createElement("div");
        dealerNameDiv.className = "dealer-name-export";
        dealerNameDiv.style.cssText = `
        display: flex;
        align-items: center;
        gap: 4px;
        width: 100%;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        color: #222fb9;
      `;

        // Add the dealer name text
        const nameSpan = document.createElement("span");
        nameSpan.textContent = dealerName;
        nameSpan.style.cssText = `
        font-weight: 600;
        font-size: 12px;
        color: #222fb9;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `;

        dealerNameDiv.appendChild(nameSpan);

        // Replace the button with the div
        if (button.parentNode) {
          button.parentNode.replaceChild(dealerNameDiv, button);
        }
      });

      // Remove other interactive elements (but keep the structure for dealer names)
      const interactiveElements = containerClone.querySelectorAll(
        "button:not(.dealer-name-btn), select, input, .export-button, .fa-chevron-right",
      );
      interactiveElements.forEach((el) => {
        if (el.parentNode) {
          el.remove();
        }
      });

      exportContainer.appendChild(containerClone);
      document.body.appendChild(exportContainer);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          containerClone.offsetHeight;
          resolve();
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      const cloneRect = containerClone.getBoundingClientRect();
      const captureWidth = Math.ceil(cloneRect.width);
      const captureHeight = Math.ceil(cloneRect.height);

      const paddedWidth = Math.ceil(captureWidth + 20);
      const paddedHeight = Math.ceil(captureHeight + 20);

      const dataUrl = await toPng(containerClone, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: paddedWidth,
        height: paddedHeight,
        style: {
          transform: "none",
          transformOrigin: "top left",
          overflow: "visible",
          margin: "0",
          padding: "10px",
          display: "block",
          width: `${paddedWidth}px`,
          boxSizing: "border-box",
        },
        filter: (node) => {
          if (node.style && node.style.display === "none") {
            return false;
          }
          if (node.classList && node.classList.contains("export-button")) {
            return false;
          }
          // ✅ FIXED: Don't filter out dealer name elements
          if (node.classList && node.classList.contains("dealer-name-btn")) {
            return true; // Keep these, they've been converted to divs
          }
          if (node.classList && node.classList.contains("dealer-name-export")) {
            return true; // Keep the replacement divs
          }
          return true;
        },
      });

      document.body.removeChild(exportContainer);

      const link = document.createElement("a");
      link.download = `dealer-calls-summary-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting PNG:", error);
      alert("Failed to export PNG. Please try again.");
    } finally {
      setExportingPNG(false);
    }
  };
  // const handleExportPNG = async () => {
  //   if (!tableRef.current || !tableContainerRef.current) {
  //     return;
  //   }

  //   setExportingPNG(true);

  //   try {
  //     const exportContainer = document.createElement("div");
  //     exportContainer.style.cssText = `
  //     position: fixed;
  //     left: -9999px;
  //     top: 0;
  //     background: white;
  //     z-index: 99999;
  //     overflow: visible;
  //     box-sizing: border-box;
  //     opacity: 1;
  //     padding: 0;
  //     margin: 0;
  //   `;

  //     const containerClone = tableContainerRef.current.cloneNode(true);
  //     const table = containerClone.querySelector("table");

  //     if (!table) {
  //       throw new Error("Table not found in clone");
  //     }

  //     const originalRect = tableContainerRef.current.getBoundingClientRect();
  //     exportContainer.style.width = `${originalRect.width}px`;
  //     exportContainer.style.height = "auto";

  //     containerClone.style.overflow = "visible";
  //     containerClone.style.position = "static";

  //     const scrollableContainer =
  //       containerClone.querySelector(".overflow-auto");
  //     if (scrollableContainer) {
  //       scrollableContainer.style.overflow = "visible";
  //       scrollableContainer.style.maxHeight = "none";
  //     }

  //     table.style.width = "100%";
  //     table.style.position = "static";
  //     table.style.display = "table";

  //     const stickyElements = containerClone.querySelectorAll(".sticky");
  //     stickyElements.forEach((el) => {
  //       el.style.position = "static";
  //       el.style.left = "auto";
  //       el.style.zIndex = "auto";
  //     });

  //     const interactiveElements = containerClone.querySelectorAll(
  //       "button, select, input, .export-button",
  //     );
  //     interactiveElements.forEach((el) => {
  //       el.remove();
  //     });

  //     exportContainer.appendChild(containerClone);
  //     document.body.appendChild(exportContainer);

  //     await new Promise((resolve) => {
  //       requestAnimationFrame(() => {
  //         containerClone.offsetHeight;
  //         resolve();
  //       });
  //     });

  //     await new Promise((resolve) => setTimeout(resolve, 300));

  //     const cloneRect = containerClone.getBoundingClientRect();
  //     const captureWidth = Math.ceil(cloneRect.width);
  //     const captureHeight = Math.ceil(cloneRect.height);

  //     const paddedWidth = Math.ceil(captureWidth + 20);
  //     const paddedHeight = Math.ceil(captureHeight + 20);

  //     const dataUrl = await toPng(containerClone, {
  //       quality: 1,
  //       pixelRatio: 2,
  //       backgroundColor: "#ffffff",
  //       width: paddedWidth,
  //       height: paddedHeight,
  //       style: {
  //         transform: "none",
  //         transformOrigin: "top left",
  //         overflow: "visible",
  //         margin: "0",
  //         padding: "10px",
  //         display: "block",
  //         width: `${paddedWidth}px`,
  //         boxSizing: "border-box",
  //       },
  //       filter: (node) => {
  //         if (node.style && node.style.display === "none") {
  //           return false;
  //         }
  //         if (node.classList && node.classList.contains("export-button")) {
  //           return false;
  //         }
  //         return true;
  //       },
  //     });

  //     document.body.removeChild(exportContainer);

  //     const link = document.createElement("a");
  //     link.download = `dealer-calls-summary-${
  //       new Date().toISOString().split("T")[0]
  //     }.png`;
  //     link.href = dataUrl;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   } catch (error) {
  //     console.error("Error exporting PNG:", error);
  //     alert("Failed to export PNG. Please try again.");
  //   } finally {
  //     setExportingPNG(false);
  //   }
  // };

  // ✅ ADD: Function to handle export PNG from modal
  const handleExportModalPNG = async () => {
    if (userCallLogsTableRef.current) {
      setExportingModalPNG(true);
      try {
        await userCallLogsTableRef.current.handleExportPNG();
      } catch (error) {
        alert("Failed to export PNG. Please try again.");
      } finally {
        setExportingModalPNG(false);
      }
    }
  };

  // ✅ ADD: Function to handle export CSV from modal
  const handleExportModalCSV = () => {
    if (userCallLogsTableRef.current) {
      setExportingModalCSV(true);
      try {
        userCallLogsTableRef.current.exportUserLogsToCSV();
      } catch (error) {
        alert("Failed to export CSV. Please try again.");
      } finally {
        setExportingModalCSV(false);
      }
    }
  };

  // Fix loadingUsers prop - handle both boolean and object cases
  const isLoading = React.useMemo(() => {
    if (loadingUsers === undefined || loadingUsers === null) {
      return false;
    }

    if (typeof loadingUsers === "boolean") {
      return loadingUsers;
    }

    if (typeof loadingUsers === "object") {
      if (loadingUsers.loading !== undefined) {
        return Boolean(loadingUsers.loading);
      }
      if (loadingUsers.isLoading !== undefined) {
        return Boolean(loadingUsers.isLoading);
      }
      return Object.keys(loadingUsers).length > 0;
    }

    return Boolean(loadingUsers);
  }, [loadingUsers]);

  // ✅ COMBINE loading states
  const isTableLoading = isLoading || isDataLoading;

  // Load dealer calls data
  useEffect(() => {
    if (dealers && dealers.length > 0 && onGetDealerCalls) {
      const callsData = {};
      dealers.forEach((dealer) => {
        const dealerId = dealer.dealerId || dealer.id;
        const calls = onGetDealerCalls(dealer);
        callsData[dealerId] = calls;
      });
      setDealerCallsData(callsData);
    }
  }, [dealers, onGetDealerCalls]);

  // ✅ UPDATED: Handle dealer click to open modal - use modalCallsDataType prop
  const handleDealerClick = useCallback(
    async (dealer) => {
      const dealerId = dealer.dealerId || dealer.id;

      if (!dealerId) {
        alert("Error: No dealer ID found");
        return;
      }

      setSelectedDealerForModal(dealer);
      setModalLoading(true);
      setIsModalOpen(true);
      setModalUserData([]);

      try {
        const userData = await onGetSortedCallLogs(
          dealerId,
          modalCallsDataType,
        );
        if (Array.isArray(userData)) {
          setModalUserData(userData);
        } else {
          setModalUserData([]);
        }
      } catch (error) {
        setModalUserData([]);
      } finally {
        setModalLoading(false);
      }
    },
    [modalCallsDataType, onGetSortedCallLogs],
  );

  // ✅ UPDATED: Close modal - reset modal state and restore body scroll
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDealerForModal(null);
    setModalLoading(false);
    setModalUserData([]);
    setExportingModalPNG(false);
    setExportingModalCSV(false);

    // Restore body scroll
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

  // Get dealer calls data with data type filtering - UPDATED to accept dataType parameter
  const getDealerCalls = (dealer, dataType = dealerSummaryCallsDataType) => {
    const dealerId = dealer.dealerId || dealer.id;
    let rawCallsData = dealerCallsData[dealerId];

    if (!rawCallsData && onGetDealerCalls) {
      rawCallsData = onGetDealerCalls(dealer);
    }

    if (!rawCallsData) {
      return {
        totalCalls: 0,
        outgoing: 0,
        incoming: 0,
        connectedCalls: 0,
        declined: 0,
        duration: 0,
        avgConnected: 0,
        callsAbove1Min: 0,
        callsAbove4Min: 0, // ✅ ADDED: Initialize with 0
      };
    }

    // Filter data based on dataType parameter
    switch (dataType) {
      case "enquiries":
        if (rawCallsData.enquiries) {
          return {
            totalCalls: rawCallsData.enquiries.totalCalls || 0,
            outgoing: rawCallsData.enquiries.outgoing || 0,
            incoming: rawCallsData.enquiries.incoming || 0,
            connectedCalls: rawCallsData.enquiries.connectedCalls || 0,
            declined: rawCallsData.enquiries.declined || 0,
            duration: rawCallsData.enquiries.duration || 0,
            avgConnected: rawCallsData.enquiries.avgConnected || 0,
            callsAbove1Min: rawCallsData.enquiries.callsAbove1Min || 0,
            // ✅ ADDED: Extract callsAbove4Min
            callsAbove4Min: rawCallsData.enquiries.callsAbove4Min || 0,
          };
        }
        break;

      case "coldcalls":
        if (rawCallsData.coldcalls) {
          return {
            totalCalls: rawCallsData.coldcalls.totalCalls || 0,
            outgoing: rawCallsData.coldcalls.outgoing || 0,
            incoming: rawCallsData.coldcalls.incoming || 0,
            connectedCalls: rawCallsData.coldcalls.connectedCalls || 0,
            declined: rawCallsData.coldcalls.declined || 0,
            duration: rawCallsData.coldcalls.duration || 0,
            avgConnected: rawCallsData.coldcalls.avgConnected || 0,
            callsAbove1Min: rawCallsData.coldcalls.callsAbove1Min || 0,
            // ✅ ADDED: Extract callsAbove4Min
            callsAbove4Min: rawCallsData.coldcalls.callsAbove4Min || 0,
          };
        }
        break;

      case "combinedCalls":
        if (rawCallsData.combinedCalls) {
          const combined = rawCallsData.combinedCalls;
          return {
            totalCalls: combined.totalCalls || 0,
            outgoing: combined.outgoing || 0,
            incoming: combined.incoming || 0,
            connectedCalls: combined.connectedCalls || 0,
            declined: combined.declined || 0,
            duration: combined.duration || 0,
            avgConnected: combined.avgConnected || 0,
            callsAbove1Min: combined.callsAbove1Min || 0,
            // ✅ ADDED: Extract callsAbove4Min
            callsAbove4Min: combined.callsAbove4Min || 0,
          };
        }
        break;

      default:
        break;
    }

    return {
      totalCalls: rawCallsData.totalCalls || 0,
      outgoing: rawCallsData.outgoing || 0,
      incoming: rawCallsData.incoming || 0,
      connectedCalls: rawCallsData.connectedCalls || 0,
      declined: rawCallsData.declined || 0,
      duration: rawCallsData.duration || 0,
      avgConnected: rawCallsData.avgConnected || 0,
      callsAbove1Min: rawCallsData.callsAbove1Min || 0,
      // ✅ ADDED: Extract callsAbove4Min from raw data
      callsAbove4Min: rawCallsData.callsAbove4Min || 0,
    };
  };

  // ✅ UPDATED: Dealer Call Summary Table Component for Modal - uses modalCallsDataType prop
  const DealerCallSummaryTable = ({
    dealer,
    dataType = modalCallsDataType,
  }) => {
    const dealerCalls = getDealerCalls(dealer, dataType);

    // ✅ UPDATED: Extract callsAbove4Min and format it
    const callsAbove4Min = dealerCalls?.callsAbove4Min || 0;
    let formattedCallsAbove4Min = callsAbove4Min;

    // If it's a string like "28 (5.18%)", extract the number part
    if (typeof callsAbove4Min === "string" && callsAbove4Min.includes("(")) {
      const match = callsAbove4Min.match(/(\d+)/);
      formattedCallsAbove4Min = match ? match[1] : 0;
    }

    const dealerSummaryData = {
      totalCalls: dealerCalls?.totalCalls || 0,
      outgoing: dealerCalls?.outgoing || 0,
      incoming: dealerCalls?.incoming || 0,
      connectedCalls: dealerCalls?.connectedCalls || 0,
      rejected: dealerCalls?.declined || 0,
      duration: dealerCalls?.duration || 0,
      avgConnected: dealerCalls?.avgConnected || 0,
      callsAbove1Min: dealerCalls?.callsAbove1Min || 0,
      // ✅ ADDED: callsAbove4Min
      callsAbove4Min: dealerCalls?.callsAbove4Min || 0,
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
          <table className="w-full border-collapse text-xs min-w-max bg-white">
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
                <th className="px-3 py-2 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                  Calls Above 1 Min
                </th>
                {/* ✅ ADDED: Calls Above 4 Min column */}
                <th className="px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">
                  Calls Above 4 Min
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
                <td className="px-3 py-2 text-center border-r border-gray-200 font-semibold text-gray-700">
                  {dealerSummaryData.callsAbove1Min || 0}
                </td>
                {/* ✅ ADDED: Calls Above 4 Min cell */}
                <td className="px-3 py-2 text-center font-semibold text-gray-700">
                  {dealerSummaryData.callsAbove4Min || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getSortedDealersForCallLogs = () => {
    const list = selectedDealers.length > 0 ? selectedDealers : dealers;

    if (!list || list.length === 0) {
      return [];
    }

    const sorted = [...list].sort((a, b) => {
      const dealerCallsA = getDealerCalls(a);
      const dealerCallsB = getDealerCalls(b);
      const totalA = dealerCallsA?.totalCalls ?? 0;
      const totalB = dealerCallsB?.totalCalls ?? 0;
      return totalB - totalA;
    });

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

      const headers = [
        "Dealer Name",
        "Total Calls",
        "Outgoing Calls",
        "Incoming Calls",
        "Connected Calls",
        "Declined Calls",
        "Total Duration",
        "Avg Duration",
        "Calls w Duration > 1m",
        "Calls w Duration > 4m", // ✅ ADDED: New column
      ];

      const csvRows = dealersData.map((dealer) => {
        const dealerCalls = getDealerCalls(dealer);

        // Format callsAbove4Min if it contains percentage
        let callsAbove4Min = dealerCalls?.callsAbove4Min || 0;
        if (
          typeof callsAbove4Min === "string" &&
          callsAbove4Min.includes("(")
        ) {
          const match = callsAbove4Min.match(/(\d+)/);
          callsAbove4Min = match ? match[1] : 0;
        }

        return [
          `"${(dealer.dealerName || "Unknown Dealer").replace(/"/g, '""')}"`,
          dealerCalls?.totalCalls || 0,
          dealerCalls?.outgoing || 0,
          dealerCalls?.incoming || 0,
          dealerCalls?.connectedCalls || 0,
          dealerCalls?.declined || 0,
          `"${dealerCalls?.duration || 0}"`,
          dealerCalls?.avgConnected || 0,
          dealerCalls?.callsAbove1Min || 0,
          dealerCalls?.callsAbove4Min, // ✅ ADDED: New column data
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
      console.error("❌ Error exporting CSV:", error);
      alert("Error exporting data. Please check console for details.");
    }
  };

  const sortedDealers = getSortedDealersForCallLogs();
  const displayedDealers = sortedDealers.slice(0, tableLength);

  return (
    <div className="table-section bg-white rounded-lg shadow-sm border border-gray-200 mx-auto w-full overflow-hidden">
      {/* Compact Table Header */}
      <div className="table-header px-3 py-2 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="table-title text-xs font-bold text-gray-900">
            Dealer Summary — Calls
          </h2>
        </div>

        {/* ✅ UPDATED: Use combined loading state */}
        {!isTableLoading && (
          <div className="table-actions flex items-center gap-2 w-full sm:w-auto">
            <div id="tabs" className="flex gap-1 flex-wrap">
              {/* Compact Data Type Dropdown - Controls MAIN TABLE filter */}
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
              <div className="flex gap-2">
                {/* PNG Export Button */}
                <button
                  className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1e27a3] flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleExportPNG}
                  disabled={exportingPNG}
                >
                  {exportingPNG ? (
                    <i className="fas fa-spinner fa-spin text-[10px]"></i>
                  ) : (
                    <i className="fas fa-image text-[10px]"></i>
                  )}
                  {exportingPNG ? "Exporting..." : "Export PNG"}
                </button>
                {/* CSV Export Button */}
                <button
                  className="btn-export px-3 py-1 bg-[#222fb9] cursor-pointer border-gray-300 rounded text-xs font-medium text-white hover:bg-[#1a259c] flex items-center gap-1 transition-colors"
                  onClick={exportToCSV}
                >
                  <i className="fas fa-download text-[10px]"></i>
                  Export CSV
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ UPDATED: Main Content Area with proper loading states */}
      {isTableLoading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#222fb9] mb-4"></div>
          <div className="text-gray-500 text-sm">Loading call logs data...</div>
        </div>
      ) : dealerSummaryCallsViewType === "table" ? (
        <div className="table-container p-2" ref={tableContainerRef}>
          {!dealers || dealers.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-gray-500 text-sm">
                {!dealers
                  ? "Loading dealers..."
                  : dealers.length === 0 && isTableLoading === false
                    ? "Loading dealers"
                    : "Loading dealers..."}
              </div>
            </div>
          ) : (
            <>
              <div ref={tableRef} className="table-scroll overflow-auto">
                <table className="data-table calls-table w-full compact-table min-w-[900px] bg-white">
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
                      {/* ✅ ADDED: Calls w Duration > 4m column */}
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-900 border-r border-gray-200 whitespace-nowrap">
                        Calls w Duration &gt; 4m
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedDealers.map((dealer, index) => {
                      const dealerId = dealer.dealerId || dealer.id;
                      const dealerCalls = getDealerCalls(dealer);

                      // Format callsAbove4Min for display
                      let callsAbove4Min = dealerCalls.callsAbove4Min || 0;
                      if (
                        typeof callsAbove4Min === "string" &&
                        callsAbove4Min.includes("(")
                      ) {
                        const match = callsAbove4Min.match(/(\d+)/);
                        callsAbove4Min = match ? match[1] : 0;
                      }

                      return (
                        <tr
                          key={dealerId}
                          className={`table-row hover:bg-blue-50 transition-colors dealer-row ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          {/* Dealer Name Column - Clickable for Modal */}
                          <td className="sticky left-0 bg-inherit z-10 border-r border-gray-200 px-3 py-2 text-left text-gray-900 min-w-[100px]">
                            <button
                              className="dealer-name-btn flex items-center gap-1 cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
                              onClick={() => handleDealerClick(dealer)}
                            >
                              <span className="font-semibold text-xs truncate hover:underline">
                                {dealer.dealerName}
                              </span>
                              <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
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

                          {/* Other table cells */}
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
                                {dealerCalls.connectedCalls}
                              </span>
                            </div>
                          </td>
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
                                {dealerCalls.avgConnected}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                            <div className="flex items-center justify-center text-gray-700">
                              <span className="text-xs font-semibold">
                                {dealerCalls.callsAbove1Min}
                              </span>
                            </div>
                          </td>
                          {/* ✅ ADDED: Calls w Duration > 4m cell */}
                          <td className="px-2 py-2 text-center border-r border-gray-200 whitespace-nowrap">
                            <div className="flex items-center justify-center text-gray-700">
                              <span className="text-xs font-semibold">
                                {callsAbove4Min}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Compact Show More/Less buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
                <div className="text-xs font-semibold text-gray-500">
                  Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
                  {sortedDealers.length} dealers
                </div>
                <div className="flex gap-1 self-end sm:self-auto">
                  {tableLength < sortedDealers.length && (
                    <button
                      className="btn btn-primary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
                      onClick={() => setTableLength((prev) => prev + 10)}
                    >
                      <i className="fas fa-chevron-down text-xs"></i>
                      Show More
                    </button>
                  )}
                  {tableLength > 10 && sortedDealers.length > 10 && (
                    <button
                      className="btn btn-secondary px-2 py-1 cursor-pointer bg-[#222fb9] text-white rounded-sm hover:bg-gray-300 transition-colors font-bold flex items-center gap-1 text-xs"
                      onClick={() => setTableLength(10)}
                    >
                      <i className="fas fa-chevron-up text-xs"></i>
                      Show Less
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-2">
          <BarChart
            data={[]}
            title="Dealer-wise Calls Analysis"
            height={500}
            showLegend={true}
          />
        </div>
      )}

      {/* Popup Modal for User Call Logs */}
      {isModalOpen && selectedDealerForModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - MATCHING Dealer Summary modal structure */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
              {/* Left side: Title and filters (on laptop) */}
              <div className="hidden md:flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                  User Call Logs — {selectedDealerForModal.dealerName}
                </h2>
                <div className="flex items-center gap-2">
                  {/* ✅ FIXED: Modal Filter dropdown */}
                  <select
                    value={modalCallsDataType}
                    onChange={(e) => {
                      onSetModalCallsDataType(e.target.value);
                    }}
                    className="px-3 py-1.5 cursor-pointer text-sm font-medium border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent transition-colors"
                  >
                    <option value="enquiries">Enquiries</option>
                    <option value="coldcalls">Cold Calls</option>
                    <option value="combinedCalls">Both</option>
                  </select>
                </div>
              </div>

              {/* Mobile: Top header with title and close cross */}
              <div className="md:hidden flex items-center justify-between w-full">
                <h2 className="text-lg font-bold text-gray-800 leading-tight">
                  User Call Logs
                  <br />
                  <span className="text-sm font-normal">
                    {selectedDealerForModal.dealerName}
                  </span>
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* ✅ ADDED: Right side: Export buttons and Close button for laptop */}
              <div className="hidden md:flex items-center gap-2">
                {/* ✅ ADD: Export PNG button */}
                <button
                  onClick={handleExportModalPNG}
                  className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                  disabled={exportingModalPNG}
                >
                  {exportingModalPNG ? (
                    <i className="fas fa-spinner fa-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-image text-xs"></i>
                  )}
                  {exportingModalPNG ? "Exporting..." : "Export PNG"}
                </button>

                {/* ✅ ADD: Export CSV button */}
                <button
                  onClick={handleExportModalCSV}
                  className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                  disabled={exportingModalCSV}
                >
                  {exportingModalCSV ? (
                    <i className="fas fa-spinner fa-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-download text-xs"></i>
                  )}
                  {exportingModalCSV ? "Exporting..." : "Export CSV"}
                </button>

                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* MOBILE ONLY: Additional row for mobile export buttons */}
            <div className="md:hidden mb-4 flex gap-2 justify-end">
              <button
                onClick={handleExportModalPNG}
                className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
                disabled={exportingModalPNG}
              >
                {exportingModalPNG ? (
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                ) : (
                  <i className="fas fa-image text-xs"></i>
                )}
                {exportingModalPNG ? "Exporting..." : "Export PNG"}
              </button>

              <button
                onClick={handleExportModalCSV}
                className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
                disabled={exportingModalCSV}
              >
                {exportingModalCSV ? (
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                ) : (
                  <i className="fas fa-download text-xs"></i>
                )}
                {exportingModalCSV ? "Exporting..." : "Export CSV"}
              </button>
            </div>

            {/* Modal Body - REMOVED DealerCallSummaryTable from here to avoid duplication */}
            <div ref={modalContentRef} className="flex-1 overflow-auto min-h-0">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#222fb9] mb-4"></div>
                  <div className="text-gray-600 text-lg">
                    Loading user call data for{" "}
                    {selectedDealerForModal.dealerName}...
                  </div>
                </div>
              ) : (
                <UserCallLogsSubTable
                  ref={userCallLogsTableRef}
                  dealer={selectedDealerForModal}
                  userCallLogs={modalUserData}
                  onGetSortedCallLogs={onGetSortedCallLogs}
                  isModal={true}
                  skipAutoLoad={true}
                  dealerSummaryCallsDataType={modalCallsDataType}
                  onDataTypeChange={onSetModalCallsDataType}
                  dealerSummaryRow={
                    <DealerCallSummaryTable
                      dealer={selectedDealerForModal}
                      dataType={modalCallsDataType}
                    />
                  }
                />
              )}
            </div>

            {/* Modal Footer - MATCHING Dealer Summary modal structure */}
            <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
              <button
                onClick={handleCloseModal}
                className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallLogsTable;
