// import { useState, useEffect } from "react";

// export const useApi = (
//   selectedDateFilter,
//   roleFilter,
//   selectedDealers,
//   showToast
// ) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiData, setApiData] = useState(null);
//   const [allData, setAllData] = useState(null);
//   const [dealers, setDealers] = useState([]);
//   const [filteredDealers, setFilteredDealers] = useState([]);
//   const [dealerSearch, setDealerSearch] = useState("");
//   const [psWiseCharts, setPsWiseCharts] = useState([]);
//   const [error, setError] = useState(null);

//   const [stats, setStats] = useState({
//     distinctUsers: 0,
//     saLeads: 0,
//     followups: 0,
//     testDrives: 0,
//     enquiryCalls: 0,
//     coldCalls: 0,
//   });

//   // Build API URL WITH dealer filter
//   const buildApiUrl = () => {
//     const baseUrl =
//       "https://staging.smartassistapp.in/api/generalManager/dashboard/trend-chart";
//     const params = new URLSearchParams({
//       type: selectedDateFilter,
//       timezone: "Asia/Kolkata",
//     });

//     // Add dealer filter
//     if (selectedDealers.length > 0) {
//       params.append("dealer_ids", selectedDealers.join(","));
//     }

//     return `${baseUrl}?${params.toString()}`;
//   };

//   // Handle session expired
//   const handleSessionExpired = () => {
//     const errorMessage = "Session expired. Please login again.";
//     setError(errorMessage);

//     // Show toast if showToast function is provided
//     if (showToast && typeof showToast === "function") {
//       showToast(errorMessage, "error");
//     } else {
//       // Fallback to console if no toast function
//       console.error("Session expired. Please login again.");
//     }

//     // Clear token and redirect after delay
//     localStorage.removeItem("token");
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   };

//   // Chart data ko stats ke according adjust karo
//   const adjustChartDataBasedOnStats = (
//     chartData,
//     originalStats,
//     filteredStats
//   ) => {
//     if (!chartData || !originalStats || !filteredStats) return chartData;

//     console.log("📊 Adjusting chart data based on filtered stats:", {
//       originalLeads: originalStats.saLeads,
//       filteredLeads: filteredStats.saLeads,
//       originalFollowups: originalStats.followups,
//       filteredFollowups: filteredStats.followups,
//     });

//     const adjustedChartData = JSON.parse(JSON.stringify(chartData));

//     // Calculate ratio for each metric
//     const ratios = {
//       leads: filteredStats.saLeads / Math.max(originalStats.saLeads, 1),
//       testDrives:
//         filteredStats.testDrives / Math.max(originalStats.testDrives, 1),
//       followups: filteredStats.followups / Math.max(originalStats.followups, 1),
//       enquiryCalls:
//         filteredStats.enquiryCalls / Math.max(originalStats.enquiryCalls, 1),
//     };

//     console.log("📈 Adjustment ratios:", ratios);

//     // Adjust left chart data (day level)
//     if (adjustedChartData.left) {
//       Object.keys(adjustedChartData.left).forEach((metric) => {
//         if (
//           adjustedChartData.left[metric] &&
//           Array.isArray(adjustedChartData.left[metric])
//         ) {
//           adjustedChartData.left[metric] = adjustedChartData.left[metric].map(
//             (item) => ({
//               ...item,
//               count: Math.max(
//                 0,
//                 Math.round(item.count * (ratios[metric] || 0))
//               ),
//             })
//           );
//         }
//       });
//     }

//     // Adjust right chart data (hour level)
//     if (adjustedChartData.right) {
//       Object.keys(adjustedChartData.right).forEach((metric) => {
//         if (
//           adjustedChartData.right[metric] &&
//           Array.isArray(adjustedChartData.right[metric])
//         ) {
//           adjustedChartData.right[metric] = adjustedChartData.right[metric].map(
//             (item) => ({
//               ...item,
//               count: Math.max(
//                 0,
//                 Math.round(item.count * (ratios[metric] || 0))
//               ),
//             })
//           );
//         }
//       });
//     }

//     return adjustedChartData;
//   };

//   // Transform new API response to match old structure
//   const transformApiResponse = (data) => {
//     if (!data) return null;

//     console.log("🔄 Transforming API response structure");

//     // Get the first dealer's chart data
//     const leftChartsData = data.leftCharts
//       ? Object.values(data.leftCharts)[0] || {}
//       : {};
//     const rightChartsData = data.rightCharts
//       ? Object.values(data.rightCharts)[0] || {}
//       : {};

//     const transformed = {
//       ...data,
//       // Map topCards structure - FIX ENQUIRY CALLS
//       topCards: data.topCards
//         ? {
//             distinctUsers: data.topCards.distinctUsers || 0,
//             saLeads: data.topCards.saLeads || 0,
//             followups: data.topCards.followups || 0,
//             testDrives: data.topCards.testDrives || 0,
//             enquiryCalls: data.topCards.enquiries?.totalCalls || 0,
//             coldCalls: data.topCards.coldCalls?.totalCalls || 0,
//           }
//         : null,

//       // Map left charts structure - EXTRACT ENQUIRIES DATA PROPERLY
//       left: {
//         ...leftChartsData,
//         enquiryCalls: leftChartsData.enquiries?.totalCalls || [],
//       },

//       // Map right charts structure - EXTRACT ENQUIRIES DATA PROPERLY
//       right: {
//         ...rightChartsData,
//         enquiryCalls: rightChartsData.enquiries?.totalCalls || [],
//       },

//       // activeDealers remains same
//       activeDealers: data.activeDealers || [],

//       // psWiseActivity remains same
//       psWiseActivity: data.psWiseActivity || {},
//     };

//     console.log("✅ Transformed Enquiry Calls data:", {
//       topCardsEnquiry: transformed.topCards?.enquiryCalls,
//       leftEnquiryData: transformed.left?.enquiryCalls,
//       rightEnquiryData: transformed.right?.enquiryCalls,
//     });

//     return transformed;
//   };

//   // Main filtering function
//   const filterAllData = (data, dealerIds) => {
//     if (!data) return null;

//     console.log("🎯 Filtering ALL data for dealers:", dealerIds);

//     // If no dealers selected, return all data
//     if (dealerIds.length === 0) {
//       return data;
//     }

//     const filtered = JSON.parse(JSON.stringify(data));

//     // 1. Filter psWiseActivity
//     if (data.psWiseActivity) {
//       const filteredPsWiseActivity = {};

//       // Get selected dealer names
//       const selectedDealerNames = dealers
//         .filter((dealer) => dealerIds.includes(dealer.dealer_id))
//         .map((dealer) => dealer.dealer_name);

//       console.log(
//         "🔍 Selected dealer names for filtering:",
//         selectedDealerNames
//       );

//       Object.entries(data.psWiseActivity).forEach(([dealerName, users]) => {
//         if (selectedDealerNames.includes(dealerName)) {
//           const filteredUsers = users.filter((user) =>
//             roleFilter === "Both" ? true : user.role === roleFilter
//           );

//           if (filteredUsers.length > 0) {
//             filteredPsWiseActivity[dealerName] = filteredUsers;
//           }
//         }
//       });

//       filtered.psWiseActivity = filteredPsWiseActivity;
//       console.log(
//         "✅ Filtered psWiseActivity:",
//         Object.keys(filteredPsWiseActivity)
//       );
//     }

//     // 2. Recalculate stats from filtered psWiseActivity
//     if (filtered.psWiseActivity && filtered.topCards) {
//       let totalDistinctUsers = 0;
//       let totalSaLeads = 0;
//       let totalFollowups = 0;
//       let totalTestDrives = 0;
//       let totalEnquiryCalls = 0;
//       let totalColdCalls = 0;

//       Object.values(filtered.psWiseActivity).forEach((users) => {
//         users.forEach((user) => {
//           totalDistinctUsers += user.lastLogin > 0 ? 1 : 0;
//           totalSaLeads += user.saLeads || 0;
//           totalFollowups += user.followups || 0;
//           totalTestDrives += user.uniquetestDrives || 0;
//           totalEnquiryCalls += user.enquiries?.totalCalls || 0;
//           totalColdCalls += user.coldCalls?.totalCalls || 0;
//         });
//       });

//       const filteredStats = {
//         distinctUsers: totalDistinctUsers,
//         saLeads: totalSaLeads,
//         followups: totalFollowups,
//         testDrives: totalTestDrives,
//         enquiryCalls: totalEnquiryCalls,
//         coldCalls: totalColdCalls,
//       };

//       filtered.topCards = {
//         ...filtered.topCards,
//         ...filteredStats,
//       };

//       console.log("📊 Recalculated stats after filtering:", filteredStats);
//     }

//     // 3. Filter activeDealers to match selection
//     if (filtered.activeDealers && Array.isArray(filtered.activeDealers)) {
//       filtered.activeDealers = filtered.activeDealers.filter((dealer) =>
//         dealerIds.includes(dealer.dealer_id)
//       );
//     }

//     return filtered;
//   };

//   // Process PS data for charts
//   const processPsData = (psData) => {
//     if (!psData) {
//       setPsWiseCharts([]);
//       return;
//     }

//     console.log("🎯 Processing PS data for dealers:", Object.keys(psData));

//     const processedData = Object.entries(psData).map(([dealerName, users]) => {
//       const filteredUsers = Array.isArray(users)
//         ? users.filter((user) =>
//             roleFilter === "Both" ? true : user.role === roleFilter
//           )
//         : [];

//       if (filteredUsers.length === 0) return null;

//       const charts = [
//         {
//           title: "SA Enquiries",
//           key: "saLeads",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.saLeads || 0,
//               id: user.user_id || Math.random().toString(),
//               role: user.role || "",
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.saLeads || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.saLeads || 0),
//             1
//           ),
//         },
//         {
//           title: "Test Drives",
//           key: "uniquetestDrives",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.uniquetestDrives || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.uniquetestDrives || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.uniquetestDrives || 0),
//             1
//           ),
//         },
//         {
//           title: "Followups",
//           key: "followups",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.followups || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.followups || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.followups || 0),
//             1
//           ),
//         },
//         {
//           title: "Last login",
//           key: "lastLogin",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.lastLogin || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.lastLogin || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.lastLogin || 0),
//             1
//           ),
//         },
//         {
//           title: "Calls",
//           key: "calls",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.calls?.totalCalls || 0,
//               id: user.user_id || Math.random().toString(),
//               enquiryCalls: user.enquiries?.totalCalls || 0,
//               coldCalls: user.coldCalls?.totalCalls || 0,
//               calls: user.calls?.totalCalls || 0,
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.calls?.totalCalls || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.calls?.totalCalls || 0),
//             1
//           ),
//         },
//       ].filter((chart) => chart.users.length > 0);

//       return {
//         dealerName,
//         users: filteredUsers,
//         charts: charts,
//       };
//     });

//     const validData = processedData.filter(
//       (dealer) => dealer !== null && dealer.charts.length > 0
//     );
//     console.log(
//       "✅ Processed PS Data after filtering:",
//       validData.length,
//       "dealers"
//     );
//     setPsWiseCharts(validData);
//   };

//   // Fetch data from API
//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       // Check if token exists
//       if (!token || token === "null" || token === "undefined") {
//         handleSessionExpired();
//         return;
//       }

//       const apiUrl = buildApiUrl();

//       console.log("🔍 Fetching data with dealer filter:", apiUrl);

//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // Check for unauthorized/expired token
//       if (response.status === 401 || response.status === 403) {
//         handleSessionExpired();
//         return;
//       }

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, message: ${errorText}`
//         );
//       }

//       const data = await response.json();

//       // Check if API response has error
//       if (data.error) {
//         throw new Error(data.error || "API returned an error");
//       }

//       console.log("📦 API Response received");

//       // Transform API response to match expected structure
//       const transformedData = transformApiResponse(data.data || data);

//       // Store all data
//       setAllData(transformedData);

//       // Apply filtering
//       const filtered = filterAllData(transformedData, selectedDealers);
//       setApiData(filtered);

//       // Set dealers
//       if (transformedData.activeDealers) {
//         setDealers(transformedData.activeDealers);
//         setFilteredDealers(transformedData.activeDealers);
//       }

//       // Set stats
//       if (filtered && filtered.topCards) {
//         setStats({
//           distinctUsers: filtered.topCards.distinctUsers || 0,
//           saLeads: filtered.topCards.saLeads || 0,
//           followups: filtered.topCards.followups || 0,
//           testDrives: filtered.topCards.testDrives || 0,
//           enquiryCalls: filtered.topCards.enquiryCalls || 0,
//           coldCalls: filtered.topCards.coldCalls || 0,
//         });
//       }

//       // Process PS data
//       if (filtered && filtered.psWiseActivity) {
//         processPsData(filtered.psWiseActivity);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching data:", error);

//       // Show error toast
//       if (showToast && typeof showToast === "function") {
//         showToast(error.message || "Failed to fetch data", "error");
//       }

//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     fetchData();
//   }, [selectedDateFilter]);

//   // Re-filter when selected dealers change
//   useEffect(() => {
//     if (allData) {
//       console.log(
//         "🔄 Re-filtering data due to dealer selection change:",
//         selectedDealers
//       );
//       const filtered = filterAllData(allData, selectedDealers);
//       setApiData(filtered);

//       if (filtered && filtered.topCards) {
//         setStats({
//           distinctUsers: filtered.topCards.distinctUsers || 0,
//           saLeads: filtered.topCards.saLeads || 0,
//           followups: filtered.topCards.followups || 0,
//           testDrives: filtered.topCards.testDrives || 0,
//           enquiryCalls: filtered.topCards.enquiryCalls || 0,
//           coldCalls: filtered.topCards.coldCalls || 0,
//         });
//       }

//       if (filtered && filtered.psWiseActivity) {
//         processPsData(filtered.psWiseActivity);
//       }
//     }
//   }, [selectedDealers, allData]);

//   // Re-process PS data when role filter changes
//   useEffect(() => {
//     if (apiData && apiData.psWiseActivity) {
//       processPsData(apiData.psWiseActivity);
//     }
//   }, [roleFilter]);

//   // Filter dealers based on search
//   useEffect(() => {
//     if (!dealerSearch.trim()) {
//       setFilteredDealers([...dealers]);
//     } else {
//       const filtered = dealers.filter((dealer) =>
//         dealer.dealer_name.toLowerCase().includes(dealerSearch.toLowerCase())
//       );
//       setFilteredDealers(filtered);
//     }
//   }, [dealerSearch, dealers]);

//   // Handle retry fetch
//   const retryFetch = () => {
//     fetchData();
//   };

//   return {
//     isLoading,
//     apiData,
//     stats,
//     dealers,
//     filteredDealers,
//     dealerSearch,
//     setDealerSearch,
//     fetchData: retryFetch,
//     processPsData,
//     psWiseCharts,
//     error,
//     clearError: () => setError(null),
//   };
// };

// import { useState, useEffect, useMemo } from "react";

// export const useApi = (
//   selectedDateFilter,
//   roleFilter,
//   selectedDealers,
//   showToast
// ) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiData, setApiData] = useState(null);
//   const [allData, setAllData] = useState(null);
//   const [dealers, setDealers] = useState([]);
//   const [filteredDealers, setFilteredDealers] = useState([]);
//   const [dealerSearch, setDealerSearch] = useState("");
//   const [psWiseCharts, setPsWiseCharts] = useState([]);
//   const [error, setError] = useState(null);

//   const [stats, setStats] = useState({
//     distinctUsers: 0,
//     saLeads: 0,
//     followups: 0,
//     testDrives: 0,
//     enquiryCalls: 0,
//     coldCalls: 0,
//   });

//   // Build API URL WITH dealer filter
//   const buildApiUrl = () => {
//     const baseUrl =
//       "https://staging.smartassistapp.in/api/generalManager/dashboard/trend-chart";
//     const params = new URLSearchParams({
//       type: selectedDateFilter,
//       timezone: "Asia/Kolkata",
//     });

//     // Add dealer filter
//     if (selectedDealers.length > 0) {
//       params.append("dealer_ids", selectedDealers.join(","));
//     }

//     return `${baseUrl}?${params.toString()}`;
//   };

//   // Handle session expired
//   const handleSessionExpired = () => {
//     const errorMessage = "Session expired. Please login again.";
//     setError(errorMessage);

//     // Show toast if showToast function is provided
//     if (showToast && typeof showToast === "function") {
//       showToast(errorMessage, "error");
//     } else {
//       // Fallback to console if no toast function
//       console.error("Session expired. Please login again.");
//     }

//     // Clear token and redirect after delay
//     localStorage.removeItem("token");
//     setTimeout(() => {
//       window.location.href = "/login";
//     }, 2000);
//   };

//   // Transform new API response to match old structure
//   const transformApiResponse = (data) => {
//     if (!data) return null;

//     console.log("🔄 Transforming API response structure");

//     // Get the first dealer's chart data
//     const leftChartsData = data.leftCharts
//       ? Object.values(data.leftCharts)[0] || {}
//       : {};
//     const rightChartsData = data.rightCharts
//       ? Object.values(data.rightCharts)[0] || {}
//       : {};

//     const transformed = {
//       ...data,
//       // Map topCards structure - FIX ENQUIRY CALLS
//       topCards: data.topCards
//         ? {
//             distinctUsers: data.topCards.distinctUsers || 0,
//             saLeads: data.topCards.saLeads || 0,
//             followups: data.topCards.followups || 0,
//             testDrives: data.topCards.testDrives || 0,
//             enquiryCalls: data.topCards.enquiries?.totalCalls || 0,
//             coldCalls: data.topCards.coldCalls?.totalCalls || 0,
//           }
//         : null,

//       // Map left charts structure - EXTRACT ENQUIRIES DATA PROPERLY
//       left: {
//         ...leftChartsData,
//         enquiryCalls: leftChartsData.enquiries?.totalCalls || [],
//       },

//       // Map right charts structure - EXTRACT ENQUIRIES DATA PROPERLY
//       right: {
//         ...rightChartsData,
//         enquiryCalls: rightChartsData.enquiries?.totalCalls || [],
//       },

//       // activeDealers remains same
//       activeDealers: data.activeDealers || [],

//       // psWiseActivity remains same
//       psWiseActivity: data.psWiseActivity || {},
//     };

//     console.log("✅ Transformed Enquiry Calls data:", {
//       topCardsEnquiry: transformed.topCards?.enquiryCalls,
//       leftEnquiryData: transformed.left?.enquiryCalls,
//       rightEnquiryData: transformed.right?.enquiryCalls,
//     });

//     return transformed;
//   };

//   // ✅ FIXED: Main filtering function - FIXED THE DEALER NAME FILTERING ISSUE
//   const filterAllData = (data, dealerIds) => {
//     if (!data) return null;

//     console.log("🎯 Filtering ALL data for dealers:", dealerIds);

//     // If no dealers selected, return all data
//     if (dealerIds.length === 0) {
//       return data;
//     }

//     const filtered = JSON.parse(JSON.stringify(data));

//     // 1. Filter psWiseActivity - ✅ FIXED HERE
//     if (data.psWiseActivity) {
//       const filteredPsWiseActivity = {};

//       // ✅ FIX: Get selected dealer names from activeDealers in the data itself
//       // This ensures we're using the correct dealer names from the current data
//       const activeDealersInData = data.activeDealers || [];
//       const selectedDealerNames = activeDealersInData
//         .filter((dealer) => dealerIds.includes(dealer.dealer_id))
//         .map((dealer) => dealer.dealer_name);

//       console.log(
//         "🔍 Selected dealer names for filtering (from data.activeDealers):",
//         selectedDealerNames
//       );

//       Object.entries(data.psWiseActivity).forEach(([dealerName, users]) => {
//         if (selectedDealerNames.includes(dealerName)) {
//           const filteredUsers = users.filter((user) =>
//             roleFilter === "Both" ? true : user.role === roleFilter
//           );

//           if (filteredUsers.length > 0) {
//             filteredPsWiseActivity[dealerName] = filteredUsers;
//           }
//         }
//       });

//       filtered.psWiseActivity = filteredPsWiseActivity;
//       console.log(
//         "✅ Filtered psWiseActivity:",
//         Object.keys(filteredPsWiseActivity)
//       );
//     }

//     // 2. Recalculate stats from filtered psWiseActivity
//     if (filtered.psWiseActivity && filtered.topCards) {
//       let totalDistinctUsers = 0;
//       let totalSaLeads = 0;
//       let totalFollowups = 0;
//       let totalTestDrives = 0;
//       let totalEnquiryCalls = 0;
//       let totalColdCalls = 0;

//       Object.values(filtered.psWiseActivity).forEach((users) => {
//         users.forEach((user) => {
//           totalDistinctUsers += user.lastLogin > 0 ? 1 : 0;
//           totalSaLeads += user.saLeads || 0;
//           totalFollowups += user.followups || 0;
//           totalTestDrives += user.uniquetestDrives || 0;
//           totalEnquiryCalls += user.enquiries?.totalCalls || 0;
//           totalColdCalls += user.coldCalls?.totalCalls || 0;
//         });
//       });

//       const filteredStats = {
//         distinctUsers: totalDistinctUsers,
//         saLeads: totalSaLeads,
//         followups: totalFollowups,
//         testDrives: totalTestDrives,
//         enquiryCalls: totalEnquiryCalls,
//         coldCalls: totalColdCalls,
//       };

//       filtered.topCards = {
//         ...filtered.topCards,
//         ...filteredStats,
//       };

//       console.log("📊 Recalculated stats after filtering:", filteredStats);
//     }

//     // 3. Filter activeDealers to match selection
//     if (filtered.activeDealers && Array.isArray(filtered.activeDealers)) {
//       filtered.activeDealers = filtered.activeDealers.filter((dealer) =>
//         dealerIds.includes(dealer.dealer_id)
//       );
//     }

//     return filtered;
//   };

//   // Process PS data for charts
//   const processPsData = (psData) => {
//     if (!psData) {
//       setPsWiseCharts([]);
//       return;
//     }

//     console.log("🎯 Processing PS data for dealers:", Object.keys(psData));

//     const processedData = Object.entries(psData).map(([dealerName, users]) => {
//       const filteredUsers = Array.isArray(users)
//         ? users.filter((user) =>
//             roleFilter === "Both" ? true : user.role === roleFilter
//           )
//         : [];

//       if (filteredUsers.length === 0) return null;

//       const charts = [
//         {
//           title: "SA Enquiries",
//           key: "saLeads",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.saLeads || 0,
//               id: user.user_id || Math.random().toString(),
//               role: user.role || "",
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.saLeads || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.saLeads || 0),
//             1
//           ),
//         },
//         {
//           title: "Test Drives",
//           key: "uniquetestDrives",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.uniquetestDrives || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.uniquetestDrives || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.uniquetestDrives || 0),
//             1
//           ),
//         },
//         {
//           title: "Followups",
//           key: "followups",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.followups || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.followups || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.followups || 0),
//             1
//           ),
//         },
//         {
//           title: "Last login",
//           key: "lastLogin",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.lastLogin || 0,
//               id: user.user_id || Math.random().toString(),
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.lastLogin || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.lastLogin || 0),
//             1
//           ),
//         },
//         {
//           title: "Calls",
//           key: "calls",
//           users: filteredUsers
//             .map((user) => ({
//               name: user.name || "Unknown",
//               value: user.calls?.totalCalls || 0,
//               id: user.user_id || Math.random().toString(),
//               enquiryCalls: user.enquiries?.totalCalls || 0,
//               coldCalls: user.coldCalls?.totalCalls || 0,
//               calls: user.calls?.totalCalls || 0,
//             }))
//             .sort((a, b) => b.value - a.value),
//           dealerAvg:
//             Math.round(
//               filteredUsers.reduce(
//                 (sum, user) => sum + (user.calls?.totalCalls || 0),
//                 0
//               ) / filteredUsers.length
//             ) || 0,
//           maxValue: Math.max(
//             ...filteredUsers.map((user) => user.calls?.totalCalls || 0),
//             1
//           ),
//         },
//       ].filter((chart) => chart.users.length > 0);

//       return {
//         dealerName,
//         users: filteredUsers,
//         charts: charts,
//       };
//     });

//     const validData = processedData.filter(
//       (dealer) => dealer !== null && dealer.charts.length > 0
//     );
//     console.log(
//       "✅ Processed PS Data after filtering:",
//       validData.length,
//       "dealers"
//     );
//     setPsWiseCharts(validData);
//   };

//   // Fetch data from API
//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem("token");

//       // Check if token exists
//       if (!token || token === "null" || token === "undefined") {
//         handleSessionExpired();
//         return;
//       }

//       const apiUrl = buildApiUrl();

//       console.log("🔍 Fetching data with dealer filter:", apiUrl);

//       const response = await fetch(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       // Check for unauthorized/expired token
//       if (response.status === 401 || response.status === 403) {
//         handleSessionExpired();
//         return;
//       }

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(
//           `HTTP error! status: ${response.status}, message: ${errorText}`
//         );
//       }

//       const data = await response.json();

//       // Check if API response has error
//       if (data.error) {
//         throw new Error(data.error || "API returned an error");
//       }

//       console.log("📦 API Response received");

//       // Transform API response to match expected structure
//       const transformedData = transformApiResponse(data.data || data);

//       // Store all data
//       setAllData(transformedData);

//       // Apply filtering
//       const filtered = filterAllData(transformedData, selectedDealers);
//       setApiData(filtered);

//       // Set dealers
//       if (transformedData.activeDealers) {
//         setDealers(transformedData.activeDealers);
//         setFilteredDealers(transformedData.activeDealers);
//       }

//       // Set stats
//       if (filtered && filtered.topCards) {
//         setStats({
//           distinctUsers: filtered.topCards.distinctUsers || 0,
//           saLeads: filtered.topCards.saLeads || 0,
//           followups: filtered.topCards.followups || 0,
//           testDrives: filtered.topCards.testDrives || 0,
//           enquiryCalls: filtered.topCards.enquiryCalls || 0,
//           coldCalls: filtered.topCards.coldCalls || 0,
//         });
//       }

//       // Process PS data
//       if (filtered && filtered.psWiseActivity) {
//         processPsData(filtered.psWiseActivity);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching data:", error);

//       // Show error toast
//       if (showToast && typeof showToast === "function") {
//         showToast(error.message || "Failed to fetch data", "error");
//       }

//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Initialize data
//   // useEffect(() => {
//   //   fetchData();
//   // }, [selectedDateFilter]);
//   // Initialize data
//   useEffect(() => {
//     fetchData();
//   }, [selectedDateFilter, selectedDealers]); // ✅ Added selectedDealers
//   // Re-filter when selected dealers change
//   useEffect(() => {
//     if (allData) {
//       console.log(
//         "🔄 Re-filtering data due to dealer selection change:",
//         selectedDealers
//       );
//       const filtered = filterAllData(allData, selectedDealers);
//       setApiData(filtered);

//       if (filtered && filtered.topCards) {
//         setStats({
//           distinctUsers: filtered.topCards.distinctUsers || 0,
//           saLeads: filtered.topCards.saLeads || 0,
//           followups: filtered.topCards.followups || 0,
//           testDrives: filtered.topCards.testDrives || 0,
//           enquiryCalls: filtered.topCards.enquiryCalls || 0,
//           coldCalls: filtered.topCards.coldCalls || 0,
//         });
//       }

//       if (filtered && filtered.psWiseActivity) {
//         processPsData(filtered.psWiseActivity);
//       }
//     }
//   }, [selectedDealers, allData]);

//   // Re-process PS data when role filter changes
//   useEffect(() => {
//     if (apiData && apiData.psWiseActivity) {
//       processPsData(apiData.psWiseActivity);
//     }
//   }, [roleFilter]);

//   // Filter dealers based on search
//   useEffect(() => {
//     if (!dealerSearch.trim()) {
//       setFilteredDealers([...dealers]);
//     } else {
//       const filtered = dealers.filter((dealer) =>
//         dealer.dealer_name.toLowerCase().includes(dealerSearch.toLowerCase())
//       );
//       setFilteredDealers(filtered);
//     }
//   }, [dealerSearch, dealers]);

//   // Handle retry fetch
//   const retryFetch = () => {
//     fetchData();
//   };

//   return {
//     isLoading,
//     apiData,
//     stats,
//     dealers,
//     filteredDealers,
//     dealerSearch,
//     setDealerSearch,
//     fetchData: retryFetch,
//     processPsData,
//     psWiseCharts,
//     error,
//     clearError: () => setError(null),
//   };
// };

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useState, useEffect, useCallback, useRef } from "react";

export const useApi = (
  selectedDateFilter,
  roleFilter,
  selectedDealers,
  showToast,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [allData, setAllData] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [dealerSearch, setDealerSearch] = useState("");
  const [psWiseCharts, setPsWiseCharts] = useState([]);
  const [error, setError] = useState(null);

  // Track if we've made the initial fetch
  const hasFetchedInitial = useRef(false);

  const [stats, setStats] = useState({
    distinctUsers: 0,
    saLeads: 0,
    followups: 0,
    testDrives: 0,
    enquiryCalls: 0,
    coldCalls: 0,
  });

  // Handle session expired
  const handleSessionExpired = useCallback(() => {
    const errorMessage = "Session expired. Please login again.";
    setError(errorMessage);

    if (showToast && typeof showToast === "function") {
      showToast(errorMessage, "error");
    } else {
      console.error("Session expired. Please login again.");
    }

    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, [showToast]);

  // Build API URL WITH dealer filter
  const buildApiUrl = useCallback(() => {
    const baseUrl =
      "https://uat.smartassistapp.in/api/generalManager/dashboard/trend-chart";
    const params = new URLSearchParams({
      type: selectedDateFilter,
      timezone: "Asia/Kolkata",
    });

    // Add dealer filter
    if (selectedDealers.length > 0) {
      params.append("dealer_ids", selectedDealers.join(","));
    }

    return `${baseUrl}?${params.toString()}`;
  }, [selectedDateFilter, selectedDealers]);

  // Transform new API response to match old structure
  const transformApiResponse = useCallback((data) => {
    if (!data) return null;

    const leftChartsData = data.leftCharts
      ? Object.values(data.leftCharts)[0] || {}
      : {};
    const rightChartsData = data.rightCharts
      ? Object.values(data.rightCharts)[0] || {}
      : {};

    const transformed = {
      ...data,
      topCards: data.topCards
        ? {
            distinctUsers: data.topCards.distinctUsers || 0,
            saLeads: data.topCards.saLeads || 0,
            followups: data.topCards.followups || 0,
            testDrives: data.topCards.testDrives || 0,
            enquiryCalls: data.topCards.enquiries?.totalCalls || 0,
            coldCalls: data.topCards.coldCalls?.totalCalls || 0,
          }
        : null,
      left: {
        ...leftChartsData,
        enquiryCalls: leftChartsData.enquiries?.totalCalls || [],
      },
      right: {
        ...rightChartsData,
        enquiryCalls: rightChartsData.enquiries?.totalCalls || [],
      },
      activeDealers: data.activeDealers || [],
      psWiseActivity: data.psWiseActivity || {},
    };

    return transformed;
  }, []);

  // Main filtering function
  const filterAllData = useCallback(
    (data, dealerIds) => {
      if (!data) return null;

      if (dealerIds.length === 0) {
        return data;
      }

      const filtered = JSON.parse(JSON.stringify(data));

      // 1. Filter psWiseActivity
      if (data.psWiseActivity) {
        const filteredPsWiseActivity = {};
        const activeDealersInData = data.activeDealers || [];
        const selectedDealerNames = activeDealersInData
          .filter((dealer) => dealerIds.includes(dealer.dealer_id))
          .map((dealer) => dealer.dealer_name);

        Object.entries(data.psWiseActivity).forEach(([dealerName, users]) => {
          if (selectedDealerNames.includes(dealerName)) {
            const filteredUsers = users.filter((user) =>
              roleFilter === "Both" ? true : user.role === roleFilter,
            );

            if (filteredUsers.length > 0) {
              filteredPsWiseActivity[dealerName] = filteredUsers;
            }
          }
        });

        filtered.psWiseActivity = filteredPsWiseActivity;
      }

      // 2. Recalculate stats from filtered psWiseActivity
      if (filtered.psWiseActivity && filtered.topCards) {
        let totalDistinctUsers = 0;
        let totalSaLeads = 0;
        let totalFollowups = 0;
        let totalTestDrives = 0;
        let totalEnquiryCalls = 0;
        let totalColdCalls = 0;

        Object.values(filtered.psWiseActivity).forEach((users) => {
          users.forEach((user) => {
            totalDistinctUsers += user.lastLogin > 0 ? 1 : 0;
            totalSaLeads += user.saLeads || 0;
            totalFollowups += user.followups || 0;
            totalTestDrives += user.testDrives || 0; // ✅ Correct field
            totalEnquiryCalls += user.enquiries?.totalCalls || 0;
            totalColdCalls += user.coldCalls?.totalCalls || 0;
          });
        });

        const filteredStats = {
          distinctUsers: totalDistinctUsers,
          saLeads: totalSaLeads,
          followups: totalFollowups,
          testDrives: totalTestDrives, // ✅ FIXED - use totalTestDrives
          enquiryCalls: totalEnquiryCalls,
          coldCalls: totalColdCalls,
        };

        filtered.topCards = {
          ...filtered.topCards,
          ...filteredStats,
        };
      }

      // 3. Filter activeDealers to match selection
      if (filtered.activeDealers && Array.isArray(filtered.activeDealers)) {
        filtered.activeDealers = filtered.activeDealers.filter((dealer) =>
          dealerIds.includes(dealer.dealer_id),
        );
      }

      return filtered;
    },
    [roleFilter],
  );

  // Process PS data for charts
  const processPsData = useCallback(
    (psData) => {
      if (!psData) {
        setPsWiseCharts([]);
        return;
      }

      const processedData = Object.entries(psData).map(
        ([dealerName, users]) => {
          const filteredUsers = Array.isArray(users)
            ? users.filter((user) =>
                roleFilter === "Both" ? true : user.role === roleFilter,
              )
            : [];

          if (filteredUsers.length === 0) return null;

          const charts = [
            {
              title: "SA Enquiries",
              key: "saLeads",
              users: filteredUsers
                .map((user) => ({
                  name: user.name || "Unknown",
                  value: user.saLeads || 0,
                  id: user.user_id || Math.random().toString(),
                  role: user.role || "",
                }))
                .sort((a, b) => b.value - a.value),
              dealerAvg:
                Math.round(
                  filteredUsers.reduce(
                    (sum, user) => sum + (user.saLeads || 0),
                    0,
                  ) / filteredUsers.length,
                ) || 0,
              maxValue: Math.max(
                ...filteredUsers.map((user) => user.saLeads || 0),
                1,
              ),
            },
            {
              title: "Test Drives",
              key: "uniquetestDrives",
              users: filteredUsers
                .map((user) => ({
                  name: user.name || "Unknown",
                  value: user.uniquetestDrives || 0,
                  id: user.user_id || Math.random().toString(),
                }))
                .sort((a, b) => b.value - a.value),
              dealerAvg:
                Math.round(
                  filteredUsers.reduce(
                    (sum, user) => sum + (user.uniquetestDrives || 0),
                    0,
                  ) / filteredUsers.length,
                ) || 0,
              maxValue: Math.max(
                ...filteredUsers.map((user) => user.uniquetestDrives || 0),
                1,
              ),
            },
            {
              title: "Followups",
              key: "followups",
              users: filteredUsers
                .map((user) => ({
                  name: user.name || "Unknown",
                  value: user.followups || 0,
                  id: user.user_id || Math.random().toString(),
                }))
                .sort((a, b) => b.value - a.value),
              dealerAvg:
                Math.round(
                  filteredUsers.reduce(
                    (sum, user) => sum + (user.followups || 0),
                    0,
                  ) / filteredUsers.length,
                ) || 0,
              maxValue: Math.max(
                ...filteredUsers.map((user) => user.followups || 0),
                1,
              ),
            },
            {
              title: "Last login",
              key: "lastLogin",
              users: filteredUsers
                .map((user) => ({
                  name: user.name || "Unknown",
                  value: user.lastLogin || 0,
                  id: user.user_id || Math.random().toString(),
                }))
                .sort((a, b) => b.value - a.value),
              dealerAvg:
                Math.round(
                  filteredUsers.reduce(
                    (sum, user) => sum + (user.lastLogin || 0),
                    0,
                  ) / filteredUsers.length,
                ) || 0,
              maxValue: Math.max(
                ...filteredUsers.map((user) => user.lastLogin || 0),
                1,
              ),
            },
            {
              title: "Calls",
              key: "calls",
              users: filteredUsers
                .map((user) => ({
                  name: user.name || "Unknown",
                  value: user.calls?.totalCalls || 0,
                  id: user.user_id || Math.random().toString(),
                  enquiryCalls: user.enquiries?.totalCalls || 0,
                  coldCalls: user.coldCalls?.totalCalls || 0,
                  calls: user.calls?.totalCalls || 0,
                }))
                .sort((a, b) => b.value - a.value),
              dealerAvg:
                Math.round(
                  filteredUsers.reduce(
                    (sum, user) => sum + (user.calls?.totalCalls || 0),
                    0,
                  ) / filteredUsers.length,
                ) || 0,
              maxValue: Math.max(
                ...filteredUsers.map((user) => user.calls?.totalCalls || 0),
                1,
              ),
            },
          ].filter((chart) => chart.users.length > 0);

          return {
            dealerName,
            users: filteredUsers,
            charts: charts,
          };
        },
      );

      const validData = processedData.filter(
        (dealer) => dealer !== null && dealer.charts.length > 0,
      );
      setPsWiseCharts(validData);
    },
    [roleFilter],
  );

  // Fetch data from API - memoized with all dependencies
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token || token === "null" || token === "undefined") {
        handleSessionExpired();
        return;
      }

      const apiUrl = buildApiUrl();
      console.log("🔍 Fetching data with URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error || "API returned an error");
      }

      console.log("📦 API Response received successfully");

      const transformedData = transformApiResponse(data.data || data);

      setAllData(transformedData);

      const filtered = filterAllData(transformedData, selectedDealers);
      setApiData(filtered);

      if (transformedData.activeDealers) {
        setDealers(transformedData.activeDealers);
        setFilteredDealers(transformedData.activeDealers);
      }

      if (filtered && filtered.topCards) {
        setStats({
          distinctUsers: filtered.topCards.distinctUsers || 0,
          saLeads: filtered.topCards.saLeads || 0,
          followups: filtered.topCards.followups || 0,
          testDrives: filtered.topCards.testDrives || 0,
          enquiryCalls: filtered.topCards.enquiryCalls || 0,
          coldCalls: filtered.topCards.coldCalls || 0,
        });
      }

      if (filtered && filtered.psWiseActivity) {
        processPsData(filtered.psWiseActivity);
      }

      hasFetchedInitial.current = true;
    } catch (error) {
      console.error("❌ Error fetching data:", error);

      if (showToast && typeof showToast === "function") {
        showToast(error.message || "Failed to fetch data", "error");
      }

      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    buildApiUrl,
    selectedDealers,
    showToast,
    handleSessionExpired,
    transformApiResponse,
    filterAllData,
    processPsData,
  ]);

  // MAIN EFFECT: Fetch data on mount and when filters change
  useEffect(() => {
    console.log("🔄 useApi useEffect triggered", {
      selectedDateFilter,
      selectedDealersLength: selectedDealers.length,
    });

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateFilter, selectedDealers]); // Only these dependencies

  // Effect to re-filter data when roleFilter changes
  useEffect(() => {
    if (!allData) return;

    console.log("🔄 Role filter changed, re-filtering data");

    const filtered = filterAllData(allData, selectedDealers);
    setApiData(filtered);

    if (filtered && filtered.topCards) {
      setStats({
        distinctUsers: filtered.topCards.distinctUsers || 0,
        saLeads: filtered.topCards.saLeads || 0,
        followups: filtered.topCards.followups || 0,
        testDrives: filtered.topCards.testDrives || 0,
        enquiryCalls: filtered.topCards.enquiryCalls || 0,
        coldCalls: filtered.topCards.coldCalls || 0,
      });
    }

    if (filtered && filtered.psWiseActivity) {
      processPsData(filtered.psWiseActivity);
    }
  }, [roleFilter, allData, selectedDealers, filterAllData, processPsData]);

  // Filter dealers based on search
  useEffect(() => {
    if (!dealerSearch.trim()) {
      setFilteredDealers([...dealers]);
    } else {
      const filtered = dealers.filter((dealer) =>
        dealer.dealer_name.toLowerCase().includes(dealerSearch.toLowerCase()),
      );
      setFilteredDealers(filtered);
    }
  }, [dealerSearch, dealers]);

  // Handle retry fetch
  const retryFetch = useCallback(() => {
    console.log("🔄 Manual retry fetch triggered");
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    apiData,
    stats,
    dealers,
    filteredDealers,
    dealerSearch,
    setDealerSearch,
    fetchData: retryFetch,
    psWiseCharts,
    error,
    clearError: () => setError(null),
  };
};
