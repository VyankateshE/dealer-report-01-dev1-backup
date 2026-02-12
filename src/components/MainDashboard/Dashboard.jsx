// import React, { useState, useEffect, useRef } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";

// // Import components
// import KpiSection from "./Components/KpiSection/KpiSection";
// import FilterBar from "./Components/Header/FilterBar";
// import DealerSummaryTable from "./Components/DealerSummaryTable/DealerSummaryTable";
// import CallLogsTable from "./Components/CallLogsTable/CallLogsTable";

// import api from "../../utils/axiosInterceptor";
// const Dashboard = () => {
//   const navigate = useNavigate();

//   // State declarations
//   const [selectedFilter, setSelectedFilter] = useState("LAST_WEEK");
//   const [customStartDate, setCustomStartDate] = useState("");
//   const [customEndDate, setCustomEndDate] = useState("");
//   const [invalidDateRange, setInvalidDateRange] = useState(false);
//   const [dealerSearch, setDealerSearch] = useState("");
//   const [selectedDealers, setSelectedDealers] = useState([]);

//   // ✅ NEW: Temporary dealer selection state
//   const [tempSelectedDealers, setTempSelectedDealers] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   // ✅ FIXED: Add refreshingSA state for the refresh button
//   const [refreshingSA, setRefreshingSA] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [userRole, setUserRole] = useState("GM");
//   const [isSticky, setIsSticky] = useState(false);
//   const [scrollDirection, setScrollDirection] = useState("up");
//   const lastToastTimeRef = useRef(0);
//   let lastScrollY = 0;

//   const [shouldAutoFetchCustom, setShouldAutoFetchCustom] = useState(false);
//   const [hasInitialData, setHasInitialData] = useState(false);

//   // ✅ NEW: Add these states from CEO dashboard
//   const [customDatesApplied, setCustomDatesApplied] = useState(false);
//   const [hasCheckedSavedDates, setHasCheckedSavedDates] = useState(false);

//   // ✅ NEW: Add these refs from CEO dashboard
//   const hasFetchedInitialDataRef = useRef(false);
//   const currentFilterRef = useRef("LAST_WEEK");

//   // Data state
//   const [kpiData, setKpiData] = useState({
//     dealers: 0,
//     activeNetwork: 0,
//     users: 0,
//     activeUsers: 0,
//     leads: 0,
//     calls: 0,
//   });

//   const [dealers, setDealers] = useState([]);
//   const [filteredDealers, setFilteredDealers] = useState([]);
//   const [dealerUsers, setDealerUsers] = useState({});
//   const [userCallLogs, setUserCallLogs] = useState({});
//   const [loadingUsers, setLoadingUsers] = useState({});

//   const [expandedSummaryRows, setExpandedSummaryRows] = useState(new Set());
//   const [expandedCallLogsRows, setExpandedCallLogsRows] = useState(new Set());
//   const [sortColumn, setSortColumn] = useState("saLeads");
//   const [sortDirection, setSortDirection] = useState("desc");
//   const [table1Length, setTable1Length] = useState(10);
//   const [table2Length, setTable2Length] = useState(10);
//   const [dealerSummaryCallsViewType, setDealerSummaryCallsViewType] =
//     useState("table");
//   const [dealerSummaryCallsDataType, setDealerSummaryCallsDataType] =
//     useState("combinedCalls");
//   const [modalCallsDataType, setModalCallsDataType] = useState("combinedCalls");

//   // ✅ NEW: State to track if custom filter is selected but dates not applied
//   const [customFilterPending, setCustomFilterPending] = useState(false);

//   // ✅ FIXED: Initialize with all dealers selected on first load
//   useEffect(() => {
//     if (dealers.length > 0 && selectedDealers.length === 0) {
//       console.log("📊 Initializing with all dealers selected");
//       setSelectedDealers([...dealers]);
//       setTempSelectedDealers([...dealers]);
//     }
//   }, [dealers.length, selectedDealers.length]);

//   // Keep the existing sync effect:
//   useEffect(() => {
//     if (dropdownOpen) {
//       setTempSelectedDealers([...selectedDealers]);
//     }
//   }, [dropdownOpen, selectedDealers]);

//   const handleLogout = () => {
//     // console.log("🔐 Session expired. Logging out...");
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userRole");
//     localStorage.removeItem("selectedFilter");
//     localStorage.removeItem("customStartDate");
//     localStorage.removeItem("customEndDate");
//     sessionStorage.clear();
//     if (api.defaults.headers.common["Authorization"]) {
//       delete api.defaults.headers.common["Authorization"];
//     }
//     setTimeout(() => {
//       navigate("/login");
//       toast.info("Session expired. Please login again.");
//     }, 1000);
//   };

//   const safeToast = {
//     success: (message) => {
//       try {
//         const now = Date.now();
//         if (now - lastToastTimeRef.current > 1000) {
//           toast.success(message);
//           lastToastTimeRef.current = now;
//         }
//       } catch (error) {
//         // console.log("Toast error:", error);
//       }
//     },
//     error: (message, isSessionExpired = false) => {
//       try {
//         const now = Date.now();
//         if (now - lastToastTimeRef.current > 3000) {
//           toast.error(message);
//           lastToastTimeRef.current = now;
//           if (isSessionExpired) {
//             setTimeout(() => {
//               handleLogout();
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         // console.log("Toast error:", error);
//       }
//     },
//     warning: (message) => {
//       try {
//         const now = Date.now();
//         if (now - lastToastTimeRef.current > 2000) {
//           toast.warning(message);
//           lastToastTimeRef.current = now;
//         }
//       } catch (error) {
//         // console.log("Toast error:", error);
//       }
//     },
//     info: (message) => {
//       try {
//         const now = Date.now();
//         if (now - lastToastTimeRef.current > 2000) {
//           toast.info(message);
//           lastToastTimeRef.current = now;
//         }
//       } catch (error) {
//         // console.log("Toast error:", error);
//       }
//     },
//   };

//   // Internet connection monitoring
//   useEffect(() => {
//     const handleOnline = () => {
//       // console.log("✅ Internet connection restored");
//       setIsOnline(true);
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         // safeToast.success("🌐 Internet connection restored!");
//         lastToastTimeRef.current = now;
//       }
//     };

//     const handleOffline = () => {
//       // console.log("❌ Internet connection lost");
//       setIsOnline(false);
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         // safeToast.error("📡 Please check your internet connection!");
//         lastToastTimeRef.current = now;
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
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       const current = window.scrollY;

//       if (current > lastScrollY) {
//         setScrollDirection("down");
//       } else {
//         setScrollDirection("up");
//       }

//       if (scrollDirection === "up" && current > 50) {
//         setIsSticky(true);
//       } else {
//         setIsSticky(false);
//       }

//       lastScrollY = current;
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [scrollDirection]);

//   const checkInternetConnection = () => {
//     if (!navigator.onLine) {
//       const now = Date.now();
//       if (now - lastToastTimeRef.current > 3000) {
//         // safeToast.error("📡 Please check your internet connection!");
//         lastToastTimeRef.current = now;
//       }
//       return false;
//     }
//     return true;
//   };

//   // ✅ FIXED: Check saved dates on initial mount - LIKE CEO DASHBOARD
//   useEffect(() => {
//     console.log("🔍 Checking saved dates from localStorage...");

//     const savedFilter = localStorage.getItem("selectedFilter") || "LAST_WEEK";
//     const savedStartDate = localStorage.getItem("customStartDate");
//     const savedEndDate = localStorage.getItem("customEndDate");

//     console.log("📋 Saved filter:", savedFilter);
//     console.log("📅 Saved dates:", savedStartDate, savedEndDate);

//     // Set initial states from localStorage
//     setSelectedFilter(savedFilter);
//     currentFilterRef.current = savedFilter;

//     // Only set custom dates if CUSTOM filter is saved WITH dates
//     if (savedFilter === "CUSTOM" && savedStartDate && savedEndDate) {
//       console.log("✅ Found saved CUSTOM dates, marking as applied");
//       setCustomStartDate(savedStartDate);
//       setCustomEndDate(savedEndDate);
//       setCustomDatesApplied(true);
//       // Mark that we should auto-fetch custom data
//       setShouldAutoFetchCustom(true);
//       setCustomFilterPending(false);
//     } else if (savedFilter === "CUSTOM" && (!savedStartDate || !savedEndDate)) {
//       // ✅ FIX: If CUSTOM is selected but no dates are saved, reset to LAST_WEEK
//       console.log(
//         "⚠️ CUSTOM filter selected but no dates found, resetting to LAST_WEEK",
//       );
//       setSelectedFilter("LAST_WEEK");
//       currentFilterRef.current = "LAST_WEEK";
//       localStorage.setItem("selectedFilter", "LAST_WEEK");
//       setShouldAutoFetchCustom(false);
//       setCustomFilterPending(false);
//     }

//     setHasCheckedSavedDates(true);
//   }, []);

//   // ✅ FIXED: Main initialization - RUNS AFTER saved dates are checked
//   useEffect(() => {
//     if (!hasCheckedSavedDates) {
//       console.log("⏳ Waiting for saved dates check...");
//       return;
//     }

//     console.log("🚀 Starting main initialization...");
//     console.log("📊 Current filter:", selectedFilter);
//     console.log("✅ Custom dates applied:", customDatesApplied);
//     console.log("🔄 Should auto-fetch custom:", shouldAutoFetchCustom);

//     // ✅ FIX: Allow CUSTOM filter to bypass duplicate check when dates are applied
//     const isCustomWithDates = selectedFilter === "CUSTOM" && customDatesApplied;

//     // Prevent duplicate calls for non-CUSTOM filters
//     if (hasFetchedInitialDataRef.current && !isCustomWithDates) {
//       console.log("⚠️ Already fetched initial data, skipping...");
//       return;
//     }

//     // ✅ FIX: Handle ALL filters including CUSTOM properly
//     if (selectedFilter === "CUSTOM" && shouldAutoFetchCustom) {
//       console.log("🔄 Fetching data for saved CUSTOM filter...");

//       // Clear any existing data
//       setDealers([]);
//       setFilteredDealers([]);
//       setSelectedDealers([]);
//       setExpandedSummaryRows(new Set());
//       setExpandedCallLogsRows(new Set());
//       setDealerUsers({});
//       setUserCallLogs({});

//       // Fetch data
//       fetchDashboardData("CUSTOM");

//       hasFetchedInitialDataRef.current = true;
//       setShouldAutoFetchCustom(false);
//       return;
//     }

//     // Handle other filters
//     console.log("🔄 Fetching data for filter:", selectedFilter);
//     fetchDashboardData(selectedFilter);

//     hasFetchedInitialDataRef.current = true;
//   }, [hasCheckedSavedDates, selectedFilter, shouldAutoFetchCustom]);

//   // Filter dealers based on search
//   useEffect(() => {
//     if (!dealerSearch.trim()) {
//       setFilteredDealers(dealers);
//     } else {
//       const search = dealerSearch.toLowerCase();
//       setFilteredDealers(
//         dealers.filter(
//           (d) =>
//             d.dealerName?.toLowerCase().includes(search) ||
//             d.name?.toLowerCase().includes(search),
//         ),
//       );
//     }
//   }, [dealerSearch, dealers]);

//   // ✅ NEW: Effect to validate custom dates when they change
//   useEffect(() => {
//     validateCustomDates();
//   }, [customStartDate, customEndDate]);

//   // API Functions
//   const mapFilterToApi = (filter) => {
//     const filterMap = {
//       DAY: "DAY",
//       YESTERDAY: "YESTERDAY",
//       WEEK: "WEEK",
//       LAST_WEEK: "LAST_WEEK",
//       MTD: "MTD",
//       LAST_MONTH: "LAST_MONTH",
//       QTD: "QTD",
//       LAST_QUARTER: "LAST_QUARTER",
//       SIX_MONTH: "SIX_MONTH",
//       YTD: "YTD",
//       LIFETIME: "LIFETIME",
//       CUSTOM: "CUSTOM",
//     };
//     return filterMap[filter] || "LAST_WEEK";
//   };

//   // Data processing function
//   const processDealerData = (apiResponse) => {
//     if (!apiResponse?.data) {
//       console.log("❌ No data in API response");
//       return [];
//     }

//     const { data } = apiResponse;
//     console.log(
//       "🔧 Processing API data for filter:",
//       currentFilterRef.current,
//       data,
//     );

//     let dealerData = [];

//     if (Array.isArray(data.dealerData)) {
//       dealerData = data.dealerData;
//     } else if (data.dealerData && typeof data.dealerData === "object") {
//       dealerData = [data.dealerData];
//     } else if (data.dealerId || data.dealerName) {
//       dealerData = [data];
//     } else if (Array.isArray(data)) {
//       dealerData = data;
//     } else {
//       console.log(
//         "⚠️ No dealer data found in response structure:",
//         Object.keys(data),
//       );
//       dealerData = [];
//     }

//     if (dealerData.length === 0) {
//       console.log("⚠️ No dealer data found in response");
//       return [];
//     }

//     const processedDealers = dealerData.map((dealer, index) => {
//       const getNum = (value, fallback = 0) => {
//         if (value === null || value === undefined || value === "")
//           return fallback;
//         const num = Number(value);
//         return isNaN(num) ? fallback : num;
//       };

//       // Extract web values properly
//       const webleads = getNum(dealer.webleads) || getNum(dealer.webLeads) || 0;
//       const webleadsFollowUps =
//         getNum(dealer.webleadsFollowUps) ||
//         getNum(dealer.webleadsfollowups) ||
//         0;
//       const saTestDrives =
//         getNum(dealer.saTestDrives) || getNum(dealer.satestdrives) || 0;

//       const dealerObj = {
//         dealerId: dealer.dealerId || dealer.id || `dealer-${index}`,
//         dealerName: dealer.dealerName || dealer.name || "Unknown Dealer",
//         id: dealer.dealerId || dealer.id || `dealer-${index}`,
//         name: dealer.dealerName || dealer.name || "Unknown Dealer",
//         totalUsers: getNum(dealer.totalUsers),
//         registerUsers: getNum(dealer.registerUsers),
//         activeUsers: getNum(dealer.activeUsers),
//         totalLeads: getNum(dealer.totalLeads),
//         saLeads: getNum(dealer.saLeads),
//         webleads: webleads,
//         manuallyEnteredLeads: getNum(dealer.manuallyEnteredLeads),
//         totalFollowUps: getNum(dealer.totalFollowUps),
//         saFollowUps: getNum(dealer.saFollowUps),
//         webleadsFollowUps: webleadsFollowUps,
//         completedFollowUps: getNum(dealer.completedFollowUps),
//         openFollowUps: getNum(dealer.openFollowUps),
//         closedFollowUps: getNum(dealer.closedFollowUps),

//         // Web followup fields
//         webCompletedFollowUps: getNum(
//           dealer.webCompletedFollowUps || dealer.webcompletedfollowups,
//         ),
//         webUpcomingFollowUps: getNum(
//           dealer.webUpcomingFollowUps || dealer.webupcomingfollowups,
//         ),
//         webOverdueFollowUps: getNum(
//           dealer.webOverdueFollowUps || dealer.weboverduefollowups,
//         ),

//         totalTestDrives: getNum(dealer.totalTestDrives || dealer.saTestDrives),
//         saTestDrives: saTestDrives,
//         completedTestDrives: getNum(dealer.completedTestDrives),
//         uniqueTestDrives: getNum(dealer.uniqueTestDrives),
//         upcomingTestDrives: getNum(dealer.upcomingTestDrives),
//         closedTestDrives: getNum(dealer.closedTestDrives),

//         // Web test drive fields
//         webleadsTestDrives: getNum(
//           dealer.webleadsTestDrives || dealer.webleadstestdrives,
//         ),
//         webCompletedTestDrives: getNum(
//           dealer.webCompletedTestDrives || dealer.webcompletedtestdrives,
//         ),
//         webUpcomingTestDrives: getNum(
//           dealer.webUpcomingTestDrives || dealer.webupcomingtestdrives,
//         ),
//         webOverdueTestDrives: getNum(
//           dealer.webOverdueTestDrives || dealer.weboverduetestdrives,
//         ),

//         newOrders: getNum(dealer.newOrders),
//         netOrders: getNum(dealer.netOrders),
//         retail: getNum(dealer.retail),
//         cancellations: getNum(dealer.cancellations),
//         opportunitiesConverted: getNum(dealer.opportunitiesConverted),
//         enquiriesCalls: dealer.enquiriesCalls || {},
//         coldCalls: dealer.coldCalls || {},
//         combinedCalls: dealer.combinedCalls || {},
//         callLogs: dealer.callLogs || {},
//         users: dealer.users || [],
//       };

//       console.log(`🏪 Processed dealer ${index}:`, {
//         name: dealerObj.dealerName,
//         saLeads: dealerObj.saLeads,
//         webleads: dealerObj.webleads,
//         saFollowUps: dealerObj.saFollowUps,
//         webleadsFollowUps: dealerObj.webleadsFollowUps,
//         totalTestDrives: dealerObj.totalTestDrives,
//         saTestDrives: dealerObj.saTestDrives,
//         webCompletedTestDrives: dealerObj.webCompletedTestDrives,
//         webUpcomingTestDrives: dealerObj.webUpcomingTestDrives,
//         webOverdueTestDrives: dealerObj.webOverdueTestDrives,
//       });

//       return dealerObj;
//     });

//     console.log(
//       "🎉 Processed dealers for filter:",
//       currentFilterRef.current,
//       processedDealers,
//     );
//     return processedDealers;
//   };

//   // ✅ FIXED: MAIN DASHBOARD DATA FETCH - Updated with CEO logic
//   const fetchDashboardData = async (filterType, dealersToUse = null) => {
//     // ✅ FIXED: For CUSTOM filter, don't show toast, just set pending state
//     if (filterType === "CUSTOM") {
//       if (!customDatesApplied) {
//         console.log(
//           "⏸️ CUSTOM filter selected but dates not applied yet, skipping fetch",
//         );
//         // Set pending state to show message in table UI
//         setCustomFilterPending(true);
//         return;
//       }

//       // Double check we have dates
//       if (!customStartDate || !customEndDate) {
//         console.log(
//           "⏸️ CUSTOM filter selected but dates are empty, skipping fetch",
//         );
//         // Set pending state to show message in table UI
//         setCustomFilterPending(true);
//         return;
//       }
//     }

//     // If we're switching from CUSTOM pending to another filter, reset the pending state
//     if (filterType !== "CUSTOM" && customFilterPending) {
//       setCustomFilterPending(false);
//     }

//     if (!checkInternetConnection()) {
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     currentFilterRef.current = filterType;

//     const effectiveDealers =
//       dealersToUse !== null ? dealersToUse : selectedDealers;

//     console.log("🌐 Fetching data for filter:", filterType);
//     console.log("📊 Effective dealers count:", effectiveDealers.length);

//     try {
//       let url = "";
//       const isCustomMode =
//         filterType === "CUSTOM" &&
//         customStartDate &&
//         customEndDate &&
//         customDatesApplied;
//       const apiFilterType = mapFilterToApi(filterType);

//       // Build URL based on selection
//       if (effectiveDealers.length === 0) {
//         url = isCustomMode
//           ? `/generalManager/dashboard/report?start_date=${customStartDate}&end_date=${customEndDate}`
//           : `/generalManager/dashboard/report?type=${apiFilterType}`;
//       } else if (effectiveDealers.length === 1) {
//         const dealerId = effectiveDealers[0].dealerId || effectiveDealers[0].id;
//         url = isCustomMode
//           ? `/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${customStartDate}&end_date=${customEndDate}`
//           : `/generalManager/dashboard/report?dealer_id=${dealerId}&type=${apiFilterType}`;
//       } else {
//         const dealerIds = effectiveDealers
//           .map((d) => d.dealerId || d.id)
//           .join(",");
//         url = isCustomMode
//           ? `/generalManager/dashboard/report?dealerIds=${dealerIds}&start_date=${customStartDate}&end_date=${customEndDate}`
//           : `/generalManager/dashboard/report?dealerIds=${dealerIds}&type=${apiFilterType}`;
//       }

//       console.log("🔗 API URL:", url);

//       const response = await api.get(url);
//       console.log("📥 Full API Response:", response.data);

//       if (response.data?.status === 200 && response.data.data) {
//         console.log("✅ API Success - Processing data...");
//         const updatedDealers = processDealerData(response.data);

//         if (updatedDealers.length === 0) {
//           console.log("⚠️ No dealers after processing");
//           // safeToast.warning("📊 No dealer data found for selected filter");
//           setDealers([]);
//           setFilteredDealers([]);
//           setKpiData({
//             dealers: 0,
//             activeNetwork: 0,
//             users: 0,
//             activeUsers: 0,
//             leads: 0,
//             calls: 0,
//             totalFollowUps: 0,
//             uniqueTestDrives: 0,
//             completedTestDrives: 0,
//             newOrders: 0,
//             netOrders: 0,
//             retail: 0,
//             cancellations: 0,
//           });
//         } else {
//           const sortedDealers = [...updatedDealers].sort(
//             (a, b) => (b.saLeads ?? 0) - (a.saLeads ?? 0),
//           );

//           console.log("✅ Setting dealers state:", sortedDealers.length);
//           setDealers(sortedDealers);
//           setFilteredDealers(sortedDealers);

//           const overview = response.data.data.overview || {};
//           const kpiUpdate = {
//             dealers: overview.dealers || sortedDealers.length,
//             activeNetwork: overview.activeNetwork || sortedDealers.length,
//             users: overview.users || 0,
//             activeUsers: overview.activeUsers || 0,
//             leads: overview.leads || 0,
//             calls: overview.calls || 0,
//             enqCalls: overview.enqCalls || 0,
//             coldCalls: overview.coldCalls || 0,
//             totalFollowUps: overview.totalFollowUps || 0,
//             uniqueTestDrives: overview.uniqueTestDrives || 0,
//             completedTestDrives: overview.completedTestDrives || 0,
//             newOrders: overview.newOrders || 0,
//             netOrders: overview.netOrders || 0,
//             retail: overview.retail || 0,
//             cancellations: overview.cancellations || 0,
//             // ✅ ADD THESE WEB FIELDS:
//             webLeads: overview.webLeads || 0,
//             webFollowUps: overview.webFollowUps || 0,
//             webTestDrives: overview.webTestDrives || 0,
//             webCompletedTestDrives: overview.webCompletedTestDrives || 0,
//           };

//           setKpiData(kpiUpdate);
//           setHasInitialData(true);
//           console.log("✅ Data successfully loaded");
//         }
//       }
//     } catch (error) {
//       console.error("❌ API failed:", error);

//       if (error.response?.status === 401) {
//         safeToast.error("🔐 Session expired. Please login again.", true);
//       } else if (
//         error.code === "ECONNABORTED" ||
//         error.message.includes("Network Error")
//       ) {
//         // safeToast.error("📡 Please check your internet connection!");
//       } else {
//         // safeToast.error(`❌ ${error.message || "Failed to fetch data"}`);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchDealerUsersData = async (
//     dealer,
//     filterType = null,
//     customStart = null,
//     customEnd = null,
//   ) => {
//     if (!checkInternetConnection()) return null;

//     const id = dealer.dealerId || dealer.id;
//     if (!id) {
//       console.error("❌ No dealer ID provided:", dealer);
//       return null;
//     }

//     const effectiveFilter = filterType || selectedFilter;
//     setLoadingUsers((prev) => ({ ...prev, [id]: true }));

//     try {
//       let url = "";
//       let finalFilter = effectiveFilter;
//       let isCustomMode = false;

//       const effectiveStartDate = customStart || customStartDate;
//       const effectiveEndDate = customEnd || customEndDate;

//       if (effectiveFilter === "CUSTOM") {
//         if (effectiveStartDate && effectiveEndDate) {
//           isCustomMode = true;
//         } else {
//           finalFilter = "LAST_WEEK";
//           console.log(
//             "⚠️ CUSTOM filter without dates, falling back to LAST_WEEK",
//           );
//         }
//       }

//       const apiFilter = mapFilterToApi(finalFilter);

//       if (isCustomMode) {
//         url = `/generalManager/dashboard/report?dealer_id=${id}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
//         console.log("🔗 Custom date API URL:", url);
//       } else {
//         url = `/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilter}`;
//         console.log("🔗 Standard filter API URL:", url);
//       }

//       console.log("🔗 Fetching dealer users from:", url);

//       const response = await api.get(url);

//       if (response.data?.status === 200 && response.data.data) {
//         let userData = [];
//         let freshDealerData = null;

//         if (Array.isArray(response.data.data.dealerData)) {
//           freshDealerData = response.data.data.dealerData.find(
//             (d) => (d.dealerId || d.id) === id,
//           );
//           userData = freshDealerData?.users || [];
//         } else if (
//           response.data.data.dealerData &&
//           typeof response.data.data.dealerData === "object"
//         ) {
//           freshDealerData = response.data.data.dealerData;
//           userData = response.data.data.dealerData.users || [];
//         } else if (response.data.data.users) {
//           userData = response.data.data.users || [];
//           freshDealerData = response.data.data;
//         }

//         if (userData.length > 0) {
//           // Helper function to extract numeric values
//           const getNum = (value, fallback = 0) => {
//             if (value === null || value === undefined || value === "")
//               return fallback;
//             const num = Number(value);
//             return isNaN(num) ? fallback : num;
//           };

//           const processedUsers = userData.map((user) => ({
//             user_id: user.user_id,
//             user: user.user,
//             user_role: user.user_role,
//             registerUser:
//               user.registerUser !== undefined ? user.registerUser : true,
//             active: user.active !== undefined ? user.active : false,
//             last_login: user.last_login || null,

//             // Leads with web values
//             leads: {
//               sa: getNum(user.leads?.sa),
//               manuallyEntered: getNum(user.leads?.manuallyEntered),
//               webleads:
//                 getNum(user.leads?.webleads) || getNum(user.webleads) || 0,
//             },

//             // Followups with web values
//             followups: {
//               sa: getNum(user.followups?.sa),
//               completed: getNum(user.followups?.completed),
//               open: getNum(user.followups?.open),
//               closed: getNum(user.followups?.closed),
//               webleadsFollowUps:
//                 getNum(user.followups?.webleadsFollowUps) ||
//                 getNum(user.webleadsFollowUps) ||
//                 0,
//               webCompletedFollowUps:
//                 getNum(user.followups?.webCompletedFollowUps) ||
//                 getNum(user.webCompletedFollowUps) ||
//                 0,
//               webUpcomingFollowUps:
//                 getNum(user.followups?.webUpcomingFollowUps) ||
//                 getNum(user.webUpcomingFollowUps) ||
//                 0,
//               webOverdueFollowUps:
//                 getNum(user.followups?.webOverdueFollowUps) ||
//                 getNum(user.webOverdueFollowUps) ||
//                 0,
//             },

//             // Test drives with web values
//             testdrives: {
//               sa: getNum(user.testdrives?.sa),
//               total:
//                 getNum(user.testdrives?.total) ||
//                 getNum(user.testdrives?.sa) ||
//                 0,
//               completed: getNum(user.testdrives?.completed),
//               unique: getNum(user.testdrives?.unique),
//               upcoming: getNum(user.testdrives?.upcoming),
//               closed: getNum(user.testdrives?.closed),
//               webleadsTestDrives:
//                 getNum(user.testdrives?.webleadsTestDrives) ||
//                 getNum(user.webleadsTestDrives) ||
//                 0,
//               webCompletedTestDrives:
//                 getNum(user.testdrives?.webCompletedTestDrives) ||
//                 getNum(user.webCompletedTestDrives) ||
//                 0,
//               webUpcomingTestDrives:
//                 getNum(user.testdrives?.webUpcomingTestDrives) ||
//                 getNum(user.webUpcomingTestDrives) ||
//                 0,
//               webOverdueTestDrives:
//                 getNum(user.testdrives?.webOverdueTestDrives) ||
//                 getNum(user.webOverdueTestDrives) ||
//                 0,
//               planned_not_completed:
//                 getNum(user.testdrives?.planned_not_completed) || 0,
//             },

//             newOrders: getNum(user.newOrders),
//             netOrders: getNum(user.netOrders),
//             retail: getNum(user.retail),
//             cancellations: getNum(user.cancellations),
//             opportunitiesConverted: getNum(user.opportunitiesConverted),
//             enquiriesCalls: user.enquiriesCalls || {},
//             coldCalls: user.coldCalls || {},
//           }));

//           setDealerUsers((prev) => ({ ...prev, [id]: processedUsers }));
//         }

//         if (freshDealerData) {
//           console.log(
//             "✅ Returning fresh dealer data:",
//             freshDealerData.dealerName || freshDealerData.name,
//           );

//           // Add getNum helper function inside this scope
//           const getNum = (value, fallback = 0) => {
//             if (value === null || value === undefined || value === "")
//               return fallback;
//             const num = Number(value);
//             return isNaN(num) ? fallback : num;
//           };

//           // Extract web values from freshDealerData
//           const webleads =
//             getNum(freshDealerData.webleads) ||
//             getNum(freshDealerData.webLeads) ||
//             0;
//           const webleadsFollowUps =
//             getNum(freshDealerData.webleadsFollowUps) ||
//             getNum(freshDealerData.webleadsfollowups) ||
//             0;
//           const saTestDrives =
//             getNum(freshDealerData.saTestDrives) ||
//             getNum(freshDealerData.satestdrives) ||
//             0;

//           const processedDealerData = {
//             dealerId: freshDealerData.dealerId || freshDealerData.id || id,
//             dealerName:
//               freshDealerData.dealerName ||
//               freshDealerData.name ||
//               dealer.dealerName ||
//               dealer.name,
//             id: freshDealerData.dealerId || freshDealerData.id || id,
//             name:
//               freshDealerData.dealerName ||
//               freshDealerData.name ||
//               dealer.dealerName ||
//               dealer.name,
//             totalUsers: getNum(freshDealerData.totalUsers),
//             registerUsers: getNum(freshDealerData.registerUsers),
//             activeUsers: getNum(freshDealerData.activeUsers),
//             totalLeads: getNum(freshDealerData.totalLeads),
//             saLeads: getNum(freshDealerData.saLeads),
//             webleads: webleads,
//             manuallyEnteredLeads: getNum(freshDealerData.manuallyEnteredLeads),
//             totalFollowUps: getNum(freshDealerData.totalFollowUps),
//             saFollowUps: getNum(freshDealerData.saFollowUps),
//             webleadsFollowUps: webleadsFollowUps,
//             completedFollowUps: getNum(freshDealerData.completedFollowUps),
//             openFollowUps: getNum(freshDealerData.openFollowUps),
//             closedFollowUps: getNum(freshDealerData.closedFollowUps),

//             // Web followup fields
//             webCompletedFollowUps: getNum(
//               freshDealerData.webCompletedFollowUps ||
//                 freshDealerData.webcompletedfollowups,
//             ),
//             webUpcomingFollowUps: getNum(
//               freshDealerData.webUpcomingFollowUps ||
//                 freshDealerData.webupcomingfollowups,
//             ),
//             webOverdueFollowUps: getNum(
//               freshDealerData.webOverdueFollowUps ||
//                 freshDealerData.weboverduefollowups,
//             ),

//             totalTestDrives: getNum(
//               freshDealerData.totalTestDrives || freshDealerData.saTestDrives,
//             ),
//             saTestDrives: saTestDrives,
//             completedTestDrives: getNum(freshDealerData.completedTestDrives),
//             uniqueTestDrives: getNum(freshDealerData.uniqueTestDrives),
//             upcomingTestDrives: getNum(freshDealerData.upcomingTestDrives),
//             closedTestDrives: getNum(freshDealerData.closedTestDrives),

//             // Web test drive fields
//             webleadsTestDrives: getNum(
//               freshDealerData.webleadsTestDrives ||
//                 freshDealerData.webleadstestdrives,
//             ),
//             webCompletedTestDrives: getNum(
//               freshDealerData.webCompletedTestDrives ||
//                 freshDealerData.webcompletedtestdrives,
//             ),
//             webUpcomingTestDrives: getNum(
//               freshDealerData.webUpcomingTestDrives ||
//                 freshDealerData.webupcomingtestdrives,
//             ),
//             webOverdueTestDrives: getNum(
//               freshDealerData.webOverdueTestDrives ||
//                 freshDealerData.weboverduetestdrives,
//             ),

//             newOrders: getNum(freshDealerData.newOrders),
//             netOrders: getNum(freshDealerData.netOrders),
//             retail: getNum(freshDealerData.retail),
//             cancellations: getNum(freshDealerData.cancellations),
//             opportunitiesConverted: getNum(
//               freshDealerData.opportunitiesConverted,
//             ),
//             enquiriesCalls: freshDealerData.enquiriesCalls || {},
//             coldCalls: freshDealerData.coldCalls || {},
//             combinedCalls: freshDealerData.combinedCalls || {},
//             callLogs: freshDealerData.callLogs || {},
//             users: freshDealerData.users || [],
//           };

//           return processedDealerData;
//         }
//       }
//     } catch (error) {
//       console.error("❌ Failed to fetch dealer users:", error);

//       if (error.response?.status === 401) {
//         safeToast.error("🔐 Session expired. Please login again.", true);
//       } else if (
//         error.code === "ECONNABORTED" ||
//         error.message.includes("Network Error")
//       ) {
//         // safeToast.error("📡 Please check your internet connection!");
//       } else {
//         // safeToast.error(`❌ ${error.message || "Failed to fetch user data"}`);
//       }

//       setDealerUsers((prev) => ({ ...prev, [id]: [] }));
//       return null;
//     } finally {
//       setLoadingUsers((prev) => ({ ...prev, [id]: false }));
//     }

//     return null;
//   };

//   // ✅ FIXED: EVENT HANDLERS - Updated with CEO logic
//   const handleFilterChange = (filter) => {
//     console.log("🔄 Filter changing to:", filter, "from:", selectedFilter);

//     // ✅ Reset the duplicate call prevention ref
//     hasFetchedInitialDataRef.current = false;

//     if (!checkInternetConnection()) return;

//     // ✅ FIX: Clear custom dates when switching AWAY from CUSTOM filter
//     if (selectedFilter === "CUSTOM" && filter !== "CUSTOM") {
//       console.log("🧹 Clearing custom dates when switching away from CUSTOM");

//       // Clear custom dates from state
//       setCustomStartDate("");
//       setCustomEndDate("");
//       setInvalidDateRange(false);

//       // Clear custom dates applied flag
//       setCustomDatesApplied(false);

//       // Also clear from localStorage when switching away from CUSTOM
//       localStorage.removeItem("customStartDate");
//       localStorage.removeItem("customEndDate");

//       // Reset custom filter pending state
//       setCustomFilterPending(false);
//     }

//     // Update filter state
//     setSelectedFilter(filter);
//     localStorage.setItem("selectedFilter", filter);
//     currentFilterRef.current = filter;

//     if (filter === "CUSTOM") {
//       console.log("⏳ Custom filter selected, waiting for Apply button click");

//       // ✅ FIX: Set custom filter pending state instead of showing toast
//       if (!customStartDate || !customEndDate || !customDatesApplied) {
//         setCustomFilterPending(true);

//         // Clear previous data for CUSTOM filter without dates
//         setDealers([]);
//         setFilteredDealers([]);
//         setSelectedDealers([]);
//         setExpandedSummaryRows(new Set());
//         setExpandedCallLogsRows(new Set());
//         setDealerUsers({});
//         setUserCallLogs({});

//         // Clear KPI data
//         setKpiData({
//           dealers: 0,
//           activeNetwork: 0,
//           users: 0,
//           activeUsers: 0,
//           leads: 0,
//           calls: 0,
//           enqCalls: 0,
//           coldCalls: 0,
//           totalFollowUps: 0,
//           uniqueTestDrives: 0,
//           completedTestDrives: 0,
//           newOrders: 0,
//           netOrders: 0,
//           retail: 0,
//           cancellations: 0,
//         });
//       }

//       // Don't fetch data automatically, wait for Apply button
//       return;
//     }

//     // For non-CUSTOM filters, clear data and fetch
//     console.log("🚀 Fetching fresh data for new filter:", filter);

//     // Reset custom filter pending state
//     setCustomFilterPending(false);

//     // Clear previous data immediately for non-CUSTOM filters
//     setDealers([]);
//     setFilteredDealers([]);
//     setSelectedDealers([]);
//     setExpandedSummaryRows(new Set());
//     setExpandedCallLogsRows(new Set());
//     setDealerUsers({});
//     setUserCallLogs({});

//     fetchDashboardData(filter);
//   };

//   const toggleSummaryRow = async (event, dealer) => {
//     event.stopPropagation();
//     if (!checkInternetConnection()) return;

//     const id = dealer.dealerId || dealer.id;
//     setExpandedSummaryRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });

//     if (!dealerUsers[id]?.length) {
//       await fetchDealerUsersData(dealer);
//     }
//   };

//   const toggleCallLogsRow = async (event, dealer) => {
//     event.stopPropagation();
//     if (!checkInternetConnection()) return;

//     const id = dealer.dealerId || dealer.id;
//     setExpandedCallLogsRows((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//         if (!dealerUsers[id]?.length) {
//           fetchDealerUsersData(dealer);
//         }
//       }
//       return newSet;
//     });
//   };

//   const expandAllSummaryRows = () => {
//     if (!checkInternetConnection()) return;
//     const allIds = new Set(
//       dealers.map((dealer) => dealer.dealerId || dealer.id),
//     );
//     setExpandedSummaryRows(allIds);
//     dealers.forEach(async (dealer) => {
//       const id = dealer.dealerId || dealer.id;
//       if (!dealerUsers[id]?.length) {
//         await fetchDealerUsersData(dealer);
//       }
//     });
//   };

//   const collapseAllSummaryRows = () => {
//     setExpandedSummaryRows(new Set());
//   };

//   const expandAllCallLogsRows = () => {
//     if (!checkInternetConnection()) return;
//     const allIds = new Set(
//       dealers.map((dealer) => dealer.dealerId || dealer.id),
//     );
//     setExpandedCallLogsRows(allIds);
//   };

//   const collapseAllCallLogsRows = () => {
//     setExpandedCallLogsRows(new Set());
//   };

//   const areAllSummaryRowsExpanded = () => {
//     return expandedSummaryRows.size === dealers.length && dealers.length > 0;
//   };

//   const areAllCallLogsRowsExpanded = () => {
//     return expandedCallLogsRows.size === dealers.length && dealers.length > 0;
//   };

//   // ✅ FIXED: applyCustomDate function - Updated with CEO logic
//   const applyCustomDate = () => {
//     if (!checkInternetConnection()) return;

//     console.log("📅 applyCustomDate called with:", {
//       customStartDate,
//       customEndDate,
//       currentFilter: selectedFilter,
//       customDatesApplied,
//     });

//     if (!customStartDate || !customEndDate) {
//       safeToast.warning("📅 Please select both start and end dates");
//       return;
//     }
//     if (new Date(customEndDate) < new Date(customStartDate)) {
//       safeToast.error("📅 End date cannot be earlier than start date");
//       return;
//     }

//     console.log(
//       "📅 Applying custom date range:",
//       customStartDate,
//       "to",
//       customEndDate,
//     );

//     // ✅ CRITICAL FIX: Save to localStorage first
//     localStorage.setItem("customStartDate", customStartDate);
//     localStorage.setItem("customEndDate", customEndDate);
//     localStorage.setItem("selectedFilter", "CUSTOM");

//     // ✅ CRITICAL FIX: Reset the duplicate call prevention ref
//     hasFetchedInitialDataRef.current = false;

//     // ✅ CRITICAL FIX: Reset custom filter pending state
//     setCustomFilterPending(false);

//     // ✅ CRITICAL FIX: Show loading toast first
//     // safeToast.info("Loading data for custom date range...");

//     // ✅ CRITICAL FIX: Clear existing data immediately
//     setDealers([]);
//     setFilteredDealers([]);
//     setSelectedDealers([]);
//     setExpandedSummaryRows(new Set());
//     setExpandedCallLogsRows(new Set());
//     setDealerUsers({});

//     // ✅ CRITICAL FIX: Direct API call with a small delay to ensure state is cleared
//     setTimeout(() => {
//       console.log(
//         "🔄 Making API call for CUSTOM filter with dates:",
//         customStartDate,
//         customEndDate,
//       );

//       // ✅ CRITICAL FIX: Update state after clearing data but before API call
//       setCustomDatesApplied(true);
//       setSelectedFilter("CUSTOM");
//       currentFilterRef.current = "CUSTOM";

//       // Fetch data
//       fetchDashboardData("CUSTOM");
//     }, 100);
//   };

//   const validateCustomDates = () => {
//     if (customStartDate && customEndDate) {
//       setInvalidDateRange(new Date(customStartDate) > new Date(customEndDate));
//     } else {
//       setInvalidDateRange(false);
//     }
//   };

//   // ✅ FIXED: Clear data when resetting custom dates
//   const resetCustomDate = () => {
//     // ✅ Reset the duplicate call prevention ref
//     hasFetchedInitialDataRef.current = false;

//     setCustomStartDate("");
//     setCustomEndDate("");
//     setSelectedFilter("LAST_WEEK");
//     setInvalidDateRange(false);

//     // ✅ NEW: Reset custom dates applied flag
//     setCustomDatesApplied(false);

//     // ✅ NEW: Reset custom filter pending state
//     setCustomFilterPending(false);

//     // Clear from localStorage
//     localStorage.removeItem("customStartDate");
//     localStorage.removeItem("customEndDate");

//     // Clear existing data
//     setDealers([]);
//     setFilteredDealers([]);
//     setSelectedDealers([]);
//     setExpandedSummaryRows(new Set());
//     setExpandedCallLogsRows(new Set());
//     setDealerUsers({});
//     setUserCallLogs({});

//     // Now fetch data for "LAST_WEEK" filter
//     handleFilterChange("LAST_WEEK");
//   };

//   // ✅ FIXED: Update refreshDashboardData to use refreshingSA state
//   const refreshDashboardData = () => {
//     console.log("🔃 Refreshing data for current filter:", selectedFilter);

//     // ✅ Set refreshing state to true
//     setRefreshingSA(true);

//     // ✅ Reset the duplicate call prevention ref
//     hasFetchedInitialDataRef.current = false;

//     if (!checkInternetConnection()) {
//       setRefreshingSA(false); // Reset if no internet
//       return;
//     }

//     // ✅ FIX: Handle CUSTOM filter differently
//     if (selectedFilter === "CUSTOM") {
//       if (!customStartDate || !customEndDate) {
//         safeToast.warning("Please apply custom dates first to refresh data");
//         setRefreshingSA(false);
//         return;
//       }

//       // For CUSTOM filter
//       safeToast.info("Refreshing custom date range data...");

//       // ❌ REMOVE: setRefreshingSA(false); <-- Don't set this here!
//       fetchDashboardData("CUSTOM").finally(() => {
//         setRefreshingSA(false); // ✅ Set to false after API completes
//       });
//       return;
//     }

//     // Don't clear data for CUSTOM filter if dates are set
//     if (selectedFilter !== "CUSTOM") {
//       setExpandedSummaryRows(new Set());
//       setExpandedCallLogsRows(new Set());
//       setDealerUsers({});
//       setUserCallLogs({});
//     }

//     // ❌ REMOVE: setRefreshingSA(false); <-- Don't set this here!
//     fetchDashboardData(selectedFilter).finally(() => {
//       setRefreshingSA(false); // ✅ Set to false after API completes
//     });
//   };

//   const toggleDealerSelection = (dealer) => {
//     const id = dealer.dealerId || dealer.id;
//     const isSelected = selectedDealers.some((d) => (d.dealerId || d.id) === id);

//     let newSelectedDealers;
//     if (isSelected) {
//       newSelectedDealers = selectedDealers.filter(
//         (d) => (d.dealerId || d.id) !== id,
//       );
//     } else {
//       newSelectedDealers = [...selectedDealers, dealer];
//     }

//     console.log("🔄 Toggling dealer selection:", {
//       dealerName: dealer.dealerName,
//       isSelected,
//       newSelectedCount: newSelectedDealers.length,
//       currentFilter: selectedFilter,
//     });

//     setSelectedDealers(newSelectedDealers);

//     if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
//       console.log("📊 Custom filter without dates, NOT fetching data");
//       safeToast.info("Please apply custom date range first.");
//       return;
//     }

//     console.log("📊 Fetching data for updated dealer selection...");
//     fetchDashboardData(selectedFilter, newSelectedDealers);
//   };

//   const toggleSelectAll = () => {
//     const isCurrentlyAllSelected =
//       selectedDealers.length === filteredDealers.length &&
//       filteredDealers.length > 0;

//     if (isCurrentlyAllSelected) {
//       console.log("📊 Deselecting all dealers");
//       setSelectedDealers([]);

//       if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
//         console.log("📊 Custom filter without dates, NOT fetching data");
//         return;
//       }

//       console.log("📊 Fetching all dealers data after deselecting...");
//       fetchDashboardData(selectedFilter, []);
//     } else {
//       console.log("📊 Selecting all dealers:", filteredDealers.length);
//       const newSelectedDealers = [...filteredDealers];
//       setSelectedDealers(newSelectedDealers);

//       if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
//         console.log("📊 Custom filter without dates, NOT fetching data");
//         safeToast.info("Please apply custom date range first.");
//         return;
//       }

//       console.log("📊 Fetching data for selected dealers...");
//       fetchDashboardData(selectedFilter, newSelectedDealers);
//     }
//   };

//   const clearSelection = () => {
//     console.log("📊 Clearing all dealer selections");
//     setSelectedDealers([]);

//     if (dealers.length > 0) {
//       setFilteredDealers([...dealers]);
//     }
//   };

//   const isDealerSelected = (dealer) => {
//     return selectedDealers.some(
//       (d) => (d.dealerId || d.id) === (dealer.dealerId || dealer.id),
//     );
//   };

//   const areAllSelected = () => {
//     return (
//       filteredDealers.length > 0 &&
//       selectedDealers.length === filteredDealers.length
//     );
//   };

//   // ✅ NEW: Temporary dealer selection handlers
//   const toggleTempDealerSelection = (dealer) => {
//     const id = dealer.dealerId || dealer.id;
//     const isSelected = tempSelectedDealers.some(
//       (d) => (d.dealerId || d.id) === id,
//     );

//     if (isSelected) {
//       setTempSelectedDealers((prev) =>
//         prev.filter((d) => (d.dealerId || d.id) !== id),
//       );
//     } else {
//       setTempSelectedDealers((prev) => [...prev, dealer]);
//     }
//   };

//   const toggleTempSelectAll = () => {
//     if (tempSelectedDealers.length === filteredDealers.length) {
//       setTempSelectedDealers([]);
//     } else {
//       setTempSelectedDealers([...filteredDealers]);
//     }
//   };

//   const clearTempSelection = () => {
//     setTempSelectedDealers([]);
//   };

//   const isDealerTempSelected = (dealer) => {
//     return tempSelectedDealers.some(
//       (d) => (d.dealerId || d.id) === (dealer.dealerId || dealer.id),
//     );
//   };

//   const areAllTempSelected = () => {
//     return (
//       filteredDealers.length > 0 &&
//       tempSelectedDealers.length === filteredDealers.length
//     );
//   };

//   const applyDealerSelection = () => {
//     console.log("📊 Applying dealer selection:", tempSelectedDealers.length);
//     setSelectedDealers([...tempSelectedDealers]);
//     setDropdownOpen(false);

//     if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
//       console.log("📊 Custom filter without dates, NOT fetching data");
//       safeToast.info("Please apply custom date range first.");
//       return;
//     }

//     fetchDashboardData(selectedFilter, tempSelectedDealers);
//   };

//   const cancelDealerSelection = () => {
//     console.log("📊 Cancelling dealer selection");
//     setTempSelectedDealers([...selectedDealers]);
//     setDropdownOpen(false);
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
//     };
//     return labels[filter] || filter;
//   };

//   const sortData = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(
//         sortDirection === "asc"
//           ? "desc"
//           : sortDirection === "desc"
//             ? "default"
//             : "asc",
//       );
//     } else {
//       setSortColumn(column);
//       setSortDirection("asc");
//     }
//   };

//   const getSortedUsers = (dealerId) => {
//     const users = dealerUsers[dealerId] ?? [];
//     return [...users].sort((a, b) => {
//       const saA = a.leads?.sa ?? 0;
//       const saB = b.leads?.sa ?? 0;
//       return saB - saA;
//     });
//   };

//   const getUserCalls = (user) => {
//     if (dealerSummaryCallsDataType === "enquiries") {
//       return user.enquiriesCalls ?? user.calls ?? {};
//     } else if (dealerSummaryCallsDataType === "coldcalls") {
//       return user.coldCalls ?? user.calls ?? {};
//     } else {
//       return user.calls ?? {};
//     }
//   };

//   const getDealerCalls = (dealer) => {
//     let calls = {};

//     switch (dealerSummaryCallsDataType) {
//       case "enquiries":
//         calls = dealer.enquiriesCalls || {};
//         break;
//       case "coldcalls":
//         calls = dealer.coldCalls || {};
//         break;
//       case "combinedCalls":
//         calls = dealer.combinedCalls || {};
//         break;
//       default:
//         calls = dealer.callLogs || {};
//         break;
//     }

//     return {
//       totalCalls: calls.totalCalls || 0,
//       outgoing: calls.outgoing || 0,
//       incoming: calls.incoming || 0,
//       connectedCalls: calls.connectedCalls || 0,
//       declined: calls.declined || 0,
//       missed: calls.missed || 0,
//       duration: calls.duration || 0,
//       callsAbove1Min: calls.callsAbove1Min || 0,
//       avgConnected: calls.avgConnected || 0,
//     };
//   };

//   const getSortedCallLogs = async (
//     dealerId,
//     dataType = null,
//     customStart = null,
//     customEnd = null,
//   ) => {
//     if (!checkInternetConnection()) return [];

//     const effectiveDataType = dataType || dealerSummaryCallsDataType;

//     try {
//       let url = "";
//       let effectiveFilter = selectedFilter;
//       let isCustomMode = false;

//       const effectiveStartDate = customStart || customStartDate;
//       const effectiveEndDate = customEnd || customEndDate;

//       if (selectedFilter === "CUSTOM") {
//         if (effectiveStartDate && effectiveEndDate) {
//           isCustomMode = true;
//         } else {
//           effectiveFilter = "LAST_WEEK";
//           console.log(
//             "⚠️ CUSTOM filter without dates, falling back to LAST_WEEK for call logs",
//           );
//         }
//       }

//       if (isCustomMode) {
//         url = `/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
//         console.log("🔗 Custom date call logs API URL:", url);
//       } else {
//         const apiFilter = mapFilterToApi(effectiveFilter);
//         url = `/generalManager/dashboard/report?dealer_id=${dealerId}&type=${apiFilter}`;
//         console.log("🔗 Standard filter call logs API URL:", url);
//       }

//       console.log("🔗 Fetching call logs from:", url);
//       const response = await api.get(url);

//       if (response.data?.status === 200 && response.data.data) {
//         let userData = [];

//         if (Array.isArray(response.data.data.dealerData)) {
//           const dealerData = response.data.data.dealerData.find(
//             (d) => (d.dealerId || d.id) === dealerId,
//           );
//           userData = dealerData?.users || [];
//         } else if (
//           response.data.data.dealerData &&
//           typeof response.data.data.dealerData === "object"
//         ) {
//           userData = response.data.data.dealerData.users || [];
//         } else if (response.data.data.users) {
//           userData = response.data.data.users || [];
//         }

//         if (userData.length > 0) {
//           const processedUsers = userData.map((user) => {
//             let calls = {};
//             switch (effectiveDataType) {
//               case "enquiries":
//                 calls = user.enquiriesCalls || {};
//                 break;
//               case "coldcalls":
//                 calls = user.coldCalls || {};
//                 break;
//               case "combinedCalls":
//                 calls = user.combinedCalls || {};
//                 break;
//               default:
//                 calls = user.calls || {};
//                 break;
//             }

//             const userCalls = {
//               total: calls.totalCalls || calls.total || 0,
//               outgoing: calls.outgoing || 0,
//               incoming: calls.incoming || 0,
//               connected: calls.connectedCalls || calls.connected || 0,
//               declined: calls.declined || 0,
//               duration: calls.durationSec || calls.duration || 0,
//               avgConnected: calls.avgConnected || 0,
//               callsAbove1Min: calls.callsAbove1Min || 0,
//               durationMin: calls.durationMin || 0,
//               callsAbove1MinCount: calls.callsAbove1Min || 0,
//             };

//             return {
//               userId: user.user_id || user.id || `user-${Math.random()}`,
//               name: user.user || user.name || "Unknown User",
//               user_role: user.user_role || "User",
//               calls: userCalls,
//               enquiriesCalls: user.enquiriesCalls || {},
//               coldCalls: user.coldCalls || {},
//               combinedCalls: user.combinedCalls || {},
//               rawCalls: calls,
//             };
//           });

//           const sorted = processedUsers.sort(
//             (a, b) => (b.calls.total || 0) - (a.calls.total || 0),
//           );
//           return sorted;
//         } else {
//           console.log("⚠️ No user data found in call logs response");
//           return [];
//         }
//       } else {
//         console.log("⚠️ No valid data in call logs API response");
//         return [];
//       }
//     } catch (error) {
//       console.error("❌ API call failed:", error);

//       if (error.response?.status === 401) {
//         safeToast.error("🔐 Session expired. Please login again.", true);
//       } else if (error.response?.status !== 401) {
//         if (
//           error.code === "ECONNABORTED" ||
//           error.message.includes("Network Error")
//         ) {
//           // safeToast.error("📡 Please check your internet connection!");
//         } else {
//           safeToast.error("Failed to fetch call logs");
//         }
//       }
//       return [];
//     }
//   };

//   const formatDuration = (sec) => {
//     if (!sec || sec === 0) return "00:00:00";
//     const h = Math.floor(sec / 3600)
//       .toString()
//       .padStart(2, "0");
//     const m = Math.floor((sec % 3600) / 60)
//       .toString()
//       .padStart(2, "0");
//     const s = Math.floor(sec % 60)
//       .toString()
//       .padStart(2, "0");
//     return `${h}:${m}:${s}`;
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

//   const getSortedDealersForCallLogs = () => {
//     const list = selectedDealers.length > 0 ? selectedDealers : dealers;
//     return [...list].sort((a, b) => {
//       const totalA = getDealerCalls(a)?.totalCalls ?? 0;
//       const totalB = getDealerCalls(b)?.totalCalls ?? 0;
//       return totalB - totalA;
//     });
//   };

//   return (
//     <div className="dashboard-container w-full min-h-screen bg-gray-50">
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
//         style={{ zIndex: 9999 }}
//       />

//       {isLoading && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="spinner w-10 h-10 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
//         </div>
//       )}

//       <div className="content-section active w-full">
//         <main className="main-content p-2">
//           <div className="mb-2">
//             <FilterBar
//               isSticky={isSticky}
//               userRole={userRole}
//               selectedFilter={selectedFilter}
//               customStartDate={customStartDate}
//               customEndDate={customEndDate}
//               invalidDateRange={invalidDateRange}
//               dealerSearch={dealerSearch}
//               selectedDealers={selectedDealers}
//               tempSelectedDealers={tempSelectedDealers}
//               dropdownOpen={dropdownOpen}
//               setDropdownOpen={setDropdownOpen}
//               getFilterLabel={getFilterLabel}
//               onFilterChange={handleFilterChange}
//               onCustomStartDateChange={setCustomStartDate}
//               onCustomEndDateChange={setCustomEndDate}
//               onDealerSearchChange={setDealerSearch}
//               onValidateCustomDates={validateCustomDates}
//               onApplyCustomDate={applyCustomDate}
//               onResetCustomDate={resetCustomDate}
//               onRefresh={refreshDashboardData}
//               refreshingSA={refreshingSA} // ✅ FIXED: Now passing the refreshingSA state
//               dealers={dealers}
//               filteredDealers={filteredDealers}
//               isDealerSelected={isDealerSelected}
//               isDealerTempSelected={isDealerTempSelected}
//               areAllSelected={areAllSelected}
//               areAllTempSelected={areAllTempSelected}
//               onToggleDealerSelection={toggleDealerSelection}
//               onToggleTempDealerSelection={toggleTempDealerSelection}
//               onToggleSelectAll={toggleSelectAll}
//               onToggleTempSelectAll={toggleTempSelectAll}
//               onClearSelection={clearSelection}
//               onClearTempSelection={clearTempSelection}
//               onApplyDealerSelection={applyDealerSelection}
//               onCancelDealerSelection={cancelDealerSelection}
//               // ✅ NEW: Pass customDatesApplied to FilterBar
//               customDatesApplied={customDatesApplied}
//               // ✅ NEW: Pass customFilterPending to FilterBar
//               customFilterPending={customFilterPending}
//             />
//           </div>

//           <div className="mb-2">
//             <KpiSection
//               kpiData={kpiData}
//               // ✅ NEW: Pass customFilterPending to show message in KPI section
//               customFilterPending={customFilterPending}
//             />
//           </div>

//           <div className="mb-4">
//             <DealerSummaryTable
//               key={`summary-${selectedFilter}-${dealers.length}`}
//               dealers={getSortedDealersForSummary()}
//               selectedDealers={selectedDealers}
//               tableLength={table1Length}
//               setTableLength={setTable1Length}
//               expandedSummaryRows={expandedSummaryRows}
//               dealerUsers={dealerUsers}
//               loadingUsers={loadingUsers}
//               sortColumn={sortColumn}
//               sortDirection={sortDirection}
//               onToggleSummaryRow={toggleSummaryRow}
//               onSortData={sortData}
//               onGetSortedUsers={getSortedUsers}
//               onFetchDealerUsers={fetchDealerUsersData}
//               onExpandAllSummaryRows={expandAllSummaryRows}
//               onCollapseAllSummaryRows={collapseAllSummaryRows}
//               selectedFilter={selectedFilter}
//               customStartDate={customStartDate}
//               customEndDate={customEndDate}
//               areAllSummaryRowsExpanded={areAllSummaryRowsExpanded}
//               // ✅ NEW: Pass customDatesApplied
//               customDatesApplied={customDatesApplied}
//               // ✅ NEW: Pass customFilterPending to show message in table
//               customFilterPending={customFilterPending}
//             />

//             <CallLogsTable
//               dealers={getSortedDealersForCallLogs()}
//               selectedDealers={selectedDealers}
//               tableLength={table2Length}
//               setTableLength={setTable2Length}
//               expandedCallLogsRows={expandedCallLogsRows}
//               userCallLogs={userCallLogs}
//               loadingUsers={false}
//               dealerSummaryCallsViewType={dealerSummaryCallsViewType}
//               dealerSummaryCallsDataType={dealerSummaryCallsDataType}
//               modalCallsDataType={modalCallsDataType}
//               onToggleCallLogsRow={toggleCallLogsRow}
//               onSetDealerSummaryCallsViewType={setDealerSummaryCallsViewType}
//               onSetDealerSummaryCallsDataType={setDealerSummaryCallsDataType}
//               onSetModalCallsDataType={setModalCallsDataType}
//               onGetDealerCalls={getDealerCalls}
//               onGetSortedCallLogs={getSortedCallLogs}
//               onFormatDuration={formatDuration}
//               onExpandAllCallLogsRows={expandAllCallLogsRows}
//               onCollapseAllCallLogsRows={collapseAllCallLogsRows}
//               areAllCallLogsRowsExpanded={areAllCallLogsRowsExpanded}
//               // ✅ NEW: Pass customDatesApplied
//               customDatesApplied={customDatesApplied}
//               // ✅ NEW: Pass customFilterPending to show message in table
//               customFilterPending={customFilterPending}
//             />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
// export default Dashboard;
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Import components
import KpiSection from "./Components/KpiSection/KpiSection";
import FilterBar from "./Components/Header/FilterBar";
import DealerSummaryTable from "./Components/DealerSummaryTable/DealerSummaryTable";
import CallLogsTable from "./Components/CallLogsTable/CallLogsTable";

import api from "../../utils/axiosInterceptor";
const Dashboard = () => {
  const navigate = useNavigate();

  // State declarations
  const [selectedFilter, setSelectedFilter] = useState("LAST_WEEK");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [invalidDateRange, setInvalidDateRange] = useState(false);
  const [dealerSearch, setDealerSearch] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);

  // ✅ NEW: Temporary dealer selection state
  const [tempSelectedDealers, setTempSelectedDealers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // ✅ FIXED: Add refreshingSA state for the refresh button
  const [refreshingSA, setRefreshingSA] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [userRole, setUserRole] = useState("GM");
  const [isSticky, setIsSticky] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const lastToastTimeRef = useRef(0);
  let lastScrollY = 0;

  const [shouldAutoFetchCustom, setShouldAutoFetchCustom] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);

  // ✅ NEW: Add these states from CEO dashboard
  const [customDatesApplied, setCustomDatesApplied] = useState(false);
  const [hasCheckedSavedDates, setHasCheckedSavedDates] = useState(false);

  // ✅ NEW: Add these refs from CEO dashboard
  const hasFetchedInitialDataRef = useRef(false);
  const currentFilterRef = useRef("LAST_WEEK");

  // Data state
  const [kpiData, setKpiData] = useState({
    dealers: 0,
    activeNetwork: 0,
    users: 0,
    activeUsers: 0,
    leads: 0,
    calls: 0,
  });

  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [dealerUsers, setDealerUsers] = useState({});
  const [userCallLogs, setUserCallLogs] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});

  const [expandedSummaryRows, setExpandedSummaryRows] = useState(new Set());
  const [expandedCallLogsRows, setExpandedCallLogsRows] = useState(new Set());
  const [sortColumn, setSortColumn] = useState("saLeads");
  const [sortDirection, setSortDirection] = useState("desc");
  const [table1Length, setTable1Length] = useState(10);
  const [table2Length, setTable2Length] = useState(10);
  const [dealerSummaryCallsViewType, setDealerSummaryCallsViewType] =
    useState("table");
  const [dealerSummaryCallsDataType, setDealerSummaryCallsDataType] =
    useState("combinedCalls");
  const [modalCallsDataType, setModalCallsDataType] = useState("combinedCalls");

  // ✅ NEW: State to track if custom filter is selected but dates not applied
  const [customFilterPending, setCustomFilterPending] = useState(false);

  // ✅ FIXED: Initialize with all dealers selected on first load
  useEffect(() => {
    if (dealers.length > 0 && selectedDealers.length === 0) {
      console.log("📊 Initializing with all dealers selected");
      setSelectedDealers([...dealers]);
      setTempSelectedDealers([...dealers]);
    }
  }, [dealers.length, selectedDealers.length]);

  // Keep the existing sync effect:
  useEffect(() => {
    if (dropdownOpen) {
      setTempSelectedDealers([...selectedDealers]);
    }
  }, [dropdownOpen, selectedDealers]);

  const handleLogout = () => {
    // console.log("🔐 Session expired. Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("selectedFilter");
    localStorage.removeItem("customStartDate");
    localStorage.removeItem("customEndDate");
    sessionStorage.clear();
    if (api.defaults.headers.common["Authorization"]) {
      delete api.defaults.headers.common["Authorization"];
    }
    setTimeout(() => {
      navigate("/login");
      toast.info("Session expired. Please login again.");
    }, 1000);
  };

  const safeToast = {
    success: (message) => {
      try {
        const now = Date.now();
        if (now - lastToastTimeRef.current > 1000) {
          toast.success(message);
          lastToastTimeRef.current = now;
        }
      } catch (error) {
        // console.log("Toast error:", error);
      }
    },
    error: (message, isSessionExpired = false) => {
      try {
        const now = Date.now();
        if (now - lastToastTimeRef.current > 3000) {
          toast.error(message);
          lastToastTimeRef.current = now;
          if (isSessionExpired) {
            setTimeout(() => {
              handleLogout();
            }, 2000);
          }
        }
      } catch (error) {
        // console.log("Toast error:", error);
      }
    },
    warning: (message) => {
      try {
        const now = Date.now();
        if (now - lastToastTimeRef.current > 2000) {
          toast.warning(message);
          lastToastTimeRef.current = now;
        }
      } catch (error) {
        // console.log("Toast error:", error);
      }
    },
    info: (message) => {
      try {
        const now = Date.now();
        if (now - lastToastTimeRef.current > 2000) {
          toast.info(message);
          lastToastTimeRef.current = now;
        }
      } catch (error) {
        // console.log("Toast error:", error);
      }
    },
  };

  // Internet connection monitoring
  useEffect(() => {
    const handleOnline = () => {
      // console.log("✅ Internet connection restored");
      setIsOnline(true);
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        // safeToast.success("🌐 Internet connection restored!");
        lastToastTimeRef.current = now;
      }
    };

    const handleOffline = () => {
      // console.log("❌ Internet connection lost");
      setIsOnline(false);
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        // safeToast.error("📡 Please check your internet connection!");
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
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      if (scrollDirection === "up" && current > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      lastScrollY = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollDirection]);

  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      const now = Date.now();
      if (now - lastToastTimeRef.current > 3000) {
        // safeToast.error("📡 Please check your internet connection!");
        lastToastTimeRef.current = now;
      }
      return false;
    }
    return true;
  };

  // ✅ FIXED: Check saved dates on initial mount - LIKE CEO DASHBOARD
  useEffect(() => {
    console.log("🔍 Checking saved dates from localStorage...");

    const savedFilter = localStorage.getItem("selectedFilter") || "LAST_WEEK";
    const savedStartDate = localStorage.getItem("customStartDate");
    const savedEndDate = localStorage.getItem("customEndDate");

    console.log("📋 Saved filter:", savedFilter);
    console.log("📅 Saved dates:", savedStartDate, savedEndDate);

    // Set initial states from localStorage
    setSelectedFilter(savedFilter);
    currentFilterRef.current = savedFilter;

    // Only set custom dates if CUSTOM filter is saved WITH dates
    if (savedFilter === "CUSTOM" && savedStartDate && savedEndDate) {
      console.log("✅ Found saved CUSTOM dates, marking as applied");
      setCustomStartDate(savedStartDate);
      setCustomEndDate(savedEndDate);
      setCustomDatesApplied(true);
      // Mark that we should auto-fetch custom data
      setShouldAutoFetchCustom(true);
      setCustomFilterPending(false);
    } else if (savedFilter === "CUSTOM" && (!savedStartDate || !savedEndDate)) {
      // ✅ FIX: If CUSTOM is selected but no dates are saved, reset to LAST_WEEK
      console.log(
        "⚠️ CUSTOM filter selected but no dates found, resetting to LAST_WEEK",
      );
      setSelectedFilter("LAST_WEEK");
      currentFilterRef.current = "LAST_WEEK";
      localStorage.setItem("selectedFilter", "LAST_WEEK");
      setShouldAutoFetchCustom(false);
      setCustomFilterPending(false);
    }

    setHasCheckedSavedDates(true);
  }, []);

  // ✅ FIXED: Main initialization - RUNS AFTER saved dates are checked
  useEffect(() => {
    if (!hasCheckedSavedDates) {
      console.log("⏳ Waiting for saved dates check...");
      return;
    }

    console.log("🚀 Starting main initialization...");
    console.log("📊 Current filter:", selectedFilter);
    console.log("✅ Custom dates applied:", customDatesApplied);
    console.log("🔄 Should auto-fetch custom:", shouldAutoFetchCustom);

    // ✅ FIX: Allow CUSTOM filter to bypass duplicate check when dates are applied
    const isCustomWithDates = selectedFilter === "CUSTOM" && customDatesApplied;

    // Prevent duplicate calls for non-CUSTOM filters
    if (hasFetchedInitialDataRef.current && !isCustomWithDates) {
      console.log("⚠️ Already fetched initial data, skipping...");
      return;
    }

    // ✅ FIX: Handle ALL filters including CUSTOM properly
    if (selectedFilter === "CUSTOM" && shouldAutoFetchCustom) {
      console.log("🔄 Fetching data for saved CUSTOM filter...");

      // Clear any existing data
      setDealers([]);
      setFilteredDealers([]);
      setSelectedDealers([]);
      setExpandedSummaryRows(new Set());
      setExpandedCallLogsRows(new Set());
      setDealerUsers({});
      setUserCallLogs({});

      // Fetch data
      fetchDashboardData("CUSTOM");

      hasFetchedInitialDataRef.current = true;
      setShouldAutoFetchCustom(false);
      return;
    }

    // Handle other filters
    console.log("🔄 Fetching data for filter:", selectedFilter);
    fetchDashboardData(selectedFilter);

    hasFetchedInitialDataRef.current = true;
  }, [hasCheckedSavedDates, selectedFilter, shouldAutoFetchCustom]);

  // Filter dealers based on search
  useEffect(() => {
    if (!dealerSearch.trim()) {
      setFilteredDealers(dealers);
    } else {
      const search = dealerSearch.toLowerCase();
      setFilteredDealers(
        dealers.filter(
          (d) =>
            d.dealerName?.toLowerCase().includes(search) ||
            d.name?.toLowerCase().includes(search),
        ),
      );
    }
  }, [dealerSearch, dealers]);

  // ✅ NEW: Effect to validate custom dates when they change
  useEffect(() => {
    validateCustomDates();
  }, [customStartDate, customEndDate]);

  // API Functions
  const mapFilterToApi = (filter) => {
    const filterMap = {
      DAY: "DAY",
      YESTERDAY: "YESTERDAY",
      WEEK: "WEEK",
      LAST_WEEK: "LAST_WEEK",
      MTD: "MTD",
      LAST_MONTH: "LAST_MONTH",
      QTD: "QTD",
      LAST_QUARTER: "LAST_QUARTER",
      SIX_MONTH: "SIX_MONTH",
      YTD: "YTD",
      LIFETIME: "LIFETIME",
      CUSTOM: "CUSTOM",
    };
    return filterMap[filter] || "LAST_WEEK";
  };

  // Data processing function
  const processDealerData = (apiResponse) => {
    if (!apiResponse?.data) {
      console.log("❌ No data in API response");
      return [];
    }

    const { data } = apiResponse;
    console.log(
      "🔧 Processing API data for filter:",
      currentFilterRef.current,
      data,
    );

    let dealerData = [];

    if (Array.isArray(data.dealerData)) {
      dealerData = data.dealerData;
    } else if (data.dealerData && typeof data.dealerData === "object") {
      dealerData = [data.dealerData];
    } else if (data.dealerId || data.dealerName) {
      dealerData = [data];
    } else if (Array.isArray(data)) {
      dealerData = data;
    } else {
      console.log(
        "⚠️ No dealer data found in response structure:",
        Object.keys(data),
      );
      dealerData = [];
    }

    if (dealerData.length === 0) {
      console.log("⚠️ No dealer data found in response");
      return [];
    }

    const processedDealers = dealerData.map((dealer, index) => {
      const getNum = (value, fallback = 0) => {
        if (value === null || value === undefined || value === "")
          return fallback;
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      // Extract web values properly
      const webleads = getNum(dealer.webleads) || getNum(dealer.webLeads) || 0;
      const webleadsFollowUps =
        getNum(dealer.webleadsFollowUps) ||
        getNum(dealer.webleadsfollowups) ||
        0;
      const saTestDrives =
        getNum(dealer.saTestDrives) || getNum(dealer.satestdrives) || 0;

      const dealerObj = {
        dealerId: dealer.dealerId || dealer.id || `dealer-${index}`,
        dealerName: dealer.dealerName || dealer.name || "Unknown Dealer",
        id: dealer.dealerId || dealer.id || `dealer-${index}`,
        name: dealer.dealerName || dealer.name || "Unknown Dealer",
        totalUsers: getNum(dealer.totalUsers),
        registerUsers: getNum(dealer.registerUsers),
        activeUsers: getNum(dealer.activeUsers),
        totalLeads: getNum(dealer.totalLeads),
        saLeads: getNum(dealer.saLeads),
        webleads: webleads,
        manuallyEnteredLeads: getNum(dealer.manuallyEnteredLeads),
        totalFollowUps: getNum(dealer.totalFollowUps),
        saFollowUps: getNum(dealer.saFollowUps),
        webleadsFollowUps: webleadsFollowUps,
        completedFollowUps: getNum(dealer.completedFollowUps),
        openFollowUps: getNum(dealer.openFollowUps),
        closedFollowUps: getNum(dealer.closedFollowUps),

        // Web followup fields
        webCompletedFollowUps: getNum(
          dealer.webCompletedFollowUps || dealer.webcompletedfollowups,
        ),
        webUpcomingFollowUps: getNum(
          dealer.webUpcomingFollowUps || dealer.webupcomingfollowups,
        ),
        webOverdueFollowUps: getNum(
          dealer.webOverdueFollowUps || dealer.weboverduefollowups,
        ),

        totalTestDrives: getNum(dealer.totalTestDrives || dealer.saTestDrives),
        saTestDrives: saTestDrives,
        completedTestDrives: getNum(dealer.completedTestDrives),
        uniqueTestDrives: getNum(dealer.uniqueTestDrives),
        upcomingTestDrives: getNum(dealer.upcomingTestDrives),
        closedTestDrives: getNum(dealer.closedTestDrives),

        // Web test drive fields
        webleadsTestDrives: getNum(
          dealer.webleadsTestDrives || dealer.webleadstestdrives,
        ),
        webCompletedTestDrives: getNum(
          dealer.webCompletedTestDrives || dealer.webcompletedtestdrives,
        ),
        webUpcomingTestDrives: getNum(
          dealer.webUpcomingTestDrives || dealer.webupcomingtestdrives,
        ),
        webOverdueTestDrives: getNum(
          dealer.webOverdueTestDrives || dealer.weboverduetestdrives,
        ),

        newOrders: getNum(dealer.newOrders),
        netOrders: getNum(dealer.netOrders),
        retail: getNum(dealer.retail),
        cancellations: getNum(dealer.cancellations),
        opportunitiesConverted: getNum(dealer.opportunitiesConverted),
        enquiriesCalls: dealer.enquiriesCalls || {},
        coldCalls: dealer.coldCalls || {},
        combinedCalls: dealer.combinedCalls || {},
        callLogs: dealer.callLogs || {},
        users: dealer.users || [],
      };

      console.log(`🏪 Processed dealer ${index}:`, {
        name: dealerObj.dealerName,
        saLeads: dealerObj.saLeads,
        webleads: dealerObj.webleads,
        saFollowUps: dealerObj.saFollowUps,
        webleadsFollowUps: dealerObj.webleadsFollowUps,
        totalTestDrives: dealerObj.totalTestDrives,
        saTestDrives: dealerObj.saTestDrives,
        webCompletedTestDrives: dealerObj.webCompletedTestDrives,
        webUpcomingTestDrives: dealerObj.webUpcomingTestDrives,
        webOverdueTestDrives: dealerObj.webOverdueTestDrives,
      });

      return dealerObj;
    });

    console.log(
      "🎉 Processed dealers for filter:",
      currentFilterRef.current,
      processedDealers,
    );
    return processedDealers;
  };

  // 🔴 FIXED: MAIN DASHBOARD DATA FETCH - Updated to handle direct dates
  const fetchDashboardData = async (
    filterType,
    dealersToUse = null,
    directStartDate = null,
    directEndDate = null,
  ) => {
    // Use direct dates if provided, otherwise use state
    const effectiveStartDate = directStartDate || customStartDate;
    const effectiveEndDate = directEndDate || customEndDate;

    // 🔴 FIXED: For CUSTOM filter, don't show toast, just set pending state
    if (filterType === "CUSTOM") {
      if (!effectiveStartDate || !effectiveEndDate) {
        console.log(
          "⏸️ CUSTOM filter selected but dates are empty, skipping fetch",
        );
        // Set pending state to show message in table UI
        setCustomFilterPending(true);
        return;
      }
    }

    // If we're switching from CUSTOM pending to another filter, reset the pending state
    if (filterType !== "CUSTOM" && customFilterPending) {
      setCustomFilterPending(false);
    }

    if (!checkInternetConnection()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    currentFilterRef.current = filterType;

    const effectiveDealers =
      dealersToUse !== null ? dealersToUse : selectedDealers;

    console.log("🌐 Fetching data for filter:", filterType);
    console.log("📊 Effective dealers count:", effectiveDealers.length);

    try {
      let url = "";
      const isCustomMode =
        filterType === "CUSTOM" && effectiveStartDate && effectiveEndDate;
      const apiFilterType = mapFilterToApi(filterType);

      // Build URL based on selection
      if (effectiveDealers.length === 0) {
        url = isCustomMode
          ? `/generalManager/dashboard/report?start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`
          : `/generalManager/dashboard/report?type=${apiFilterType}`;
      } else if (effectiveDealers.length === 1) {
        const dealerId = effectiveDealers[0].dealerId || effectiveDealers[0].id;
        url = isCustomMode
          ? `/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`
          : `/generalManager/dashboard/report?dealer_id=${dealerId}&type=${apiFilterType}`;
      } else {
        const dealerIds = effectiveDealers
          .map((d) => d.dealerId || d.id)
          .join(",");
        url = isCustomMode
          ? `/generalManager/dashboard/report?dealerIds=${dealerIds}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`
          : `/generalManager/dashboard/report?dealerIds=${dealerIds}&type=${apiFilterType}`;
      }

      console.log("🔗 API URL:", url);

      const response = await api.get(url);
      console.log("📥 Full API Response:", response.data);

      if (response.data?.status === 200 && response.data.data) {
        console.log("✅ API Success - Processing data...");
        const updatedDealers = processDealerData(response.data);

        if (updatedDealers.length === 0) {
          console.log("⚠️ No dealers after processing");
          // safeToast.warning("📊 No dealer data found for selected filter");
          setDealers([]);
          setFilteredDealers([]);
          setKpiData({
            dealers: 0,
            activeNetwork: 0,
            users: 0,
            activeUsers: 0,
            leads: 0,
            calls: 0,
            totalFollowUps: 0,
            uniqueTestDrives: 0,
            completedTestDrives: 0,
            newOrders: 0,
            netOrders: 0,
            retail: 0,
            cancellations: 0,
          });
        } else {
          const sortedDealers = [...updatedDealers].sort(
            (a, b) => (b.saLeads ?? 0) - (a.saLeads ?? 0),
          );

          console.log("✅ Setting dealers state:", sortedDealers.length);
          setDealers(sortedDealers);
          setFilteredDealers(sortedDealers);

          const overview = response.data.data.overview || {};
          const kpiUpdate = {
            dealers: overview.dealers || sortedDealers.length,
            activeNetwork: overview.activeNetwork || sortedDealers.length,
            users: overview.users || 0,
            activeUsers: overview.activeUsers || 0,
            leads: overview.leads || 0,
            calls: overview.calls || 0,
            enqCalls: overview.enqCalls || 0,
            coldCalls: overview.coldCalls || 0,
            totalFollowUps: overview.totalFollowUps || 0,
            uniqueTestDrives: overview.uniqueTestDrives || 0,
            completedTestDrives: overview.completedTestDrives || 0,
            newOrders: overview.newOrders || 0,
            netOrders: overview.netOrders || 0,
            retail: overview.retail || 0,
            cancellations: overview.cancellations || 0,
            // ✅ ADD THESE WEB FIELDS:
            webLeads: overview.webLeads || 0,
            webFollowUps: overview.webFollowUps || 0,
            webTestDrives: overview.webTestDrives || 0,
            webCompletedTestDrives: overview.webCompletedTestDrives || 0,
          };

          setKpiData(kpiUpdate);
          setHasInitialData(true);
          console.log("✅ Data successfully loaded");
        }
      }
    } catch (error) {
      console.error("❌ API failed:", error);

      if (error.response?.status === 401) {
        safeToast.error("🔐 Session expired. Please login again.", true);
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        // safeToast.error("📡 Please check your internet connection!");
      } else {
        // safeToast.error(`❌ ${error.message || "Failed to fetch data"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDealerUsersData = async (
    dealer,
    filterType = null,
    customStart = null,
    customEnd = null,
  ) => {
    if (!checkInternetConnection()) return null;

    const id = dealer.dealerId || dealer.id;
    if (!id) {
      console.error("❌ No dealer ID provided:", dealer);
      return null;
    }

    const effectiveFilter = filterType || selectedFilter;
    setLoadingUsers((prev) => ({ ...prev, [id]: true }));

    try {
      let url = "";
      let finalFilter = effectiveFilter;
      let isCustomMode = false;

      const effectiveStartDate = customStart || customStartDate;
      const effectiveEndDate = customEnd || customEndDate;

      if (effectiveFilter === "CUSTOM") {
        if (effectiveStartDate && effectiveEndDate) {
          isCustomMode = true;
        } else {
          finalFilter = "LAST_WEEK";
          console.log(
            "⚠️ CUSTOM filter without dates, falling back to LAST_WEEK",
          );
        }
      }

      const apiFilter = mapFilterToApi(finalFilter);

      if (isCustomMode) {
        url = `/generalManager/dashboard/report?dealer_id=${id}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
        console.log("🔗 Custom date API URL:", url);
      } else {
        url = `/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilter}`;
        console.log("🔗 Standard filter API URL:", url);
      }

      console.log("🔗 Fetching dealer users from:", url);

      const response = await api.get(url);

      if (response.data?.status === 200 && response.data.data) {
        let userData = [];
        let freshDealerData = null;

        if (Array.isArray(response.data.data.dealerData)) {
          freshDealerData = response.data.data.dealerData.find(
            (d) => (d.dealerId || d.id) === id,
          );
          userData = freshDealerData?.users || [];
        } else if (
          response.data.data.dealerData &&
          typeof response.data.data.dealerData === "object"
        ) {
          freshDealerData = response.data.data.dealerData;
          userData = response.data.data.dealerData.users || [];
        } else if (response.data.data.users) {
          userData = response.data.data.users || [];
          freshDealerData = response.data.data;
        }

        if (userData.length > 0) {
          // Helper function to extract numeric values
          const getNum = (value, fallback = 0) => {
            if (value === null || value === undefined || value === "")
              return fallback;
            const num = Number(value);
            return isNaN(num) ? fallback : num;
          };

          const processedUsers = userData.map((user) => ({
            user_id: user.user_id,
            user: user.user,
            user_role: user.user_role,
            registerUser:
              user.registerUser !== undefined ? user.registerUser : true,
            active: user.active !== undefined ? user.active : false,
            last_login: user.last_login || null,

            // Leads with web values
            leads: {
              sa: getNum(user.leads?.sa),
              manuallyEntered: getNum(user.leads?.manuallyEntered),
              webleads:
                getNum(user.leads?.webleads) || getNum(user.webleads) || 0,
            },

            // Followups with web values
            followups: {
              sa: getNum(user.followups?.sa),
              completed: getNum(user.followups?.completed),
              open: getNum(user.followups?.open),
              closed: getNum(user.followups?.closed),
              webleadsFollowUps:
                getNum(user.followups?.webleadsFollowUps) ||
                getNum(user.webleadsFollowUps) ||
                0,
              webCompletedFollowUps:
                getNum(user.followups?.webCompletedFollowUps) ||
                getNum(user.webCompletedFollowUps) ||
                0,
              webUpcomingFollowUps:
                getNum(user.followups?.webUpcomingFollowUps) ||
                getNum(user.webUpcomingFollowUps) ||
                0,
              webOverdueFollowUps:
                getNum(user.followups?.webOverdueFollowUps) ||
                getNum(user.webOverdueFollowUps) ||
                0,
            },

            // Test drives with web values
            testdrives: {
              sa: getNum(user.testdrives?.sa),
              total:
                getNum(user.testdrives?.total) ||
                getNum(user.testdrives?.sa) ||
                0,
              completed: getNum(user.testdrives?.completed),
              unique: getNum(user.testdrives?.unique),
              upcoming: getNum(user.testdrives?.upcoming),
              closed: getNum(user.testdrives?.closed),
              webleadsTestDrives:
                getNum(user.testdrives?.webleadsTestDrives) ||
                getNum(user.webleadsTestDrives) ||
                0,
              webCompletedTestDrives:
                getNum(user.testdrives?.webCompletedTestDrives) ||
                getNum(user.webCompletedTestDrives) ||
                0,
              webUpcomingTestDrives:
                getNum(user.testdrives?.webUpcomingTestDrives) ||
                getNum(user.webUpcomingTestDrives) ||
                0,
              webOverdueTestDrives:
                getNum(user.testdrives?.webOverdueTestDrives) ||
                getNum(user.webOverdueTestDrives) ||
                0,
              planned_not_completed:
                getNum(user.testdrives?.planned_not_completed) || 0,
            },

            newOrders: getNum(user.newOrders),
            netOrders: getNum(user.netOrders),
            retail: getNum(user.retail),
            cancellations: getNum(user.cancellations),
            opportunitiesConverted: getNum(user.opportunitiesConverted),
            enquiriesCalls: user.enquiriesCalls || {},
            coldCalls: user.coldCalls || {},
          }));

          setDealerUsers((prev) => ({ ...prev, [id]: processedUsers }));
        }

        if (freshDealerData) {
          console.log(
            "✅ Returning fresh dealer data:",
            freshDealerData.dealerName || freshDealerData.name,
          );

          // Add getNum helper function inside this scope
          const getNum = (value, fallback = 0) => {
            if (value === null || value === undefined || value === "")
              return fallback;
            const num = Number(value);
            return isNaN(num) ? fallback : num;
          };

          // Extract web values from freshDealerData
          const webleads =
            getNum(freshDealerData.webleads) ||
            getNum(freshDealerData.webLeads) ||
            0;
          const webleadsFollowUps =
            getNum(freshDealerData.webleadsFollowUps) ||
            getNum(freshDealerData.webleadsfollowups) ||
            0;
          const saTestDrives =
            getNum(freshDealerData.saTestDrives) ||
            getNum(freshDealerData.satestdrives) ||
            0;

          const processedDealerData = {
            dealerId: freshDealerData.dealerId || freshDealerData.id || id,
            dealerName:
              freshDealerData.dealerName ||
              freshDealerData.name ||
              dealer.dealerName ||
              dealer.name,
            id: freshDealerData.dealerId || freshDealerData.id || id,
            name:
              freshDealerData.dealerName ||
              freshDealerData.name ||
              dealer.dealerName ||
              dealer.name,
            totalUsers: getNum(freshDealerData.totalUsers),
            registerUsers: getNum(freshDealerData.registerUsers),
            activeUsers: getNum(freshDealerData.activeUsers),
            totalLeads: getNum(freshDealerData.totalLeads),
            saLeads: getNum(freshDealerData.saLeads),
            webleads: webleads,
            manuallyEnteredLeads: getNum(freshDealerData.manuallyEnteredLeads),
            totalFollowUps: getNum(freshDealerData.totalFollowUps),
            saFollowUps: getNum(freshDealerData.saFollowUps),
            webleadsFollowUps: webleadsFollowUps,
            completedFollowUps: getNum(freshDealerData.completedFollowUps),
            openFollowUps: getNum(freshDealerData.openFollowUps),
            closedFollowUps: getNum(freshDealerData.closedFollowUps),

            // Web followup fields
            webCompletedFollowUps: getNum(
              freshDealerData.webCompletedFollowUps ||
                freshDealerData.webcompletedfollowups,
            ),
            webUpcomingFollowUps: getNum(
              freshDealerData.webUpcomingFollowUps ||
                freshDealerData.webupcomingfollowups,
            ),
            webOverdueFollowUps: getNum(
              freshDealerData.webOverdueFollowUps ||
                freshDealerData.weboverduefollowups,
            ),

            totalTestDrives: getNum(
              freshDealerData.totalTestDrives || freshDealerData.saTestDrives,
            ),
            saTestDrives: saTestDrives,
            completedTestDrives: getNum(freshDealerData.completedTestDrives),
            uniqueTestDrives: getNum(freshDealerData.uniqueTestDrives),
            upcomingTestDrives: getNum(freshDealerData.upcomingTestDrives),
            closedTestDrives: getNum(freshDealerData.closedTestDrives),

            // Web test drive fields
            webleadsTestDrives: getNum(
              freshDealerData.webleadsTestDrives ||
                freshDealerData.webleadstestdrives,
            ),
            webCompletedTestDrives: getNum(
              freshDealerData.webCompletedTestDrives ||
                freshDealerData.webcompletedtestdrives,
            ),
            webUpcomingTestDrives: getNum(
              freshDealerData.webUpcomingTestDrives ||
                freshDealerData.webupcomingtestdrives,
            ),
            webOverdueTestDrives: getNum(
              freshDealerData.webOverdueTestDrives ||
                freshDealerData.weboverduetestdrives,
            ),

            newOrders: getNum(freshDealerData.newOrders),
            netOrders: getNum(freshDealerData.netOrders),
            retail: getNum(freshDealerData.retail),
            cancellations: getNum(freshDealerData.cancellations),
            opportunitiesConverted: getNum(
              freshDealerData.opportunitiesConverted,
            ),
            enquiriesCalls: freshDealerData.enquiriesCalls || {},
            coldCalls: freshDealerData.coldCalls || {},
            combinedCalls: freshDealerData.combinedCalls || {},
            callLogs: freshDealerData.callLogs || {},
            users: freshDealerData.users || [],
          };

          return processedDealerData;
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch dealer users:", error);

      if (error.response?.status === 401) {
        safeToast.error("🔐 Session expired. Please login again.", true);
      } else if (
        error.code === "ECONNABORTED" ||
        error.message.includes("Network Error")
      ) {
        // safeToast.error("📡 Please check your internet connection!");
      } else {
        // safeToast.error(`❌ ${error.message || "Failed to fetch user data"}`);
      }

      setDealerUsers((prev) => ({ ...prev, [id]: [] }));
      return null;
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [id]: false }));
    }

    return null;
  };

  // 🔴 FIXED: EVENT HANDLERS - Updated to handle direct dates
  const handleFilterChange = (filter) => {
    console.log("🔄 Filter changing to:", filter, "from:", selectedFilter);

    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    if (!checkInternetConnection()) return;

    // ✅ FIX: Clear custom dates when switching AWAY from CUSTOM filter
    if (selectedFilter === "CUSTOM" && filter !== "CUSTOM") {
      console.log("🧹 Clearing custom dates when switching away from CUSTOM");

      // Clear custom dates from state
      setCustomStartDate("");
      setCustomEndDate("");
      setInvalidDateRange(false);

      // Clear custom dates applied flag
      setCustomDatesApplied(false);

      // Also clear from localStorage when switching away from CUSTOM
      localStorage.removeItem("customStartDate");
      localStorage.removeItem("customEndDate");

      // Reset custom filter pending state
      setCustomFilterPending(false);
    }

    // Update filter state
    setSelectedFilter(filter);
    localStorage.setItem("selectedFilter", filter);
    currentFilterRef.current = filter;

    if (filter === "CUSTOM") {
      console.log("⏳ Custom filter selected, waiting for Apply button click");

      // ✅ FIX: Set custom filter pending state instead of showing toast
      if (!customStartDate || !customEndDate) {
        setCustomFilterPending(true);

        // Clear previous data for CUSTOM filter without dates
        setDealers([]);
        setFilteredDealers([]);
        setSelectedDealers([]);
        setExpandedSummaryRows(new Set());
        setExpandedCallLogsRows(new Set());
        setDealerUsers({});
        setUserCallLogs({});

        // Clear KPI data
        setKpiData({
          dealers: 0,
          activeNetwork: 0,
          users: 0,
          activeUsers: 0,
          leads: 0,
          calls: 0,
          enqCalls: 0,
          coldCalls: 0,
          totalFollowUps: 0,
          uniqueTestDrives: 0,
          completedTestDrives: 0,
          newOrders: 0,
          netOrders: 0,
          retail: 0,
          cancellations: 0,
        });
      }

      // Don't fetch data automatically, wait for Apply button
      return;
    }

    // For non-CUSTOM filters, clear data and fetch
    console.log("🚀 Fetching fresh data for new filter:", filter);

    // Reset custom filter pending state
    setCustomFilterPending(false);

    // Clear previous data immediately for non-CUSTOM filters
    setDealers([]);
    setFilteredDealers([]);
    setSelectedDealers([]);
    setExpandedSummaryRows(new Set());
    setExpandedCallLogsRows(new Set());
    setDealerUsers({});
    setUserCallLogs({});

    fetchDashboardData(filter);
  };

  const toggleSummaryRow = async (event, dealer) => {
    event.stopPropagation();
    if (!checkInternetConnection()) return;

    const id = dealer.dealerId || dealer.id;
    setExpandedSummaryRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    if (!dealerUsers[id]?.length) {
      await fetchDealerUsersData(dealer);
    }
  };

  const toggleCallLogsRow = async (event, dealer) => {
    event.stopPropagation();
    if (!checkInternetConnection()) return;

    const id = dealer.dealerId || dealer.id;
    setExpandedCallLogsRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
        if (!dealerUsers[id]?.length) {
          fetchDealerUsersData(dealer);
        }
      }
      return newSet;
    });
  };

  const expandAllSummaryRows = () => {
    if (!checkInternetConnection()) return;
    const allIds = new Set(
      dealers.map((dealer) => dealer.dealerId || dealer.id),
    );
    setExpandedSummaryRows(allIds);
    dealers.forEach(async (dealer) => {
      const id = dealer.dealerId || dealer.id;
      if (!dealerUsers[id]?.length) {
        await fetchDealerUsersData(dealer);
      }
    });
  };

  const collapseAllSummaryRows = () => {
    setExpandedSummaryRows(new Set());
  };

  const expandAllCallLogsRows = () => {
    if (!checkInternetConnection()) return;
    const allIds = new Set(
      dealers.map((dealer) => dealer.dealerId || dealer.id),
    );
    setExpandedCallLogsRows(allIds);
  };

  const collapseAllCallLogsRows = () => {
    setExpandedCallLogsRows(new Set());
  };

  const areAllSummaryRowsExpanded = () => {
    return expandedSummaryRows.size === dealers.length && dealers.length > 0;
  };

  const areAllCallLogsRowsExpanded = () => {
    return expandedCallLogsRows.size === dealers.length && dealers.length > 0;
  };

  // 🔴 FIXED: applyCustomDate function - Now accepts dates directly
  const applyCustomDate = (startDate, endDate) => {
    if (!checkInternetConnection()) return;

    console.log("📅 applyCustomDate called with:", {
      startDate,
      endDate,
      currentFilter: selectedFilter,
      customDatesApplied,
    });

    if (!startDate || !endDate) {
      safeToast.warning("📅 Please select both start and end dates");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      safeToast.error("📅 End date cannot be earlier than start date");
      return;
    }

    console.log("📅 Applying custom date range:", startDate, "to", endDate);

    // 🔴 CRITICAL FIX: Save to localStorage first
    localStorage.setItem("customStartDate", startDate);
    localStorage.setItem("customEndDate", endDate);
    localStorage.setItem("selectedFilter", "CUSTOM");

    // 🔴 CRITICAL FIX: Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    // 🔴 CRITICAL FIX: Reset custom filter pending state
    setCustomFilterPending(false);

    // 🔴 CRITICAL FIX: Show loading toast first
    safeToast.info("Loading data for custom date range...");

    // 🔴 CRITICAL FIX: Clear existing data immediately
    setDealers([]);
    setFilteredDealers([]);
    setSelectedDealers([]);
    setExpandedSummaryRows(new Set());
    setExpandedCallLogsRows(new Set());
    setDealerUsers({});
    setUserCallLogs({});

    // 🔴 CRITICAL FIX: Update state
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setCustomDatesApplied(true);
    setSelectedFilter("CUSTOM");
    currentFilterRef.current = "CUSTOM";

    // 🔴 CRITICAL FIX: Fetch data with direct dates
    console.log(
      "🔄 Making API call for CUSTOM filter with dates:",
      startDate,
      endDate,
    );

    // Fetch data with direct dates
    fetchDashboardData("CUSTOM", null, startDate, endDate);
  };

  const validateCustomDates = () => {
    if (customStartDate && customEndDate) {
      setInvalidDateRange(new Date(customStartDate) > new Date(customEndDate));
    } else {
      setInvalidDateRange(false);
    }
  };

  // 🔴 FIXED: Clear data when resetting custom dates
  const resetCustomDate = () => {
    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedFilter("LAST_WEEK");
    setInvalidDateRange(false);

    // ✅ NEW: Reset custom dates applied flag
    setCustomDatesApplied(false);

    // ✅ NEW: Reset custom filter pending state
    setCustomFilterPending(false);

    // Clear from localStorage
    localStorage.removeItem("customStartDate");
    localStorage.removeItem("customEndDate");
    localStorage.setItem("selectedFilter", "LAST_WEEK");

    // Clear existing data
    setDealers([]);
    setFilteredDealers([]);
    setSelectedDealers([]);
    setExpandedSummaryRows(new Set());
    setExpandedCallLogsRows(new Set());
    setDealerUsers({});
    setUserCallLogs({});

    // Now fetch data for "LAST_WEEK" filter
    fetchDashboardData("LAST_WEEK");
  };

  // 🔴 FIXED: Update refreshDashboardData to use refreshingSA state
  const refreshDashboardData = () => {
    console.log("🔃 Refreshing data for current filter:", selectedFilter);

    // ✅ Set refreshing state to true
    setRefreshingSA(true);

    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    if (!checkInternetConnection()) {
      setRefreshingSA(false); // Reset if no internet
      return;
    }

    // ✅ FIX: Handle CUSTOM filter differently
    if (selectedFilter === "CUSTOM") {
      if (!customStartDate || !customEndDate) {
        safeToast.warning("Please apply custom dates first to refresh data");
        setRefreshingSA(false);
        return;
      }

      // For CUSTOM filter
      safeToast.info("Refreshing custom date range data...");

      // ❌ REMOVE: setRefreshingSA(false); <-- Don't set this here!
      fetchDashboardData("CUSTOM").finally(() => {
        setRefreshingSA(false); // ✅ Set to false after API completes
      });
      return;
    }

    // Don't clear data for CUSTOM filter if dates are set
    if (selectedFilter !== "CUSTOM") {
      setExpandedSummaryRows(new Set());
      setExpandedCallLogsRows(new Set());
      setDealerUsers({});
      setUserCallLogs({});
    }

    // ❌ REMOVE: setRefreshingSA(false); <-- Don't set this here!
    fetchDashboardData(selectedFilter).finally(() => {
      setRefreshingSA(false); // ✅ Set to false after API completes
    });
  };

  const toggleDealerSelection = (dealer) => {
    const id = dealer.dealerId || dealer.id;
    const isSelected = selectedDealers.some((d) => (d.dealerId || d.id) === id);

    let newSelectedDealers;
    if (isSelected) {
      newSelectedDealers = selectedDealers.filter(
        (d) => (d.dealerId || d.id) !== id,
      );
    } else {
      newSelectedDealers = [...selectedDealers, dealer];
    }

    console.log("🔄 Toggling dealer selection:", {
      dealerName: dealer.dealerName,
      isSelected,
      newSelectedCount: newSelectedDealers.length,
      currentFilter: selectedFilter,
    });

    setSelectedDealers(newSelectedDealers);

    if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
      console.log("📊 Custom filter without dates, NOT fetching data");
      safeToast.info("Please apply custom date range first.");
      return;
    }

    console.log("📊 Fetching data for updated dealer selection...");
    fetchDashboardData(selectedFilter, newSelectedDealers);
  };

  const toggleSelectAll = () => {
    const isCurrentlyAllSelected =
      selectedDealers.length === filteredDealers.length &&
      filteredDealers.length > 0;

    if (isCurrentlyAllSelected) {
      console.log("📊 Deselecting all dealers");
      setSelectedDealers([]);

      if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
        console.log("📊 Custom filter without dates, NOT fetching data");
        return;
      }

      console.log("📊 Fetching all dealers data after deselecting...");
      fetchDashboardData(selectedFilter, []);
    } else {
      console.log("📊 Selecting all dealers:", filteredDealers.length);
      const newSelectedDealers = [...filteredDealers];
      setSelectedDealers(newSelectedDealers);

      if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
        console.log("📊 Custom filter without dates, NOT fetching data");
        safeToast.info("Please apply custom date range first.");
        return;
      }

      console.log("📊 Fetching data for selected dealers...");
      fetchDashboardData(selectedFilter, newSelectedDealers);
    }
  };

  const clearSelection = () => {
    console.log("📊 Clearing all dealer selections");
    setSelectedDealers([]);

    if (dealers.length > 0) {
      setFilteredDealers([...dealers]);
    }
  };

  const isDealerSelected = (dealer) => {
    return selectedDealers.some(
      (d) => (d.dealerId || d.id) === (dealer.dealerId || dealer.id),
    );
  };

  const areAllSelected = () => {
    return (
      filteredDealers.length > 0 &&
      selectedDealers.length === filteredDealers.length
    );
  };

  // ✅ NEW: Temporary dealer selection handlers
  const toggleTempDealerSelection = (dealer) => {
    const id = dealer.dealerId || dealer.id;
    const isSelected = tempSelectedDealers.some(
      (d) => (d.dealerId || d.id) === id,
    );

    if (isSelected) {
      setTempSelectedDealers((prev) =>
        prev.filter((d) => (d.dealerId || d.id) !== id),
      );
    } else {
      setTempSelectedDealers((prev) => [...prev, dealer]);
    }
  };

  const toggleTempSelectAll = () => {
    if (tempSelectedDealers.length === filteredDealers.length) {
      setTempSelectedDealers([]);
    } else {
      setTempSelectedDealers([...filteredDealers]);
    }
  };

  const clearTempSelection = () => {
    setTempSelectedDealers([]);
  };

  const isDealerTempSelected = (dealer) => {
    return tempSelectedDealers.some(
      (d) => (d.dealerId || d.id) === (dealer.dealerId || dealer.id),
    );
  };

  const areAllTempSelected = () => {
    return (
      filteredDealers.length > 0 &&
      tempSelectedDealers.length === filteredDealers.length
    );
  };

  const applyDealerSelection = () => {
    console.log("📊 Applying dealer selection:", tempSelectedDealers.length);
    setSelectedDealers([...tempSelectedDealers]);
    setDropdownOpen(false);

    if (selectedFilter === "CUSTOM" && (!customStartDate || !customEndDate)) {
      console.log("📊 Custom filter without dates, NOT fetching data");
      safeToast.info("Please apply custom date range first.");
      return;
    }

    fetchDashboardData(selectedFilter, tempSelectedDealers);
  };

  const cancelDealerSelection = () => {
    console.log("📊 Cancelling dealer selection");
    setTempSelectedDealers([...selectedDealers]);
    setDropdownOpen(false);
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
    };
    return labels[filter] || filter;
  };

  const sortData = (column) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
            ? "default"
            : "asc",
      );
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortedUsers = (dealerId) => {
    const users = dealerUsers[dealerId] ?? [];
    return [...users].sort((a, b) => {
      const saA = a.leads?.sa ?? 0;
      const saB = b.leads?.sa ?? 0;
      return saB - saA;
    });
  };

  const getUserCalls = (user) => {
    if (dealerSummaryCallsDataType === "enquiries") {
      return user.enquiriesCalls ?? user.calls ?? {};
    } else if (dealerSummaryCallsDataType === "coldcalls") {
      return user.coldCalls ?? user.calls ?? {};
    } else {
      return user.calls ?? {};
    }
  };

  const getDealerCalls = (dealer) => {
    let calls = {};

    switch (dealerSummaryCallsDataType) {
      case "enquiries":
        calls = dealer.enquiriesCalls || {};
        break;
      case "coldcalls":
        calls = dealer.coldCalls || {};
        break;
      case "combinedCalls":
        calls = dealer.combinedCalls || {};
        break;
      default:
        calls = dealer.callLogs || {};
        break;
    }

    return {
      totalCalls: calls.totalCalls || 0,
      outgoing: calls.outgoing || 0,
      incoming: calls.incoming || 0,
      connectedCalls: calls.connectedCalls || 0,
      declined: calls.declined || 0,
      missed: calls.missed || 0,
      duration: calls.duration || 0,
      callsAbove1Min: calls.callsAbove1Min || 0,
      callsAbove4Min: calls.callsAbove4Min || 0,
      avgConnected: calls.avgConnected || 0,
    };
  };

  const getSortedCallLogs = async (
    dealerId,
    dataType = null,
    customStart = null,
    customEnd = null,
  ) => {
    if (!checkInternetConnection()) return [];

    const effectiveDataType = dataType || dealerSummaryCallsDataType;

    try {
      let url = "";
      let effectiveFilter = selectedFilter;
      let isCustomMode = false;

      const effectiveStartDate = customStart || customStartDate;
      const effectiveEndDate = customEnd || customEndDate;

      if (selectedFilter === "CUSTOM") {
        if (effectiveStartDate && effectiveEndDate) {
          isCustomMode = true;
        } else {
          effectiveFilter = "LAST_WEEK";
          console.log(
            "⚠️ CUSTOM filter without dates, falling back to LAST_WEEK for call logs",
          );
        }
      }

      if (isCustomMode) {
        url = `/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
        console.log("🔗 Custom date call logs API URL:", url);
      } else {
        const apiFilter = mapFilterToApi(effectiveFilter);
        url = `/generalManager/dashboard/report?dealer_id=${dealerId}&type=${apiFilter}`;
        console.log("🔗 Standard filter call logs API URL:", url);
      }

      console.log("🔗 Fetching call logs from:", url);
      const response = await api.get(url);

      if (response.data?.status === 200 && response.data.data) {
        let userData = [];

        if (Array.isArray(response.data.data.dealerData)) {
          const dealerData = response.data.data.dealerData.find(
            (d) => (d.dealerId || d.id) === dealerId,
          );
          userData = dealerData?.users || [];
        } else if (
          response.data.data.dealerData &&
          typeof response.data.data.dealerData === "object"
        ) {
          userData = response.data.data.dealerData.users || [];
        } else if (response.data.data.users) {
          userData = response.data.data.users || [];
        }

        if (userData.length > 0) {
          const processedUsers = userData.map((user) => {
            let calls = {};
            switch (effectiveDataType) {
              case "enquiries":
                calls = user.enquiriesCalls || {};
                break;
              case "coldcalls":
                calls = user.coldCalls || {};
                break;
              case "combinedCalls":
                calls = user.combinedCalls || {};
                break;
              default:
                calls = user.calls || {};
                break;
            }

            const userCalls = {
              total: calls.totalCalls || calls.total || 0,
              outgoing: calls.outgoing || 0,
              incoming: calls.incoming || 0,
              connected: calls.connectedCalls || calls.connected || 0,
              declined: calls.declined || 0,
              duration: calls.durationSec || calls.duration || 0,
              avgConnected: calls.avgConnected || 0,
              callsAbove1Min: calls.callsAbove1Min || 0,
              callsAbove4Min: calls.callsAbove4Min || 0,
              durationMin: calls.durationMin || 0,
              callsAbove1MinCount: calls.callsAbove1Min || 0,
            };

            return {
              userId: user.user_id || user.id || `user-${Math.random()}`,
              name: user.user || user.name || "Unknown User",
              user_role: user.user_role || "User",
              calls: userCalls,
              enquiriesCalls: user.enquiriesCalls || {},
              coldCalls: user.coldCalls || {},
              combinedCalls: user.combinedCalls || {},
              rawCalls: calls,
            };
          });

          const sorted = processedUsers.sort(
            (a, b) => (b.calls.total || 0) - (a.calls.total || 0),
          );
          return sorted;
        } else {
          console.log("⚠️ No user data found in call logs response");
          return [];
        }
      } else {
        console.log("⚠️ No valid data in call logs API response");
        return [];
      }
    } catch (error) {
      console.error("❌ API call failed:", error);

      if (error.response?.status === 401) {
        safeToast.error("🔐 Session expired. Please login again.", true);
      } else if (error.response?.status !== 401) {
        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("Network Error")
        ) {
          // safeToast.error("📡 Please check your internet connection!");
        } else {
          safeToast.error("Failed to fetch call logs");
        }
      }
      return [];
    }
  };

  const formatDuration = (sec) => {
    if (!sec || sec === 0) return "00:00:00";
    const h = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
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

  const getSortedDealersForCallLogs = () => {
    const list = selectedDealers.length > 0 ? selectedDealers : dealers;
    return [...list].sort((a, b) => {
      const totalA = getDealerCalls(a)?.totalCalls ?? 0;
      const totalB = getDealerCalls(b)?.totalCalls ?? 0;
      return totalB - totalA;
    });
  };

  return (
    <div className="dashboard-container w-full min-h-screen bg-gray-50">
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
        style={{ zIndex: 9999 }}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="spinner w-10 h-10 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
        </div>
      )}

      <div className="content-section active w-full">
        <main className="main-content p-2">
          <div className="mb-2">
            <FilterBar
              isSticky={isSticky}
              userRole={userRole}
              selectedFilter={selectedFilter}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              invalidDateRange={invalidDateRange}
              dealerSearch={dealerSearch}
              selectedDealers={selectedDealers}
              tempSelectedDealers={tempSelectedDealers}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              getFilterLabel={getFilterLabel}
              onFilterChange={handleFilterChange}
              onCustomStartDateChange={setCustomStartDate}
              onCustomEndDateChange={setCustomEndDate}
              onDealerSearchChange={setDealerSearch}
              onValidateCustomDates={validateCustomDates}
              onApplyCustomDate={applyCustomDate} // Now passes dates directly
              onResetCustomDate={resetCustomDate}
              onRefresh={refreshDashboardData}
              refreshingSA={refreshingSA} // ✅ FIXED: Now passing the refreshingSA state
              dealers={dealers}
              filteredDealers={filteredDealers}
              isDealerSelected={isDealerSelected}
              isDealerTempSelected={isDealerTempSelected}
              areAllSelected={areAllSelected}
              areAllTempSelected={areAllTempSelected}
              onToggleDealerSelection={toggleDealerSelection}
              onToggleTempDealerSelection={toggleTempDealerSelection}
              onToggleSelectAll={toggleSelectAll}
              onToggleTempSelectAll={toggleTempSelectAll}
              onClearSelection={clearSelection}
              onClearTempSelection={clearTempSelection}
              onApplyDealerSelection={applyDealerSelection}
              onCancelDealerSelection={cancelDealerSelection}
              // ✅ Pass customDatesApplied to FilterBar
              customDatesApplied={customDatesApplied}
              // ✅ Pass customFilterPending to FilterBar
              customFilterPending={customFilterPending}
            />
          </div>

          <div className="mb-2">
            <KpiSection
              kpiData={kpiData}
              // ✅ NEW: Pass customFilterPending to show message in KPI section
              customFilterPending={customFilterPending}
            />
          </div>

          <div className="mb-4">
            <DealerSummaryTable
              key={`summary-${selectedFilter}-${dealers.length}`}
              dealers={getSortedDealersForSummary()}
              selectedDealers={selectedDealers}
              tableLength={table1Length}
              setTableLength={setTable1Length}
              expandedSummaryRows={expandedSummaryRows}
              dealerUsers={dealerUsers}
              loadingUsers={loadingUsers}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onToggleSummaryRow={toggleSummaryRow}
              onSortData={sortData}
              onGetSortedUsers={getSortedUsers}
              onFetchDealerUsers={fetchDealerUsersData}
              onExpandAllSummaryRows={expandAllSummaryRows}
              onCollapseAllSummaryRows={collapseAllSummaryRows}
              selectedFilter={selectedFilter}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              areAllSummaryRowsExpanded={areAllSummaryRowsExpanded}
              // ✅ NEW: Pass customDatesApplied
              customDatesApplied={customDatesApplied}
              // ✅ NEW: Pass customFilterPending to show message in table
              customFilterPending={customFilterPending}
            />

            <CallLogsTable
              dealers={getSortedDealersForCallLogs()}
              selectedDealers={selectedDealers}
              tableLength={table2Length}
              setTableLength={setTable2Length}
              expandedCallLogsRows={expandedCallLogsRows}
              userCallLogs={userCallLogs}
              loadingUsers={false}
              dealerSummaryCallsViewType={dealerSummaryCallsViewType}
              dealerSummaryCallsDataType={dealerSummaryCallsDataType}
              modalCallsDataType={modalCallsDataType}
              onToggleCallLogsRow={toggleCallLogsRow}
              onSetDealerSummaryCallsViewType={setDealerSummaryCallsViewType}
              onSetDealerSummaryCallsDataType={setDealerSummaryCallsDataType}
              onSetModalCallsDataType={setModalCallsDataType}
              onGetDealerCalls={getDealerCalls}
              onGetSortedCallLogs={getSortedCallLogs}
              onFormatDuration={formatDuration}
              onExpandAllCallLogsRows={expandAllCallLogsRows}
              onCollapseAllCallLogsRows={collapseAllCallLogsRows}
              areAllCallLogsRowsExpanded={areAllCallLogsRowsExpanded}
              // ✅ NEW: Pass customDatesApplied
              customDatesApplied={customDatesApplied}
              // ✅ NEW: Pass customFilterPending to show message in table
              customFilterPending={customFilterPending}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
