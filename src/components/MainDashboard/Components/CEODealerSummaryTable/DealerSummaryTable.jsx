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
//   // Add new prop for fetching dealer data
//   onFetchDealerData,
//   // ✅ ADD: Props for parent's custom dates
//   customStartDate: parentCustomStartDate,
//   customEndDate: parentCustomEndDate,
//   // ✅ ADD: New prop for custom filter pending state
//   customFilterPending, // This comes from parent CEODashboard
// }) => {
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [modalDealerData, setModalDealerData] = useState(null);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);

//   // ✅ ADD: Ref for main table PNG export
//   const mainTableRef = useRef(null);
//   const modalTableRef = useRef(null);

//   // ✅ ADD: Modal-specific custom date states
//   const [modalCustomStartDate, setModalCustomStartDate] = useState("");
//   const [modalCustomEndDate, setModalCustomEndDate] = useState("");
//   const [modalInvalidDateRange, setModalInvalidDateRange] = useState(false);

//   // Check if there's only one dealer to show
//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

//   // ✅ ADD: Function to export main table as PNG (using GM's approach)
//   // const handleExportMainTablePNG = async () => {
//   //   if (!mainTableRef.current) {
//   //     return;
//   //   }

//   //   try {
//   //     const button = document.activeElement;
//   //     const originalHTML = button?.innerHTML;
//   //     if (button) {
//   //       button.innerHTML =
//   //         '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//   //       button.disabled = true;
//   //     }

//   //     // Find ALL nested containers and elements in the main table
//   //     const scrollContainer =
//   //       mainTableRef.current.querySelector(".table-scroll");
//   //     const outerContainer =
//   //       mainTableRef.current.querySelector(".table-container");
//   //     const table = mainTableRef.current.querySelector(".data-table");
//   //     const tableHead = table?.querySelector("thead");
//   //     const stickyCells = mainTableRef.current.querySelectorAll(".sticky");

//   //     // ✅ ADD: Get all expand buttons
//   //     const expandButtons =
//   //       mainTableRef.current.querySelectorAll(".expand-btn");

//   //     // Store ALL original styles
//   //     const originalStyles = {
//   //       // Scroll container
//   //       scrollMaxHeight: scrollContainer?.style.maxHeight,
//   //       scrollOverflow: scrollContainer?.style.overflow,
//   //       scrollOverflowY: scrollContainer?.style.overflowY,
//   //       scrollPosition: scrollContainer?.style.position,
//   //       // Outer container
//   //       containerOverflow: outerContainer?.style.overflow,
//   //       containerPosition: outerContainer?.style.position,
//   //       // Table head
//   //       headPosition: tableHead?.style.position,
//   //       headTop: tableHead?.style.top,
//   //       headZIndex: tableHead?.style.zIndex,
//   //       // Table
//   //       tableWidth: table?.style.width,
//   //       tableMinWidth: table?.style.minWidth,
//   //       tablePosition: table?.style.position,
//   //     };

//   //     // Store sticky cell styles
//   //     const stickyCellStyles = [];
//   //     stickyCells.forEach((cell) => {
//   //       stickyCellStyles.push({
//   //         element: cell,
//   //         position: cell.style.position,
//   //         left: cell.style.left,
//   //         zIndex: cell.style.zIndex,
//   //         backgroundColor: cell.style.backgroundColor,
//   //       });
//   //     });

//   //     // ✅ ADD: Store expand button styles and content
//   //     const expandButtonStyles = [];
//   //     expandButtons.forEach((btn) => {
//   //       const span = btn.querySelector("span");
//   //       const icon = btn.querySelector("i");

//   //       expandButtonStyles.push({
//   //         element: btn,
//   //         originalHTML: btn.innerHTML,
//   //         spanDisplay: span?.style.display || "",
//   //         iconDisplay: icon?.style.display || "",
//   //       });

//   //       // Temporarily hide the chevron icon for export
//   //       if (icon) {
//   //         icon.style.display = "none";
//   //       }

//   //       // Remove hover effects and make it look like plain text
//   //       btn.style.pointerEvents = "none";
//   //       btn.style.cursor = "default";
//   //       btn.style.textDecoration = "none";

//   //       // Ensure the dealer name is visible
//   //       if (span) {
//   //         span.style.textDecoration = "none";
//   //       }
//   //     });

//   //     // ✅ FIXED: Remove scroll restrictions but maintain layout
//   //     if (scrollContainer) {
//   //       scrollContainer.style.maxHeight = "none";
//   //       scrollContainer.style.overflow = "visible";
//   //       scrollContainer.style.overflowY = "visible";
//   //       scrollContainer.style.position = "relative";
//   //     }

//   //     if (outerContainer) {
//   //       outerContainer.style.overflow = "visible";
//   //       outerContainer.style.position = "relative";
//   //     }

//   //     // ✅ FIXED: Keep table's natural width
//   //     if (table) {
//   //       const actualWidth = table.scrollWidth;
//   //       table.style.width = `${actualWidth}px`;
//   //       table.style.minWidth = `${actualWidth}px`;
//   //       table.style.position = "relative";
//   //     }

//   //     // ✅ FIXED: Temporarily remove sticky positioning but maintain layout
//   //     if (tableHead) {
//   //       tableHead.style.position = "relative";
//   //       tableHead.style.top = "auto";
//   //       tableHead.style.zIndex = "auto";
//   //     }

//   //     // ✅ FIXED: Remove sticky positioning from ALL sticky cells but keep them visible
//   //     stickyCells.forEach((cell) => {
//   //       cell.style.position = "relative";
//   //       cell.style.left = "auto";
//   //       cell.style.zIndex = "auto";
//   //     });

//   //     // ✅ REMOVED: Do NOT modify borders - keep original styling
//   //     // Just ensure no box shadow interferes
//   //     const allCells = mainTableRef.current.querySelectorAll("td, th");
//   //     allCells.forEach((cell) => {
//   //       // Only remove box shadow if present
//   //       cell.style.boxShadow = "none";
//   //     });

//   //     // ✅ FIXED: Force a reflow
//   //     await new Promise((resolve) => {
//   //       requestAnimationFrame(() => {
//   //         table.offsetHeight; // Trigger reflow
//   //         resolve();
//   //       });
//   //     });

//   //     // Wait for layout to settle
//   //     await new Promise((resolve) => setTimeout(resolve, 300));

//   //     // Get actual rendered dimensions
//   //     const captureWidth = table.scrollWidth;
//   //     const captureHeight = table.scrollHeight;

//   //     // Add minimal padding
//   //     const paddedWidth = captureWidth + 40;
//   //     const paddedHeight = captureHeight + 40;

//   //     const dataUrl = await toPng(table, {
//   //       quality: 1.0,
//   //       pixelRatio: 2,
//   //       backgroundColor: "#ffffff",
//   //       width: paddedWidth,
//   //       height: paddedHeight,
//   //       style: {
//   //         transform: "none",
//   //         transformOrigin: "top left",
//   //         overflow: "visible",
//   //         margin: "0",
//   //         padding: "0",
//   //         display: "block",
//   //       },
//   //       filter: (node) => {
//   //         // ✅ FIXED: Only exclude specific interactive elements
//   //         if (
//   //           node.classList?.contains("btn-export") ||
//   //           node.classList?.contains("export-button") ||
//   //           node.classList?.contains("fa-chevron-right") ||
//   //           node.classList?.contains("fa-spinner") ||
//   //           node.classList?.contains("fa-download") ||
//   //           node.classList?.contains("fa-image") ||
//   //           node.classList?.contains("fa-camera")
//   //         ) {
//   //           return false;
//   //         }
//   //         return true;
//   //       },
//   //     });

//   //     // ✅ FIXED: Restore ALL original styles
//   //     if (scrollContainer) {
//   //       scrollContainer.style.maxHeight = originalStyles.scrollMaxHeight || "";
//   //       scrollContainer.style.overflow = originalStyles.scrollOverflow || "";
//   //       scrollContainer.style.overflowY = originalStyles.scrollOverflowY || "";
//   //       scrollContainer.style.position = originalStyles.scrollPosition || "";
//   //     }

//   //     if (outerContainer) {
//   //       outerContainer.style.overflow = originalStyles.containerOverflow || "";
//   //       outerContainer.style.position = originalStyles.containerPosition || "";
//   //     }

//   //     if (tableHead) {
//   //       tableHead.style.position = originalStyles.headPosition || "";
//   //       tableHead.style.top = originalStyles.headTop || "";
//   //       tableHead.style.zIndex = originalStyles.headZIndex || "";
//   //     }

//   //     if (table) {
//   //       table.style.width = originalStyles.tableWidth || "";
//   //       table.style.minWidth = originalStyles.tableMinWidth || "";
//   //       table.style.position = originalStyles.tablePosition || "";
//   //     }

//   //     // ✅ FIXED: Restore sticky cell styles
//   //     stickyCellStyles.forEach(
//   //       ({ element, position, left, zIndex, backgroundColor }) => {
//   //         element.style.position = position || "";
//   //         element.style.left = left || "";
//   //         element.style.zIndex = zIndex || "";
//   //         if (backgroundColor) {
//   //           element.style.backgroundColor = backgroundColor;
//   //         }
//   //       }
//   //     );

//   //     // ✅ FIXED: Restore expand button styles and content
//   //     expandButtonStyles.forEach(
//   //       ({ element, originalHTML, spanDisplay, iconDisplay }) => {
//   //         element.innerHTML = originalHTML;
//   //         element.style.pointerEvents = "";
//   //         element.style.cursor = "";
//   //         element.style.textDecoration = "";

//   //         const span = element.querySelector("span");
//   //         if (span && spanDisplay) {
//   //           span.style.display = spanDisplay;
//   //         }

//   //         const icon = element.querySelector("i");
//   //         if (icon && iconDisplay) {
//   //           icon.style.display = iconDisplay;
//   //         }
//   //       }
//   //     );

//   //     // ✅ REMOVED: No need to restore borders since we didn't modify them

//   //     // Create and download the PNG
//   //     const link = document.createElement("a");
//   //     link.download = `dealer-summary-${selectedFilter || "all"}-${
//   //       new Date().toISOString().split("T")[0]
//   //     }.png`;
//   //     link.href = dataUrl;
//   //     document.body.appendChild(link);
//   //     link.click();
//   //     document.body.removeChild(link);

//   //     if (button && originalHTML) {
//   //       button.innerHTML = originalHTML;
//   //       button.disabled = false;
//   //     }
//   //   } catch (error) {
//   //     console.error("❌ Error exporting main table PNG:", error);
//   //     alert("Failed to export PNG. Please try again.");

//   //     const button = document.activeElement;
//   //     if (button) {
//   //       button.innerHTML =
//   //         '<i class="fas fa-camera text-xs mr-1"></i>Export PNG';
//   //       button.disabled = false;
//   //     }
//   //   }
//   // };
//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) {
//       return;
//     }

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       // ✅ CREATE: Temporary container for export
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

//       // ✅ CREATE: Clone of the ENTIRE table section
//       const clone = mainTableRef.current.cloneNode(true);

//       // ✅ GET: Elements from clone (not original)
//       const scrollContainer = clone.querySelector(".table-scroll");
//       const outerContainer = clone.querySelector(".table-container");
//       const table = clone.querySelector(".data-table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");
//       const expandButtons = clone.querySelectorAll(".expand-btn");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       // ✅ FIXED: Make export container match original width
//       const originalRect = mainTableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       // ✅ FIXED: Remove scroll restrictions but maintain layout IN CLONE
//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "relative";
//       }

//       if (outerContainer) {
//         outerContainer.style.overflow = "visible";
//         outerContainer.style.position = "relative";
//       }

//       // ✅ FIXED: Keep clone table's natural width
//       if (table) {
//         const actualWidth = table.scrollWidth;
//         table.style.width = `${actualWidth}px`;
//         table.style.minWidth = `${actualWidth}px`;
//         table.style.position = "relative";
//       }

//       // ✅ FIXED: Temporarily remove sticky positioning IN CLONE
//       if (tableHead) {
//         tableHead.style.position = "relative";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       // ✅ FIXED: Remove sticky positioning from ALL sticky cells IN CLONE
//       stickyCells.forEach((cell) => {
//         cell.style.position = "relative";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//       });

//       // ✅ FIXED: Clean up expand buttons in clone - make them plain text
//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         const icon = btn.querySelector("i");

//         if (span) {
//           // Replace button with just the dealer name text
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         } else if (icon) {
//           icon.style.display = "none";
//         }
//       });

//       // ✅ FIXED: Remove export buttons in the clone
//       const exportButtons = clone.querySelectorAll(".btn-export");
//       exportButtons.forEach((btn) => {
//         btn.remove();
//       });

//       // ✅ FIXED: Remove any other interactive elements from clone
//       const interactiveElements = clone.querySelectorAll(
//         "button, select, input, .fa-spinner, .fa-download, .fa-image, .fa-camera",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       // ✅ FIXED: Clean up table cells in clone (not original)
//       const allCells = clone.querySelectorAll("td, th");
//       allCells.forEach((cell) => {
//         cell.style.boxShadow = "none";
//       });

//       // ✅ ADD: Clone to export container
//       exportContainer.appendChild(clone);

//       // ✅ ADD: Export container to body
//       document.body.appendChild(exportContainer);

//       // Force a reflow on the clone
//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           if (table) table.offsetHeight; // Trigger reflow on clone
//           resolve();
//         });
//       });

//       // Wait for layout to settle
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       // ✅ FIXED: Get dimensions from the clone (not original)
//       const captureWidth = table.scrollWidth;
//       const captureHeight = table.scrollHeight;

//       // Add minimal padding
//       const paddedWidth = captureWidth + 40;
//       const paddedHeight = captureHeight + 40;

//       // ✅ FIXED: Capture the clone (not original)
//       const dataUrl = await toPng(table, {
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
//           padding: "0",
//           display: "block",
//         },
//         filter: (node) => {
//           // Exclude hidden elements
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           // Exclude any remaining interactive elements
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("export-button") ||
//               node.classList.contains("fa-chevron-right") ||
//               node.classList.contains("fa-spinner") ||
//               node.classList.contains("fa-download") ||
//               node.classList.contains("fa-image") ||
//               node.classList.contains("fa-camera"))
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       // ✅ FIXED: Remove the export container (clone gets removed with it)
//       document.body.removeChild(exportContainer);

//       // ✅ NO NEED TO RESTORE STYLES - Original table was never modified!

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
//         button.innerHTML =
//           '<i class="fas fa-camera text-xs mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };
//   // ✅ ADD: Function to export modal table as PNG
//   const handleExportModalPNG = async () => {
//     if (!modalTableRef.current || !selectedDealer) {
//       return;
//     }

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       // Get the modal content container
//       const modalContent = modalTableRef.current;
//       const dealerName =
//         selectedDealer.dealerName || selectedDealer.name || "dealer";

//       // Find all tables in the modal
//       const tables = modalContent.querySelectorAll("table");

//       // We'll capture the entire modal content
//       const dataUrl = await toPng(modalContent, {
//         quality: 1.0,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         style: {
//           transform: "none",
//           transformOrigin: "top left",
//           overflow: "visible",
//           margin: "0",
//           padding: "0",
//           display: "block",
//         },
//         filter: (node) => {
//           // Exclude interactive elements
//           if (
//             node.classList?.contains("btn-export") ||
//             node.classList?.contains("export-button") ||
//             node.classList?.contains("fa-spinner") ||
//             node.classList?.contains("fa-download") ||
//             node.classList?.contains("fa-image") ||
//             node.classList?.contains("fa-camera") ||
//             node.classList?.contains("time-filter") ||
//             node.classList?.contains("custom-date") ||
//             node.classList?.contains("apply-btn") ||
//             node.classList?.contains("reset-btn") ||
//             node.tagName?.toLowerCase() === "button" ||
//             node.tagName?.toLowerCase() === "select" ||
//             node.tagName?.toLowerCase() === "input"
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       // Create and download the PNG
//       const link = document.createElement("a");
//       link.download = `user-details-${dealerName.replace(/\s+/g, "-")}-${
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
//       console.error("❌ Error exporting modal PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-camera text-xs"></i>PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   // ✅ FIXED: Sync modal filter with parent filter when modal opens
//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalDealerData(null);

//       // ✅ FIX: ALWAYS initialize modal custom dates from parent's custom dates when they exist
//       // Not just when selectedFilter is CUSTOM, because parent might have dates
//       // even if we're in a different filter mode now
//       if (parentCustomStartDate && parentCustomEndDate) {
//         setModalCustomStartDate(parentCustomStartDate);
//         setModalCustomEndDate(parentCustomEndDate);
//       } else {
//         setModalCustomStartDate("");
//         setModalCustomEndDate("");
//       }

//       setModalInvalidDateRange(false);
//     }
//   }, [
//     showUserModal,
//     selectedFilter,
//     parentCustomStartDate,
//     parentCustomEndDate,
//   ]);

//   // ✅ ADD: Validate modal dates
//   const validateModalDates = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       const invalid =
//         new Date(modalCustomStartDate) > new Date(modalCustomEndDate);
//       setModalInvalidDateRange(invalid);
//       return !invalid;
//     }
//     return false;
//   };

//   // Format number with commas (e.g., 10000 -> 10,000)
//   const formatNumberWithCommas = (num) => {
//     if (num === null || num === undefined || num === "") return "0";

//     // Convert to number if it's a string
//     const number = typeof num === "string" ? parseFloat(num) : num;

//     // Check if it's a valid number
//     if (isNaN(number)) return "0";

//     // Format with commas
//     return number.toLocaleString("en-IN");
//   };

//   // Get dealer value with formatting
//   const getDealerValue = (dealer, fieldName) => {
//     if (!dealer) return "0";

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return "0";
//       }
//       return formatNumberWithCommas(value || 0);
//     }

//     value = dealer[fieldName];
//     return formatNumberWithCommas(value || 0);
//   };

//   // Get dealer value as number for sorting (without formatting)
//   const getDealerValueAsNumber = (dealer, fieldName) => {
//     if (!dealer) return 0;

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return 0;
//       }
//       return Number(value) || 0;
//     }

//     value = dealer[fieldName];
//     return Number(value) || 0;
//   };

//   // ✅ FIXED: Enhanced handleModalFilterChange with custom date support
//   const handleModalFilterChange = async (
//     filterValue,
//     applyCustomDates = false,
//   ) => {
//     if (!selectedDealer) {
//       return;
//     }

//     // If CUSTOM filter and not applying custom dates yet, just update filter
//     if (filterValue === "CUSTOM" && !applyCustomDates) {
//       setModalFilter("CUSTOM");
//       return;
//     }

//     // If CUSTOM filter and we're applying dates, validate them
//     if (filterValue === "CUSTOM" && applyCustomDates) {
//       if (!modalCustomStartDate || !modalCustomEndDate) {
//         alert("Please select both start and end dates for custom range");
//         return;
//       }

//       const isValid = validateModalDates();
//       if (!isValid) {
//         alert("End date cannot be before start date");
//         return;
//       }
//     }

//     // For CUSTOM filter, make sure we have dates even if not applying new ones
//     let startDateToUse, endDateToUse;
//     if (filterValue === "CUSTOM") {
//       startDateToUse = modalCustomStartDate;
//       endDateToUse = modalCustomEndDate;

//       // Validate dates are present for CUSTOM filter
//       if (!startDateToUse || !endDateToUse) {
//         alert("Please select both start and end dates for custom range");
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     try {
//       // Fetch fresh dealer summary data
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           selectedDealer,
//           filterValue,
//           // Pass custom dates when filter is CUSTOM
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       // Also fetch fresh user data
//       if (onFetchDealerUsers) {
//         // Pass custom dates for CUSTOM filter
//         await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           // Pass custom dates for CUSTOM filter
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch dealer data:", error);
//     } finally {
//       setIsLoadingDealerData(false);
//     }
//   };

//   // ✅ UPDATED: Apply custom dates handler with validation
//   const handleApplyCustomDates = () => {
//     // Check if dates are selected
//     if (!modalCustomStartDate || !modalCustomEndDate) {
//       alert("Please select both start and end dates");
//       return;
//     }

//     // Validate date range
//     if (new Date(modalCustomStartDate) > new Date(modalCustomEndDate)) {
//       alert("End date cannot be before start date");
//       return;
//     }

//     // If valid, apply the filter
//     const isValid = validateModalDates();
//     if (isValid) {
//       handleModalFilterChange("CUSTOM", true);
//     }
//   };

//   // ✅ FIXED: Reset custom dates handler
//   const handleResetCustomDates = () => {
//     // Reset to parent's filter
//     setModalFilter(selectedFilter);

//     // ✅ FIX: Reset to parent's custom dates if parent filter is CUSTOM
//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(parentCustomStartDate || "");
//       setModalCustomEndDate(parentCustomEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     setModalInvalidDateRange(false);

//     // Re-fetch with parent's filter and custom dates
//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   // ✅ FIXED: Handle dealer click to open modal
//   const handleDealerClick = async (dealer) => {
//     const dealerId = dealer.dealerId || dealer.id;

//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalDealerData(null);

//     // ✅ FIX: Set modal custom dates from parent immediately
//     // This ensures dates are visible even before API call
//     if (parentCustomStartDate && parentCustomEndDate) {
//       setModalCustomStartDate(parentCustomStartDate);
//       setModalCustomEndDate(parentCustomEndDate);
//     }

//     // Check if we already have user data for this dealer
//     const hasUserData =
//       dealerUsers[dealerId] && dealerUsers[dealerId].length > 0;

//     // Only show loading if we need to fetch data
//     if (!hasUserData) {
//       setIsLoadingDealerData(true);
//     }

//     try {
//       // Fetch fresh dealer data with initial filter (ALWAYS fetch this)
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           dealer,
//           selectedFilter,
//           // ✅ PASS PARENT'S CUSTOM DATES IF FILTER IS CUSTOM
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       // Only fetch user data if we don't have it already
//       if (onFetchDealerUsers && !hasUserData) {
//         await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           // ✅ PASS PARENT'S CUSTOM DATES IF FILTER IS CUSTOM
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch initial dealer data:", error);
//     } finally {
//       setIsLoadingDealerData(false);
//     }

//     // Call toggle summary row if needed for other functionality
//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   // Get current dealer data for modal (either filtered data or original data)
//   const getCurrentDealerData = () => {
//     if (modalDealerData) {
//       return modalDealerData;
//     }

//     if (selectedDealer) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;
//       return (
//         dealers.find((d) => (d.dealerId || d.id) === dealerId) || selectedDealer
//       );
//     }

//     return selectedDealer;
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setModalDealerData(null);
//     setIsLoadingDealerData(false);
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = getDealerValueAsNumber(a, sortColumn);
//       const valB = getDealerValueAsNumber(b, sortColumn);
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

//   // ✅ FIXED: Export CSV with web values in parentheses
//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     // Helper function to get combined value with web value in parentheses
//     const getCombinedDealerValue = (dealer, mainField, webField) => {
//       if (!dealer) return "0";

//       const mainValue = getDealerValueAsNumber(dealer, mainField);
//       let webValue = 0;

//       if (webField) {
//         webValue = getDealerValueAsNumber(dealer, webField);
//       }

//       // Return format: "mainValue (webValue)"
//       return `${mainValue} (${webValue})`;
//     };

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
//       "Created Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Unique Test Drives",

//       "Opportunities Converted",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) =>
//         [
//           // Dealer Name (keep in quotes)
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,

//           // Users - no web values
//           getDealerValueAsNumber(dealer, "totalUsers"),
//           getDealerValueAsNumber(dealer, "registerUsers"),
//           getDealerValueAsNumber(dealer, "activeUsers"),

//           // Leads
//           getDealerValueAsNumber(dealer, "saLeads"),
//           getDealerValueAsNumber(dealer, "manuallyEnteredLeads"),

//           // Follow-ups with web values in parentheses
//           // Format: "saFollowUps (webleadsFollowUps)"
//           getCombinedDealerValue(dealer, "saFollowUps", "webleadsFollowUps"),

//           // Format: "completedFollowUps (webCompletedFollowUps)"
//           getCombinedDealerValue(
//             dealer,
//             "completedFollowUps",
//             "webCompletedFollowUps",
//           ),

//           // Format: "openFollowUps (webUpcomingFollowUps)"
//           getCombinedDealerValue(
//             dealer,
//             "openFollowUps",
//             "webUpcomingFollowUps",
//           ),

//           // Format: "closedFollowUps (webOverdueFollowUps)"
//           getCombinedDealerValue(
//             dealer,
//             "closedFollowUps",
//             "webOverdueFollowUps",
//           ),

//           // Test Drives with web values in parentheses
//           // Format: "totalTestDrives (saTestDrives)"
//           getCombinedDealerValue(dealer, "totalTestDrives", "saTestDrives"),

//           // Digital Test Drives (no parentheses needed)
//           // getDealerValueAsNumber(dealer, "webleadsTestDrives"),

//           // Format: "completedTestDrives (webCompletedTestDrives)"
//           getCombinedDealerValue(
//             dealer,
//             "completedTestDrives",
//             "webCompletedTestDrives",
//           ),

//           // Format: "upcomingTestDrives (webUpcomingTestDrives)"
//           getCombinedDealerValue(
//             dealer,
//             "upcomingTestDrives",
//             "webUpcomingTestDrives",
//           ),

//           // Format: "closedTestDrives (webOverdueTestDrives)"
//           getCombinedDealerValue(
//             dealer,
//             "closedTestDrives",
//             "webOverdueTestDrives",
//           ),

//           // Unique Test Drives
//           getDealerValueAsNumber(dealer, "uniqueTestDrives"),

//           // Analytics - no web values
//           // getDealerValueAsNumber(dealer, "newOrders"),
//           // getDealerValueAsNumber(dealer, "netOrders"),
//           // getDealerValueAsNumber(dealer, "retail"),
//           // getDealerValueAsNumber(dealer, "cancellations"),

//           // Opportunities Converted
//           getDealerValueAsNumber(dealer, "opportunitiesConverted"),
//         ].join(","),
//       ),
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

//   // ✅ FIXED: Export dealer users CSV with web values in parentheses
//   const handleExportDealerUsersCSV = () => {
//     if (!selectedDealer) return;

//     const dealerId = selectedDealer.dealerId || selectedDealer.id;
//     const users = dealerUsers[dealerId] || [];
//     const dealerName =
//       selectedDealer.dealerName || selectedDealer.name || "Unknown Dealer";

//     if (users.length === 0) {
//       alert("No user data to export for this dealer.");
//       return;
//     }

//     // Helper function to get combined value for users
//     const getCombinedUserValue = (user, mainFieldPath, webFieldPath) => {
//       if (!user) return "0 (0)";

//       const mainValue = getUserValue(user, mainFieldPath);
//       let webValue = 0;

//       if (webFieldPath) {
//         webValue = getUserValue(user, webFieldPath);
//       }

//       return `${mainValue} (${webValue})`;
//     };

//     const headers = [
//       "User Name",
//       "Role",
//       "Registered",
//       "Status",
//       "Last Login",
//       "Created Enquiries",
//       "Digital",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Created Test Drives",
//       "Digital Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "New Orders",
//       "Net Orders",
//       "Retail",
//       "Cancellations",
//       "Opportunities Converted",
//     ];

//     const getUserValue = (user, fieldPath) => {
//       if (!user) return 0;

//       if (fieldPath.includes(".")) {
//         const fields = fieldPath.split(".");
//         let value = user;
//         for (const field of fields) {
//           value = value?.[field];
//           if (value === undefined || value === null) return 0;
//         }
//         return value || 0;
//       }

//       return user[fieldPath] || 0;
//     };

//     const csvContent = [
//       headers.join(","),
//       ...users.map((user) =>
//         [
//           // User Name
//           `"${(user.user || "").replace(/"/g, '""')}"`,

//           // Role
//           `"${(user.user_role || "").replace(/"/g, '""')}"`,

//           // Registration and Status
//           user.registerUser ? "Yes" : "No",
//           user.active ? "Active" : "Inactive",

//           // Last Login
//           `"${(user.last_login || "Never").replace(/"/g, '""')}"`,

//           // Leads
//           getUserValue(user, "leads.sa"),
//           getUserValue(user, "leads.manuallyEntered"),

//           // Follow-ups with web values
//           // Format: "followups.sa (followups.webleads)"
//           getCombinedUserValue(user, "followups.sa", "followups.webleads"),

//           // Format: "followups.completed (followups.webCompleted)"
//           getCombinedUserValue(
//             user,
//             "followups.completed",
//             "followups.webCompleted",
//           ),

//           // Format: "followups.open (followups.webUpcoming)"
//           getCombinedUserValue(user, "followups.open", "followups.webUpcoming"),

//           // Format: "followups.closed (followups.webOverdue)"
//           getCombinedUserValue(
//             user,
//             "followups.closed",
//             "followups.webOverdue",
//           ),

//           // Test Drives with web values
//           // Format: "testdrives.sa (testdrives.webleads)"
//           getCombinedUserValue(user, "testdrives.sa", "testdrives.webleads"),

//           // Digital Test Drives (no parentheses)
//           getUserValue(user, "testdrives.digital"),

//           // Format: "testdrives.completed (testdrives.webCompleted)"
//           getCombinedUserValue(
//             user,
//             "testdrives.completed",
//             "testdrives.webCompleted",
//           ),

//           // Format: "testdrives.upcoming (testdrives.webUpcoming)"
//           getCombinedUserValue(
//             user,
//             "testdrives.upcoming",
//             "testdrives.webUpcoming",
//           ),

//           // Format: "testdrives.closed (testdrives.webOverdue)"
//           getCombinedUserValue(
//             user,
//             "testdrives.closed",
//             "testdrives.webOverdue",
//           ),

//           // Analytics
//           getUserValue(user, "newOrders"),
//           getUserValue(user, "netOrders"),
//           getUserValue(user, "retail"),
//           getUserValue(user, "cancellations"),
//           getUserValue(user, "opportunitiesConverted"),
//         ].join(","),
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `users-${dealerName.replace(/\s+/g, "-")}-${
//         new Date().toISOString().split("T")[0]
//       }.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const sortedDealers = getSortedDealersForSummary();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

//   // Add function to get filter label
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
//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-4 relative">
//         {/* Table Header */}
//         <div className="table-header px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 bg-gray-50">
//           <div>
//             <h2 className="table-title text-sm font-bold text-gray-900">
//               Dealer Summary — Engagement
//             </h2>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-auto">
//             {/* ✅ ADD: PNG Export Button */}
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//               onClick={handleExportCSV}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//               onClick={handleExportMainTablePNG}
//               title="Export as PNG image"
//             >
//               <i i className="fas fa-image text-[10px]"></i>
//               Export PNG
//             </button>
//           </div>
//         </div>

//         {/* ✅ ADDED: Ref for main table PNG export */}
//         <div ref={mainTableRef} className="table-container p-0 relative">
//           <div
//             className="table-scroll overflow-x-auto relative"
//             style={{ maxHeight: "600px", overflowY: "auto" }}
//           >
//             <table className="data-table w-full border-collapse text-xs min-w-[2000px] relative">
//               {/* Table Header */}
//               <thead className="table-thead bg-gray-50 sticky top-0 z-30">
//                 {/* First Header Row - Group Headers */}
//                 <tr className="text-xs">
//                   <th
//                     rowSpan={2}
//                     className="sticky left-0 bg-gray-50 z-40 border-r border-gray-300 px-3 py-1 font-semibold text-gray-900 text-left w-[20px] min-w-[20px]"
//                   >
//                     Dealer
//                   </th>
//                   <th
//                     colSpan={3}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-blue-50"
//                   >
//                     Users
//                   </th>
//                   <th
//                     colSpan={2}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-green-50"
//                   >
//                     Enquiries
//                   </th>
//                   <th
//                     colSpan={4}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-purple-50"
//                   >
//                     Follow-ups
//                   </th>
//                   <th
//                     colSpan={4}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-orange-50"
//                   >
//                     Test Drives
//                   </th>
//                   {/* <th
//                     colSpan={4}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-red-50"
//                   >
//                     Analytics
//                   </th> */}
//                   <th
//                     rowSpan={2}
//                     className="px-2 py-1 text-center font-semibold text-gray-700 bg-teal-50"
//                   >
//                     Opportunities Converted
//                   </th>
//                 </tr>

//                 {/* Second Header Row - Column Headers */}
//                 <tr className="text-xs">
//                   {/* Users Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("totalUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Total
//                       {hasMultipleDealers && <SortIcon column="totalUsers" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("registerUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Registered
//                       {hasMultipleDealers && (
//                         <SortIcon column="registerUsers" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("activeUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Active
//                       {hasMultipleDealers && <SortIcon column="activeUsers" />}
//                     </span>
//                   </th>

//                   {/* Leads Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() => hasMultipleDealers && onSortData("saLeads")}
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && <SortIcon column="saLeads" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("manuallyEnteredLeads")
//                     }
//                   >
//                     <div className="flex items-center justify-center gap-1">
//                       <span>Digital</span>
//                       {hasMultipleDealers && (
//                         <SortIcon column="manuallyEnteredLeads" />
//                       )}
//                     </div>
//                   </th>

//                   {/* Followups Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("saFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && <SortIcon column="saFollowUps" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("completedFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Completed
//                       {hasMultipleDealers && (
//                         <SortIcon column="completedFollowUps" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("openFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Upcoming
//                       {hasMultipleDealers && (
//                         <SortIcon column="openFollowUps" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("closedFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Overdue
//                       {hasMultipleDealers && (
//                         <SortIcon column="closedFollowUps" />
//                       )}
//                     </span>
//                   </th>

//                   {/* Test Drives Sub-headers - UPDATED with web test drives */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("totalTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && (
//                         <SortIcon column="totalTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("webleadsTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Digital
//                       {hasMultipleDealers && (
//                         <SortIcon column="webleadsTestDrives" />
//                       )}
//                     </span>
//                   </th> */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("completedTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Completed
//                       {hasMultipleDealers && (
//                         <SortIcon column="completedTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("upcomingTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Upcoming
//                       {hasMultipleDealers && (
//                         <SortIcon column="upcomingTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("closedTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Overdue
//                       {hasMultipleDealers && (
//                         <SortIcon column="closedTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("uniqueTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Unique
//                       {hasMultipleDealers && (
//                         <SortIcon column="uniqueTestDrives" />
//                       )}
//                     </span>
//                   </th> */}

//                   {/* Analytics Sub-headers */}
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("newOrders")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       New Orders
//                       {hasMultipleDealers && <SortIcon column="newOrders" />}
//                     </span>
//                   </th> */}
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("netOrders")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Net Orders
//                       {hasMultipleDealers && <SortIcon column="netOrders" />}
//                     </span>
//                   </th> */}
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() => hasMultipleDealers && onSortData("retail")}
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Retail
//                       {hasMultipleDealers && <SortIcon column="retail" />}
//                     </span>
//                   </th> */}
//                   {/* <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("cancellations")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Cancellations
//                       {hasMultipleDealers && (
//                         <SortIcon column="cancellations" />
//                       )}
//                     </span>
//                   </th> */}
//                 </tr>
//               </thead>

//               {/* Table Body - FIXED SECTION with web values in parentheses */}
//               <tbody className="bg-white text-xs relative">
//                 {/* ✅ ADDED: Check for customFilterPending state */}
//                 {customFilterPending ? (
//                   <tr>
//                     <td colSpan={23} className="py-8">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="text-gray-500 text-sm">
//                           Please select custom dates and click "Apply" in the
//                           filter bar above to view dealer data.
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : displayedDealers.length === 0 ? (
//                   <tr>
//                     <td colSpan={23} className="text-center py-8">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="text-gray-500">
//                           Loading dealers data...
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   displayedDealers.map((dealer, index) => {
//                     const isEven = index % 2 === 0;
//                     const rowBgColor = isEven ? "bg-white" : "bg-gray-50";

//                     return (
//                       <tr
//                         key={dealer.dealerId || dealer.id}
//                         className={`group transition-colors relative ${rowBgColor} hover:bg-blue-50`}
//                       >
//                         {/* Dealer Name - Sticky First Column - LEFT ALIGNED */}
//                         <td
//                           className={`sticky left-0 border-r border-gray-300 text-left text-xs text-gray-900  px-3 py-2 ${rowBgColor} group-hover:bg-blue-50`}
//                           style={{
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 20,
//                           }}
//                         >
//                           <button
//                             className="expand-btn flex items-center cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                             onClick={() => handleDealerClick(dealer)}
//                           >
//                             <span className="font-semibold truncate group-hover:underline">
//                               {dealer.dealerName || dealer.name}
//                             </span>
//                             <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
//                           </button>
//                         </td>

//                         {/* Users Data - RIGHT ALIGNED */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-medium">
//                           {getDealerValue(dealer, "totalUsers")}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200">
//                           {getDealerValue(dealer, "registerUsers")}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300 font-semibold text-[#222fb9]">
//                           {getDealerValue(dealer, "activeUsers")}
//                         </td>

//                         {/* Leads Data - RIGHT ALIGNED - WEB DATA SAME COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           <div className="flex items-center justify-end">
//                             <span>{getDealerValue(dealer, "saLeads")}</span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300">
//                           {getDealerValue(dealer, "manuallyEnteredLeads")}
//                         </td>

//                         {/* Follow-ups Data - RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           <div className="flex items-center justify-end">
//                             <span>{getDealerValue(dealer, "saFollowUps")}</span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webleadsFollowUps")})
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-green-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "completedFollowUps")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webCompletedFollowUps")}
//                               )
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 text-blue-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "openFollowUps")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webUpcomingFollowUps")})
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300 font-semibold text-red-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "closedFollowUps")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webOverdueFollowUps")})
//                             </span>
//                           </div>
//                         </td>

//                         {/* Test Drives Data - RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "totalTestDrives")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webleadsTestDrives")})
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-green-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "completedTestDrives")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               (
//                               {getDealerValue(dealer, "webCompletedTestDrives")}
//                               )
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 text-blue-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "upcomingTestDrives")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webUpcomingTestDrives")}
//                               )
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-red-600">
//                           <div className="flex items-center justify-end">
//                             <span>
//                               {getDealerValue(dealer, "closedTestDrives")}
//                             </span>
//                             <span
//                               className="text-xs ml-1"
//                               style={{ color: "rgb(255, 152, 0)" }}
//                             >
//                               ({getDealerValue(dealer, "webOverdueTestDrives")})
//                             </span>
//                           </div>
//                         </td>

//                         {/* Opportunities Data - RIGHT ALIGNED */}
//                         <td className="px-2 py-2 text-right font-semibold text-teal-600">
//                           {getDealerValue(dealer, "opportunitiesConverted")}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Show More/Less Buttons - HIDE when customFilterPending is true */}
//           {!customFilterPending &&
//             (selectedDealers.length > 0
//               ? selectedDealers.length
//               : dealers.length) > 10 && (
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-4 gap-2 sm:gap-0">
//                 <div className="text-xs text-gray-500">
//                   Showing{" "}
//                   {Math.min(
//                     tableLength,
//                     selectedDealers.length > 0
//                       ? selectedDealers.length
//                       : dealers.length,
//                   )}{" "}
//                   of{" "}
//                   {selectedDealers.length > 0
//                     ? selectedDealers.length
//                     : dealers.length}{" "}
//                   dealers
//                 </div>
//                 <div className="flex gap-2 self-end sm:self-auto">
//                   {tableLength <
//                     (selectedDealers.length > 0
//                       ? selectedDealers.length
//                       : dealers.length) && (
//                     <button
//                       className="px-3 py-2 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                       onClick={() => setTableLength((prev) => prev + 10)}
//                     >
//                       <i className="fas fa-chevron-down text-[10px]"></i>
//                       Show More
//                     </button>
//                   )}
//                   {tableLength > 10 && (
//                     <button
//                       className="px-3 py-2 bg-gray-600 cursor-pointer text-white rounded text-xs hover:bg-gray-700 transition-colors font-medium flex items-center gap-1"
//                       onClick={() => setTableLength(10)}
//                     >
//                       <i className="fas fa-chevron-up text-[10px]"></i>
//                       Show Less
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>

//       {/* User Details Modal */}
//       {showUserModal && selectedDealer && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - Responsive layout */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               {/* Desktop: Title and filters */}
//               <div className="hidden md:flex items-center gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   User Details -{" "}
//                   {selectedDealer.dealerName || selectedDealer.name}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                     {dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0}{" "}
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

//                   {/* Custom date inputs for desktop */}
//                   {modalFilter === "CUSTOM" && (
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
//                         <input
//                           type="date"
//                           value={modalCustomStartDate || ""}
//                           onChange={(e) => {
//                             setModalCustomStartDate(e.target.value);
//                             validateModalDates();
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
//                             validateModalDates();
//                           }}
//                           className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                           disabled={isLoadingDealerData}
//                         />
//                       </div>

//                       <button
//                         onClick={handleApplyCustomDates}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] whitespace-nowrap"
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

//                   {/* Show error message if dates are invalid */}
//                   {modalInvalidDateRange && modalFilter === "CUSTOM" && (
//                     <div className="text-xs text-red-600 whitespace-nowrap">
//                       ❌ End date must be after start date
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
//                 <div className="flex-1">
//                   <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                     User Details
//                     <br />
//                     <span className="text-sm font-normal break-words">
//                       {selectedDealer.dealerName || selectedDealer.name}
//                     </span>
//                   </h2>
//                 </div>
//                 {/* Phone screen cross - on right end top */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors ml-2 flex-shrink-0"
//                   disabled={isLoadingDealerData}
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Right side: Export button and Cross for desktop */}
//               <div className="hidden md:flex items-center gap-3">
//                 {/* ✅ ADD: PNG Export Button for modal */}
//                 {/* <button
//                   className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//                   onClick={handleExportModalPNG}
//                   disabled={
//                     loadingUsers[
//                       selectedDealer.dealerId || selectedDealer.id
//                     ] ||
//                     (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0) === 0 ||
//                     isLoadingDealerData
//                   }
//                   title="Export as PNG image"
//                 >
//                   <i className="fas fa-camera text-xs"></i>
//                   PNG
//                 </button>
//                  */}
//                 {/* Export CSV Button */}
//                 {/* <button
//                   className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//                   onClick={handleExportDealerUsersCSV}
//                   disabled={
//                     loadingUsers[
//                       selectedDealer.dealerId || selectedDealer.id
//                     ] ||
//                     (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0) === 0 ||
//                     isLoadingDealerData
//                   }
//                   title="Export User Data to CSV"
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   CSV
//                 </button> */}

//                 {/* Cross Icon Button */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
//                   disabled={isLoadingDealerData}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* MOBILE ONLY: Additional row for mobile controls */}
//             <div className="md:hidden mb-4 space-y-3">
//               {/* Mobile filters */}
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
//                   {dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                     ?.length || 0}{" "}
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

//                 {/* ✅ ADD: Mobile Export Buttons Container */}
//                 <div className="flex items-center gap-2 w-full">
//                   {/* PNG Export for mobile */}
//                   <button
//                     className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 whitespace-nowrap flex-1"
//                     onClick={handleExportModalPNG}
//                     disabled={
//                       loadingUsers[
//                         selectedDealer.dealerId || selectedDealer.id
//                       ] ||
//                       (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                         ?.length || 0) === 0 ||
//                       isLoadingDealerData
//                     }
//                     title="Export as PNG image"
//                   >
//                     <i className="fas fa-camera text-xs mr-1"></i>
//                     PNG
//                   </button>

//                   {/* Export CSV for mobile */}
//                   <button
//                     className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 whitespace-nowrap flex-1"
//                     onClick={handleExportDealerUsersCSV}
//                     disabled={
//                       loadingUsers[
//                         selectedDealer.dealerId || selectedDealer.id
//                       ] ||
//                       (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                         ?.length || 0) === 0 ||
//                       isLoadingDealerData
//                     }
//                     title="Export User Data to CSV"
//                   >
//                     <i className="fas fa-download text-xs mr-1"></i>
//                     CSV
//                   </button>
//                 </div>
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
//                           validateModalDates();
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
//                           validateModalDates();
//                         }}
//                         className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                         disabled={isLoadingDealerData}
//                       />
//                     </div>

//                     <div className="flex items-center gap-2 w-full">
//                       <button
//                         onClick={handleApplyCustomDates}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] whitespace-nowrap flex-1"
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

//                   {/* Show error message on mobile */}
//                   {modalInvalidDateRange && modalFilter === "CUSTOM" && (
//                     <div className="text-xs text-red-600">
//                       ❌ End date must be after start date
//                     </div>
//                   )}
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

//             {/* Dealer Summary Section */}
//             <div className="mb-4 flex-shrink-0">
//               <h3 className="text-sm font-semibold text-gray-800 mb-2 px-1">
//                 Dealer Summary -{" "}
//                 {selectedDealer.dealerName || selectedDealer.name}
//               </h3>

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
//                     <table className="w-full border-collapse text-xs min-w-max">
//                       <thead>
//                         <tr className="bg-gray-100 border-b border-gray-300">
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Total
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Registered
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Active
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Digital
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
//                             Opportunities Converted
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className="bg-white border-b border-gray-200">
//                           {/* All data cells are RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(currentDealer, "totalUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(currentDealer, "registerUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(currentDealer, "activeUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(currentDealer, "saLeads")}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(
//                               currentDealer,
//                               "manuallyEnteredLeads",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(currentDealer, "saFollowUps")}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webleadsFollowUps",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "completedFollowUps",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webCompletedFollowUps",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(currentDealer, "openFollowUps")}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webUpcomingFollowUps",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "closedFollowUps",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webOverdueFollowUps",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "totalTestDrives",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 ({getDealerValue(currentDealer, "saTestDrives")}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "completedTestDrives",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webCompletedTestDrives",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "upcomingTestDrives",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webUpcomingTestDrives",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "closedTestDrives",
//                                 )}
//                               </span>
//                               <span
//                                 className="text-xs ml-1"
//                                 style={{ color: "rgb(255, 152, 0)" }}
//                               >
//                                 (
//                                 {getDealerValue(
//                                   currentDealer,
//                                   "webOverdueTestDrives",
//                                 )}
//                                 )
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "opportunitiesConverted",
//                             )}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 );
//               })()}
//             </div>
//             {/* User Details Content - Added ref for PNG capture */}
//             <div className="flex-1 overflow-auto min-h-0" ref={modalTableRef}>
//               <DealerUserDetails
//                 dealer={selectedDealer}
//                 loadingUsers={loadingUsers}
//                 onGetSortedUsers={onGetSortedUsers}
//                 dealerUsers={dealerUsers}
//                 currentFilter={modalFilter}
//                 customStartDate={
//                   modalFilter === "CUSTOM" ? modalCustomStartDate : undefined
//                 }
//                 customEndDate={
//                   modalFilter === "CUSTOM" ? modalCustomEndDate : undefined
//                 }
//                 formatNumberWithCommas={formatNumberWithCommas}
//               />
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
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

// export default DealerSummaryTable;
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
//   // Add new prop for fetching dealer data
//   onFetchDealerData,
//   // ✅ ADD: Props for parent's custom dates
//   customStartDate: parentCustomStartDate,
//   customEndDate: parentCustomEndDate,
//   // ✅ ADD: New prop for custom filter pending state
//   customFilterPending, // This comes from parent CEODashboard
// }) => {
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [modalDealerData, setModalDealerData] = useState(null);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);

//   // ✅ ADD: Ref for main table PNG export
//   const mainTableRef = useRef(null);
//   const modalTableRef = useRef(null);

//   // ✅ ADD: Modal-specific custom date states
//   const [modalCustomStartDate, setModalCustomStartDate] = useState("");
//   const [modalCustomEndDate, setModalCustomEndDate] = useState("");
//   const [modalInvalidDateRange, setModalInvalidDateRange] = useState(false);

//   // ✅ ADD: State for overdue modals (CEO Case)
//   const [showOverdueModal, setShowOverdueModal] = useState(false);
//   const [overdueModalType, setOverdueModalType] = useState(null); // 'followups' or 'testdrives'
//   const [overdueModalData, setOverdueModalData] = useState(null);
//   const [overdueModalLoading, setOverdueModalLoading] = useState(false);

//   // ✅ ADD: State for toast notifications
//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);

//   // ✅ ADD: Format number function (CEO Case)
//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return "0";
//     return Number(num).toLocaleString("en-IN");
//   };

//   // Check if there's only one dealer to show
//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

//   // ✅ ADD: Function to handle overdue value click (CEO Case)
//   const handleOverdueClick = async (dealer, type) => {
//     // type can be 'followups' or 'testdrives'
//     setOverdueModalType(type);
//     setOverdueModalData(null);
//     setOverdueModalLoading(true);
//     setShowOverdueModal(true);

//     // Here you would typically fetch the detailed overdue data from API
//     // For now, we'll create mock data based on the dealer
//     setTimeout(() => {
//       const mockData = {
//         dealerName: dealer.dealerName || dealer.name,
//         type: type,
//         total:
//           type === "followups"
//             ? dealer.closedFollowUps || 0
//             : dealer.closedTestDrives || dealer.saTestDrives || 0,
//         webTotal:
//           type === "followups"
//             ? dealer.webOverdueFollowUps || 0
//             : dealer.webOverdueTestDrives || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   mobile: "9876543210",
//                   email: "john@example.com",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   assignedTo: "Sales Rep 1",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   mobile: "9876543211",
//                   email: "jane@example.com",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   assignedTo: "Sales Rep 2",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 3,
//                   customerName: "Bob Johnson",
//                   mobile: "9876543212",
//                   email: "bob@example.com",
//                   date: "2024-01-13",
//                   reason: "Waiting for feedback",
//                   assignedTo: "Sales Rep 1",
//                   status: "Overdue",
//                   source: "Web Lead",
//                 },
//                 {
//                   id: 4,
//                   customerName: "Alice Brown",
//                   mobile: "9876543213",
//                   email: "alice@example.com",
//                   date: "2024-01-12",
//                   reason: "Schedule conflict",
//                   assignedTo: "Sales Rep 3",
//                   status: "Overdue",
//                   source: "Web Lead",
//                 },
//                 {
//                   id: 5,
//                   customerName: "Charlie Wilson",
//                   mobile: "9876543214",
//                   email: "charlie@example.com",
//                   date: "2024-01-11",
//                   reason: "Price negotiation",
//                   assignedTo: "Sales Rep 2",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   mobile: "9876543215",
//                   email: "alice@example.com",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   assignedTo: "Test Drive Manager",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   mobile: "9876543216",
//                   email: "charlie@example.com",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   assignedTo: "Sales Rep 1",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 3,
//                   customerName: "David Miller",
//                   mobile: "9876543217",
//                   email: "david@example.com",
//                   date: "2024-01-14",
//                   vehicle: "Model Z",
//                   assignedTo: "Test Drive Manager",
//                   status: "Overdue",
//                   source: "Web Lead",
//                 },
//                 {
//                   id: 4,
//                   customerName: "Eva Davis",
//                   mobile: "9876543218",
//                   email: "eva@example.com",
//                   date: "2024-01-13",
//                   vehicle: "Model A",
//                   assignedTo: "Sales Rep 3",
//                   status: "Overdue",
//                   source: "Web Lead",
//                 },
//                 {
//                   id: 5,
//                   customerName: "Frank Wilson",
//                   mobile: "9876543219",
//                   email: "frank@example.com",
//                   date: "2024-01-12",
//                   vehicle: "Model B",
//                   assignedTo: "Test Drive Manager",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//               ],
//       };
//       setOverdueModalData(mockData);
//       setOverdueModalLoading(false);
//     }, 500);
//   };

//   // ✅ ADD: Function to close overdue modal
//   const closeOverdueModal = () => {
//     setShowOverdueModal(false);
//     setOverdueModalType(null);
//     setOverdueModalData(null);
//   };

//   // ✅ ADD: Get dealer value with clickable overdue functionality
//   const getDealerValue = (
//     dealer,
//     fieldName,
//     webFieldName = null,
//     isOverdue = false,
//     overdueType = null,
//   ) => {
//     if (!dealer) return "0";

//     let value;
//     let webValue = null;

//     // Get main value
//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) value = 0;
//       }
//     } else {
//       value = dealer[fieldName] || 0;
//     }

//     // Get web value if provided
//     if (webFieldName) {
//       if (webFieldName.includes(".")) {
//         const fields = webFieldName.split(".");
//         webValue = dealer;
//         for (const field of fields) {
//           webValue = webValue?.[field];
//           if (webValue === undefined || webValue === null) webValue = 0;
//         }
//       } else {
//         webValue = dealer[webFieldName] || 0;
//       }
//     }

//     const formattedValue = formatNumber(value);

//     // If it's an overdue field and has value > 0, make it clickable
//     if (isOverdue && (value > 0 || (webValue && webValue > 0))) {
//       const formattedWebValue =
//         webValue !== null ? formatNumber(webValue) : null;

//       return (
//         <div className="flex items-center justify-end">
//           {value > 0 ? (
//             <button
//               className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer font-semibold"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOverdueClick(dealer, overdueType);
//               }}
//               title={`Click to view overdue ${overdueType === "followups" ? "follow-ups" : "test drives"}`}
//             >
//               {formattedValue}
//             </button>
//           ) : (
//             <span className="font-semibold text-red-600">{formattedValue}</span>
//           )}
//           {webValue !== null && (
//             <span
//               className="text-xs ml-1"
//               style={{ color: "rgb(255, 152, 0)" }}
//             >
//               ({formattedWebValue})
//             </span>
//           )}
//         </div>
//       );
//     }

//     // Regular display with web value in parentheses
//     if (webValue !== null) {
//       return (
//         <div className="flex items-center justify-end">
//           <span>{formattedValue}</span>
//           <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
//             ({formatNumber(webValue)})
//           </span>
//         </div>
//       );
//     }

//     return <div className="text-right">{formattedValue}</div>;
//   };

//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) {
//       return;
//     }

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       // ✅ CREATE: Temporary container for export
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

//       // ✅ CREATE: Clone of the ENTIRE table section
//       const clone = mainTableRef.current.cloneNode(true);

//       // ✅ GET: Elements from clone (not original)
//       const scrollContainer = clone.querySelector(".table-scroll");
//       const outerContainer = clone.querySelector(".table-container");
//       const table = clone.querySelector(".data-table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");
//       const expandButtons = clone.querySelectorAll(".expand-btn");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       // ✅ FIXED: Make export container match original width
//       const originalRect = mainTableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       // ✅ FIXED: Remove scroll restrictions but maintain layout IN CLONE
//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "relative";
//       }

//       if (outerContainer) {
//         outerContainer.style.overflow = "visible";
//         outerContainer.style.position = "relative";
//       }

//       // ✅ FIXED: Keep clone table's natural width
//       if (table) {
//         const actualWidth = table.scrollWidth;
//         table.style.width = `${actualWidth}px`;
//         table.style.minWidth = `${actualWidth}px`;
//         table.style.position = "relative";
//       }

//       // ✅ FIXED: Temporarily remove sticky positioning IN CLONE
//       if (tableHead) {
//         tableHead.style.position = "relative";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       // ✅ FIXED: Remove sticky positioning from ALL sticky cells IN CLONE
//       stickyCells.forEach((cell) => {
//         cell.style.position = "relative";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//       });

//       // ✅ FIXED: Clean up expand buttons in clone - make them plain text
//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         const icon = btn.querySelector("i");

//         if (span) {
//           // Replace button with just the dealer name text
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         } else if (icon) {
//           icon.style.display = "none";
//         }
//       });

//       // ✅ FIXED: Remove export buttons in the clone
//       const exportButtons = clone.querySelectorAll(".btn-export");
//       exportButtons.forEach((btn) => {
//         btn.remove();
//       });

//       // ✅ FIXED: Remove any other interactive elements from clone
//       const interactiveElements = clone.querySelectorAll(
//         "button, select, input, .fa-spinner, .fa-download, .fa-image, .fa-camera",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       // ✅ FIXED: Clean up table cells in clone (not original)
//       const allCells = clone.querySelectorAll("td, th");
//       allCells.forEach((cell) => {
//         cell.style.boxShadow = "none";
//       });

//       // ✅ ADD: Clone to export container
//       exportContainer.appendChild(clone);

//       // ✅ ADD: Export container to body
//       document.body.appendChild(exportContainer);

//       // Force a reflow on the clone
//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           if (table) table.offsetHeight; // Trigger reflow on clone
//           resolve();
//         });
//       });

//       // Wait for layout to settle
//       await new Promise((resolve) => setTimeout(resolve, 300));

//       // ✅ FIXED: Get dimensions from the clone (not original)
//       const captureWidth = table.scrollWidth;
//       const captureHeight = table.scrollHeight;

//       // Add minimal padding
//       const paddedWidth = captureWidth + 40;
//       const paddedHeight = captureHeight + 40;

//       // ✅ FIXED: Capture the clone (not original)
//       const dataUrl = await toPng(table, {
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
//           padding: "0",
//           display: "block",
//         },
//         filter: (node) => {
//           // Exclude hidden elements
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           // Exclude any remaining interactive elements
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("export-button") ||
//               node.classList.contains("fa-chevron-right") ||
//               node.classList.contains("fa-spinner") ||
//               node.classList.contains("fa-download") ||
//               node.classList.contains("fa-image") ||
//               node.classList.contains("fa-camera"))
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       // ✅ FIXED: Remove the export container (clone gets removed with it)
//       document.body.removeChild(exportContainer);

//       // ✅ NO NEED TO RESTORE STYLES - Original table was never modified!

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
//         button.innerHTML =
//           '<i class="fas fa-camera text-xs mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   // ✅ ADD: Function to export modal table as PNG
//   const handleExportModalPNG = async () => {
//     if (!modalTableRef.current || !selectedDealer) {
//       return;
//     }

//     try {
//       const button = document.activeElement;
//       const originalHTML = button?.innerHTML;
//       if (button) {
//         button.innerHTML =
//           '<i class="fas fa-spinner fa-spin mr-1"></i>Exporting...';
//         button.disabled = true;
//       }

//       // Get the modal content container
//       const modalContent = modalTableRef.current;
//       const dealerName =
//         selectedDealer.dealerName || selectedDealer.name || "dealer";

//       // Find all tables in the modal
//       const tables = modalContent.querySelectorAll("table");

//       // We'll capture the entire modal content
//       const dataUrl = await toPng(modalContent, {
//         quality: 1.0,
//         pixelRatio: 2,
//         backgroundColor: "#ffffff",
//         style: {
//           transform: "none",
//           transformOrigin: "top left",
//           overflow: "visible",
//           margin: "0",
//           padding: "0",
//           display: "block",
//         },
//         filter: (node) => {
//           // Exclude interactive elements
//           if (
//             node.classList?.contains("btn-export") ||
//             node.classList?.contains("export-button") ||
//             node.classList?.contains("fa-spinner") ||
//             node.classList?.contains("fa-download") ||
//             node.classList?.contains("fa-image") ||
//             node.classList?.contains("fa-camera") ||
//             node.classList?.contains("time-filter") ||
//             node.classList?.contains("custom-date") ||
//             node.classList?.contains("apply-btn") ||
//             node.classList?.contains("reset-btn") ||
//             node.tagName?.toLowerCase() === "button" ||
//             node.tagName?.toLowerCase() === "select" ||
//             node.tagName?.toLowerCase() === "input"
//           ) {
//             return false;
//           }
//           return true;
//         },
//       });

//       // Create and download the PNG
//       const link = document.createElement("a");
//       link.download = `user-details-${dealerName.replace(/\s+/g, "-")}-${
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
//       console.error("❌ Error exporting modal PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-camera text-xs"></i>PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   // ✅ FIXED: Sync modal filter with parent filter when modal opens
//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalDealerData(null);

//       // ✅ FIX: ALWAYS initialize modal custom dates from parent's custom dates when they exist
//       if (parentCustomStartDate && parentCustomEndDate) {
//         setModalCustomStartDate(parentCustomStartDate);
//         setModalCustomEndDate(parentCustomEndDate);
//       } else {
//         setModalCustomStartDate("");
//         setModalCustomEndDate("");
//       }

//       setModalInvalidDateRange(false);
//     }
//   }, [
//     showUserModal,
//     selectedFilter,
//     parentCustomStartDate,
//     parentCustomEndDate,
//   ]);

//   // ✅ ADD: Validate modal dates
//   const validateModalDates = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       const invalid =
//         new Date(modalCustomStartDate) > new Date(modalCustomEndDate);
//       setModalInvalidDateRange(invalid);
//       return !invalid;
//     }
//     return false;
//   };

//   // Format number with commas (e.g., 10000 -> 10,000) - Keep for compatibility
//   const formatNumberWithCommas = (num) => {
//     if (num === null || num === undefined || num === "") return "0";
//     const number = typeof num === "string" ? parseFloat(num) : num;
//     if (isNaN(number)) return "0";
//     return number.toLocaleString("en-IN");
//   };

//   // Get dealer value with formatting - Keep for compatibility
//   const getDealerValueOld = (dealer, fieldName) => {
//     if (!dealer) return "0";

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return "0";
//       }
//       return formatNumberWithCommas(value || 0);
//     }

//     value = dealer[fieldName];
//     return formatNumberWithCommas(value || 0);
//   };

//   // Get dealer value as number for sorting (without formatting)
//   const getDealerValueAsNumber = (dealer, fieldName) => {
//     if (!dealer) return 0;

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return 0;
//       }
//       return Number(value) || 0;
//     }

//     value = dealer[fieldName];
//     return Number(value) || 0;
//   };

//   // ✅ FIXED: Enhanced handleModalFilterChange with custom date support
//   const handleModalFilterChange = async (
//     filterValue,
//     applyCustomDates = false,
//   ) => {
//     if (!selectedDealer) {
//       return;
//     }

//     // If CUSTOM filter and not applying custom dates yet, just update filter
//     if (filterValue === "CUSTOM" && !applyCustomDates) {
//       setModalFilter("CUSTOM");
//       return;
//     }

//     // If CUSTOM filter and we're applying dates, validate them
//     if (filterValue === "CUSTOM" && applyCustomDates) {
//       if (!modalCustomStartDate || !modalCustomEndDate) {
//         setToastMessage(
//           "Please select both start and end dates for custom range",
//         );
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }

//       const isValid = validateModalDates();
//       if (!isValid) {
//         setToastMessage("End date cannot be before start date");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     // For CUSTOM filter, make sure we have dates even if not applying new ones
//     let startDateToUse, endDateToUse;
//     if (filterValue === "CUSTOM") {
//       startDateToUse = modalCustomStartDate;
//       endDateToUse = modalCustomEndDate;

//       // Validate dates are present for CUSTOM filter
//       if (!startDateToUse || !endDateToUse) {
//         setToastMessage(
//           "Please select both start and end dates for custom range",
//         );
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     try {
//       // Fetch fresh dealer summary data
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           selectedDealer,
//           filterValue,
//           // Pass custom dates when filter is CUSTOM
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       // Also fetch fresh user data
//       if (onFetchDealerUsers) {
//         // Pass custom dates for CUSTOM filter
//         await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           // Pass custom dates for CUSTOM filter
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch dealer data:", error);
//     } finally {
//       setIsLoadingDealerData(false);
//     }
//   };

//   // ✅ UPDATED: Apply custom dates handler with validation
//   const handleApplyCustomDates = () => {
//     // Check if dates are selected
//     if (!modalCustomStartDate || !modalCustomEndDate) {
//       setToastMessage("Please select both start and end dates");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     // Validate date range
//     if (new Date(modalCustomStartDate) > new Date(modalCustomEndDate)) {
//       setToastMessage("End date cannot be before start date");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     // If valid, apply the filter
//     const isValid = validateModalDates();
//     if (isValid) {
//       handleModalFilterChange("CUSTOM", true);
//     }
//   };

//   // ✅ FIXED: Reset custom dates handler
//   const handleResetCustomDates = () => {
//     // Reset to parent's filter
//     setModalFilter(selectedFilter);

//     // ✅ FIX: Reset to parent's custom dates if parent filter is CUSTOM
//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(parentCustomStartDate || "");
//       setModalCustomEndDate(parentCustomEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     setModalInvalidDateRange(false);

//     // Re-fetch with parent's filter and custom dates
//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   // ✅ FIXED: Handle dealer click to open modal
//   const handleDealerClick = async (dealer) => {
//     const dealerId = dealer.dealerId || dealer.id;

//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalDealerData(null);

//     // ✅ FIX: Set modal custom dates from parent immediately
//     if (parentCustomStartDate && parentCustomEndDate) {
//       setModalCustomStartDate(parentCustomStartDate);
//       setModalCustomEndDate(parentCustomEndDate);
//     }

//     // Check if we already have user data for this dealer
//     const hasUserData =
//       dealerUsers[dealerId] && dealerUsers[dealerId].length > 0;

//     // Only show loading if we need to fetch data
//     if (!hasUserData) {
//       setIsLoadingDealerData(true);
//     }

//     try {
//       // Fetch fresh dealer data with initial filter (ALWAYS fetch this)
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           dealer,
//           selectedFilter,
//           // ✅ PASS PARENT'S CUSTOM DATES IF FILTER IS CUSTOM
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       // Only fetch user data if we don't have it already
//       if (onFetchDealerUsers && !hasUserData) {
//         await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           // ✅ PASS PARENT'S CUSTOM DATES IF FILTER IS CUSTOM
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch initial dealer data:", error);
//     } finally {
//       setIsLoadingDealerData(false);
//     }

//     // Call toggle summary row if needed for other functionality
//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   // Get current dealer data for modal (either filtered data or original data)
//   const getCurrentDealerData = () => {
//     if (modalDealerData) {
//       return modalDealerData;
//     }

//     if (selectedDealer) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;
//       return (
//         dealers.find((d) => (d.dealerId || d.id) === dealerId) || selectedDealer
//       );
//     }

//     return selectedDealer;
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setModalDealerData(null);
//     setIsLoadingDealerData(false);
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = getDealerValueAsNumber(a, sortColumn);
//       const valB = getDealerValueAsNumber(b, sortColumn);
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

//   // ✅ FIXED: Export CSV with web values in parentheses
//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     // Helper function to get combined value with web value in parentheses
//     const getCombinedDealerValue = (dealer, mainField, webField) => {
//       if (!dealer) return "0";

//       const mainValue = getDealerValueAsNumber(dealer, mainField);
//       let webValue = 0;

//       if (webField) {
//         webValue = getDealerValueAsNumber(dealer, webField);
//       }

//       // Return format: "mainValue (webValue)"
//       return `${mainValue} (${webValue})`;
//     };

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
//       "Created Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Unique Test Drives",
//       "Opportunities Converted",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) =>
//         [
//           // Dealer Name (keep in quotes)
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,

//           // Users - no web values
//           getDealerValueAsNumber(dealer, "totalUsers"),
//           getDealerValueAsNumber(dealer, "registerUsers"),
//           getDealerValueAsNumber(dealer, "activeUsers"),

//           // Leads
//           getDealerValueAsNumber(dealer, "saLeads"),
//           getDealerValueAsNumber(dealer, "manuallyEnteredLeads"),

//           // Follow-ups with web values in parentheses
//           getCombinedDealerValue(dealer, "saFollowUps", "webleadsFollowUps"),
//           getCombinedDealerValue(
//             dealer,
//             "completedFollowUps",
//             "webCompletedFollowUps",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "openFollowUps",
//             "webUpcomingFollowUps",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "closedFollowUps",
//             "webOverdueFollowUps",
//           ),

//           // Test Drives with web values in parentheses
//           getCombinedDealerValue(dealer, "totalTestDrives", "saTestDrives"),
//           getCombinedDealerValue(
//             dealer,
//             "completedTestDrives",
//             "webCompletedTestDrives",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "upcomingTestDrives",
//             "webUpcomingTestDrives",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "closedTestDrives",
//             "webOverdueTestDrives",
//           ),

//           // Unique Test Drives
//           getDealerValueAsNumber(dealer, "uniqueTestDrives"),

//           // Opportunities Converted
//           getDealerValueAsNumber(dealer, "opportunitiesConverted"),
//         ].join(","),
//       ),
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

//   // ✅ FIXED: Export dealer users CSV with web values in parentheses
//   const handleExportDealerUsersCSV = () => {
//     if (!selectedDealer) return;

//     const dealerId = selectedDealer.dealerId || selectedDealer.id;
//     const users = dealerUsers[dealerId] || [];
//     const dealerName =
//       selectedDealer.dealerName || selectedDealer.name || "Unknown Dealer";

//     if (users.length === 0) {
//       alert("No user data to export for this dealer.");
//       return;
//     }

//     // Helper function to get combined value for users
//     const getCombinedUserValue = (user, mainFieldPath, webFieldPath) => {
//       if (!user) return "0 (0)";

//       const mainValue = getUserValue(user, mainFieldPath);
//       let webValue = 0;

//       if (webFieldPath) {
//         webValue = getUserValue(user, webFieldPath);
//       }

//       return `${mainValue} (${webValue})`;
//     };

//     const headers = [
//       "User Name",
//       "Role",
//       "Registered",
//       "Status",
//       "Last Login",
//       "Created Enquiries",
//       "Digital",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Created Test Drives",
//       "Digital Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "New Orders",
//       "Net Orders",
//       "Retail",
//       "Cancellations",
//       "Opportunities Converted",
//     ];

//     const getUserValue = (user, fieldPath) => {
//       if (!user) return 0;

//       if (fieldPath.includes(".")) {
//         const fields = fieldPath.split(".");
//         let value = user;
//         for (const field of fields) {
//           value = value?.[field];
//           if (value === undefined || value === null) return 0;
//         }
//         return value || 0;
//       }

//       return user[fieldPath] || 0;
//     };

//     const csvContent = [
//       headers.join(","),
//       ...users.map((user) =>
//         [
//           // User Name
//           `"${(user.user || "").replace(/"/g, '""')}"`,

//           // Role
//           `"${(user.user_role || "").replace(/"/g, '""')}"`,

//           // Registration and Status
//           user.registerUser ? "Yes" : "No",
//           user.active ? "Active" : "Inactive",

//           // Last Login
//           `"${(user.last_login || "Never").replace(/"/g, '""')}"`,

//           // Leads
//           getUserValue(user, "leads.sa"),
//           getUserValue(user, "leads.manuallyEntered"),

//           // Follow-ups with web values
//           getCombinedUserValue(user, "followups.sa", "followups.webleads"),
//           getCombinedUserValue(
//             user,
//             "followups.completed",
//             "followups.webCompleted",
//           ),
//           getCombinedUserValue(user, "followups.open", "followups.webUpcoming"),
//           getCombinedUserValue(
//             user,
//             "followups.closed",
//             "followups.webOverdue",
//           ),

//           // Test Drives with web values
//           getCombinedUserValue(user, "testdrives.sa", "testdrives.webleads"),
//           getUserValue(user, "testdrives.digital"),
//           getCombinedUserValue(
//             user,
//             "testdrives.completed",
//             "testdrives.webCompleted",
//           ),
//           getCombinedUserValue(
//             user,
//             "testdrives.upcoming",
//             "testdrives.webUpcoming",
//           ),
//           getCombinedUserValue(
//             user,
//             "testdrives.closed",
//             "testdrives.webOverdue",
//           ),

//           // Analytics
//           getUserValue(user, "newOrders"),
//           getUserValue(user, "netOrders"),
//           getUserValue(user, "retail"),
//           getUserValue(user, "cancellations"),
//           getUserValue(user, "opportunitiesConverted"),
//         ].join(","),
//       ),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `users-${dealerName.replace(/\s+/g, "-")}-${
//         new Date().toISOString().split("T")[0]
//       }.csv`,
//     );
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const sortedDealers = getSortedDealersForSummary();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

//   // Add function to get filter label
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
//       {/* Toast Notification */}
//       {showToast && (
//         <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
//           <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//             <i className="fas fa-exclamation-circle"></i>
//             <span>{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-4 relative">
//         {/* Table Header */}
//         <div className="table-header px-4 py-3 border-b border-gray-200 flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 bg-gray-50">
//           <div>
//             <h2 className="table-title text-sm font-bold text-gray-900">
//               Dealer Summary — Engagement
//             </h2>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-2 self-end sm:self-auto">
//             {/* ✅ ADD: PNG Export Button */}
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//               onClick={handleExportCSV}
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//             <button
//               className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//               onClick={handleExportMainTablePNG}
//               title="Export as PNG image"
//             >
//               <i className="fas fa-image text-[10px]"></i>
//               Export PNG
//             </button>
//           </div>
//         </div>

//         {/* ✅ ADDED: Ref for main table PNG export */}
//         <div ref={mainTableRef} className="table-container p-0 relative">
//           <div
//             className="table-scroll overflow-x-auto relative"
//             style={{ maxHeight: "600px", overflowY: "auto" }}
//           >
//             <table className="data-table w-full border-collapse text-xs min-w-[2000px] relative">
//               {/* Table Header */}
//               <thead className="table-thead bg-gray-50 sticky top-0 z-30">
//                 {/* First Header Row - Group Headers */}
//                 <tr className="text-xs">
//                   <th
//                     rowSpan={2}
//                     className="sticky left-0 bg-gray-50 z-40 border-r border-gray-300 px-3 py-1 font-semibold text-gray-900 text-left w-[20px] min-w-[20px]"
//                   >
//                     Dealer
//                   </th>
//                   <th
//                     colSpan={3}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-blue-50"
//                   >
//                     Users
//                   </th>
//                   <th
//                     colSpan={2}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-green-50"
//                   >
//                     Enquiries
//                   </th>
//                   <th
//                     colSpan={4}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-purple-50"
//                   >
//                     Follow-ups
//                   </th>
//                   <th
//                     colSpan={4}
//                     className="border-r border-gray-300 px-2 py-1 text-center font-semibold text-gray-700 bg-orange-50"
//                   >
//                     Test Drives
//                   </th>
//                   <th
//                     rowSpan={2}
//                     className="px-2 py-1 text-center font-semibold text-gray-700 bg-teal-50"
//                   >
//                     Opportunities Converted
//                   </th>
//                 </tr>

//                 {/* Second Header Row - Column Headers */}
//                 <tr className="text-xs">
//                   {/* Users Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("totalUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Total
//                       {hasMultipleDealers && <SortIcon column="totalUsers" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("registerUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Registered
//                       {hasMultipleDealers && (
//                         <SortIcon column="registerUsers" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("activeUsers")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Active
//                       {hasMultipleDealers && <SortIcon column="activeUsers" />}
//                     </span>
//                   </th>

//                   {/* Leads Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() => hasMultipleDealers && onSortData("saLeads")}
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && <SortIcon column="saLeads" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("manuallyEnteredLeads")
//                     }
//                   >
//                     <div className="flex items-center justify-center gap-1">
//                       <span>Digital</span>
//                       {hasMultipleDealers && (
//                         <SortIcon column="manuallyEnteredLeads" />
//                       )}
//                     </div>
//                   </th>

//                   {/* Followups Sub-headers */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("saFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && <SortIcon column="saFollowUps" />}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("completedFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Completed
//                       {hasMultipleDealers && (
//                         <SortIcon column="completedFollowUps" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("openFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Upcoming
//                       {hasMultipleDealers && (
//                         <SortIcon column="openFollowUps" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-300"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("closedFollowUps")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Overdue
//                       {hasMultipleDealers && (
//                         <SortIcon column="closedFollowUps" />
//                       )}
//                     </span>
//                   </th>

//                   {/* Test Drives Sub-headers - UPDATED with web test drives */}
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("totalTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Created
//                       {hasMultipleDealers && (
//                         <SortIcon column="totalTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("completedTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Completed
//                       {hasMultipleDealers && (
//                         <SortIcon column="completedTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("upcomingTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Upcoming
//                       {hasMultipleDealers && (
//                         <SortIcon column="upcomingTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                   <th
//                     className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                     onClick={() =>
//                       hasMultipleDealers && onSortData("closedTestDrives")
//                     }
//                   >
//                     <span className="inline-flex items-center justify-center gap-1">
//                       Overdue
//                       {hasMultipleDealers && (
//                         <SortIcon column="closedTestDrives" />
//                       )}
//                     </span>
//                   </th>
//                 </tr>
//               </thead>

//               {/* Table Body - FIXED SECTION with web values in parentheses */}
//               <tbody className="bg-white text-xs relative">
//                 {/* ✅ ADDED: Check for customFilterPending state */}
//                 {customFilterPending ? (
//                   <tr>
//                     <td colSpan={23} className="py-8">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="text-gray-500 text-sm">
//                           Please select custom dates and click "Apply" in the
//                           filter bar above to view dealer data.
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : displayedDealers.length === 0 ? (
//                   <tr>
//                     <td colSpan={23} className="text-center py-8">
//                       <div className="flex flex-col items-center justify-center">
//                         <div className="text-gray-500">
//                           Loading dealers data...
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   displayedDealers.map((dealer, index) => {
//                     const isEven = index % 2 === 0;
//                     const rowBgColor = isEven ? "bg-white" : "bg-gray-50";

//                     return (
//                       <tr
//                         key={dealer.dealerId || dealer.id}
//                         className={`group transition-colors relative ${rowBgColor} hover:bg-blue-50`}
//                       >
//                         {/* Dealer Name - Sticky First Column - LEFT ALIGNED */}
//                         <td
//                           className={`sticky left-0 border-r border-gray-300 text-left text-xs text-gray-900  px-3 py-2 ${rowBgColor} group-hover:bg-blue-50`}
//                           style={{
//                             position: "sticky",
//                             left: 0,
//                             zIndex: 20,
//                           }}
//                         >
//                           <button
//                             className="expand-btn flex items-center cursor-pointer text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                             onClick={() => handleDealerClick(dealer)}
//                           >
//                             <span className="font-semibold truncate group-hover:underline">
//                               {dealer.dealerName || dealer.name}
//                             </span>
//                             <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
//                           </button>
//                         </td>

//                         {/* Users Data - RIGHT ALIGNED */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-medium">
//                           {getDealerValue(dealer, "totalUsers")}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200">
//                           {getDealerValue(dealer, "registerUsers")}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300 font-semibold text-[#222fb9]">
//                           {getDealerValue(dealer, "activeUsers")}
//                         </td>

//                         {/* Leads Data - RIGHT ALIGNED - WEB DATA SAME COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           <div className="flex items-center justify-end">
//                             <span>{getDealerValue(dealer, "saLeads")}</span>
//                           </div>
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300">
//                           {getDealerValue(dealer, "manuallyEnteredLeads")}
//                         </td>

//                         {/* Follow-ups Data - RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           {getDealerValue(
//                             dealer,
//                             "saFollowUps",
//                             "webleadsFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-green-600">
//                           {getDealerValue(
//                             dealer,
//                             "completedFollowUps",
//                             "webCompletedFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 text-blue-600">
//                           {getDealerValue(
//                             dealer,
//                             "openFollowUps",
//                             "webUpcomingFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-300 font-semibold text-red-600">
//                           {getDealerValue(
//                             dealer,
//                             "closedFollowUps",
//                             "webOverdueFollowUps",
//                             true,
//                             "followups",
//                           )}
//                         </td>

//                         {/* Test Drives Data - RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                           {getDealerValue(
//                             dealer,
//                             "totalTestDrives",
//                             "saTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-green-600">
//                           {getDealerValue(
//                             dealer,
//                             "completedTestDrives",
//                             "webCompletedTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 text-blue-600">
//                           {getDealerValue(
//                             dealer,
//                             "upcomingTestDrives",
//                             "webUpcomingTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-2 text-right border-r border-gray-200 font-semibold text-red-600">
//                           {getDealerValue(
//                             dealer,
//                             "closedTestDrives",
//                             "webOverdueTestDrives",
//                             true,
//                             "testdrives",
//                           )}
//                         </td>

//                         {/* Opportunities Data - RIGHT ALIGNED */}
//                         <td className="px-2 py-2 text-right font-semibold text-teal-600">
//                           {getDealerValue(dealer, "opportunitiesConverted")}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Show More/Less Buttons - HIDE when customFilterPending is true */}
//           {!customFilterPending &&
//             (selectedDealers.length > 0
//               ? selectedDealers.length
//               : dealers.length) > 10 && (
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-4 gap-2 sm:gap-0">
//                 <div className="text-xs text-gray-500">
//                   Showing{" "}
//                   {Math.min(
//                     tableLength,
//                     selectedDealers.length > 0
//                       ? selectedDealers.length
//                       : dealers.length,
//                   )}{" "}
//                   of{" "}
//                   {selectedDealers.length > 0
//                     ? selectedDealers.length
//                     : dealers.length}{" "}
//                   dealers
//                 </div>
//                 <div className="flex gap-2 self-end sm:self-auto">
//                   {tableLength <
//                     (selectedDealers.length > 0
//                       ? selectedDealers.length
//                       : dealers.length) && (
//                     <button
//                       className="px-3 py-2 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                       onClick={() => setTableLength((prev) => prev + 10)}
//                     >
//                       <i className="fas fa-chevron-down text-[10px]"></i>
//                       Show More
//                     </button>
//                   )}
//                   {tableLength > 10 && (
//                     <button
//                       className="px-3 py-2 bg-gray-600 cursor-pointer text-white rounded text-xs hover:bg-gray-700 transition-colors font-medium flex items-center gap-1"
//                       onClick={() => setTableLength(10)}
//                     >
//                       <i className="fas fa-chevron-up text-[10px]"></i>
//                       Show Less
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>

//       {/* ✅ ADDED: Overdue Details Modal for CEO Case */}
//       {showOverdueModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeOverdueModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] max-w-6xl max-h-[85vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               <h2 className="text-xl font-bold text-gray-800">
//                 <span className="text-red-600">
//                   {overdueModalType === "followups"
//                     ? "Overdue Follow-ups"
//                     : "Overdue Test Drives"}
//                 </span>{" "}
//                 - {overdueModalData?.dealerName || "Dealer"}
//                 <span className="text-sm font-normal text-gray-600 ml-2">
//                   ({formatNumber(overdueModalData?.total || 0)} Sales App +{" "}
//                   {formatNumber(overdueModalData?.webTotal || 0)} Web Leads ={" "}
//                   {formatNumber(
//                     (overdueModalData?.total || 0) +
//                       (overdueModalData?.webTotal || 0),
//                   )}{" "}
//                   total)
//                 </span>
//               </h2>
//               <button
//                 onClick={closeOverdueModal}
//                 className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
//               >
//                 ×
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
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           ID
//                         </th>
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Customer Name
//                         </th>
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Mobile
//                         </th>
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Email
//                         </th>
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Date
//                         </th>
//                         {overdueModalType === "followups" ? (
//                           <>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                               Reason
//                             </th>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         ) : (
//                           <>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                               Vehicle
//                             </th>
//                             <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                               Assigned To
//                             </th>
//                           </>
//                         )}
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Source
//                         </th>
//                         <th className="px-4 py-3 text-left font-semibold text-gray-700">
//                           Status
//                         </th>
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
//                           <td className="px-4 py-3">{item.id}</td>
//                           <td className="px-4 py-3 font-medium">
//                             {item.customerName}
//                           </td>
//                           <td className="px-4 py-3">{item.mobile}</td>
//                           <td className="px-4 py-3">{item.email}</td>
//                           <td className="px-4 py-3">{item.date}</td>
//                           {overdueModalType === "followups" ? (
//                             <>
//                               <td className="px-4 py-3">{item.reason}</td>
//                               <td className="px-4 py-3">{item.assignedTo}</td>
//                             </>
//                           ) : (
//                             <>
//                               <td className="px-4 py-3">{item.vehicle}</td>
//                               <td className="px-4 py-3">{item.assignedTo}</td>
//                             </>
//                           )}
//                           <td className="px-4 py-3">
//                             <span
//                               className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                                 item.source === "Web Lead"
//                                   ? "bg-orange-100 text-orange-800"
//                                   : "bg-blue-100 text-blue-800"
//                               }`}
//                             >
//                               {item.source}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3">
//                             <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                               <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
//                               {item.status}
//                             </span>
//                           </td>
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
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[95vw] h-[95vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header - Responsive layout */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               {/* Desktop: Title and filters */}
//               <div className="hidden md:flex items-center gap-4">
//                 <h2 className="text-xl font-bold text-gray-800">
//                   User Details -{" "}
//                   {selectedDealer.dealerName || selectedDealer.name}
//                 </h2>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
//                     {dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0}{" "}
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

//                   {/* Custom date inputs for desktop */}
//                   {modalFilter === "CUSTOM" && (
//                     <div className="flex items-center gap-2">
//                       <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
//                         <input
//                           type="date"
//                           value={modalCustomStartDate || ""}
//                           onChange={(e) => {
//                             setModalCustomStartDate(e.target.value);
//                             validateModalDates();
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
//                             validateModalDates();
//                           }}
//                           className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
//                           disabled={isLoadingDealerData}
//                         />
//                       </div>

//                       <button
//                         onClick={handleApplyCustomDates}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] whitespace-nowrap"
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

//                   {/* Show error message if dates are invalid */}
//                   {modalInvalidDateRange && modalFilter === "CUSTOM" && (
//                     <div className="text-xs text-red-600 whitespace-nowrap">
//                       ❌ End date must be after start date
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
//                 <div className="flex-1">
//                   <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                     User Details
//                     <br />
//                     <span className="text-sm font-normal break-words">
//                       {selectedDealer.dealerName || selectedDealer.name}
//                     </span>
//                   </h2>
//                 </div>
//                 {/* Phone screen cross - on right end top */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors ml-2 flex-shrink-0"
//                   disabled={isLoadingDealerData}
//                 >
//                   ×
//                 </button>
//               </div>

//               {/* Right side: Export button and Cross for desktop */}
//               <div className="hidden md:flex items-center gap-3">
//                 {/* ✅ ADD: PNG Export Button for modal */}
//                 <button
//                   className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//                   onClick={handleExportModalPNG}
//                   disabled={
//                     loadingUsers[
//                       selectedDealer.dealerId || selectedDealer.id
//                     ] ||
//                     (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0) === 0 ||
//                     isLoadingDealerData
//                   }
//                   title="Export as PNG image"
//                 >
//                   <i className="fas fa-camera text-xs"></i>
//                   PNG
//                 </button>

//                 {/* Export CSV Button */}
//                 <button
//                   className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-1 transition-colors shadow-sm"
//                   onClick={handleExportDealerUsersCSV}
//                   disabled={
//                     loadingUsers[
//                       selectedDealer.dealerId || selectedDealer.id
//                     ] ||
//                     (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                       ?.length || 0) === 0 ||
//                     isLoadingDealerData
//                   }
//                   title="Export User Data to CSV"
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   CSV
//                 </button>

//                 {/* Cross Icon Button */}
//                 <button
//                   onClick={closeModal}
//                   className="text-gray-500 hover:text-gray-700 text-2xl font-bold bg-gray-100 hover:bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
//                   disabled={isLoadingDealerData}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>

//             {/* MOBILE ONLY: Additional row for mobile controls */}
//             <div className="md:hidden mb-4 space-y-3">
//               {/* Mobile filters */}
//               <div className="flex flex-wrap items-center gap-2">
//                 <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
//                   {dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                     ?.length || 0}{" "}
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

//                 {/* ✅ ADD: Mobile Export Buttons Container */}
//                 <div className="flex items-center gap-2 w-full">
//                   {/* PNG Export for mobile */}
//                   <button
//                     className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 whitespace-nowrap flex-1"
//                     onClick={handleExportModalPNG}
//                     disabled={
//                       loadingUsers[
//                         selectedDealer.dealerId || selectedDealer.id
//                       ] ||
//                       (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                         ?.length || 0) === 0 ||
//                       isLoadingDealerData
//                     }
//                     title="Export as PNG image"
//                   >
//                     <i className="fas fa-camera text-xs mr-1"></i>
//                     PNG
//                   </button>

//                   {/* Export CSV for mobile */}
//                   <button
//                     className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 whitespace-nowrap flex-1"
//                     onClick={handleExportDealerUsersCSV}
//                     disabled={
//                       loadingUsers[
//                         selectedDealer.dealerId || selectedDealer.id
//                       ] ||
//                       (dealerUsers[selectedDealer.dealerId || selectedDealer.id]
//                         ?.length || 0) === 0 ||
//                       isLoadingDealerData
//                     }
//                     title="Export User Data to CSV"
//                   >
//                     <i className="fas fa-download text-xs mr-1"></i>
//                     CSV
//                   </button>
//                 </div>
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
//                           validateModalDates();
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
//                           validateModalDates();
//                         }}
//                         className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
//                         disabled={isLoadingDealerData}
//                       />
//                     </div>

//                     <div className="flex items-center gap-2 w-full">
//                       <button
//                         onClick={handleApplyCustomDates}
//                         className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] whitespace-nowrap flex-1"
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

//                   {/* Show error message on mobile */}
//                   {modalInvalidDateRange && modalFilter === "CUSTOM" && (
//                     <div className="text-xs text-red-600">
//                       ❌ End date must be after start date
//                     </div>
//                   )}
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

//             {/* Dealer Summary Section */}
//             <div className="mb-4 flex-shrink-0">
//               <h3 className="text-sm font-semibold text-gray-800 mb-2 px-1">
//                 Dealer Summary -{" "}
//                 {selectedDealer.dealerName || selectedDealer.name}
//               </h3>

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
//                     <table className="w-full border-collapse text-xs min-w-max">
//                       <thead>
//                         <tr className="bg-gray-100 border-b border-gray-300">
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Total
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Registered
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Active
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Digital
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Created
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Completed
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Upcoming
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
//                             Overdue
//                           </th>
//                           <th className="px-2 py-1.5 text-center font-semibold text-gray-700 whitespace-nowrap">
//                             Opportunities Converted
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         <tr className="bg-white border-b border-gray-200">
//                           {/* All data cells are RIGHT ALIGNED - WEB DATA ORANGE COLOR */}
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(currentDealer, "totalUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(currentDealer, "registerUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(currentDealer, "activeUsers")}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             <div className="flex items-center justify-end">
//                               <span>
//                                 {getDealerValue(currentDealer, "saLeads")}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200">
//                             {getDealerValue(
//                               currentDealer,
//                               "manuallyEnteredLeads",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(
//                               currentDealer,
//                               "saFollowUps",
//                               "webleadsFollowUps",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "completedFollowUps",
//                               "webCompletedFollowUps",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "openFollowUps",
//                               "webUpcomingFollowUps",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "closedFollowUps",
//                               "webOverdueFollowUps",
//                               true,
//                               "followups",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
//                             {getDealerValue(
//                               currentDealer,
//                               "totalTestDrives",
//                               "saTestDrives",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "completedTestDrives",
//                               "webCompletedTestDrives",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 text-blue-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "upcomingTestDrives",
//                               "webUpcomingTestDrives",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right border-r border-gray-200 font-semibold text-red-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "closedTestDrives",
//                               "webOverdueTestDrives",
//                               true,
//                               "testdrives",
//                             )}
//                           </td>
//                           <td className="px-2 py-1.5 text-right font-semibold text-green-600">
//                             {getDealerValue(
//                               currentDealer,
//                               "opportunitiesConverted",
//                             )}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 );
//               })()}
//             </div>
//             {/* User Details Content - Added ref for PNG capture */}
//             <div className="flex-1 overflow-auto min-h-0" ref={modalTableRef}>
//               <DealerUserDetails
//                 dealer={selectedDealer}
//                 loadingUsers={loadingUsers}
//                 onGetSortedUsers={onGetSortedUsers}
//                 dealerUsers={dealerUsers}
//                 currentFilter={modalFilter}
//                 customStartDate={
//                   modalFilter === "CUSTOM" ? modalCustomStartDate : undefined
//                 }
//                 customEndDate={
//                   modalFilter === "CUSTOM" ? modalCustomEndDate : undefined
//                 }
//                 formatNumberWithCommas={formatNumberWithCommas}
//               />
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
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

// export default DealerSummaryTable;

// CODE WITHOUT PREVENTION OF BG SCROLL ON OPEN MODAL
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
//   onFetchDealerData,
//   customStartDate: parentCustomStartDate,
//   customEndDate: parentCustomEndDate,
//   customFilterPending,
// }) => {
//   const [selectedDealer, setSelectedDealer] = useState(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [modalFilter, setModalFilter] = useState(selectedFilter);
//   const [modalDealerData, setModalDealerData] = useState(null);
//   const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);

//   const mainTableRef = useRef(null);
//   const dealerUserDetailsRef = useRef(null);

//   const [modalCustomStartDate, setModalCustomStartDate] = useState("");
//   const [modalCustomEndDate, setModalCustomEndDate] = useState("");
//   const [modalInvalidDateRange, setModalInvalidDateRange] = useState(false);

//   const [showOverdueModal, setShowOverdueModal] = useState(false);
//   const [overdueModalType, setOverdueModalType] = useState(null);
//   const [overdueModalData, setOverdueModalData] = useState(null);
//   const [overdueModalLoading, setOverdueModalLoading] = useState(false);

//   const [toastMessage, setToastMessage] = useState("");
//   const [showToast, setShowToast] = useState(false);
//   const [exportingPNG, setExportingPNG] = useState(false);

//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return "0";
//     return Number(num).toLocaleString("en-IN");
//   };

//   const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

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
//         webTotal:
//           type === "followups"
//             ? dealer.webOverdueFollowUps || 0
//             : dealer.webOverdueTestDrives || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   mobile: "9876543210",
//                   email: "john@example.com",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   assignedTo: "Sales Rep 1",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   mobile: "9876543211",
//                   email: "jane@example.com",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   assignedTo: "Sales Rep 2",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   mobile: "9876543215",
//                   email: "alice@example.com",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   assignedTo: "Test Drive Manager",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   mobile: "9876543216",
//                   email: "charlie@example.com",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   assignedTo: "Sales Rep 1",
//                   status: "Overdue",
//                   source: "Sales App",
//                 },
//               ],
//       };
//       setOverdueModalData(mockData);
//       setOverdueModalLoading(false);
//     }, 500);
//   };

//   const closeOverdueModal = () => {
//     setShowOverdueModal(false);
//     setOverdueModalType(null);
//     setOverdueModalData(null);
//   };

//   const getDealerValue = (
//     dealer,
//     fieldName,
//     webFieldName = null,
//     isOverdue = false,
//     overdueType = null,
//   ) => {
//     if (!dealer) return "0";

//     let value;
//     let webValue = null;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) value = 0;
//       }
//     } else {
//       value = dealer[fieldName] || 0;
//     }

//     if (webFieldName) {
//       if (webFieldName.includes(".")) {
//         const fields = webFieldName.split(".");
//         webValue = dealer;
//         for (const field of fields) {
//           webValue = webValue?.[field];
//           if (webValue === undefined || webValue === null) webValue = 0;
//         }
//       } else {
//         webValue = dealer[webFieldName] || 0;
//       }
//     }

//     const formattedValue = formatNumber(value);

//     if (isOverdue && (value > 0 || (webValue && webValue > 0))) {
//       const formattedWebValue =
//         webValue !== null ? formatNumber(webValue) : null;

//       return (
//         <div className="flex items-center justify-end">
//           {value > 0 ? (
//             <button
//               className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer font-semibold"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 handleOverdueClick(dealer, overdueType);
//               }}
//               title={`Click to view overdue ${overdueType === "followups" ? "follow-ups" : "test drives"}`}
//             >
//               {formattedValue}
//             </button>
//           ) : (
//             <span className="font-semibold text-red-600">{formattedValue}</span>
//           )}
//           {webValue !== null && (
//             <span
//               className="text-xs ml-1"
//               style={{ color: "rgb(255, 152, 0)" }}
//             >
//               ({formattedWebValue})
//             </span>
//           )}
//         </div>
//       );
//     }

//     if (webValue !== null) {
//       return (
//         <div className="flex items-center justify-end">
//           <span>{formattedValue}</span>
//           <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
//             ({formatNumber(webValue)})
//           </span>
//         </div>
//       );
//     }

//     return <div className="text-right">{formattedValue}</div>;
//   };

//   const handleExportMainTablePNG = async () => {
//     if (!mainTableRef.current) {
//       return;
//     }

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

//       const scrollContainer = clone.querySelector(".table-scroll");
//       const outerContainer = clone.querySelector(".table-container");
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

//       if (scrollContainer) {
//         scrollContainer.style.maxHeight = "none";
//         scrollContainer.style.overflow = "visible";
//         scrollContainer.style.overflowY = "visible";
//         scrollContainer.style.position = "relative";
//       }

//       if (outerContainer) {
//         outerContainer.style.overflow = "visible";
//         outerContainer.style.position = "relative";
//       }

//       if (table) {
//         const actualWidth = table.scrollWidth;
//         table.style.width = `${actualWidth}px`;
//         table.style.minWidth = `${actualWidth}px`;
//         table.style.position = "relative";
//       }

//       if (tableHead) {
//         tableHead.style.position = "relative";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       stickyCells.forEach((cell) => {
//         cell.style.position = "relative";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
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
//         "button, select, input, .fa-spinner, .fa-download, .fa-image, .fa-camera",
//       );
//       interactiveElements.forEach((el) => {
//         el.remove();
//       });

//       const allCells = clone.querySelectorAll("td, th");
//       allCells.forEach((cell) => {
//         cell.style.boxShadow = "none";
//       });

//       exportContainer.appendChild(clone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           if (table) table.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const captureWidth = table.scrollWidth;
//       const captureHeight = table.scrollHeight;

//       const paddedWidth = captureWidth + 40;
//       const paddedHeight = captureHeight + 40;

//       const dataUrl = await toPng(table, {
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
//           padding: "0",
//           display: "block",
//         },
//         filter: (node) => {
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           if (
//             node.classList &&
//             (node.classList.contains("btn-export") ||
//               node.classList.contains("export-button") ||
//               node.classList.contains("fa-chevron-right") ||
//               node.classList.contains("fa-spinner") ||
//               node.classList.contains("fa-download") ||
//               node.classList.contains("fa-image") ||
//               node.classList.contains("fa-camera"))
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
//         button.innerHTML =
//           '<i class="fas fa-camera text-xs mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
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

//   useEffect(() => {
//     if (showUserModal) {
//       setModalFilter(selectedFilter);
//       setModalDealerData(null);

//       if (parentCustomStartDate && parentCustomEndDate) {
//         setModalCustomStartDate(parentCustomStartDate);
//         setModalCustomEndDate(parentCustomEndDate);
//       } else {
//         setModalCustomStartDate("");
//         setModalCustomEndDate("");
//       }

//       setModalInvalidDateRange(false);
//     }
//   }, [
//     showUserModal,
//     selectedFilter,
//     parentCustomStartDate,
//     parentCustomEndDate,
//   ]);

//   const validateModalDates = () => {
//     if (modalCustomStartDate && modalCustomEndDate) {
//       const invalid =
//         new Date(modalCustomStartDate) > new Date(modalCustomEndDate);
//       setModalInvalidDateRange(invalid);
//       return !invalid;
//     }
//     return false;
//   };

//   const formatNumberWithCommas = (num) => {
//     if (num === null || num === undefined || num === "") return "0";
//     const number = typeof num === "string" ? parseFloat(num) : num;
//     if (isNaN(number)) return "0";
//     return number.toLocaleString("en-IN");
//   };

//   const getDealerValueOld = (dealer, fieldName) => {
//     if (!dealer) return "0";

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return "0";
//       }
//       return formatNumberWithCommas(value || 0);
//     }

//     value = dealer[fieldName];
//     return formatNumberWithCommas(value || 0);
//   };

//   const getDealerValueAsNumber = (dealer, fieldName) => {
//     if (!dealer) return 0;

//     let value;

//     if (fieldName.includes(".")) {
//       const fields = fieldName.split(".");
//       value = dealer;
//       for (const field of fields) {
//         value = value?.[field];
//         if (value === undefined || value === null) return 0;
//       }
//       return Number(value) || 0;
//     }

//     value = dealer[fieldName];
//     return Number(value) || 0;
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
//         setToastMessage(
//           "Please select both start and end dates for custom range",
//         );
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }

//       const isValid = validateModalDates();
//       if (!isValid) {
//         setToastMessage("End date cannot be before start date");
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     let startDateToUse, endDateToUse;
//     if (filterValue === "CUSTOM") {
//       startDateToUse = modalCustomStartDate;
//       endDateToUse = modalCustomEndDate;

//       if (!startDateToUse || !endDateToUse) {
//         setToastMessage(
//           "Please select both start and end dates for custom range",
//         );
//         setShowToast(true);
//         setTimeout(() => setShowToast(false), 3000);
//         return;
//       }
//     }

//     setModalFilter(filterValue);
//     setIsLoadingDealerData(true);

//     try {
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           selectedDealer,
//           filterValue,
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );

//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       if (onFetchDealerUsers) {
//         await onFetchDealerUsers(
//           selectedDealer,
//           filterValue,
//           filterValue === "CUSTOM" ? startDateToUse : undefined,
//           filterValue === "CUSTOM" ? endDateToUse : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch dealer data:", error);
//     } finally {
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

//     if (new Date(modalCustomStartDate) > new Date(modalCustomEndDate)) {
//       setToastMessage("End date cannot be before start date");
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//       return;
//     }

//     const isValid = validateModalDates();
//     if (isValid) {
//       handleModalFilterChange("CUSTOM", true);
//     }
//   };

//   const handleResetCustomDates = () => {
//     setModalFilter(selectedFilter);

//     if (selectedFilter === "CUSTOM") {
//       setModalCustomStartDate(parentCustomStartDate || "");
//       setModalCustomEndDate(parentCustomEndDate || "");
//     } else {
//       setModalCustomStartDate("");
//       setModalCustomEndDate("");
//     }

//     setModalInvalidDateRange(false);

//     if (selectedDealer) {
//       handleModalFilterChange(selectedFilter);
//     }
//   };

//   const handleDealerClick = async (dealer) => {
//     const dealerId = dealer.dealerId || dealer.id;

//     setSelectedDealer(dealer);
//     setShowUserModal(true);
//     setModalDealerData(null);

//     if (parentCustomStartDate && parentCustomEndDate) {
//       setModalCustomStartDate(parentCustomStartDate);
//       setModalCustomEndDate(parentCustomEndDate);
//     }

//     const hasUserData =
//       dealerUsers[dealerId] && dealerUsers[dealerId].length > 0;

//     if (!hasUserData) {
//       setIsLoadingDealerData(true);
//     }

//     try {
//       if (onFetchDealerData) {
//         const freshDealerData = await onFetchDealerData(
//           dealer,
//           selectedFilter,
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//         if (freshDealerData) {
//           setModalDealerData(freshDealerData);
//         }
//       }

//       if (onFetchDealerUsers && !hasUserData) {
//         await onFetchDealerUsers(
//           dealer,
//           selectedFilter,
//           selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
//           selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
//         );
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch initial dealer data:", error);
//     } finally {
//       setIsLoadingDealerData(false);
//     }

//     if (onToggleSummaryRow) {
//       const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
//       onToggleSummaryRow(mockEvent, dealer);
//     }
//   };

//   const getCurrentDealerData = () => {
//     if (modalDealerData) {
//       return modalDealerData;
//     }

//     if (selectedDealer) {
//       const dealerId = selectedDealer.dealerId || selectedDealer.id;
//       return (
//         dealers.find((d) => (d.dealerId || d.id) === dealerId) || selectedDealer
//       );
//     }

//     return selectedDealer;
//   };

//   const closeModal = () => {
//     setShowUserModal(false);
//     setSelectedDealer(null);
//     setModalDealerData(null);
//     setIsLoadingDealerData(false);
//   };

//   const getSortedDealersForSummary = () => {
//     const list =
//       selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

//     if (!sortColumn || sortDirection === "default") return list;

//     return [...list].sort((a, b) => {
//       const valA = getDealerValueAsNumber(a, sortColumn);
//       const valB = getDealerValueAsNumber(b, sortColumn);
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

//   const handleExportCSV = () => {
//     const dataToExport = getSortedDealersForSummary();

//     const getCombinedDealerValue = (dealer, mainField, webField) => {
//       if (!dealer) return "0";

//       const mainValue = getDealerValueAsNumber(dealer, mainField);
//       let webValue = 0;

//       if (webField) {
//         webValue = getDealerValueAsNumber(dealer, webField);
//       }

//       return `${mainValue} (${webValue})`;
//     };

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
//       "Created Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Unique Test Drives",
//       "Opportunities Converted",
//     ];

//     const csvContent = [
//       headers.join(","),
//       ...dataToExport.map((dealer) =>
//         [
//           `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
//           getDealerValueAsNumber(dealer, "totalUsers"),
//           getDealerValueAsNumber(dealer, "registerUsers"),
//           getDealerValueAsNumber(dealer, "activeUsers"),
//           getDealerValueAsNumber(dealer, "saLeads"),
//           getDealerValueAsNumber(dealer, "manuallyEnteredLeads"),
//           getCombinedDealerValue(dealer, "saFollowUps", "webleadsFollowUps"),
//           getCombinedDealerValue(
//             dealer,
//             "completedFollowUps",
//             "webCompletedFollowUps",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "openFollowUps",
//             "webUpcomingFollowUps",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "closedFollowUps",
//             "webOverdueFollowUps",
//           ),
//           getCombinedDealerValue(dealer, "totalTestDrives", "saTestDrives"),
//           getCombinedDealerValue(
//             dealer,
//             "completedTestDrives",
//             "webCompletedTestDrives",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "upcomingTestDrives",
//             "webUpcomingTestDrives",
//           ),
//           getCombinedDealerValue(
//             dealer,
//             "closedTestDrives",
//             "webOverdueTestDrives",
//           ),
//           getDealerValueAsNumber(dealer, "uniqueTestDrives"),
//           getDealerValueAsNumber(dealer, "opportunitiesConverted"),
//         ].join(","),
//       ),
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

//   const sortedDealers = getSortedDealersForSummary();
//   const displayedDealers = sortedDealers.slice(0, tableLength);

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
//       {showToast && (
//         <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
//           <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
//             <i className="fas fa-exclamation-circle"></i>
//             <span>{toastMessage}</span>
//           </div>
//         </div>
//       )}

//       <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
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
//               disabled={exportingPNG}
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
//             >
//               <i className="fas fa-download text-xs"></i>
//               Export CSV
//             </button>
//           </div>
//         </div>

//         <div ref={mainTableRef} className="table-container p-0 relative z-20">
//           {customFilterPending ? (
//             <div className="flex flex-col items-center justify-center p-12">
//               <div className="text-gray-500 text-sm">
//                 Please select custom dates and click "Apply" in the filter bar
//                 above to view dealer data.
//               </div>
//             </div>
//           ) : displayedDealers.length === 0 ? (
//             <div className="flex justify-center items-center p-12">
//               <div className="text-gray-500 text-sm">
//                 Loading dealers data...
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
//                         Opportunities Converted
//                       </th>
//                     </tr>

//                     <tr className="text-xs">
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

//                       <th
//                         className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
//                         onClick={() =>
//                           hasMultipleDealers && onSortData("totalTestDrives")
//                         }
//                       >
//                         <span className="inline-flex items-center justify-center gap-1">
//                           Created
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
//                     {displayedDealers.map((dealer, index) => (
//                       <tr
//                         key={dealer.dealerId || dealer.id}
//                         className={`group transition-colors relative ${
//                           index % 2 === 0 ? "bg-gray-50" : "bg-white"
//                         } hover:bg-blue-50`}
//                       >
//                         <td className="sticky left-0 bg-inherit z-40 border-r border-gray-300 px-3 py-2 text-left text-xs text-gray-900 min-w-[140px] group-hover:bg-blue-50">
//                           <button
//                             className="expand-btn flex items-center cursor-pointer gap-2 text-[#222fb9] hover:text-[#1a259c] transition-colors w-full text-left group"
//                             onClick={() => handleDealerClick(dealer)}
//                           >
//                             <span className="font-semibold truncate group-hover:underline">
//                               {dealer.dealerName || dealer.name}
//                             </span>
//                             <i className="fas fa-chevron-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
//                           </button>
//                         </td>

//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "totalUsers")}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "registerUsers")}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "activeUsers")}
//                         </td>

//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "saLeads")}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "manuallyEnteredLeads")}
//                         </td>

//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "saFollowUps",
//                             "webleadsFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "completedFollowUps",
//                             "webCompletedFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "openFollowUps",
//                             "webUpcomingFollowUps",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "closedFollowUps",
//                             "webOverdueFollowUps",
//                             true,
//                             "followups",
//                           )}
//                         </td>

//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "totalTestDrives",
//                             "saTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "completedTestDrives",
//                             "webCompletedTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "upcomingTestDrives",
//                             "webUpcomingTestDrives",
//                           )}
//                         </td>
//                         <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(
//                             dealer,
//                             "closedTestDrives",
//                             "webOverdueTestDrives",
//                             true,
//                             "testdrives",
//                           )}
//                         </td>

//                         <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
//                           {getDealerValue(dealer, "opportunitiesConverted")}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {!customFilterPending &&
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

//       {showUserModal && selectedDealer && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeModal}
//         >
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
//               formatNumber={formatNumber}
//               getDealerValue={getDealerValue}
//               showToast={showToast}
//               setToastMessage={setToastMessage}
//               setShowToast={setShowToast}
//               areModalDatesValid={validateModalDates}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default DealerSummaryTable;

// prevenetion code of bg scroll on open modal
import React, { useState, useEffect, useRef,useMemo } from "react";
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
  onFetchDealerData,
  customStartDate: parentCustomStartDate,
  customEndDate: parentCustomEndDate,
  customFilterPending,
}) => {
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalFilter, setModalFilter] = useState(selectedFilter);
  const [modalDealerData, setModalDealerData] = useState(null);
  const [isLoadingDealerData, setIsLoadingDealerData] = useState(false);

  const mainTableRef = useRef(null);
  const dealerUserDetailsRef = useRef(null);

  const [modalCustomStartDate, setModalCustomStartDate] = useState("");
  const [modalCustomEndDate, setModalCustomEndDate] = useState("");
  const [modalInvalidDateRange, setModalInvalidDateRange] = useState(false);

  const [showOverdueModal, setShowOverdueModal] = useState(false);
  const [overdueModalType, setOverdueModalType] = useState(null);
  const [overdueModalData, setOverdueModalData] = useState(null);
  const [overdueModalLoading, setOverdueModalLoading] = useState(false);
  const [clickedDealer, setClickedDealer] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [exportingPNG, setExportingPNG] = useState(false);

  // ✅ ADD: Scroll prevention effect for modals
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

  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";
    return Number(num).toLocaleString("en-IN");
  };


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

  const hasMultipleDealers = selectedDealers.length > 1 || dealers.length > 1;

  // const handleOverdueClick = async (dealer, type) => {
  //   setOverdueModalType(type);
  //   setOverdueModalData(null);
  //   setOverdueModalLoading(true);
  //   setShowOverdueModal(true);

  //   setTimeout(() => {
  //     const mockData = {
  //       dealerName: dealer.dealerName || dealer.name,
  //       type: type,
  //       total:
  //         type === "followups"
  //           ? dealer.closedFollowUps || 0
  //           : dealer.closedTestDrives || dealer.saTestDrives || 0,
  //       webTotal:
  //         type === "followups"
  //           ? dealer.webOverdueFollowUps || 0
  //           : dealer.webOverdueTestDrives || 0,
  //       items:
  //         type === "followups"
  //           ? [
  //               {
  //                 id: 1,
  //                 customerName: "John Doe",
  //                 mobile: "9876543210",
  //                 email: "john@example.com",
  //                 date: "2024-01-15",
  //                 reason: "Customer not responding",
  //                 assignedTo: "Sales Rep 1",
  //                 status: "Overdue",
  //                 source: "Sales App",
  //               },
  //               {
  //                 id: 2,
  //                 customerName: "Jane Smith",
  //                 mobile: "9876543211",
  //                 email: "jane@example.com",
  //                 date: "2024-01-14",
  //                 reason: "Follow-up pending",
  //                 assignedTo: "Sales Rep 2",
  //                 status: "Overdue",
  //                 source: "Sales App",
  //               },
  //             ]
  //           : [
  //               {
  //                 id: 1,
  //                 customerName: "Alice Brown",
  //                 mobile: "9876543215",
  //                 email: "alice@example.com",
  //                 date: "2024-01-16",
  //                 vehicle: "Model X",
  //                 assignedTo: "Test Drive Manager",
  //                 status: "Overdue",
  //                 source: "Sales App",
  //               },
  //               {
  //                 id: 2,
  //                 customerName: "Charlie Wilson",
  //                 mobile: "9876543216",
  //                 email: "charlie@example.com",
  //                 date: "2024-01-15",
  //                 vehicle: "Model Y",
  //                 assignedTo: "Sales Rep 1",
  //                 status: "Overdue",
  //                 source: "Sales App",
  //               },
  //             ],
  //     };
  //     setOverdueModalData(mockData);
  //     setOverdueModalLoading(false);
  //   }, 500);
  // };

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
                Totals
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
  
  const handleOverdueClick = async (dealer, type) => {
  setOverdueModalType(type);
  setClickedDealer(dealer);
  setOverdueModalData(null);
  setOverdueModalLoading(true);
  setShowOverdueModal(true);

  try {
    const params = {
      type: selectedFilter,
      overdue_type: type === "followups" ? "followup" : "testdrive",
    };

    const dealerId = dealer.dealerId || dealer.id;
    if (dealerId) {
      params.dealerId = dealerId;
    }

    if (selectedFilter === "CUSTOM") {
      params.start_date = parentCustomStartDate;
      params.end_date = parentCustomEndDate;
    }

    console.log("📡 Fetching overdue data with params:", params);

    const response = await api.get(
      "/generalManager/dashboard/GMOverdueReport",
      { params }
    );

    if (response.data.status === 200) {
      setOverdueModalData(response.data.data);
    } else {
      throw new Error(response.data.message || "Failed to fetch overdue data");
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

  const closeOverdueModal = () => {
    setShowOverdueModal(false);
    setOverdueModalType(null);
    setOverdueModalData(null);
    setClickedDealer(null);

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

  const getDealerValue = (
    dealer,
    fieldName,
    webFieldName = null,
    isOverdue = false,
    overdueType = null,
  ) => {
    if (!dealer) return "0";

    let value;
    let webValue = null;

    if (fieldName.includes(".")) {
      const fields = fieldName.split(".");
      value = dealer;
      for (const field of fields) {
        value = value?.[field];
        if (value === undefined || value === null) value = 0;
      }
    } else {
      value = dealer[fieldName] || 0;
    }

    if (webFieldName) {
      if (webFieldName.includes(".")) {
        const fields = webFieldName.split(".");
        webValue = dealer;
        for (const field of fields) {
          webValue = webValue?.[field];
          if (webValue === undefined || webValue === null) webValue = 0;
        }
      } else {
        webValue = dealer[webFieldName] || 0;
      }
    }

    const formattedValue = formatNumber(value);

    if (isOverdue && (value > 0 || (webValue && webValue > 0))) {
      const formattedWebValue =
        webValue !== null ? formatNumber(webValue) : null;

      return (
        <div className="flex items-center justify-end">
          {value > 0 ? (
            <button
              className="text-red-600 hover:text-red-800 hover:underline focus:outline-none cursor-pointer font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                handleOverdueClick(dealer, overdueType);
              }}
              title={`Click to view overdue ${overdueType === "followups" ? "follow-ups" : "test drives"}`}
            >
              {formattedValue}
            </button>
          ) : (
            <span className="font-semibold text-red-600">{formattedValue}</span>
          )}
          {webValue !== null && (
            <span
              className="text-xs ml-1"
              style={{ color: "rgb(255, 152, 0)" }}
            >
              ({formattedWebValue})
            </span>
          )}
        </div>
      );
    }

    if (webValue !== null) {
      return (
        <div className="flex items-center justify-end">
          <span>{formattedValue}</span>
          <span className="text-xs ml-1" style={{ color: "rgb(255, 152, 0)" }}>
            ({formatNumber(webValue)})
          </span>
        </div>
      );
    }

    return <div className="text-right">{formattedValue}</div>;
  };

  const handleExportMainTablePNG = async () => {
    if (!mainTableRef.current) {
      return;
    }

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

      const scrollContainer = clone.querySelector(".table-scroll");
      const outerContainer = clone.querySelector(".table-container");
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

      if (scrollContainer) {
        scrollContainer.style.maxHeight = "none";
        scrollContainer.style.overflow = "visible";
        scrollContainer.style.overflowY = "visible";
        scrollContainer.style.position = "relative";
      }

      if (outerContainer) {
        outerContainer.style.overflow = "visible";
        outerContainer.style.position = "relative";
      }

      if (table) {
        const actualWidth = table.scrollWidth;
        table.style.width = `${actualWidth}px`;
        table.style.minWidth = `${actualWidth}px`;
        table.style.position = "relative";
      }

      if (tableHead) {
        tableHead.style.position = "relative";
        tableHead.style.top = "auto";
        tableHead.style.zIndex = "auto";
      }

      stickyCells.forEach((cell) => {
        cell.style.position = "relative";
        cell.style.left = "auto";
        cell.style.zIndex = "auto";
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
        "button, select, input, .fa-spinner, .fa-download, .fa-image, .fa-camera",
      );
      interactiveElements.forEach((el) => {
        el.remove();
      });

      const allCells = clone.querySelectorAll("td, th");
      allCells.forEach((cell) => {
        cell.style.boxShadow = "none";
      });

      exportContainer.appendChild(clone);
      document.body.appendChild(exportContainer);

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          if (table) table.offsetHeight;
          resolve();
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      const captureWidth = table.scrollWidth;
      const captureHeight = table.scrollHeight;

      const paddedWidth = captureWidth + 40;
      const paddedHeight = captureHeight + 40;

      const dataUrl = await toPng(table, {
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
          padding: "0",
          display: "block",
        },
        filter: (node) => {
          if (node.style && node.style.display === "none") {
            return false;
          }
          if (
            node.classList &&
            (node.classList.contains("btn-export") ||
              node.classList.contains("export-button") ||
              node.classList.contains("fa-chevron-right") ||
              node.classList.contains("fa-spinner") ||
              node.classList.contains("fa-download") ||
              node.classList.contains("fa-image") ||
              node.classList.contains("fa-camera"))
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
        button.innerHTML =
          '<i class="fas fa-camera text-xs mr-1"></i>Export PNG';
        button.disabled = false;
      }
    }
  };

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

  useEffect(() => {
    if (showUserModal) {
      setModalFilter(selectedFilter);
      setModalDealerData(null);

      if (parentCustomStartDate && parentCustomEndDate) {
        setModalCustomStartDate(parentCustomStartDate);
        setModalCustomEndDate(parentCustomEndDate);
      } else {
        setModalCustomStartDate("");
        setModalCustomEndDate("");
      }

      setModalInvalidDateRange(false);
    }
  }, [
    showUserModal,
    selectedFilter,
    parentCustomStartDate,
    parentCustomEndDate,
  ]);

  const validateModalDates = () => {
    if (modalCustomStartDate && modalCustomEndDate) {
      const invalid =
        new Date(modalCustomStartDate) > new Date(modalCustomEndDate);
      setModalInvalidDateRange(invalid);
      return !invalid;
    }
    return false;
  };

  const formatNumberWithCommas = (num) => {
    if (num === null || num === undefined || num === "") return "0";
    const number = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(number)) return "0";
    return number.toLocaleString("en-IN");
  };

  const getDealerValueOld = (dealer, fieldName) => {
    if (!dealer) return "0";

    let value;

    if (fieldName.includes(".")) {
      const fields = fieldName.split(".");
      value = dealer;
      for (const field of fields) {
        value = value?.[field];
        if (value === undefined || value === null) return "0";
      }
      return formatNumberWithCommas(value || 0);
    }

    value = dealer[fieldName];
    return formatNumberWithCommas(value || 0);
  };

  const getDealerValueAsNumber = (dealer, fieldName) => {
    if (!dealer) return 0;

    let value;

    if (fieldName.includes(".")) {
      const fields = fieldName.split(".");
      value = dealer;
      for (const field of fields) {
        value = value?.[field];
        if (value === undefined || value === null) return 0;
      }
      return Number(value) || 0;
    }

    value = dealer[fieldName];
    return Number(value) || 0;
  };

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
        setToastMessage(
          "Please select both start and end dates for custom range",
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      const isValid = validateModalDates();
      if (!isValid) {
        setToastMessage("End date cannot be before start date");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    let startDateToUse, endDateToUse;
    if (filterValue === "CUSTOM") {
      startDateToUse = modalCustomStartDate;
      endDateToUse = modalCustomEndDate;

      if (!startDateToUse || !endDateToUse) {
        setToastMessage(
          "Please select both start and end dates for custom range",
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setModalFilter(filterValue);
    setIsLoadingDealerData(true);

    try {
      if (onFetchDealerData) {
        const freshDealerData = await onFetchDealerData(
          selectedDealer,
          filterValue,
          filterValue === "CUSTOM" ? startDateToUse : undefined,
          filterValue === "CUSTOM" ? endDateToUse : undefined,
        );

        if (freshDealerData) {
          setModalDealerData(freshDealerData);
        }
      }

      if (onFetchDealerUsers) {
        await onFetchDealerUsers(
          selectedDealer,
          filterValue,
          filterValue === "CUSTOM" ? startDateToUse : undefined,
          filterValue === "CUSTOM" ? endDateToUse : undefined,
        );
      }
    } catch (error) {
      console.error("❌ Failed to fetch dealer data:", error);
    } finally {
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

    if (new Date(modalCustomStartDate) > new Date(modalCustomEndDate)) {
      setToastMessage("End date cannot be before start date");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const isValid = validateModalDates();
    if (isValid) {
      handleModalFilterChange("CUSTOM", true);
    }
  };

  const handleResetCustomDates = () => {
    setModalFilter(selectedFilter);

    if (selectedFilter === "CUSTOM") {
      setModalCustomStartDate(parentCustomStartDate || "");
      setModalCustomEndDate(parentCustomEndDate || "");
    } else {
      setModalCustomStartDate("");
      setModalCustomEndDate("");
    }

    setModalInvalidDateRange(false);

    if (selectedDealer) {
      handleModalFilterChange(selectedFilter);
    }
  };

  const handleDealerClick = async (dealer) => {
    const dealerId = dealer.dealerId || dealer.id;

    setSelectedDealer(dealer);
    setShowUserModal(true);
    setModalDealerData(null);

    if (parentCustomStartDate && parentCustomEndDate) {
      setModalCustomStartDate(parentCustomStartDate);
      setModalCustomEndDate(parentCustomEndDate);
    }

    const hasUserData =
      dealerUsers[dealerId] && dealerUsers[dealerId].length > 0;

    if (!hasUserData) {
      setIsLoadingDealerData(true);
    }

    try {
      if (onFetchDealerData) {
        const freshDealerData = await onFetchDealerData(
          dealer,
          selectedFilter,
          selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
          selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
        );
        if (freshDealerData) {
          setModalDealerData(freshDealerData);
        }
      }

      if (onFetchDealerUsers && !hasUserData) {
        await onFetchDealerUsers(
          dealer,
          selectedFilter,
          selectedFilter === "CUSTOM" ? parentCustomStartDate : undefined,
          selectedFilter === "CUSTOM" ? parentCustomEndDate : undefined,
        );
      }
    } catch (error) {
      console.error("❌ Failed to fetch initial dealer data:", error);
    } finally {
      setIsLoadingDealerData(false);
    }

    if (onToggleSummaryRow) {
      const mockEvent = { preventDefault: () => {}, stopPropagation: () => {} };
      onToggleSummaryRow(mockEvent, dealer);
    }
  };

  const getCurrentDealerData = () => {
    if (modalDealerData) {
      return modalDealerData;
    }

    if (selectedDealer) {
      const dealerId = selectedDealer.dealerId || selectedDealer.id;
      return (
        dealers.find((d) => (d.dealerId || d.id) === dealerId) || selectedDealer
      );
    }

    return selectedDealer;
  };

  const closeModal = () => {
    setShowUserModal(false);
    setSelectedDealer(null);
    setModalDealerData(null);
    setIsLoadingDealerData(false);

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

  const getSortedDealersForSummary = () => {
    const list =
      selectedDealers.length > 0 ? [...selectedDealers] : [...dealers];

    if (!sortColumn || sortDirection === "default") return list;

    return [...list].sort((a, b) => {
      const valA = getDealerValueAsNumber(a, sortColumn);
      const valB = getDealerValueAsNumber(b, sortColumn);
      return sortDirection === "asc" ? valA - valB : valB - valA;
    });
  };

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

  const handleExportCSV = () => {
    const dataToExport = getSortedDealersForSummary();

    const getCombinedDealerValue = (dealer, mainField, webField) => {
      if (!dealer) return "0";

      const mainValue = getDealerValueAsNumber(dealer, mainField);
      let webValue = 0;

      if (webField) {
        webValue = getDealerValueAsNumber(dealer, webField);
      }

      return `${mainValue} (${webValue})`;
    };

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
      "Created Test Drives",
      "Completed Test Drives",
      "Upcoming Test Drives",
      "Overdue Test Drives",
      "Unique Test Drives",
      "Opportunities Converted",
    ];

    const csvContent = [
      headers.join(","),
      ...dataToExport.map((dealer) =>
        [
          `"${(dealer.dealerName || dealer.name || "").replace(/"/g, '""')}"`,
          getDealerValueAsNumber(dealer, "totalUsers"),
          getDealerValueAsNumber(dealer, "registerUsers"),
          getDealerValueAsNumber(dealer, "activeUsers"),
          getDealerValueAsNumber(dealer, "saLeads"),
          getDealerValueAsNumber(dealer, "manuallyEnteredLeads"),
          getCombinedDealerValue(dealer, "saFollowUps", "webleadsFollowUps"),
          getCombinedDealerValue(
            dealer,
            "completedFollowUps",
            "webCompletedFollowUps",
          ),
          getCombinedDealerValue(
            dealer,
            "openFollowUps",
            "webUpcomingFollowUps",
          ),
          getCombinedDealerValue(
            dealer,
            "closedFollowUps",
            "webOverdueFollowUps",
          ),
          getCombinedDealerValue(dealer, "totalTestDrives", "saTestDrives"),
          getCombinedDealerValue(
            dealer,
            "completedTestDrives",
            "webCompletedTestDrives",
          ),
          getCombinedDealerValue(
            dealer,
            "upcomingTestDrives",
            "webUpcomingTestDrives",
          ),
          getCombinedDealerValue(
            dealer,
            "closedTestDrives",
            "webOverdueTestDrives",
          ),
          getDealerValueAsNumber(dealer, "uniqueTestDrives"),
          getDealerValueAsNumber(dealer, "opportunitiesConverted"),
        ].join(","),
      ),
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

  const sortedDealers = getSortedDealersForSummary();
  const displayedDealers = sortedDealers.slice(0, tableLength);

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

  return (
    <>
      {showToast && (
        <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="table-section bg-white rounded-lg border text-xs border-gray-200 mb-1 relative z-20">
        <div className="table-header px-4 py-1 border-b border-gray-200 flex flex-col sm:flex-row text-xs items-start justify-between gap-1 sm:gap-0 bg-gray-50 relative z-30">
          <div>
            <h2 className="table-title text-xs font-bold text-gray-900">
              Dealer Summary — Engagements
            </h2>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <button
              className="btn-export px-3 py-1 cursor-pointer bg-[#222fb9] border border-[#222fb9] rounded text-xs font-medium text-white hover:bg-[#1a259c] hover:border-[#1a259c] flex items-center gap-0.5 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleExportMainTablePNG}
              disabled={exportingPNG}
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
            >
              <i className="fas fa-download text-xs"></i>
              Export CSV
            </button>
          </div>
        </div>

        <div ref={mainTableRef} className="table-container p-0 relative z-20">
          {customFilterPending ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="text-gray-500 text-sm">
                Please select custom dates and click "Apply" in the filter bar
                above to view dealer data.
              </div>
            </div>
          ) : displayedDealers.length === 0 ? (
            <div className="flex justify-center items-center p-12">
              <div className="text-gray-500 text-sm">
                Loading dealers data...
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
                        Dealers
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
                        Opportunities Converted
                      </th>
                    </tr>

                    <tr className="text-xs">
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

                      <th
                        className="sortable-header px-2 py-1 text-center font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
                        onClick={() =>
                          hasMultipleDealers && onSortData("totalTestDrives")
                        }
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          Created
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

                        <td className="px-2 py-1 text-right border-r border-gray-200 font-medium group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "totalUsers")}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "registerUsers")}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "activeUsers")}
                        </td>

                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "saLeads")}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "manuallyEnteredLeads")}
                        </td>

                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "saFollowUps",
                            "webleadsFollowUps",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "completedFollowUps",
                            "webCompletedFollowUps",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "openFollowUps",
                            "webUpcomingFollowUps",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "closedFollowUps",
                            "webOverdueFollowUps",
                            true,
                            "followups",
                          )}
                        </td>

                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9] group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "totalTestDrives",
                            "saTestDrives",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "completedTestDrives",
                            "webCompletedTestDrives",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "upcomingTestDrives",
                            "webUpcomingTestDrives",
                          )}
                        </td>
                        <td className="px-2 py-1 text-right border-r border-gray-300 font-semibold text-red-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(
                            dealer,
                            "closedTestDrives",
                            "webOverdueTestDrives",
                            true,
                            "testdrives",
                          )}
                        </td>

                        <td className="px-2 py-1 text-right font-semibold text-green-600 group-hover:bg-blue-50 relative z-20">
                          {getDealerValue(dealer, "opportunitiesConverted")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!customFilterPending &&
                (selectedDealers.length > 0
                  ? selectedDealers.length
                  : dealers.length) > 10 && (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 px-2 gap-2 sm:gap-0 relative z-30">
                    <div className="text-xs text-gray-500">
                      Showing{" "}
                      {formatNumber(
                        Math.min(
                          tableLength,
                          selectedDealers.length > 0
                            ? selectedDealers.length
                            : dealers.length,
                        ),
                      )}{" "}
                      of{" "}
                      {formatNumber(
                        selectedDealers.length > 0
                          ? selectedDealers.length
                          : dealers.length,
                      )}{" "}
                      dealers
                    </div>
                    <div className="flex gap-1 self-end sm:self-auto">
                      {tableLength <
                        (selectedDealers.length > 0
                          ? selectedDealers.length
                          : dealers.length) && (
                        <button
                          className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                          onClick={() => setTableLength((prev) => prev + 10)}
                        >
                          <i className="fas fa-chevron-down text-[10px]"></i>
                          Show More
                        </button>
                      )}
                      {tableLength > 10 && (
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

      {showUserModal && selectedDealer && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
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
              formatNumber={formatNumber}
              getDealerValue={getDealerValue}
              showToast={showToast}
              setToastMessage={setToastMessage}
              setShowToast={setShowToast}
              areModalDatesValid={validateModalDates}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DealerSummaryTable;
