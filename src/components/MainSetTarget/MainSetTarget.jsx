// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// const MainSetTarget = ({ onLogout }) => {
//   // State Management
//   const [isLoading, setIsLoading] = useState(true);
//   const [targetList, setTargetList] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRange, setSelectedRange] = useState("MTD");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     enquiries: "",
//     testDrives: "",
//     orders: "",
//   });
//   const [formErrors, setFormErrors] = useState({});
//   const [formTouched, setFormTouched] = useState({});

//   const navigate = useNavigate();

//   // ✅ ADD: Ref to track if toast is already showing (same as dashboard)
//   const isToastShowingRef = useRef(false);

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("access_token")
//     );
//   };

//   // ✅ ADD: Centralized 401 handler (SAME AS DASHBOARD)
//   const handleUnauthorized = () => {
//     if (isToastShowingRef.current) {
//       return true; // Toast already showing
//     }

//     // console.log("🚨 Unauthorized - Token expired or invalid");
//     isToastShowingRef.current = true;

//     toast.error("Session expired. Please login again.", {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "colored",
//       onClose: () => {
//         isToastShowingRef.current = false; // Reset when toast closes
//       },
//     });

//     // Clear token and redirect (use window.location.href for reliability)
//     setTimeout(() => {
//       // Clear all authentication data
//       localStorage.removeItem("token");
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("user");
//       localStorage.removeItem("userRole");
//       sessionStorage.clear();

//       // Use window.location.href for reliable redirect (same as dashboard)
//       window.location.href = "/login";
//     }, 2000);

//     return true;
//   };

//   // ✅ UPDATED: Check authentication with session handling
//   const checkAuthAndNavigate = () => {
//     const token = getAuthToken();

//     // If no token, redirect to login
//     if (!token) {
//       toast.warning("Please login first!", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       navigate("/login");
//       return false;
//     }
//     return true;
//   };

//   useEffect(() => {
//     checkAuthAndNavigate();
//   }, [navigate]);

//   // Fetch data on component mount and when range changes
//   useEffect(() => {
//     fetchTargetData();
//   }, [selectedRange]);

//   // ✅ UPDATED: Fetch target data with centralized 401 handling
//   const fetchTargetData = async () => {
//     // Check authentication first
//     if (!checkAuthAndNavigate()) {
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const token = getAuthToken();

//       if (!token) {
//         // console.error("No token found");
//         toast.warning("Please login first!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setIsLoading(false);
//         return;
//       }

//       const apiUrl =
//         selectedRange && selectedRange !== "ALL"
//           ? `https://uat.smartassistapp.in/api/dealer/targets/all?range=${selectedRange}`
//           : `https://uat.smartassistapp.in/api/dealer/targets/all`;

//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // ✅ USE CENTRALIZED HANDLER for 401
//       if (response.status === 401) {
//         handleUnauthorized();
//         setIsLoading(false);
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const res = await response.json();
//       // console.log("API Response:", res);

//       if (Array.isArray(res.data)) {
//         // Map data same as Angular
//         const mappedData = res.data.map((entry) => {
//           let targetInstance = {};

//           if (Array.isArray(entry.targets) && entry.targets.length > 0) {
//             const lastTarget = entry.targets[entry.targets.length - 1];
//             targetInstance = {
//               enquiries: lastTarget.enquiries || 0,
//               testDrives: lastTarget.testDrives || 0,
//               orders: lastTarget.orders || 0,
//               original: {
//                 enquiries: lastTarget.enquiries || 0,
//                 testDrives: lastTarget.testDrives || 0,
//                 orders: lastTarget.orders || 0,
//               },
//             };
//           } else {
//             targetInstance = {

//               enquiries: 0,
//               testDrives: 0,
//               orders: 0,
//               original: { enquiries: 0, testDrives: 0, orders: 0 },
//             };
//           }

//           return {
//             user: entry.user,
//             target: targetInstance,
//           };
//         });

//         // console.table(
//         //   mappedData.map((item) => ({
//         //     name: item.user?.name || item.user?.fname || "N/A",
//         //     email: item.user?.email || "N/A",
//         //     enquiries: item.target?.enquiries,
//         //     testDrives: item.target?.testDrives,
//         //     orders: item.target?.orders,
//         //   }))
//         // );

//         setTargetList(mappedData);
//       } else {
//         setTargetList([]);
//         // console.warn("No target data found");
//       }
//     } catch (error) {
//       // console.error("Error fetching target data:", error);

//       // ✅ Handle different error types
//       if (error.message.includes("Network Error")) {
//         toast.error("📡 Please check your internet connection!", {
//           autoClose: 3000,
//         });
//       } else if (error.message.includes("401")) {
//         // Already handled by centralized handler
//       } else {
//         // toast.error(`❌ ${error.message || "Failed to fetch targets"}`, {
//         //   autoClose: 4000,
//         // });
//       }

//       setTargetList([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filtered data based on search
//   const filteredTeam = useMemo(() => {
//     if (!searchTerm) {
//       // console.log("No search term, showing all:", targetList.length);
//       return targetList;
//     }

//     const term = searchTerm.toLowerCase().trim();
//     // console.log(`🔍 Searching for "${term}" in ${targetList.length} items`);

//     const results = targetList.filter((entry, index) => {
//       // Get user data with fallbacks
//       const user = entry.user || {};

//       // Try all possible name variations
//       const name = (
//         user.name ||
//         user.Name ||
//         `${user.fname || ""} ${user.lname || ""}`.trim() ||
//         `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
//         ""
//       ).toLowerCase();

//       const email = (user.email || user.Email || "").toLowerCase();

//       // Check if matches
//       const nameMatch = name.includes(term);
//       const emailMatch = email.includes(term);
//       const enquiryMatch = String(entry.target?.enquiries || "").includes(term);
//       const testDriveMatch = String(entry.target?.testDrives || "").includes(
//         term,
//       );
//       const orderMatch = String(entry.target?.orders || "").includes(term);

//       if (
//         nameMatch ||
//         emailMatch ||
//         enquiryMatch ||
//         testDriveMatch ||
//         orderMatch
//       ) {
//         // console.log(`✅ Match at index ${index}:`, {
//         //   name: user.name || "No name",
//         //   email: user.email || "No email",
//         //   enquiries: entry.target?.enquiries,
//         //   testDrives: entry.target?.testDrives,
//         //   orders: entry.target?.orders,
//         // });
//         return true;
//       }

//       return false;
//     });

//     // console.log(`📊 Search complete: ${results.length} matches found`);
//     return results;
//   }, [targetList, searchTerm]);

//   // Paginated data
//   const paginatedTarget = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredTeam.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredTeam, currentPage, itemsPerPage]);

//   // Total pages
//   const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);

//   // Visible page numbers
//   const visiblePages = useMemo(() => {
//     const pages = [];
//     const groupSize = 3;
//     const startGroup =
//       Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
//     const endGroup = Math.min(startGroup + groupSize - 1, totalPages);

//     for (let i = startGroup; i <= endGroup; i++) {
//       pages.push(i);
//     }
//     return pages;
//   }, [currentPage, totalPages]);

//   // Check if any changes were made
//   const hasAnyChanges = () => {
//     return targetList.some(
//       (entry) =>
//         entry.target.enquiries !== entry.target.original?.enquiries ||
//         entry.target.testDrives !== entry.target.original?.testDrives ||
//         entry.target.orders !== entry.target.original?.orders,
//     );
//   };

//   // HANDLER - FIXED VERSION
//   // const handleInputChange = (index, field, value) => {
//   //   // Remove all non-digit characters
//   //   const digitsOnly = value.replace(/[^0-9]/g, "");

//   //   // If empty string, set to 0
//   //   if (digitsOnly === "") {
//   //     const newTargetList = [...targetList];
//   //     const globalIndex = (currentPage - 1) * itemsPerPage + index;
//   //     newTargetList[globalIndex].target[field] = 0;
//   //     setTargetList(newTargetList);
//   //     return;
//   //   }

//   //   // STRICT 6-DIGIT LIMIT
//   //   if (digitsOnly.length > 6) {
//   //     return;
//   //   }

//   //   // Parse to number
//   //   const numValue = parseInt(digitsOnly, 10);

//   //   // Update state
//   //   const newTargetList = [...targetList];
//   //   const globalIndex = (currentPage - 1) * itemsPerPage + index;
//   //   newTargetList[globalIndex].target[field] = numValue;
//   //   setTargetList(newTargetList);
//   // };
//   // ✅ FIXED: handleInputChange with search compatibility
//   // const handleInputChange = (index, field, value) => {
//   //   // Remove all non-digit characters
//   //   const digitsOnly = value.replace(/[^0-9]/g, "");

//   //   // If empty string, set to 0
//   //   if (digitsOnly === "") {
//   //     const newTargetList = [...targetList];
//   //     // Get the actual item from paginatedTarget
//   //     const paginatedItem = paginatedTarget[index];
//   //     // Find its index in targetList
//   //     const actualIndex = targetList.findIndex(
//   //       (item) =>
//   //         item.user?.user_id === paginatedItem.user?.user_id ||
//   //         item.user?.email === paginatedItem.user?.email
//   //     );

//   //     if (actualIndex !== -1) {
//   //       newTargetList[actualIndex].target[field] = 0;
//   //       setTargetList(newTargetList);
//   //     }
//   //     return;
//   //   }

//   //   // STRICT 6-DIGIT LIMIT
//   //   if (digitsOnly.length > 6) {
//   //     return;
//   //   }

//   //   // Parse to number
//   //   const numValue = parseInt(digitsOnly, 10);

//   //   // Get the actual item from paginatedTarget
//   //   const paginatedItem = paginatedTarget[index];
//   //   // Find its index in targetList
//   //   const actualIndex = targetList.findIndex(
//   //     (item) =>
//   //       item.user?.user_id === paginatedItem.user?.user_id ||
//   //       item.user?.email === paginatedItem.user?.email
//   //   );

//   //   // Update state if found
//   //   if (actualIndex !== -1) {
//   //     const newTargetList = [...targetList];
//   //     newTargetList[actualIndex].target[field] = numValue;
//   //     setTargetList(newTargetList);
//   //   }
//   // };
//   // ✅ FIXED: handleInputChange with 3-digit limit
//   const handleInputChange = (index, field, value) => {
//     // Get the actual item from paginatedTarget
//     const paginatedItem = paginatedTarget[index];

//     // Safety check
//     if (!paginatedItem) return;

//     // Find its index in targetList
//     const actualIndex = targetList.findIndex(
//       (item) =>
//         item.user?.user_id === paginatedItem.user?.user_id ||
//         item.user?.email === paginatedItem.user?.email,
//     );

//     if (actualIndex === -1) return;

//     // ✅ FIXED: Get current value from state to check if we're editing down from >3 digits
//     const currentValue = targetList[actualIndex].target[field];

//     // Handle empty value
//     if (value === "") {
//       const newTargetList = [...targetList];
//       newTargetList[actualIndex].target[field] = 0;
//       setTargetList(newTargetList);
//       return;
//     }

//     // Remove all non-digit characters
//     const digitsOnly = value.replace(/[^0-9]/g, "");

//     // If empty after cleaning
//     if (digitsOnly === "") {
//       const newTargetList = [...targetList];
//       newTargetList[actualIndex].target[field] = 0;
//       setTargetList(newTargetList);
//       return;
//     }

//     // ✅ FIXED: SPECIAL CASE - Allow backspacing from >3 digits to ≤3 digits
//     // If current value is >999 AND user is trying to reduce it (backspacing)
//     if (currentValue > 999) {
//       // Parse to number
//       const numValue = parseInt(digitsOnly, 10);

//       // Only update if the new value is ≤ 999
//       if (numValue <= 999) {
//         const newTargetList = [...targetList];
//         newTargetList[actualIndex].target[field] = numValue;
//         setTargetList(newTargetList);
//       } else {
//         // If still >999 after backspacing, update anyway (user is still editing)
//         const newTargetList = [...targetList];
//         newTargetList[actualIndex].target[field] = numValue;
//         setTargetList(newTargetList);
//       }
//       return;
//     }

//     // ✅ NORMAL CASE: For values that are already ≤ 999 or new entries
//     // STRICT 3-DIGIT LIMIT for normal cases
//     if (digitsOnly.length > 3) {
//       // toast.warning(`${field} cannot exceed 999`, {
//       //   autoClose: 2000,
//       // });
//       return;
//     }

//     // Parse to number
//     const numValue = parseInt(digitsOnly, 10);

//     // Validate the number doesn't exceed 999
//     if (numValue > 999) {
//       // toast.warning(`${field} cannot exceed 999`, {
//       //   autoClose: 2000,
//       // });
//       return;
//     }

//     // Update state
//     const newTargetList = [...targetList];
//     newTargetList[actualIndex].target[field] = numValue;
//     setTargetList(newTargetList);
//   };

//   // Additional function to prevent default behavior for number input
//   const handleKeyPress = (e) => {
//     // Prevent 'e', '+', '-', '.' in number input
//     if (["e", "E", "+", "-", "."].includes(e.key)) {
//       e.preventDefault();
//     }
//   };

//   const onItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const onSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const onSelectRange = (range) => {
//     setSelectedRange(range);
//     setCurrentPage(1);
//   };

//   const goToPage = (page) => {
//     setCurrentPage(page);
//   };

//   const previousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const nextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   // ✅ UPDATED: Update all targets with centralized 401 handling
//   const onEditAll = async () => {
//     // Check authentication first
//     if (!checkAuthAndNavigate()) {
//       return;
//     }

//     const updatedTargets = targetList
//       .filter(
//         (item) =>
//           item.target.enquiries !== item.target.original?.enquiries ||
//           item.target.testDrives !== item.target.original?.testDrives ||
//           item.target.orders !== item.target.original?.orders,
//       )
//       .map((item) => ({
//         user_id: item.user.user_id,
//         enquiries: item.target.enquiries,
//         testDrives: item.target.testDrives,
//         orders: item.target.orders,
//       }));

//     if (updatedTargets.length === 0) {
//       toast.info("No changes to update", {
//         toastId: "no-changes",
//         autoClose: 3000,
//       });
//       return;
//     }

//     try {
//       const token = getAuthToken();
//       const apiUrl = `https://uat.smartassistapp.in/api/dealer/targets/new?range=${selectedRange}`;

//       const response = await fetch(apiUrl, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedTargets),
//       });

//       // ✅ USE CENTRALIZED HANDLER for 401
//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         // Try to get error message from response
//         const errorText = await response.text();
//         let errorMessage = "Failed to update targets";

//         try {
//           const errorJson = JSON.parse(errorText);
//           errorMessage = errorJson.message || errorJson.error || errorMessage;
//         } catch {
//           // If response is not JSON, use the text
//           errorMessage = errorText || errorMessage;
//         }

//         throw new Error(errorMessage);
//       }

//       const result = await response.json();

//       // Use backend response message for success
//       const successMessage = result.message || "Targets updated successfully!";

//       // Update state
//       const updatedTargetList = targetList.map((item) => ({
//         ...item,
//         target: {
//           ...item.target,
//           original: {
//             enquiries: item.target.enquiries,
//             testDrives: item.target.testDrives,
//             orders: item.target.orders,
//           },
//         },
//       }));

//       setTargetList(updatedTargetList);

//       toast.success(successMessage, {
//         toastId: `targets-update-${Date.now()}`,
//         autoClose: 3000,
//         position: "top-right",
//       });

//       // console.log("Update successful:", successMessage);
//     } catch (error) {
//       // console.error("Error updating targets:", error);

//       // Handle different error types
//       if (error.message.includes("Network Error")) {
//         toast.error("📡 Please check your internet connection!", {
//           autoClose: 3000,
//         });
//       } else if (error.message.includes("401")) {
//         // Already handled by centralized handler
//       } else {
//         toast.error(`❌ ${error.message || "Failed to update targets"}`, {
//           autoClose: 4000,
//         });
//       }
//     }
//   };

//   // ✅ UPDATED: Modal handlers with auth check
//   const openModal = () => {
//     // Check authentication first
//     if (!checkAuthAndNavigate()) {
//       return;
//     }

//     setIsModalOpen(true);
//     setIsEditMode(false);
//     setFormData({ enquiries: "", testDrives: "", orders: "" });
//     setFormTouched({});
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormData({ enquiries: "", testDrives: "", orders: "" });
//     setFormTouched({});
//     setFormErrors({});
//   };

//   const handleFormChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setFormTouched((prev) => ({ ...prev, [field]: true }));
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.enquiries) errors.enquiries = "Enquiries is required";
//     if (!formData.testDrives) errors.testDrives = "Test drives is required";
//     if (!formData.orders) errors.orders = "Order is required";
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   // ✅ UPDATED: Save target with centralized 401 handling
//   const onSave = async () => {
//     // Check authentication first
//     if (!checkAuthAndNavigate()) {
//       return;
//     }

//     if (!validateForm()) return;

//     try {
//       const token = getAuthToken();
//       const response = await fetch(
//         "https://uat.smartassistapp.in/api/dealer/targets",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         },
//       );

//       // ✅ USE CENTRALIZED HANDLER for 401
//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Failed to create target");
//       }

//       toast.success("Target created successfully!", {
//         autoClose: 3000,
//       });
//       closeModal();
//       fetchTargetData();
//     } catch (error) {
//       // console.error("Error saving target:", error);

//       // Handle different error types
//       if (error.message.includes("Network Error")) {
//         toast.error("📡 Please check your internet connection!", {
//           autoClose: 3000,
//         });
//       } else if (error.message.includes("401")) {
//         // Already handled by centralized handler
//       } else {
//         toast.error(`❌ ${error.message || "Failed to create target"}`, {
//           autoClose: 4000,
//         });
//       }
//     }
//   };

//   // ✅ UPDATED: Update target with centralized 401 handling
//   const onUpdate = async () => {
//     // Check authentication first
//     if (!checkAuthAndNavigate()) {
//       return;
//     }

//     if (!validateForm()) return;

//     try {
//       const token = getAuthToken();
//       const response = await fetch(
//         "https://uat.smartassistapp.in/api/dealer/targets",
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(formData),
//         },
//       );

//       // ✅ USE CENTRALIZED HANDLER for 401
//       if (response.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       if (!response.ok) {
//         throw new Error("Failed to update target");
//       }

//       toast.success("Target updated successfully!", {
//         autoClose: 3000,
//       });
//       closeModal();
//       fetchTargetData();
//     } catch (error) {
//       // console.error("Error updating target:", error);

//       // Handle different error types
//       if (error.message.includes("Network Error")) {
//         toast.error("📡 Please check your internet connection!", {
//           autoClose: 3000,
//         });
//       } else if (error.message.includes("401")) {
//         // Already handled by centralized handler
//       } else {
//         toast.error(`❌ ${error.message || "Failed to update target"}`, {
//           autoClose: 4000,
//         });
//       }
//     }
//   };

//   return (
//     <div className="container-fluid min-h-screen bg-gray-50">
//       {/* ✅ KEEP ToastContainer if it's not in App.jsx */}
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       <div className="content-section active">
//         {/* Main Card */}
//         <div className="bg-white rounded-xl shadow-sm p-2 mb-2">
//           <div className="mb-2">
//             {/* Controls Row */}
//             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
//               {/* Left: Records per page */}
//               <div className="flex items-center gap-2">
//                 <label className="text-xs font-medium text-gray-700">
//                   Records per page:
//                 </label>
//                 <select
//                   className="w-20 h-8 rounded-lg border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                   value={itemsPerPage}
//                   onChange={onItemsPerPageChange}
//                 >
//                   <option value="10">10</option>
//                   <option value="25">25</option>
//                   <option value="50">50</option>
//                   <option value="100">100</option>
//                 </select>
//               </div>

//               {/* Right: Filters + Search + Update */}
//               <div className="flex flex-col sm:flex-row items-center gap-3">
//                 {/* Filter buttons */}
//                 <div className="bg-white p-0.5 rounded-lg border border-gray-300 inline-flex gap-1">
//                   <button
//                     type="button"
//                     className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
//                       selectedRange === "MTD"
//                         ? "bg-[#222fb9] text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                     onClick={() => onSelectRange("MTD")}
//                   >
//                     MTD
//                   </button>
//                   <button
//                     type="button"
//                     className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
//                       selectedRange === "QTD"
//                         ? "bg-[#222fb9] text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                     onClick={() => onSelectRange("QTD")}
//                   >
//                     QTD
//                   </button>
//                   <button
//                     type="button"
//                     className={`px-5 py-2 rounded-md text-xs font-medium transition-colors duration-200 ${
//                       selectedRange === "YTD"
//                         ? "bg-[#222fb9] text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                     onClick={() => onSelectRange("YTD")}
//                   >
//                     YTD
//                   </button>
//                 </div>

//                 {/* Search */}
//                 <input
//                   type="text"
//                   className=" sm:max-w-xs h-8 rounded-full border border-gray-300 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                   placeholder="Search users..."
//                   value={searchTerm}
//                   onChange={onSearchChange}
//                 />

//                 {/* Update button */}
//                 <button
//                   className="h-8 px-5 rounded-lg text-xs font-medium text-white bg-[#222fb9] hover:bg-[#1a2580] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//                   disabled={!hasAnyChanges() || targetList.length === 0}
//                   onClick={onEditAll}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Sr No
//                     </th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Name
//                     </th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Email
//                     </th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Enquiries
//                     </th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Unique Test Drives
//                     </th>
//                     <th className="text-left py-3 px-4 font-medium text-gray-700">
//                       Orders
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {/* Loading State */}
//                   {isLoading && (
//                     <tr>
//                       <td colSpan="6" className="py-5 px-4 text-center text-xs">
//                         Loading...
//                       </td>
//                     </tr>
//                   )}

//                   {/* No Data State */}
//                   {!isLoading && paginatedTarget.length === 0 && (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="py-5 px-4 text-center text-gray-500 text-xs"
//                       >
//                         No target found
//                       </td>
//                     </tr>
//                   )}

//                   {/* Data Rows - FIXED INPUTS */}
//                   {!isLoading &&
//                     paginatedTarget.map((target, i) => (
//                       <tr
//                         key={i}
//                         className="border-b border-gray-100 hover:bg-gray-50"
//                       >
//                         <td className="py-2 px-4 text-xs">
//                           {(currentPage - 1) * itemsPerPage + i + 1}
//                         </td>
//                         <td className="py-2 px-4 text-xs">
//                           {target.user?.name ||
//                             `${target.user?.fname || ""} ${
//                               target.user?.lname || ""
//                             }`.trim() ||
//                             "N/A"}
//                         </td>
//                         <td className="py-2 px-4 text-xs">
//                           {target.user?.email || "N/A"}
//                         </td>
//                         <td className="py-2 px-4">
//                           <input
//                             type="number"
//                             className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                             value={
//                               target.target.enquiries === 0
//                                 ? ""
//                                 : target.target.enquiries
//                             }
//                             onChange={(e) =>
//                               handleInputChange(i, "enquiries", e.target.value)
//                             }
//                             onKeyPress={handleKeyPress}
//                             max={999}
//                             min="0"
//                             placeholder="0"
//                           />
//                         </td>
//                         <td className="py-2 px-4">
//                           <input
//                             type="number"
//                             className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                             value={
//                               target.target.testDrives === 0
//                                 ? ""
//                                 : target.target.testDrives
//                             }
//                             onChange={(e) =>
//                               handleInputChange(i, "testDrives", e.target.value)
//                             }
//                             onKeyPress={handleKeyPress}
//                             max={999}
//                             min="0"
//                             placeholder="0"
//                           />
//                         </td>
//                         <td className="py-2 px-4">
//                           <input
//                             type="number"
//                             className="w-full h-8 rounded-xl border border-gray-300 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent"
//                             value={
//                               target.target.orders === 0
//                                 ? ""
//                                 : target.target.orders
//                             }
//                             onChange={(e) =>
//                               handleInputChange(i, "orders", e.target.value)
//                             }
//                             onKeyPress={handleKeyPress}
//                             max={999}
//                             min="0"
//                             placeholder="0"
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
//               {/* Left: Info */}
//               <div className="text-xs text-gray-600">
//                 {filteredTeam.length > 0 ? (
//                   <>
//                     Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//                     {Math.min(currentPage * itemsPerPage, filteredTeam.length)}{" "}
//                     of {filteredTeam.length} entries
//                   </>
//                 ) : (
//                   "Showing 0 entries"
//                 )}
//               </div>

//               {/* Right: Pagination */}
//               <div className="flex items-center gap-2">
//                 <nav>
//                   <ul className="flex items-center gap-1">
//                     <li>
//                       <button
//                         className={`px-3 py-2 rounded text-xs font-medium ${
//                           currentPage === 1
//                             ? "text-gray-400 cursor-not-allowed"
//                             : "text-gray-700 hover:bg-gray-100 cursor-pointer"
//                         }`}
//                         onClick={previousPage}
//                         disabled={currentPage === 1}
//                       >
//                         Previous
//                       </button>
//                     </li>

//                     {visiblePages.map((page) => (
//                       <li key={page}>
//                         <button
//                           className={`px-3 py-2 rounded text-xs font-medium ${
//                             page === currentPage
//                               ? "bg-[#222fb9] text-white"
//                               : "text-gray-700 hover:bg-gray-100"
//                           }`}
//                           onClick={() => goToPage(page)}
//                         >
//                           {page}
//                         </button>
//                       </li>
//                     ))}

//                     <li>
//                       <button
//                         className={`px-3 py-2 rounded text-xs font-medium ${
//                           currentPage === totalPages
//                             ? "text-gray-400 cursor-not-allowed"
//                             : "text-gray-700 hover:bg-gray-100 cursor-pointer"
//                         }`}
//                         onClick={nextPage}
//                         disabled={currentPage === totalPages}
//                       >
//                         Next
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h5 className="text-lg font-semibold text-center w-full">
//                 Add New Target
//               </h5>
//               <button
//                 type="button"
//                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
//                 onClick={closeModal}
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Enquiries */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="enquiries"
//                     className="block text-xs font-medium text-gray-700"
//                   >
//                     Enquiries <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="enquiries"
//                     className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
//                       formTouched.enquiries && formErrors.enquiries
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     type="number"
//                     value={formData.enquiries}
//                     onChange={(e) =>
//                       handleFormChange("enquiries", e.target.value)
//                     }
//                     onKeyPress={handleKeyPress}
//                     placeholder="Enquiries"
//                   />
//                   {formTouched.enquiries && formErrors.enquiries && (
//                     <div className="text-red-500 text-xs">
//                       {formErrors.enquiries}
//                     </div>
//                   )}
//                 </div>

//                 {/* Test Drives */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="testDrives"
//                     className="block text-xs font-medium text-gray-700"
//                   >
//                     Test Drives <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="testDrives"
//                     className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
//                       formTouched.testDrives && formErrors.testDrives
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     type="number"
//                     value={formData.testDrives}
//                     onChange={(e) =>
//                       handleFormChange("testDrives", e.target.value)
//                     }
//                     onKeyPress={handleKeyPress}
//                     placeholder="Test Drives"
//                   />
//                   {formTouched.testDrives && formErrors.testDrives && (
//                     <div className="text-red-500 text-xs">
//                       {formErrors.testDrives}
//                     </div>
//                   )}
//                 </div>

//                 {/* Orders */}
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="orders"
//                     className="block text-xs font-medium text-gray-700"
//                   >
//                     Orders <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="orders"
//                     className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
//                       formTouched.orders && formErrors.orders
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     type="number"
//                     value={formData.orders}
//                     onChange={(e) => handleFormChange("orders", e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder="Orders"
//                   />
//                   {formTouched.orders && formErrors.orders && (
//                     <div className="text-red-500 text-xs">
//                       {formErrors.orders}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
//               {isEditMode ? (
//                 <button
//                   type="button"
//                   className="px-4 py-2 text-[#222fb9] border border-[#222fb9] rounded-lg hover:bg-[#222fb9] hover:text-white transition-colors duration-200 text-xs"
//                   onClick={onUpdate}
//                 >
//                   Edit
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   className="px-4 py-2 text-[#222fb9] border border-[#222fb9] rounded-lg hover:bg-[#222fb9] hover:text-white transition-colors duration-200 text-xs"
//                   onClick={onSave}
//                 >
//                   Save
//                 </button>
//               )}
//               <button
//                 type="button"
//                 className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-xs"
//                 onClick={closeModal}
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

// export default MainSetTarget;
import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import TargetsTable from "./TargetsTable";
import PaginationSection from "./PaginationSection";
import TargetModal from "./TargetModal";
import FilterSection from "./FilterSection";
const MainSetTarget = ({ onLogout }) => {
  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [targetList, setTargetList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRange, setSelectedRange] = useState("MTD");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    enquiries: "",
    testDrives: "",
    orders: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formTouched, setFormTouched] = useState({});

  const navigate = useNavigate();
  const isToastShowingRef = useRef(false);

  // Get token from localStorage
  const getAuthToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("access_token")
    );
  };

  // Centralized 401 handler
  const handleUnauthorized = () => {
    if (isToastShowingRef.current) return true;

    isToastShowingRef.current = true;
    toast.error("Session expired. Please login again.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      onClose: () => {
        isToastShowingRef.current = false;
      },
    });

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      sessionStorage.clear();
      window.location.href = "/login";
    }, 2000);

    return true;
  };

  // Check authentication with session handling
  const checkAuthAndNavigate = () => {
    const token = getAuthToken();
    if (!token) {
      toast.warning("Please login first!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
      return false;
    }
    return true;
  };

  useEffect(() => {
    checkAuthAndNavigate();
  }, [navigate]);

  // Fetch data on component mount and when range changes
  useEffect(() => {
    fetchTargetData();
  }, [selectedRange]);

  // Fetch target data with centralized 401 handling
  const fetchTargetData = async () => {
    if (!checkAuthAndNavigate()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.warning("Please login first!", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsLoading(false);
        return;
      }

      const apiUrl =
        selectedRange && selectedRange !== "ALL"
          ? `https://uat.smartassistapp.in/api/dealer/targets/all?range=${selectedRange}`
          : `https://uat.smartassistapp.in/api/dealer/targets/all`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        handleUnauthorized();
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      if (Array.isArray(res.data)) {
        const mappedData = res.data.map((entry) => {
          let targetInstance = {};

          if (Array.isArray(entry.targets) && entry.targets.length > 0) {
            const lastTarget = entry.targets[entry.targets.length - 1];
            targetInstance = {
              enquiries: lastTarget.enquiries || 0,
              testDrives: lastTarget.testDrives || 0,
              orders: lastTarget.orders || 0,
              original: {
                enquiries: lastTarget.enquiries || 0,
                testDrives: lastTarget.testDrives || 0,
                orders: lastTarget.orders || 0,
              },
            };
          } else {
            targetInstance = {
              enquiries: 0,
              testDrives: 0,
              orders: 0,
              original: { enquiries: 0, testDrives: 0, orders: 0 },
            };
          }

          return {
            user: entry.user,
            target: targetInstance,
          };
        });

        setTargetList(mappedData);
      } else {
        setTargetList([]);
      }
    } catch (error) {
      if (error.message.includes("Network Error")) {
        // toast.error("📡 Please check your internet connection!", {
        //   autoClose: 3000,
        // });
      } else if (error.message.includes("401")) {
        // Already handled
      }
      setTargetList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered data based on search
  const filteredTeam = useMemo(() => {
    if (!searchTerm) return targetList;

    const term = searchTerm.toLowerCase().trim();
    const results = targetList.filter((entry) => {
      const user = entry.user || {};
      const name = (
        user.name ||
        user.Name ||
        `${user.fname || ""} ${user.lname || ""}`.trim() ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        ""
      ).toLowerCase();

      const email = (user.email || user.Email || "").toLowerCase();
      const nameMatch = name.includes(term);
      const emailMatch = email.includes(term);
      const enquiryMatch = String(entry.target?.enquiries || "").includes(term);
      const testDriveMatch = String(entry.target?.testDrives || "").includes(
        term,
      );
      const orderMatch = String(entry.target?.orders || "").includes(term);

      return (
        nameMatch || emailMatch || enquiryMatch || testDriveMatch || orderMatch
      );
    });

    return results;
  }, [targetList, searchTerm]);

  // Paginated data
  const paginatedTarget = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeam.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeam, currentPage, itemsPerPage]);

  // Total pages
  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage);

  // Visible page numbers
  const visiblePages = useMemo(() => {
    const pages = [];
    const groupSize = 3;
    const startGroup =
      Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const endGroup = Math.min(startGroup + groupSize - 1, totalPages);

    for (let i = startGroup; i <= endGroup; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Check if any changes were made
  const hasAnyChanges = () => {
    return targetList.some(
      (entry) =>
        entry.target.enquiries !== entry.target.original?.enquiries ||
        entry.target.testDrives !== entry.target.original?.testDrives ||
        entry.target.orders !== entry.target.original?.orders,
    );
  };

  // Input change handler
  const handleInputChange = (index, field, value) => {
    const paginatedItem = paginatedTarget[index];
    if (!paginatedItem) return;

    const actualIndex = targetList.findIndex(
      (item) =>
        item.user?.user_id === paginatedItem.user?.user_id ||
        item.user?.email === paginatedItem.user?.email,
    );

    if (actualIndex === -1) return;

    const currentValue = targetList[actualIndex].target[field];

    // Handle empty value
    if (value === "") {
      const newTargetList = [...targetList];
      newTargetList[actualIndex].target[field] = 0;
      setTargetList(newTargetList);
      return;
    }

    const digitsOnly = value.replace(/[^0-9]/g, "");
    if (digitsOnly === "") {
      const newTargetList = [...targetList];
      newTargetList[actualIndex].target[field] = 0;
      setTargetList(newTargetList);
      return;
    }

    // SPECIAL CASE - Allow backspacing from >3 digits to ≤3 digits
    if (currentValue > 999) {
      const numValue = parseInt(digitsOnly, 10);
      const newTargetList = [...targetList];
      newTargetList[actualIndex].target[field] = numValue;
      setTargetList(newTargetList);
      return;
    }

    // NORMAL CASE: For values that are already ≤ 999 or new entries
    if (digitsOnly.length > 3) return;

    const numValue = parseInt(digitsOnly, 10);
    if (numValue > 999) return;

    const newTargetList = [...targetList];
    newTargetList[actualIndex].target[field] = numValue;
    setTargetList(newTargetList);
  };

  const handleKeyPress = (e) => {
    if (["e", "E", "+", "-", "."].includes(e.key)) {
      e.preventDefault();
    }
  };

  const onItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const onSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const onSelectRange = (range) => {
    setSelectedRange(range);
    setCurrentPage(1);
  };

  const goToPage = (page) => setCurrentPage(page);
  const previousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Update all targets with centralized 401 handling
  const onEditAll = async () => {
    if (!checkAuthAndNavigate()) return;

    const updatedTargets = targetList
      .filter(
        (item) =>
          item.target.enquiries !== item.target.original?.enquiries ||
          item.target.testDrives !== item.target.original?.testDrives ||
          item.target.orders !== item.target.original?.orders,
      )
      .map((item) => ({
        user_id: item.user.user_id,
        enquiries: item.target.enquiries,
        testDrives: item.target.testDrives,
        orders: item.target.orders,
      }));

    if (updatedTargets.length === 0) {
      toast.info("No changes to update", {
        toastId: "no-changes",
        autoClose: 3000,
      });
      return;
    }

    try {
      const token = getAuthToken();
      const apiUrl = `https://uat.smartassistapp.in/api/dealer/targets/new?range=${selectedRange}`;

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTargets),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to update targets";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const successMessage = result.message || "Targets updated successfully!";

      const updatedTargetList = targetList.map((item) => ({
        ...item,
        target: {
          ...item.target,
          original: {
            enquiries: item.target.enquiries,
            testDrives: item.target.testDrives,
            orders: item.target.orders,
          },
        },
      }));

      setTargetList(updatedTargetList);

      toast.success(successMessage, {
        toastId: `targets-update-${Date.now()}`,
        autoClose: 3000,
        position: "top-right",
      });
    } catch (error) {
      if (error.message.includes("Network Error")) {
        // toast.error("📡 Please check your internet connection!", {
        //   autoClose: 3000,
        // });
      } else if (error.message.includes("401")) {
        // Already handled
      } else {
        toast.error(`❌ ${error.message || "Failed to update targets"}`, {
          autoClose: 4000,
        });
      }
    }
  };

  // Modal handlers with auth check
  const openModal = () => {
    if (!checkAuthAndNavigate()) return;
    setIsModalOpen(true);
    setIsEditMode(false);
    setFormData({ enquiries: "", testDrives: "", orders: "" });
    setFormTouched({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ enquiries: "", testDrives: "", orders: "" });
    setFormTouched({});
    setFormErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.enquiries) errors.enquiries = "Enquiries is required";
    if (!formData.testDrives) errors.testDrives = "Test drives is required";
    if (!formData.orders) errors.orders = "Order is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save target with centralized 401 handling
  const onSave = async () => {
    if (!checkAuthAndNavigate()) return;
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        "https://uat.smartassistapp.in/api/dealer/targets",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create target");
      }

      toast.success("Target created successfully!", { autoClose: 3000 });
      closeModal();
      fetchTargetData();
    } catch (error) {
      if (error.message.includes("Network Error")) {
        // toast.error("📡 Please check your internet connection!", {
        //   autoClose: 3000,
        // });
      } else if (error.message.includes("401")) {
        // Already handled
      } else {
        toast.error(`❌ ${error.message || "Failed to create target"}`, {
          autoClose: 4000,
        });
      }
    }
  };

  // Update target with centralized 401 handling
  const onUpdate = async () => {
    if (!checkAuthAndNavigate()) return;
    if (!validateForm()) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        "https://uat.smartassistapp.in/api/dealer/targets",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update target");
      }

      toast.success("Target updated successfully!", { autoClose: 3000 });
      closeModal();
      fetchTargetData();
    } catch (error) {
      if (error.message.includes("Network Error")) {
        // toast.error("📡 Please check your internet connection!", {
        //   autoClose: 3000,
        // });
      } else if (error.message.includes("401")) {
        // Already handled
      } else {
        toast.error(`❌ ${error.message || "Failed to update target"}`, {
          autoClose: 4000,
        });
      }
    }
  };

  return (
    <div className="container-fluid min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="content-section active">
        <div className="bg-white rounded-xl shadow-sm p-2 mb-2">
          <div className="mb-2">
            <FilterSection
              itemsPerPage={itemsPerPage}
              selectedRange={selectedRange}
              searchTerm={searchTerm}
              hasAnyChanges={hasAnyChanges()}
              targetListLength={targetList.length}
              onItemsPerPageChange={onItemsPerPageChange}
              onSelectRange={onSelectRange}
              onSearchChange={onSearchChange}
              onEditAll={onEditAll}
            />

            <TargetsTable
              isLoading={isLoading}
              paginatedTarget={paginatedTarget}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              handleInputChange={handleInputChange}
              handleKeyPress={handleKeyPress}
            />

            <PaginationSection
              currentPage={currentPage}
              totalPages={totalPages}
              visiblePages={visiblePages}
              filteredTeamLength={filteredTeam.length}
              itemsPerPage={itemsPerPage}
              previousPage={previousPage}
              nextPage={nextPage}
              goToPage={goToPage}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TargetModal
          isEditMode={isEditMode}
          formData={formData}
          formErrors={formErrors}
          formTouched={formTouched}
          handleFormChange={handleFormChange}
          handleKeyPress={handleKeyPress}
          onSave={onSave}
          onUpdate={onUpdate}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default MainSetTarget;
