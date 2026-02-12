// import React, { useState, useEffect, useRef } from "react";
// import { toPng } from "html-to-image"; // ✅ ADD: Import for PNG export
// // import DealerUserDetails from "./DealerUserDetails"; // Assuming this is the correct import path
// import { forwardRef } from "react";

// import { useImperativeHandle } from "react";

// const DealerSummaryTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   dealerUsers,
//   loadingUsers,
//   sortColumn,
//   sortDirection,
//   onSortData,
//   onGetSortedUsers,
//   onExportCSV,
//   onToggleSummaryRow,
//   selectedFilter,
//   onFilterChange,
//   onRefreshDashboardData,
//   onFetchDealerUsers,
//   customStartDate,
//   customEndDate,
// }) => {
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [modalDealerData, setModalDealerData] = useState(null);
//   const [isDealersLoading, setIsDealersLoading] = useState(true);
//   const [currentModalUsers, setCurrentModalUsers] = useState([]);
//   const [modalCustomStartDate, setModalCustomStartDate] =
//     useState(customStartDate);
//   // ✅ ADD: State for export loading
//   const [exportingPNG, setExportingPNG] = useState(false);
//   const [exportingUsersPNG, setExportingUsersPNG] = useState(false);
//   const [modalCustomEndDate, setModalCustomEndDate] = useState(customEndDate);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   // ✅ ADD: State for overdue modals
//   const [showOverdueModal, setShowOverdueModal] = useState(false);
//   const [overdueModalType, setOverdueModalType] = useState(null); // 'followups' or 'testdrives'
//   const [overdueModalData, setOverdueModalData] = useState(null);
//   const [overdueModalLoading, setOverdueModalLoading] = useState(false);

//   // ✅ ADD: Ref for main table PNG export
//   const mainTableRef = useRef(null);
//   // ✅ ADD: Ref for DealerUserDetails component
//   const dealerUserDetailsRef = useRef(null);

//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) return;

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       // ✅ FIXED: Create a temporary container for export WITH EXACT SAME SIZE
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

//       // ✅ FIXED: Create a clone of the ENTIRE table section, not just the table
//       const clone = mainTableRef.current.cloneNode(true);

//       // ✅ FIXED: Get the main table container from clone
//       const tableContainer = clone.querySelector(".table-container");
//       const scrollContainer = clone.querySelector(".table-scroll");
//       const table = clone.querySelector(".data-table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");
//       const expandButtons = clone.querySelectorAll(".expand-btn");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       // ✅ FIXED: Make the export container EXACTLY the width of the original table
//       const originalRect = mainTableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       // ✅ FIXED: In the clone, make everything visible and full width
//       if (tableContainer) {
//         tableContainer.style.width = "100%";
//         tableContainer.style.overflow = "visible";
//         tableContainer.style.padding = "0";
//       }

//       // ✅ FIXED: Remove ALL scroll restrictions in the clone
//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.height = "auto";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "static";
//         scrollContainer.style.width = "100%";
//       }

//       // ✅ FIXED: Set table to take full available width
//       if (table) {
//         table.style.width = "100%";
//         table.style.minWidth = "2100px"; // Match original min-width
//         table.style.position = "static";
//         table.style.tableLayout = "auto"; // Allow natural column widths
//         table.style.display = "table";
//       }

//       // ✅ FIXED: Remove sticky positioning but maintain header
//       if (tableHead) {
//         tableHead.style.position = "static";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       // ✅ FIXED: Remove sticky positioning from cells
//       stickyCells.forEach((cell) => {
//         cell.style.position = "static";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//         cell.style.backgroundColor = "#ffffff";
//       });

//       // ✅ FIXED: Clean up expand buttons - make them plain text
//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         const icon = btn.querySelector("i");

//         // Replace button with just the dealer name text
//         if (span) {
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         } else if (icon) {
//           icon.style.display = "none";
//         }
//       });

//       // ✅ FIXED: Remove ALL export buttons completely
//       const exportButtons = clone.querySelectorAll(".btn-export");
//       exportButtons.forEach((btn) => {
//         btn.remove();
//       });

//       // ✅ FIXED: Remove all other interactive elements
//       const interactiveElements = clone.querySelectorAll(
//         "button, select, input, .fa-spinner",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       // ✅ FIXED: Add clone to export container
//       exportContainer.appendChild(clone);

//       // ✅ FIXED: Add export container to body
//       document.body.appendChild(exportContainer);

//       // Force a reflow and wait for rendering
//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           clone.offsetHeight; // Trigger reflow on entire clone
//           resolve();
//         });
//       });

//       // Wait for layout to settle
//       await new Promise((resolve) => setTimeout(resolve, 500));

//       // ✅ FIXED: Get dimensions from the CLONE (not the table alone)
//       const cloneRect = clone.getBoundingClientRect();
//       const captureWidth = Math.max(cloneRect.width, 2100); // Ensure minimum width
//       const captureHeight = cloneRect.height;

//       console.log("Clone dimensions:", captureWidth, "x", captureHeight);

//       // ✅ FIXED: Add minimal padding only
//       const paddedWidth = Math.ceil(captureWidth + 20); // Small padding
//       const paddedHeight = Math.ceil(captureHeight + 20);

//       // ✅ FIXED: Capture the ENTIRE clone (not just table)
//       const dataUrl = await toPng(clone, {
//         quality: 1.0,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         width: paddedWidth,
//         height: paddedHeight,
//         style: {
//           transform: "none",
//           transformOrigin: "top left",
//           overflow: "visible",
//           margin: "0",
//           padding: "10px", // Small padding for the image
//           display: "block",
//           width: `${paddedWidth}px`,
//           boxSizing: "border-box",
//         },
//         filter: (node) => {
//           // Exclude only hidden elements
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("fa-spinner"))
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       // ✅ FIXED: Remove the export container
//       document.body.removeChild(exportContainer);

//       // Create and download the PNG
//       const link = document.createElement("a");
//       link.download = `dealer-summary-${selectedFilter || "all"}-${
//         new Date().toISOString().split("T")[0]
//       }.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       if (button && originalHTML) {
//         button.innerHTML = originalHTML;
//         button.disabled = false;
//       }
//     } catch (error) {
//       console.error("❌ Error exporting main table PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   // ✅ ADD: Function to handle export PNG from modal (dealer users)
//   const handleExportDealerUsersPNG = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.handleExportPNG();
//     }
//   };

//   // ✅ ADD: Function to handle export CSV from modal (dealer users)
//   const handleExportDealerUsersCSV = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.exportUsersToCSV();
//     }
//   };

//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

//   // ✅ ADDED: Detect when dealers are loaded
//   useEffect(() => {
//     if (dealers !== undefined) {
//       setIsDealersLoading(false);
//     }
//   }, [dealers]);

//   // ✅ ADD: Function to update current modal users
//   const updateCurrentModalUsers = (users) => {
//     if (Array.isArray(users)) {
//       setCurrentModalUsers(users);
//     }
//   };

//   // Sync modal filter with parent filter when modal opens
//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalDealerData(null);
//       setModalCustomStartDate(customStartDate);
//       setModalCustomEndDate(customEndDate);
//       setCurrentModalUsers([]);
//     }
//   }, [showUserModal, selectedFilter, customStartDate, customEndDate]);

//   // ✅ ADD: Check if modal dates are valid
//   const areModalDatesValid = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       return new Date(modalCustomStartDate) <= new Date(modalCustomEndDate);
//     }
//     return false;
//   };

//   const handleModalFilterChange = async (
//     filterValue,
//     applyCustomDates = false,
//   ) => {
//     if (!selectedDealer) {
//       return;
//     }

//     if (filterValue === "CUSTOM" && !applyCustomDates) {
//       setModalFilter("CUSTOM");
//       return;
//     }

//     if (filterValue === "CUSTOM" && applyCustomDates) {
//       if (!modalCustomStartDate || !modalCustomEndDate) {
//         // Use toast notification
//         setToastMessage("Please select both start and end dates");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }

//       const isValid = areModalDatesValid();
//       if (!isValid) {
//         setToastMessage("End date cannot be before start date");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     if (onFetchDealerUsers) {
//       try {
//         const freshDealerData = await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           filterValue === "CUSTOM" ? modalCustomStartDate : undefined,
//           filterValue === "CUSTOM" ? modalCustomEndDate : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//           if (freshDealerData.users && Array.isArray(freshDealerData.users)) {
//             setCurrentModalUsers(freshDealerData.users);
//           }
//         } else {
//           setModalDealerData(null);
//           setCurrentModalUsers([]);
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch dealer data:", error);
//         setModalDealerData(null);
//         setCurrentModalUsers([]);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }
//   };

//   const handleApplyCustomDates = () => {
//     if (!modalCustomStartDate || !modalCustomEndDate) {
//       setToastMessage("Please select both start and end dates");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     const isValid = areModalDatesValid();
//     if (!isValid) {
//       setToastMessage("End date cannot be before start date");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     handleModalFilterChange("CUSTOM", true);
//   };

//   const handleResetCustomDates = () => {
//     setModalFilter(selectedFilter);
//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(customStartDate || "");
//       setModalCustomEndDate(customEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   const handleDealerClick = async (dealer) => {
//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalDealerData(null);
//     setCurrentModalUsers([]);
//     setModalFilter(selectedFilter);
//     setModalCustomStartDate(customStartDate);
//     setModalCustomEndDate(customEndDate);

//     setIsLoadingDealerData(true);

//     if (onFetchDealerUsers) {
//       try {
//         const freshDealerData = await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           selectedFilter === "CUSTOM" ? customStartDate : undefined,
//           selectedFilter === "CUSTOM" ? customEndDate : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//           if (freshDealerData.users && Array.isArray(freshDealerData.users)) {
//             setCurrentModalUsers(freshDealerData.users);
//           }
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch initial dealer data:", error);
//         setCurrentModalUsers([]);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }

//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   // ✅ ADD: Function to handle overdue value click
//   const handleOverdueClick = async (dealer, type) => {
//     // type can be 'followups' or 'testdrives'
//     setOverdueModalType(type);
//     setOverdueModalData(null);
//     setOverdueModalLoading(true);
//     setShowOverdueModal(true);

//     // Here you would typically fetch the detailed overdue data
//     // For now, we'll create mock data based on the dealer
//     setTimeout(() => {
//       const mockData = {
//         dealerName: dealer.dealerName || dealer.name,
//         type: type,
//         total:
//           type === "followups"
//             ? dealer.closedFollowUps || 0
//             : dealer.closedTestDrives || dealer.saTestDrives || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   assignedTo: "Sales Rep 1",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   assignedTo: "Sales Rep 2",
//                 },
//                 {
//                   id: 3,
//                   customerName: "Bob Johnson",
//                   date: "2024-01-13",
//                   reason: "Waiting for feedback",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   assignedTo: "Test Drive Manager",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ],
//       };
//       setOverdueModalData(mockData);
//       setOverdueModalLoading(false);
//     }, 500);
//   };

//   // ✅ ADD: Function to get raw value without brackets
//   const getRawValue = (dealer, fieldNames) => {
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         return value;
//       }
//     }
//     return 0;
//   };

//   const getCurrentDealerData = () => {
//     if (modalDealerData) {
//       return modalDealerData;
//     }

//     if (modalFilter !== selectedFilter && selectedDealer) {
//       return selectedDealer;
//     }

//     if (selectedDealer) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;

//       let freshDealer = null;
//       if (selectedDealers.length > 0) {
//         freshDealer = selectedDealers.find(
//           (d) => (d.dealerId || d.id) === dealerId,
//         );
//       }

//       if (!freshDealer) {
//         freshDealer = dealers.find((d) => (d.dealerId || d.id) === dealerId);
//       }

//       if (!freshDealer) {
//         freshDealer = selectedDealer;
//       }

//       return freshDealer;
//     }

//     return selectedDealer;
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setModalDealerData(null);
//     setCurrentModalUsers([]);
//     setIsLoadingDealerData(false);
//     setShowToast(false);
//   };

//   // ✅ ADD: Function to close overdue modal
//   const closeOverdueModal = () => {
//     setShowOverdueModal(false);
//     setOverdueModalType(null);
//     setOverdueModalData(null);
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = a[sortColumn] ?? 0;
//       const valB = b[sortColumn] ?? 0;
//       return sortDirection === "asc" ? valA - valB : valB - valA;
//     });
//   };

//   const SortIcon = ({ column }) => (
//     <span className="sort-arrows inline-flex flex-col ml-1">
//       <span
//         className={`arrow-up text-[10px] ${
//           sortColumn === column && sortDirection === "asc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▲
//       </span>
//       <span
//         className={`arrow-down text-[10px] ${
//           sortColumn === column && sortDirection === "desc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▼
//       </span>
//     </span>
//   );

//   // Helper function to format numbers
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return "0";
//     return Number(num).toLocaleString("en-IN");
//   };

//   // ✅ Get dealer value with web values in brackets with ORANGE COLOR for brackets only
//   const getDealerValue = (
//     dealer,
//     fieldNames,
//     webFieldNames = [],
//     clickable = false,
//     onClick = null,
//   ) => {
//     let mainValue = "0";
//     let webValue = null;

//     // Get main value
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         mainValue = formatNumber(value);
//         break;
//       }
//     }

//     // Get web value if provided - FIXED to show even when 0
//     if (webFieldNames.length > 0) {
//       for (let field of webFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           webValue = formatNumber(value);
//           break;
//         }
//       }
//     }

//     // Return formatted string with web value in brackets with ORANGE COLOR
//     if (webValue !== null) {
//       return (
//         <div className="flex items-center justify-end">
//           {clickable ? (
//             <button
//               className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (onClick) onClick();
//               }}
//               title={`Click to view ${
//                 fieldNames[0].includes("Follow")
//                   ? "overdue follow-ups"
//                   : "overdue test drives"
//               }`}
//             >
//               {mainValue}
//             </button>
//           ) : (
//             <span>{mainValue}</span>
//           )}
//           <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
//             ({webValue})
//           </span>
//         </div>
//       );
//     }

//     return clickable ? (
//       <button
//         className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer text-right w-full"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (onClick) onClick();
//         }}
//         title={`Click to view ${
//           fieldNames[0].includes("Follow")
//             ? "overdue follow-ups"
//             : "overdue test drives"
//         }`}
//       >
//         {mainValue}
//       </button>
//     ) : (
//       <div className="text-right">{mainValue}</div>
//     );
//   };

//   // ✅ Get raw dealer value (without brackets) for CSV export
//   const getRawDealerValue = (dealer, fieldNames) => {
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         return value;
//       }
//     }
//     return 0;
//   };

//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     const headers = [
//       "Dealer Name",
//       "Total Users",
//       "Registered Users",
//       "Active Users",
//       "Created Enquiries",
//       "Digital",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Total Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Opportunities Converted",
//     ];

//     // Helper function to get formatted value with web values in brackets (same as UI)
//     const getFormattedValueForExport = (
//       dealer,
//       mainFieldNames,
//       webFieldNames = [],
//     ) => {
//       let mainValue = 0;
//       let webValue = null;

//       // Get main value
//       for (let field of mainFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           mainValue = value;
//           break;
//         }
//       }

//       // Get web value if provided
//       if (webFieldNames.length > 0) {
//         for (let field of webFieldNames) {
//           const value = field
//             .split(".")
//             .reduce((obj, key) => obj?.[key], dealer);
//           if (value !== undefined && value !== null) {
//             webValue = value;
//             break;
//           }
//         }
//       }

//       // Return formatted string with web value in brackets (same as UI)
//       if (webValue !== null) {
//         return `${formatNumber(mainValue)} (${formatNumber(webValue)})`;
//       }

//       return formatNumber(mainValue);
//     };

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) => {
//         const row = [
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
//           getRawDealerValue(dealer, ["totalUsers"]),
//           getRawDealerValue(dealer, ["registerUsers"]),
//           getRawDealerValue(dealer, ["activeUsers"]),
//           getRawDealerValue(dealer, ["saLeads"]),
//           getRawDealerValue(dealer, ["manuallyEnteredLeads"]),
//           // Follow-ups with web values in same column
//           `"${getFormattedValueForExport(
//             dealer,
//             ["saFollowUps"],
//             ["webleadsFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedFollowUps"],
//             ["webCompletedFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["openFollowUps"],
//             ["webUpcomingFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedFollowUps"],
//             ["webOverdueFollowUps"],
//           )}"`,
//           // Test Drives
//           getRawDealerValue(dealer, ["totalTestDrives", "saTestDrives"]),
//           // Test Drives with web values in same column
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedTestDrives"],
//             ["webCompletedTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["upcomingTestDrives"],
//             ["webUpcomingTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedTestDrives"],
//             ["webOverdueTestDrives"],
//           )}"`,
//           getRawDealerValue(dealer, ["opportunitiesConverted"]),
//         ];

//         return row.join(",");
//       }),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `dealer-summary-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getFilterLabel = (filter) => {
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
//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
//         {/* Table Header */}
//         <div className="table-header px-4 py-1 border-b border-gray-200 flex flex-col sm:flex-row text-xs items-start justify-between gap-1 sm:gap-0 bg-gray-50 relative z-30">
//           <div>
//             <h2 className="table-title text-xs font-bold text-gray-900">
//               Dealer Summary — Engagement
//             </h2>
//           </div>
//           <div className="flex gap-2 self-end sm:self-auto">
//             {/* In Main Table Header */}
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleExportMainTablePNG}
//               disabled={isDealersLoading || exportingPNG}
//             >
//               {exportingPNG ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </>
//               )}
//             </button>
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm"
//               onClick={handleExportCSV}
//               disabled={isDealersLoading}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//           </div>
//         </div>

//         {/* ✅ ADDED: Ref for main table PNG export */}
//         <div ref={mainTableRef} className="table-container p-0 relative z-20">
//           {isDealersLoading ? (
//             <div className="flex flex-col items-center justify-center p-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//               <div className="text-gray-500 text-sm">
//                 Loading dealers data...
//               </div>
//             </div>
//           ) : !dealers || dealers.length === 0 ? (
//             <div className="flex justify-center items-center p-12">
//               <div className="text-gray-500 text-sm">
//                 {!dealers ? "Loading dealers..." : "No dealers found"}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div
//                 className="table-scroll overflow-x-auto relative z-10"
//                 style={{ maxHeight: "600px", overflowY: "auto" }}
//               >
//                 <table className="data-table w-full border-collapse text-xs min-w-[2100px] relative z-10">
//                   {/* Table Header */}
//                   <thead className="table-thead bg-gray-50 sticky top-0 z-50">
//                     <tr className="text-xs">
//                       <th
//                         rowSpan={2}
//                         className="sticky left-0 bg-gray-50 z-60 border-r border-gray-300 px-1 py-2 font-semibold text-gray-900 text-left min-w-[20px] w-[20px]"
//                       >
//                         Dealer
//                       </th>
//                       <th
//                         colSpan={3}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
//                       >
//                         Users
//                       </th>
//                       <th
//                         colSpan={2}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-green-50"
//                       >
//                         Enquiries
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50"
//                       >
//                         Follow-ups
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-orange-50"
//                       >
//                         Test Drives
//                       </th>
//                       <th
//                         rowSpan={2}
//                         className="px-2 py-2 text-center font-semibold text-gray-700 bg-red-50"
//                       >
//                         Opportunities converted
//                       </th>
//                     </tr>

//                     <tr className="text-xs">
//                       {/* Users Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("registerUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Registered
//                           {hasMultipleDealers && (
//                             <SortIcon column="registerUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("activeUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Active
//                           {hasMultipleDealers && (
//                             <SortIcon column="activeUsers" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Leads Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saLeads")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && <SortIcon column="saLeads" />}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("manuallyEnteredLeads")
//                         }
//                       >
//                         <div className="flex items-center justify-center gap-1">
//                           <span>Digital</span>
//                           {hasMultipleDealers && (
//                             <SortIcon column="manuallyEnteredLeads" />
//                           )}
//                         </div>
//                       </th>

//                       {/* Followups Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && (
//                             <SortIcon column="saFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("completedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("openFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="openFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedFollowUps" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Test Drives Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("completedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("upcomingTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="upcomingTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                     </tr>
//                   </thead>

//                   {/* ✅ FIXED: Table Body with blue hover effect */}
//                   <tbody className="bg-white text-xs relative z-10">
//                     {getSortedDealersForSummary()
//                       .slice(0, tableLength)
//                       .map((dealer, index) => (
//                         <tr
//                           key={dealer.dealerId || dealer.id}
//                           className={`group transition-colors relative ${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } hover:bg-blue-50`}
//                         >
//                           <td className="sticky left-0 bg-inherit z-40 border-r border-gray-300 px-3 py-2 text-left text-xs text-gray-900 min-w-[140px] group-hover:bg-blue-50">
//                             {" "}
//                             <button
//                               className="expand-btn flex items-center cursor-pointer gap-2 text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                               onClick={() => handleDealerClick(dealer)}
//                             >
//                               <span className="font-semibold truncate group-hover:underline">
//                                 {dealer.dealerName || dealer.name}
//                               </span>
//                               <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                             </button>
//                           </td>
//                           {/* Users Data - RIGHT ALIGNED */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["totalUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["registerUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["activeUsers"])}
//                           </td>

//                           {/* Leads Data - RIGHT ALIGNED */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["saLeads"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["manuallyEnteredLeads"])}
//                           </td>

//                           {/* Follow-ups Data - WEB VALUES WITH ORANGE COLOR FOR BRACKETS ONLY - RIGHT ALIGNED */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["saFollowUps"],
//                               ["webleadsFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedFollowUps"],
//                               ["webCompletedFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["openFollowUps"],
//                               ["webUpcomingFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedFollowUps"],
//                               ["webOverdueFollowUps"],
//                               true,
//                               () => handleOverdueClick(dealer, "followups"),
//                             )}
//                           </td>

//                           {/* Test Drives Data - WEB VALUES WITH ORANGE COLOR FOR BRACKETS ONLY - RIGHT ALIGNED */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, [
//                               "totalTestDrives",
//                               "saTestDrives",
//                             ])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedTestDrives"],
//                               ["webCompletedTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["upcomingTestDrives"],
//                               ["webUpcomingTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedTestDrives"],
//                               ["webOverdueTestDrives"],
//                               true,
//                               () => handleOverdueClick(dealer, "testdrives"),
//                             )}
//                           </td>

//                           {/* Opportunities Data - RIGHT ALIGNED */}
//                           <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["opportunitiesConverted"])}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Show More/Less Buttons */}
//               {!isDealersLoading &&
//                 (selectedDealers.length > 0
//                   ? selectedDealers.length
//                   : dealers.length) > 10 && (
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-2 gap-2 sm:gap-0 relative z-30">
//                     <div className="text-xs text-gray-500">
//                       Showing{" "}
//                       {formatNumber(
//                         Math.min(
//                           tableLength,
//                           selectedDealers.length > 0
//                             ? selectedDealers.length
//                             : dealers.length,
//                         ),
//                       )}{" "}
//                       of{" "}
//                       {formatNumber(
//                         selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length,
//                       )}{" "}
//                       dealers
//                     </div>
//                     <div className="flex gap-1 self-end sm:self-auto">
//                       {tableLength <
//                         (selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length) && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength((prev) => prev + 10)}
//                         >
//                           <i className="fas fa-chevron-down text-[10px]"></i>
//                           Show More
//                         </button>
//                       )}
//                       {tableLength > 10 && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength(10)}
//                         >
//                           <i className="fas fa-chevron-up text-[10px]"></i>
//                           Show Less
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* ✅ ADDED: Overdue Details Modal */}
//       {showOverdueModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeOverdueModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {overdueModalType === "followups"
//                   ? "Overdue Follow-ups"
//                   : "Overdue Test Drives"}{" "}
//                 - {overdueModalData?.dealerName || "Dealer"}
//                 <span className="text-sm font-normal text-gray-600 ml-2">
//                   ({formatNumber(overdueModalData?.total || 0)} total)
//                 </span>
//               </h2>
//               <button
//                 onClick={closeOverdueModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-auto">
//               {overdueModalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-12">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-500 text-sm">
//                     Loading overdue details...
//                   </div>
//                 </div>
//               ) : overdueModalData?.items &&
//                 overdueModalData.items.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100 border-b border-gray-300">
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           ID
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Customer Name
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Date
//                         </th>
//                         {overdueModalType === "followups" ? (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Reason
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         ) : (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Vehicle
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {overdueModalData.items.map((item, index) => (
//                         <tr
//                           key={item.id}
//                           className={`${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } border-b border-gray-200 hover:bg-blue-50`}
//                         >
//                           <td className="px-4 py-2">{item.id}</td>
//                           <td className="px-4 py-2 font-medium">
//                             {item.customerName}
//                           </td>
//                           <td className="px-4 py-2">{item.date}</td>
//                           {overdueModalType === "followups" ? (
//                             <>
//                               <td className="px-4 py-2">{item.reason}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           ) : (
//                             <>
//                               <td className="px-4 py-2">{item.vehicle}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex justify-center items-center p-12">
//                   <div className="text-gray-500 text-sm">
//                     No overdue{" "}
//                     {overdueModalType === "followups"
//                       ? "follow-ups"
//                       : "test drives"}{" "}
//                     found.
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeOverdueModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* USER DETAILS MODEL USER POPUP CARD */}
//       {showUserModal && selectedDealer && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           {/* Toast Notification */}
//           {showToast && (
//             <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
//               <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//                 <i className="fas fa-exclamation-circle"></i>
//                 <span>{toastMessage}</span>
//               </div>
//             </div>
//           )}

//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - Updated layout */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               {/* Left side: Title and filters (on laptop) */}
//               <div className="hidden md:flex items-center gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {/* User Details -{" "} */}
//                   {selectedDealer.dealerName || selectedDealer.name}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                     {formatNumber(
//                       currentModalUsers.length > 0
//                         ? currentModalUsers.length
//                         : onGetSortedUsers(
//                             selectedDealer.dealerId || selectedDealer.id,
//                           )?.length || 0,
//                     )}{" "}
//                     users
//                   </span>

//                   {/* Time Filter Dropdown */}
//                   <select
//                     value={modalFilter}
//                     onChange={(e) => handleModalFilterChange(e.target.value)}
//                     className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none min-w-[150px] text-xs"
//                     disabled={isLoadingDealerData}
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

//                   {/* Custom date inputs for laptop */}
//                   {modalFilter === "CUSTOM" && (
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
//                         <input
//                           type="date"
//                           value={modalCustomStartDate || ""}
//                           onChange={(e) => {
//                             setModalCustomStartDate(e.target.value);
//                           }}
//                           className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                           disabled={isLoadingDealerData}
//                         />
//                         <span className="text-gray-400">-</span>
//                         <input
//                           type="date"
//                           value={modalCustomEndDate || ""}
//                           onChange={(e) => {
//                             setModalCustomEndDate(e.target.value);
//                           }}
//                           className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                           disabled={isLoadingDealerData}
//                         />
//                       </div>

//                       {/* ✅ CHANGED: Apply button is ALWAYS ENABLED */}
//                       <button
//                         onClick={handleApplyCustomDates}
//                         disabled={isLoadingDealerData}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
//                       >
//                         Apply
//                       </button>

//                       <button
//                         onClick={handleResetCustomDates}
//                         disabled={isLoadingDealerData}
//                         className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap"
//                       >
//                         Reset
//                       </button>
//                     </div>
//                   )}

//                   {/* Add loading indicator */}
//                   {(loadingUsers[
//                     selectedDealer.dealerId || selectedDealer.id
//                   ] ||
//                     isLoadingDealerData) && (
//                     <span className="text-xs text-blue-600 whitespace-nowrap">
//                       <i className="fas fa-spinner fa-spin mr-1"></i>
//                       Updating...
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Mobile: Top header with title and close cross */}
//               <div className="md:hidden flex items-center justify-between w-full">
//                 <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                   User Details
//                   <br />
//                   <span className="text-sm font-normal">
//                     {selectedDealer.dealerName || selectedDealer.name}
//                   </span>
//                 </h2>
//                 {/* Phone screen cross - on right end top */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>

//               {/* ✅ ADDED: Right side: Export buttons and Cross for laptop */}
//               <div className="hidden md:flex items-center gap-2">
//                 {/* ✅ ADD: Export PNG button */}
//                 <button
//                   onClick={handleExportDealerUsersPNG}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </button>

//                 {/* ✅ ADD: Export CSV button */}
//                 <button
//                   onClick={handleExportDealerUsersCSV}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   Export CSV
//                 </button>

//                 {/* Laptop screen cross - on right end top */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//             </div>

//             {/* MOBILE ONLY: Additional row for mobile controls */}
//             <div className="md:hidden mb-4 space-y-3">
//               {/* Mobile filters */}
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
//                   {formatNumber(
//                     currentModalUsers.length > 0
//                       ? currentModalUsers.length
//                       : onGetSortedUsers(
//                           selectedDealer.dealerId || selectedDealer.id,
//                         )?.length || 0,
//                   )}{" "}
//                   users
//                 </span>

//                 <select
//                   value={modalFilter}
//                   onChange={(e) => handleModalFilterChange(e.target.value)}
//                   className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none text-xs flex-1 min-w-[150px]"
//                   disabled={isLoadingDealerData}
//                 >
//                   <option value="DAY">Today</option>
//                   <option value="YESTERDAY">Yesterday</option>
//                   <option value="WEEK">This Week</option>
//                   <option value="LAST_WEEK">Last Week</option>
//                   <option value="MTD">This Month</option>
//                   <option value="LAST_MONTH">Last Month</option>
//                   <option value="QTD">This Quarter</option>
//                   <option value="LAST_QUARTER">Last Quarter</option>
//                   <option value="SIX_MONTH">Last 6 Months</option>
//                   <option value="YTD">This Year</option>
//                   <option value="LIFETIME">Lifetime</option>
//                   <option value="CUSTOM">Custom Range</option>
//                 </select>
//               </div>

//               {/* ✅ ADD: Mobile version of export buttons */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleExportDealerUsersPNG}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </button>

//                 <button
//                   onClick={handleExportDealerUsersCSV}
//                   className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//                   disabled={isLoadingDealerData}
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   Export CSV
//                 </button>
//               </div>

//               {/* Mobile version of custom date inputs */}
//               {modalFilter === "CUSTOM" && (
//                 <div className="space-y-2">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                     <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1 w-full">
//                       <input
//                         type="date"
//                         value={modalCustomStartDate || ""}
//                         onChange={(e) => {
//                           setModalCustomStartDate(e.target.value);
//                         }}
//                         className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                         disabled={isLoadingDealerData}
//                       />
//                       <span className="text-gray-400">-</span>
//                       <input
//                         type="date"
//                         value={modalCustomEndDate || ""}
//                         onChange={(e) => {
//                           setModalCustomEndDate(e.target.value);
//                         }}
//                         className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                         disabled={isLoadingDealerData}
//                       />
//                     </div>

//                     <div className="flex items-center gap-2 w-full">
//                       {/* ✅ CHANGED: Apply button is ALWAYS ENABLED on mobile too */}
//                       <button
//                         onClick={handleApplyCustomDates}
//                         disabled={isLoadingDealerData}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex-1"
//                       >
//                         Apply
//                       </button>

//                       <button
//                         onClick={handleResetCustomDates}
//                         disabled={isLoadingDealerData}
//                         className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap flex-1"
//                       >
//                         Reset
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Loading indicator for mobile */}
//               {(loadingUsers[selectedDealer.dealerId || selectedDealer.id] ||
//                 isLoadingDealerData) && (
//                 <div className="flex items-center">
//                   <span className="text-xs text-blue-600 whitespace-nowrap">
//                     <i className="fas fa-spinner fa-spin mr-1"></i>
//                     Updating...
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Optimized Dealer Summary Section */}
//             <div className="mb-4 flex-shrink-0">
//               {/* <h3 className="text-sm font-semibold text-gray-800 mb-2 px-1">
//                 Dealer Summary -{" "}
//                 {selectedDealer.dealerName || selectedDealer.name}{" "}
//               </h3> */}

//               {(() => {
//                 const currentDealer = getCurrentDealerData();

//                 return (
//                   <div
//                     className="overflow-x-auto"
//                     style={{
//                       scrollbarWidth: "thin",
//                       scrollbarColor: "#d1d5db #f3f4f6",
//                     }}
//                   >
//                     <style>{`
//           .overflow-x-auto::-webkit-scrollbar {
//             height: 6px;
//           }
//           .overflow-x-auto::-webkit-scrollbar-track {
//             background: #f3f4f6;
//             border-radius: 3px;
//           }
//           .overflow-x-auto::-webkit-scrollbar-thumb {
//             background: #d1d5db;
//             border-radius: 3px;
//           }
//           .overflow-x-auto::-webkit-scrollbar-thumb:hover {
//             background: #9ca3af;
//           }
//         `}</style>
//                     <table className="w-full border-collapse text-xs min-w-max">
//                       <thead>
//                         <tr className="bg-gray-100 border-b border-gray-300">
//                           <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Total
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Registered
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Active
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created Enquiries
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Digital
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created Follow-ups
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed Follow-ups
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming Follow-ups
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue Follow-ups
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Total Test Drives
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed Test Drives
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming Test Drives
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue Test Drives
//                           </th>
//                           {/* <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             New Orders
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Net Orders
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Retail
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Cancellations
//                           </th> */}
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
//                             Opportunities Converted
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className="bg-white border-b border-gray-200">
//                           {/* Users - RIGHT ALIGNED */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(currentDealer, ["totalUsers"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(currentDealer, ["registerUsers"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(currentDealer, ["activeUsers"])}
//                           </td>

//                           {/* Leads - RIGHT ALIGNED */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(currentDealer, ["saLeads"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(currentDealer, [
//                               "manuallyEnteredLeads",
//                             ])}
//                           </td>

//                           {/* Follow-ups - WITH WEB VALUES ORANGE COLOR FOR BRACKETS ONLY - RIGHT ALIGNED */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(
//                               currentDealer,
//                               ["saFollowUps"],
//                               ["webleadsFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["completedFollowUps"],
//                               ["webCompletedFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["openFollowUps"],
//                               ["webUpcomingFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["closedFollowUps"],
//                               ["webOverdueFollowUps"],
//                             )}
//                           </td>

//                           {/* Test Drives - WITH WEB VALUES ORANGE COLOR FOR BRACKETS ONLY - RIGHT ALIGNED */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(currentDealer, [
//                               "totalTestDrives",
//                               "saTestDrives",
//                             ])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["completedTestDrives"],
//                               ["webCompletedTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["upcomingTestDrives"],
//                               ["webUpcomingTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             {getDealerValue(
//                               currentDealer,
//                               ["closedTestDrives"],
//                               ["webOverdueTestDrives"],
//                             )}
//                           </td>

//                           {/* Analytics - RIGHT ALIGNED */}
//                           {/* <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(currentDealer, ["newOrders"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-blue-600">
//                             {getDealerValue(currentDealer, ["netOrders"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-purple-600">
//                             {getDealerValue(currentDealer, ["retail"])}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             {getDealerValue(currentDealer, ["cancellations"])}
//                           </td> */}

//                           {/* Opportunities - RIGHT ALIGNED */}
//                           <td className="px-2 py-1.5 text-right font-semibold text-green-600">
//                             {getDealerValue(currentDealer, [
//                               "opportunitiesConverted",
//                             ])}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 );
//               })()}
//             </div>
//             {/* User Details Content */}
//             <div className="flex-1 overflow-auto min-h-0">
//               <DealerUserDetails
//                 ref={dealerUserDetailsRef}
//                 dealer={selectedDealer}
//                 loadingUsers={loadingUsers}
//                 onGetSortedUsers={onGetSortedUsers}
//                 dealerUsers={dealerUsers}
//                 filteredUsers={modalDealerData?.users}
//                 onUsersUpdated={updateCurrentModalUsers}
//               />
//             </div>

//             {/* Modal Footer - Close button (Mobile + Laptop) */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//                 disabled={isLoadingDealerData}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ✅ UPDATE: Wrap DealerUserDetails with forwardRef and useImperativeHandle
// const DealerUserDetails = forwardRef(
//   (
//     {
//       dealer,
//       loadingUsers,
//       onGetSortedUsers,
//       dealerUsers,
//       filteredUsers,
//       onUsersUpdated,
//     },
//     ref,
//   ) => {
//     const [showPurgedUsers, setShowPurgedUsers] = useState(false);
//     const tableRef = useRef(null);

//     // State for user overdue modal
//     const [showUserOverdueModal, setShowUserOverdueModal] = useState(false);
//     const [userOverdueModalType, setUserOverdueModalType] = useState(null);
//     const [userOverdueModalData, setUserOverdueModalData] = useState(null);
//     const [userOverdueModalLoading, setUserOverdueModalLoading] =
//       useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     // ✅ ADD: State for user table sorting
//     const [userSortColumn, setUserSortColumn] = useState(null);
//     const [userSortDirection, setUserSortDirection] = useState("default"); // 'default', 'asc', 'desc'

//     // ✅ ADD: Function to handle user table sorting
//     const handleUserSort = (column) => {
//       if (userSortColumn === column) {
//         // Cycle through directions: default -> asc -> desc -> default
//         if (userSortDirection === "default") {
//           setUserSortDirection("asc");
//         } else if (userSortDirection === "asc") {
//           setUserSortDirection("desc");
//         } else {
//           setUserSortDirection("default");
//           setUserSortColumn(null);
//         }
//       } else {
//         setUserSortColumn(column);
//         setUserSortDirection("asc");
//       }
//     };

//     // ✅ ADD: SortIcon component for user table
//     const UserSortIcon = ({ column }) => {
//       if (userSortColumn !== column) {
//         return (
//           <span className="sort-arrows inline-flex flex-col ml-1">
//             <span className="arrow-up text-[10px] text-gray-400">▲</span>
//             <span className="arrow-down text-[10px] text-gray-400">▼</span>
//           </span>
//         );
//       }

//       if (userSortDirection === "asc") {
//         return (
//           <span className="sort-arrows inline-flex flex-col ml-1">
//             <span className="arrow-up text-[10px] text-[#222fb9]">▲</span>
//             <span className="arrow-down text-[10px] text-gray-400">▼</span>
//           </span>
//         );
//       } else if (userSortDirection === "desc") {
//         return (
//           <span className="sort-arrows inline-flex flex-col ml-1">
//             <span className="arrow-up text-[10px] text-gray-400">▲</span>
//             <span className="arrow-down text-[10px] text-[#222fb9]">▼</span>
//           </span>
//         );
//       }

//       return null;
//     };

//     // ✅ ADD: Function to sort users based on column and direction
//     const getSortedUsers = (users) => {
//       if (!userSortColumn || userSortDirection === "default") {
//         return users;
//       }

//       return [...users].sort((a, b) => {
//         // Helper function to extract numeric value from user data
//         const getValueForSort = (user, column) => {
//           switch (column) {
//             // User info columns
//             case "user":
//               return (user.user || "").toLowerCase();
//             case "role":
//               return (user.user_role || "").toLowerCase();
//             case "registered":
//               return user.registerUser ? 1 : 0;
//             case "status":
//               return user.active ? 1 : 0;
//             case "last_login":
//               return user.last_login ? new Date(user.last_login).getTime() : 0;

//             // Leads columns
//             case "created_enquiries":
//               return user.leads?.sa || 0;
//             case "digital_enquiries":
//               return user.leads?.manuallyEntered || 0;

//             // Follow-ups columns
//             case "created_followups":
//               return user.followups?.sa || 0;
//             case "completed_followups":
//               return user.followups?.completed || 0;
//             case "upcoming_followups":
//               return user.followups?.open || 0;
//             case "overdue_followups":
//               return user.followups?.closed || 0;

//             // Test Drives columns
//             case "total_testdrives":
//               return user.testdrives?.total || 0;
//             case "completed_testdrives":
//               return user.testdrives?.completed || 0;
//             case "upcoming_testdrives":
//               return user.testdrives?.upcoming || 0;
//             case "overdue_testdrives":
//               return user.testdrives?.closed || 0;

//             // Opportunities column
//             case "opp_converted":
//               return user.opportunitiesConverted || 0;

//             default:
//               return 0;
//           }
//         };

//         const valA = getValueForSort(a, userSortColumn);
//         const valB = getValueForSort(b, userSortColumn);

//         if (typeof valA === "string" && typeof valB === "string") {
//           return userSortDirection === "asc"
//             ? valA.localeCompare(valB)
//             : valB.localeCompare(valA);
//         }

//         return userSortDirection === "asc" ? valA - valB : valB - valA;
//       });
//     };

//     // Function to handle user overdue value click
//     const handleUserOverdueClick = async (user, type) => {
//       setSelectedUser(user);
//       setUserOverdueModalType(type);
//       setUserOverdueModalData(null);
//       setUserOverdueModalLoading(true);
//       setShowUserOverdueModal(true);

//       setTimeout(() => {
//         const mockData = {
//           userName: user.user,
//           dealerName: dealer.dealerName || dealer.name,
//           type: type,
//           total:
//             type === "followups"
//               ? user.followups?.closed || 0
//               : user.testdrives?.closed || 0,
//           items:
//             type === "followups"
//               ? [
//                   {
//                     id: 1,
//                     customerName: "John Doe",
//                     date: "2024-01-15",
//                     reason: "Customer not responding",
//                     status: "Overdue",
//                   },
//                   {
//                     id: 2,
//                     customerName: "Jane Smith",
//                     date: "2024-01-14",
//                     reason: "Follow-up pending",
//                     status: "Overdue",
//                   },
//                   {
//                     id: 3,
//                     customerName: "Bob Johnson",
//                     date: "2024-01-13",
//                     reason: "Waiting for feedback",
//                     status: "Overdue",
//                   },
//                 ]
//               : [
//                   {
//                     id: 1,
//                     customerName: "Alice Brown",
//                     date: "2024-01-16",
//                     vehicle: "Model X",
//                     status: "Overdue",
//                   },
//                   {
//                     id: 2,
//                     customerName: "Charlie Wilson",
//                     date: "2024-01-15",
//                     vehicle: "Model Y",
//                     status: "Overdue",
//                   },
//                 ],
//         };
//         setUserOverdueModalData(mockData);
//         setUserOverdueModalLoading(false);
//       }, 500);
//     };

//     // Function to close user overdue modal
//     const closeUserOverdueModal = () => {
//       setShowUserOverdueModal(false);
//       setUserOverdueModalType(null);
//       setUserOverdueModalData(null);
//       setSelectedUser(null);
//     };

//     const handleExportPNG = async () => {
//       if (!tableRef.current) {
//         return;
//       }

//       try {
//         const button = document.activeElement;
//         const originalHTML = button?.innerHTML;
//         if (button) {
//           button.innerHTML =
//             '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//           button.disabled = true;
//         }

//         const exportContainer = document.createElement("div");
//         exportContainer.style.cssText = `
//         position: fixed;
//         left: -9999px;
//         top: 0;
//         background: white;
//         z-index: 99999;
//         overflow: visible;
//         box-sizing: border-box;
//         opacity: 1;
//         padding: 0;
//         margin: 0;
//       `;

//         const clone = tableRef.current.cloneNode(true);
//         const outerContainer = clone.querySelector(".overflow-auto");
//         const table = clone.querySelector("table");
//         const tableHead = table?.querySelector("thead");
//         const stickyCells = clone.querySelectorAll(".sticky");

//         if (!table) {
//           throw new Error("Table not found in clone");
//         }

//         const originalRect = tableRef.current.getBoundingClientRect();
//         exportContainer.style.width = `${originalRect.width}px`;
//         exportContainer.style.height = "auto";

//         if (outerContainer) {
//           outerContainer.style.overflow = "visible";
//           outerContainer.style.height = "auto";
//           outerContainer.style.maxHeight = "none";
//           outerContainer.style.position = "static";
//         }

//         if (tableHead) {
//           tableHead.style.position = "static";
//           tableHead.style.top = "auto";
//           tableHead.style.zIndex = "auto";
//         }

//         if (table) {
//           table.style.width = "100%";
//           table.style.minWidth = "auto";
//           table.style.position = "static";
//           table.style.tableLayout = "auto";
//           table.style.display = "table";
//         }

//         stickyCells.forEach((cell) => {
//           cell.style.position = "static";
//           cell.style.left = "auto";
//           cell.style.zIndex = "auto";
//           if (cell.classList.contains("bg-red-50")) {
//             cell.style.backgroundColor = "#fef2f2";
//           } else if (cell.classList.contains("bg-white")) {
//             cell.style.backgroundColor = "#ffffff";
//           }
//         });

//         const allCells = clone.querySelectorAll("td, th");
//         allCells.forEach((cell) => {
//           cell.style.boxShadow = "none";
//           cell.style.border = "1px solid #e5e7eb";
//         });

//         const exportButtons = clone.querySelectorAll(".export-button");
//         const allButtons = clone.querySelectorAll("button");
//         const allInputs = clone.querySelectorAll("input, select");

//         [...exportButtons, ...allButtons, ...allInputs].forEach((el) => {
//           el.remove();
//         });

//         const expandButtons = clone.querySelectorAll(".expand-btn");
//         expandButtons.forEach((btn) => {
//           const span = btn.querySelector("span");
//           if (span) {
//             const textNode = document.createTextNode(span.textContent || "");
//             btn.parentNode.replaceChild(textNode, btn);
//           }
//         });

//         const chevrons = clone.querySelectorAll(".fa-chevron-right");
//         chevrons.forEach((icon) => {
//           icon.style.display = "none";
//         });

//         // ✅ ADD: Remove sort icons from cloned table
//         const sortArrows = clone.querySelectorAll(".sort-arrows");
//         sortArrows.forEach((arrow) => {
//           arrow.remove();
//         });

//         exportContainer.appendChild(clone);
//         document.body.appendChild(exportContainer);

//         await new Promise((resolve) => {
//           requestAnimationFrame(() => {
//             clone.offsetHeight;
//             resolve();
//           });
//         });

//         await new Promise((resolve) => setTimeout(resolve, 300));

//         const cloneRect = clone.getBoundingClientRect();
//         const captureWidth = Math.ceil(cloneRect.width);
//         const captureHeight = Math.ceil(cloneRect.height);

//         const paddedWidth = Math.ceil(captureWidth + 40);
//         const paddedHeight = Math.ceil(captureHeight + 40);

//         const dataUrl = await toPng(clone, {
//           quality: 1.0,
//           pixelRatio: 2,
//           backgroundColor: "#ffffff",
//           width: paddedWidth,
//           height: paddedHeight,
//           style: {
//             transform: "none",
//             transformOrigin: "top left",
//             overflow: "visible",
//             padding: "20px",
//             margin: "0",
//           },
//           filter: (node) => {
//             if (node.style && node.style.display === "none") {
//               return false;
//             }
//             if (node.classList?.contains("export-button")) {
//               return false;
//             }
//             if (node.classList?.contains("sort-arrows")) {
//               return false;
//             }
//             return true;
//           },
//         });

//         document.body.removeChild(exportContainer);

//         const link = document.createElement("a");
//         const dealerName = dealer?.dealerName?.replace(/\s+/g, "-") || "dealer";
//         const userName = dealer?.user?.replace(/\s+/g, "-") || "users";
//         link.download = `users-${dealerName}-${userName}-${
//           new Date().toISOString().split("T")[0]
//         }.png`;
//         link.href = dataUrl;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         if (button && originalHTML) {
//           button.innerHTML = originalHTML;
//           button.disabled = false;
//         }
//       } catch (error) {
//         console.error("❌ Error exporting dealer users PNG:", error);
//         alert("Failed to export PNG. Please try again.");

//         const button = document.activeElement;
//         if (button) {
//           button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
//           button.disabled = false;
//         }
//       }
//     };

//     // CSV Export function
//     const exportUsersToCSV = () => {
//       const usersToExport = sortedUsers; // ✅ CHANGED: Use sortedUsers instead of displayedUsers
//       if (!usersToExport || usersToExport.length === 0) {
//         alert("No data to export");
//         return;
//       }

//       const getFormattedValueForExport = (mainValue, webValue) => {
//         const main = mainValue ?? 0;
//         const web = webValue ?? 0;

//         if (webValue !== undefined && webValue !== null) {
//           return `${main} (${web})`;
//         }
//         return `${main}`;
//       };

//       const headers = [
//         "User",
//         "Role",
//         "Registered",
//         "Status",
//         "Last Login",
//         "Created Enquiries",
//         "Digital Enquiries",
//         "Created Follow-ups",
//         "Completed Follow-ups",
//         "Upcoming Follow-ups",
//         "Overdue Follow-ups",
//         "Total Test Drives",
//         "Completed Test Drives",
//         "Upcoming Test Drives",
//         "Overdue Test Drives",
//         "Opp. Converted",
//       ];

//       const csvRows = usersToExport.map((user) => {
//         const followupWeb =
//           user.followups?.webleads ||
//           user.followups?.webleadsFollowUps ||
//           user.followups?.webwebleads ||
//           0;

//         const followupCompletedWeb =
//           user.followups?.webcompletedfollowups ||
//           user.followups?.webCompletedFollowUps ||
//           user.followups?.webcompleted ||
//           0;

//         const followupUpcomingWeb =
//           user.followups?.webupcomingfollowups ||
//           user.followups?.webUpcomingFollowUps ||
//           user.followups?.webupcoming ||
//           0;

//         const followupOverdueWeb =
//           user.followups?.weboverduefollowups ||
//           user.followups?.webOverdueFollowUps ||
//           user.followups?.weboverdue ||
//           0;

//         const testDriveCompletedWeb =
//           user.testdrives?.webcompleteddrives ||
//           user.testdrives?.webCompletedTestDrives ||
//           user.testdrives?.webcompleted ||
//           0;

//         const testDriveUpcomingWeb =
//           user.testdrives?.webupcomingdrives ||
//           user.testdrives?.webUpcomingTestDrives ||
//           user.testdrives?.webupcoming ||
//           0;

//         const testDriveOverdueWeb =
//           user.testdrives?.weboverduedrives ||
//           user.testdrives?.webOverdueTestDrives ||
//           user.testdrives?.weboverdue ||
//           0;

//         return [
//           `"${(user.user || "").replace(/"/g, '""')}"`,
//           user.user_role || "",
//           user.registerUser ? "Yes" : "No",
//           user.active ? "Active" : "Inactive",
//           user.last_login
//             ? new Date(user.last_login)
//                 .toLocaleString("en-IN", {
//                   timeZone: "Asia/Kolkata",
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   hour12: false,
//                 })
//                 .replace(",", "")
//             : "-",
//           user.leads?.sa ?? 0,
//           user.leads?.manuallyEntered ?? 0,
//           `"${getFormattedValueForExport(user.followups?.sa, followupWeb)}"`,
//           `"${getFormattedValueForExport(
//             user.followups?.completed,
//             followupCompletedWeb,
//           )}"`,
//           `"${getFormattedValueForExport(
//             user.followups?.open,
//             followupUpcomingWeb,
//           )}"`,
//           `"${getFormattedValueForExport(
//             user.followups?.closed,
//             followupOverdueWeb,
//           )}"`,
//           user.testdrives?.total ?? 0,
//           `"${getFormattedValueForExport(
//             user.testdrives?.completed,
//             testDriveCompletedWeb,
//           )}"`,
//           `"${getFormattedValueForExport(
//             user.testdrives?.upcoming,
//             testDriveUpcomingWeb,
//           )}"`,
//           `"${getFormattedValueForExport(
//             user.testdrives?.closed,
//             testDriveOverdueWeb,
//           )}"`,
//           user.opportunitiesConverted ?? 0,
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
//         `users-${dealer?.dealerName?.replace(/\s+/g, "-") || "dealer"}-${
//           new Date().toISOString().split("T")[0]
//         }.csv`,
//       );
//       link.style.visibility = "hidden";

//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     };

//     // ✅ ADD: useImperativeHandle to expose functions to parent
//     useImperativeHandle(ref, () => ({
//       handleExportPNG,
//       exportUsersToCSV,
//     }));

//     // Helper function to format values with web data
//     const formatValueWithWeb = (
//       mainValue,
//       webValue,
//       colorClass = "",
//       clickable = false,
//       onClick = null,
//     ) => {
//       const main = mainValue ?? 0;
//       const web = webValue ?? 0;

//       if (web !== undefined && web !== null) {
//         return (
//           <div
//             className={`inline-flex items-center ${colorClass}`}
//             style={{ verticalAlign: "middle" }}
//           >
//             {clickable ? (
//               <button
//                 className="hover:underline focus:outline-none cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   if (onClick) onClick();
//                 }}
//                 style={{
//                   lineHeight: "normal",
//                   color: colorClass.includes("red") ? "#dc2626" : "inherit",
//                 }}
//               >
//                 {main}
//               </button>
//             ) : (
//               <span style={{ lineHeight: "normal" }}>{main}</span>
//             )}
//             <span
//               className="text-xs ml-1"
//               style={{
//                 color: "rgb(255, 152, 0)",
//                 lineHeight: "normal",
//                 verticalAlign: "middle",
//               }}
//             >
//               ({web})
//             </span>
//           </div>
//         );
//       }

//       if (clickable) {
//         return (
//           <button
//             className={`hover:underline focus:outline-none cursor-pointer ${colorClass}`}
//             onClick={(e) => {
//               e.stopPropagation();
//               if (onClick) onClick();
//             }}
//             style={{
//               lineHeight: "normal",
//               color: colorClass.includes("red") ? "#dc2626" : "inherit",
//             }}
//           >
//             {main}
//           </button>
//         );
//       }

//       return (
//         <span className={colorClass} style={{ lineHeight: "normal" }}>
//           {main}
//         </span>
//       );
//     };

//     const dealerId = dealer.dealerId || dealer.id;

//     const getUsers = () => {
//       if (filteredUsers && Array.isArray(filteredUsers)) {
//         return filteredUsers;
//       }

//       if (dealerUsers && dealerUsers[dealerId]) {
//         return dealerUsers[dealerId];
//       }

//       return onGetSortedUsers(dealerId) || [];
//     };

//     const allUsers = getUsers();
//     const registeredUsers = allUsers.filter(
//       (user) => user.registerUser === true,
//     );
//     const purgedUsers = allUsers.filter((user) => user.registerUser === false);
//     const displayedUsers = showPurgedUsers
//       ? [...registeredUsers, ...purgedUsers]
//       : registeredUsers;

//     // ✅ ADD: Get sorted users
//     const sortedUsers = getSortedUsers(displayedUsers);

//     const totalRegisteredUsers = registeredUsers.length;
//     const totalPurgedUsers = purgedUsers.length;

//     useEffect(() => {
//       if (onUsersUpdated) {
//         onUsersUpdated(sortedUsers); // ✅ CHANGED: Pass sortedUsers instead of displayedUsers
//       }
//     }, [sortedUsers, onUsersUpdated]);

//     return (
//       <>
//         <div className="relative z-30 w-full h-full flex flex-col">
//           {loadingUsers[dealerId] ? (
//             <div className="text-center py-3 text-gray-500 relative z-30">
//               <i className="fas fa-spinner fa-spin mr-2"></i>
//               Loading users...
//             </div>
//           ) : allUsers.length === 0 ? (
//             <div className="text-center py-3 text-gray-500 relative z-30">
//               <i className="fas fa-users-slash mr-2"></i>
//               No users found for this dealer
//             </div>
//           ) : (
//             <div className="relative z-30 w-full h-full flex flex-col">
//               {/* Export buttons section */}
//               <div className="flex justify-between items-center px-2 py-1 bg-gray-50 border-b border-gray-200">
//                 {/* <div className="text-xs text-gray-600">
//                 Showing {sortedUsers.length} users
//                 {userSortColumn && userSortDirection !== "default" && (
//                   <span className="ml-2 text-blue-600">
//                     <i className="fas fa-sort mr-1"></i>
//                     Sorted by {userSortColumn.replace(/_/g, " ")} (
//                     {userSortDirection === "asc" ? "Ascending" : "Descending"})
//                   </span>
//                 )}
//               </div> */}

//                 {/* <div className="flex gap-2">
//                 <button
//                   onClick={handleExportPNG}
//                   className="export-button px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                 >
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </button>

//                 <button
//                   onClick={exportUsersToCSV}
//                   className="export-button px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   Export CSV
//                 </button>
//               </div> */}
//               </div>

//               {/* Table container */}
//               <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
//                 <div
//                   ref={tableRef}
//                   className="bg-white border border-gray-200 relative z-30 w-full h-full overflow-hidden flex flex-col"
//                 >
//                   <div className="flex-1 overflow-auto">
//                     <table className="w-full text-[11px] border-collapse min-w-[1600px] relative">
//                       <thead className="bg-gray-50 sticky top-0 z-40">
//                         <tr>
//                           {/* User Column */}
//                           {/* <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
//                             <div
//                               className="flex items-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("user")}
//                             >
//                               User
//                               <UserSortIcon column="user" />
//                             </div>
//                           </th> */}
//                           <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
//                             <div className="flex items-center">User</div>
//                           </th>
//                           {/* Role Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("role")}
//                             >
//                               Role
//                               <UserSortIcon column="role" />
//                             </div>
//                           </th>

//                           {/* Registered Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("registered")}
//                             >
//                               Registered
//                               <UserSortIcon column="registered" />
//                             </div>
//                           </th>

//                           {/* Status Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("status")}
//                             >
//                               Status
//                               <UserSortIcon column="status" />
//                             </div>
//                           </th>

//                           {/* Last Login Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[80px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("last_login")}
//                             >
//                               Last Login
//                               <UserSortIcon column="last_login" />
//                             </div>
//                           </th>

//                           {/* Created Enquiries Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[80px] bg-blue-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("created_enquiries")
//                               }
//                             >
//                               Created Enquiries
//                               <UserSortIcon column="created_enquiries" />
//                             </div>
//                           </th>

//                           {/* Digital Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px] bg-blue-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("digital_enquiries")
//                               }
//                             >
//                               Digital
//                               <UserSortIcon column="digital_enquiries" />
//                             </div>
//                           </th>

//                           {/* Created Follow-ups Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("created_followups")
//                               }
//                             >
//                               Created Follow-ups
//                               <UserSortIcon column="created_followups" />
//                             </div>
//                           </th>

//                           {/* Completed Follow-ups Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("completed_followups")
//                               }
//                             >
//                               Completed Follow-ups
//                               <UserSortIcon column="completed_followups" />
//                             </div>
//                           </th>

//                           {/* Upcoming Follow-ups Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("upcoming_followups")
//                               }
//                             >
//                               Upcoming Follow-ups
//                               <UserSortIcon column="upcoming_followups" />
//                             </div>
//                           </th>

//                           {/* Overdue Follow-ups Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-green-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("overdue_followups")
//                               }
//                             >
//                               Overdue Follow-ups
//                               <UserSortIcon column="overdue_followups" />
//                             </div>
//                           </th>

//                           {/* Total Test Drives Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("total_testdrives")}
//                             >
//                               Total Test Drives
//                               <UserSortIcon column="total_testdrives" />
//                             </div>
//                           </th>

//                           {/* Completed Test Drives Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("completed_testdrives")
//                               }
//                             >
//                               Completed Test Drives
//                               <UserSortIcon column="completed_testdrives" />
//                             </div>
//                           </th>

//                           {/* Upcoming Test Drives Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("upcoming_testdrives")
//                               }
//                             >
//                               Upcoming Test Drives
//                               <UserSortIcon column="upcoming_testdrives" />
//                             </div>
//                           </th>

//                           {/* Overdue Test Drives Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-orange-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() =>
//                                 handleUserSort("overdue_testdrives")
//                               }
//                             >
//                               Overdue Test Drives
//                               <UserSortIcon column="overdue_testdrives" />
//                             </div>
//                           </th>

//                           {/* Opp. Converted Column */}
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 min-w-[80px] bg-purple-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("opp_converted")}
//                             >
//                               Opp. Converted
//                               <UserSortIcon column="opp_converted" />
//                             </div>
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody className="bg-white">
//                         {sortedUsers.map((user, userIndex) => {
//                           const isPurged = user.registerUser === false;
//                           const isInactive = !user.active;

//                           return (
//                             <tr
//                               key={user.user_id || user.userId || userIndex}
//                               className={`
//                               border-b border-gray-100 transition-none
//                               ${
//                                 isPurged
//                                   ? "bg-red-50 hover:bg-red-100"
//                                   : userIndex % 2 === 0
//                                     ? "bg-white hover:bg-blue-50"
//                                     : "bg-gray-50 hover:bg-blue-50"
//                               }
//                             `}
//                             >
//                               <td
//                                 className={`
//                                 sticky left-0 z-[35] px-2 py-1 text-left font-medium border-r border-gray-200 whitespace-nowrap text-[11px]
//                                 ${
//                                   isPurged
//                                     ? "bg-red-50 hover:bg-red-100"
//                                     : userIndex % 2 === 0
//                                       ? "bg-white hover:bg-blue-50"
//                                       : "bg-gray-50 hover:bg-blue-50"
//                                 }
//                                 text-gray-900
//                               `}
//                               >
//                                 <div className="flex items-center">
//                                   {user.user}
//                                 </div>
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {user.user_role}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 <span
//                                   className={`inline-block px-1 py-0.5 rounded text-[10px] font-medium ${
//                                     user.registerUser
//                                       ? "bg-green-100 text-green-800"
//                                       : "bg-gray-100 text-gray-600"
//                                   }`}
//                                 >
//                                   {user.registerUser ? "Yes" : "No"}
//                                 </span>
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 <span
//                                   className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
//                                     user.active
//                                       ? "bg-green-100 text-green-800"
//                                       : "bg-red-100 text-red-800"
//                                   }`}
//                                 >
//                                   <span
//                                     className={`w-1 h-1 rounded-full mr-1 ${
//                                       user.active
//                                         ? "bg-green-500"
//                                         : "bg-red-500"
//                                     }`}
//                                   ></span>
//                                   {user.active ? "Active" : "Inactive"}
//                                 </span>
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-300 text-gray-500 text-[10px]`}
//                               >
//                                 {user.last_login
//                                   ? new Date(user.last_login)
//                                       .toLocaleString("en-IN", {
//                                         timeZone: "Asia/Kolkata",
//                                         day: "2-digit",
//                                         month: "2-digit",
//                                         year: "numeric",
//                                         hour: "2-digit",
//                                         minute: "2-digit",
//                                         hour12: false,
//                                       })
//                                       .replace(",", "")
//                                   : "-"}
//                               </td>

//                               {/* Leads Data */}
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 <span className="font-semibold text-[#222fb9]">
//                                   {user.leads?.sa ?? "-"}
//                                 </span>
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200 text-gray-600`}
//                               >
//                                 {user.leads?.manuallyEntered ?? 0}
//                               </td>

//                               {/* Follow-ups Data */}
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.followups?.sa,
//                                   user.followups?.webleads,
//                                   "font-semibold text-[#222fb9]",
//                                 )}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.followups?.completed,
//                                   user.followups?.webcompletedfollowups,
//                                   "font-semibold text-green-600",
//                                 )}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.followups?.open,
//                                   user.followups?.webupcomingfollowups,
//                                   "text-blue-600",
//                                 )}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-300`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.followups?.closed,
//                                   user.followups?.weboverduefollowups,
//                                   "font-semibold text-red-600",
//                                   true,
//                                   () =>
//                                     handleUserOverdueClick(user, "followups"),
//                                 )}
//                               </td>

//                               {/* Test Drives Data */}
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200 font-semibold text-[#222fb9]`}
//                               >
//                                 {user.testdrives?.total ?? 0}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.testdrives?.completed,
//                                   user.testdrives?.webcompleteddrives,
//                                   "font-semibold text-green-600",
//                                 )}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-200`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.testdrives?.upcoming,
//                                   user.testdrives?.webupcomingdrives,
//                                   "text-blue-600",
//                                 )}
//                               </td>
//                               <td
//                                 className={`px-1 py-1 text-center border-r border-gray-300`}
//                               >
//                                 {formatValueWithWeb(
//                                   user.testdrives?.closed,
//                                   user.testdrives?.weboverduedrives,
//                                   "font-semibold text-red-600",
//                                   true,
//                                   () =>
//                                     handleUserOverdueClick(user, "testdrives"),
//                                 )}
//                               </td>

//                               <td
//                                 className={`px-1 py-1 text-center font-semibold text-green-600`}
//                               >
//                                 {user.opportunitiesConverted ?? 0}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>

//               {/* Show/Hide non-registered users button */}
//               {totalPurgedUsers > 0 && (
//                 <div className="border-t border-gray-200 p-2 bg-white flex justify-start">
//                   <button
//                     onClick={() => setShowPurgedUsers(!showPurgedUsers)}
//                     className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                   >
//                     <i
//                       className={`fas fa-${
//                         showPurgedUsers ? "eye-slash" : "eye"
//                       } text-xs`}
//                     ></i>
//                     {showPurgedUsers
//                       ? "Hide Not-Registered Users"
//                       : "Show Not-Registered Users"}
//                     <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded text-[10px]">
//                       {totalPurgedUsers}
//                     </span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* User Overdue Details Modal */}
//         {showUserOverdueModal && (
//           <div
//             className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-sm"
//             style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//             onClick={closeUserOverdueModal}
//           >
//             <div
//               className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header */}
//               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   {userOverdueModalType === "followups"
//                     ? "Overdue Follow-ups"
//                     : "Overdue Test Drives"}{" "}
//                   - {selectedUser?.user || "User"}
//                   <span className="text-sm font-normal text-gray-600 ml-2">
//                     (
//                     {userOverdueModalData?.dealerName ||
//                       dealer.dealerName ||
//                       dealer.name}
//                     ) • {userOverdueModalData?.total || 0} total
//                   </span>
//                 </h2>
//                 <button
//                   onClick={closeUserOverdueModal}
//                   className="text-gray-400 hover:text-gray-600 text-2xl"
//                 >
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>

//               {/* Modal Content */}
//               <div className="flex-1 overflow-auto">
//                 {userOverdueModalLoading ? (
//                   <div className="flex flex-col items-center justify-center p-12">
//                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//                     <div className="text-gray-500 text-sm">
//                       Loading overdue details...
//                     </div>
//                   </div>
//                 ) : userOverdueModalData?.items &&
//                   userOverdueModalData.items.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="w-full border-collapse text-sm">
//                       <thead>
//                         <tr className="bg-gray-100 border-b border-gray-300">
//                           <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                             ID
//                           </th>
//                           <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                             Customer Name
//                           </th>
//                           <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                             Date
//                           </th>
//                           {userOverdueModalType === "followups" ? (
//                             <>
//                               <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                 Reason
//                               </th>
//                               <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                 Status
//                               </th>
//                             </>
//                           ) : (
//                             <>
//                               <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                 Vehicle
//                               </th>
//                               <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                                 Status
//                               </th>
//                             </>
//                           )}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userOverdueModalData.items.map((item, index) => (
//                           <tr
//                             key={item.id}
//                             className={`${
//                               index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                             } border-b border-gray-200 hover:bg-blue-50`}
//                           >
//                             <td className="px-4 py-2">{item.id}</td>
//                             <td className="px-4 py-2 font-medium">
//                               {item.customerName}
//                             </td>
//                             <td className="px-4 py-2">{item.date}</td>
//                             {userOverdueModalType === "followups" ? (
//                               <>
//                                 <td className="px-4 py-2">{item.reason}</td>
//                                 <td className="px-4 py-2">
//                                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                     {item.status}
//                                   </span>
//                                 </td>
//                               </>
//                             ) : (
//                               <>
//                                 <td className="px-4 py-2">{item.vehicle}</td>
//                                 <td className="px-4 py-2">
//                                   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                     {item.status}
//                                   </span>
//                                 </td>
//                               </>
//                             )}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="flex justify-center items-center p-12">
//                     <div className="text-gray-500 text-sm">
//                       No overdue{" "}
//                       {userOverdueModalType === "followups"
//                         ? "follow-ups"
//                         : "test drives"}{" "}
//                       found for this user.
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Modal Footer */}
//               <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//                 <button
//                   onClick={closeUserOverdueModal}
//                   className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   },
// );

// export default DealerSummaryTable;

// TODAY COMMENTED CODE
// import React, { useState, useEffect, useRef } from "react";
// import { toPng } from "html-to-image";
// import DealerUserDetails from "./DealerUserDetails";

// const DealerSummaryTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   dealerUsers,
//   loadingUsers,
//   sortColumn,
//   sortDirection,
//   onSortData,
//   onGetSortedUsers,
//   onExportCSV,
//   onToggleSummaryRow,
//   selectedFilter,
//   onFilterChange,
//   onRefreshDashboardData,
//   onFetchDealerUsers,
//   customStartDate,
//   customEndDate,
// }) => {
//   // ==================== STATE MANAGEMENT ====================
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [modalDealerData, setModalDealerData] = useState(null);
//   const [isDealersLoading, setIsDealersLoading] = useState(true);
//   const [currentModalUsers, setCurrentModalUsers] = useState([]);
//   const [modalCustomStartDate, setModalCustomStartDate] =
//     useState(customStartDate);
//   const [modalCustomEndDate, setModalCustomEndDate] = useState(customEndDate);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [exportingPNG, setExportingPNG] = useState(false);
//   const [exportingUsersPNG, setExportingUsersPNG] = useState(false);

//   // Overdue modal state
//   const [showOverdueModal, setShowOverdueModal] = useState(false);
//   const [overdueModalType, setOverdueModalType] = useState(null);
//   const [overdueModalData, setOverdueModalData] = useState(null);
//   const [overdueModalLoading, setOverdueModalLoading] = useState(false);

//   // Refs
//   const mainTableRef = useRef(null);
//   const dealerUserDetailsRef = useRef(null);

//   // ==================== COMPUTED VALUES ====================
//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (dealers !== undefined) {
//       setIsDealersLoading(false);
//     }
//   }, [dealers]);

//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalDealerData(null);
//       setModalCustomStartDate(customStartDate);
//       setModalCustomEndDate(customEndDate);
//       setCurrentModalUsers([]);
//     }
//   }, [showUserModal, selectedFilter, customStartDate, customEndDate]);

//   // ==================== HELPER FUNCTIONS ====================
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return "0";
//     return Number(num).toLocaleString("en-IN");
//   };

//   const areModalDatesValid = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       return new Date(modalCustomStartDate) <= new Date(modalCustomEndDate);
//     }
//     return false;
//   };

//   const getRawValue = (dealer, fieldNames) => {
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         return value;
//       }
//     }
//     return 0;
//   };

//   const getRawDealerValue = (dealer, fieldNames) => {
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         return value;
//       }
//     }
//     return 0;
//   };

//   const getDealerValue = (
//     dealer,
//     fieldNames,
//     webFieldNames = [],
//     clickable = false,
//     onClick = null,
//   ) => {
//     let mainValue = "0";
//     let webValue = null;

//     // Get main value
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         mainValue = formatNumber(value);
//         break;
//       }
//     }

//     // Get web value if provided
//     if (webFieldNames.length > 0) {
//       for (let field of webFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           webValue = formatNumber(value);
//           break;
//         }
//       }
//     }

//     // Return formatted string with web value in brackets
//     if (webValue !== null) {
//       return (
//         <div className="flex items-center justify-end">
//           {clickable ? (
//             <button
//               className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (onClick) onClick();
//               }}
//               title={`Click to view ${
//                 fieldNames[0].includes("Follow")
//                   ? "overdue follow-ups"
//                   : "overdue test drives"
//               }`}
//             >
//               {mainValue}
//             </button>
//           ) : (
//             <span>{mainValue}</span>
//           )}
//           <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
//             ({webValue})
//           </span>
//         </div>
//       );
//     }

//     return clickable ? (
//       <button
//         className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer text-right w-full"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (onClick) onClick();
//         }}
//         title={`Click to view ${
//           fieldNames[0].includes("Follow")
//             ? "overdue follow-ups"
//             : "overdue test drives"
//         }`}
//       >
//         {mainValue}
//       </button>
//     ) : (
//       <div className="text-right">{mainValue}</div>
//     );
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = a[sortColumn] ?? 0;
//       const valB = b[sortColumn] ?? 0;
//       return sortDirection === "asc" ? valA - valB : valB - valA;
//     });
//   };

//   const getCurrentDealerData = () => {
//     if (modalDealerData) {
//       return modalDealerData;
//     }

//     if (modalFilter !== selectedFilter && selectedDealer) {
//       return selectedDealer;
//     }

//     if (selectedDealer) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;

//       let freshDealer = null;
//       if (selectedDealers.length > 0) {
//         freshDealer = selectedDealers.find(
//           (d) => (d.dealerId || d.id) === dealerId,
//         );
//       }

//       if (!freshDealer) {
//         freshDealer = dealers.find((d) => (d.dealerId || d.id) === dealerId);
//       }

//       if (!freshDealer) {
//         freshDealer = selectedDealer;
//       }

//       return freshDealer;
//     }

//     return selectedDealer;
//   };

//   const getFilterLabel = (filter) => {
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

//   // ==================== EVENT HANDLERS ====================
//   const updateCurrentModalUsers = (users) => {
//     if (Array.isArray(users)) {
//       setCurrentModalUsers(users);
//     }
//   };

//   const handleModalFilterChange = async (
//     filterValue,
//     applyCustomDates = false,
//   ) => {
//     if (!selectedDealer) {
//       return;
//     }

//     if (filterValue === "CUSTOM" && !applyCustomDates) {
//       setModalFilter("CUSTOM");
//       return;
//     }

//     if (filterValue === "CUSTOM" && applyCustomDates) {
//       if (!modalCustomStartDate || !modalCustomEndDate) {
//         setToastMessage("Please select both start and end dates");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }

//       const isValid = areModalDatesValid();
//       if (!isValid) {
//         setToastMessage("End date cannot be before start date");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     if (onFetchDealerUsers) {
//       try {
//         const freshDealerData = await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           filterValue === "CUSTOM" ? modalCustomStartDate : undefined,
//           filterValue === "CUSTOM" ? modalCustomEndDate : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//           if (freshDealerData.users && Array.isArray(freshDealerData.users)) {
//             setCurrentModalUsers(freshDealerData.users);
//           }
//         } else {
//           setModalDealerData(null);
//           setCurrentModalUsers([]);
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch dealer data:", error);
//         setModalDealerData(null);
//         setCurrentModalUsers([]);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }
//   };

//   const handleApplyCustomDates = () => {
//     if (!modalCustomStartDate || !modalCustomEndDate) {
//       setToastMessage("Please select both start and end dates");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     const isValid = areModalDatesValid();
//     if (!isValid) {
//       setToastMessage("End date cannot be before start date");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     handleModalFilterChange("CUSTOM", true);
//   };

//   const handleResetCustomDates = () => {
//     setModalFilter(selectedFilter);
//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(customStartDate || "");
//       setModalCustomEndDate(customEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   const handleDealerClick = async (dealer) => {
//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalDealerData(null);
//     setCurrentModalUsers([]);
//     setModalFilter(selectedFilter);
//     setModalCustomStartDate(customStartDate);
//     setModalCustomEndDate(customEndDate);

//     setIsLoadingDealerData(true);

//     if (onFetchDealerUsers) {
//       try {
//         const freshDealerData = await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           selectedFilter === "CUSTOM" ? customStartDate : undefined,
//           selectedFilter === "CUSTOM" ? customEndDate : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//           if (freshDealerData.users && Array.isArray(freshDealerData.users)) {
//             setCurrentModalUsers(freshDealerData.users);
//           }
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch initial dealer data:", error);
//         setCurrentModalUsers([]);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }

//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   const handleOverdueClick = async (dealer, type) => {
//     setOverdueModalType(type);
//     setOverdueModalData(null);
//     setOverdueModalLoading(true);
//     setShowOverdueModal(true);

//     setTimeout(() => {
//       const mockData = {
//         dealerName: dealer.dealerName || dealer.name,
//         type: type,
//         total:
//           type === "followups"
//             ? dealer.closedFollowUps || 0
//             : dealer.closedTestDrives || dealer.saTestDrives || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   assignedTo: "Sales Rep 1",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   assignedTo: "Sales Rep 2",
//                 },
//                 {
//                   id: 3,
//                   customerName: "Bob Johnson",
//                   date: "2024-01-13",
//                   reason: "Waiting for feedback",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   assignedTo: "Test Drive Manager",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ],
//       };
//       setOverdueModalData(mockData);
//       setOverdueModalLoading(false);
//     }, 500);
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setModalDealerData(null);
//     setCurrentModalUsers([]);
//     setIsLoadingDealerData(false);
//     setShowToast(false);
//   };

//   const closeOverdueModal = () => {
//     setShowOverdueModal(false);
//     setOverdueModalType(null);
//     setOverdueModalData(null);
//   };

//   const handleExportDealerUsersPNG = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.handleExportPNG();
//     }
//   };

//   const handleExportDealerUsersCSV = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.exportUsersToCSV();
//     }
//   };

//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) return;

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       const exportContainer = document.createElement("div");
//       exportContainer.style.cssText = `
//         position: fixed;
//         left: -9999px;
//         top: 0;
//         background: white;
//         z-index: 99999;
//         overflow: visible;
//         box-sizing: border-box;
//         opacity: 1;
//         padding: 0;
//         margin: 0;
//       `;

//       const clone = mainTableRef.current.cloneNode(true);
//       const tableContainer = clone.querySelector(".table-container");
//       const scrollContainer = clone.querySelector(".table-scroll");
//       const table = clone.querySelector(".data-table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");
//       const expandButtons = clone.querySelectorAll(".expand-btn");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       const originalRect = mainTableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       if (tableContainer) {
//         tableContainer.style.width = "100%";
//         tableContainer.style.overflow = "visible";
//         tableContainer.style.padding = "0";
//       }

//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.height = "auto";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "static";
//         scrollContainer.style.width = "100%";
//       }

//       if (table) {
//         table.style.width = "100%";
//         table.style.minWidth = "2100px";
//         table.style.position = "static";
//         table.style.tableLayout = "auto";
//         table.style.display = "table";
//       }

//       if (tableHead) {
//         tableHead.style.position = "static";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       stickyCells.forEach((cell) => {
//         cell.style.position = "static";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//         cell.style.backgroundColor = "#ffffff";
//       });

//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         const icon = btn.querySelector("i");

//         if (span) {
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         } else if (icon) {
//           icon.style.display = "none";
//         }
//       });

//       const exportButtons = clone.querySelectorAll(".btn-export");
//       exportButtons.forEach((btn) => {
//         btn.remove();
//       });

//       const interactiveElements = clone.querySelectorAll(
//         "button, select, input, .fa-spinner",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       exportContainer.appendChild(clone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           clone.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const cloneRect = clone.getBoundingClientRect();
//       const captureWidth = Math.max(cloneRect.width, 2100);
//       const captureHeight = cloneRect.height;

//       const paddedWidth = Math.ceil(captureWidth + 20);
//       const paddedHeight = Math.ceil(captureHeight + 20);

//       const dataUrl = await toPng(clone, {
//         quality: 1.0,
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
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("fa-spinner"))
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       document.body.removeChild(exportContainer);

//       const link = document.createElement("a");
//       link.download = `dealer-summary-${selectedFilter || "all"}-${
//         new Date().toISOString().split("T")[0]
//       }.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       if (button && originalHTML) {
//         button.innerHTML = originalHTML;
//         button.disabled = false;
//       }
//     } catch (error) {
//       console.error("❌ Error exporting main table PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     const headers = [
//       "Dealer Name",
//       "Total Users",
//       "Registered Users",
//       "Active Users",
//       "Created Enquiries",
//       "Digital",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Total Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Opportunities Converted",
//     ];

//     const getFormattedValueForExport = (
//       dealer,
//       mainFieldNames,
//       webFieldNames = [],
//     ) => {
//       let mainValue = 0;
//       let webValue = null;

//       for (let field of mainFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           mainValue = value;
//           break;
//         }
//       }

//       if (webFieldNames.length > 0) {
//         for (let field of webFieldNames) {
//           const value = field
//             .split(".")
//             .reduce((obj, key) => obj?.[key], dealer);
//           if (value !== undefined && value !== null) {
//             webValue = value;
//             break;
//           }
//         }
//       }

//       if (webValue !== null) {
//         return `${formatNumber(mainValue)} (${formatNumber(webValue)})`;
//       }

//       return formatNumber(mainValue);
//     };

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) => {
//         const row = [
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
//           getRawDealerValue(dealer, ["totalUsers"]),
//           getRawDealerValue(dealer, ["registerUsers"]),
//           getRawDealerValue(dealer, ["activeUsers"]),
//           getRawDealerValue(dealer, ["saLeads"]),
//           getRawDealerValue(dealer, ["manuallyEnteredLeads"]),
//           `"${getFormattedValueForExport(
//             dealer,
//             ["saFollowUps"],
//             ["webleadsFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedFollowUps"],
//             ["webCompletedFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["openFollowUps"],
//             ["webUpcomingFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedFollowUps"],
//             ["webOverdueFollowUps"],
//           )}"`,
//           getRawDealerValue(dealer, ["totalTestDrives", "saTestDrives"]),
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedTestDrives"],
//             ["webCompletedTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["upcomingTestDrives"],
//             ["webUpcomingTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedTestDrives"],
//             ["webOverdueTestDrives"],
//           )}"`,
//           getRawDealerValue(dealer, ["opportunitiesConverted"]),
//         ];

//         return row.join(",");
//       }),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `dealer-summary-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ==================== SUB-COMPONENTS ====================
//   const SortIcon = ({ column }) => (
//     <span className="sort-arrows inline-flex flex-col ml-1">
//       <span
//         className={`arrow-up text-[10px] ${
//           sortColumn === column && sortDirection === "asc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▲
//       </span>
//       <span
//         className={`arrow-down text-[10px] ${
//           sortColumn === column && sortDirection === "desc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▼
//       </span>
//     </span>
//   );

//   // ==================== RENDER ====================
//   return (
//     <>
//       {/* Main Table Section */}
//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
//         {/* Table Header */}
//         <div className="table-header px-4 py-1 border-b border-gray-200 flex flex-col sm:flex-row text-xs items-start justify-between gap-1 sm:gap-0 bg-gray-50 relative z-30">
//           <div>
//             <h2 className="table-title text-xs font-bold text-gray-900">
//               Dealer Summary — Engagement
//             </h2>
//           </div>
//           <div className="flex gap-2 self-end sm:self-auto">
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleExportMainTablePNG}
//               disabled={isDealersLoading || exportingPNG}
//             >
//               {exportingPNG ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </>
//               )}
//             </button>
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm"
//               onClick={handleExportCSV}
//               disabled={isDealersLoading}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//           </div>
//         </div>

//         {/* Table Content */}
//         <div ref={mainTableRef} className="table-container p-0 relative z-20">
//           {isDealersLoading ? (
//             <div className="flex flex-col items-center justify-center p-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//               <div className="text-gray-500 text-sm">
//                 Loading dealers data...
//               </div>
//             </div>
//           ) : !dealers || dealers.length === 0 ? (
//             <div className="flex justify-center items-center p-12">
//               <div className="text-gray-500 text-sm">
//                 {!dealers ? "Loading dealers..." : "No dealers found"}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div
//                 className="table-scroll overflow-x-auto relative z-10"
//                 style={{ maxHeight: "600px", overflowY: "auto" }}
//               >
//                 <table className="data-table w-full border-collapse text-xs min-w-[2100px] relative z-10">
//                   <thead className="table-thead bg-gray-50 sticky top-0 z-50">
//                     <tr className="text-xs">
//                       <th
//                         rowSpan={2}
//                         className="sticky left-0 bg-gray-50 z-60 border-r border-gray-300 px-1 py-2 font-semibold text-gray-900 text-left min-w-[20px] w-[20px]"
//                       >
//                         Dealer
//                       </th>
//                       <th
//                         colSpan={3}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
//                       >
//                         Users
//                       </th>
//                       <th
//                         colSpan={2}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-green-50"
//                       >
//                         Enquiries
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50"
//                       >
//                         Follow-ups
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-orange-50"
//                       >
//                         Test Drives
//                       </th>
//                       <th
//                         rowSpan={2}
//                         className="px-2 py-2 text-center font-semibold text-gray-700 bg-red-50"
//                       >
//                         Opportunities converted
//                       </th>
//                     </tr>

//                     <tr className="text-xs">
//                       {/* Users Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("registerUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Registered
//                           {hasMultipleDealers && (
//                             <SortIcon column="registerUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("activeUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Active
//                           {hasMultipleDealers && (
//                             <SortIcon column="activeUsers" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Leads Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saLeads")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && <SortIcon column="saLeads" />}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("manuallyEnteredLeads")
//                         }
//                       >
//                         <div className="flex items-center justify-center gap-1">
//                           <span>Digital</span>
//                           {hasMultipleDealers && (
//                             <SortIcon column="manuallyEnteredLeads" />
//                           )}
//                         </div>
//                       </th>

//                       {/* Followups Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && (
//                             <SortIcon column="saFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("completedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("openFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="openFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedFollowUps" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Test Drives Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("completedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("upcomingTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="upcomingTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="bg-white text-xs relative z-10">
//                     {getSortedDealersForSummary()
//                       .slice(0, tableLength)
//                       .map((dealer, index) => (
//                         <tr
//                           key={dealer.dealerId || dealer.id}
//                           className={`group transition-colors relative ${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } hover:bg-blue-50`}
//                         >
//                           <td className="sticky left-0 bg-inherit z-40 border-r border-gray-300 px-3 py-2 text-left text-xs text-gray-900 min-w-[140px] group-hover:bg-blue-50">
//                             <button
//                               className="expand-btn flex items-center cursor-pointer gap-2 text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                               onClick={() => handleDealerClick(dealer)}
//                             >
//                               <span className="font-semibold truncate group-hover:underline">
//                                 {dealer.dealerName || dealer.name}
//                               </span>
//                               <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                             </button>
//                           </td>

//                           {/* Users Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["totalUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["registerUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["activeUsers"])}
//                           </td>

//                           {/* Leads Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["saLeads"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["manuallyEnteredLeads"])}
//                           </td>

//                           {/* Follow-ups Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["saFollowUps"],
//                               ["webleadsFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedFollowUps"],
//                               ["webCompletedFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["openFollowUps"],
//                               ["webUpcomingFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedFollowUps"],
//                               ["webOverdueFollowUps"],
//                               true,
//                               () => handleOverdueClick(dealer, "followups"),
//                             )}
//                           </td>

//                           {/* Test Drives Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, [
//                               "totalTestDrives",
//                               "saTestDrives",
//                             ])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedTestDrives"],
//                               ["webCompletedTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["upcomingTestDrives"],
//                               ["webUpcomingTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedTestDrives"],
//                               ["webOverdueTestDrives"],
//                               true,
//                               () => handleOverdueClick(dealer, "testdrives"),
//                             )}
//                           </td>

//                           {/* Opportunities Data */}
//                           <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["opportunitiesConverted"])}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Show More/Less Buttons */}
//               {!isDealersLoading &&
//                 (selectedDealers.length > 0
//                   ? selectedDealers.length
//                   : dealers.length) > 10 && (
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-2 gap-2 sm:gap-0 relative z-30">
//                     <div className="text-xs text-gray-500">
//                       Showing{" "}
//                       {formatNumber(
//                         Math.min(
//                           tableLength,
//                           selectedDealers.length > 0
//                             ? selectedDealers.length
//                             : dealers.length,
//                         ),
//                       )}{" "}
//                       of{" "}
//                       {formatNumber(
//                         selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length,
//                       )}{" "}
//                       dealers
//                     </div>
//                     <div className="flex gap-1 self-end sm:self-auto">
//                       {tableLength <
//                         (selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length) && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength((prev) => prev + 10)}
//                         >
//                           <i className="fas fa-chevron-down text-[10px]"></i>
//                           Show More
//                         </button>
//                       )}
//                       {tableLength > 10 && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength(10)}
//                         >
//                           <i className="fas fa-chevron-up text-[10px]"></i>
//                           Show Less
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Overdue Details Modal */}
//       {showOverdueModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeOverdueModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {overdueModalType === "followups"
//                   ? "Overdue Follow-ups"
//                   : "Overdue Test Drives"}{" "}
//                 - {overdueModalData?.dealerName || "Dealer"}
//                 <span className="text-sm font-normal text-gray-600 ml-2">
//                   ({formatNumber(overdueModalData?.total || 0)} total)
//                 </span>
//               </h2>
//               <button
//                 onClick={closeOverdueModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-auto">
//               {overdueModalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-12">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-500 text-sm">
//                     Loading overdue details...
//                   </div>
//                 </div>
//               ) : overdueModalData?.items &&
//                 overdueModalData.items.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100 border-b border-gray-300">
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           ID
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Customer Name
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Date
//                         </th>
//                         {overdueModalType === "followups" ? (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Reason
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         ) : (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Vehicle
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {overdueModalData.items.map((item, index) => (
//                         <tr
//                           key={item.id}
//                           className={`${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } border-b border-gray-200 hover:bg-blue-50`}
//                         >
//                           <td className="px-4 py-2">{item.id}</td>
//                           <td className="px-4 py-2 font-medium">
//                             {item.customerName}
//                           </td>
//                           <td className="px-4 py-2">{item.date}</td>
//                           {overdueModalType === "followups" ? (
//                             <>
//                               <td className="px-4 py-2">{item.reason}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           ) : (
//                             <>
//                               <td className="px-4 py-2">{item.vehicle}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex justify-center items-center p-12">
//                   <div className="text-gray-500 text-sm">
//                     No overdue{" "}
//                     {overdueModalType === "followups"
//                       ? "follow-ups"
//                       : "test drives"}{" "}
//                     found.
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeOverdueModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Details Modal - Continuation in next file due to size */}
//       {showUserModal && selectedDealer && (
//         <UserDetailsModal
//           selectedDealer={selectedDealer}
//           showToast={showToast}
//           toastMessage={toastMessage}
//           closeModal={closeModal}
//           formatNumber={formatNumber}
//           currentModalUsers={currentModalUsers}
//           onGetSortedUsers={onGetSortedUsers}
//           modalFilter={modalFilter}
//           handleModalFilterChange={handleModalFilterChange}
//           isLoadingDealerData={isLoadingDealerData}
//           modalCustomStartDate={modalCustomStartDate}
//           setModalCustomStartDate={setModalCustomStartDate}
//           modalCustomEndDate={modalCustomEndDate}
//           setModalCustomEndDate={setModalCustomEndDate}
//           handleApplyCustomDates={handleApplyCustomDates}
//           handleResetCustomDates={handleResetCustomDates}
//           loadingUsers={loadingUsers}
//           handleExportDealerUsersPNG={handleExportDealerUsersPNG}
//           handleExportDealerUsersCSV={handleExportDealerUsersCSV}
//           getCurrentDealerData={getCurrentDealerData}
//           getDealerValue={getDealerValue}
//           dealerUserDetailsRef={dealerUserDetailsRef}
//           dealerUsers={dealerUsers}
//           modalDealerData={modalDealerData}
//           updateCurrentModalUsers={updateCurrentModalUsers}
//         />
//       )}
//     </>
//   );
// };

// // User Details Modal Component
// const UserDetailsModal = ({
//   selectedDealer,
//   showToast,
//   toastMessage,
//   closeModal,
//   formatNumber,
//   currentModalUsers,
//   onGetSortedUsers,
//   modalFilter,
//   handleModalFilterChange,
//   isLoadingDealerData,
//   modalCustomStartDate,
//   setModalCustomStartDate,
//   modalCustomEndDate,
//   setModalCustomEndDate,
//   handleApplyCustomDates,
//   handleResetCustomDates,
//   loadingUsers,
//   handleExportDealerUsersPNG,
//   handleExportDealerUsersCSV,
//   getCurrentDealerData,
//   getDealerValue,
//   dealerUserDetailsRef,
//   dealerUsers,
//   modalDealerData,
//   updateCurrentModalUsers,
// }) => {
//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//       style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//       onClick={closeModal}
//     >
//       {/* Toast Notification */}
//       {showToast && (
//         <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
//           <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//             <i className="fas fa-exclamation-circle"></i>
//             <span>{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       <div
//         className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//           {/* Desktop Header */}
//           <div className="hidden md:flex items-center gap-4">
//             <h2 className="text-xl font-bold text-gray-800">
//               {selectedDealer.dealerName || selectedDealer.name}
//             </h2>
//             <div className="flex items-center gap-2">
//               <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                 {formatNumber(
//                   currentModalUsers.length > 0
//                     ? currentModalUsers.length
//                     : onGetSortedUsers(
//                         selectedDealer.dealerId || selectedDealer.id,
//                       )?.length || 0,
//                 )}{" "}
//                 users
//               </span>

//               <select
//                 value={modalFilter}
//                 onChange={(e) => handleModalFilterChange(e.target.value)}
//                 className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none min-w-[150px] text-xs"
//                 disabled={isLoadingDealerData}
//               >
//                 <option value="DAY">Today</option>
//                 <option value="YESTERDAY">Yesterday</option>
//                 <option value="WEEK">This Week</option>
//                 <option value="LAST_WEEK">Last Week</option>
//                 <option value="MTD">This Month</option>
//                 <option value="LAST_MONTH">Last Month</option>
//                 <option value="QTD">This Quarter</option>
//                 <option value="LAST_QUARTER">Last Quarter</option>
//                 <option value="SIX_MONTH">Last 6 Months</option>
//                 <option value="YTD">This Year</option>
//                 <option value="LIFETIME">Lifetime</option>
//                 <option value="CUSTOM">Custom Range</option>
//               </select>

//               {modalFilter === "CUSTOM" && (
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
//                     <input
//                       type="date"
//                       value={modalCustomStartDate || ""}
//                       onChange={(e) => setModalCustomStartDate(e.target.value)}
//                       className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                       disabled={isLoadingDealerData}
//                     />
//                     <span className="text-gray-400">-</span>
//                     <input
//                       type="date"
//                       value={modalCustomEndDate || ""}
//                       onChange={(e) => setModalCustomEndDate(e.target.value)}
//                       className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                       disabled={isLoadingDealerData}
//                     />
//                   </div>

//                   <button
//                     onClick={handleApplyCustomDates}
//                     disabled={isLoadingDealerData}
//                     className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
//                   >
//                     Apply
//                   </button>

//                   <button
//                     onClick={handleResetCustomDates}
//                     disabled={isLoadingDealerData}
//                     className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               )}

//               {(loadingUsers[selectedDealer.dealerId || selectedDealer.id] ||
//                 isLoadingDealerData) && (
//                 <span className="text-xs text-blue-600 whitespace-nowrap">
//                   <i className="fas fa-spinner fa-spin mr-1"></i>
//                   Updating...
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Mobile Header */}
//           <div className="md:hidden flex items-center justify-between w-full">
//             <h2 className="text-lg font-bold text-gray-800 leading-tight">
//               User Details
//               <br />
//               <span className="text-sm font-normal">
//                 {selectedDealer.dealerName || selectedDealer.name}
//               </span>
//             </h2>
//             <button
//               onClick={closeModal}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-times"></i>
//             </button>
//           </div>

//           {/* Desktop Export Buttons */}
//           <div className="hidden md:flex items-center gap-2">
//             <button
//               onClick={handleExportDealerUsersPNG}
//               className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-image text-xs"></i>
//               Export PNG
//             </button>

//             <button
//               onClick={handleExportDealerUsersCSV}
//               className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>

//             <button
//               onClick={closeModal}
//               className="text-gray-400 hover:text-gray-600 text-2xl"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-times"></i>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Controls */}
//         <div className="md:hidden mb-4 space-y-3">
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
//               {formatNumber(
//                 currentModalUsers.length > 0
//                   ? currentModalUsers.length
//                   : onGetSortedUsers(
//                       selectedDealer.dealerId || selectedDealer.id,
//                     )?.length || 0,
//               )}{" "}
//               users
//             </span>

//             <select
//               value={modalFilter}
//               onChange={(e) => handleModalFilterChange(e.target.value)}
//               className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none text-xs flex-1 min-w-[150px]"
//               disabled={isLoadingDealerData}
//             >
//               <option value="DAY">Today</option>
//               <option value="YESTERDAY">Yesterday</option>
//               <option value="WEEK">This Week</option>
//               <option value="LAST_WEEK">Last Week</option>
//               <option value="MTD">This Month</option>
//               <option value="LAST_MONTH">Last Month</option>
//               <option value="QTD">This Quarter</option>
//               <option value="LAST_QUARTER">Last Quarter</option>
//               <option value="SIX_MONTH">Last 6 Months</option>
//               <option value="YTD">This Year</option>
//               <option value="LIFETIME">Lifetime</option>
//               <option value="CUSTOM">Custom Range</option>
//             </select>
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={handleExportDealerUsersPNG}
//               className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-image text-xs"></i>
//               Export PNG
//             </button>

//             <button
//               onClick={handleExportDealerUsersCSV}
//               className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
//               disabled={isLoadingDealerData}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//           </div>

//           {modalFilter === "CUSTOM" && (
//             <div className="space-y-2">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
//                 <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1 w-full">
//                   <input
//                     type="date"
//                     value={modalCustomStartDate || ""}
//                     onChange={(e) => setModalCustomStartDate(e.target.value)}
//                     className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                     disabled={isLoadingDealerData}
//                   />
//                   <span className="text-gray-400">-</span>
//                   <input
//                     type="date"
//                     value={modalCustomEndDate || ""}
//                     onChange={(e) => setModalCustomEndDate(e.target.value)}
//                     className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                     disabled={isLoadingDealerData}
//                   />
//                 </div>

//                 <div className="flex items-center gap-2 w-full">
//                   <button
//                     onClick={handleApplyCustomDates}
//                     disabled={isLoadingDealerData}
//                     className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex-1"
//                   >
//                     Apply
//                   </button>

//                   <button
//                     onClick={handleResetCustomDates}
//                     disabled={isLoadingDealerData}
//                     className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap flex-1"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {(loadingUsers[selectedDealer.dealerId || selectedDealer.id] ||
//             isLoadingDealerData) && (
//             <div className="flex items-center">
//               <span className="text-xs text-blue-600 whitespace-nowrap">
//                 <i className="fas fa-spinner fa-spin mr-1"></i>
//                 Updating...
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Dealer Summary Section */}
//         <div className="mb-4 flex-shrink-0">
//           {(() => {
//             const currentDealer = getCurrentDealerData();

//             return (
//               <div
//                 className="overflow-x-auto"
//                 style={{
//                   scrollbarWidth: "thin",
//                   scrollbarColor: "#d1d5db #f3f4f6",
//                 }}
//               >
//                 <style>{`
//                   .overflow-x-auto::-webkit-scrollbar {
//                     height: 6px;
//                   }
//                   .overflow-x-auto::-webkit-scrollbar-track {
//                     background: #f3f4f6;
//                     border-radius: 3px;
//                   }
//                   .overflow-x-auto::-webkit-scrollbar-thumb {
//                     background: #d1d5db;
//                     border-radius: 3px;
//                   }
//                   .overflow-x-auto::-webkit-scrollbar-thumb:hover {
//                     background: #9ca3af;
//                   }
//                 `}</style>
//                 <table className="w-full border-collapse text-xs min-w-max">
//                   <thead>
//                     <tr className="bg-gray-100 border-b border-gray-300">
//                       <th className="px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Total
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Registered
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Active
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Created Enquiries
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Digital
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Created Follow-ups
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Completed Follow-ups
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Upcoming Follow-ups
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Overdue Follow-ups
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Total Test Drives
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Completed Test Drives
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Upcoming Test Drives
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                         Overdue Test Drives
//                       </th>
//                       <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
//                         Opportunities Converted
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr className="bg-white border-b border-gray-200">
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                         {getDealerValue(currentDealer, ["totalUsers"])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                         {getDealerValue(currentDealer, ["registerUsers"])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                         {getDealerValue(currentDealer, ["activeUsers"])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                         {getDealerValue(currentDealer, ["saLeads"])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                         {getDealerValue(currentDealer, [
//                           "manuallyEnteredLeads",
//                         ])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                         {getDealerValue(
//                           currentDealer,
//                           ["saFollowUps"],
//                           ["webleadsFollowUps"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["completedFollowUps"],
//                           ["webCompletedFollowUps"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["openFollowUps"],
//                           ["webUpcomingFollowUps"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["closedFollowUps"],
//                           ["webOverdueFollowUps"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                         {getDealerValue(currentDealer, [
//                           "totalTestDrives",
//                           "saTestDrives",
//                         ])}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["completedTestDrives"],
//                           ["webCompletedTestDrives"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["upcomingTestDrives"],
//                           ["webUpcomingTestDrives"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                         {getDealerValue(
//                           currentDealer,
//                           ["closedTestDrives"],
//                           ["webOverdueTestDrives"],
//                         )}
//                       </td>
//                       <td className="px-2 py-1.5 text-right font-semibold text-green-600">
//                         {getDealerValue(currentDealer, [
//                           "opportunitiesConverted",
//                         ])}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             );
//           })()}
//         </div>

//         {/* User Details Content */}
//         <div className="flex-1 overflow-auto min-h-0">
//           <DealerUserDetails
//             ref={dealerUserDetailsRef}
//             dealer={selectedDealer}
//             loadingUsers={loadingUsers}
//             onGetSortedUsers={onGetSortedUsers}
//             dealerUsers={dealerUsers}
//             filteredUsers={modalDealerData?.users}
//             onUsersUpdated={updateCurrentModalUsers}
//           />
//         </div>

//         {/* Modal Footer */}
//         <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//           <button
//             onClick={closeModal}
//             className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//             disabled={isLoadingDealerData}
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DealerSummaryTable;

// WITHOUTR PREVENTING BG SCROLL WHILE OPENING THE MODAL
// import React, { useState, useEffect, useRef } from "react";
// import { toPng } from "html-to-image";
// import DealerUserDetails from "./DealerUserDetails";

// const DealerSummaryTable = ({
//   dealers,
//   selectedDealers,
//   tableLength,
//   setTableLength,
//   dealerUsers,
//   loadingUsers,
//   sortColumn,
//   sortDirection,
//   onSortData,
//   onGetSortedUsers,
//   onExportCSV,
//   onToggleSummaryRow,
//   selectedFilter,
//   onFilterChange,
//   onRefreshDashboardData,
//   onFetchDealerUsers,
//   customStartDate,
//   customEndDate,
// }) => {
//   // ==================== STATE MANAGEMENT ====================
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [isDealersLoading, setIsDealersLoading] = useState(true);
//   const [modalCustomStartDate, setModalCustomStartDate] =
//     useState(customStartDate);
//   const [modalCustomEndDate, setModalCustomEndDate] = useState(customEndDate);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [exportingPNG, setExportingPNG] = useState(false);

//   // Overdue modal state
//   const [showOverdueModal, setShowOverdueModal] = useState(false);
//   const [overdueModalType, setOverdueModalType] = useState(null);
//   const [overdueModalData, setOverdueModalData] = useState(null);
//   const [overdueModalLoading, setOverdueModalLoading] = useState(false);

//   // Refs
//   const mainTableRef = useRef(null);
//   const dealerUserDetailsRef = useRef(null);

//   // ==================== COMPUTED VALUES ====================
//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

//   // ==================== EFFECTS ====================
//   useEffect(() => {
//     if (dealers !== undefined) {
//       setIsDealersLoading(false);
//     }
//   }, [dealers]);

//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalCustomStartDate(customStartDate);
//       setModalCustomEndDate(customEndDate);
//     }
//   }, [showUserModal, selectedFilter, customStartDate, customEndDate]);

//   // ==================== HELPER FUNCTIONS ====================
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return "0";
//     return Number(num).toLocaleString("en-IN");
//   };

//   const areModalDatesValid = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       return new Date(modalCustomStartDate) <= new Date(modalCustomEndDate);
//     }
//     return false;
//   };

//   const getRawDealerValue = (dealer, fieldNames) => {
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         return value;
//       }
//     }
//     return 0;
//   };

//   const getDealerValue = (
//     dealer,
//     fieldNames,
//     webFieldNames = [],
//     clickable = false,
//     onClick = null,
//   ) => {
//     let mainValue = "0";
//     let webValue = null;

//     // Get main value
//     for (let field of fieldNames) {
//       const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//       if (value !== undefined && value !== null) {
//         mainValue = formatNumber(value);
//         break;
//       }
//     }

//     // Get web value if provided
//     if (webFieldNames.length > 0) {
//       for (let field of webFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           webValue = formatNumber(value);
//           break;
//         }
//       }
//     }

//     // Return formatted string with web value in brackets
//     if (webValue !== null) {
//       return (
//         <div className="flex items-center justify-end">
//           {clickable ? (
//             <button
//               className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (onClick) onClick();
//               }}
//               title={`Click to view ${
//                 fieldNames[0].includes("Follow")
//                   ? "overdue follow-ups"
//                   : "overdue test drives"
//               }`}
//             >
//               {mainValue}
//             </button>
//           ) : (
//             <span>{mainValue}</span>
//           )}
//           <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
//             ({webValue})
//           </span>
//         </div>
//       );
//     }

//     return clickable ? (
//       <button
//         className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer text-right w-full"
//         onClick={(e) => {
//           e.stopPropagation();
//           if (onClick) onClick();
//         }}
//         title={`Click to view ${
//           fieldNames[0].includes("Follow")
//             ? "overdue follow-ups"
//             : "overdue test drives"
//         }`}
//       >
//         {mainValue}
//       </button>
//     ) : (
//       <div className="text-right">{mainValue}</div>
//     );
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = a[sortColumn] ?? 0;
//       const valB = b[sortColumn] ?? 0;
//       return sortDirection === "asc" ? valA - valB : valB - valA;
//     });
//   };

//   const getFilterLabel = (filter) => {
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

//   // ==================== EVENT HANDLERS ====================
//   const handleModalFilterChange = async (
//     filterValue,
//     applyCustomDates = false,
//   ) => {
//     if (!selectedDealer) {
//       return;
//     }

//     if (filterValue === "CUSTOM" && !applyCustomDates) {
//       setModalFilter("CUSTOM");
//       return;
//     }

//     if (filterValue === "CUSTOM" && applyCustomDates) {
//       if (!modalCustomStartDate || !modalCustomEndDate) {
//         setToastMessage("Please select both start and end dates");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }

//       const isValid = areModalDatesValid();
//       if (!isValid) {
//         setToastMessage("End date cannot be before start date");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     // Just trigger the parent to fetch dealer users
//     if (onFetchDealerUsers) {
//       try {
//         await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           filterValue === "CUSTOM" ? modalCustomStartDate : undefined,
//           filterValue === "CUSTOM" ? modalCustomEndDate : undefined,
//         );
//       } catch (error) {
//         console.error("❌ Failed to fetch dealer data:", error);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }
//   };

//   const handleApplyCustomDates = () => {
//     if (!modalCustomStartDate || !modalCustomEndDate) {
//       setToastMessage("Please select both start and end dates");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     const isValid = areModalDatesValid();
//     if (!isValid) {
//       setToastMessage("End date cannot be before start date");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     handleModalFilterChange("CUSTOM", true);
//   };

//   const handleResetCustomDates = () => {
//     setModalFilter(selectedFilter);
//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(customStartDate || "");
//       setModalCustomEndDate(customEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   const handleDealerClick = async (dealer) => {
//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalFilter(selectedFilter);
//     setModalCustomStartDate(customStartDate);
//     setModalCustomEndDate(customEndDate);

//     setIsLoadingDealerData(true);

//     // Fetch initial dealer data
//     if (onFetchDealerUsers) {
//       try {
//         await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           selectedFilter === "CUSTOM" ? customStartDate : undefined,
//           selectedFilter === "CUSTOM" ? customEndDate : undefined,
//         );
//       } catch (error) {
//         console.error("❌ Failed to fetch initial dealer data:", error);
//       } finally {
//         setIsLoadingDealerData(false);
//       }
//     } else {
//       setIsLoadingDealerData(false);
//     }

//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   const handleOverdueClick = async (dealer, type) => {
//     setOverdueModalType(type);
//     setOverdueModalData(null);
//     setOverdueModalLoading(true);
//     setShowOverdueModal(true);

//     setTimeout(() => {
//       const mockData = {
//         dealerName: dealer.dealerName || dealer.name,
//         type: type,
//         total:
//           type === "followups"
//             ? dealer.closedFollowUps || 0
//             : dealer.closedTestDrives || dealer.saTestDrives || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   assignedTo: "Sales Rep 1",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   assignedTo: "Sales Rep 2",
//                 },
//                 {
//                   id: 3,
//                   customerName: "Bob Johnson",
//                   date: "2024-01-13",
//                   reason: "Waiting for feedback",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   assignedTo: "Test Drive Manager",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   assignedTo: "Sales Rep 1",
//                 },
//               ],
//       };
//       setOverdueModalData(mockData);
//       setOverdueModalLoading(false);
//     }, 500);
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setIsLoadingDealerData(false);
//     setShowToast(false);
//   };

//   const closeOverdueModal = () => {
//     setShowOverdueModal(false);
//     setOverdueModalType(null);
//     setOverdueModalData(null);
//   };

//   const handleExportDealerUsersPNG = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.handleExportPNG();
//     }
//   };

//   const handleExportDealerUsersCSV = () => {
//     if (dealerUserDetailsRef.current) {
//       dealerUserDetailsRef.current.exportUsersToCSV();
//     }
//   };

//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) return;

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       const exportContainer = document.createElement("div");
//       exportContainer.style.cssText = `
//         position: fixed;
//         left: -9999px;
//         top: 0;
//         background: white;
//         z-index: 99999;
//         overflow: visible;
//         box-sizing: border-box;
//         opacity: 1;
//         padding: 0;
//         margin: 0;
//       `;

//       const clone = mainTableRef.current.cloneNode(true);
//       const tableContainer = clone.querySelector(".table-container");
//       const scrollContainer = clone.querySelector(".table-scroll");
//       const table = clone.querySelector(".data-table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");
//       const expandButtons = clone.querySelectorAll(".expand-btn");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       const originalRect = mainTableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       if (tableContainer) {
//         tableContainer.style.width = "100%";
//         tableContainer.style.overflow = "visible";
//         tableContainer.style.padding = "0";
//       }

//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.height = "auto";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "static";
//         scrollContainer.style.width = "100%";
//       }

//       if (table) {
//         table.style.width = "100%";
//         table.style.minWidth = "2100px";
//         table.style.position = "static";
//         table.style.tableLayout = "auto";
//         table.style.display = "table";
//       }

//       if (tableHead) {
//         tableHead.style.position = "static";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       stickyCells.forEach((cell) => {
//         cell.style.position = "static";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//         cell.style.backgroundColor = "#ffffff";
//       });

//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         const icon = btn.querySelector("i");

//         if (span) {
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         } else if (icon) {
//           icon.style.display = "none";
//         }
//       });

//       const exportButtons = clone.querySelectorAll(".btn-export");
//       exportButtons.forEach((btn) => {
//         btn.remove();
//       });

//       const interactiveElements = clone.querySelectorAll(
//         "button, select, input, .fa-spinner",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       exportContainer.appendChild(clone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           clone.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 500));

//       const cloneRect = clone.getBoundingClientRect();
//       const captureWidth = Math.max(cloneRect.width, 2100);
//       const captureHeight = cloneRect.height;

//       const paddedWidth = Math.ceil(captureWidth + 20);
//       const paddedHeight = Math.ceil(captureHeight + 20);

//       const dataUrl = await toPng(clone, {
//         quality: 1.0,
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
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("fa-spinner"))
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       document.body.removeChild(exportContainer);

//       const link = document.createElement("a");
//       link.download = `dealer-summary-${selectedFilter || "all"}-${
//         new Date().toISOString().split("T")[0]
//       }.png`;
//       link.href = dataUrl;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       if (button && originalHTML) {
//         button.innerHTML = originalHTML;
//         button.disabled = false;
//       }
//     } catch (error) {
//       console.error("❌ Error exporting main table PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     const headers = [
//       "Dealer Name",
//       "Total Users",
//       "Registered Users",
//       "Active Users",
//       "Created Enquiries",
//       "Digital",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Total Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Opportunities Converted",
//     ];

//     const getFormattedValueForExport = (
//       dealer,
//       mainFieldNames,
//       webFieldNames = [],
//     ) => {
//       let mainValue = 0;
//       let webValue = null;

//       for (let field of mainFieldNames) {
//         const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
//         if (value !== undefined && value !== null) {
//           mainValue = value;
//           break;
//         }
//       }

//       if (webFieldNames.length > 0) {
//         for (let field of webFieldNames) {
//           const value = field
//             .split(".")
//             .reduce((obj, key) => obj?.[key], dealer);
//           if (value !== undefined && value !== null) {
//             webValue = value;
//             break;
//           }
//         }
//       }

//       if (webValue !== null) {
//         return `${formatNumber(mainValue)} (${formatNumber(webValue)})`;
//       }

//       return formatNumber(mainValue);
//     };

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) => {
//         const row = [
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
//           getRawDealerValue(dealer, ["totalUsers"]),
//           getRawDealerValue(dealer, ["registerUsers"]),
//           getRawDealerValue(dealer, ["activeUsers"]),
//           getRawDealerValue(dealer, ["saLeads"]),
//           getRawDealerValue(dealer, ["manuallyEnteredLeads"]),
//           `"${getFormattedValueForExport(
//             dealer,
//             ["saFollowUps"],
//             ["webleadsFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedFollowUps"],
//             ["webCompletedFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["openFollowUps"],
//             ["webUpcomingFollowUps"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedFollowUps"],
//             ["webOverdueFollowUps"],
//           )}"`,
//           getRawDealerValue(dealer, ["totalTestDrives", "saTestDrives"]),
//           `"${getFormattedValueForExport(
//             dealer,
//             ["completedTestDrives"],
//             ["webCompletedTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["upcomingTestDrives"],
//             ["webUpcomingTestDrives"],
//           )}"`,
//           `"${getFormattedValueForExport(
//             dealer,
//             ["closedTestDrives"],
//             ["webOverdueTestDrives"],
//           )}"`,
//           getRawDealerValue(dealer, ["opportunitiesConverted"]),
//         ];

//         return row.join(",");
//       }),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `dealer-summary-${new Date().toISOString().split("T")[0]}.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // ==================== SUB-COMPONENTS ====================
//   const SortIcon = ({ column }) => (
//     <span className="sort-arrows inline-flex flex-col ml-1">
//       <span
//         className={`arrow-up text-[10px] ${
//           sortColumn === column && sortDirection === "asc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▲
//       </span>
//       <span
//         className={`arrow-down text-[10px] ${
//           sortColumn === column && sortDirection === "desc"
//             ? "text-[#222fb9]"
//             : "text-gray-400"
//         }`}
//       >
//         ▼
//       </span>
//     </span>
//   );

//   // ==================== RENDER ====================
//   return (
//     <>
//       {/* Main Table Section */}
//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
//         {/* Table Header */}
//         <div className="table-header px-4 py-1 border-b border-gray-200 flex flex-col sm:flex-row text-xs items-start justify-between gap-1 sm:gap-0 bg-gray-50 relative z-30">
//           <div>
//             <h2 className="table-title text-xs font-bold text-gray-900">
//               Dealer Summary — Engagement
//             </h2>
//           </div>
//           <div className="flex gap-2 self-end sm:self-auto">
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleExportMainTablePNG}
//               disabled={isDealersLoading || exportingPNG}
//             >
//               {exportingPNG ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin text-xs"></i>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNG
//                 </>
//               )}
//             </button>
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm"
//               onClick={handleExportCSV}
//               disabled={isDealersLoading}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//           </div>
//         </div>

//         {/* Table Content */}
//         <div ref={mainTableRef} className="table-container p-0 relative z-20">
//           {isDealersLoading ? (
//             <div className="flex flex-col items-center justify-center p-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//               <div className="text-gray-500 text-sm">
//                 Loading dealers data...
//               </div>
//             </div>
//           ) : !dealers || dealers.length === 0 ? (
//             <div className="flex justify-center items-center p-12">
//               <div className="text-gray-500 text-sm">
//                 {!dealers ? "Loading dealers..." : "No dealers found"}
//               </div>
//             </div>
//           ) : (
//             <>
//               <div
//                 className="table-scroll overflow-x-auto relative z-10"
//                 style={{ maxHeight: "600px", overflowY: "auto" }}
//               >
//                 <table className="data-table w-full border-collapse text-xs min-w-[2100px] relative z-10">
//                   <thead className="table-thead bg-gray-50 sticky top-0 z-50">
//                     <tr className="text-xs">
//                       <th
//                         rowSpan={2}
//                         className="sticky left-0 bg-gray-50 z-60 border-r border-gray-300 px-1 py-2 font-semibold text-gray-900 text-left min-w-[20px] w-[20px]"
//                       >
//                         Dealer
//                       </th>
//                       <th
//                         colSpan={3}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
//                       >
//                         Users
//                       </th>
//                       <th
//                         colSpan={2}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-green-50"
//                       >
//                         Enquiries
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50"
//                       >
//                         Follow-ups
//                       </th>
//                       <th
//                         colSpan={4}
//                         className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-orange-50"
//                       >
//                         Test Drives
//                       </th>
//                       <th
//                         rowSpan={2}
//                         className="px-2 py-2 text-center font-semibold text-gray-700 bg-red-50"
//                       >
//                         Opportunities converted
//                       </th>
//                     </tr>

//                     <tr className="text-xs">
//                       {/* Users Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("registerUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Registered
//                           {hasMultipleDealers && (
//                             <SortIcon column="registerUsers" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("activeUsers")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Active
//                           {hasMultipleDealers && (
//                             <SortIcon column="activeUsers" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Leads Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saLeads")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && <SortIcon column="saLeads" />}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("manuallyEnteredLeads")
//                         }
//                       >
//                         <div className="flex items-center justify-center gap-1">
//                           <span>Digital</span>
//                           {hasMultipleDealers && (
//                             <SortIcon column="manuallyEnteredLeads" />
//                           )}
//                         </div>
//                       </th>

//                       {/* Followups Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("saFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
//                           {hasMultipleDealers && (
//                             <SortIcon column="saFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("completedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("openFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="openFollowUps" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedFollowUps")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedFollowUps" />
//                           )}
//                         </span>
//                       </th>

//                       {/* Test Drives Sub-headers */}
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Total
//                           {hasMultipleDealers && (
//                             <SortIcon column="totalTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers &&
//                           onSortData("completedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Completed
//                           {hasMultipleDealers && (
//                             <SortIcon column="completedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("upcomingTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Upcoming
//                           {hasMultipleDealers && (
//                             <SortIcon column="upcomingTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("closedTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Overdue
//                           {hasMultipleDealers && (
//                             <SortIcon column="closedTestDrives" />
//                           )}
//                         </span>
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="bg-white text-xs relative z-10">
//                     {getSortedDealersForSummary()
//                       .slice(0, tableLength)
//                       .map((dealer, index) => (
//                         <tr
//                           key={dealer.dealerId || dealer.id}
//                           className={`group transition-colors relative ${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } hover:bg-blue-50`}
//                         >
//                           <td className="sticky left-0 bg-inherit z-40 border-r border-gray-300 px-3 py-2 text-left text-xs text-gray-900 min-w-[140px] group-hover:bg-blue-50">
//                             <button
//                               className="expand-btn flex items-center cursor-pointer gap-2 text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                               onClick={() => handleDealerClick(dealer)}
//                             >
//                               <span className="font-semibold truncate group-hover:underline">
//                                 {dealer.dealerName || dealer.name}
//                               </span>
//                               <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                             </button>
//                           </td>

//                           {/* Users Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["totalUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["registerUsers"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["activeUsers"])}
//                           </td>

//                           {/* Leads Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["saLeads"])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["manuallyEnteredLeads"])}
//                           </td>

//                           {/* Follow-ups Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["saFollowUps"],
//                               ["webleadsFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedFollowUps"],
//                               ["webCompletedFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["openFollowUps"],
//                               ["webUpcomingFollowUps"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedFollowUps"],
//                               ["webOverdueFollowUps"],
//                               true,
//                               () => handleOverdueClick(dealer, "followups"),
//                             )}
//                           </td>

//                           {/* Test Drives Data */}
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, [
//                               "totalTestDrives",
//                               "saTestDrives",
//                             ])}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["completedTestDrives"],
//                               ["webCompletedTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["upcomingTestDrives"],
//                               ["webUpcomingTestDrives"],
//                             )}
//                           </td>
//                           <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(
//                               dealer,
//                               ["closedTestDrives"],
//                               ["webOverdueTestDrives"],
//                               true,
//                               () => handleOverdueClick(dealer, "testdrives"),
//                             )}
//                           </td>

//                           {/* Opportunities Data */}
//                           <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                             {getDealerValue(dealer, ["opportunitiesConverted"])}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Show More/Less Buttons */}
//               {!isDealersLoading &&
//                 (selectedDealers.length > 0
//                   ? selectedDealers.length
//                   : dealers.length) > 10 && (
//                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-2 gap-2 sm:gap-0 relative z-30">
//                     <div className="text-xs text-gray-500">
//                       Showing{" "}
//                       {formatNumber(
//                         Math.min(
//                           tableLength,
//                           selectedDealers.length > 0
//                             ? selectedDealers.length
//                             : dealers.length,
//                         ),
//                       )}{" "}
//                       of{" "}
//                       {formatNumber(
//                         selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length,
//                       )}{" "}
//                       dealers
//                     </div>
//                     <div className="flex gap-1 self-end sm:self-auto">
//                       {tableLength <
//                         (selectedDealers.length > 0
//                           ? selectedDealers.length
//                           : dealers.length) && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength((prev) => prev + 10)}
//                         >
//                           <i className="fas fa-chevron-down text-[10px]"></i>
//                           Show More
//                         </button>
//                       )}
//                       {tableLength > 10 && (
//                         <button
//                           className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                           onClick={() => setTableLength(10)}
//                         >
//                           <i className="fas fa-chevron-up text-[10px]"></i>
//                           Show Less
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Overdue Details Modal */}
//       {showOverdueModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeOverdueModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {overdueModalType === "followups"
//                   ? "Overdue Follow-ups"
//                   : "Overdue Test Drives"}{" "}
//                 - {overdueModalData?.dealerName || "Dealer"}
//                 <span className="text-sm font-normal text-gray-600 ml-2">
//                   ({formatNumber(overdueModalData?.total || 0)} total)
//                 </span>
//               </h2>
//               <button
//                 onClick={closeOverdueModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-auto">
//               {overdueModalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-12">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-500 text-sm">
//                     Loading overdue details...
//                   </div>
//                 </div>
//               ) : overdueModalData?.items &&
//                 overdueModalData.items.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-100 border-b border-gray-300">
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           ID
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Customer Name
//                         </th>
//                         <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                           Date
//                         </th>
//                         {overdueModalType === "followups" ? (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Reason
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         ) : (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Vehicle
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {overdueModalData.items.map((item, index) => (
//                         <tr
//                           key={item.id}
//                           className={`${
//                             index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                           } border-b border-gray-200 hover:bg-blue-50`}
//                         >
//                           <td className="px-4 py-2">{item.id}</td>
//                           <td className="px-4 py-2 font-medium">
//                             {item.customerName}
//                           </td>
//                           <td className="px-4 py-2">{item.date}</td>
//                           {overdueModalType === "followups" ? (
//                             <>
//                               <td className="px-4 py-2">{item.reason}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           ) : (
//                             <>
//                               <td className="px-4 py-2">{item.vehicle}</td>
//                               <td className="px-4 py-2">{item.assignedTo}</td>
//                             </>
//                           )}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex justify-center items-center p-12">
//                   <div className="text-gray-500 text-sm">
//                     No overdue{" "}
//                     {overdueModalType === "followups"
//                       ? "follow-ups"
//                       : "test drives"}{" "}
//                     found.
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeOverdueModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Details Modal */}
//       {showUserModal && selectedDealer && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           {/* Toast Notification */}
//           {showToast && (
//             <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
//               <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//                 <i className="fas fa-exclamation-circle"></i>
//                 <span>{toastMessage}</span>
//               </div>
//             </div>
//           )}

//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <DealerUserDetails
//               ref={dealerUserDetailsRef}
//               dealer={selectedDealer}
//               loadingUsers={loadingUsers}
//               onGetSortedUsers={onGetSortedUsers}
//               dealerUsers={dealerUsers}
//               // Modal specific props
//               isModal={true}
//               modalFilter={modalFilter}
//               onModalFilterChange={handleModalFilterChange}
//               modalCustomStartDate={modalCustomStartDate}
//               modalCustomEndDate={modalCustomEndDate}
//               onModalCustomStartDateChange={setModalCustomStartDate}
//               onModalCustomEndDateChange={setModalCustomEndDate}
//               onApplyCustomDates={handleApplyCustomDates}
//               onResetCustomDates={handleResetCustomDates}
//               onExportPNG={handleExportDealerUsersPNG}
//               onExportCSV={handleExportDealerUsersCSV}
//               onCloseModal={closeModal}
//               isLoadingDealerData={isLoadingDealerData}
//               // Data helpers
//               formatNumber={formatNumber}
//               getDealerValue={getDealerValue}
//               // Toast functions
//               showToast={showToast}
//               setToastMessage={setToastMessage}
//               setShowToast={setShowToast}
//               areModalDatesValid={areModalDatesValid}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DealerSummaryTable;

// PREVENT BG SCROLLING ON OPEN OF MODAL
import React, { useState, useEffect, useRef, useMemo } from "react";
import { toPng } from "html-to-image";
import DealerUserDetails from "./DealerUserDetails";
import axios from "axios";

const DealerSummaryTable = ({
  dealers,
  selectedDealers,
  tableLength,
  setTableLength,
  dealerUsers,
  loadingUsers,
  sortColumn,
  sortDirection,
  onSortData,
  onGetSortedUsers,
  onExportCSV,
  onToggleSummaryRow,
  selectedFilter,
  onFilterChange,
  onRefreshDashboardData,
  onFetchDealerUsers,
  customStartDate,
  customEndDate,
}) => {
  // ==================== STATE MANAGEMENT ====================
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalFilter, setModalFilter] = useState(selectedFilter);
  const [isDealersLoading, setIsDealersLoading] = useState(true);
  const [modalCustomStartDate, setModalCustomStartDate] =
    useState(customStartDate);
  const [modalCustomEndDate, setModalCustomEndDate] = useState(customEndDate);
  const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [exportingPNG, setExportingPNG] = useState(false);

  // Overdue modal state
  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [overdueModalType, setOverdueModalType] = useState(null); // "followup" or "testdrive"
  const [overdueModalData, setOverdueModalData] = useState(null);
  const [overdueModalLoading, setOverdueModalLoading] = useState(false);
  const [clickedDealer, setClickedDealer] = useState(null);

  // Refs
  const mainTableRef = useRef(null);
  const dealerUserDetailsRef = useRef(null);

  // ==================== COMPUTED VALUES ====================
  const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

  // ==================== SCROLL PREVENTION ====================
  useEffect(() => {
    const body = document.body;

    if (showUserModal || showOverdueModal) {
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
  }, [showUserModal, showOverdueModal]);

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (dealers !== undefined) {
      setIsDealersLoading(false);
    }
  }, [dealers]);

  useEffect(() => {
    if (showUserModal) {
      setModalFilter(selectedFilter);
      setModalCustomStartDate(customStartDate);
      setModalCustomEndDate(customEndDate);
    }
  }, [showUserModal, selectedFilter, customStartDate, customEndDate]);

  // ==================== AXIOS INSTANCE ====================
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://uat.smartassistapp.in/api",
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, []);

  // ==================== HELPER FUNCTIONS ====================
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString("en-IN");
  };

  const areModalDatesValid = () => {
    if (modalCustomStartDate && modalCustomEndDate) {
      return new Date(modalCustomStartDate) <= new Date(modalCustomEndDate);
    }
    return false;
  };

  const getRawDealerValue = (dealer, fieldNames) => {
    for (let field of fieldNames) {
      const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
      if (value !== undefined && value !== null) {
        return value;
      }
    }
    return 0;
  };

  const getDealerValue = (
    dealer,
    fieldNames,
    webFieldNames = [],
    clickable = false,
    onClick = null,
  ) => {
    let mainValue = "0";
    let webValue = null;

    // Get main value
    for (let field of fieldNames) {
      const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
      if (value !== undefined && value !== null) {
        mainValue = formatNumber(value);
        break;
      }
    }

    // Get web value if provided
    if (webFieldNames.length > 0) {
      for (let field of webFieldNames) {
        const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
        if (value !== undefined && value !== null) {
          webValue = formatNumber(value);
          break;
        }
      }
    }

    // Return formatted string with web value in brackets
    if (webValue !== null) {
      return (
        <div className="flex items-center justify-end">
          {clickable ? (
            <button
              className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              title={`Click to view ${
                fieldNames[0].includes("Follow")
                  ? "overdue follow-ups"
                  : "overdue test drives"
              }`}
            >
              {mainValue}
            </button>
          ) : (
            <span>{mainValue}</span>
          )}
          <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
            ({webValue})
          </span>
        </div>
      );
    }

    return clickable ? (
      <button
        className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer text-right w-full"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
        title={`Click to view ${
          fieldNames[0].includes("Follow")
            ? "overdue follow-ups"
            : "overdue test drives"
        }`}
      >
        {mainValue}
      </button>
    ) : (
      <div className="text-right">{mainValue}</div>
    );
  };

  const getSortedDealersForSummary = () => {
    const list =
      selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

    if (!sortColumn || sortDirection === "default") return list;

    return [...list].sort((a, b) => {
      const valA = a[sortColumn] ?? 0;
      const valB = b[sortColumn] ?? 0;
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  };

  const getFilterLabel = (filter) => {
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

  // ==================== EVENT HANDLERS ====================
  const handleModalFilterChange = async (
    filterValue,
    applyCustomDates = false,
  ) => {
    if (!selectedDealer) {
      return;
    }

    if (filterValue === "CUSTOM" && !applyCustomDates) {
      setModalFilter("CUSTOM");
      return;
    }

    if (filterValue === "CUSTOM" && applyCustomDates) {
      if (!modalCustomStartDate || !modalCustomEndDate) {
        setToastMessage("Please select both start and end dates");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      const isValid = areModalDatesValid();
      if (!isValid) {
        setToastMessage("End date cannot be before start date");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setModalFilter(filterValue);
    setIsLoadingDealerData(true);

    // Just trigger the parent to fetch dealer users
    if (onFetchDealerUsers) {
      try {
        await onFetchDealerUsers(
          selectedDealer,
          filterValue,
          filterValue === "CUSTOM" ? modalCustomStartDate : undefined,
          filterValue === "CUSTOM" ? modalCustomEndDate : undefined,
        );
      } catch (error) {
        console.error("❌ Failed to fetch dealer data:", error);
      } finally {
        setIsLoadingDealerData(false);
      }
    } else {
      setIsLoadingDealerData(false);
    }
  };

  const handleApplyCustomDates = () => {
    if (!modalCustomStartDate || !modalCustomEndDate) {
      setToastMessage("Please select both start and end dates");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const isValid = areModalDatesValid();
    if (!isValid) {
      setToastMessage("End date cannot be before start date");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    handleModalFilterChange("CUSTOM", true);
  };

  const handleResetCustomDates = () => {
    setModalFilter(selectedFilter);
    if (selectedFilter === "CUSTOM") {
      setModalCustomStartDate(customStartDate || "");
      setModalCustomEndDate(customEndDate || "");
    } else {
      setModalCustomStartDate("");
      setModalCustomEndDate("");
    }

    if (selectedDealer) {
      handleModalFilterChange(selectedFilter);
    }
  };

  const handleDealerClick = async (dealer) => {
    setSelectedDealer(dealer);
    setShowUserModal(true);
    setModalFilter(selectedFilter);
    setModalCustomStartDate(customStartDate);
    setModalCustomEndDate(customEndDate);

    setIsLoadingDealerData(true);

    // Fetch initial dealer data
    if (onFetchDealerUsers) {
      try {
        await onFetchDealerUsers(
          dealer,
          selectedFilter,
          selectedFilter === "CUSTOM" ? customStartDate : undefined,
          selectedFilter === "CUSTOM" ? customEndDate : undefined,
        );
      } catch (error) {
        console.error("❌ Failed to fetch initial dealer data:", error);
      } finally {
        setIsLoadingDealerData(false);
      }
    } else {
      setIsLoadingDealerData(false);
    }

    if (onToggleSummaryRow) {
      const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
      onToggleSummaryRow(mockEvent, dealer);
    }
  };

  // ==================== OVERDUE API FUNCTIONS ====================
  const fetchOverdueData = async (dealer, type) => {
    setOverdueModalType(type);
    setClickedDealer(dealer);
    setOverdueModalData(null);
    setOverdueModalLoading(true);
    setShowOverdueModal(true);        

    try {
      // Build API parameters
      const params = {
        type: selectedFilter,
        overdue_type: type === "followups" ? "followup" : "testdrive",
      };

      // Add dealerId if available
      const dealerId = dealer.dealerId || dealer.id;
      if (dealerId) {
        params.dealerId = dealerId;
      }

      // Add custom dates if filter is CUSTOM
      if (selectedFilter === "CUSTOM") {
        params.start_date = customStartDate;
        params.end_date = customEndDate;
      }

      console.log("📡 Fetching overdue data with params:", params);

      // Make API call
      const response = await api.get(
        "/generalManager/dashboard/GMOverdueReport",
        { params },
      );

      if (response.data.status === 200) {
        setOverdueModalData(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch overdue data",
        );
      }
    } catch (error) {
      console.error("❌ Error fetching overdue data:", error);
      setToastMessage(error.message || "Failed to load overdue details");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setOverdueModalLoading(false);
    }
  };

  const handleOverdueClick = (dealer, type) => {
    fetchOverdueData(dealer, type);
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedDealer(null);
    setIsLoadingDealerData(false);
    setShowToast(false);

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

  const closeOverdueModal = () => {
    setShowOverdueModal(false);
    setOverdueModalType(null);
    setOverdueModalData(null);
    setClickedDealer(null);

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

  // Helper function to render overdue modal table
  // Helper function to render overdue modal table
  const renderOverdueTable = () => {
    if (
      !overdueModalData?.dealerData ||
      overdueModalData.dealerData.length === 0
    ) {
      return (
        <div className="flex justify-center items-center p-12">
          <div className="text-gray-500 text-sm">No overdue data found</div>
        </div>
      );
    }

    const isFollowup = overdueModalType === "followups";
    const closedKey = isFollowup ? "closed_followups" : "closed_testdrives";
    const webKey = isFollowup
      ? "web_overdue_followups"
      : "web_overdue_testdrives";

    return (
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-purple-100 border-b border-gray-300">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Dealer
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                Total
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                &lt;30d
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                31-60d
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                60+d
              </th>
            </tr>
          </thead>
          <tbody>
            {overdueModalData.dealerData.map((dealer, idx) => (
              <tr
                key={dealer.dealerId}
                className={`border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-purple-50 transition`}
              >
                {/* Dealer Name */}
                <td className="px-4 py-3 font-medium text-gray-900">
                  {dealer.dealerName}
                </td>

                {/* TOTAL */}
                <td className="px-4 py-3 text-center text-gray-900">
                  {dealer[closedKey]?.total || 0}
                  <span className="text-orange-600 ml-1">
                    ({dealer[webKey]?.total || 0})
                  </span>
                </td>

                {/* <30 Days */}
                <td className="px-4 py-3 text-center text-gray-700">
                  {dealer[closedKey]?.lessThan30Days || 0}
                  <span className="text-orange-600 ml-1">
                    ({dealer[webKey]?.lessThan30Days || 0})
                  </span>
                </td>

                {/* 31-60 Days */}
                <td className="px-4 py-3 text-center text-gray-700">
                  {dealer[closedKey]?.days31to60 || 0}
                  <span className="text-orange-600 ml-1">
                    ({dealer[webKey]?.days31to60 || 0})
                  </span>
                </td>

                {/* 60+ Days */}
                <td className="px-4 py-3 text-center text-gray-700">
                  {dealer[closedKey]?.days60Plus || 0}
                  <span className="text-orange-600 ml-1">
                    ({dealer[webKey]?.days60Plus || 0})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ==================== EXPORT FUNCTIONS ====================
  const handleExportDealerUsersPNG = () => {
    if (dealerUserDetailsRef.current) {
      dealerUserDetailsRef.current.handleExportPNG();
    }
  };

  const handleExportDealerUsersCSV = () => {
    if (dealerUserDetailsRef.current) {
      dealerUserDetailsRef.current.exportUsersToCSV();
    }
  };

  const handleExportMainTablePNG = async () => {
    if (!mainTableRef.current) return;

    try {
      const button = document.activeElement;
      const originalHTML = button?.innerHTML;
      if (button) {
        button.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
        button.disabled = true;
      }

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

      const clone = mainTableRef.current.cloneNode(true);
      const tableContainer = clone.querySelector(".table-container");
      const scrollContainer = clone.querySelector(".table-scroll");
      const table = clone.querySelector(".data-table");
      const tableHead = table?.querySelector("thead");
      const stickyCells = clone.querySelectorAll(".sticky");
      const expandButtons = clone.querySelectorAll(".expand-btn");

      if (!table) {
        throw new Error("Table not found in clone");
      }

      const originalRect = mainTableRef.current.getBoundingClientRect();
      exportContainer.style.width = `${originalRect.width}px`;
      exportContainer.style.height = "auto";

      if (tableContainer) {
        tableContainer.style.width = "100%";
        tableContainer.style.overflow = "visible";
        tableContainer.style.padding = "0";
      }

      if (scrollContainer) {
        scrollContainer.style.maxHeight = "none";
        scrollContainer.style.height = "auto";
        scrollContainer.style.overflow = "visible";
        scrollContainer.style.overflowY = "visible";
        scrollContainer.style.position = "static";
        scrollContainer.style.width = "100%";
      }

      if (table) {
        table.style.width = "100%";
        table.style.minWidth = "2100px";
        table.style.position = "static";
        table.style.tableLayout = "auto";
        table.style.display = "table";
      }

      if (tableHead) {
        tableHead.style.position = "static";
        tableHead.style.top = "auto";
        tableHead.style.zIndex = "auto";
      }

      stickyCells.forEach((cell) => {
        cell.style.position = "static";
        cell.style.left = "auto";
        cell.style.zIndex = "auto";
        cell.style.backgroundColor = "#ffffff";
      });

      expandButtons.forEach((btn) => {
        const span = btn.querySelector("span");
        const icon = btn.querySelector("i");

        if (span) {
          const textNode = document.createTextNode(span.textContent || "");
          btn.parentNode.replaceChild(textNode, btn);
        } else if (icon) {
          icon.style.display = "none";
        }
      });

      const exportButtons = clone.querySelectorAll(".btn-export");
      exportButtons.forEach((btn) => {
        btn.remove();
      });

      const interactiveElements = clone.querySelectorAll(
        "button, select, input, .fa-spinner",
      );
      interactiveElements.forEach((el) => {
        el.remove();
      });

      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          clone.offsetHeight;
          resolve();
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      const cloneRect = clone.getBoundingClientRect();
      const captureWidth = Math.max(cloneRect.width, 2100);
      const captureHeight = cloneRect.height;

      const paddedWidth = Math.ceil(captureWidth + 20);
      const paddedHeight = Math.ceil(captureHeight + 20);

      const dataUrl = await toPng(clone, {
        quality: 1.0,
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
          if (
            node.classList &&
            (node.classList.contains("btn-export") ||
              node.classList.contains("fa-spinner"))
          ) {
            return false;
          }
          return true;
        },
      });

      document.body.removeChild(exportContainer);

      const link = document.createElement("a");
      link.download = `dealer-summary-${selectedFilter || "all"}-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (button && originalHTML) {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }
    } catch (error) {
      console.error("❌ Error exporting main table PNG:", error);
      alert("Failed to export PNG. Please try again.");

      const button = document.activeElement;
      if (button) {
        button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
        button.disabled = false;
      }
    }
  };

  const handleExportCSV = () => {
    const sortedDealers = getSortedDealersForSummary();
    const dataToExport = sortedDealers.slice(0, tableLength);

    const headers = [
      "Dealer Name",
      "Total Users",
      "Registered Users",
      "Active Users",
      "Created Enquiries",
      "Digital",
      "Created Follow-ups",
      "Completed Follow-ups",
      "Upcoming Follow-ups",
      "Overdue Follow-ups",
      "Total Test Drives",
      "Completed Test Drives",
      "Upcoming Test Drives",
      "Overdue Test Drives",
      "Opportunities Converted",
    ];

    const getFormattedValueForExport = (
      dealer,
      mainFieldNames,
      webFieldNames = [],
    ) => {
      let mainValue = 0;
      let webValue = null;

      for (let field of mainFieldNames) {
        const value = field.split(".").reduce((obj, key) => obj?.[key], dealer);
        if (value !== undefined && value !== null) {
          mainValue = value;
          break;
        }
      }

      if (webFieldNames.length > 0) {
        for (let field of webFieldNames) {
          const value = field
            .split(".")
            .reduce((obj, key) => obj?.[key], dealer);
          if (value !== undefined && value !== null) {
            webValue = value;
            break;
          }
        }
      }

      if (webValue !== null) {
        return `${formatNumber(mainValue)} (${formatNumber(webValue)})`;
      }

      return formatNumber(mainValue);
    };

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((dealer) => {
        const row = [
          `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
          getRawDealerValue(dealer, ["totalUsers"]),
          getRawDealerValue(dealer, ["registerUsers"]),
          getRawDealerValue(dealer, ["activeUsers"]),
          getRawDealerValue(dealer, ["saLeads"]),
          getRawDealerValue(dealer, ["manuallyEnteredLeads"]),
          `"${getFormattedValueForExport(
            dealer,
            ["saFollowUps"],
            ["webleadsFollowUps"],
          )}"`,
          `"${getFormattedValueForExport(
            dealer,
            ["completedFollowUps"],
            ["webCompletedFollowUps"],
          )}"`,
          `"${getFormattedValueForExport(
            dealer,
            ["openFollowUps"],
            ["webUpcomingFollowUps"],
          )}"`,
          `"${getFormattedValueForExport(
            dealer,
            ["closedFollowUps"],
            ["webOverdueFollowUps"],
          )}"`,
          getRawDealerValue(dealer, ["totalTestDrives", "saTestDrives"]),
          `"${getFormattedValueForExport(
            dealer,
            ["completedTestDrives"],
            ["webCompletedTestDrives"],
          )}"`,
          `"${getFormattedValueForExport(
            dealer,
            ["upcomingTestDrives"],
            ["webUpcomingTestDrives"],
          )}"`,
          `"${getFormattedValueForExport(
            dealer,
            ["closedTestDrives"],
            ["webOverdueTestDrives"],
          )}"`,
          getRawDealerValue(dealer, ["opportunitiesConverted"]),
        ];

        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `dealer-summary-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ==================== SUB-COMPONENTS ====================
  const SortIcon = ({ column }) => (
    <span className="sort-arrows inline-flex flex-col ml-1">
      <span
        className={`arrow-up text-[10px] ${
          sortColumn === column && sortDirection === "asc"
            ? "text-[#222fb9]"
            : "text-gray-400"
        }`}
      >
        ▲
      </span>
      <span
        className={`arrow-down text-[10px] ${
          sortColumn === column && sortDirection === "desc"
            ? "text-[#222fb9]"
            : "text-gray-400"
        }`}
      >
        ▼
      </span>
    </span>
  );

  // Get the dealers to display
  const sortedDealers = getSortedDealersForSummary();
  const displayedDealers = sortedDealers.slice(0, tableLength);

  // ==================== RENDER ====================
  return (
    <>
      {/* Main Table Section */}
      <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
        {/* Table Header */}
        <div className="table-header px-4 py-1 border-b border-gray-200 flex flex-col sm:flex-row text-xs items-start justify-between gap-1 sm:gap-0 bg-gray-50 relative z-30">
          <div>
            <h2 className="table-title text-xs font-bold text-gray-900">
              Dealer Summary — Engagement
            </h2>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExportMainTablePNG}
              disabled={isDealersLoading || exportingPNG}
            >
              {exportingPNG ? (
                <>
                  <i className="fas fa-spinner fa-spin text-xs"></i>
                  Exporting...
                </>
              ) : (
                <>
                  <i className="fas fa-image text-xs"></i>
                  Export PNG
                </>
              )}
            </button>
            <button
              className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm"
              onClick={handleExportCSV}
              disabled={isDealersLoading}
            >
              <i className="fas fa-download text-xs"></i>
              Export CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div ref={mainTableRef} className="table-container p-0 relative z-20">
          {/* Add scrollbar styles here */}
          <style>{`
            .table-scroll::-webkit-scrollbar {
              height: 8px;
            }
            .table-scroll::-webkit-scrollbar-track {
              background: #f5f5f5; /* Light grey track */
              border-radius: 4px;
            }
            .table-scroll::-webkit-scrollbar-thumb {
              background: #cccccc; /* Light grey thumb */
              border-radius: 4px;
            }
            .table-scroll::-webkit-scrollbar-thumb:hover {
              background: #aaaaaa; /* Slightly darker grey on hover */
            }
            
            /* Firefox scrollbar */
            .table-scroll {
              scrollbar-width: thin;
              scrollbar-color: #cccccc #f5f5f5;
            }
          `}</style>

          {isDealersLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
              <div className="text-gray-500 text-sm">
                Loading dealers data...
              </div>
            </div>
          ) : !dealers || dealers.length === 0 ? (
            <div className="flex justify-center items-center p-12">
              <div className="text-gray-500 text-sm">
                {!dealers ? "Loading dealers..." : "No dealers found"}
              </div>
            </div>
          ) : (
            <>
              <div
                className="table-scroll overflow-x-auto relative z-10"
                style={{ maxHeight: "600px", overflowY: "auto" }}
              >
                <table className="data-table w-full border-collapse text-xs min-w-[2100px] relative z-10">
                  <thead className="table-thead bg-gray-50 sticky top-0 z-50">
                    <tr className="text-xs">
                      <th
                        rowSpan={2}
                        className="sticky left-0 bg-gray-50 z-60 border-r border-gray-300 px-1 py-2 font-semibold text-gray-900 text-left min-w-[20px] w-[20px]"
                      >
                        Dealer
                      </th>
                      <th
                        colSpan={3}
                        className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-blue-50"
                      >
                        Users
                      </th>
                      <th
                        colSpan={2}
                        className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-green-50"
                      >
                        Enquiries
                      </th>
                      <th
                        colSpan={4}
                        className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-purple-50"
                      >
                        Follow-ups
                      </th>
                      <th
                        colSpan={4}
                        className="border-r border-gray-300 px-2 py-2 text-center font-semibold text-gray-700 bg-orange-50"
                      >
                        Test Drives
                      </th>
                      <th
                        rowSpan={2}
                        className="px-2 py-2 text-center font-semibold text-gray-700 bg-red-50"
                      >
                        Opportunities converted
                      </th>
                    </tr>

                    <tr className="text-xs">
                      {/* Users Sub-headers */}
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("totalUsers")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Total
                          {hasMultipleDealers && (
                            <SortIcon column="totalUsers" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("registerUsers")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Registered
                          {hasMultipleDealers && (
                            <SortIcon column="registerUsers" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
                        onClick={() =>
                          hasMultipleDealers && onSortData("activeUsers")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Active
                          {hasMultipleDealers && (
                            <SortIcon column="activeUsers" />
                          )}
                        </span>
                      </th>

                      {/* Leads Sub-headers */}
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("saLeads")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Created
                          {hasMultipleDealers && <SortIcon column="saLeads" />}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers &&
                          onSortData("manuallyEnteredLeads")
                        }
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Digital</span>
                          {hasMultipleDealers && (
                            <SortIcon column="manuallyEnteredLeads" />
                          )}
                        </div>
                      </th>

                      {/* Followups Sub-headers */}
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("saFollowUps")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Created
                          {hasMultipleDealers && (
                            <SortIcon column="saFollowUps" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("completedFollowUps")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Completed
                          {hasMultipleDealers && (
                            <SortIcon column="completedFollowUps" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("openFollowUps")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Upcoming
                          {hasMultipleDealers && (
                            <SortIcon column="openFollowUps" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
                        onClick={() =>
                          hasMultipleDealers && onSortData("closedFollowUps")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Overdue
                          {hasMultipleDealers && (
                            <SortIcon column="closedFollowUps" />
                          )}
                        </span>
                      </th>

                      {/* Test Drives Sub-headers */}
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("totalTestDrives")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Total
                          {hasMultipleDealers && (
                            <SortIcon column="totalTestDrives" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers &&
                          onSortData("completedTestDrives")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Completed
                          {hasMultipleDealers && (
                            <SortIcon column="completedTestDrives" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("upcomingTestDrives")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Upcoming
                          {hasMultipleDealers && (
                            <SortIcon column="upcomingTestDrives" />
                          )}
                        </span>
                      </th>
                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
                        onClick={() =>
                          hasMultipleDealers && onSortData("closedTestDrives")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Overdue
                          {hasMultipleDealers && (
                            <SortIcon column="closedTestDrives" />
                          )}
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white text-xs relative z-10">
                    {displayedDealers.map((dealer, index) => (
                      <tr
                        key={dealer.dealerId || dealer.id}
                        className={`group transition-colors relative ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50`}
                      >
                        <td className="sticky left-0 bg-inherit z-40 border-r border-gray-300 px-3 py-2 text-left text-xs text-gray-900 min-w-[140px] group-hover:bg-blue-50">
                          <button
                            className="expand-btn flex items-center cursor-pointer gap-2 text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
                            onClick={() => handleDealerClick(dealer)}
                          >
                            <span className="font-semibold truncate group-hover:underline">
                              {dealer.dealerName || dealer.name}
                            </span>
                            <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                          </button>
                        </td>

                        {/* Users Data */}
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["totalUsers"])}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["registerUsers"])}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["activeUsers"])}
                        </td>

                        {/* Leads Data */}
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["saLeads"])}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["manuallyEnteredLeads"])}
                        </td>

                        {/* Follow-ups Data */}
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["saFollowUps"],
                            ["webleadsFollowUps"],
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["completedFollowUps"],
                            ["webCompletedFollowUps"],
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["openFollowUps"],
                            ["webUpcomingFollowUps"],
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["closedFollowUps"],
                            ["webOverdueFollowUps"],
                            true,
                            () => handleOverdueClick(dealer, "followups"),
                          )}
                        </td>

                        {/* Test Drives Data */}
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, [
                            "totalTestDrives",
                            "saTestDrives",
                          ])}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["completedTestDrives"],
                            ["webCompletedTestDrives"],
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["upcomingTestDrives"],
                            ["webUpcomingTestDrives"],
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            ["closedTestDrives"],
                            ["webOverdueTestDrives"],
                            true,
                            () => handleOverdueClick(dealer, "testdrives"),
                          )}
                        </td>

                        {/* Opportunities Data */}
                        <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, ["opportunitiesConverted"])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Show More/Less Buttons - ALWAYS SHOW FOR ANY NUMBER OF DEALERS */}
              {!isDealersLoading && sortedDealers.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-2 gap-2 sm:gap-0 relative z-30 mb-2">
                  {" "}
                  {/* Added mb-2 for space */}
                  <div className="text-xs font-semibold text-gray-500">
                    Showing {Math.min(tableLength, sortedDealers.length)} of{" "}
                    {sortedDealers.length} dealers
                  </div>
                  <div className="flex gap-1 self-end sm:self-auto">
                    {tableLength < sortedDealers.length && (
                      <button
                        className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                        onClick={() => setTableLength((prev) => prev + 10)}
                      >
                        <i className="fas fa-chevron-down text-[10px]"></i>
                        Show More
                      </button>
                    )}
                    {tableLength > 10 && sortedDealers.length > 10 && (
                      <button
                        className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                        onClick={() => setTableLength(10)}
                      >
                        <i className="fas fa-chevron-up text-[10px]"></i>
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Overdue Details Modal */}
      {showOverdueModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeOverdueModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {overdueModalType === "followups"
                  ? "Overdue Follow-ups"
                  : "Overdue Test Drives"}{" "}
                - {clickedDealer?.dealerName || clickedDealer?.name || "Dealer"}
                <span className="text-sm font-normal text-gray-600 ml-2">
                  (
                  {overdueModalType === "followups"
                    ? overdueModalData?.summary?.total_closed_followups || 0
                    : overdueModalData?.summary?.total_closed_testdrives ||
                      0}{" "}
                  total)
                </span>
              </h2>
              <button
                onClick={closeOverdueModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto">
              {overdueModalLoading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
                  <div className="text-gray-500 text-sm">
                    Loading overdue details...
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-gray-600 text-sm font-medium">
                        Total Overdue{" "}
                        {overdueModalType === "followups"
                          ? "Follow-ups"
                          : "Test Drives"}
                      </p>
                      <p className="text-3xl font-bold text-blue-600 mt-1">
                        {overdueModalType === "followups"
                          ? overdueModalData?.summary?.total_closed_followups ||
                            0
                          : overdueModalData?.summary
                              ?.total_closed_testdrives || 0}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <p className="text-gray-600 text-sm font-medium">
                        Digital Overdue{" "}
                        {overdueModalType === "followups"
                          ? "Follow-ups"
                          : "Test Drives"}
                      </p>
                      <p className="text-3xl font-bold text-red-600 mt-1">
                        {overdueModalType === "followups"
                          ? overdueModalData?.summary
                              ?.total_web_overdue_followups || 0
                          : overdueModalData?.summary
                              ?.total_web_overdue_testdrives || 0}
                      </p>
                    </div>
                  </div>

                  {/* Table */}
                  {renderOverdueTable()}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
              <button
                onClick={closeOverdueModal}
                className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedDealer && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
              <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{toastMessage}</span>
              </div>
            </div>
          )}

          <div
            className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <DealerUserDetails
              ref={dealerUserDetailsRef}
              dealer={selectedDealer}
              loadingUsers={loadingUsers}
              onGetSortedUsers={onGetSortedUsers}
              dealerUsers={dealerUsers}
              // Modal specific props
              isModal={true}
              modalFilter={modalFilter}
              onModalFilterChange={handleModalFilterChange}
              modalCustomStartDate={modalCustomStartDate}
              modalCustomEndDate={modalCustomEndDate}
              onModalCustomStartDateChange={setModalCustomStartDate}
              onModalCustomEndDateChange={setModalCustomEndDate}
              onApplyCustomDates={handleApplyCustomDates}
              onResetCustomDates={handleResetCustomDates}
              onExportPNG={handleExportDealerUsersPNG}
              onExportCSV={handleExportDealerUsersCSV}
              onCloseModal={closeModal}
              isLoadingDealerData={isLoadingDealerData}
              // Data helpers
              formatNumber={formatNumber}
              getDealerValue={getDealerValue}
              // Toast functions
              showToast={showToast}
              setToastMessage={setToastMessage}
              setShowToast={setShowToast}
              areModalDatesValid={areModalDatesValid}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DealerSummaryTable;
