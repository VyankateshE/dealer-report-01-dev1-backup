// // src/components/VariantList.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { masterService } from "../../services/masterService";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// const MainVehicleManagement = () => {
//   const [variants, setVariants] = useState([]);
//   const [filteredVariants, setFilteredVariants] = useState([]);
//   const [pagedVariants, setPagedVariants] = useState([]);
//   const [allModels, setAllModels] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // Commented out delete modal state
//   // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [vinTooLong, setVinTooLong] = useState(false);
//   const [variantTooLong, setVariantTooLong] = useState(false); // New state for variant length
//   const [aliasTooLong, setAliasTooLong] = useState(false); // New state for alias length
//   // Commented out delete state
//   // const [variantToDelete, setVariantToDelete] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   const [isFormSubmitted, setIsFormSubmitted] = useState(false);
//   const [originalFormData, setOriginalFormData] = useState(null);

//   // Add a ref to track the last toast time to prevent duplicates
//   const lastToastTimeRef = useRef(0);

//   // Form state
//   const [formData, setFormData] = useState({
//     model: "",
//     variant: "",
//     vin: "",
//     type: "",
//     identity: "",
//     YOM: "",
//   });

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [searchText, setSearchText] = useState("");
//   const [totalPages, setTotalPages] = useState(0);
//   const [pagesArray, setPagesArray] = useState([]);

//   // Edit state
//   const [singleVariantId, setSingleVariantId] = useState("");
//   const [singleVehicleId, setSingleVehicleId] = useState("");

//   const pageSizes = [10, 20, 50];

//   // Function to check if form has changed
//   const hasFormChanged = () => {
//     if (!originalFormData) return false;

//     return (
//       formData.model !== originalFormData.model ||
//       formData.variant !== originalFormData.variant ||
//       formData.vin !== originalFormData.vin ||
//       formData.type !== originalFormData.type ||
//       formData.identity !== originalFormData.identity ||
//       formData.YOM !== originalFormData.YOM
//     );
//   };

//   // Helper function to normalize type value
//   const normalizeTypeValue = (typeValue) => {
//     if (!typeValue) return "";

//     // Convert to lowercase for consistency with select options
//     const lowerType = typeValue.toLowerCase();

//     // Map to valid options
//     if (lowerType === "petrol") return "petrol";
//     if (lowerType === "diesel") return "diesel";
//     if (lowerType === "ev" || lowerType === "electric") return "EV";

//     // Return as is if it's already one of our options
//     if (["petrol", "diesel", "EV"].includes(lowerType)) return lowerType;

//     // Default to empty string if not recognized
//     return "";
//   };

//   // Helper function to format type for display
//   const formatTypeForDisplay = (typeValue) => {
//     if (!typeValue) return "-";

//     const lowerType = typeValue.toLowerCase();
//     if (lowerType === "petrol") return "PETROL";
//     if (lowerType === "diesel") return "DIESEL";
//     if (lowerType === "ev" || lowerType === "electric") return "EV";

//     return typeValue.toUpperCase();
//   };

//   // Helper function to check if error is session expired
//   const isSessionExpiredError = (error) => {
//     // Check status codes
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       return true;
//     }

//     // Check if 400 error contains session-related message
//     if (error.response?.status === 400) {
//       const errorData = error.response.data;
//       const errorMsg = (
//         errorData?.message ||
//         errorData?.error ||
//         ""
//       ).toLowerCase();

//       const sessionKeywords = [
//         "token",
//         "session",
//         "expired",
//         "unauthorized",
//         "jwt",
//         "auth",
//         "invalid",
//       ];
//       return sessionKeywords.some((keyword) => errorMsg.includes(keyword));
//     }

//     return false;
//   };

//   // Handle session expired
//   const handleSessionExpired = () => {
//     const errorMessage = "Session expired. Please login again.";

//     // Show toast only once
//     const now = Date.now();
//     if (now - lastToastTimeRef.current > 3000) {
//       toast.error(errorMessage);
//       lastToastTimeRef.current = now;
//     }

//     // Clear token and redirect after delay
//     localStorage.removeItem("token");
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   };

//   // Unified error handler to prevent duplicate toasts
//   const handleApiError = (error, context = "operation") => {
//     // console.error(`Error in ${context}:`, error);

//     // Check if it's a session expired error
//     if (isSessionExpiredError(error)) {
//       handleSessionExpired();
//       return true; // Indicate session expired was handled
//     }

//     // Don't show toast for network errors (already handled by checkInternetConnection)
//     if (
//       error.message?.includes("Network Error") ||
//       error.message?.includes("Failed to fetch")
//     ) {
//       // console.log("Network error - toast already shown");
//       return false;
//     }

//     // Handle other errors
//     if (error.response) {
//       const status = error.response.status;
//       const data = error.response.data;

//       switch (status) {
//         case 400:
//           toast.error(
//             `❌ Bad request - ${data?.message || "Please check your input"}`,
//           );
//           break;
//         case 404:
//           toast.error("🔍 API endpoint not found");
//           break;
//         case 500:
//           toast.error("⚡ Server error - please try again later");
//           break;
//         default:
//           toast.error(
//             `❌ API error ${status}: ${data?.message || "Unknown error"}`,
//           );
//       }
//     } else if (error.request) {
//       // console.log("Network error - toast already shown");
//     } else {
//       toast.error(`❌ Failed to perform ${context}`);
//     }

//     return false;
//   };

//   // Network Status Monitoring
//   useEffect(() => {
//     const handleOnline = () => {
//       // console.log("✅ Internet connection restored");
//       setIsOnline(true);
//       // toast.success("🌐 Internet connection restored!");
//     };

//     const handleOffline = () => {
//       // console.log("❌ Internet connection lost");
//       setIsOnline(false);
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         // toast.error("📡 Please check your internet connection!");
//         lastToastTimeRef.current = now;
//       }
//     };

//     // Check initial network status
//     if (!navigator.onLine) {
//       handleOffline();
//     }

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, [isOnline]);

//   // Check internet connection before API calls
//   const checkInternetConnection = () => {
//     if (!navigator.onLine) {
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         // toast.error("📡 Please check your internet connection!");
//         lastToastTimeRef.current = now;
//       }
//       return false;
//     }
//     return true;
//   };

//   useEffect(() => {
//     getVariant();
//   }, []);

//   useEffect(() => {
//     applyFilter();
//   }, [variants, searchText, pageSize, currentPage]);

//   const getVariant = async () => {
//     // Check internet connection first
//     if (!checkInternetConnection()) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // console.log("Fetching variants from API...");
//       const response = await masterService.getAllVariant();

//       // Handle different possible response structures
//       const responseData = response.data;
//       // console.log("API Response:", responseData);

//       let models = [];

//       if (responseData.data?.vehicles) {
//         models = responseData.data.vehicles;
//       } else if (responseData.vehicles) {
//         models = responseData.vehicles;
//       } else if (Array.isArray(responseData)) {
//         models = responseData;
//       } else if (responseData.data && Array.isArray(responseData.data)) {
//         models = responseData.data;
//       }

//       setAllModels(models);
//       // console.log("Processed models:", models);

//       // Create variant list from models
//       const variantList = models.flatMap((model) => {
//         // Handle different data structures
//         const vehicleId = model.vehicle_id || model.id || Math.random();
//         const vehicleName = model.vehicle_name || model.name || "Unknown Model";
//         const vin = model.VIN || model.vin || "N/A";
//         const type = model.type || "N/A";
//         const identity = model.identity || "N/A";
//         const variant = model.variant || "N/A";
//         const yom = model.YOM || model.yom || "N/A";

//         let variants = [];

//         // Handle asset_name field
//         if (model.asset_name) {
//           if (Array.isArray(model.asset_name)) {
//             variants = model.asset_name.map((v, index) => ({
//               variant_id: v.variant_id || `${vehicleId}-${index}`,
//               variant: variant || "N/A",
//               VIN: vin,
//               type: type,
//               identity: identity,
//               vehicle_name: vehicleName,
//               vehicle_id: vehicleId,
//               YOM: yom,
//             }));
//           } else if (typeof model.asset_name === "string") {
//             try {
//               // Try to parse as JSON
//               const parsed = JSON.parse(model.asset_name);
//               if (Array.isArray(parsed)) {
//                 variants = parsed.map((v, index) => ({
//                   variant_id: v.variant_id || `${vehicleId}-${index}`,
//                   variant: variant || "N/A",
//                   VIN: vin,
//                   type: type,
//                   identity: identity,
//                   vehicle_name: vehicleName,
//                   vehicle_id: vehicleId,
//                   YOM: yom,
//                 }));
//               } else {
//                 // Single variant object
//                 variants = [
//                   {
//                     variant_id: parsed.variant_id || vehicleId,
//                     variant:
//                       parsed.newVariant ||
//                       parsed.variant ||
//                       parsed.name ||
//                       model.asset_name,
//                     VIN: vin,
//                     type: type,
//                     identity: identity,
//                     vehicle_name: vehicleName,
//                     vehicle_id: vehicleId,
//                     YOM: yom,
//                   },
//                 ];
//               }
//             } catch (e) {
//               // Not JSON, treat as simple string
//               variants = [
//                 {
//                   variant_id: vehicleId,
//                   variant: model.asset_name,
//                   VIN: vin,
//                   type: type,
//                   identity: identity,
//                   vehicle_name: vehicleName,
//                   vehicle_id: vehicleId,
//                   YOM: yom,
//                 },
//               ];
//             }
//           }
//         }

//         // If no variants found, create a default one
//         if (variants.length === 0) {
//           variants = [
//             {
//               variant_id: vehicleId,
//               variant: variant,
//               VIN: vin,
//               type: type,
//               identity: identity,
//               vehicle_name: vehicleName,
//               vehicle_id: vehicleId,
//               YOM: yom,
//             },
//           ];
//         }

//         return variants;
//       });

//       // console.log("Final variant list:", variantList);
//       setVariants(variantList);
//     } catch (error) {
//       // Use unified error handler
//       if (!handleApiError(error, "fetching variants")) {
//         // Only show additional error if not already handled
//         // console.error("Error details:", error);
//       }

//       // Set empty arrays to prevent crashes
//       setVariants([]);
//       setAllModels([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilter = () => {
//     const filter = searchText.toLowerCase();
//     const filtered = variants.filter(
//       (v) =>
//         v.vehicle_name?.toLowerCase().includes(filter) ||
//         v.variant?.toLowerCase().includes(filter) ||
//         v.VIN?.toLowerCase().includes(filter) ||
//         v.type?.toLowerCase().includes(filter) ||
//         v.identity?.toLowerCase().includes(filter),
//     );

//     setFilteredVariants(filtered);
//     calculatePagination(filtered);
//   };

//   const calculatePagination = (data = filteredVariants) => {
//     const total = Math.ceil(data.length / pageSize);
//     setTotalPages(total);
//     setPagesArray(Array.from({ length: total }, (_, i) => i + 1));
//     updatePagedVariants(data);

//     // Reset to page 1 if current page is greater than total pages
//     if (currentPage > total && total > 0) {
//       setCurrentPage(1);
//     }
//   };

//   const updatePagedVariants = (data = filteredVariants) => {
//     const startIndex = (currentPage - 1) * pageSize;
//     const paged = data.slice(startIndex, startIndex + pageSize);
//     setPagedVariants(paged);
//   };

//   const changePageSize = (size) => {
//     setPageSize(size);
//     setCurrentPage(1);
//   };

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//   };

//   const openModal = (data = null) => {
//     // Check internet connection before opening modal
//     if (!checkInternetConnection()) {
//       return;
//     }

//     resetForm();
//     setIsModalOpen(true);
//     document.body.classList.add("overflow-hidden");

//     if (data) {
//       setIsEditMode(true);
//       setSingleVariantId(data.variant_id);
//       setSingleVehicleId(data.vehicle_id);

//       const newFormData = {
//         model: data.vehicle_id || "",
//         variant: data.variant || "",
//         vin: data.VIN || "",
//         type: normalizeTypeValue(data.type), // Use normalized type
//         identity: data.identity || "",
//         YOM: data.YOM || "",
//       };

//       setFormData(newFormData);
//       setOriginalFormData(newFormData);
//       // Check variant length when opening in edit mode
//       setVariantTooLong((data.variant || "").length > 16);
//       // Check alias length when opening in edit mode
//       setAliasTooLong((data.identity || "").length > 16);
//     } else {
//       setIsEditMode(false);
//       setOriginalFormData(null);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSingleVariantId("");
//     setSingleVehicleId("");
//     setOriginalFormData(null);
//     document.body.classList.remove("overflow-hidden");
//     resetForm();
//     setIsFormSubmitted(false);
//   };

//   const resetForm = () => {
//     setFormData({
//       model: "",
//       variant: "",
//       vin: "",
//       type: "",
//       identity: "",
//       YOM: "",
//     });
//     setVinTooLong(false);
//     setVariantTooLong(false); // Reset variant length error
//     setAliasTooLong(false); // Reset alias length error
//     setIsFormSubmitted(false);
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (field === "vin") {
//       setVinTooLong(value.length > 17);
//     }

//     if (field === "variant") {
//       setVariantTooLong(value.length > 16);
//     }

//     if (field === "identity") {
//       setAliasTooLong(value.length > 16);
//     }

//     if (field === "model" && value && isFormSubmitted) {
//       setIsFormSubmitted(false);
//     }
//   };

//   const validateForm = () => {
//     setIsFormSubmitted(true);

//     if (!isEditMode) {
//       const errors = [];

//       if (!formData.model) errors.push("Model Name");
//       if (!formData.variant) errors.push("Variant");
//       if (!formData.YOM) errors.push("YOM");
//       if (!formData.vin) errors.push("VIN");
//       if (!formData.type) errors.push("Type");
//       if (!formData.identity) errors.push("Alias");

//       if (errors.length > 0) {
//         toast.error(`❌ ${errors.join(", ")} are required`);
//         return false;
//       }
//     }

//     // In edit mode, don't validate required fields - allow partial updates
//     // Only validate length constraints

//     if (formData.vin && formData.vin.length > 17) {
//       toast.error("❌ VIN cannot exceed 17 characters");
//       return false;
//     }

//     if (formData.variant && formData.variant.length > 16) {
//       toast.error("❌ Variant cannot exceed 16 characters");
//       return false;
//     }

//     if (formData.identity && formData.identity.length > 16) {
//       toast.error("❌ Alias cannot exceed 16 characters");
//       return false;
//     }

//     return true;
//   };

//   const handleSave = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const selectedModel = allModels.find(
//         (m) => m.vehicle_id === formData.model,
//       );

//       const payload = {
//         vehicle_name: selectedModel ? selectedModel.vehicle_name : "",
//         asset_name: formData.variant,
//         VIN: formData.vin,
//         type: formData.type,
//         YOM: formData.YOM,
//         brand: selectedModel ? selectedModel.brand : "",
//         identity: formData.identity,
//       };

//       // console.log("Creating variant with payload:", payload);
//       await masterService.createVariant(payload);
//       toast.success(" Variant created successfully!");
//       getVariant();
//       closeModal();
//     } catch (error) {
//       // Use unified error handler
//       if (!handleApiError(error, "creating variant")) {
//         // Only show additional error if not already handled
//         const errorMsg =
//           error.response?.data?.error ||
//           error.response?.data?.message ||
//           "❌ Failed to create variant";
//         toast.error(errorMsg);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!checkInternetConnection()) return;
//     if (!hasFormChanged()) {
//       console.log("No changes detected, skipping update");
//       return;
//     }
//     if (!validateForm()) {
//       console.log("Form validation failed");
//       return;
//     }

//     console.log("Starting update process...");
//     setLoading(true);
//     try {
//       const selectedModel = allModels.find(
//         (m) => m.vehicle_id === formData.model,
//       );

//       const payload = {
//         vehicleId: singleVehicleId,
//         variant_id: singleVariantId,
//         vehicle_id: formData.model,
//         vehicle_name: selectedModel?.vehicle_name || "",
//         brand: selectedModel?.brand || "",
//         VIN: formData.vin,
//         identity: formData.identity,
//         asset_name: formData.variant,
//         type: formData.type,
//         YOM: formData.YOM,
//       };

//       console.log("Update payload:", payload);
//       console.log("Calling masterService.updateVariant...");

//       const response = await masterService.updateVariant(payload);
//       console.log("Update response:", response);

//       if (response && response.data) {
//         console.log("Update successful, response data:", response.data);
//         toast.success("Variant updated successfully!");
//       } else {
//         console.log("Update returned empty response");
//         toast.success("Variant updated successfully!");
//       }

//       getVariant();
//       closeModal();
//     } catch (error) {
//       console.error("Update error details:", error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//         console.error("Error response status:", error.response.status);
//       }
//       handleApiError(error, "updating variant");
//     } finally {
//       console.log("Update process completed");
//       setLoading(false);
//     }
//   };

//   const editVariant = (data) => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     openModal(data); // Use the openModal function instead of duplicating logic
//   };

//   return (
//     <div className="container-fluid pt-0 text-xs">
//       {/* Toast Container */}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="text-center text-white">
//             <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
//             <p className="mt-3 text-xs">Loading...</p>
//           </div>
//         </div>
//       )}

//       <div className="content-section active">
//         {/* Breadcrumb */}
//         <div className="pr-4 pl-4">
//           <nav className="flex" aria-label="Breadcrumb">
//             <ol className="flex items-center space-x-2 text-xs">
//               <li className="flex items-center">
//                 <a className="text-[#222fb9] cursor-auto">Dashboard</a>
//               </li>
//               <li className="flex items-center">
//                 <span className="text-gray-400 mx-2">@</span>
//                 <a className="text-gray-500 cursor-auto font-normal text-xs">
//                   Variant
//                 </a>
//               </li>
//             </ol>
//           </nav>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white shadow-custom rounded-xl p-4 mb-5 text-xs">
//           {/* Add Variant Button */}
//           <div className="flex items-center mb-2 justify-end">
//             <div className="w-full pb-2 flex justify-end">
//               <button
//                 onClick={() => openModal()}
//                 className="bg-[#222fb9] cursor-pointer hover:bg-[#1b258f] text-white text-xs rounded-lg shadow px-3 py-1 transition-colors"
//               >
//                 Add Variant
//               </button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row md:items-center mb-2 text-xs">
//             <div className="flex items-center pb-2 md:w-9/12">
//               <select
//                 className="w-15 border cursor-pointer border-gray-300 rounded h-8 px-2 mr-2 text-xs"
//                 value={pageSize}
//                 onChange={(e) => changePageSize(Number(e.target.value))}
//               >
//                 {pageSizes.map((size) => (
//                   <option key={size} value={size} className="text-xs">
//                     {size}
//                   </option>
//                 ))}
//               </select>
//               <span className="ml-2 text-xs">records per page</span>
//             </div>
//             <div className="flex justify-end items-center pb-2 rounded-lg md:w-3/12">
//               <input
//                 type="text"
//                 className="border border-gray-300 px-4 rounded-lg py-1 w-full max-w-xs text-xs"
//                 placeholder="Search"
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto border border-gray-200 rounded-lg text-xs">
//             <table className="w-full text-xs">
//               <thead className="bg-gray-50 text-xs">
//                 <tr className="border-b border-gray-200 text-xs">
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Sr No
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Model Name
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Variant Name
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     VIN
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Type
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     YOM
//                   </th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Alias
//                   </th>
//                   <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-xs">
//                 {filteredVariants.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="8"
//                       className="text-center py-8 text-gray-500 text-xs"
//                     >
//                       {loading ? (
//                         <div className="flex justify-center items-center text-xs">
//                           <div className="w-6 h-6 border-2 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-2"></div>
//                           Loading...
//                         </div>
//                       ) : (
//                         "No Variants Found"
//                       )}
//                     </td>
//                   </tr>
//                 ) : (
//                   pagedVariants.map((data, i) => (
//                     <tr
//                       key={`${data.vehicle_id}-${i}`}
//                       className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-xs"
//                     >
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {(currentPage - 1) * pageSize + i + 1}
//                       </td>
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {data.vehicle_name || "-"}
//                       </td>
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {data.variant || "-"}
//                       </td>
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs font-mono">
//                         {data.VIN || "-"}
//                       </td>
//                       {/* Type column - Fixed to remove font-medium */}
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {formatTypeForDisplay(data.type) || "-"}
//                       </td>
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {data.YOM || "-"}
//                       </td>
//                       <td className="text-left py-3 px-4 text-gray-800 text-xs">
//                         {data.identity || "-"}
//                       </td>
//                       <td className="text-center py-3 px-4 text-xs">
//                         <div className="flex justify-center space-x-1 text-xs">
//                           <button
//                             onClick={() => editVariant(data)}
//                             className="bg-[#222fb9] cursor-pointer hover:bg-[#1b258f] text-white p-1 rounded shadow transition-colors text-xs flex items-center justify-center w-6 h-6"
//                             title="Edit"
//                           >
//                             <span className="text-[10px]">✏️</span>
//                           </button>
//                           {/* Commented out delete button */}
//                           {/*
//                           <button
//                             onClick={() => confirmDelete(data)}
//                             className="bg-red-600 cursor-pointer hover:bg-red-700 text-white p-1 rounded shadow transition-colors text-xs flex items-center justify-center w-6 h-6"
//                             title="Delete"
//                           >
//                             <span className="text-[10px]">🗑️</span>
//                           </button>
//                           */}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination - Fixed to disable buttons when no records */}
//           <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs">
//             <div className="text-xs text-gray-600">
//               Showing{" "}
//               {filteredVariants.length === 0
//                 ? 0
//                 : (currentPage - 1) * pageSize + 1}{" "}
//               to {Math.min(currentPage * pageSize, filteredVariants.length)} of{" "}
//               {filteredVariants.length} entries
//             </div>

//             {/* Show pagination only if there are records */}
//             {filteredVariants.length > 0 ? (
//               <div className="flex gap-1 flex-wrap justify-center text-xs">
//                 <button
//                   className={`px-3 py-2 border rounded text-xs ${
//                     currentPage === 1 || filteredVariants.length === 0
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors cursor-pointer"
//                   }`}
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1 || filteredVariants.length === 0}
//                 >
//                   Previous
//                 </button>

//                 {pagesArray.map((page) => (
//                   <button
//                     key={page}
//                     className={`px-3 py-2 border rounded cursor-pointer text-xs ${
//                       currentPage === page
//                         ? "bg-[#222fb9] text-white border-[#222fb9]"
//                         : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
//                     }`}
//                     onClick={() => goToPage(page)}
//                   >
//                     {page}
//                   </button>
//                 ))}

//                 <button
//                   className={`px-3 py-2 border rounded text-xs ${
//                     currentPage === totalPages || filteredVariants.length === 0
//                       ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                       : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors cursor-pointer"
//                   }`}
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={
//                     currentPage === totalPages || filteredVariants.length === 0
//                   }
//                 >
//                   Next
//                 </button>
//               </div>
//             ) : (
//               <div className="flex gap-1 flex-wrap justify-center text-xs">
//                 <button
//                   className="px-3 py-2 border rounded bg-gray-100 text-gray-400 cursor-not-allowed text-xs"
//                   disabled
//                 >
//                   Previous
//                 </button>
//                 <button
//                   className="px-3 py-2 border rounded bg-gray-100 text-gray-400 cursor-not-allowed text-xs"
//                   disabled
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl text-xs">
//             <div className="border-b p-4 flex justify-between items-center">
//               <h5 className="text-xs font-semibold flex-1 text-center">
//                 {isEditMode ? "Edit Variant" : "Add Variant"}
//               </h5>
//               <button
//                 type="button"
//                 className="text-2xl bg-transparent border-none cursor-pointer"
//                 onClick={closeModal}
//               >
//                 <span>&times;</span>
//               </button>
//             </div>
//             <div className="p-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 {/* Model */}
//                 <div>
//                   <label
//                     htmlFor="model"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     Model Name
//                     {!isEditMode && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
//                   <select
//                     id="model"
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-[#222fb9] text-xs ${
//                       !isEditMode && !formData.model && isFormSubmitted
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                     value={formData.model}
//                     onChange={(e) => {
//                       handleInputChange("model", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     disabled={isEditMode}
//                     required={!isEditMode}
//                   >
//                     <option value="" disabled hidden className="text-xs">
//                       Select Model
//                     </option>
//                     {allModels.map((data) => (
//                       <option
//                         key={data.vehicle_id}
//                         value={data.vehicle_id}
//                         className="text-xs"
//                       >
//                         {data.vehicle_name}
//                       </option>
//                     ))}
//                   </select>
//                   {!isEditMode && !formData.model && isFormSubmitted && (
//                     <div className="text-red-500 text-xs mt-1">
//                       Model Name is required.
//                     </div>
//                   )}
//                 </div>

//                 {/* Variant - Updated: Only required in create mode, not edit mode */}
//                 <div>
//                   <label
//                     htmlFor="variant"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     Variant
//                     {!isEditMode && ( // Only show asterisk in create mode
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>

//                   <input
//                     id="variant"
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
//                       (!isEditMode && !formData.variant && isFormSubmitted) ||
//                       variantTooLong
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     type="text"
//                     value={formData.variant}
//                     onChange={(e) => {
//                       handleInputChange("variant", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     placeholder={isEditMode ? "Edit Variant" : "Add Variant"}
//                     maxLength={16}
//                     required={!isEditMode} // Only required in create mode
//                   />

//                   <div className="flex justify-between mt-1">
//                     {/* Error messages on left */}
//                     <div className="text-left">
//                       {!isEditMode && !formData.variant && isFormSubmitted && (
//                         <div className="text-red-500 text-xs">
//                           Variant is required.
//                         </div>
//                       )}
//                       {variantTooLong && (
//                         <div className="text-red-500 text-xs">
//                           Variant cannot exceed 16 characters
//                         </div>
//                       )}
//                     </div>
//                     {/* Character count on right */}
//                     <div className="text-xs text-gray-500">
//                       {formData.variant.length}/16 characters
//                     </div>
//                   </div>
//                 </div>

//                 {/* YOM */}
//                 <div>
//                   <label
//                     htmlFor="YOM"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     YOM
//                     {!isEditMode && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
//                   <input
//                     id="YOM"
//                     type="date"
//                     max={new Date().toISOString().split("T")[0]} // ✅ blocks future dates
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
//                       !isEditMode && !formData.YOM && isFormSubmitted
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     value={formData.YOM}
//                     onChange={(e) => {
//                       handleInputChange("YOM", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     required={!isEditMode}
//                   />

//                   {!isEditMode && !formData.YOM && isFormSubmitted && (
//                     <div className="text-red-500 text-xs mt-1">
//                       YOM is required.
//                     </div>
//                   )}
//                 </div>

//                 {/* VIN */}
//                 <div>
//                   <label
//                     htmlFor="vin"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     VIN
//                     {!isEditMode && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
//                   <input
//                     id="vin"
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
//                       !isEditMode && !formData.vin && isFormSubmitted
//                         ? "border-red-500"
//                         : vinTooLong
//                           ? "border-red-500"
//                           : "border-gray-300"
//                     }`}
//                     type="text"
//                     value={formData.vin}
//                     onChange={(e) => {
//                       handleInputChange("vin", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     placeholder="Add VIN"
//                     maxLength={17}
//                     required={!isEditMode}
//                   />

//                   <div className="flex justify-between mt-1">
//                     {/* Error messages on left */}
//                     <div className="text-left">
//                       {!isEditMode && !formData.vin && isFormSubmitted ? (
//                         <div className="text-red-500 text-xs">
//                           VIN is required.
//                         </div>
//                       ) : vinTooLong ? (
//                         <div className="text-red-500 text-xs">
//                           VIN cannot exceed 17 characters
//                         </div>
//                       ) : null}
//                     </div>
//                     {/* Character count on right */}
//                     <div className="text-xs text-gray-500">
//                       {formData.vin.length}/17 characters
//                     </div>
//                   </div>
//                 </div>

//                 {/* Type */}
//                 <div>
//                   <label
//                     htmlFor="type"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     Type
//                     {!isEditMode && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
//                   <select
//                     id="type"
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
//                       !isEditMode && !formData.type && isFormSubmitted
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     value={formData.type}
//                     onChange={(e) => {
//                       handleInputChange("type", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     required={!isEditMode}
//                   >
//                     <option value="" disabled hidden className="text-xs">
//                       Select Type
//                     </option>
//                     <option value="petrol" className="text-xs">
//                       PETROL
//                     </option>

//                     <option value="diesel" className="text-xs">
//                       DIESEL
//                     </option>
//                     <option value="EV" className="text-xs">
//                       EV
//                     </option>
//                   </select>
//                   {!isEditMode && !formData.type && isFormSubmitted && (
//                     <div className="text-red-500 text-xs mt-1">
//                       Type is required.
//                     </div>
//                   )}
//                 </div>

//                 {/* Identity (Alias) - Updated with character limit */}
//                 <div>
//                   <label
//                     htmlFor="identity"
//                     className="block mb-2 font-medium text-xs"
//                   >
//                     Alias
//                     {!isEditMode && (
//                       <span className="text-red-500 ml-1">*</span>
//                     )}
//                   </label>
//                   <input
//                     id="identity"
//                     className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
//                       (!isEditMode && !formData.identity && isFormSubmitted) ||
//                       aliasTooLong
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     }`}
//                     type="text"
//                     value={formData.identity}
//                     onChange={(e) => {
//                       handleInputChange("identity", e.target.value);
//                       if (e.target.value) {
//                         setIsFormSubmitted(false);
//                       }
//                     }}
//                     placeholder="Add Alias"
//                     maxLength={16}
//                     required={!isEditMode}
//                   />

//                   <div className="mt-1 text-right">
//                     {/* Character count always shown */}
//                     <div className="text-xs text-gray-500">
//                       {formData.identity.length}/16 characters
//                     </div>

//                     {/* Error messages shown below character count on right side */}
//                     {!isEditMode && !formData.identity && isFormSubmitted && (
//                       <div className="text-red-500 text-xs mt-1">
//                         Alias is required.
//                       </div>
//                     )}
//                     {aliasTooLong && (
//                       <div className="text-red-500 text-xs mt-1">
//                         Alias cannot exceed 16 characters
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t pt-4 mt-4 flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   className="border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
//                   onClick={closeModal}
//                 >
//                   Close
//                 </button>
//                 {isEditMode ? (
//                   <button
//                     type="button"
//                     className={`px-4 py-2 rounded text-xs ${
//                       hasFormChanged()
//                         ? "border border-[#222fb9] text-[#222fb9] hover:bg-[#222fb9] hover:text-white transition-colors cursor-pointer"
//                         : "border border-gray-300 text-gray-400 cursor-not-allowed"
//                     }`}
//                     onClick={handleUpdate}
//                     disabled={!hasFormChanged()}
//                   >
//                     Update
//                   </button>
//                 ) : (
//                   <button
//                     type="button"
//                     className="border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
//                     onClick={handleSave}
//                   >
//                     Save
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Commented out Delete Confirmation Modal */}
//       {/*
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-sm text-xs">
//             <div className="text-center p-6">
//               <h5 className="mb-4 text-xs font-semibold">
//                 Are you sure you want to delete this variant?
//               </h5>
//               <div className="flex justify-center space-x-3">
//                 <button
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-xs"
//                   onClick={cancelDelete}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1b258f] transition-colors text-xs"
//                   onClick={deleteVariant}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       */}
//     </div>
//   );
// };

// export default MainVehicleManagement;
import React, { useState, useEffect, useRef } from "react";
import { masterService } from "../../services/masterService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "./LoadingOverlay";
// import VariantModal from "./VariantList/VariantModal";
// import FilterSection from "./VariantList/FilterSection";
// import Pagination from "./VariantList/Pagination";

import VehicleFilterSection from "./VehicleFilterSection";
import VehicleTable from "./VehicleTable";
import Pagination from "./Pagination";
import VariantModal from "./VariantModal";

const MainVehicleManagement = () => {
  // State
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [pagedVariants, setPagedVariants] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [vinTooLong, setVinTooLong] = useState(false);
  const [variantTooLong, setVariantTooLong] = useState(false);
  const [aliasTooLong, setAliasTooLong] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [originalFormData, setOriginalFormData] = useState(null);
  const [formData, setFormData] = useState({
    model: "",
    variant: "",
    vin: "",
    type: "",
    identity: "",
    YOM: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [pagesArray, setPagesArray] = useState([]);
  const [singleVariantId, setSingleVariantId] = useState("");
  const [singleVehicleId, setSingleVehicleId] = useState("");

  const pageSizes = [10, 20, 50];
  const lastToastTimeRef = useRef(0);

  // Helper functions (keep them here)
  const normalizeTypeValue = (typeValue) => {
    if (!typeValue) return "";
    const lowerType = typeValue.toLowerCase();
    if (lowerType === "petrol") return "petrol";
    if (lowerType === "diesel") return "diesel";
    if (lowerType === "ev" || lowerType === "electric") return "EV";
    if (["petrol", "diesel", "EV"].includes(lowerType)) return lowerType;
    return "";
  };

  const formatTypeForDisplay = (typeValue) => {
    if (!typeValue) return "-";
    const lowerType = typeValue.toLowerCase();
    if (lowerType === "petrol") return "PETROL";
    if (lowerType === "diesel") return "DIESEL";
    if (lowerType === "ev" || lowerType === "electric") return "EV";
    return typeValue.toUpperCase();
  };

  const isSessionExpiredError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return true;
    }
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      const errorMsg = (
        errorData?.message ||
        errorData?.error ||
        ""
      ).toLowerCase();
      const sessionKeywords = [
        "token",
        "session",
        "expired",
        "unauthorized",
        "jwt",
        "auth",
        "invalid",
      ];
      return sessionKeywords.some((keyword) => errorMsg.includes(keyword));
    }
    return false;
  };

  const handleSessionExpired = () => {
    const errorMessage = "Session expired. Please login again.";
    const now = Date.now();
    if (now - lastToastTimeRef.current > 3000) {
      toast.error(errorMessage);
      lastToastTimeRef.current = now;
    }
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  // const handleApiError = (error, context = "operation") => {
  //   if (isSessionExpiredError(error)) {
  //     handleSessionExpired();
  //     return true;
  //   }
  //   if (
  //     error.message?.includes("Network Error") ||
  //     error.message?.includes("Failed to fetch")
  //   ) {
  //     return false;
  //   }
  //   if (error.response) {
  //     const status = error.response.status;
  //     const data = error.response.data;
  //     switch (status) {
  //       case 400:
  //         toast.error(
  //           `❌ Bad request - ${data?.message || "Please check your input"}`,
  //         );
  //         break;
  //       case 404:
  //         toast.error("🔍 API endpoint not found");
  //         break;
  //       case 500:
  //         toast.error("⚡ Server error - please try again later");
  //         break;
  //       default:
  //         toast.error(
  //           `❌ API error ${status}: ${data?.message || "Unknown error"}`,
  //         );
  //     }
  //   } else if (error.request) {
  //     // Network error already handled
  //   } else {
  //     toast.error(`❌ Failed to perform ${context}`);
  //   }
  //   return false;
  // };
  const handleApiError = (error, context = "operation") => {
    if (isSessionExpiredError(error)) {
      handleSessionExpired();
      return true;
    }

    if (
      error.message?.includes("Network Error") ||
      error.message?.includes("Failed to fetch")
    ) {
      return false;
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
        case 404:
        case 500:
          toast.error(data?.message || "Something went wrong");
          break;

        default:
          toast.error(data?.message || `API error ${status}`);
      }
    } else if (!error.request) {
      toast.error(`Failed to perform ${context}`);
    }

    return false;
  };

  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        // toast.error("📡 Please check your internet connection!");
        lastToastTimeRef.current = now;
      }
      return false;
    }
    return true;
  };

  const hasFormChanged = () => {
    if (!originalFormData) return false;
    return (
      formData.model !== originalFormData.model ||
      formData.variant !== originalFormData.variant ||
      formData.vin !== originalFormData.vin ||
      formData.type !== originalFormData.type ||
      formData.identity !== originalFormData.identity ||
      formData.YOM !== originalFormData.YOM
    );
  };

  // Network Status Monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        lastToastTimeRef.current = now;
      }
    };
    if (!navigator.onLine) {
      handleOffline();
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  useEffect(() => {
    getVariant();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [variants, searchText, pageSize, currentPage]);

  const getVariant = async () => {
    if (!checkInternetConnection()) {
      return;
    }
    setLoading(true);
    try {
      const response = await masterService.getAllVariant();
      const responseData = response.data;
      let models = [];
      if (responseData.data?.vehicles) {
        models = responseData.data.vehicles;
      } else if (responseData.vehicles) {
        models = responseData.vehicles;
      } else if (Array.isArray(responseData)) {
        models = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        models = responseData.data;
      }
      setAllModels(models);
      const variantList = models.flatMap((model) => {
        const vehicleId = model.vehicle_id || model.id || Math.random();
        const vehicleName = model.vehicle_name || model.name || "Unknown Model";
        const vin = model.VIN || model.vin || "N/A";
        const type = model.type || "N/A";
        const identity = model.identity || "N/A";
        const variant = model.variant || "N/A";
        const yom = model.YOM || model.yom || "N/A";
        let variants = [];
        if (model.asset_name) {
          if (Array.isArray(model.asset_name)) {
            variants = model.asset_name.map((v, index) => ({
              variant_id: v.variant_id || `${vehicleId}-${index}`,
              variant: variant || "N/A",
              VIN: vin,
              type: type,
              identity: identity,
              vehicle_name: vehicleName,
              vehicle_id: vehicleId,
              YOM: yom,
            }));
          } else if (typeof model.asset_name === "string") {
            try {
              const parsed = JSON.parse(model.asset_name);
              if (Array.isArray(parsed)) {
                variants = parsed.map((v, index) => ({
                  variant_id: v.variant_id || `${vehicleId}-${index}`,
                  variant: variant || "N/A",
                  VIN: vin,
                  type: type,
                  identity: identity,
                  vehicle_name: vehicleName,
                  vehicle_id: vehicleId,
                  YOM: yom,
                }));
              } else {
                variants = [
                  {
                    variant_id: parsed.variant_id || vehicleId,
                    variant:
                      parsed.newVariant ||
                      parsed.variant ||
                      parsed.name ||
                      model.asset_name,
                    VIN: vin,
                    type: type,
                    identity: identity,
                    vehicle_name: vehicleName,
                    vehicle_id: vehicleId,
                    YOM: yom,
                  },
                ];
              }
            } catch (e) {
              variants = [
                {
                  variant_id: vehicleId,
                  variant: model.asset_name,
                  VIN: vin,
                  type: type,
                  identity: identity,
                  vehicle_name: vehicleName,
                  vehicle_id: vehicleId,
                  YOM: yom,
                },
              ];
            }
          }
        }
        if (variants.length === 0) {
          variants = [
            {
              variant_id: vehicleId,
              variant: variant,
              VIN: vin,
              type: type,
              identity: identity,
              vehicle_name: vehicleName,
              vehicle_id: vehicleId,
              YOM: yom,
            },
          ];
        }
        return variants;
      });
      setVariants(variantList);
    } catch (error) {
      if (!handleApiError(error, "fetching variants")) {
        // Handle error
      }
      setVariants([]);
      setAllModels([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    const filter = searchText.toLowerCase();
    const filtered = variants.filter(
      (v) =>
        v.vehicle_name?.toLowerCase().includes(filter) ||
        v.variant?.toLowerCase().includes(filter) ||
        v.VIN?.toLowerCase().includes(filter) ||
        v.type?.toLowerCase().includes(filter) ||
        v.identity?.toLowerCase().includes(filter),
    );
    setFilteredVariants(filtered);
    calculatePagination(filtered);
  };

  const calculatePagination = (data = filteredVariants) => {
    const total = Math.ceil(data.length / pageSize);
    setTotalPages(total);
    setPagesArray(Array.from({ length: total }, (_, i) => i + 1));
    updatePagedVariants(data);
    if (currentPage > total && total > 0) {
      setCurrentPage(1);
    }
  };

  const updatePagedVariants = (data = filteredVariants) => {
    const startIndex = (currentPage - 1) * pageSize;
    const paged = data.slice(startIndex, startIndex + pageSize);
    setPagedVariants(paged);
  };

  const changePageSize = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const openModal = (data = null) => {
    if (!checkInternetConnection()) {
      return;
    }
    resetForm();
    setIsModalOpen(true);
    document.body.classList.add("overflow-hidden");
    if (data) {
      setIsEditMode(true);
      setSingleVariantId(data.variant_id);
      setSingleVehicleId(data.vehicle_id);
      const newFormData = {
        model: data.vehicle_id || "",
        variant: data.variant || "",
        vin: data.VIN || "",
        type: normalizeTypeValue(data.type),
        identity: data.identity || "",
        YOM: data.YOM || "",
      };
      setFormData(newFormData);
      setOriginalFormData(newFormData);
      setVariantTooLong((data.variant || "").length > 16);
      setAliasTooLong((data.identity || "").length > 16);
    } else {
      setIsEditMode(false);
      setOriginalFormData(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSingleVariantId("");
    setSingleVehicleId("");
    setOriginalFormData(null);
    document.body.classList.remove("overflow-hidden");
    resetForm();
    setIsFormSubmitted(false);
  };

  const resetForm = () => {
    setFormData({
      model: "",
      variant: "",
      vin: "",
      type: "",
      identity: "",
      YOM: "",
    });
    setVinTooLong(false);
    setVariantTooLong(false);
    setAliasTooLong(false);
    setIsFormSubmitted(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "vin") {
      setVinTooLong(value.length > 17);
    }
    if (field === "variant") {
      setVariantTooLong(value.length > 16);
    }
    if (field === "identity") {
      setAliasTooLong(value.length > 16);
    }
    if (field === "model" && value && isFormSubmitted) {
      setIsFormSubmitted(false);
    }
  };

  const validateForm = () => {
    setIsFormSubmitted(true);
    if (!isEditMode) {
      const errors = [];
      if (!formData.model) errors.push("Model Name");
      if (!formData.variant) errors.push("Variant");
      if (!formData.YOM) errors.push("YOM");
      if (!formData.vin) errors.push("VIN");
      if (!formData.type) errors.push("Type");
      if (!formData.identity) errors.push("Alias");
      if (errors.length > 0) {
        toast.error(`❌ ${errors.join(", ")} are required`);
        return false;
      }
    }
    if (formData.vin && formData.vin.length > 17) {
      toast.error("❌ VIN cannot exceed 17 characters");
      return false;
    }
    if (formData.variant && formData.variant.length > 16) {
      toast.error("❌ Variant cannot exceed 16 characters");
      return false;
    }
    if (formData.identity && formData.identity.length > 16) {
      toast.error("❌ Alias cannot exceed 16 characters");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!checkInternetConnection()) {
      return;
    }
    if (!validateForm()) return;
    setLoading(true);
    try {
      const selectedModel = allModels.find(
        (m) => m.vehicle_id === formData.model,
      );
      const payload = {
        vehicle_name: selectedModel ? selectedModel.vehicle_name : "",
        asset_name: formData.variant,
        VIN: formData.vin,
        type: formData.type,
        YOM: formData.YOM,
        brand: selectedModel ? selectedModel.brand : "",
        identity: formData.identity,
      };
      await masterService.createVariant(payload);
      toast.success(" Variant created successfully!");
      getVariant();
      closeModal();
    } catch (error) {
      if (!handleApiError(error, "creating variant")) {
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "❌ Failed to create variant";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!checkInternetConnection()) return;
    if (!hasFormChanged()) {
      console.log("No changes detected, skipping update");
      return;
    }
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    console.log("Starting update process...");
    setLoading(true);
    try {
      const selectedModel = allModels.find(
        (m) => m.vehicle_id === formData.model,
      );
      const payload = {
        vehicleId: singleVehicleId,
        variant_id: singleVariantId,
        vehicle_id: formData.model,
        vehicle_name: selectedModel?.vehicle_name || "",
        brand: selectedModel?.brand || "",
        VIN: formData.vin,
        identity: formData.identity,
        asset_name: formData.variant,
        type: formData.type,
        YOM: formData.YOM,
      };
      console.log("Update payload:", payload);
      console.log("Calling masterService.updateVariant...");
      const response = await masterService.updateVariant(payload);
      console.log("Update response:", response);
      if (response && response.data) {
        console.log("Update successful, response data:", response.data);
        toast.success("Variant updated successfully!");
      } else {
        console.log("Update returned empty response");
        toast.success("Variant updated successfully!");
      }
      getVariant();
      closeModal();
    } catch (error) {
      console.error("Update error details:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      handleApiError(error, "updating variant");
    } finally {
      console.log("Update process completed");
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pt-0 text-xs">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <LoadingOverlay loading={loading} />

      <div className="content-section active">
        <div className="pr-4 pl-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs">
              <li className="flex items-center">
                <a className="text-[#222fb9] cursor-auto">Dashboard</a>
              </li>
              <li className="flex items-center">
                <span className="text-gray-400 mx-2">@</span>
                <a className="text-gray-500 cursor-auto font-normal text-xs">
                  Variant
                </a>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow-custom rounded-xl p-4 mb-5 text-xs">
          <div className="flex items-center mb-2 justify-end">
            <div className="w-full pb-2 flex justify-end">
              <button
                onClick={() => openModal()}
                className="bg-[#222fb9] cursor-pointer hover:bg-[#1b258f] text-white text-xs rounded-lg shadow px-3 py-1 transition-colors"
              >
                Add Variant
              </button>
            </div>
          </div>

          <VehicleFilterSection
            pageSize={pageSize}
            changePageSize={changePageSize}
            searchText={searchText}
            setSearchText={setSearchText}
            pageSizes={pageSizes}
          />

          <VehicleTable
            pagedVariants={pagedVariants}
            filteredVariants={filteredVariants}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            editVariant={openModal}
            formatTypeForDisplay={formatTypeForDisplay}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pagesArray={pagesArray}
            goToPage={goToPage}
            filteredVariants={filteredVariants}
            pageSize={pageSize}
          />
        </div>
      </div>

      <VariantModal
        isModalOpen={isModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        allModels={allModels}
        isFormSubmitted={isFormSubmitted}
        vinTooLong={vinTooLong}
        variantTooLong={variantTooLong}
        aliasTooLong={aliasTooLong}
        closeModal={closeModal}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleUpdate={handleUpdate}
        hasFormChanged={hasFormChanged}
      />
    </div>
  );
};

export default MainVehicleManagement;
