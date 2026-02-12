// import { useNavigate } from "react-router-dom";
// import { enquiryService, authService } from "../../services/enquiryService";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { CloudCog } from "lucide-react";

// const MainEnquiriesResign = () => {
//   const navigate = useNavigate();

//   // Network Status State
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // State Management
//   const [allLead, setAllLead] = useState({ leads: [], pagination: {} });
//   const [allUser, setAllUser] = useState([]);
//   const [isReassignCardOpen, setIsReassignCardOpen] = useState(false);
//   const [isReassigning, setIsReassigning] = useState(false);
//   const [showDatePopup, setShowDatePopup] = useState(false);
//   const [isDateLoading, setIsDateLoading] = useState(false);
//   const [isResetting, setIsResetting] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [exportStatus, setExportStatus] = useState("");
//   const [dropdownOpenPopup, setDropdownOpenPopup] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
//   const [error, setError] = useState("");

//   // View Details Modal States
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
//   const [activeTab, setActiveTab] = useState("profile");

//   // Activity States
//   const [leadActivities, setLeadActivities] = useState({
//     upcoming: [],
//     completed: [],
//     overdue: [],
//   });
//   const [isLoadingActivities, setIsLoadingActivities] = useState(false);
//   const [showAddActivityModal, setShowAddActivityModal] = useState(false);
//   const [editingActivity, setEditingActivity] = useState(null);
//   const [newActivity, setNewActivity] = useState({
//     activity_type: "Call",
//     subject: "",
//     remarks: "",
//     activity_date: new Date().toISOString().split("T")[0],
//     status: "Scheduled",
//     priority: "Medium",
//   });

//   // Filter States
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageLimit, setPageLimit] = useState(10);
//   const [search, setSearch] = useState("");
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   // Filter Dropdown Data
//   const [leadSourceList, setLeadSourceList] = useState([]);
//   const [leadOwnerList, setLeadOwnerList] = useState([]);
//   const [statusList, setStatusList] = useState([]);
//   const [vehicleNameList, setVehicleNameList] = useState([]);
//   const [enquiryTypeList, setEnquiryTypeList] = useState([]);

//   // Selected Filters
//   const [selectedLeadSource, setSelectedLeadSource] = useState("");
//   const [selectedLeadOwner, setSelectedLeadOwner] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [selectedVehicleName, setSelectedVehicleName] = useState("");
//   const [selectedEnquiryType, setSelectedEnquiryType] = useState("");

//   // Date Filter States
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [tempStartDate, setTempStartDate] = useState("");
//   const [tempEndDate, setTempEndDate] = useState("");
//   const [selectedDateRangeMsg, setSelectedDateRangeMsg] = useState("");
//   const [dateFilterApplied, setDateFilterApplied] = useState(false);

//   // User Selection
//   const [selectedUserPopup, setSelectedUserPopup] = useState(null);
//   const [searchUserTermPopup, setSearchUserTermPopup] = useState("");
//   const [filteredUsersPopup, setFilteredUsersPopup] = useState([]);

//   const popupDropdownRef = useRef(null);
//   const tableContainerRef = useRef(null);

//   // Constants
//   const STATUS_COLORS = {
//     Lost: "bg-red-100 text-red-800",
//     "Follow Up": "bg-blue-100 text-blue-800",
//     Converted: "bg-green-100 text-green-800",
//     default: "bg-gray-100 text-gray-800",
//   };

//   // Static Enquiry Types (You can replace with API data if available)
//   const staticEnquiryTypes = [
//     "New Vehicle",
//     "Service",
//     "Parts",
//     "Finance",
//     "Insurance",
//     "General",
//   ];

//   // ==================== NETWORK STATUS MONITORING ====================

//   const lastToastTimeRef = useRef(0);

//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       if (!isOnline) {
//         // toast.success("🌐 Internet connection restored!");
//       }
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       if (isOnline) {
//         toast.error("📡 Please check your internet connection!");
//       }
//     };

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

//   const checkInternetConnection = () => {
//     if (!navigator.onLine) {
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         toast.error("📡 Please check your internet connection!");
//         lastToastTimeRef.current = now;
//       }
//       return false;
//     }
//     return true;
//   };

//   // ==================== AUTHENTICATION ERROR HANDLING ====================

//   const handleAuthError = (error, context = "") => {
//     toast.error("Session expired. Please login again.", {
//       position: "top-right",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });

//     if (authService && typeof authService.logout === "function") {
//       authService.logout();
//     }

//     const returnUrl = window.location.pathname + window.location.search;
//     localStorage.setItem("returnUrl", returnUrl);

//     setTimeout(() => {
//       navigate("/login", {
//         state: {
//           from: returnUrl,
//           message: "Your session has expired. Please login again.",
//         },
//       });
//     }, 3000);

//     return true;
//   };

//   const handleApiError = (error, context = "") => {
//     if (error.response?.status === 401) {
//       return handleAuthError(error, context);
//     }

//     if (error.response?.status === 403) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "You do not have permission to access this resource.";
//       toast.error(errorMessage);
//       setError(errorMessage);
//       return false;
//     }

//     if (
//       error.message?.includes("Network Error") ||
//       error.message?.includes("Failed to fetch")
//     ) {
//       const errorMessage = "Network error. Please check your connection.";
//       toast.error(errorMessage);
//       setError(errorMessage);
//       return false;
//     }

//     if (error.response?.status >= 500) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Server error. Please try again later.";
//       toast.error(errorMessage);
//       setError(errorMessage);
//       return false;
//     }

//     if (error.response?.status === 404) {
//       const errorMessage =
//         error.response?.data?.message || `${context} not found.`;
//       setError(errorMessage);
//       return false;
//     }

//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       `Failed to ${context}. Please try again.`;

//     if (error.response?.status !== 404) {
//       toast.error(errorMessage);
//     }

//     setError(errorMessage);
//     return false;
//   };

//   // ==================== ACTIVITY FUNCTIONS ====================

//   const fetchLeadActivities = async (leadId) => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       setIsLoadingActivities(true);
//       const response = await enquiryService.getLeadDetails(leadId);
//       const activitiesData = response.data.data;

//       const extractActivities = (category) => {
//         const tasks = category.tasks || [];
//         const events = category.events || [];
//         return [...tasks, ...events];
//       };

//       const categorized = {
//         upcoming: extractActivities(activitiesData.upcoming || {}),
//         completed: activitiesData.completed?.events || [],
//         overdue: extractActivities(activitiesData.overdue || {}),
//       };

//       setLeadActivities(categorized);
//     } catch (error) {
//       setLeadActivities({ upcoming: [], completed: [], overdue: [] });
//       if (error.response?.status !== 404) {
//         handleApiError(error, "load lead activities");
//       }
//     } finally {
//       setIsLoadingActivities(false);
//     }
//   };

//   const handleCreateActivity = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       const activityPayload = {
//         lead_id: selectedLeadDetails.lead_id,
//         activity_type: newActivity.activity_type,
//         subject: newActivity.subject,
//         remarks: newActivity.remarks,
//         activity_date: newActivity.activity_date,
//         status: newActivity.status,
//         priority: newActivity.priority,
//       };

//       const response = await enquiryService.createActivity(activityPayload);

//       if (response.data.success) {
//         // toast.success("Activity created successfully!");
//         await fetchLeadActivities(selectedLeadDetails.lead_id);
//         setShowAddActivityModal(false);
//         resetActivityForm();
//       } else {
//         // toast.error("Failed to create activity. Please try again.");
//       }
//     } catch (error) {
//       handleApiError(error, "create activity");
//     }
//   };

//   const handleUpdateActivity = async (activityId) => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       const activityPayload = {
//         activity_type: newActivity.activity_type,
//         subject: newActivity.subject,
//         remarks: newActivity.remarks,
//         activity_date: newActivity.activity_date,
//         status: newActivity.status,
//         priority: newActivity.priority,
//       };

//       const response = await enquiryService.updateActivity(
//         activityId,
//         activityPayload,
//       );

//       if (response.data.success) {
//         // toast.success("Activity updated successfully!");
//         await fetchLeadActivities(selectedLeadDetails.lead_id);
//         setShowAddActivityModal(false);
//         setEditingActivity(null);
//         resetActivityForm();
//       } else {
//         // toast.error("Failed to update activity. Please try again.");
//       }
//     } catch (error) {
//       handleApiError(error, "update activity");
//     }
//   };

//   const handleDeleteActivity = async (activityId) => {
//     if (!window.confirm("Are you sure you want to delete this activity?")) {
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       const response = await enquiryService.deleteActivity(activityId);

//       if (response.data.success) {
//         // toast.success("Activity deleted successfully!");
//         await fetchLeadActivities(selectedLeadDetails.lead_id);
//       } else {
//         // toast.error("Failed to delete activity. Please try again.");
//       }
//     } catch (error) {
//       handleApiError(error, "delete activity");
//     }
//   };

//   const resetActivityForm = () => {
//     setNewActivity({
//       activity_type: "Call",
//       subject: "",
//       remarks: "",
//       activity_date: new Date().toISOString().split("T")[0],
//       status: "Scheduled",
//       priority: "Medium",
//     });
//   };

//   // ==================== COMPONENT LIFECYCLE ====================

//   const hasInitialized = useRef(false);

//   useEffect(() => {
//     const checkAuthentication = () => {
//       if (!authService.isAuthenticated()) {
//         // toast.error("Please login to access this page");
//         setTimeout(() => navigate("/login"), 2000);
//         return false;
//       }
//       return true;
//     };

//     if (checkAuthentication() && !hasInitialized.current) {
//       hasInitialized.current = true;
//       initializeData();
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (authService.isAuthenticated() && hasInitialized.current) {
//       fetchLeads();
//     }
//   }, [
//     pageNumber,
//     pageLimit,
//     selectedLeadSource,
//     selectedLeadOwner,
//     selectedStatus,
//     selectedVehicleName,
//     selectedEnquiryType,
//     search,
//     startDate,
//     endDate,
//   ]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownOpenPopup &&
//         popupDropdownRef.current &&
//         !popupDropdownRef.current.contains(event.target)
//       ) {
//         setDropdownOpenPopup(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [dropdownOpenPopup]);

//   useEffect(() => {
//     if (
//       showDetailsModal &&
//       selectedLeadDetails &&
//       ["upcoming", "completed", "overdue"].includes(activeTab)
//     ) {
//       fetchLeadActivities(selectedLeadDetails.lead_id);
//     }
//   }, [activeTab, showDetailsModal, selectedLeadDetails]);

//   // ==================== DATA INITIALIZATION ====================

//   const initializeData = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       await Promise.all([fetchDropdownData(), getUser()]);
//     } catch (error) {
//       handleApiError(error, "initialize data");
//     }
//   };

//   // ==================== API FUNCTIONS ====================

//   const fetchDropdownData = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       setIsLoadingDropdowns(true);
//       setError("");

//       const response = await enquiryService.getDropdownData();
//       const data = response.data.data?.dropDownData;

//       if (data) {
//         setLeadSourceList(
//           data.all_sources?.map((s) => s.trim()).filter((s) => s !== "") || [],
//         );
//         setStatusList(
//           data.all_status?.map((s) => s.trim()).filter((s) => s !== "") || [],
//         );
//         setVehicleNameList(
//           data.all_vehicles?.map((v) => v.trim()).filter((v) => v !== "") || [],
//         );

//         // Add enquiry types from API if available, otherwise use static list
//         if (data.all_enquiry_types && Array.isArray(data.all_enquiry_types)) {
//           setEnquiryTypeList(
//             data.all_enquiry_types
//               .map((type) => type.trim())
//               .filter((type) => type !== ""),
//           );
//         } else {
//           setEnquiryTypeList(staticEnquiryTypes);
//         }

//         const users =
//           data.all_users?.map((user) => ({
//             user_id: user.id,
//             name: user.name,
//           })) || [];
//         setLeadOwnerList(users);
//       } else {
//         resetDropdownData();
//       }
//     } catch (error) {
//       handleApiError(error, "fetch dropdown data");
//       resetDropdownData();
//     } finally {
//       setIsLoadingDropdowns(false);
//     }
//   };

//   const getUser = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       setError("");
//       const response = await enquiryService.getAllDealerUser();
//       const data = response.data;

//       if (data?.data?.rows && Array.isArray(data.data.rows)) {
//         const users = data.data.rows.map((user) => ({
//           user_id: user.user_id,
//           name:
//             user.name ||
//             `${user.fname || ""} ${user.lname || ""}`.trim() ||
//             "Unknown User",
//         }));

//         setAllUser(users);
//         setFilteredUsersPopup(users);
//       } else {
//         resetUserData();
//       }
//     } catch (error) {
//       handleApiError(error, "fetch users");
//       resetUserData();
//     }
//   };

//   // ==================== FILTER & PAGINATION FUNCTIONS ====================

//   const fetchLeads = async (isResetCall = false) => {
//     if (!authService.isAuthenticated()) {
//       // toast.error("Please login to access this page");
//       setTimeout(() => navigate("/login"), 2000);
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsLoading(true);
//     setError("");

//     try {
//       const payload = isResetCall
//         ? {
//             page: pageNumber,
//             limit: pageLimit,
//           }
//         : {
//             page: pageNumber,
//             limit: pageLimit,
//             search: search || undefined,
//             source: selectedLeadSource || undefined,
//             user_id: selectedLeadOwner || undefined,
//             status: selectedStatus || undefined,
//             pmi: selectedVehicleName || undefined,
//             enquiry_type: selectedEnquiryType || undefined,
//             start_date: startDate || undefined,
//             end_date: endDate || undefined,
//           };

//       Object.keys(payload).forEach((key) => {
//         if (payload[key] === undefined || payload[key] === "") {
//           delete payload[key];
//         }
//       });

//       const response = await enquiryService.getAllLeadByDealer(payload);
//       const leadRes = response.data;

//       const leadsWithSelection = (leadRes.data?.leads || []).map((lead) => ({
//         ...lead,
//         selected: false,
//       }));

//       setAllLead({
//         leads: leadsWithSelection,
//         pagination: leadRes.data?.pagination || {},
//       });

//       setTotalRecords(leadRes.data?.pagination?.totalRecords || 0);
//       setTotalPages(
//         Math.ceil((leadRes.data?.pagination?.totalRecords || 0) / pageLimit),
//       );
//     } catch (error) {
//       handleApiError(error, "fetch leads");
//       resetLeadData();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onLimitChange = (e) => {
//     setPageLimit(Number(e.target.value));
//     setPageNumber(1);
//   };

//   const handleSearchInput = (e) => {
//     setSearch(e.target.value);
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === "Enter") {
//       setPageNumber(1);
//       fetchLeads();
//     }
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setPageNumber(page);
//     }
//   };

//   const getPaginationRange = () => {
//     const totalNumbers = 5;
//     const totalBlocks = totalNumbers + 2;

//     if (totalPages > totalBlocks) {
//       const startPage = Math.max(2, pageNumber - 1);
//       const endPage = Math.min(totalPages - 1, pageNumber + 1);
//       let pages = [1];

//       if (startPage > 2) {
//         pages.push("...");
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i);
//       }

//       if (endPage < totalPages - 1) {
//         pages.push("...");
//       }

//       pages.push(totalPages);
//       return pages;
//     }

//     return Array.from({ length: totalPages }, (_, i) => i + 1);
//   };

//   // ==================== VIEW DETAILS HANDLERS ====================

//   const handleViewDetails = async (lead) => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       setShowDetailsModal(true);
//       setActiveTab("profile");
//       setIsLoadingActivities(true);
//       setError("");

//       const response = await enquiryService.getLeadDetails(lead.lead_id);

//       if (response.status === 200 && response.data && response.data.data) {
//         const leadData = response.data.data.lead;
//         setSelectedLeadDetails(leadData);
//         await fetchLeadActivities(lead.lead_id);
//       } else {
//         setError("Failed to load lead details - Invalid response format");
//       }
//     } catch (error) {
//       handleApiError(error, "load lead details");
//     } finally {
//       setIsLoadingActivities(false);
//     }
//   };

//   // ==================== REASSIGN FUNCTIONS ====================

//   // const handleLeadOpen = (lead) => {
//   //   toast.info(
//   //     <div className="flex flex-col gap-2">
//   //       <span>
//   //         Do u want to change the status of this lead from lost to follow up?
//   //       </span>
//   //       <div className="flex gap-3">
//   //         <button
//   //           onClick={() => confirmReopenLead(lead)}
//   //           className="px-3 py-1 text-white rounded text-sm"
//   //           style={{ backgroundColor: "#222fb9" }}
//   //         >
//   //           Yes
//   //         </button>
//   //         <button
//   //           onClick={() => toast.dismiss()}
//   //           className="px-3 py-1 bg-red-600 text-white rounded text-sm"
//   //         >
//   //           No
//   //         </button>
//   //       </div>
//   //     </div>,
//   //     {
//   //       autoClose: false,
//   //       hideProgressBar: true,
//   //       closeOnClick: false,
//   //       draggable: false,
//   //       icon: false,
//   //     }
//   //   );
//   // };
//   const handleLeadOpen = (lead) => {
//     // Store the toast ID to dismiss it later
//     const toastId = toast.info(
//       <div className="flex flex-col gap-2">
//         <span>
//           Do you want to change the status of this lead from lost to follow up?
//         </span>
//         <div className="flex gap-3">
//           <button
//             onClick={() => {
//               toast.dismiss(toastId); // Dismiss the toast when Yes is clicked
//               confirmReopenLead(lead);
//             }}
//             className="px-3 py-1 text-white rounded text-sm"
//             style={{ backgroundColor: "#222fb9" }}
//           >
//             Yes
//           </button>
//           <button
//             onClick={() => toast.dismiss(toastId)} // Dismiss the toast when No is clicked
//             className="px-3 py-1 bg-red-600 text-white rounded text-sm"
//           >
//             No
//           </button>
//         </div>
//       </div>,
//       {
//         autoClose: false,
//         hideProgressBar: true,
//         closeOnClick: false,
//         draggable: false,
//         icon: false,
//       },
//     );
//   };
//   const confirmReopenLead = async (lead) => {
//     // toast.dismiss();

//     if (!checkInternetConnection()) {
//       return;
//     }

//     try {
//       const response = await enquiryService.updateLeadStatus(lead.lead_id, {
//         status: "Follow Up",
//       });

//       if (response.data && response.data.status === 200) {
//         toast.success(response.data.message || "Lead reopened successfully!");
//         fetchLeads();
//       } else if (response.data && response.data.success === true) {
//         toast.success(response.data.message || "Lead reopened successfully!");
//         fetchLeads();
//       } else if (response.status === 200) {
//         toast.success("Lead reopened successfully!");
//         fetchLeads();
//       } else {
//         toast.error(
//           response.data?.message || "Failed to reopen lead. Please try again.",
//         );
//       }
//     } catch (error) {
//       handleApiError(error, "reopen lead");
//     }
//   };

//   const handleSingleReassign = (lead) => {
//     setSelectedLeadDetails(lead);
//     setIsReassignCardOpen(true);
//   };

//   const openReassignCard = () => {
//     setIsReassignCardOpen(true);
//   };

//   const closeReassignCard = () => {
//     setIsReassignCardOpen(false);
//     setSelectedUserPopup(null);
//     setSelectedLeadDetails(null);
//   };

//   const toggleDropdownPopup = () => {
//     setDropdownOpenPopup(!dropdownOpenPopup);
//   };

//   const filterUsersPopup = () => {
//     const filtered = allUser.filter((user) =>
//       user.name.toLowerCase().includes(searchUserTermPopup.toLowerCase()),
//     );
//     setFilteredUsersPopup(filtered);
//   };

//   const selectUserPopup = (user) => {
//     setSelectedUserPopup(user);
//     setDropdownOpenPopup(false);
//     setSearchUserTermPopup("");
//   };

//   const reassignSubmit = async () => {
//     if (!selectedUserPopup) {
//       toast.error("Please select a user to reassign");
//       return;
//     }

//     const selectedLeads = allLead.leads.filter((lead) => lead.selected);
//     if (selectedLeads.length === 0) {
//       toast.error("Please select at least one lead to reassign");
//       return;
//     }

//     const validLeads = selectedLeads.filter(
//       (lead) => lead.lead_id && lead.lead_id !== "0",
//     );
//     if (validLeads.length === 0) {
//       toast.error("No valid leads selected.");
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsReassigning(true);
//     try {
//       const leadIdsArray = validLeads.map((lead) => lead.lead_id);

//       const payload = {
//         user_id: selectedUserPopup.user_id,
//         lead_ids: leadIdsArray,
//       };

//       const response = await enquiryService.reassignLeads(payload);

//       const responseData = response.data;

//       const isSuccess =
//         responseData.success === true ||
//         responseData.status === "success" ||
//         (responseData.message &&
//           responseData.message.toLowerCase().includes("success")) ||
//         response.status === 200;

//       if (isSuccess) {
//         toast.success("Leads reassigned successfully!");
//         closeReassignCard();
//         fetchLeads();

//         const updatedLeads = allLead.leads.map((lead) => ({
//           ...lead,
//           selected: false,
//         }));
//         setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
//       } else {
//         throw new Error(responseData.message || "Reassign failed");
//       }
//     } catch (error) {
//       if (error.message && error.message.includes("36")) {
//         toast.error("Error: Could not reassign leads. Please try again.");
//       } else {
//         handleApiError(error, "reassign leads");
//       }
//     } finally {
//       setIsReassigning(false);
//     }
//   };

//   const singleReassignSubmit = async () => {
//     if (!selectedUserPopup) {
//       toast.error("Please select a user to reassign");
//       return;
//     }

//     if (!selectedLeadDetails?.lead_id) {
//       toast.error("No lead selected for reassignment");
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsReassigning(true);
//     try {
//       const payload = {
//         user_id: selectedUserPopup.user_id,
//         lead_ids: selectedLeadDetails.lead_id,
//       };

//       const response = await enquiryService.reassignLeads(payload);

//       if (response.data && (response.data.success || response.status === 200)) {
//         toast.success("Lead reassigned successfully!");
//         closeReassignCard();
//         setShowDetailsModal(false);
//         fetchLeads();
//         setSelectedLeadDetails(null);
//       } else {
//         throw new Error(response.data?.message || "Failed to reassign lead");
//       }
//     } catch (error) {
//       if (error.message && error.message.includes("36")) {
//         toast.error("Error: Could not reassign lead. Please try again.");
//       } else {
//         handleApiError(error, "reassign single lead");
//       }
//     } finally {
//       setIsReassigning(false);
//     }
//   };

//   // ==================== EXPORT FUNCTIONS ====================

//   const exportToCSV = async () => {
//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsExporting(true);
//     setExportProgress(0);
//     setExportStatus("Preparing export...");

//     try {
//       setExportProgress(20);
//       setExportStatus("Fetching all lead data...");

//       const payload = {
//         search: search || undefined,
//         source: selectedLeadSource || undefined,
//         user_id: selectedLeadOwner || undefined,
//         status: selectedStatus || undefined,
//         pmi: selectedVehicleName || undefined,
//         enquiry_type: selectedEnquiryType || undefined,
//         start_date: startDate || undefined,
//         end_date: endDate || undefined,
//       };

//       Object.keys(payload).forEach((key) => {
//         if (payload[key] === undefined || payload[key] === "") {
//           delete payload[key];
//         }
//       });

//       const response = await enquiryService.getAllLeadByDealer({
//         ...payload,
//         limit: 10000,
//       });
//       const allLeads = response.data.data?.leads || [];

//       setExportProgress(60);
//       setExportStatus("Formatting data...");

//       const headers = [
//         "Name",
//         "Mobile",
//         "Email",
//         "Lead Owner",
//         "Source",
//         "PMI",
//         "Status",
//         "Created Date",
//         "Lead Age",
//         "Enquiry Type",
//       ];
//       const csvData = allLeads.map((lead) => [
//         lead.lead_name || "",
//         lead.mobile || "",
//         lead.email || "",
//         lead.lead_owner || "",
//         lead.lead_source || "",
//         lead.PMI || lead.vehicle_name || "",
//         lead.status || "",
//         formatDateOnly(lead.created_at),
//         lead.lead_age ? `${lead.lead_age} day(s)` : "",
//         lead.enquiry_type || "",
//       ]);

//       setExportProgress(80);
//       setExportStatus("Generating CSV file...");

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `leads_export_${new Date().toISOString().split("T")[0]}.csv`,
//       );
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setExportProgress(100);
//       setExportStatus("Export completed!");
//       // toast.success("Export completed successfully!");

//       setTimeout(() => {
//         setIsExporting(false);
//         setExportProgress(0);
//         setExportStatus("");
//       }, 2000);
//     } catch (error) {
//       handleApiError(error, "export data to CSV");
//       setIsExporting(false);
//       setExportProgress(0);
//       setExportStatus("");
//     }
//   };

//   const exportCurrentPageToCSV = async () => {
//     if (allLead.leads.length === 0) {
//       // toast.error("No data to export");
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsExporting(true);
//     setExportProgress(0);
//     setExportStatus("Preparing export...");

//     try {
//       setExportProgress(50);
//       setExportStatus("Formatting current page data...");

//       const headers = [
//         "Name",
//         "Mobile",
//         "Email",
//         "Lead Owner",
//         "Source",
//         "PMI",
//         "Status",
//         "Created Date",
//         "Lead Age",
//         "Enquiry Type",
//       ];
//       const csvData = allLead.leads.map((lead) => [
//         lead.lead_name || "",
//         lead.mobile || "",
//         lead.email || "",
//         lead.lead_owner || "",
//         lead.lead_source || "",
//         lead.PMI || lead.vehicle_name || "",
//         lead.status || "",
//         formatDateOnly(lead.created_at),
//         lead.lead_age ? `${lead.lead_age} day(s)` : "",
//         lead.enquiry_type || "",
//       ]);

//       setExportProgress(80);
//       setExportStatus("Generating CSV file...");

//       const csvContent = [
//         headers.join(","),
//         ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
//       ].join("\n");

//       const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//       const link = document.createElement("a");
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute(
//         "download",
//         `leads_current_page_${new Date().toISOString().split("T")[0]}.csv`,
//       );
//       link.style.visibility = "hidden";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       setExportProgress(100);
//       setExportStatus("Export completed!");
//       // toast.success("Export completed successfully!");

//       setTimeout(() => {
//         setIsExporting(false);
//         setExportProgress(0);
//         setExportStatus("");
//       }, 2000);
//     } catch (error) {
//       handleApiError(error, "export current page data");
//       setIsExporting(false);
//       setExportProgress(0);
//       setExportStatus("");
//     }
//   };

//   // ==================== DATE FILTER FUNCTIONS ====================

//   const openDatePopup = () => {
//     setTempStartDate(startDate);
//     setTempEndDate(endDate);
//     setShowDatePopup(true);
//   };

//   const closeDatePopup = () => {
//     setTempStartDate("");
//     setTempEndDate("");
//     setShowDatePopup(false);
//   };

//   const clearDateFilter = () => {
//     setStartDate("");
//     setEndDate("");
//     setTempStartDate("");
//     setTempEndDate("");
//     setSelectedDateRangeMsg("");
//     setDateFilterApplied(false);
//     setPageNumber(1);
//   };

//   const applyDateFilter = async () => {
//     if (!tempStartDate || !tempEndDate) {
//       // toast.error("Please select both start and end dates");
//       return;
//     }

//     const start = new Date(tempStartDate);
//     const end = new Date(tempEndDate);

//     if (end < start) {
//       // toast.error("End date cannot be before start date");
//       return;
//     }

//     if (!checkInternetConnection()) {
//       return;
//     }

//     setIsDateLoading(true);
//     try {
//       setStartDate(tempStartDate);
//       setEndDate(tempEndDate);
//       setSelectedDateRangeMsg(`Date Range: ${tempStartDate} to ${tempEndDate}`);
//       setDateFilterApplied(true);
//       setShowDatePopup(false);
//       setPageNumber(1);
//     } catch (error) {
//       handleApiError(error, "apply date filter");
//     } finally {
//       setIsDateLoading(false);
//     }
//   };

//   // ==================== UTILITY FUNCTIONS ====================

//   const formatDateOnly = (dateString) => {
//     if (!dateString || dateString === "N/A") return "-";
//     try {
//       return new Date(dateString).toISOString().split("T")[0];
//     } catch {
//       return "-";
//     }
//   };

//   const getStatusColor = (status) => {
//     return STATUS_COLORS[status] || STATUS_COLORS.default;
//   };

//   // ==================== RESET FUNCTIONS ====================

//   const resetDropdownData = () => {
//     setLeadSourceList([]);
//     setStatusList([]);
//     setVehicleNameList([]);
//     setLeadOwnerList([]);
//     setEnquiryTypeList(staticEnquiryTypes);
//   };

//   const resetUserData = () => {
//     setAllUser([]);
//     setFilteredUsersPopup([]);
//   };

//   const resetLeadData = () => {
//     setAllLead({ leads: [], pagination: {} });
//     setTotalRecords(0);
//     setTotalPages(1);
//   };

//   const resetAllFilters = () => {
//     setIsResetting(true);
//     setError("");

//     const updatedLeads = allLead.leads.map((lead) => ({
//       ...lead,
//       selected: false,
//     }));
//     setAllLead((prev) => ({ ...prev, leads: updatedLeads }));

//     setSelectedLeadSource("");
//     setSelectedLeadOwner("");
//     setSelectedStatus("");
//     setSelectedVehicleName("");
//     setSelectedEnquiryType("");
//     setSearch("");
//     setStartDate("");
//     setEndDate("");
//     setTempStartDate("");
//     setTempEndDate("");
//     setSelectedDateRangeMsg("");
//     setDateFilterApplied(false);
//     setShowDatePopup(false);
//     setPageNumber(1);

//     setTimeout(() => {
//       fetchLeads(true);
//       setIsResetting(false);
//     }, 100);
//   };

//   // ==================== SELECTION HELPERS ====================

//   const getAnyRowSelected = useCallback(() => {
//     return allLead?.leads?.some((lead) => lead.selected) || false;
//   }, [allLead.leads]);

//   const getIsAllSelected = useCallback(() => {
//     return (
//       allLead?.leads?.length > 0 && allLead.leads.every((lead) => lead.selected)
//     );
//   }, [allLead.leads]);

//   const getSelectedCount = useCallback(() => {
//     return allLead?.leads?.filter((lead) => lead.selected).length || 0;
//   }, [allLead.leads]);

//   const selectAllRows = (event) => {
//     const checked = event.target.checked;
//     const updatedLeads = allLead.leads.map((lead) => ({
//       ...lead,
//       selected: checked,
//     }));
//     setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
//   };

//   const toggleLeadSelection = (index) => {
//     const updatedLeads = [...allLead.leads];
//     updatedLeads[index] = {
//       ...updatedLeads[index],
//       selected: !updatedLeads[index].selected,
//     };
//     setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
//   };

//   // ==================== CALCULATION HELPERS ====================

//   const showingFrom = totalRecords === 0 ? 0 : (pageNumber - 1) * pageLimit + 1;
//   const showingTo = Math.min(pageNumber * pageLimit, totalRecords);

//   // ==================== RENDER FUNCTIONS ====================

//   const renderDateFilterButton = () => (
//     <button
//       onClick={openDatePopup}
//       className="border border-gray-300 rounded px-3 py-2 bg-white hover:border-[#222fb9] hover:bg-blue-50 transition-colors text-xs flex items-center justify-between w-full sm:w-auto min-w-[176px]"
//     >
//       <div className="flex items-center gap-2">
//         <i className="fa-solid fa-calendar text-gray-500 text-xs"></i>
//         {dateFilterApplied ? (
//           <span className="text-gray-800 text-xs whitespace-nowrap">
//             {startDate} - {endDate}
//           </span>
//         ) : (
//           <span className="text-gray-600 text-xs whitespace-nowrap">
//             Custom Filter
//           </span>
//         )}
//       </div>
//       <i className="fa-solid fa-chevron-down text-gray-500 text-xs ml-2"></i>
//     </button>
//   );

//   const renderDateFilterPopup = () => {
//     if (!showDatePopup) return null;

//     const isEndDateInvalid =
//       tempStartDate &&
//       tempEndDate &&
//       new Date(tempEndDate) < new Date(tempStartDate);

//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-xl relative w-96 shadow-lg text-xs">
//           <button
//             className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
//             onClick={closeDatePopup}
//           >
//             &times;
//           </button>

//           <h5 className="mb-4 font-bold text-xs">Select Date Range</h5>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
//               Start Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//               value={tempStartDate}
//               onChange={(e) => setTempStartDate(e.target.value)}
//               max={tempEndDate || undefined}
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
//               End Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//               value={tempEndDate}
//               onChange={(e) => setTempEndDate(e.target.value)}
//               min={tempStartDate || undefined}
//             />
//             {isEndDateInvalid && (
//               <p className="text-red-500 text-xs mt-1">
//                 ⚠️ End date cannot be before start date
//               </p>
//             )}
//           </div>

//           <div className="flex justify-end gap-3 text-xs">
//             <button
//               className="bg-white border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-gray-50 transition-colors text-xs"
//               onClick={closeDatePopup}
//             >
//               Cancel
//             </button>
//             <button
//               className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={applyDateFilter}
//               disabled={!tempStartDate || !tempEndDate || isEndDateInvalid}
//             >
//               Apply
//             </button>
//           </div>

//           {isDateLoading && (
//             <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-xl">
//               <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderLeadProfile = () => (
//     <div className="space-y-4 text-xs">
//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Name:
//           </div>
//           <div className="text-gray-800 font-semibold text-xs">
//             {selectedLeadDetails.lead_name ||
//               selectedLeadDetails.fname ||
//               "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Mobile:
//           </div>
//           <div className="text-gray-800 font-semibold text-xs">
//             {selectedLeadDetails.mobile || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Status:
//           </div>
//           <div className="text-gray-800 text-xs">
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                 selectedLeadDetails.status,
//               )}`}
//             >
//               {selectedLeadDetails.status || "N/A"}
//             </span>
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Email:
//           </div>
//           <div className="text-gray-800 text-xs break-all">
//             {selectedLeadDetails.email || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Dealer Name:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.dealer_name || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Dealer Code:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.dealer_code || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Brand:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.brand || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Model:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.PMI ||
//               selectedLeadDetails.vehicle_name ||
//               "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Enquiry Owner:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.lead_owner || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Owner Email:
//           </div>
//           <div className="text-gray-800 text-xs break-all">
//             {selectedLeadDetails.owner_email || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Source:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.lead_source || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Enquiry Type:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.enquiry_type || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Purchase Type:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.purchase_type || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Fuel Type:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.fuel_type || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Created Date:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {formatDateOnly(selectedLeadDetails.created_at) || "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Last Updated:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {formatDateOnly(selectedLeadDetails.updated_at) || "N/A"}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Enquiry Age:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.lead_age
//               ? `${selectedLeadDetails.lead_age} day(s)`
//               : "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             PMI:
//           </div>
//           <div className="text-gray-800 text-xs">
//             {selectedLeadDetails.PMI || "N/A"}
//           </div>
//         </div>
//       </div>

//       {selectedLeadDetails.description && (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="text-gray-600 font-medium text-xs mb-2">
//             Description:
//           </div>
//           <div className="text-gray-800 text-xs bg-gray-50 p-3 rounded">
//             {selectedLeadDetails.description}
//           </div>
//         </div>
//       )}
//     </div>
//   );
//   // const renderUpcomingActivities = () => (
//   //   <div className="pt-4">
//   //     <div className="row">
//   //       <div className="col-xl-12 col-xxl-12 col-lg-12">
//   //         {!leadActivities?.upcoming?.length ? (
//   //           <div className="alert alert-info text-center">
//   //             No upcoming event and tasks
//   //           </div>
//   //         ) : (
//   //           <div
//   //             id="DZ_W_TimeLine"
//   //             className="widget-timeline dz-scroll"
//   //             style={{ height: "270px", overflowY: "scroll" }}
//   //           >
//   //             <ul className="timeline">
//   //               {leadActivities.upcoming.map((data, index) => (
//   //                 <li key={index}>
//   //                   <div className="timeline-badge primary"></div>
//   //                   <a className="timeline-panel text-muted" href="#">
//   //                     <div className="row">
//   //                       <div className="col-3">
//   //                         <strong>Date:</strong> {data.due_date}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Subject:</strong> {data.subject}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Remarks:</strong> {data.remarks}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Status:</strong> {data.status}
//   //                       </div>
//   //                     </div>
//   //                   </a>
//   //                 </li>
//   //               ))}
//   //             </ul>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
//   const renderUpcomingActivities = () => (
//     <div className="pt-4">
//       <div className="row">
//         <div className="col-xl-12 col-xxl-12 col-lg-12">
//           {!leadActivities?.upcoming?.length ? (
//             <div className="alert alert-info text-center">
//               No upcoming event and tasks
//             </div>
//           ) : (
//             <div
//               id="DZ_W_TimeLine"
//               className="widget-timeline dz-scroll"
//               style={{ height: "270px", overflowY: "scroll" }}
//             >
//               <ul className="timeline">
//                 {leadActivities.upcoming.map((data, index) => (
//                   <li key={index}>
//                     <div className="timeline-badge primary"></div>
//                     <a className="timeline-panel text-muted" href="#">
//                       <div className="row">
//                         <div className="col-3">
//                           <strong>Date:</strong> {data.due_date}
//                         </div>
//                         <div className="col-3">
//                           <strong>Subject:</strong> {data.subject}
//                         </div>
//                         <div className="col-3">
//                           <strong>Remarks:</strong> {data.remarks}
//                         </div>
//                         <div className="col-3 d-flex align-items-center">
//                           <strong>Status:</strong>
//                           <span
//                             className="badge badge-primary ms-1"
//                             style={{
//                               backgroundColor: "#6eb9ff",
//                               color: "white",
//                               padding: "2px 6px",
//                               fontSize: "12px",
//                               width: "auto",
//                               display: "inline-block",
//                               marginLeft: "4px",
//                             }}
//                           >
//                             {data.status}
//                           </span>
//                         </div>
//                       </div>
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
//   const renderCompletedActivities = () => (
//     <div className="pt-4">
//       <div className="row">
//         <div className="col-xl-12 col-xxl-12 col-lg-12">
//           {!leadActivities?.completed?.length ? (
//             <div className="alert alert-info text-center">
//               No completed events and tasks
//             </div>
//           ) : (
//             <div
//               id="DZ_W_TimeLine"
//               className="widget-timeline dz-scroll"
//               style={{ height: "270px", overflowY: "scroll" }}
//             >
//               <ul className="timeline">
//                 {leadActivities.completed.map((event, index) => (
//                   <li key={index}>
//                     <div className="timeline-badge success"></div>
//                     <a className="timeline-panel text-muted" href="#">
//                       <div className="row">
//                         <div className="col-3">
//                           <strong>Date:</strong>{" "}
//                           {formatDate(event.start_date, "short")}
//                         </div>
//                         <div className="col-3">
//                           <strong>Start Time:</strong> {event.start_time}
//                         </div>
//                         <div className="col-3">
//                           <strong>End Time:</strong> {event.end_time}
//                         </div>
//                         <div className="col-3">
//                           <strong>Duration:</strong>{" "}
//                           {formatDuration(event.duration)}
//                         </div>
//                         <div className="col-3">
//                           <strong>Distance:</strong>{" "}
//                           {formatDistance(event.distance)}
//                         </div>
//                         <div className="col-3">
//                           <strong>Actual Start time:</strong>{" "}
//                           {event.actual_start_time}
//                         </div>
//                         <div className="col-3">
//                           <strong>Actual End time:</strong>{" "}
//                           {event.actual_end_time}
//                         </div>
//                         <div className="col-3">
//                           <strong>Subject:</strong> {event.subject}
//                         </div>
//                         <div className="col-3">
//                           <strong>Priority:</strong> {event.priority}
//                         </div>
//                         <div className="col-3 d-flex align-items-center">
//                           <strong>Status:</strong>
//                           <span
//                             className="badge badge-success ms-1"
//                             style={{
//                               backgroundColor: "#7ed99c",
//                               color: "white",
//                               padding: "2px 6px",
//                               fontSize: "12px",
//                               width: "auto",
//                               display: "inline-block",
//                               marginLeft: "4px",
//                             }}
//                           >
//                             {event.status}
//                           </span>
//                         </div>
//                         <div
//                           className="col-3"
//                           style={{ textOverflow: "ellipsis" }}
//                         >
//                           <strong>Remarks:</strong>{" "}
//                           {event.remarks || "No remarks"}
//                         </div>
//                       </div>
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // const renderCompletedActivities = () => (
//   //   <div className="pt-4">
//   //     <div className="row">
//   //       <div className="col-xl-12 col-xxl-12 col-lg-12">
//   //         {!leadActivities?.completed?.length ? (
//   //           <div className="alert alert-info text-center">
//   //             No completed events and tasks
//   //           </div>
//   //         ) : (
//   //           <div
//   //             id="DZ_W_TimeLine"
//   //             className="widget-timeline dz-scroll"
//   //             style={{ height: "270px", overflowY: "scroll" }}
//   //           >
//   //             <ul className="timeline">
//   //               {leadActivities.completed.map((event, index) => (
//   //                 <li key={index}>
//   //                   <div className="timeline-badge success"></div>
//   //                   <a className="timeline-panel text-muted" href="#">
//   //                     <div className="row">
//   //                       <div className="col-3">
//   //                         <strong>Date:</strong>{" "}
//   //                         {formatDate(event.start_date, "short")}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Start Time:</strong> {event.start_time}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>End Time:</strong> {event.end_time}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Duration:</strong>{" "}
//   //                         {formatDuration(event.duration)}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Distance:</strong>{" "}
//   //                         {formatDistance(event.distance)}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Actual Start time:</strong>{" "}
//   //                         {event.actual_start_time}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Actual End time:</strong>{" "}
//   //                         {event.actual_end_time}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Subject:</strong> {event.subject}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Priority:</strong> {event.priority}
//   //                       </div>
//   //                       <div className="col-3">
//   //                         <strong>Status:</strong>
//   //                         <span
//   //                           className="badge badge-success ms-1"
//   //                           style={{
//   //                             backgroundColor: "#7ed99c",
//   //                             color: "white",
//   //                             padding: "2px 6px",
//   //                             fontSize: "12px",
//   //                             width: "auto",
//   //                             display: "inline-block",
//   //                             marginLeft: "4px",
//   //                           }}
//   //                         >
//   //                           {event.status}
//   //                         </span>
//   //                       </div>
//   //                       <div
//   //                         className="col-3"
//   //                         style={{ textOverflow: "ellipsis" }}
//   //                       >
//   //                         <strong>Remarks:</strong>{" "}
//   //                         {event.remarks || "No remarks"}
//   //                       </div>
//   //                     </div>
//   //                   </a>
//   //                 </li>
//   //               ))}
//   //             </ul>
//   //           </div>
//   //         )}
//   //       </div>
//   //     </div>
//   //   </div>
//   // );

//   const renderOverdueActivities = () => (
//     <div className="pt-4">
//       <div className="row">
//         <div className="col-xl-12 col-xxl-12 col-lg-12">
//           {!leadActivities?.overdue?.length ? (
//             <div className="alert alert-info text-center">
//               No overdue event and tasks
//             </div>
//           ) : (
//             <div
//               id="DZ_W_TimeLine"
//               className="widget-timeline dz-scroll"
//               style={{ height: "270px", overflowY: "scroll" }}
//             >
//               <ul className="timeline">
//                 {leadActivities.overdue.map((task, index) => (
//                   <li key={index}>
//                     <div className="timeline-badge danger"></div>
//                     <a className="timeline-panel text-muted" href="#">
//                       <div className="row">
//                         <div className="col-3">
//                           <strong>Date:</strong> {task.due_date}
//                         </div>
//                         <div className="col-3">
//                           <strong>Subject:</strong> {task.subject}
//                         </div>
//                         <div className="col-3">
//                           <strong>Remarks:</strong> {task.remarks}
//                         </div>
//                         <div className="col-3 d-flex align-items-center">
//                           <strong>Status:</strong>
//                           <span
//                             className="badge badge-danger ms-1"
//                             style={{
//                               backgroundColor: "#e74c3c", // Using deeper red like in your image
//                               color: "white",
//                               padding: "2px 6px",
//                               fontSize: "12px",
//                               width: "auto",
//                               display: "inline-block",
//                               marginLeft: "4px",
//                             }}
//                           >
//                             {task.status}
//                           </span>
//                         </div>
//                       </div>
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // const renderUpcomingActivities = () => (
//   //   <div>
//   //     <div className="flex justify-between items-center mb-6">
//   //       <h3 className="text-lg font-semibold text-gray-800">
//   //         Upcoming Activities
//   //       </h3>
//   //     </div>

//   //     {isLoadingActivities ? (
//   //       <div className="text-center py-12">
//   //         <div className="w-8 h-8 border-3 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mx-auto mb-4"></div>
//   //         <p className="text-gray-500 text-sm">
//   //           Loading upcoming activities...
//   //         </p>
//   //       </div>
//   //     ) : leadActivities.upcoming.length > 0 ? (
//   //       <div className="space-y-4">
//   //         {leadActivities.upcoming.map((activity, index) => (
//   //           <div
//   //             key={activity.id || activity.activity_id || `upcoming-${index}`}
//   //             className="bg-white p-4 border rounded"
//   //           >
//   //             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//   //               <div>
//   //                 <span className="font-medium">Date:</span>{" "}
//   //                 {activity.due_date || "N/A"}
//   //               </div>
//   //               <div>
//   //                 <span className="font-medium">Subject:</span>{" "}
//   //                 {activity.subject || "N/A"}
//   //               </div>
//   //               <div>
//   //                 <span className="font-medium">Remarks:</span>{" "}
//   //                 {activity.remarks || "N/A"}
//   //               </div>
//   //               <div className="flex items-center">
//   //                 <span className="font-medium mr-2">Status:</span>
//   //                 <span
//   //                   className={`px-2 py-1 text-xs rounded ${
//   //                     activity.status === "Not Started" || !activity.status
//   //                       ? "bg-red-100 text-red-800"
//   //                       : "bg-green-100 text-green-800"
//   //                   }`}
//   //                 >
//   //                   {activity.status || "Not Started"}
//   //                 </span>
//   //               </div>
//   //             </div>
//   //           </div>
//   //         ))}
//   //       </div>
//   //     ) : (
//   //       <EmptyState message="No upcoming activities" />
//   //     )}
//   //   </div>
//   // );

//   // const renderCompletedActivities = () => (
//   //   <div>
//   //     <div className="flex justify-between items-center mb-6">
//   //       <h3 className="text-lg font-semibold text-gray-800">
//   //         Completed Activities
//   //       </h3>
//   //     </div>
//   //     {isLoadingActivities ? (
//   //       <div className="text-center py-12">
//   //         <div className="w-8 h-8 border-3 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mx-auto mb-4"></div>
//   //         <p className="text-gray-500 text-sm">
//   //           Loading completed activities...
//   //         </p>
//   //       </div>
//   //     ) : leadActivities.completed.length > 0 ? (
//   //       <div className="space-y-4">
//   //         {leadActivities.completed.map((activity, index) => (
//   //           <ActivityCard
//   //             key={activity.id || activity.activity_id || `completed-${index}`}
//   //             activity={activity}
//   //           />
//   //         ))}
//   //       </div>
//   //     ) : (
//   //       <EmptyState message="No completed activities" />
//   //     )}
//   //   </div>
//   // );

//   // const renderOverdueActivities = () => (
//   //   <div>
//   //     <div className="flex justify-between items-center mb-6">
//   //       <h3 className="text-lg font-semibold text-gray-800">
//   //         Overdue Activities
//   //       </h3>
//   //     </div>
//   //     {isLoadingActivities ? (
//   //       <div className="text-center py-12">
//   //         <div className="w-8 h-8 border-3 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mx-auto mb-4"></div>
//   //         <p className="text-gray-500 text-sm">Loading overdue activities...</p>
//   //       </div>
//   //     ) : leadActivities.overdue.length > 0 ? (
//   //       <div className="space-y-4">
//   //         {leadActivities.overdue.map((activity, index) => (
//   //           <ActivityCard
//   //             key={activity.id || activity.activity_id || `overdue-${index}`}
//   //             activity={activity}
//   //           />
//   //         ))}
//   //       </div>
//   //     ) : (
//   //       <EmptyState message="No overdue activities" />
//   //     )}
//   //   </div>
//   // );

//   const renderReassignTab = () => (
//     <div className="space-y-4 text-xs">
//       <div className="mb-4">
//         <h4 className="font-medium text-gray-600 mb-2 text-xs">User</h4>
//         <div className="relative w-full" ref={popupDropdownRef}>
//           <div
//             className="border border-gray-300 rounded px-3 py-2 bg-white flex justify-between items-center hover:border-[#222fb9] cursor-pointer transition-colors text-xs"
//             onClick={toggleDropdownPopup}
//           >
//             <span
//               className={
//                 selectedUserPopup
//                   ? "text-gray-900 text-xs"
//                   : "text-gray-500 text-xs"
//               }
//             >
//               {selectedUserPopup?.name || "Select User"}
//             </span>
//             <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
//           </div>

//           {dropdownOpenPopup && (
//             <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-50 text-xs">
//               <input
//                 type="text"
//                 className="w-full border-b border-gray-300 px-3 py-2 focus:outline-none text-xs"
//                 placeholder="Search user..."
//                 value={searchUserTermPopup}
//                 onChange={(e) => {
//                   setSearchUserTermPopup(e.target.value);
//                   filterUsersPopup();
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               />
//               <ul className="max-h-60 overflow-y-auto text-xs">
//                 {filteredUsersPopup.length > 0 ? (
//                   filteredUsersPopup.map((user, index) => (
//                     <li
//                       key={index}
//                       className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-xs"
//                       onClick={() => selectUserPopup(user)}
//                     >
//                       {user.name}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-3 py-2 text-gray-500 text-center text-xs">
//                     No user found
//                   </li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           className="bg-[#222fb9] text-white px-6 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs"
//           onClick={singleReassignSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );

//   const ActivityCard = ({ activity }) => {
//     console.log("hhhhhhhhhhhhhhhh", activity);
//     const activityType = activity.activity_type || activity.type || "Activity";
//     const subject = activity.subject || activity.title || "No Subject";
//     const remarks =
//       activity.remarks || activity.description || "No remarks provided";
//     const status = activity.status || "Not Started";
//     const priority = activity.priority || "Medium";
//     const activityDate =
//       activity.activity_date ||
//       activity.date ||
//       activity.created_at ||
//       activity.due_date;

//     return (
//       <div className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow bg-white">
//         <div className="flex justify-between items-start mb-3">
//           <div className="flex items-center gap-3">
//             <span className="text-sm font-semibold text-gray-800">
//               {activityType}
//             </span>
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 status === "Completed"
//                   ? "bg-green-100 text-green-800"
//                   : status === "Not Started"
//                     ? "bg-gray-100 text-gray-800"
//                     : status === "In Progress"
//                       ? "bg-blue-100 text-blue-800"
//                       : status === "Overdue"
//                         ? "bg-red-100 text-red-800"
//                         : "bg-yellow-100 text-yellow-800"
//               }`}
//             >
//               {status}
//             </span>
//           </div>
//           <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
//             {formatDateOnly(activityDate)}
//           </span>
//         </div>

//         <h4 className="font-semibold text-gray-900 mb-2 text-sm">{subject}</h4>
//         <p className="text-gray-700 mb-3 text-sm leading-relaxed">{remarks}</p>

//         <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//           <span
//             className={`text-xs px-3 py-1 rounded-full font-medium ${
//               priority === "High"
//                 ? "bg-red-100 text-red-800 border border-red-200"
//                 : priority === "Medium"
//                   ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
//                   : "bg-green-100 text-green-800 border border-green-200"
//             }`}
//           >
//             Priority: {priority}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   const EmptyState = ({ message }) => (
//     <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
//       <div className="text-gray-400 mb-4">
//         <svg
//           className="w-16 h-16 mx-auto"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       </div>
//       <p className="text-gray-500 text-sm font-medium">{message}</p>
//     </div>
//   );

//   const renderDetailsModal = () => {
//     if (!showDetailsModal) return null;

//     return (
//       <div
//         className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//         onClick={() => setShowDetailsModal(false)}
//       >
//         <div
//           className="bg-white p-6 rounded-xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg text-xs"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
//             onClick={() => setShowDetailsModal(false)}
//           >
//             &times;
//           </button>

//           {(!selectedLeadDetails || isLoadingActivities) && (
//             <div className="flex justify-center items-center py-12 flex-col">
//               <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-3"></div>
//               <span className="text-gray-600 mt-2">
//                 Loading lead details...
//               </span>

//               {error && (
//                 <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs max-w-md">
//                   <div className="flex items-center mb-2">
//                     <svg
//                       className="w-5 h-5 text-red-500 mr-2"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <span className="font-semibold text-red-700">
//                       Error Loading Details
//                     </span>
//                   </div>
//                   <p className="text-red-600 mb-3">{error}</p>
//                   <div className="flex gap-2">
//                     <button
//                       className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
//                       onClick={() => setShowDetailsModal(false)}
//                     >
//                       Close
//                     </button>
//                     <button
//                       className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
//                       onClick={() =>
//                         handleViewDetails(selectedLeadDetails || lead)
//                       }
//                     >
//                       Retry
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {selectedLeadDetails && !isLoadingActivities && (
//             <>
//               <h2 className="text-2xl font-bold mb-6 text-gray-800 text-xs">
//                 Enquiry Details
//               </h2>

//               <div className="border-b border-gray-200 mb-6 text-xs">
//                 <nav className="flex space-x-8 text-xs">
//                   {[
//                     "profile",
//                     "upcoming",
//                     "completed",
//                     "overdue",
//                     "reassign",
//                   ].map((tab) => (
//                     <button
//                       key={tab}
//                       className={`py-2 px-1 border-b-2 font-medium text-xs capitalize ${
//                         activeTab === tab
//                           ? "border-[#222fb9] text-[#222fb9]"
//                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                       }`}
//                       onClick={() => setActiveTab(tab)}
//                     >
//                       {tab === "reassign" ? "Reassign Enquiries" : tab}
//                     </button>
//                   ))}
//                 </nav>
//               </div>

//               <div className="min-h-[400px] text-xs">
//                 {activeTab === "profile" && renderLeadProfile()}
//                 {activeTab === "upcoming" && renderUpcomingActivities()}
//                 {activeTab === "completed" && renderCompletedActivities()}
//                 {activeTab === "overdue" && renderOverdueActivities()}
//                 {activeTab === "reassign" && renderReassignTab()}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // ==================== RENDER ====================

//   return (
//     <div className="container-fluid pt-0 text-xs">
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
//         style={{ fontSize: "14px" }}
//       />

//       <div className="content-section active">
//         <div className="page-titles px-4 flex justify-between items-center text-xs">
//           <ol className="breadcrumb mb-0 flex flex-row items-center text-xs">
//             <li className="breadcrumb-item">
//               <a className="cursor-auto text-[#222fb9] text-xs">Dashboard</a>
//             </li>
//             <li className="breadcrumb-item active">
//               <span className="text-gray-400 mx-2">@</span>
//               <a className="cursor-auto font-normal text-[#6e7d8b] text-xs">
//                 Enquiries
//               </a>
//             </li>
//           </ol>

//           <div className="flex items-center gap-4 text-xs">
//             <input
//               type="text"
//               className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 focus:outline-none focus:border-[#222fb9] text-xs"
//               placeholder="Search..."
//               value={search}
//               onChange={handleSearchInput}
//               onKeyPress={handleSearchKeyPress}
//             />
//             <div className="text-[#222fb9] font-medium text-right text-xs">
//               Total: {totalRecords}
//               {/* {selectedDateRangeMsg && (
//                 <div className="font-normal text-gray-600 mt-0.5 text-xs">
//                   {selectedDateRangeMsg}
//                 </div>
//               )} */}
//             </div>

//             <button
//               className="border border-gray-300 bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
//               onClick={resetAllFilters}
//               disabled={isResetting}
//             >
//               {isResetting ? "Resetting..." : "Reset"}
//             </button>
//           </div>
//         </div>

//         <div className="bg-white p-6 mb-5 shadow-lg rounded-xl border border-gray-200 text-xs">
//           <div className="row mb-4 text-xs">
//             <div className="col-12">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3 mb-3 flex-wrap text-xs">
//                 {/* Records per page - Stack on mobile */}
//                 <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
//                   <select
//                     className="border border-gray-300 rounded px-3 py-2 w-24 sm:w-24 focus:outline-none focus:border-[#222fb9] text-xs"
//                     value={pageLimit}
//                     onChange={onLimitChange}
//                   >
//                     <option value={10} className="text-xs">
//                       10
//                     </option>
//                     <option value={50} className="text-xs">
//                       50
//                     </option>
//                     <option value={100} className="text-xs">
//                       100
//                     </option>
//                   </select>
//                   <label className="mb-0 whitespace-nowrap text-gray-700 text-xs">
//                     records per page
//                   </label>
//                 </div>

//                 <div className="w-full sm:w-5"></div>

//                 {!getAnyRowSelected() ? (
//                   /* Filters - Full width on mobile */
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:flex-1 mb-3 sm:mb-0">
//                     <select
//                       className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={selectedLeadSource}
//                       onChange={(e) => setSelectedLeadSource(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         All Enquiry Sources
//                       </option>
//                       {leadSourceList.map((source, index) => (
//                         <option key={index} value={source} className="text-xs">
//                           {source}
//                         </option>
//                       ))}
//                       {leadSourceList.length === 0 && isLoadingDropdowns && (
//                         <option disabled className="text-xs">
//                           Loading sources...
//                         </option>
//                       )}
//                     </select>

//                     <select
//                       className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={selectedLeadOwner}
//                       onChange={(e) => setSelectedLeadOwner(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         All Enquiry Owners
//                       </option>
//                       {leadOwnerList.map((owner, index) => (
//                         <option
//                           key={index}
//                           value={owner.user_id}
//                           className="text-xs"
//                         >
//                           {owner.name}
//                         </option>
//                       ))}
//                       {leadOwnerList.length === 0 && isLoadingDropdowns && (
//                         <option disabled className="text-xs">
//                           Loading users...
//                         </option>
//                       )}
//                     </select>

//                     <select
//                       className="border border-gray-300 rounded px-3 py-2 w-full sm:w-32 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={selectedStatus}
//                       onChange={(e) => setSelectedStatus(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         All Status
//                       </option>
//                       {statusList.map((status, index) => (
//                         <option key={index} value={status} className="text-xs">
//                           {status}
//                         </option>
//                       ))}
//                       {statusList.length === 0 && isLoadingDropdowns && (
//                         <option disabled className="text-xs">
//                           Loading status...
//                         </option>
//                       )}
//                     </select>

//                     <select
//                       className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={selectedVehicleName}
//                       onChange={(e) => setSelectedVehicleName(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         All PMI's
//                       </option>
//                       {vehicleNameList.map((vehicle, index) => (
//                         <option key={index} value={vehicle} className="text-xs">
//                           {vehicle}
//                         </option>
//                       ))}
//                       {vehicleNameList.length === 0 && isLoadingDropdowns && (
//                         <option disabled className="text-xs">
//                           Loading vehicles...
//                         </option>
//                       )}
//                     </select>

//                     {/* Custom Filter: Enquiry Type */}
//                     <select
//                       className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={selectedEnquiryType}
//                       onChange={(e) => setSelectedEnquiryType(e.target.value)}
//                     >
//                       <option value="" className="text-xs">
//                         All Enquiry Types
//                       </option>
//                       {enquiryTypeList.map((type, index) => (
//                         <option key={index} value={type} className="text-xs">
//                           {type}
//                         </option>
//                       ))}
//                       {enquiryTypeList.length === 0 && isLoadingDropdowns && (
//                         <option disabled className="text-xs">
//                           Loading enquiry types...
//                         </option>
//                       )}
//                     </select>

//                     {/* Date Filter Button */}
//                     {renderDateFilterButton()}
//                   </div>
//                 ) : (
//                   /* Selected row actions - Full width on mobile */
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:flex-1 mb-3 sm:mb-0">
//                     <div className="flex items-center gap-3 px-4 py-2 rounded-lg w-full sm:w-auto text-xs">
//                       <label className="flex items-center gap-2 mb-0 font-medium text-xs">
//                         <input
//                           type="checkbox"
//                           checked={getIsAllSelected()}
//                           onChange={selectAllRows}
//                           className="w-4 h-4"
//                         />
//                         Select All
//                       </label>
//                       <span className="text-xs font-medium">
//                         {getSelectedCount()} selected
//                       </span>
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                       <button
//                         className="bg-[#222fb9] text-white px-5 py-2 rounded-lg hover:bg-[#1b26a0] transition-colors font-medium shadow-sm text-xs w-full sm:w-auto"
//                         onClick={openReassignCard}
//                       >
//                         Reassign
//                       </button>

//                       <button
//                         className="bg-[#222fb9] text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-xs w-full sm:w-auto"
//                         onClick={() => {
//                           const updatedLeads = allLead.leads.map((lead) => ({
//                             ...lead,
//                             selected: false,
//                           }));
//                           setAllLead((prev) => ({
//                             ...prev,
//                             leads: updatedLeads,
//                           }));
//                         }}
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Search and Export - Full width on mobile */}
//                 {/* <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto">
//                   {allLead.leads.length > 0 && (
//                     <button
//                       className="bg-[#222fb9] text-white px-3 cursor-pointer py-2 rounded hover:bg-[#222fb9] transition-colors text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
//                       onClick={exportCurrentPageToCSV}
//                       disabled={isExporting}
//                     >
//                       <i className="fas fa-file-export"></i>
//                       Export CSV ({allLead.leads.length})
//                     </button>
//                   )}
//                 </div> */}
//               </div>
//             </div>
//           </div>

//           {isExporting && (
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-xl relative w-96 shadow-lg text-xs border border-gray-200">
//                 <h5 className="mb-4 font-bold text-xs text-gray-800">
//                   Exporting Data
//                 </h5>

//                 <div className="mb-4">
//                   <div className="flex justify-between text-xs mb-2">
//                     <span className="text-gray-700 text-xs">Progress:</span>
//                     <span className="text-[#222fb9] font-medium text-xs">
//                       {exportProgress}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-100 rounded-full h-2">
//                     <div
//                       className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${exportProgress}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <div className="text-center text-gray-600 mb-4 text-xs">
//                   {exportStatus}
//                 </div>

//                 <div className="text-center text-gray-500 text-xs">
//                   Please wait while we fetch and prepare your data...
//                 </div>

//                 {exportProgress === 100 && (
//                   <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-xs">
//                     <p className="text-green-700 text-xs">
//                       Export completed successfully!
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Date Filter Popup */}
//           {renderDateFilterPopup()}

//           {isReassignCardOpen && (
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-xl relative w-96 shadow-lg text-xs">
//                 <h5 className="mb-4 font-bold text-xs">
//                   {selectedLeadDetails
//                     ? "Reassign Single Enquiry"
//                     : "Reassign Selected Enquiries"}
//                 </h5>

//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
//                     User
//                   </label>
//                   <div className="relative w-full" ref={popupDropdownRef}>
//                     <div
//                       className="border border-gray-300 rounded px-3 py-2 bg-white flex justify-between items-center hover:border-[#222fb9] cursor-pointer transition-colors text-xs"
//                       onClick={toggleDropdownPopup}
//                     >
//                       <span
//                         className={
//                           selectedUserPopup
//                             ? "text-gray-900 text-xs"
//                             : "text-gray-500 text-xs"
//                         }
//                       >
//                         {selectedUserPopup?.name || "Select User"}
//                       </span>
//                       <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
//                     </div>

//                     {dropdownOpenPopup && (
//                       <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-50 text-xs">
//                         <input
//                           type="text"
//                           className="w-full border-b border-gray-300 px-3 py-2 focus:outline-none text-xs"
//                           placeholder="Search user..."
//                           value={searchUserTermPopup}
//                           onChange={(e) => {
//                             setSearchUserTermPopup(e.target.value);
//                             filterUsersPopup();
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                         />
//                         <ul className="max-h-60 overflow-y-auto text-xs">
//                           {filteredUsersPopup.length > 0 ? (
//                             filteredUsersPopup.map((user, index) => (
//                               <li
//                                 key={index}
//                                 className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-xs"
//                                 onClick={() => selectUserPopup(user)}
//                               >
//                                 {user.name}
//                               </li>
//                             ))
//                           ) : (
//                             <li className="px-3 py-2 text-gray-500 text-center text-xs">
//                               No user found
//                             </li>
//                           )}
//                         </ul>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 text-xs">
//                   <button
//                     className="bg-white border-2 border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
//                     onClick={closeReassignCard}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1e28a0] transition-colors text-xs"
//                     onClick={
//                       selectedLeadDetails
//                         ? singleReassignSubmit
//                         : reassignSubmit
//                     }
//                   >
//                     Submit
//                   </button>
//                 </div>

//                 {isReassigning && (
//                   <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-xl">
//                     <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {renderDetailsModal()}

//           {showAddActivityModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white p-6 rounded-xl relative w-full max-w-md shadow-lg text-xs">
//                 <button
//                   className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
//                   onClick={() => {
//                     setShowAddActivityModal(false);
//                     setEditingActivity(null);
//                     resetActivityForm();
//                   }}
//                 >
//                   &times;
//                 </button>

//                 <h3 className="text-lg font-bold mb-4 text-xs">
//                   {editingActivity ? "Edit Activity" : "Add New Activity"}
//                 </h3>

//                 <div className="space-y-4 text-xs">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                       Activity Type
//                     </label>
//                     <select
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={newActivity.activity_type}
//                       onChange={(e) =>
//                         setNewActivity((prev) => ({
//                           ...prev,
//                           activity_type: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="Call">Call</option>
//                       <option value="Email">Email</option>
//                       <option value="Meeting">Meeting</option>
//                       <option value="Follow-up">Follow-up</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                       Subject
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={newActivity.subject}
//                       onChange={(e) =>
//                         setNewActivity((prev) => ({
//                           ...prev,
//                           subject: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter activity subject"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                       Remarks
//                     </label>
//                     <textarea
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={newActivity.remarks}
//                       onChange={(e) =>
//                         setNewActivity((prev) => ({
//                           ...prev,
//                           remarks: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter activity remarks"
//                       rows="3"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                       Activity Date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                       value={newActivity.activity_date}
//                       onChange={(e) =>
//                         setNewActivity((prev) => ({
//                           ...prev,
//                           activity_date: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4 text-xs">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                         Status
//                       </label>
//                       <select
//                         className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                         value={newActivity.status}
//                         onChange={(e) =>
//                           setNewActivity((prev) => ({
//                             ...prev,
//                             status: e.target.value,
//                           }))
//                         }
//                       >
//                         <option value="Scheduled">Scheduled</option>
//                         <option value="In Progress">In Progress</option>
//                         <option value="Completed">Completed</option>
//                         <option value="Cancelled">Cancelled</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">
//                         Priority
//                       </label>
//                       <select
//                         className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#222fb9] text-xs"
//                         value={newActivity.priority}
//                         onChange={(e) =>
//                           setNewActivity((prev) => ({
//                             ...prev,
//                             priority: e.target.value,
//                           }))
//                         }
//                       >
//                         <option value="Low">Low</option>
//                         <option value="Medium">Medium</option>
//                         <option value="High">High</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="flex justify-end gap-3 mt-6 text-xs">
//                     <button
//                       className="bg-white border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-gray-50 transition-colors text-xs"
//                       onClick={() => {
//                         setShowAddActivityModal(false);
//                         setEditingActivity(null);
//                         resetActivityForm();
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs"
//                       onClick={
//                         editingActivity
//                           ? () => handleUpdateActivity(editingActivity.id)
//                           : handleCreateActivity
//                       }
//                     >
//                       {editingActivity ? "Update" : "Create"} Activity
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* FIXED HEADER TABLE WITH SCROLLABLE BODY */}
//           <div
//             className="border border-gray-200 rounded-lg text-xs overflow-hidden"
//             ref={tableContainerRef}
//           >
//             <div className="overflow-x-auto">
//               <div
//                 className="relative"
//                 style={{
//                   maxHeight: pageLimit >= 50 ? "500px" : "auto",
//                   overflowY: pageLimit >= 50 ? "auto" : "visible",
//                 }}
//               >
//                 <table className="w-full text-xs">
//                   <thead className="bg-gray-50 text-xs sticky top-0 z-10">
//                     <tr className="border-b border-gray-200 text-xs">
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Sr No
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Enquiry Name
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Mobile No.
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Enquiry Owner
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Enquiry Source
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         PMI
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Status
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Created On
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Age
//                       </th>
//                       <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs bg-gray-50 sticky top-0">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-xs">
//                     {allLead.leads?.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan="10"
//                           className="text-center py-8 text-gray-500 text-xs"
//                         >
//                           {isLoading ? (
//                             <div className="flex justify-center items-center text-xs">
//                               <div className="w-6 h-6 border-2 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-2"></div>
//                               Loading...
//                             </div>
//                           ) : (
//                             "No Enquiry Found"
//                           )}
//                         </td>
//                       </tr>
//                     ) : (
//                       allLead.leads?.map((data, i) => (
//                         <tr
//                           key={i}
//                           className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-xs"
//                         >
//                           <td className="py-3 px-4 text-xs">
//                             <div className="flex items-center gap-2 text-xs">
//                               <input
//                                 type="checkbox"
//                                 checked={data.selected || false}
//                                 onChange={() => toggleLeadSelection(i)}
//                                 className="w-4 h-4 text-[#222fb9] focus:ring-[#222fb9]"
//                               />
//                               {(pageNumber - 1) * pageLimit + i + 1}
//                             </div>
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.lead_name || "-"}
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.mobile || "-"}
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.lead_owner || "-"}
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.lead_source || "-"}
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.PMI || data.vehicle_name || "-"}
//                           </td>
//                           <td className="py-3 px-4 text-xs">
//                             <span
//                               className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                                 data.status,
//                               )}`}
//                             >
//                               {data.status || "-"}
//                             </span>
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {formatDateOnly(data.created_at)}
//                           </td>
//                           <td className="py-3 px-4 text-gray-800 text-xs">
//                             {data.lead_age ? `${data.lead_age} day(s)` : "-"}
//                           </td>
//                           <td className="py-3 px-4 text-xs">
//                             <div className="relative inline-block text-left group text-xs">
//                               <button className="p-1 rounded hover:bg-gray-200 transition-colors text-xs">
//                                 <svg
//                                   width="20"
//                                   height="20"
//                                   viewBox="0 0 24 24"
//                                   fill="currentColor"
//                                   className="text-gray-600"
//                                 >
//                                   <circle cx="5" cy="12" r="2"></circle>
//                                   <circle cx="12" cy="12" r="2"></circle>
//                                   <circle cx="19" cy="12" r="2"></circle>
//                                 </svg>
//                               </button>
//                               <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-xs">
//                                 {data.status === "Lost" && (
//                                   <button
//                                     className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
//                                     onClick={() => handleLeadOpen(data)}
//                                   >
//                                     Lead Open
//                                   </button>
//                                 )}
//                                 <button
//                                   className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
//                                   onClick={() => handleViewDetails(data)}
//                                 >
//                                   View Details
//                                 </button>
//                                 <button
//                                   className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
//                                   onClick={() => handleSingleReassign(data)}
//                                 >
//                                   Reassign
//                                 </button>
//                               </div>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs">
//             {/* <button
//               className="bg-[#222fb9] text-white px-3 py-2 rounded cursor-pointer hover:bg-[#222fb9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs flex items-center gap-2"
//               onClick={exportToCSV}
//               disabled={isExporting || totalRecords === 0}
//             >
//               {isExporting ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Exporting...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-download"></i>
//                   Export All ({totalRecords})
//                 </>
//               )}
//             </button> */}

//             <div className="text-xs text-gray-600">
//               Showing {showingFrom} to {showingTo} of {totalRecords} entries
//             </div>

//             <div className="flex gap-1 flex-wrap justify-center text-xs">
//               <button
//                 className={`px-3 py-2 border rounded text-xs ${
//                   pageNumber === 1
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
//                 }`}
//                 onClick={() => goToPage(pageNumber - 1)}
//                 disabled={pageNumber === 1}
//               >
//                 Previous
//               </button>

//               {getPaginationRange().map((page, index) => (
//                 <button
//                   key={index}
//                   className={`px-3 py-2 border rounded text-xs ${
//                     pageNumber === page
//                       ? "bg-[#222fb9] text-white border-[#222fb9]"
//                       : page === "..."
//                         ? "bg-gray-100 text-gray-400 cursor-default"
//                         : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
//                   }`}
//                   onClick={() => typeof page === "number" && goToPage(page)}
//                   disabled={page === "..."}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 className={`px-3 py-2 border rounded text-xs ${
//                   pageNumber === totalPages
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "border-gray-300 text-gray-700 hover:bg-[#222fb9] hover:text-white hover:border-[#222fb9] transition-colors"
//                 }`}
//                 onClick={() => goToPage(pageNumber + 1)}
//                 disabled={pageNumber === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>

//         {isResetting && (
//           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg text-center text-xs">
//               <div className="w-12 h-12 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mx-auto mb-4"></div>
//               <p className="text-gray-700 text-xs">Resetting...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// export default MainEnquiriesResign;
// MainEnquiriesResign.js - COMPLETE VERSION

// THIS CODE IS REFRACRTORE CODE THERE IS SOME ISSUE HERE DUE TO WHICH VIEW DETAILS WHEN I CLICK THEN ITS NOT CLICKING WILL CHEKC
// IN THIS CODE THE CHANGES I HAVE DID IS PROFILE I HAVE USED TIMELIEN FEATURE AND NOT CARDS
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components
import { FilterSection } from "./components/FilterSection";
import { LeadTable } from "./components/LeadTable";
import { LeadDetailsModal } from "./components/LeadDetailsModal";
import { ReassignCard } from "./components/ReassignCard";
import { Pagination } from "./components/Pagination";
import { NetworkStatusMonitor } from "./components/NetworkStatusMonitor";
import { STATUS_COLORS } from "./components/constants";

// IMPORT SERVICES (CRITICAL!)
import { enquiryService, authService } from "../../services/enquiryService";

// Static Enquiry Types
const staticEnquiryTypes = [
  "New Vehicle",
  "Service",
  "Parts",
  "Finance",
  "Insurance",
  "General",
];

const MainEnquiriesResign = () => {
  const navigate = useNavigate();

  // Network Status State
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Main states
  const [allLead, setAllLead] = useState({ leads: [], pagination: {} });
  const [allUser, setAllUser] = useState([]);
  const [isReassignCardOpen, setIsReassignCardOpen] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [isDateLoading, setIsDateLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  const [dropdownOpenPopup, setDropdownOpenPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  const [error, setError] = useState("");

  // View Details Modal States
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Activity States
  const [leadActivities, setLeadActivities] = useState({
    upcoming: [],
    completed: [],
    overdue: [],
  });
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    activity_type: "Call",
    subject: "",
    remarks: "",
    activity_date: new Date().toISOString().split("T")[0],
    status: "Scheduled",
    priority: "Medium",
  });

  // Filter States
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter Dropdown Data
  const [leadSourceList, setLeadSourceList] = useState([]);
  const [leadOwnerList, setLeadOwnerList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [vehicleNameList, setVehicleNameList] = useState([]);
  const [enquiryTypeList, setEnquiryTypeList] = useState(staticEnquiryTypes);

  // Selected Filters
  const [selectedLeadSource, setSelectedLeadSource] = useState("");
  const [selectedLeadOwner, setSelectedLeadOwner] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [selectedEnquiryType, setSelectedEnquiryType] = useState("");

  // Date Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [selectedDateRangeMsg, setSelectedDateRangeMsg] = useState("");
  const [dateFilterApplied, setDateFilterApplied] = useState(false);

  // User Selection
  const [selectedUserPopup, setSelectedUserPopup] = useState(null);
  const [searchUserTermPopup, setSearchUserTermPopup] = useState("");
  const [filteredUsersPopup, setFilteredUsersPopup] = useState([]);

  const popupDropdownRef = useRef(null);
  const tableContainerRef = useRef(null);
  const hasInitialized = useRef(false);
  const lastToastTimeRef = useRef(0);

  // Network monitor
  const { checkInternetConnection } = NetworkStatusMonitor({
    isOnline,
    setIsOnline,
    lastToastTimeRef,
  });

  // ==================== AUTHENTICATION & ERROR HANDLING ====================

  const handleAuthError = (error, context = "") => {
    toast.error("Session expired. Please login again.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    if (authService && typeof authService.logout === "function") {
      authService.logout();
    }

    const returnUrl = window.location.pathname + window.location.search;
    localStorage.setItem("returnUrl", returnUrl);

    setTimeout(() => {
      navigate("/login", {
        state: {
          from: returnUrl,
          message: "Your session has expired. Please login again.",
        },
      });
    }, 3000);

    return true;
  };

  const handleApiError = (error, context = "") => {
    if (error.response?.status === 401) {
      return handleAuthError(error, context);
    }

    if (error.response?.status === 403) {
      const errorMessage =
        error.response?.data?.message ||
        "You do not have permission to access this resource.";
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    if (
      error.message?.includes("Network Error") ||
      error.message?.includes("Failed to fetch")
    ) {
      const errorMessage = "Network error. Please check your connection.";
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    if (error.response?.status >= 500) {
      const errorMessage =
        error.response?.data?.message ||
        "Server error. Please try again later.";
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    }

    if (error.response?.status === 404) {
      const errorMessage =
        error.response?.data?.message || `${context} not found.`;
      setError(errorMessage);
      return false;
    }

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to ${context}. Please try again.`;

    if (error.response?.status !== 404) {
      toast.error(errorMessage);
    }

    setError(errorMessage);
    return false;
  };

  // ==================== ACTIVITY FUNCTIONS ====================

  const fetchLeadActivities = async (leadId) => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      setIsLoadingActivities(true);
      const response = await enquiryService.getLeadDetails(leadId);
      const activitiesData = response.data.data;

      const extractActivities = (category) => {
        const tasks = category.tasks || [];
        const events = category.events || [];
        return [...tasks, ...events];
      };

      const categorized = {
        upcoming: extractActivities(activitiesData.upcoming || {}),
        completed: activitiesData.completed?.events || [],
        overdue: extractActivities(activitiesData.overdue || {}),
      };

      setLeadActivities(categorized);
    } catch (error) {
      setLeadActivities({ upcoming: [], completed: [], overdue: [] });
      if (error.response?.status !== 404) {
        handleApiError(error, "load lead activities");
      }
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleCreateActivity = async () => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      const activityPayload = {
        lead_id: selectedLeadDetails.lead_id,
        activity_type: newActivity.activity_type,
        subject: newActivity.subject,
        remarks: newActivity.remarks,
        activity_date: newActivity.activity_date,
        status: newActivity.status,
        priority: newActivity.priority,
      };

      const response = await enquiryService.createActivity(activityPayload);

      if (response.data.success) {
        await fetchLeadActivities(selectedLeadDetails.lead_id);
        setShowAddActivityModal(false);
        resetActivityForm();
      }
    } catch (error) {
      handleApiError(error, "create activity");
    }
  };

  const handleUpdateActivity = async (activityId) => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      const activityPayload = {
        activity_type: newActivity.activity_type,
        subject: newActivity.subject,
        remarks: newActivity.remarks,
        activity_date: newActivity.activity_date,
        status: newActivity.status,
        priority: newActivity.priority,
      };

      const response = await enquiryService.updateActivity(
        activityId,
        activityPayload,
      );

      if (response.data.success) {
        await fetchLeadActivities(selectedLeadDetails.lead_id);
        setShowAddActivityModal(false);
        setEditingActivity(null);
        resetActivityForm();
      }
    } catch (error) {
      handleApiError(error, "update activity");
    }
  };

  const resetActivityForm = () => {
    setNewActivity({
      activity_type: "Call",
      subject: "",
      remarks: "",
      activity_date: new Date().toISOString().split("T")[0],
      status: "Scheduled",
      priority: "Medium",
    });
  };

  // ==================== COMPONENT LIFECYCLE ====================

  useEffect(() => {
    const checkAuthentication = () => {
      if (!authService.isAuthenticated()) {
        setTimeout(() => navigate("/login"), 2000);
        return false;
      }
      return true;
    };

    if (checkAuthentication() && !hasInitialized.current) {
      hasInitialized.current = true;
      initializeData();
    }
  }, [navigate]);

  useEffect(() => {
    if (authService.isAuthenticated() && hasInitialized.current) {
      fetchLeads();
    }
  }, [
    pageNumber,
    pageLimit,
    selectedLeadSource,
    selectedLeadOwner,
    selectedStatus,
    selectedVehicleName,
    selectedEnquiryType,
    search,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpenPopup &&
        popupDropdownRef.current &&
        !popupDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpenPopup(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpenPopup]);

  useEffect(() => {
    if (
      showDetailsModal &&
      selectedLeadDetails &&
      ["upcoming", "completed", "overdue"].includes(activeTab)
    ) {
      fetchLeadActivities(selectedLeadDetails.lead_id);
    }
  }, [activeTab, showDetailsModal, selectedLeadDetails]);

  // ==================== DATA INITIALIZATION ====================

  const initializeData = async () => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      await Promise.all([fetchDropdownData(), getUser()]);
    } catch (error) {
      handleApiError(error, "initialize data");
    }
  };

  // ==================== API FUNCTIONS ====================

  const fetchDropdownData = async () => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      setIsLoadingDropdowns(true);
      setError("");

      const response = await enquiryService.getDropdownData();
      const data = response.data.data?.dropDownData;

      if (data) {
        setLeadSourceList(
          data.all_sources?.map((s) => s.trim()).filter((s) => s !== "") || [],
        );
        setStatusList(
          data.all_status?.map((s) => s.trim()).filter((s) => s !== "") || [],
        );
        setVehicleNameList(
          data.all_vehicles?.map((v) => v.trim()).filter((v) => v !== "") || [],
        );

        // Add enquiry types from API if available
        if (data.all_enquiry_types && Array.isArray(data.all_enquiry_types)) {
          setEnquiryTypeList(
            data.all_enquiry_types
              .map((type) => type.trim())
              .filter((type) => type !== ""),
          );
        }

        const users =
          data.all_users?.map((user) => ({
            user_id: user.id,
            name: user.name,
          })) || [];
        setLeadOwnerList(users);
      }
    } catch (error) {
      handleApiError(error, "fetch dropdown data");
    } finally {
      setIsLoadingDropdowns(false);
    }
  };

  const getUser = async () => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      setError("");
      const response = await enquiryService.getAllDealerUser();
      const data = response.data;

      if (data?.data?.rows && Array.isArray(data.data.rows)) {
        const users = data.data.rows.map((user) => ({
          user_id: user.user_id,
          name:
            user.name ||
            `${user.fname || ""} ${user.lname || ""}`.trim() ||
            "Unknown User",
        }));

        setAllUser(users);
        setFilteredUsersPopup(users);
      }
    } catch (error) {
      handleApiError(error, "fetch users");
    }
  };

  const fetchLeads = async (isResetCall = false) => {
    if (!authService.isAuthenticated()) {
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!checkInternetConnection()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payload = isResetCall
        ? {
            page: pageNumber,
            limit: pageLimit,
          }
        : {
            page: pageNumber,
            limit: pageLimit,
            search: search || undefined,
            source: selectedLeadSource || undefined,
            user_id: selectedLeadOwner || undefined,
            status: selectedStatus || undefined,
            pmi: selectedVehicleName || undefined,
            enquiry_type: selectedEnquiryType || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
          };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === "") {
          delete payload[key];
        }
      });

      const response = await enquiryService.getAllLeadByDealer(payload);
      const leadRes = response.data;

      const leadsWithSelection = (leadRes.data?.leads || []).map((lead) => ({
        ...lead,
        selected: false,
      }));

      setAllLead({
        leads: leadsWithSelection,
        pagination: leadRes.data?.pagination || {},
      });

      setTotalRecords(leadRes.data?.pagination?.totalRecords || 0);
      setTotalPages(
        Math.ceil((leadRes.data?.pagination?.totalRecords || 0) / pageLimit),
      );
    } catch (error) {
      handleApiError(error, "fetch leads");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== VIEW DETAILS HANDLERS ====================

  const handleViewDetails = async (lead) => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      setShowDetailsModal(true);
      setActiveTab("profile");
      setIsLoadingActivities(true);
      setError("");

      const response = await enquiryService.getLeadDetails(lead.lead_id);

      if (response.status === 200 && response.data && response.data.data) {
        const leadData = response.data.data.lead;
        setSelectedLeadDetails(leadData);
        await fetchLeadActivities(lead.lead_id);
      } else {
        setError("Failed to load lead details - Invalid response format");
      }
    } catch (error) {
      handleApiError(error, "load lead details");
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // ==================== REASSIGN FUNCTIONS ====================

  const handleLeadOpen = (lead) => {
    const toastId = toast.info(
      <div className="flex flex-col gap-2">
        <span>
          Do you want to change the status of this lead from lost to follow up?
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              confirmReopenLead(lead);
            }}
            className="px-3 py-1 text-white rounded text-sm"
            style={{ backgroundColor: "#222fb9" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm"
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        draggable: false,
        icon: false,
      },
    );
  };

  const confirmReopenLead = async (lead) => {
    if (!checkInternetConnection()) {
      return;
    }

    try {
      const response = await enquiryService.updateLeadStatus(lead.lead_id, {
        status: "Follow Up",
      });

      if (response.data && response.data.status === 200) {
        toast.success(response.data.message || "Lead reopened successfully!");
        fetchLeads();
      } else if (response.data && response.data.success === true) {
        toast.success(response.data.message || "Lead reopened successfully!");
        fetchLeads();
      } else if (response.status === 200) {
        toast.success("Lead reopened successfully!");
        fetchLeads();
      } else {
        toast.error(
          response.data?.message || "Failed to reopen lead. Please try again.",
        );
      }
    } catch (error) {
      handleApiError(error, "reopen lead");
    }
  };

  const handleSingleReassign = (lead) => {
    setSelectedLeadDetails(lead);
    setIsReassignCardOpen(true);
  };

  const openReassignCard = () => {
    setIsReassignCardOpen(true);
  };

  const closeReassignCard = () => {
    setIsReassignCardOpen(false);
    setSelectedUserPopup(null);
    setSelectedLeadDetails(null);
  };

  const filterUsersPopup = () => {
    const filtered = allUser.filter((user) =>
      user.name.toLowerCase().includes(searchUserTermPopup.toLowerCase()),
    );
    setFilteredUsersPopup(filtered);
  };

  const reassignSubmit = async () => {
    if (!selectedUserPopup) {
      toast.error("Please select a user to reassign");
      return;
    }

    const selectedLeads = allLead.leads.filter((lead) => lead.selected);
    if (selectedLeads.length === 0) {
      toast.error("Please select at least one lead to reassign");
      return;
    }

    const validLeads = selectedLeads.filter(
      (lead) => lead.lead_id && lead.lead_id !== "0",
    );
    if (validLeads.length === 0) {
      toast.error("No valid leads selected.");
      return;
    }

    if (!checkInternetConnection()) {
      return;
    }

    setIsReassigning(true);
    try {
      const leadIdsArray = validLeads.map((lead) => lead.lead_id);

      const payload = {
        user_id: selectedUserPopup.user_id,
        lead_ids: leadIdsArray,
      };

      const response = await enquiryService.reassignLeads(payload);

      const responseData = response.data;

      const isSuccess =
        responseData.success === true ||
        responseData.status === "success" ||
        (responseData.message &&
          responseData.message.toLowerCase().includes("success")) ||
        response.status === 200;

      if (isSuccess) {
        toast.success("Leads reassigned successfully!");
        closeReassignCard();
        fetchLeads();

        const updatedLeads = allLead.leads.map((lead) => ({
          ...lead,
          selected: false,
        }));
        setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
      } else {
        throw new Error(responseData.message || "Reassign failed");
      }
    } catch (error) {
      if (error.message && error.message.includes("36")) {
        toast.error("Error: Could not reassign leads. Please try again.");
      } else {
        handleApiError(error, "reassign leads");
      }
    } finally {
      setIsReassigning(false);
    }
  };

  const singleReassignSubmit = async () => {
    if (!selectedUserPopup) {
      toast.error("Please select a user to reassign");
      return;
    }

    if (!selectedLeadDetails?.lead_id) {
      toast.error("No lead selected for reassignment");
      return;
    }

    if (!checkInternetConnection()) {
      return;
    }

    setIsReassigning(true);
    try {
      const payload = {
        user_id: selectedUserPopup.user_id,
        lead_ids: [selectedLeadDetails.lead_id],
      };

      const response = await enquiryService.reassignLeads(payload);

      if (response.data && (response.data.success || response.status === 200)) {
        toast.success("Lead reassigned successfully!");
        closeReassignCard();
        setShowDetailsModal(false);
        fetchLeads();
        setSelectedLeadDetails(null);
      } else {
        throw new Error(response.data?.message || "Failed to reassign lead");
      }
    } catch (error) {
      if (error.message && error.message.includes("36")) {
        toast.error("Error: Could not reassign lead. Please try again.");
      } else {
        handleApiError(error, "reassign single lead");
      }
    } finally {
      setIsReassigning(false);
    }
  };

  // ==================== DATE FILTER FUNCTIONS ====================

  const applyDateFilter = async () => {
    if (!tempStartDate || !tempEndDate) {
      return;
    }

    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);

    if (end < start) {
      return;
    }

    if (!checkInternetConnection()) {
      return;
    }

    setIsDateLoading(true);
    try {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setSelectedDateRangeMsg(`Date Range: ${tempStartDate} to ${tempEndDate}`);
      setDateFilterApplied(true);
      setShowDatePopup(false);
      setPageNumber(1);
    } catch (error) {
      handleApiError(error, "apply date filter");
    } finally {
      setIsDateLoading(false);
    }
  };

  // ==================== UTILITY FUNCTIONS ====================

  const formatDateOnly = (dateString) => {
    if (!dateString || dateString === "N/A") return "-";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return "-";
    }
  };

  const getStatusColor = (status) => {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
  };

  // ==================== RESET FUNCTIONS ====================

  const resetAllFilters = () => {
    setIsResetting(true);
    setError("");

    const updatedLeads = allLead.leads.map((lead) => ({
      ...lead,
      selected: false,
    }));
    setAllLead((prev) => ({ ...prev, leads: updatedLeads }));

    setSelectedLeadSource("");
    setSelectedLeadOwner("");
    setSelectedStatus("");
    setSelectedVehicleName("");
    setSelectedEnquiryType("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setTempStartDate("");
    setTempEndDate("");
    setSelectedDateRangeMsg("");
    setDateFilterApplied(false);
    setShowDatePopup(false);
    setPageNumber(1);

    setTimeout(() => {
      fetchLeads(true);
      setIsResetting(false);
    }, 100);
  };

  // ==================== SELECTION HELPERS ====================

  const getAnyRowSelected = useCallback(() => {
    return allLead?.leads?.some((lead) => lead.selected) || false;
  }, [allLead.leads]);

  const getIsAllSelected = useCallback(() => {
    return (
      allLead?.leads?.length > 0 && allLead.leads.every((lead) => lead.selected)
    );
  }, [allLead.leads]);

  const getSelectedCount = useCallback(() => {
    return allLead?.leads?.filter((lead) => lead.selected).length || 0;
  }, [allLead.leads]);

  const selectAllRows = (event) => {
    const checked = event.target.checked;
    const updatedLeads = allLead.leads.map((lead) => ({
      ...lead,
      selected: checked,
    }));
    setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
  };

  const toggleLeadSelection = (index) => {
    const updatedLeads = [...allLead.leads];
    updatedLeads[index] = {
      ...updatedLeads[index],
      selected: !updatedLeads[index].selected,
    };
    setAllLead((prev) => ({ ...prev, leads: updatedLeads }));
  };

  // ==================== RENDER ====================

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
        style={{ fontSize: "14px" }}
      />

      <div className="content-section active">
        <div className="page-titles px-4 flex justify-between items-center text-xs">
          <ol className="breadcrumb mb-0 flex flex-row items-center text-xs">
            <li className="breadcrumb-item">
              <a className="cursor-auto text-[#222fb9] text-xs">Dashboard</a>
            </li>
            <li className="breadcrumb-item active">
              <span className="text-gray-400 mx-2">@</span>
              <a className="cursor-auto font-normal text-[#6e7d8b] text-xs">
                Enquiries
              </a>
            </li>
          </ol>

          <div className="flex items-center gap-4 text-xs">
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 focus:outline-none focus:border-[#222fb9] text-xs"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setPageNumber(1);
                  fetchLeads();
                }
              }}
            />
            <div className="text-[#222fb9] font-medium text-right text-xs">
              Total: {totalRecords}
            </div>
            <button
              className="border border-gray-300 bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1a259c] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              onClick={resetAllFilters}
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset"}
            </button>
          </div>
        </div>

        <div className="bg-white p-6 mb-5 shadow-lg rounded-xl border border-gray-200 text-xs">
          {/* Filter Section */}
          <FilterSection
            pageLimit={pageLimit}
            onLimitChange={(e) => {
              setPageLimit(Number(e.target.value));
              setPageNumber(1);
            }}
            leadSourceList={leadSourceList}
            selectedLeadSource={selectedLeadSource}
            setSelectedLeadSource={setSelectedLeadSource}
            leadOwnerList={leadOwnerList}
            selectedLeadOwner={selectedLeadOwner}
            setSelectedLeadOwner={setSelectedLeadOwner}
            statusList={statusList}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            vehicleNameList={vehicleNameList}
            selectedVehicleName={selectedVehicleName}
            setSelectedVehicleName={setSelectedVehicleName}
            enquiryTypeList={enquiryTypeList}
            selectedEnquiryType={selectedEnquiryType}
            setSelectedEnquiryType={setSelectedEnquiryType}
            showDatePopup={showDatePopup}
            setShowDatePopup={setShowDatePopup}
            tempStartDate={tempStartDate}
            setTempStartDate={setTempStartDate}
            tempEndDate={tempEndDate}
            setTempEndDate={setTempEndDate}
            startDate={startDate}
            endDate={endDate}
            dateFilterApplied={dateFilterApplied}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSelectedDateRangeMsg={setSelectedDateRangeMsg}
            setDateFilterApplied={setDateFilterApplied}
            setPageNumber={setPageNumber}
            isLoadingDropdowns={isLoadingDropdowns}
            search={search}
            handleSearchInput={(e) => setSearch(e.target.value)}
            handleSearchKeyPress={(e) => {
              if (e.key === "Enter") {
                setPageNumber(1);
                fetchLeads();
              }
            }}
            totalRecords={totalRecords}
            selectedDateRangeMsg={selectedDateRangeMsg}
            resetAllFilters={resetAllFilters}
            isResetting={isResetting}
            getAnyRowSelected={getAnyRowSelected}
            getIsAllSelected={getIsAllSelected}
            selectAllRows={selectAllRows}
            getSelectedCount={getSelectedCount}
            openReassignCard={openReassignCard}
            allLead={allLead}
            setAllLead={setAllLead}
            isDateLoading={isDateLoading}
            applyDateFilter={applyDateFilter}
          />

          {/* Lead Table */}
          <LeadTable
            allLead={allLead}
            isLoading={isLoading}
            pageNumber={pageNumber}
            pageLimit={pageLimit}
            toggleLeadSelection={toggleLeadSelection}
            getStatusColor={getStatusColor}
            formatDateOnly={formatDateOnly}
            handleViewDetails={handleViewDetails}
            handleLeadOpen={handleLeadOpen}
            handleSingleReassign={handleSingleReassign}
          />

          {/* Pagination */}
          <Pagination
            pageNumber={pageNumber}
            totalPages={totalPages}
            totalRecords={totalRecords}
            pageLimit={pageLimit}
            goToPage={setPageNumber}
          />
        </div>
      </div>

      {/* Modals */}
      <LeadDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedLeadDetails={selectedLeadDetails}
        isLoadingActivities={isLoadingActivities}
        error={error}
        handleViewDetails={handleViewDetails}
        getStatusColor={getStatusColor}
        formatDateOnly={formatDateOnly}
        leadActivities={leadActivities}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allUser={allUser}
        selectedUserPopup={selectedUserPopup}
        setSelectedUserPopup={setSelectedUserPopup}
        searchUserTermPopup={searchUserTermPopup}
        setSearchUserTermPopup={setSearchUserTermPopup}
        filteredUsersPopup={filteredUsersPopup}
        setFilteredUsersPopup={setFilteredUsersPopup}
        dropdownOpenPopup={dropdownOpenPopup}
        setDropdownOpenPopup={setDropdownOpenPopup}
        popupDropdownRef={popupDropdownRef}
        singleReassignSubmit={singleReassignSubmit}
        filterUsersPopup={filterUsersPopup}
      />

      <ReassignCard
        isReassignCardOpen={isReassignCardOpen}
        closeReassignCard={closeReassignCard}
        selectedLeadDetails={selectedLeadDetails}
        selectedUserPopup={selectedUserPopup}
        setSelectedUserPopup={setSelectedUserPopup}
        allUser={allUser}
        searchUserTermPopup={searchUserTermPopup}
        setSearchUserTermPopup={setSearchUserTermPopup}
        filteredUsersPopup={filteredUsersPopup}
        setFilteredUsersPopup={setFilteredUsersPopup}
        singleReassignSubmit={singleReassignSubmit}
        reassignSubmit={reassignSubmit}
        isReassigning={isReassigning}
        dropdownOpenPopup={dropdownOpenPopup}
        setDropdownOpenPopup={setDropdownOpenPopup}
        filterUsersPopup={filterUsersPopup}
      />
    </div>
  );
};

export default MainEnquiriesResign;
