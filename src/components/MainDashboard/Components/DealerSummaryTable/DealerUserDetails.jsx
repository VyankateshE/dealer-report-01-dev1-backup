// import React, { useState, useEffect, useRef } from "react";
// import { toPng } from "html-to-image"; // ✅ ADD: Import html-to-image for PNG export

// const DealerUserDetails = ({
//   dealer,
//   loadingUsers,
//   onGetSortedUsers,
//   dealerUsers,
//   filteredUsers,
//   onUsersUpdated,
//   onExportPNG, // ✅ ADD: New prop for PNG export
//   onExportCSV, // ✅ ADD: New prop for CSV export
// }) => {
//   const [showPurgedUsers, setShowPurgedUsers] = useState(false);
//   const tableRef = useRef(null);

//   // State for user overdue modal
//   const [showUserOverdueModal, setShowUserOverdueModal] = useState(false);
//   const [userOverdueModalType, setUserOverdueModalType] = useState(null);
//   const [userOverdueModalData, setUserOverdueModalData] = useState(null);
//   const [userOverdueModalLoading, setUserOverdueModalLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // ✅ ADD: State for user table sorting
//   const [userSortColumn, setUserSortColumn] = useState(null);
//   const [userSortDirection, setUserSortDirection] = useState("default"); // 'default', 'asc', 'desc'

//   // ✅ ADD: Function to handle user table sorting
//   const handleUserSort = (column) => {
//     if (userSortColumn === column) {
//       // Cycle through directions: default -> asc -> desc -> default
//       if (userSortDirection === "default") {
//         setUserSortDirection("asc");
//       } else if (userSortDirection === "asc") {
//         setUserSortDirection("desc");
//       } else {
//         setUserSortDirection("default");
//         setUserSortColumn(null);
//       }
//     } else {
//       setUserSortColumn(column);
//       setUserSortDirection("asc");
//     }
//   };

//   // ✅ ADD: SortIcon component for user table
//   const UserSortIcon = ({ column }) => {
//     if (userSortColumn !== column) {
//       return (
//         <span className="sort-arrows inline-flex flex-col ml-1">
//           <span className="arrow-up text-[10px] text-gray-400">▲</span>
//           <span className="arrow-down text-[10px] text-gray-400">▼</span>
//         </span>
//       );
//     }

//     if (userSortDirection === "asc") {
//       return (
//         <span className="sort-arrows inline-flex flex-col ml-1">
//           <span className="arrow-up text-[10px] text-[#222fb9]">▲</span>
//           <span className="arrow-down text-[10px] text-gray-400">▼</span>
//         </span>
//       );
//     } else if (userSortDirection === "desc") {
//       return (
//         <span className="sort-arrows inline-flex flex-col ml-1">
//           <span className="arrow-up text-[10px] text-gray-400">▲</span>
//           <span className="arrow-down text-[10px] text-[#222fb9]">▼</span>
//         </span>
//       );
//     }

//     return null;
//   };

//   // ✅ ADD: Function to sort users based on column and direction
//   const getSortedUsers = (users) => {
//     if (!userSortColumn || userSortDirection === "default") {
//       return users;
//     }

//     return [...users].sort((a, b) => {
//       // Helper function to extract numeric value from user data
//       const getValueForSort = (user, column) => {
//         switch (column) {
//           // User info columns
//           case "user":
//             return (user.user || "").toLowerCase();
//           case "role":
//             return (user.user_role || "").toLowerCase();
//           case "registered":
//             return user.registerUser ? 1 : 0;
//           case "status":
//             return user.active ? 1 : 0;
//           case "last_login":
//             return user.last_login ? new Date(user.last_login).getTime() : 0;

//           // Leads columns
//           case "created_enquiries":
//             return user.leads?.sa || 0;
//           case "digital_enquiries":
//             return user.leads?.manuallyEntered || 0;

//           // Follow-ups columns
//           case "created_followups":
//             return user.followups?.sa || 0;
//           case "completed_followups":
//             return user.followups?.completed || 0;
//           case "upcoming_followups":
//             return user.followups?.open || 0;
//           case "overdue_followups":
//             return user.followups?.closed || 0;

//           // Test Drives columns
//           case "total_testdrives":
//             return user.testdrives?.total || 0;
//           case "completed_testdrives":
//             return user.testdrives?.completed || 0;
//           case "upcoming_testdrives":
//             return user.testdrives?.upcoming || 0;
//           case "overdue_testdrives":
//             return user.testdrives?.closed || 0;

//           // Opportunities column
//           case "opp_converted":
//             return user.opportunitiesConverted || 0;

//           default:
//             return 0;
//         }
//       };

//       const valA = getValueForSort(a, userSortColumn);
//       const valB = getValueForSort(b, userSortColumn);

//       if (typeof valA === "string" && typeof valB === "string") {
//         return userSortDirection === "asc"
//           ? valA.localeCompare(valB)
//           : valB.localeCompare(valA);
//       }

//       return userSortDirection === "asc" ? valA - valB : valB - valA;
//     });
//   };

//   // Function to handle user overdue value click
//   const handleUserOverdueClick = async (user, type) => {
//     setSelectedUser(user);
//     setUserOverdueModalType(type);
//     setUserOverdueModalData(null);
//     setUserOverdueModalLoading(true);
//     setShowUserOverdueModal(true);

//     setTimeout(() => {
//       const mockData = {
//         userName: user.user,
//         dealerName: dealer.dealerName || dealer.name,
//         type: type,
//         total:
//           type === "followups"
//             ? user.followups?.closed || 0
//             : user.testdrives?.closed || 0,
//         items:
//           type === "followups"
//             ? [
//                 {
//                   id: 1,
//                   customerName: "John Doe",
//                   date: "2024-01-15",
//                   reason: "Customer not responding",
//                   status: "Overdue",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Jane Smith",
//                   date: "2024-01-14",
//                   reason: "Follow-up pending",
//                   status: "Overdue",
//                 },
//                 {
//                   id: 3,
//                   customerName: "Bob Johnson",
//                   date: "2024-01-13",
//                   reason: "Waiting for feedback",
//                   status: "Overdue",
//                 },
//               ]
//             : [
//                 {
//                   id: 1,
//                   customerName: "Alice Brown",
//                   date: "2024-01-16",
//                   vehicle: "Model X",
//                   status: "Overdue",
//                 },
//                 {
//                   id: 2,
//                   customerName: "Charlie Wilson",
//                   date: "2024-01-15",
//                   vehicle: "Model Y",
//                   status: "Overdue",
//                 },
//               ],
//       };
//       setUserOverdueModalData(mockData);
//       setUserOverdueModalLoading(false);
//     }, 500);
//   };

//   // Function to close user overdue modal
//   const closeUserOverdueModal = () => {
//     setShowUserOverdueModal(false);
//     setUserOverdueModalType(null);
//     setUserOverdueModalData(null);
//     setSelectedUser(null);
//   };

//   const handleExportPNG = async () => {
//     if (!tableRef.current) {
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

//       const clone = tableRef.current.cloneNode(true);
//       const outerContainer = clone.querySelector(".overflow-auto");
//       const table = clone.querySelector("table");
//       const tableHead = table?.querySelector("thead");
//       const stickyCells = clone.querySelectorAll(".sticky");

//       if (!table) {
//         throw new Error("Table not found in clone");
//       }

//       const originalRect = tableRef.current.getBoundingClientRect();
//       exportContainer.style.width = `${originalRect.width}px`;
//       exportContainer.style.height = "auto";

//       if (outerContainer) {
//         outerContainer.style.overflow = "visible";
//         outerContainer.style.height = "auto";
//         outerContainer.style.maxHeight = "none";
//         outerContainer.style.position = "static";
//       }

//       if (tableHead) {
//         tableHead.style.position = "static";
//         tableHead.style.top = "auto";
//         tableHead.style.zIndex = "auto";
//       }

//       if (table) {
//         table.style.width = "100%";
//         table.style.minWidth = "auto";
//         table.style.position = "static";
//         table.style.tableLayout = "auto";
//         table.style.display = "table";
//       }

//       stickyCells.forEach((cell) => {
//         cell.style.position = "static";
//         cell.style.left = "auto";
//         cell.style.zIndex = "auto";
//         if (cell.classList.contains("bg-red-50")) {
//           cell.style.backgroundColor = "#fef2f2";
//         } else if (cell.classList.contains("bg-white")) {
//           cell.style.backgroundColor = "#ffffff";
//         }
//       });

//       const allCells = clone.querySelectorAll("td, th");
//       allCells.forEach((cell) => {
//         cell.style.boxShadow = "none";
//         cell.style.border = "1px solid #e5e7eb";
//       });

//       const exportButtons = clone.querySelectorAll(".export-button");
//       const allButtons = clone.querySelectorAll("button");
//       const allInputs = clone.querySelectorAll("input, select");

//       [...exportButtons, ...allButtons, ...allInputs].forEach((el) => {
//         el.remove();
//       });

//       const expandButtons = clone.querySelectorAll(".expand-btn");
//       expandButtons.forEach((btn) => {
//         const span = btn.querySelector("span");
//         if (span) {
//           const textNode = document.createTextNode(span.textContent || "");
//           btn.parentNode.replaceChild(textNode, btn);
//         }
//       });

//       const chevrons = clone.querySelectorAll(".fa-chevron-right");
//       chevrons.forEach((icon) => {
//         icon.style.display = "none";
//       });

//       // ✅ ADD: Remove sort icons from cloned table
//       const sortArrows = clone.querySelectorAll(".sort-arrows");
//       sortArrows.forEach((arrow) => {
//         arrow.remove();
//       });

//       exportContainer.appendChild(clone);
//       document.body.appendChild(exportContainer);

//       await new Promise((resolve) => {
//         requestAnimationFrame(() => {
//           clone.offsetHeight;
//           resolve();
//         });
//       });

//       await new Promise((resolve) => setTimeout(resolve, 300));

//       const cloneRect = clone.getBoundingClientRect();
//       const captureWidth = Math.ceil(cloneRect.width);
//       const captureHeight = Math.ceil(cloneRect.height);

//       const paddedWidth = Math.ceil(captureWidth + 40);
//       const paddedHeight = Math.ceil(captureHeight + 40);

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
//           padding: "20px",
//           margin: "0",
//         },
//         filter: (node) => {
//           if (node.style && node.style.display === "none") {
//             return false;
//           }
//           if (node.classList?.contains("export-button")) {
//             return false;
//           }
//           if (node.classList?.contains("sort-arrows")) {
//             return false;
//           }
//           return true;
//         },
//       });

//       document.body.removeChild(exportContainer);

//       const link = document.createElement("a");
//       const dealerName = dealer?.dealerName?.replace(/\s+/g, "-") || "dealer";
//       const userName = dealer?.user?.replace(/\s+/g, "-") || "users";
//       link.download = `users-${dealerName}-${userName}-${
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
//       console.error("❌ Error exporting dealer users PNG:", error);
//       alert("Failed to export PNG. Please try again.");

//       const button = document.activeElement;
//       if (button) {
//         button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
//         button.disabled = false;
//       }
//     }
//   };

//   // CSV Export function
//   const exportUsersToCSV = () => {
//     const usersToExport = sortedUsers; // ✅ CHANGED: Use sortedUsers instead of displayedUsers
//     if (!usersToExport || usersToExport.length === 0) {
//       alert("No data to export");
//       return;
//     }

//     const getFormattedValueForExport = (mainValue, webValue) => {
//       const main = mainValue ?? 0;
//       const web = webValue ?? 0;

//       if (webValue !== undefined && webValue !== null) {
//         return `${main} (${web})`;
//       }
//       return `${main}`;
//     };

//     const headers = [
//       "User",
//       "Role",
//       "Registered",
//       "Status",
//       "Last Login",
//       "Created Enquiries",
//       "Digital Enquiries",
//       "Created Follow-ups",
//       "Completed Follow-ups",
//       "Upcoming Follow-ups",
//       "Overdue Follow-ups",
//       "Total Test Drives",
//       "Completed Test Drives",
//       "Upcoming Test Drives",
//       "Overdue Test Drives",
//       "Opp. Converted",
//     ];

//     const csvRows = usersToExport.map((user) => {
//       const followupWeb =
//         user.followups?.webleads ||
//         user.followups?.webleadsFollowUps ||
//         user.followups?.webwebleads ||
//         0;

//       const followupCompletedWeb =
//         user.followups?.webcompletedfollowups ||
//         user.followups?.webCompletedFollowUps ||
//         user.followups?.webcompleted ||
//         0;

//       const followupUpcomingWeb =
//         user.followups?.webupcomingfollowups ||
//         user.followups?.webUpcomingFollowUps ||
//         user.followups?.webupcoming ||
//         0;

//       const followupOverdueWeb =
//         user.followups?.weboverduefollowups ||
//         user.followups?.webOverdueFollowUps ||
//         user.followups?.weboverdue ||
//         0;

//       const testDriveCompletedWeb =
//         user.testdrives?.webcompleteddrives ||
//         user.testdrives?.webCompletedTestDrives ||
//         user.testdrives?.webcompleted ||
//         0;

//       const testDriveUpcomingWeb =
//         user.testdrives?.webupcomingdrives ||
//         user.testdrives?.webUpcomingTestDrives ||
//         user.testdrives?.webupcoming ||
//         0;

//       const testDriveOverdueWeb =
//         user.testdrives?.weboverduedrives ||
//         user.testdrives?.webOverdueTestDrives ||
//         user.testdrives?.weboverdue ||
//         0;

//       return [
//         `"${(user.user || "").replace(/"/g, '""')}"`,
//         user.user_role || "",
//         user.registerUser ? "Yes" : "No",
//         user.active ? "Active" : "Inactive",
//         user.last_login
//           ? new Date(user.last_login)
//               .toLocaleString("en-IN", {
//                 timeZone: "Asia/Kolkata",
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: false,
//               })
//               .replace(",", "")
//           : "-",
//         user.leads?.sa ?? 0,
//         user.leads?.manuallyEntered ?? 0,
//         `"${getFormattedValueForExport(user.followups?.sa, followupWeb)}"`,
//         `"${getFormattedValueForExport(
//           user.followups?.completed,
//           followupCompletedWeb,
//         )}"`,
//         `"${getFormattedValueForExport(
//           user.followups?.open,
//           followupUpcomingWeb,
//         )}"`,
//         `"${getFormattedValueForExport(
//           user.followups?.closed,
//           followupOverdueWeb,
//         )}"`,
//         user.testdrives?.total ?? 0,
//         `"${getFormattedValueForExport(
//           user.testdrives?.completed,
//           testDriveCompletedWeb,
//         )}"`,
//         `"${getFormattedValueForExport(
//           user.testdrives?.upcoming,
//           testDriveUpcomingWeb,
//         )}"`,
//         `"${getFormattedValueForExport(
//           user.testdrives?.closed,
//           testDriveOverdueWeb,
//         )}"`,
//         user.opportunitiesConverted ?? 0,
//       ];
//     });

//     const csvContent = [
//       headers.join(","),
//       ...csvRows.map((row) => row.join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);

//     link.setAttribute("href", url);
//     link.setAttribute(
//       "download",
//       `users-${dealer?.dealerName?.replace(/\s+/g, "-") || "dealer"}-${
//         new Date().toISOString().split("T")[0]
//       }.csv`,
//     );
//     link.style.visibility = "hidden";

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Helper function to format values with web data
//   const formatValueWithWeb = (
//     mainValue,
//     webValue,
//     colorClass = "",
//     clickable = false,
//     onClick = null,
//   ) => {
//     const main = mainValue ?? 0;
//     const web = webValue ?? 0;

//     if (web !== undefined && web !== null) {
//       return (
//         <div
//           className={`inline-flex items-center ${colorClass}`}
//           style={{ verticalAlign: "middle" }}
//         >
//           {clickable ? (
//             <button
//               className="hover:underline focus:outline-none cursor-pointer"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (onClick) onClick();
//               }}
//               style={{
//                 lineHeight: "normal",
//                 color: colorClass.includes("red") ? "#dc2626" : "inherit",
//               }}
//             >
//               {main}
//             </button>
//           ) : (
//             <span style={{ lineHeight: "normal" }}>{main}</span>
//           )}
//           <span
//             className="text-xs ml-1"
//             style={{
//               color: "rgb(255, 152, 0)",
//               lineHeight: "normal",
//               verticalAlign: "middle",
//             }}
//           >
//             ({web})
//           </span>
//         </div>
//       );
//     }

//     if (clickable) {
//       return (
//         <button
//           className={`hover:underline focus:outline-none cursor-pointer ${colorClass}`}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (onClick) onClick();
//           }}
//           style={{
//             lineHeight: "normal",
//             color: colorClass.includes("red") ? "#dc2626" : "inherit",
//           }}
//         >
//           {main}
//         </button>
//       );
//     }

//     return (
//       <span className={colorClass} style={{ lineHeight: "normal" }}>
//         {main}
//       </span>
//     );
//   };

//   const dealerId = dealer.dealerId || dealer.id;

//   const getUsers = () => {
//     if (filteredUsers && Array.isArray(filteredUsers)) {
//       return filteredUsers;
//     }

//     if (dealerUsers && dealerUsers[dealerId]) {
//       return dealerUsers[dealerId];
//     }

//     return onGetSortedUsers(dealerId) || [];
//   };

//   const allUsers = getUsers();
//   const registeredUsers = allUsers.filter((user) => user.registerUser === true);
//   const purgedUsers = allUsers.filter((user) => user.registerUser === false);
//   const displayedUsers = showPurgedUsers
//     ? [...registeredUsers, ...purgedUsers]
//     : registeredUsers;

//   // ✅ ADD: Get sorted users
//   const sortedUsers = getSortedUsers(displayedUsers);

//   const totalRegisteredUsers = registeredUsers.length;
//   const totalPurgedUsers = purgedUsers.length;

//   useEffect(() => {
//     if (onUsersUpdated) {
//       onUsersUpdated(sortedUsers); // ✅ CHANGED: Pass sortedUsers instead of displayedUsers
//     }
//   }, [sortedUsers, onUsersUpdated]);

//   return (
//     <>
//       <div className="relative z-30 w-full h-full flex flex-col">
//         {loadingUsers[dealerId] ? (
//           <div className="text-center py-3 text-gray-500 relative z-30">
//             <i className="fas fa-spinner fa-spin mr-2"></i>
//             Loading users...
//           </div>
//         ) : allUsers.length === 0 ? (
//           <div className="text-center py-3 text-gray-500 relative z-30">
//             <i className="fas fa-users-slash mr-2"></i>
//             No users found for this dealer
//           </div>
//         ) : (
//           <div className="relative z-30 w-full h-full flex flex-col">
//             {/* Export buttons section */}
//             <div className="flex justify-between items-center px-2 py-1 bg-gray-50 border-b border-gray-200">
//               <div className="text-xs text-gray-600">
//                 {/* Showing {sortedUsers.length} users */}
//                 {userSortColumn && userSortDirection !== "default" && (
//                   <span className="ml-2 text-blue-600">
//                     <i className="fas fa-sort mr-1"></i>
//                     Sorted by {userSortColumn.replace(/_/g, " ")} (
//                     {userSortDirection === "asc" ? "Ascending" : "Descending"})
//                   </span>
//                 )}
//               </div>

//               {/* <div className="flex gap-2">
//                 <button
//                   onClick={handleExportPNG}
//                   className="export-button px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                 >
//                   <i className="fas fa-image text-xs"></i>
//                   Export PNGddd
//                 </button>

//                 <button
//                   onClick={exportUsersToCSV}
//                   className="export-button px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                 >
//                   <i className="fas fa-download text-xs"></i>
//                   Export CSV
//                 </button>
//               </div> */}
//             </div>

//             {/* Table container */}
//             <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
//               <div
//                 ref={tableRef}
//                 className="bg-white border border-gray-200 relative z-30 w-full h-full overflow-hidden flex flex-col"
//               >
//                 <div className="flex-1 overflow-auto">
//                   <table className="w-full text-[11px] border-collapse min-w-[1600px] relative">
//                     <thead className="bg-gray-50 sticky top-0 z-40">
//                       <tr>
//                         {/* User Column */}
//                         {/* <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
//                           <div
//                             className="flex items-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("user")}
//                           >
//                             User
//                             <UserSortIcon column="user" />
//                           </div>
//                         </th> */}
//                         <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
//                           <div className="flex items-center">User</div>
//                         </th>
//                         {/* Role Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("role")}
//                           >
//                             Role
//                             <UserSortIcon column="role" />
//                           </div>
//                         </th>

//                         {/* Registered Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("registered")}
//                           >
//                             Registered
//                             <UserSortIcon column="registered" />
//                           </div>
//                         </th>

//                         {/* Status Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px]">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("status")}
//                           >
//                             Status
//                             <UserSortIcon column="status" />
//                           </div>
//                         </th>

//                         {/* Last Login Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[80px]">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("last_login")}
//                           >
//                             Last Login
//                             <UserSortIcon column="last_login" />
//                           </div>
//                         </th>

//                         {/* Created Enquiries Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[80px] bg-blue-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("created_enquiries")}
//                           >
//                             Created Enquiries
//                             <UserSortIcon column="created_enquiries" />
//                           </div>
//                         </th>

//                         {/* Digital Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px] bg-blue-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("digital_enquiries")}
//                           >
//                             Digital
//                             <UserSortIcon column="digital_enquiries" />
//                           </div>
//                         </th>

//                         {/* Created Follow-ups Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("created_followups")}
//                           >
//                             Created Follow-ups
//                             <UserSortIcon column="created_followups" />
//                           </div>
//                         </th>

//                         {/* Completed Follow-ups Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() =>
//                               handleUserSort("completed_followups")
//                             }
//                           >
//                             Completed Follow-ups
//                             <UserSortIcon column="completed_followups" />
//                           </div>
//                         </th>

//                         {/* Upcoming Follow-ups Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("upcoming_followups")}
//                           >
//                             Upcoming Follow-ups
//                             <UserSortIcon column="upcoming_followups" />
//                           </div>
//                         </th>

//                         {/* Overdue Follow-ups Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-green-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("overdue_followups")}
//                           >
//                             Overdue Follow-ups
//                             <UserSortIcon column="overdue_followups" />
//                           </div>
//                         </th>

//                         {/* Total Test Drives Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("total_testdrives")}
//                           >
//                             Total Test Drives
//                             <UserSortIcon column="total_testdrives" />
//                           </div>
//                         </th>

//                         {/* Completed Test Drives Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() =>
//                               handleUserSort("completed_testdrives")
//                             }
//                           >
//                             Completed Test Drives
//                             <UserSortIcon column="completed_testdrives" />
//                           </div>
//                         </th>

//                         {/* Upcoming Test Drives Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() =>
//                               handleUserSort("upcoming_testdrives")
//                             }
//                           >
//                             Upcoming Test Drives
//                             <UserSortIcon column="upcoming_testdrives" />
//                           </div>
//                         </th>

//                         {/* Overdue Test Drives Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-orange-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("overdue_testdrives")}
//                           >
//                             Overdue Test Drives
//                             <UserSortIcon column="overdue_testdrives" />
//                           </div>
//                         </th>

//                         {/* Opp. Converted Column */}
//                         <th className="px-1 py-1.5 text-center font-medium text-gray-600 min-w-[80px] bg-purple-50">
//                           <div
//                             className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                             onClick={() => handleUserSort("opp_converted")}
//                           >
//                             Opp. Converted
//                             <UserSortIcon column="opp_converted" />
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="bg-white">
//                       {sortedUsers.map((user, userIndex) => {
//                         const isPurged = user.registerUser === false;
//                         const isInactive = !user.active;

//                         return (
//                           <tr
//                             key={user.user_id || user.userId || userIndex}
//                             className={`
//                               border-b border-gray-100 hover:bg-blue-50 transition-none
//                               ${userIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                             `}
//                           >
//                             <td
//                               className={`
//                                 sticky left-0 z-[35] px-2 py-1 text-left font-medium border-r border-gray-200 whitespace-nowrap text-[11px]
//                                 bg-white text-gray-900
//                               `}
//                             >
//                               <div className="flex items-center">
//                                 {user.user}
//                               </div>
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {user.user_role}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               <span
//                                 className={`inline-block px-1 py-0.5 rounded text-[10px] font-medium ${
//                                   user.registerUser
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-gray-100 text-gray-600"
//                                 }`}
//                               >
//                                 {user.registerUser ? "Yes" : "No"}
//                               </span>
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               <span
//                                 className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
//                                   user.active
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-red-100 text-red-800"
//                                 }`}
//                               >
//                                 <span
//                                   className={`w-1 h-1 rounded-full mr-1 ${
//                                     user.active ? "bg-green-500" : "bg-red-500"
//                                   }`}
//                                 ></span>
//                                 {user.active ? "Active" : "Inactive"}
//                               </span>
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-300 text-gray-500 text-[10px]`}
//                             >
//                               {user.last_login
//                                 ? new Date(user.last_login)
//                                     .toLocaleString("en-IN", {
//                                       timeZone: "Asia/Kolkata",
//                                       day: "2-digit",
//                                       month: "2-digit",
//                                       year: "numeric",
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                       hour12: false,
//                                     })
//                                     .replace(",", "")
//                                 : "-"}
//                             </td>

//                             {/* Leads Data */}
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               <span className="font-semibold text-[#222fb9]">
//                                 {user.leads?.sa ?? "-"}
//                               </span>
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200 text-gray-600`}
//                             >
//                               {user.leads?.manuallyEntered ?? 0}
//                             </td>

//                             {/* Follow-ups Data */}
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {formatValueWithWeb(
//                                 user.followups?.sa,
//                                 user.followups?.webleads,
//                                 "font-semibold text-[#222fb9]",
//                               )}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {formatValueWithWeb(
//                                 user.followups?.completed,
//                                 user.followups?.webcompletedfollowups,
//                                 "font-semibold text-green-600",
//                               )}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {formatValueWithWeb(
//                                 user.followups?.open,
//                                 user.followups?.webupcomingfollowups,
//                                 "text-blue-600",
//                               )}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-300`}
//                             >
//                               {formatValueWithWeb(
//                                 user.followups?.closed,
//                                 user.followups?.weboverduefollowups,
//                                 "font-semibold text-red-600",
//                                 true,
//                                 () => handleUserOverdueClick(user, "followups"),
//                               )}
//                             </td>

//                             {/* Test Drives Data */}
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200 font-semibold text-[#222fb9]`}
//                             >
//                               {user.testdrives?.total ?? 0}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {formatValueWithWeb(
//                                 user.testdrives?.completed,
//                                 user.testdrives?.webcompleteddrives,
//                                 "font-semibold text-green-600",
//                               )}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-200`}
//                             >
//                               {formatValueWithWeb(
//                                 user.testdrives?.upcoming,
//                                 user.testdrives?.webupcomingdrives,
//                                 "text-blue-600",
//                               )}
//                             </td>
//                             <td
//                               className={`px-1 py-1 text-center border-r border-gray-300`}
//                             >
//                               {formatValueWithWeb(
//                                 user.testdrives?.closed,
//                                 user.testdrives?.weboverduedrives,
//                                 "font-semibold text-red-600",
//                                 true,
//                                 () =>
//                                   handleUserOverdueClick(user, "testdrives"),
//                               )}
//                             </td>

//                             <td
//                               className={`px-1 py-1 text-center font-semibold text-green-600`}
//                             >
//                               {user.opportunitiesConverted ?? 0}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             {/* Show/Hide non-registered users button */}
//             {totalPurgedUsers > 0 && (
//               <div className="border-t border-gray-200 p-2 bg-white flex justify-start">
//                 <button
//                   onClick={() => setShowPurgedUsers(!showPurgedUsers)}
//                   className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
//                 >
//                   <i
//                     className={`fas fa-${
//                       showPurgedUsers ? "eye-slash" : "eye"
//                     } text-xs`}
//                   ></i>
//                   {showPurgedUsers
//                     ? "Hide Not-Registered Users"
//                     : "Show Not-Registered Users"}
//                   <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded text-[10px]">
//                     {totalPurgedUsers}
//                   </span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* User Overdue Details Modal */}
//       {showUserOverdueModal && (
//         <div
//           className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-sm"
//           style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//           onClick={closeUserOverdueModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-2xl p-6 w-[90vw] max-w-4xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-300 flex-shrink-0">
//               <h2 className="text-xl font-bold text-gray-800">
//                 {userOverdueModalType === "followups"
//                   ? "Overdue Follow-ups"
//                   : "Overdue Test Drives"}{" "}
//                 - {selectedUser?.user || "User"}
//                 <span className="text-sm font-normal text-gray-600 ml-2">
//                   (
//                   {userOverdueModalData?.dealerName ||
//                     dealer.dealerName ||
//                     dealer.name}
//                   ) • {userOverdueModalData?.total || 0} total
//                 </span>
//               </h2>
//               <button
//                 onClick={closeUserOverdueModal}
//                 className="text-gray-400 hover:text-gray-600 text-2xl"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="flex-1 overflow-auto">
//               {userOverdueModalLoading ? (
//                 <div className="flex flex-col items-center justify-center p-12">
//                   <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
//                   <div className="text-gray-500 text-sm">
//                     Loading overdue details...
//                   </div>
//                 </div>
//               ) : userOverdueModalData?.items &&
//                 userOverdueModalData.items.length > 0 ? (
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
//                         {userOverdueModalType === "followups" ? (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Reason
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Status
//                             </th>
//                           </>
//                         ) : (
//                           <>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Vehicle
//                             </th>
//                             <th className="px-4 py-2 text-left font-semibold text-gray-700">
//                               Status
//                             </th>
//                           </>
//                         )}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {userOverdueModalData.items.map((item, index) => (
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
//                           {userOverdueModalType === "followups" ? (
//                             <>
//                               <td className="px-4 py-2">{item.reason}</td>
//                               <td className="px-4 py-2">
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                   {item.status}
//                                 </span>
//                               </td>
//                             </>
//                           ) : (
//                             <>
//                               <td className="px-4 py-2">{item.vehicle}</td>
//                               <td className="px-4 py-2">
//                                 <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                   {item.status}
//                                 </span>
//                               </td>
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
//                     {userOverdueModalType === "followups"
//                       ? "follow-ups"
//                       : "test drives"}{" "}
//                     found for this user.
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="mt-4 flex justify-end pt-3 border-t border-gray-300 flex-shrink-0">
//               <button
//                 onClick={closeUserOverdueModal}
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

// export default DealerUserDetails;
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import { toPng } from "html-to-image";

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
//     // ==================== STATE MANAGEMENT ====================
//     const [showPurgedUsers, setShowPurgedUsers] = useState(false);
//     const tableRef = useRef(null);

//     // User overdue modal state
//     const [showUserOverdueModal, setShowUserOverdueModal] = useState(false);
//     const [userOverdueModalType, setUserOverdueModalType] = useState(null);
//     const [userOverdueModalData, setUserOverdueModalData] = useState(null);
//     const [userOverdueModalLoading, setUserOverdueModalLoading] =
//       useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     // User table sorting state
//     const [userSortColumn, setUserSortColumn] = useState(null);
//     const [userSortDirection, setUserSortDirection] = useState("default");

//     // ==================== HELPER FUNCTIONS ====================
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

//     const totalRegisteredUsers = registeredUsers.length;
//     const totalPurgedUsers = purgedUsers.length;

//     // ==================== SORTING FUNCTIONS ====================
//     const handleUserSort = (column) => {
//       if (userSortColumn === column) {
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

//     const getSortedUsers = (users) => {
//       if (!userSortColumn || userSortDirection === "default") {
//         return users;
//       }

//       return [...users].sort((a, b) => {
//         const getValueForSort = (user, column) => {
//           switch (column) {
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
//             case "created_enquiries":
//               return user.leads?.sa || 0;
//             case "digital_enquiries":
//               return user.leads?.manuallyEntered || 0;
//             case "created_followups":
//               return user.followups?.sa || 0;
//             case "completed_followups":
//               return user.followups?.completed || 0;
//             case "upcoming_followups":
//               return user.followups?.open || 0;
//             case "overdue_followups":
//               return user.followups?.closed || 0;
//             case "total_testdrives":
//               return user.testdrives?.total || 0;
//             case "completed_testdrives":
//               return user.testdrives?.completed || 0;
//             case "upcoming_testdrives":
//               return user.testdrives?.upcoming || 0;
//             case "overdue_testdrives":
//               return user.testdrives?.closed || 0;
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

//     const sortedUsers = getSortedUsers(displayedUsers);

//     // ==================== EVENT HANDLERS ====================
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

//     const closeUserOverdueModal = () => {
//       setShowUserOverdueModal(false);
//       setUserOverdueModalType(null);
//       setUserOverdueModalData(null);
//       setSelectedUser(null);
//     };

//     // ==================== EXPORT FUNCTIONS ====================
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
//           position: fixed;
//           left: -9999px;
//           top: 0;
//           background: white;
//           z-index: 99999;
//           overflow: visible;
//           box-sizing: border-box;
//           opacity: 1;
//           padding: 0;
//           margin: 0;
//         `;

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

//     const exportUsersToCSV = () => {
//       const usersToExport = sortedUsers;
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

//     // Expose functions to parent via ref
//     useImperativeHandle(ref, () => ({
//       handleExportPNG,
//       exportUsersToCSV,
//     }));

//     // ==================== FORMATTING HELPER ====================
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

//     // ==================== EFFECTS ====================
//     useEffect(() => {
//       if (onUsersUpdated) {
//         onUsersUpdated(sortedUsers);
//       }
//     }, [sortedUsers, onUsersUpdated]);

//     // ==================== SUB-COMPONENTS ====================
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

//     // ==================== RENDER ====================
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
//                 <div className="text-xs text-gray-600">
//                   {userSortColumn && userSortDirection !== "default" && (
//                     <span className="ml-2 text-blue-600">
//                       <i className="fas fa-sort mr-1"></i>
//                       Sorted by {userSortColumn.replace(/_/g, " ")} (
//                       {userSortDirection === "asc" ? "Ascending" : "Descending"}
//                       )
//                     </span>
//                   )}
//                 </div>
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
//                           <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
//                             <div className="flex items-center">User</div>
//                           </th>
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("role")}
//                             >
//                               Role
//                               <UserSortIcon column="role" />
//                             </div>
//                           </th>
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("registered")}
//                             >
//                               Registered
//                               <UserSortIcon column="registered" />
//                             </div>
//                           </th>
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("status")}
//                             >
//                               Status
//                               <UserSortIcon column="status" />
//                             </div>
//                           </th>
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[80px]">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("last_login")}
//                             >
//                               Last Login
//                               <UserSortIcon column="last_login" />
//                             </div>
//                           </th>
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
//                           <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
//                             <div
//                               className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
//                               onClick={() => handleUserSort("total_testdrives")}
//                             >
//                               Total Test Drives
//                               <UserSortIcon column="total_testdrives" />
//                             </div>
//                           </th>
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

//                           return (
//                             <tr
//                               key={user.user_id || user.userId || userIndex}
//                               className={`
//                                 border-b border-gray-100 transition-none
//                                 ${
//                                   isPurged
//                                     ? "bg-red-50 hover:bg-red-100"
//                                     : userIndex % 2 === 0
//                                       ? "bg-white hover:bg-blue-50"
//                                       : "bg-gray-50 hover:bg-blue-50"
//                                 }
//                               `}
//                             >
//                               <td
//                                 className={`
//                                   sticky left-0 z-[35] px-2 py-1 text-left font-medium border-r border-gray-200 whitespace-nowrap text-[11px]
//                                   ${
//                                     isPurged
//                                       ? "bg-red-50 hover:bg-red-100"
//                                       : userIndex % 2 === 0
//                                         ? "bg-white hover:bg-blue-50"
//                                         : "bg-gray-50 hover:bg-blue-50"
//                                   }
//                                   text-gray-900
//                                 `}
//                               >
//                                 <div className="flex items-center">
//                                   {user.user}
//                                 </div>
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {user.user_role}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
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
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
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
//                               <td className="px-1 py-1 text-center border-r border-gray-300 text-gray-500 text-[10px]">
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
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 <span className="font-semibold text-[#222fb9]">
//                                   {user.leads?.sa ?? "-"}
//                                 </span>
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200 text-gray-600">
//                                 {user.leads?.manuallyEntered ?? 0}
//                               </td>

//                               {/* Follow-ups Data */}
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {formatValueWithWeb(
//                                   user.followups?.sa,
//                                   user.followups?.webleads,
//                                   "font-semibold text-[#222fb9]",
//                                 )}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {formatValueWithWeb(
//                                   user.followups?.completed,
//                                   user.followups?.webcompletedfollowups,
//                                   "font-semibold text-green-600",
//                                 )}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {formatValueWithWeb(
//                                   user.followups?.open,
//                                   user.followups?.webupcomingfollowups,
//                                   "text-blue-600",
//                                 )}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-300">
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
//                               <td className="px-1 py-1 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
//                                 {user.testdrives?.total ?? 0}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {formatValueWithWeb(
//                                   user.testdrives?.completed,
//                                   user.testdrives?.webcompleteddrives,
//                                   "font-semibold text-green-600",
//                                 )}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-200">
//                                 {formatValueWithWeb(
//                                   user.testdrives?.upcoming,
//                                   user.testdrives?.webupcomingdrives,
//                                   "text-blue-600",
//                                 )}
//                               </td>
//                               <td className="px-1 py-1 text-center border-r border-gray-300">
//                                 {formatValueWithWeb(
//                                   user.testdrives?.closed,
//                                   user.testdrives?.weboverduedrives,
//                                   "font-semibold text-red-600",
//                                   true,
//                                   () =>
//                                     handleUserOverdueClick(user, "testdrives"),
//                                 )}
//                               </td>

//                               <td className="px-1 py-1 text-center font-semibold text-green-600">
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
//                       className={`fas fa-${showPurgedUsers ? "eye-slash" : "eye"} text-xs`}
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

// export default DealerUserDetails;
import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { toPng } from "html-to-image";
import axios from "axios";

const DealerUserDetails = forwardRef(
  (
    {
      dealer,
      loadingUsers,
      onGetSortedUsers,
      dealerUsers,
      // Modal specific props
      isModal = false,
      modalFilter,
      onModalFilterChange,
      modalCustomStartDate,
      modalCustomEndDate,
      onModalCustomStartDateChange,
      onModalCustomEndDateChange,
      onApplyCustomDates,
      onResetCustomDates,
      onExportPNG,
      onExportCSV,
      onCloseModal,
      isLoadingDealerData,
      // Data helpers
      formatNumber,
      getDealerValue,
      // Toast functions
      showToast,
      setToastMessage,
      setShowToast,
      areModalDatesValid,
    },
    ref,
  ) => {
    // ==================== STATE MANAGEMENT ====================
    const [showPurgedUsers, setShowPurgedUsers] = useState(false);
    const [modalDealerData, setModalDealerData] = useState(null);
    const [currentModalUsers, setCurrentModalUsers] = useState([]);

    // Overdue modal state
    const [showOverdueModal, setShowOverdueModal] = useState(false);
    const [overdueModalData, setOverdueModalData] = useState(null);
    const [overdueModalLoading, setOverdueModalLoading] = useState(false);
    const [overdueModalType, setOverdueModalType] = useState(null); // "followups" or "testdrives"
    const [overdueActiveTab, setOverdueActiveTab] = useState("closed");

    // Filter state for overdue modal
    const [overdueModalFilter, setOverdueModalFilter] = useState(
      modalFilter || "MTD",
    );
    const [overdueCustomStartDate, setOverdueCustomStartDate] = useState(
      modalCustomStartDate || "",
    );
    const [overdueCustomEndDate, setOverdueCustomEndDate] = useState(
      modalCustomEndDate || "",
    );

    // User table sorting state
    const [userSortColumn, setUserSortColumn] = useState(null);
    const [userSortDirection, setUserSortDirection] = useState("default");

    // Refs
    const exportContainerRef = useRef(null);
    const tableRef = useRef(null);

    // ==================== HELPER FUNCTIONS ====================
    const dealerId = dealer.dealerId || dealer.id;

    const getUsers = () => {
      if (isModal && currentModalUsers.length > 0) {
        return currentModalUsers;
      }

      if (dealerUsers && dealerUsers[dealerId]) {
        return dealerUsers[dealerId];
      }

      return onGetSortedUsers(dealerId) || [];
    };

    const allUsers = getUsers();
    const registeredUsers = allUsers.filter(
      (user) => user.registerUser === true,
    );
    const purgedUsers = allUsers.filter((user) => user.registerUser === false);
    const displayedUsers = showPurgedUsers
      ? [...registeredUsers, ...purgedUsers]
      : registeredUsers;

    const totalRegisteredUsers = registeredUsers.length;
    const totalPurgedUsers = purgedUsers.length;

    // Get current dealer data for modal summary
    const getCurrentDealerData = () => {
      if (modalDealerData) {
        return modalDealerData;
      }
      return dealer;
    };

    // ==================== SORTING FUNCTIONS ====================
    const handleUserSort = (column) => {
      if (userSortColumn === column) {
        if (userSortDirection === "default") {
          setUserSortDirection("asc");
        } else if (userSortDirection === "asc") {
          setUserSortDirection("desc");
        } else {
          setUserSortDirection("default");
          setUserSortColumn(null);
        }
      } else {
        setUserSortColumn(column);
        setUserSortDirection("asc");
      }
    };

    const getSortedUsers = (users) => {
      if (!userSortColumn || userSortDirection === "default") {
        return users;
      }

      return [...users].sort((a, b) => {
        const getValueForSort = (user, column) => {
          switch (column) {
            case "user":
              return (user.user || "").toLowerCase();
            case "role":
              return (user.user_role || "").toLowerCase();
            case "registered":
              return user.registerUser ? 1 : 0;
            case "status":
              return user.active ? 1 : 0;
            case "last_login":
              return user.last_login ? new Date(user.last_login).getTime() : 0;
            case "created_enquiries":
              return user.leads?.sa || 0;
            case "digital_enquiries":
              return user.leads?.manuallyEntered || 0;
            case "created_followups":
              return user.followups?.sa || 0;
            case "completed_followups":
              return user.followups?.completed || 0;
            case "upcoming_followups":
              return user.followups?.open || 0;
            case "overdue_followups":
              return user.followups?.closed || 0;
            case "total_testdrives":
              return user.testdrives?.total || 0;
            case "completed_testdrives":
              return user.testdrives?.completed || 0;
            case "upcoming_testdrives":
              return user.testdrives?.upcoming || 0;
            case "overdue_testdrives":
              return user.testdrives?.closed || 0;
            case "opp_converted":
              return user.opportunitiesConverted || 0;
            default:
              return 0;
          }
        };

        const valA = getValueForSort(a, userSortColumn);
        const valB = getValueForSort(b, userSortColumn);

        if (typeof valA === "string" && typeof valB === "string") {
          return userSortDirection === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return userSortDirection === "asc" ? valA - valB : valB - valA;
      });
    };

    const sortedUsers = getSortedUsers(displayedUsers);

    // ==================== DATE FILTER OPTIONS ====================
    const dateFilterOptions = [
      { value: "DAY", label: "Today" },
      { value: "YESTERDAY", label: "Yesterday" },
      { value: "WEEK", label: "This Week" },
      { value: "LAST_WEEK", label: "Last Week" },
      { value: "MTD", label: "This Month" },
      { value: "LAST_MONTH", label: "Last Month" },
      { value: "QTD", label: "This Quarter" },
      { value: "LAST_QUARTER", label: "Last Quarter" },
      { value: "SIX_MONTH", label: "Last 6 Months" },
      { value: "YTD", label: "This Year" },
      { value: "LIFETIME", label: "Lifetime" },
      { value: "CUSTOM", label: "Custom Range" },
    ];

    // ==================== API INSTANCE ====================
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

    // ==================== OVERDUE MODAL FUNCTIONS ====================
    // Build API params for overdue modal
    const buildOverdueParams = () => {
      const params = {
        dealer_id: dealerId,
        overdue_type:
          overdueModalType === "followups" ? "followup" : "testdrive",
      };

      if (overdueModalFilter === "CUSTOM") {
        if (overdueCustomStartDate && overdueCustomEndDate) {
          params.start_date = overdueCustomStartDate;
          params.end_date = overdueCustomEndDate;
        } else {
          params.type = "MTD";
        }
      } else {
        params.type = overdueModalFilter;
      }

      return params;
    };

    // Fetch overdue data
    const fetchOverdueData = async () => {
      setOverdueModalLoading(true);
      setOverdueModalData(null);

      try {
        const apiParams = buildOverdueParams();
        console.log("Fetching overdue data with params:", apiParams);

        const res = await api.get("/generalManager/dashboard/GMOverdueReport", {
          params: apiParams,
        });

        console.log("Overdue API Response:", res.data);

        if (res.data && res.data.status === 200 && res.data.data) {
          setOverdueModalData(res.data.data);
        } else {
          console.error("Invalid response structure:", res.data);
        }
      } catch (err) {
        console.error("API Error:", err);
      } finally {
        setOverdueModalLoading(false);
      }
    };

    // Handle overdue click
    const handleOverdueClick = (type) => {
      setOverdueModalType(type);
      setOverdueActiveTab("closed");
      setShowOverdueModal(true);
    };

    // Close overdue modal
    const closeOverdueModal = () => {
      setShowOverdueModal(false);
      setOverdueModalData(null);
    };

    // Handle date filter change in overdue modal
    const handleOverdueFilterChange = (e) => {
      const value = e.target.value;
      setOverdueModalFilter(value);

      if (value !== "CUSTOM") {
        setOverdueCustomStartDate("");
        setOverdueCustomEndDate("");
      }
    };

    // Apply custom date in overdue modal
    const applyOverdueCustomDate = () => {
      if (!overdueCustomStartDate || !overdueCustomEndDate) {
        return;
      }
      fetchOverdueData();
    };

    // Reset overdue filter
    const resetOverdueFilter = () => {
      setOverdueModalFilter(modalFilter || "MTD");
      setOverdueCustomStartDate(modalCustomStartDate || "");
      setOverdueCustomEndDate(modalCustomEndDate || "");
    };

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "-";
      try {
        return new Date(dateString).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      } catch (e) {
        return dateString;
      }
    };

    // Get ageing counts for overdue modal
    const getAgeingCounts = () => {
      if (!overdueModalData || !overdueModalData.dealerData?.[0]) {
        return { "60+d": 0, "31-60d": 0, "<30d": 0 };
      }

      const dealerData = overdueModalData.dealerData[0];
      const section =
        overdueActiveTab === "closed"
          ? overdueModalType === "followups"
            ? "closed_followups"
            : "closed_testdrives"
          : overdueModalType === "followups"
            ? "web_overdue_followups"
            : "web_overdue_testdrives";

      const data = dealerData[section];
      if (!data) {
        return { "60+d": 0, "31-60d": 0, "<30d": 0 };
      }

      return {
        "60+d": data.days60Plus || 0,
        "31-60d": data.days31to60 || 0,
        "<30d": data.lessThan30Days || 0,
      };
    };

    // ==================== EFFECTS ====================
    useEffect(() => {
      // If in modal mode, set initial data
      if (isModal && dealerUsers && dealerUsers[dealerId]) {
        setCurrentModalUsers(dealerUsers[dealerId]);
      }
    }, [isModal, dealerUsers, dealerId]);

    // Fetch overdue data when modal opens or filter changes
    useEffect(() => {
      if (showOverdueModal && overdueModalType) {
        fetchOverdueData();
      }
    }, [
      showOverdueModal,
      overdueModalType,
      overdueModalFilter,
      overdueCustomStartDate,
      overdueCustomEndDate,
    ]);

    // ==================== EXPORT FUNCTIONS ====================
    const handleExportPNG = async () => {
      if (!exportContainerRef.current) {
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

        // Clone the entire export container (summary + table)
        const clone = exportContainerRef.current.cloneNode(true);
        const allOverflowContainers = clone.querySelectorAll(
          ".overflow-auto, .overflow-x-auto",
        );
        const tables = clone.querySelectorAll("table");
        const tableHead = clone.querySelector("thead");
        const stickyCells = clone.querySelectorAll(".sticky");

        if (tables.length === 0) {
          throw new Error("No tables found in clone");
        }

        // Remove max-width constraints and set container to auto width
        exportContainer.style.width = "auto";
        exportContainer.style.height = "auto";
        exportContainer.style.maxWidth = "none";

        // Make ALL overflow containers visible
        allOverflowContainers.forEach((container) => {
          container.style.overflow = "visible";
          container.style.overflowX = "visible";
          container.style.overflowY = "visible";
          container.style.height = "auto";
          container.style.maxHeight = "none";
          container.style.position = "static";
          container.style.width = "auto";
          container.style.maxWidth = "none";
        });

        // Make the main clone container fit content
        clone.style.width = "auto";
        clone.style.maxWidth = "none";
        clone.style.overflow = "visible";
        clone.style.display = "block";

        if (tableHead) {
          tableHead.style.position = "static";
          tableHead.style.top = "auto";
          tableHead.style.zIndex = "auto";
        }

        // Set all tables to their natural width
        tables.forEach((table) => {
          table.style.width = "auto";
          table.style.minWidth = "auto";
          table.style.maxWidth = "none";
          table.style.position = "static";
          table.style.tableLayout = "auto";
          table.style.display = "table";
        });

        stickyCells.forEach((cell) => {
          cell.style.position = "static";
          cell.style.left = "auto";
          cell.style.zIndex = "auto";
          if (cell.classList.contains("bg-red-50")) {
            cell.style.backgroundColor = "#fef2f2";
          } else if (cell.classList.contains("bg-white")) {
            cell.style.backgroundColor = "#ffffff";
          } else if (cell.classList.contains("bg-gray-50")) {
            cell.style.backgroundColor = "#f9fafb";
          }
        });

        const allCells = clone.querySelectorAll("td, th");
        allCells.forEach((cell) => {
          cell.style.boxShadow = "none";
          cell.style.border = "1px solid #e5e7eb";
          // Ensure cells don't wrap
          cell.style.whiteSpace = "nowrap";
        });

        const exportButtons = clone.querySelectorAll(".export-button");
        const allButtons = clone.querySelectorAll("button");
        const allInputs = clone.querySelectorAll("input, select");

        [...exportButtons, ...allButtons, ...allInputs].forEach((el) => {
          el.remove();
        });

        const expandButtons = clone.querySelectorAll(".expand-btn");
        expandButtons.forEach((btn) => {
          const span = btn.querySelector("span");
          if (span) {
            const textNode = document.createTextNode(span.textContent || "");
            btn.parentNode.replaceChild(textNode, btn);
          }
        });

        const chevrons = clone.querySelectorAll(".fa-chevron-right");
        chevrons.forEach((icon) => {
          icon.style.display = "none";
        });

        const sortArrows = clone.querySelectorAll(".sort-arrows");
        sortArrows.forEach((arrow) => {
          arrow.remove();
        });

        // Remove any flex-1, min-h-0 constraints
        const flexElements = clone.querySelectorAll(
          '[class*="flex-1"], [class*="min-h-0"]',
        );
        flexElements.forEach((el) => {
          el.style.flex = "none";
          el.style.minHeight = "auto";
          el.style.height = "auto";
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

        // Get the actual rendered dimensions
        const cloneRect = clone.getBoundingClientRect();

        // Calculate actual table width (get the widest table)
        let maxTableWidth = 0;
        tables.forEach((table) => {
          const tableWidth = table.getBoundingClientRect().width;
          if (tableWidth > maxTableWidth) {
            maxTableWidth = tableWidth;
          }
        });

        // Use the larger of clone width or table width
        const captureWidth = Math.max(
          Math.ceil(cloneRect.width),
          Math.ceil(maxTableWidth),
        );
        const captureHeight = Math.ceil(cloneRect.height);

        const paddedWidth = Math.ceil(captureWidth + 40);
        const paddedHeight = Math.ceil(captureHeight + 40);

        console.log("📊 Export dimensions:", {
          cloneWidth: cloneRect.width,
          maxTableWidth,
          captureWidth,
          captureHeight,
          paddedWidth,
          paddedHeight,
        });

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
            padding: "20px",
            margin: "0",
            width: `${paddedWidth}px`,
            maxWidth: "none",
          },
          filter: (node) => {
            if (node.style && node.style.display === "none") {
              return false;
            }
            if (node.classList?.contains("export-button")) {
              return false;
            }
            if (node.classList?.contains("sort-arrows")) {
              return false;
            }
            return true;
          },
        });

        document.body.removeChild(exportContainer);

        const link = document.createElement("a");
        const dealerName = dealer?.dealerName?.replace(/\s+/g, "-") || "dealer";
        const userName = dealer?.user?.replace(/\s+/g, "-") || "users";
        link.download = `users-${dealerName}-${userName}-${
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
        console.error("❌ Error exporting dealer users PNG:", error);
        alert("Failed to export PNG. Please try again.");

        const button = document.activeElement;
        if (button) {
          button.innerHTML = '<i class="fas fa-image mr-1"></i>Export PNG';
          button.disabled = false;
        }
      }
    };

    const exportUsersToCSV = () => {
      const usersToExport = sortedUsers;
      if (!usersToExport || usersToExport.length === 0) {
        alert("No data to export");
        return;
      }

      const getFormattedValueForExport = (mainValue, webValue) => {
        const main = mainValue ?? 0;
        const web = webValue ?? 0;

        if (webValue !== undefined && webValue !== null) {
          return `${main} (${web})`;
        }
        return `${main}`;
      };

      const headers = [
        "User",
        "Role",
        "Registered",
        "Status",
        "Last Login",
        "Created Enquiries",
        "Digital Enquiries",
        "Created Follow-ups",
        "Completed Follow-ups",
        "Upcoming Follow-ups",
        "Overdue Follow-ups",
        "Total Test Drives",
        "Completed Test Drives",
        "Upcoming Test Drives",
        "Overdue Test Drives",
        "Opp. Converted",
      ];

      const csvRows = usersToExport.map((user) => {
        const followupWeb =
          user.followups?.webleads ||
          user.followups?.webleadsFollowUps ||
          user.followups?.webwebleads ||
          0;

        const followupCompletedWeb =
          user.followups?.webcompletedfollowups ||
          user.followups?.webCompletedFollowUps ||
          user.followups?.webcompleted ||
          0;

        const followupUpcomingWeb =
          user.followups?.webupcomingfollowups ||
          user.followups?.webUpcomingFollowUps ||
          user.followups?.webupcoming ||
          0;

        const followupOverdueWeb =
          user.followups?.weboverduefollowups ||
          user.followups?.webOverdueFollowUps ||
          user.followups?.weboverdue ||
          0;

        const testDriveCompletedWeb =
          user.testdrives?.webcompleteddrives ||
          user.testdrives?.webCompletedTestDrives ||
          user.testdrives?.webcompleted ||
          0;

        const testDriveUpcomingWeb =
          user.testdrives?.webupcomingdrives ||
          user.testdrives?.webUpcomingTestDrives ||
          user.testdrives?.webupcoming ||
          0;

        const testDriveOverdueWeb =
          user.testdrives?.weboverduedrives ||
          user.testdrives?.webOverdueTestDrives ||
          user.testdrives?.weboverdue ||
          0;

        return [
          `"${(user.user || "").replace(/"/g, '""')}"`,
          user.user_role || "",
          user.registerUser ? "Yes" : "No",
          user.active ? "Active" : "Inactive",
          user.last_login
            ? new Date(user.last_login)
                .toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                .replace(",", "")
            : "-",
          user.leads?.sa ?? 0,
          user.leads?.manuallyEntered ?? 0,
          `"${getFormattedValueForExport(user.followups?.sa, followupWeb)}"`,
          `"${getFormattedValueForExport(
            user.followups?.completed,
            followupCompletedWeb,
          )}"`,
          `"${getFormattedValueForExport(
            user.followups?.open,
            followupUpcomingWeb,
          )}"`,
          `"${getFormattedValueForExport(
            user.followups?.closed,
            followupOverdueWeb,
          )}"`,
          user.testdrives?.total ?? 0,
          `"${getFormattedValueForExport(
            user.testdrives?.completed,
            testDriveCompletedWeb,
          )}"`,
          `"${getFormattedValueForExport(
            user.testdrives?.upcoming,
            testDriveUpcomingWeb,
          )}"`,
          `"${getFormattedValueForExport(
            user.testdrives?.closed,
            testDriveOverdueWeb,
          )}"`,
          user.opportunitiesConverted ?? 0,
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
        `users-${dealer?.dealerName?.replace(/\s+/g, "-") || "dealer"}-${
          new Date().toISOString().split("T")[0]
        }.csv`,
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    // Expose functions to parent via ref
    useImperativeHandle(ref, () => ({
      handleExportPNG,
      exportUsersToCSV,
    }));

    // ==================== FORMATTING HELPER ====================
    const formatValueWithWeb = (
      mainValue,
      webValue,
      colorClass = "",
      clickable = false,
      onClick = null,
    ) => {
      const main = mainValue ?? 0;
      const web = webValue ?? 0;

      if (web !== undefined && web !== null) {
        return (
          <div
            className={`inline-flex items-center ${colorClass}`}
            style={{ verticalAlign: "middle" }}
          >
            {clickable ? (
              <button
                className="hover:underline focus:outline-none cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClick) onClick();
                }}
                style={{
                  lineHeight: "normal",
                  color: colorClass.includes("red") ? "#dc2626" : "inherit",
                }}
              >
                {main}
              </button>
            ) : (
              <span style={{ lineHeight: "normal" }}>{main}</span>
            )}
            <span
              className="text-xs ml-1"
              style={{
                color: "rgb(255, 152, 0)",
                lineHeight: "normal",
                verticalAlign: "middle",
              }}
            >
              ({web})
            </span>
          </div>
        );
      }

      if (clickable) {
        return (
          <button
            className={`hover:underline focus:outline-none cursor-pointer ${colorClass}`}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            style={{
              lineHeight: "normal",
              color: colorClass.includes("red") ? "#dc2626" : "inherit",
            }}
          >
            {main}
          </button>
        );
      }

      return (
        <span className={colorClass} style={{ lineHeight: "normal" }}>
          {main}
        </span>
      );
    };

    // ==================== MODAL SPECIFIC COMPONENTS ====================
    const ModalHeader = () => (
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300 flex-shrink-0">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            {dealer.dealerName || dealer.name}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200">
              {formatNumber(sortedUsers.length)} users
            </span>

            <select
              value={modalFilter}
              onChange={(e) => onModalFilterChange(e.target.value)}
              className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none min-w-[150px] text-xs"
              disabled={isLoadingDealerData}
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

            {modalFilter === "CUSTOM" && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
                  <input
                    type="date"
                    value={modalCustomStartDate || ""}
                    onChange={(e) =>
                      onModalCustomStartDateChange(e.target.value)
                    }
                    className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
                    disabled={isLoadingDealerData}
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="date"
                    value={modalCustomEndDate || ""}
                    onChange={(e) => onModalCustomEndDateChange(e.target.value)}
                    className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-32"
                    disabled={isLoadingDealerData}
                  />
                </div>

                <button
                  onClick={onApplyCustomDates}
                  disabled={isLoadingDealerData}
                  className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  Apply
                </button>

                <button
                  onClick={onResetCustomDates}
                  disabled={isLoadingDealerData}
                  className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap"
                >
                  Reset
                </button>
              </div>
            )}

            {isLoadingDealerData && (
              <span className="text-xs text-blue-600 whitespace-nowrap">
                <i className="fas fa-spinner fa-spin mr-1"></i>
                Updating...
              </span>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between w-full">
          <h2 className="text-lg font-bold text-gray-800 leading-tight">
            User Details
            <br />
            <span className="text-sm font-normal">
              {dealer.dealerName || dealer.name}
            </span>
          </h2>
          <button
            onClick={onCloseModal}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Desktop Export Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onExportPNG}
            className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-image text-xs"></i>
            Export PNG
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-download text-xs"></i>
            Export CSV
          </button>

          <button
            onClick={onCloseModal}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    );

    const MobileControls = () => (
      <div className="md:hidden mb-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
            {formatNumber(sortedUsers.length)} users
          </span>

          <select
            value={modalFilter}
            onChange={(e) => onModalFilterChange(e.target.value)}
            className="time-filter px-3 py-1 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none text-xs flex-1 min-w-[150px]"
            disabled={isLoadingDealerData}
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
        </div>

        <div className="flex gap-2">
          <button
            onClick={onExportPNG}
            className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-image text-xs"></i>
            Export PNG
          </button>

          <button
            onClick={onExportCSV}
            className="px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1 flex-1 justify-center"
            disabled={isLoadingDealerData}
          >
            <i className="fas fa-download text-xs"></i>
            Export CSV
          </button>
        </div>

        {modalFilter === "CUSTOM" && (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1 w-full">
                <input
                  type="date"
                  value={modalCustomStartDate || ""}
                  onChange={(e) => onModalCustomStartDateChange(e.target.value)}
                  className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
                  disabled={isLoadingDealerData}
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={modalCustomEndDate || ""}
                  onChange={(e) => onModalCustomEndDateChange(e.target.value)}
                  className="custom-date px-2 py-1 border border-gray-300 rounded text-xs w-full"
                  disabled={isLoadingDealerData}
                />
              </div>

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={onApplyCustomDates}
                  disabled={isLoadingDealerData}
                  className="apply-btn px-3 py-1 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex-1"
                >
                  Apply
                </button>

                <button
                  onClick={onResetCustomDates}
                  disabled={isLoadingDealerData}
                  className="reset-btn px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 whitespace-nowrap flex-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoadingDealerData && (
          <div className="flex items-center">
            <span className="text-xs text-blue-600 whitespace-nowrap">
              <i className="fas fa-spinner fa-spin mr-1"></i>
              Updating...
            </span>
          </div>
        )}
      </div>
    );

    const DealerSummarySection = () => {
      const currentDealer = getCurrentDealerData();

      return (
        <div className="mb-3 flex-shrink-0">
          <div
            className="overflow-x-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
            }}
          >
            <style>{`
              .overflow-x-auto::-webkit-scrollbar {
                height: 4px;
              }
              .overflow-x-auto::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 2px;
              }
              .overflow-x-auto::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 2px;
              }
              .overflow-x-auto::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
            `}</style>
            <table className="w-full border-collapse text-xs min-w-max">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Total
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Registered
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Active
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Created Enquiries
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Digital
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Created Follow-ups
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Completed Follow-ups
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Upcoming Follow-ups
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Overdue Follow-ups
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Total Test Drives
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Completed Test Drives
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Upcoming Test Drives
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">
                    Overdue Test Drives
                  </th>
                  <th className="px-2 py-1 text-center font-semibold text-gray-700 whitespace-nowrap">
                    Opportunities Converted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b border-gray-200">
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
                    {getDealerValue(currentDealer, ["totalUsers"])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200">
                    {getDealerValue(currentDealer, ["registerUsers"])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600">
                    {getDealerValue(currentDealer, ["activeUsers"])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
                    {getDealerValue(currentDealer, ["saLeads"])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200">
                    {getDealerValue(currentDealer, ["manuallyEnteredLeads"])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
                    {getDealerValue(
                      currentDealer,
                      ["saFollowUps"],
                      ["webleadsFollowUps"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600">
                    {getDealerValue(
                      currentDealer,
                      ["completedFollowUps"],
                      ["webCompletedFollowUps"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600">
                    {getDealerValue(
                      currentDealer,
                      ["openFollowUps"],
                      ["webUpcomingFollowUps"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-red-600">
                    {getDealerValue(
                      currentDealer,
                      ["closedFollowUps"],
                      ["webOverdueFollowUps"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-[#222fb9]">
                    {getDealerValue(currentDealer, [
                      "totalTestDrives",
                      "saTestDrives",
                    ])}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-green-600">
                    {getDealerValue(
                      currentDealer,
                      ["completedTestDrives"],
                      ["webCompletedTestDrives"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 text-blue-600">
                    {getDealerValue(
                      currentDealer,
                      ["upcomingTestDrives"],
                      ["webUpcomingTestDrives"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right border-r border-gray-200 font-semibold text-red-600">
                    {getDealerValue(
                      currentDealer,
                      ["closedTestDrives"],
                      ["webOverdueTestDrives"],
                    )}
                  </td>
                  <td className="px-2 py-1 text-right font-semibold text-green-600">
                    {getDealerValue(currentDealer, ["opportunitiesConverted"])}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    // ==================== SUB-COMPONENTS ====================
    const UserSortIcon = ({ column }) => {
      if (userSortColumn !== column) {
        return (
          <span className="sort-arrows inline-flex flex-col ml-1">
            <span className="arrow-up text-[10px] text-gray-400">▲</span>
            <span className="arrow-down text-[10px] text-gray-400">▼</span>
          </span>
        );
      }

      if (userSortDirection === "asc") {
        return (
          <span className="sort-arrows inline-flex flex-col ml-1">
            <span className="arrow-up text-[10px] text-[#222fb9]">▲</span>
            <span className="arrow-down text-[10px] text-gray-400">▼</span>
          </span>
        );
      } else if (userSortDirection === "desc") {
        return (
          <span className="sort-arrows inline-flex flex-col ml-1">
            <span className="arrow-up text-[10px] text-gray-400">▲</span>
            <span className="arrow-down text-[10px] text-[#222fb9]">▼</span>
          </span>
        );
      }

      return null;
    };

    // ==================== OVERDUE MODAL COMPONENT ====================
    const OverdueModal = () => {
      const ageingCounts = getAgeingCounts();
      const dealerData = overdueModalData?.dealerData?.[0];
      const isFollowup = overdueModalType === "followups";

      return (
        <div
          className="fixed inset-0 flex items-center justify-center z-[200] backdrop-blur-sm"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeOverdueModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-[90vw] max-w-6xl max-h-[80vh] mx-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 flex-shrink-0 bg-gray-50">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 truncate">
                  {isFollowup
                    ? "Overdue Follow-ups Report"
                    : "Overdue Test Drives Report"}
                  {dealerData?.dealerName && (
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      - {dealerData.dealerName}
                    </span>
                  )}
                </h2>
                {/* {overdueModalData?.date_range && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(overdueModalData.date_range.start)} -{" "}
                    {formatDate(overdueModalData.date_range.end)}
                  </p>
                )} */}
                {/* <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-600">Filter:</span>
                  <span className="text-xs font-medium text-[#222fb9] bg-blue-50 px-2 py-1 rounded border border-blue-200">
                    {overdueModalFilter === "CUSTOM"
                      ? `Custom (${formatDate(overdueCustomStartDate)} to ${formatDate(overdueCustomEndDate)})`
                      : dateFilterOptions.find(
                          (opt) => opt.value === overdueModalFilter,
                        )?.label || overdueModalFilter}
                  </span>
                </div> */}
              </div>

              <div className="flex items-center gap-4">
                {/* Date Filter Dropdown */}
                <div className="relative">
                  <div className="relative">
                    <select
                      value={overdueModalFilter}
                      onChange={handleOverdueFilterChange}
                      className="time-filter px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:border-[#222fb9] focus:ring-1 focus:ring-[#222fb9] outline-none min-w-[150px] text-sm appearance-none"
                    >
                      {dateFilterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={closeOverdueModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>

            {/* Custom Date Picker */}
            {overdueModalFilter === "CUSTOM" && (
              <div className="px-6 py-3 border-b border-gray-200 bg-blue-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={overdueCustomStartDate || ""}
                      onChange={(e) =>
                        setOverdueCustomStartDate(e.target.value)
                      }
                      className="custom-date px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm"
                    />
                    <span className="text-gray-600">to</span>
                    <input
                      type="date"
                      value={overdueCustomEndDate || ""}
                      onChange={(e) => setOverdueCustomEndDate(e.target.value)}
                      className="custom-date px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={applyOverdueCustomDate}
                      disabled={
                        !overdueCustomStartDate || !overdueCustomEndDate
                      }
                      className="apply-btn px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1b258f] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                    >
                      Apply
                    </button>
                    <button
                      onClick={resetOverdueFilter}
                      className="reset-btn px-4 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats and Tabs */}
            {overdueModalData && dealerData && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {/* Left Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Total {isFollowup ? "Follow-ups" : "Test Drives"}:
                      </span>
                      <span className="text-[#222fb9] font-semibold text-base">
                        {dealerData.closed_followups?.total ||
                          dealerData.closed_testdrives?.total ||
                          0}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Total Digital Overdue:
                      </span>
                      <span className="text-orange-600 font-semibold text-base">
                        {dealerData.web_overdue_followups?.total ||
                          dealerData.web_overdue_testdrives?.total ||
                          0}
                      </span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-300">
                    <button
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                        overdueActiveTab === "closed"
                          ? "text-[#222fb9] border-b-2 border-[#222fb9]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setOverdueActiveTab("closed")}
                    >
                      {isFollowup ? "Total Follow-ups" : "Total Test Drives"}
                      <span className="ml-2 bg-blue-100 text-[#222fb9] text-xs px-2 py-1 rounded">
                        {dealerData.closed_followups?.total ||
                          dealerData.closed_testdrives?.total ||
                          0}
                      </span>
                    </button>

                    <button
                      className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                        overdueActiveTab === "web"
                          ? "text-[#222fb9] border-b-2 border-[#222fb9]"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setOverdueActiveTab("web")}
                    >
                      {isFollowup
                        ? "Digital Overdue Follow-ups"
                        : "Digital Overdue Test Drives"}
                      <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        {dealerData.web_overdue_followups?.total ||
                          dealerData.web_overdue_testdrives?.total ||
                          0}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto min-h-0 p-6">
              {overdueModalLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#222fb9] mb-4"></div>
                  <div className="text-gray-500 text-sm">Loading data...</div>
                </div>
              )}

              {!overdueModalLoading && overdueModalData && dealerData && (
                <div className="space-y-6">
                  {/* Ageing Summary Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm text-red-800 font-medium">
                        60+ Days
                      </div>
                      <div className="text-2xl font-bold text-red-600 mt-1">
                        {ageingCounts["60+d"]}
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-sm text-yellow-800 font-medium">
                        31-60 Days
                      </div>
                      <div className="text-2xl font-bold text-yellow-600 mt-1">
                        {ageingCounts["31-60d"]}
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-green-800 font-medium">
                        &lt;30 Days
                      </div>
                      <div className="text-2xl font-bold text-green-600 mt-1">
                        {ageingCounts["<30d"]}
                      </div>
                    </div>
                  </div>

                  {/* Table Placeholder - Since we don't have lead details in API */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="max-h-[400px] overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ageing
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lead Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Created At
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td
                              colSpan="5"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              Lead details are not available.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-between items-center flex-shrink-0">
              <span className="text-sm text-gray-500">
                Showing counts for{" "}
                {overdueActiveTab === "closed"
                  ? isFollowup
                    ? "closed follow-ups"
                    : "closed test drives"
                  : isFollowup
                    ? "web overdue follow-ups"
                    : "web overdue test drives"}
              </span>
              <button
                onClick={closeOverdueModal}
                className="px-4 py-2 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    };

    // ==================== RENDER ====================
    return (
      <>
        {/* Toast Notification */}
        {showToast && isModal && (
          <div className="fixed top-4 right-4 z-[1000] animate-slideIn">
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <div className="relative z-30 w-full h-full flex flex-col">
          {isModal && <ModalHeader />}
          {isModal && <MobileControls />}

          {/* FIXED: Remove overflow-hidden from this wrapper */}
          <div
            ref={exportContainerRef}
            className="flex-1 min-h-0 flex flex-col"
          >
            {isModal && <DealerSummarySection />}

            {/* Main Content Area - Takes remaining space */}
            {loadingUsers[dealerId] ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading users...
              </div>
            ) : allUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <i className="fas fa-users-slash mr-2"></i>
                No users found for this dealer
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Export buttons section */}
                <div className="flex justify-between items-center px-2 py-1 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                  <div className="text-xs text-gray-600">
                    {/* {userSortColumn && userSortDirection !== "default" && (
                      <span className="ml-2 text-blue-600">
                        <i className="fas fa-sort mr-1"></i>
                        Sorted by {userSortColumn.replace(/_/g, " ")} (
                        {userSortDirection === "asc"
                          ? "Ascending"
                          : "Descending"}
                        )
                      </span>
                    )} */}
                  </div>
                </div>

                {/* FIXED: Table container - Make this scrollable */}
                <div className="flex-1 min-h-0 overflow-auto">
                  <div
                    ref={tableRef}
                    className="bg-white border border-gray-200 relative z-30 w-full h-full"
                  >
                    <div className="overflow-auto h-full">
                      <table className="w-full text-[11px] border-collapse min-w-[1600px] relative">
                        <thead className="bg-gray-50 sticky top-0 z-40">
                          <tr>
                            <th className="bg-gray-50 sticky left-0 z-[45] px-2 py-1.5 text-left font-semibold text-gray-700 border-r border-gray-200 min-w-[120px]">
                              <div className="flex items-center">User</div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() => handleUserSort("role")}
                              >
                                Role
                                <UserSortIcon column="role" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[60px]">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() => handleUserSort("registered")}
                              >
                                Registered
                                <UserSortIcon column="registered" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px]">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() => handleUserSort("status")}
                              >
                                Status
                                <UserSortIcon column="status" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[80px]">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() => handleUserSort("last_login")}
                              >
                                Last Login
                                <UserSortIcon column="last_login" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[80px] bg-blue-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("created_enquiries")
                                }
                              >
                                Created Enquiries
                                <UserSortIcon column="created_enquiries" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[70px] bg-blue-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("digital_enquiries")
                                }
                              >
                                Digital
                                <UserSortIcon column="digital_enquiries" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("created_followups")
                                }
                              >
                                Created Follow-ups
                                <UserSortIcon column="created_followups" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("completed_followups")
                                }
                              >
                                Completed Follow-ups
                                <UserSortIcon column="completed_followups" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-green-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("upcoming_followups")
                                }
                              >
                                Upcoming Follow-ups
                                <UserSortIcon column="upcoming_followups" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-green-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("overdue_followups")
                                }
                              >
                                Overdue Follow-ups
                                <UserSortIcon column="overdue_followups" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("total_testdrives")
                                }
                              >
                                Total Test Drives
                                <UserSortIcon column="total_testdrives" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("completed_testdrives")
                                }
                              >
                                Completed Test Drives
                                <UserSortIcon column="completed_testdrives" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-200 min-w-[90px] bg-orange-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("upcoming_testdrives")
                                }
                              >
                                Upcoming Test Drives
                                <UserSortIcon column="upcoming_testdrives" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 border-r border-gray-300 min-w-[90px] bg-orange-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() =>
                                  handleUserSort("overdue_testdrives")
                                }
                              >
                                Overdue Test Drivess
                                <UserSortIcon column="overdue_testdrives" />
                              </div>
                            </th>
                            <th className="px-1 py-1.5 text-center font-medium text-gray-600 min-w-[80px] bg-purple-50">
                              <div
                                className="flex items-center justify-center cursor-pointer hover:text-[#222fb9] transition-colors"
                                onClick={() => handleUserSort("opp_converted")}
                              >
                                Opp. Converted
                                <UserSortIcon column="opp_converted" />
                              </div>
                            </th>
                          </tr>
                        </thead>

                        <tbody className="bg-white">
                          {sortedUsers.map((user, userIndex) => {
                            const isPurged = user.registerUser === false;

                            return (
                              <tr
                                key={user.user_id || user.userId || userIndex}
                                className={`
                                  border-b border-gray-100 transition-none
                                  ${
                                    isPurged
                                      ? "bg-red-50 hover:bg-red-100"
                                      : userIndex % 2 === 0
                                        ? "bg-white hover:bg-blue-50"
                                        : "bg-gray-50 hover:bg-blue-50"
                                  }
                                `}
                              >
                                <td
                                  className={`
                                    sticky left-0 z-[35] px-2 py-1 text-left font-medium border-r border-gray-200 whitespace-nowrap text-[11px]
                                    ${
                                      isPurged
                                        ? "bg-red-50 hover:bg-red-100"
                                        : userIndex % 2 === 0
                                          ? "bg-white hover:bg-blue-50"
                                          : "bg-gray-50 hover:bg-blue-50"
                                    }
                                    text-gray-900
                                  `}
                                >
                                  <div className="flex items-center">
                                    {user.user}
                                  </div>
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {user.user_role}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  <span
                                    className={`inline-block px-1 py-0.5 rounded text-[10px] font-medium ${
                                      user.registerUser
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {user.registerUser ? "Yes" : "No"}
                                  </span>
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  <span
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                      user.active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    <span
                                      className={`w-1 h-1 rounded-full mr-1 ${
                                        user.active
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></span>
                                    {user.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-300 text-gray-500 text-[11px]">
                                  {user.last_login ? (
                                    <div className="flex flex-col leading-tight">
                                      <div className="whitespace-nowrap">
                                        {new Date(user.last_login)
                                          .toLocaleString("en-IN", {
                                            timeZone: "Asia/Kolkata",
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                          })
                                          .replace(",", "")}
                                      </div>
                                      <div className="text-[10px] text-gray-400 mt-0.5">
                                        (
                                        {user.daysInactive === undefined ||
                                        user.daysInactive === null
                                          ? "0"
                                          : user.daysInactive === 0
                                            ? "0 days"
                                            : `${user.daysInactive} day${user.daysInactive === 1 ? "" : "s"}`}
                                        )
                                      </div>
                                    </div>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                {/* Leads Data */}
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  <span className="font-semibold text-[#222fb9]">
                                    {user.leads?.sa ?? "-"}
                                  </span>
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200 text-gray-600">
                                  {user.leads?.manuallyEntered ?? 0}
                                </td>

                                {/* Follow-ups Data */}
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {formatValueWithWeb(
                                    user.followups?.sa,
                                    user.followups?.webleads,
                                    "font-semibold text-[#222fb9]",
                                  )}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {formatValueWithWeb(
                                    user.followups?.completed,
                                    user.followups?.webcompletedfollowups,
                                    "font-semibold text-green-600",
                                  )}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {formatValueWithWeb(
                                    user.followups?.open,
                                    user.followups?.webupcomingfollowups,
                                    "text-blue-600",
                                  )}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-300">
                                  {formatValueWithWeb(
                                    user.followups?.closed,
                                    user.followups?.weboverduefollowups,
                                    "font-semibold text-red-600",
                                    true,
                                    () => handleOverdueClick("followups"),
                                  )}
                                </td>

                                {/* Test Drives Data */}
                                <td className="px-1 py-1 text-center border-r border-gray-200 font-semibold text-[#222fb9]">
                                  {user.testdrives?.total ?? 0}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {formatValueWithWeb(
                                    user.testdrives?.completed,
                                    user.testdrives?.webcompleteddrives,
                                    "font-semibold text-green-600",
                                  )}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-200">
                                  {formatValueWithWeb(
                                    user.testdrives?.upcoming,
                                    user.testdrives?.webupcomingdrives,
                                    "text-blue-600",
                                  )}
                                </td>
                                <td className="px-1 py-1 text-center border-r border-gray-300">
                                  {formatValueWithWeb(
                                    user.testdrives?.closed,
                                    user.testdrives?.weboverduedrives,
                                    "font-semibold text-red-600",
                                    true,
                                    () => handleOverdueClick("testdrives"),
                                  )}
                                </td>

                                <td className="px-1 py-1 text-center font-semibold text-green-600">
                                  {user.opportunitiesConverted ?? 0}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Show/Hide non-registered users button */}
                {!isModal && totalPurgedUsers > 0 && (
                  <div className="border-t border-gray-200 p-2 bg-white flex justify-start flex-shrink-0">
                    <button
                      onClick={() => setShowPurgedUsers(!showPurgedUsers)}
                      className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                    >
                      <i
                        className={`fas fa-${showPurgedUsers ? "eye-slash" : "eye"} text-xs`}
                      ></i>
                      {showPurgedUsers ? "Show Less" : "Show More"}
                      <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded text-[10px]">
                        {totalPurgedUsers}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer area for modal */}
          {isModal && (
            <div className="mt-2 pt-2 border-t border-gray-300 flex-shrink-0">
              <div className="flex justify-between items-center">
                {/* Show/Hide non-registered users button on left */}
                {totalPurgedUsers > 0 && (
                  <div>
                    <button
                      onClick={() => setShowPurgedUsers(!showPurgedUsers)}
                      className="px-3 py-1.5 bg-[#222fb9] text-white rounded text-xs hover:bg-[#1a259c] transition-colors font-medium flex items-center gap-1"
                      disabled={isLoadingDealerData}
                    >
                      <i
                        className={`fas fa-${showPurgedUsers ? "eye-slash" : "eye"} text-xs`}
                      ></i>
                      {showPurgedUsers ? "Show Less" : "Show More"}
                      <span className="ml-1 bg-white/30 px-1.5 py-0.5 rounded text-[10px]">
                        {totalPurgedUsers}
                      </span>
                    </button>
                  </div>
                )}

                {/* Close button on right */}
                <div className="ml-auto">
                  <button
                    onClick={onCloseModal}
                    className="px-4 py-1.5 bg-[#222fb9] text-white rounded-lg hover:bg-[#1a259c] transition-colors font-medium"
                    disabled={isLoadingDealerData}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overdue Modal */}
        {showOverdueModal && <OverdueModal />}
      </>
    );
  },
);

export default DealerUserDetails;
