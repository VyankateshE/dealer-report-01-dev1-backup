import React, { useState, useEffect, useRef } from "react";

// Import components
import KpiSection from "./Components/KpiSection/KpiSection";
import FilterBar from "./Components/Header/FilterBar";
import DealerSummaryTable from "./Components/CEODealerSummaryTable/DealerSummaryTable";
import CallLogsTable from "./Components/CEOCallLogsTable/CallLogsTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CEODashboard = () => {
  // State declarations
  const [selectedFilter, setSelectedFilter] = useState("LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [invalidDateRange, setInvalidDateRange] = useState(false);
  const [dealerSearch, setDealerSearch] = useState("");
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // ✅ FIXED: Initialize from localStorage immediately
  const [customDatesApplied, setCustomDatesApplied] = useState(false);
  const [hasCheckedSavedDates, setHasCheckedSavedDates] = useState(false);
  const [shouldAutoFetchCustom, setShouldAutoFetchCustom] = useState(false);

  // ✅ NEW: State to track if custom filter is selected but dates not applied
  const [customFilterPending, setCustomFilterPending] = useState(false);

  // ✅ FIXED: Use useRef for scroll tracking instead of state
  const lastScrollY = useRef(0);
  const headerRef = useRef(null);

  // ✅ ADD: Ref to track if toast is already showing
  const isToastShowingRef = useRef(false);

  // ✅ NEW: Ref to track applied custom dates
  const appliedDatesRef = useRef({ start: "", end: "" });

  // ✅ NEW: Ref to prevent duplicate API calls
  const hasFetchedInitialDataRef = useRef(false);

  // Data state
  const [kpiData, setKpiData] = useState({
    dealers: 0,
    activeNetwork: 0,
    users: 0,
    activeUsers: 0,
    leads: 0,
    calls: 0,
    enqCalls: 0, // ✅ ADDED: Initialize enqCalls
    coldCalls: 0, // ✅ ADDED: Initialize coldCalls
    webLeads: 0,
    webFollowUps: 0,
    webTestDrives: 0,
    webCompletedTestDrives: 0,
  });

  const [dealers, setDealers] = useState([]);
  const [filteredDealers, setFilteredDealers] = useState([]);
  const [dealerUsers, setDealerUsers] = useState({});
  const [userCallLogs, setUserCallLogs] = useState({});
  const [loadingUsers, setLoadingUsers] = useState({});

  // Track multiple expanded rows instead of single
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

  // ✅ NEW: State to track modal-specific filter
  const [modalDataFilter, setModalDataFilter] = useState("enquiries");

  // Use ref to track current filter for API calls
  const currentFilterRef = useRef("LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"

  // ✅ ADD: Centralized 401 handler
  const handleUnauthorized = () => {
    if (isToastShowingRef.current) {
      return; // Toast already showing, don't show another one
    }

    // console.log("🚨 Unauthorized - Token expired or invalid");
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
        isToastShowingRef.current = false; // Reset when toast closes
      },
    });

    // Clear token and redirect
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/login";
    }, 2000);

    return true;
  };

  // ✅ FIXED: Proper scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Simple sticky logic - stick when scrolled past 50px
      if (currentScrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ FIXED: Check saved dates on initial mount - RUNS FIRST
  useEffect(() => {
    // console.log("🔍 Checking saved dates from localStorage...");

    const savedFilter = localStorage.getItem("selectedFilter") || "LAST_WEEK"; // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
    const savedStartDate = localStorage.getItem("customStartDate");
    const savedEndDate = localStorage.getItem("customEndDate");

    // console.log("📋 Saved filter:", savedFilter);
    // console.log("📅 Saved dates:", savedStartDate, savedEndDate);

    // Set initial states from localStorage
    setSelectedFilter(savedFilter);
    currentFilterRef.current = savedFilter;

    // Only set custom dates if CUSTOM filter is saved WITH dates
    if (savedFilter === "CUSTOM" && savedStartDate && savedEndDate) {
      // console.log("✅ Found saved CUSTOM dates, marking as applied");
      setCustomStartDate(savedStartDate);
      setCustomEndDate(savedEndDate);
      setCustomDatesApplied(true);
      appliedDatesRef.current = {
        start: savedStartDate,
        end: savedEndDate,
      };
      // Mark that we should auto-fetch custom data
      setShouldAutoFetchCustom(true);
      setCustomFilterPending(false);
    } else if (savedFilter === "CUSTOM" && (!savedStartDate || !savedEndDate)) {
      // ✅ FIX: If CUSTOM is selected but no dates are saved, reset to LAST_WEEK
      // console.log(
      //   "⚠️ CUSTOM filter selected but no dates found, resetting to LAST_WEEK"
      // );
      setSelectedFilter("LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
      currentFilterRef.current = "LAST_WEEK"; // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
      localStorage.setItem("selectedFilter", "LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
      setShouldAutoFetchCustom(false);
      setCustomFilterPending(false);
    }

    setHasCheckedSavedDates(true);
  }, []);

  // ✅ FIXED: Main initialization - RUNS AFTER saved dates are checked
  useEffect(() => {
    if (!hasCheckedSavedDates) {
      // console.log("⏳ Waiting for saved dates check...");
      return;
    }

    // console.log("🚀 Starting main initialization...");
    // console.log("📊 Current filter:", selectedFilter);
    // console.log("✅ Custom dates applied:", customDatesApplied);
    // console.log("🔄 Should auto-fetch custom:", shouldAutoFetchCustom);

    // ✅ FIX: Allow CUSTOM filter to bypass duplicate check when dates are applied
    const isCustomWithDates = selectedFilter === "CUSTOM" && customDatesApplied;

    // Prevent duplicate calls for non-CUSTOM filters
    if (hasFetchedInitialDataRef.current && !isCustomWithDates) {
      // console.log("⚠️ Already fetched initial data, skipping...");
      return;
    }

    // ✅ FIX: Handle ALL filters including CUSTOM properly
    if (selectedFilter === "CUSTOM" && shouldAutoFetchCustom) {
      // console.log("🔄 Fetching data for saved CUSTOM filter...");

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
      setInitialLoadComplete(true);
      setShouldAutoFetchCustom(false);
      return;
    }

    // Handle other filters
    // console.log("🔄 Fetching data for filter:", selectedFilter);
    fetchDashboardData(selectedFilter);

    hasFetchedInitialDataRef.current = true;
    setInitialLoadComplete(true);
  }, [hasCheckedSavedDates, selectedFilter, shouldAutoFetchCustom]);

  // ✅ NEW: Effect to validate custom dates when they change
  useEffect(() => {
    validateCustomDates();
  }, [customStartDate, customEndDate]);

  // Auto-expand all rows when dealers data loads
  useEffect(() => {
    if (dealers.length > 0) {
      // console.log("🎯 Auto-expanding all dealer rows:", dealers.length);

      // Auto-expand all summary rows
      const allSummaryIds = new Set(
        dealers.map((dealer) => dealer.dealerId || dealer.id),
      );
      setExpandedSummaryRows(allSummaryIds);

      // Auto-expand all call logs rows
      const allCallLogsIds = new Set(
        dealers.map((dealer) => dealer.dealerId || dealer.id),
      );
      setExpandedCallLogsRows(allCallLogsIds);

      // Auto-select all dealers
      if (selectedDealers.length === 0) {
        // console.log("✅ Auto-selecting all dealers:", dealers.length);
        setSelectedDealers([...dealers]);
      }

      // Fetch user data for all dealers
      dealers.forEach(async (dealer) => {
        const id = dealer.dealerId || dealer.id;
        if (!dealerUsers[id]?.length) {
          await fetchDealerUsersData(dealer);
        }
      });
    }
  }, [dealers]);

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
    return filterMap[filter] || "DAY";
  };

  // Data processing function
  const processDealerData = (apiResponse) => {
    if (!apiResponse?.data) {
      return [];
    }

    const { data } = apiResponse;

    let dealerData = [];

    // Handle different response structures
    if (Array.isArray(data.dealerData)) {
      dealerData = data.dealerData;
    } else if (data.dealerData && typeof data.dealerData === "object") {
      dealerData = [data.dealerData];
    } else if (data.dealerId || data.dealerName) {
      dealerData = [data];
    } else if (Array.isArray(data)) {
      dealerData = data;
    } else {
      dealerData = [];
    }

    if (dealerData.length === 0) {
      return [];
    }

    // Process each dealer
    const processedDealers = dealerData.map((dealer, index) => {
      const getNum = (value, fallback = 0) => {
        if (value === null || value === undefined || value === "")
          return fallback;
        const num = Number(value);
        return isNaN(num) ? fallback : num;
      };

      // Extract web values properly - handling both camelCase and lowercase
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

        // Users data
        totalUsers: getNum(dealer.totalUsers),
        registerUsers: getNum(dealer.registerUsers),
        activeUsers: getNum(dealer.activeUsers),

        // Leads data
        totalLeads: getNum(dealer.totalLeads),
        saLeads: getNum(dealer.saLeads),
        webleads: webleads, // This is needed for the leads parentheses
        manuallyEnteredLeads: getNum(dealer.manuallyEnteredLeads),

        // Follow-ups data
        totalFollowUps: getNum(dealer.totalFollowUps),
        saFollowUps: getNum(dealer.saFollowUps),
        webleadsFollowUps: webleadsFollowUps, // This is needed for followups parentheses
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

        // Test drives data
        totalTestDrives: getNum(dealer.totalTestDrives || dealer.saTestDrives),
        saTestDrives: saTestDrives, // This is needed for test drives parentheses
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

        // Analytics data
        newOrders: getNum(dealer.newOrders),
        netOrders: getNum(dealer.netOrders),
        retail: getNum(dealer.retail),
        cancellations: getNum(dealer.cancellations),
        opportunitiesConverted: getNum(dealer.opportunitiesConverted),

        // Calls data
        enquiriesCalls: dealer.enquiriesCalls || {},
        coldCalls: dealer.coldCalls || {},
        combinedCalls: dealer.combinedCalls || {},

        callLogs: dealer.callLogs || {},

        // Users data for expanded rows
        users: dealer.users || [],
      };

      console.log(`🏪 Processed dealer ${index}:`, {
        name: dealerObj.dealerName,
        saLeads: dealerObj.saLeads,
        webleads: dealerObj.webleads, // Check if this has value
        saFollowUps: dealerObj.saFollowUps,
        webleadsFollowUps: dealerObj.webleadsFollowUps, // Check if this has value
        totalTestDrives: dealerObj.totalTestDrives,
        saTestDrives: dealerObj.saTestDrives, // Check if this has value
      });

      return dealerObj;
    });

    return processedDealers;
  };
  // MAIN DASHBOARD DATA FETCH - FIXED: Removed the toast warning for CUSTOM filter
  const fetchDashboardData = async (filterType) => {
    // ✅ FIXED: For CUSTOM filter, don't show toast, just set pending state
    if (filterType === "CUSTOM") {
      if (!customDatesApplied) {
        // console.log(
        //   "⏸️ CUSTOM filter selected but dates not applied yet, skipping fetch"
        // );
        // ✅ REMOVED: The toast.warning() call here
        // Set pending state to show message in table UI
        setCustomFilterPending(true);
        return;
      }

      // Double check we have dates
      if (!customStartDate || !customEndDate) {
        // console.log(
        //   "⏸️ CUSTOM filter selected but dates are empty, skipping fetch"
        // );
        // ✅ REMOVED: The toast.warning() call here
        // Set pending state to show message in table UI
        setCustomFilterPending(true);
        return;
      }
    }

    // If we're switching from CUSTOM pending to another filter, reset the pending state
    if (filterType !== "CUSTOM" && customFilterPending) {
      setCustomFilterPending(false);
    }

    setIsLoading(true);

    // Update current filter reference
    currentFilterRef.current = filterType;
    // console.log("🌐 Fetching data for filter:", filterType);

    const token = localStorage.getItem("token");
    if (!token) {
      // console.error("No authentication token found");
      handleUnauthorized();
      setIsLoading(false);
      return;
    }

    try {
      let url = "";
      const isCustomMode =
        filterType === "CUSTOM" &&
        customStartDate &&
        customEndDate &&
        customDatesApplied;
      const apiFilterType = mapFilterToApi(filterType);

      // Build URL based on selection
      if (selectedDealers.length === 0) {
        url = isCustomMode
          ? `https://uat.smartassistapp.in/api/generalManager/dashboard/report?start_date=${customStartDate}&end_date=${customEndDate}`
          : `https://uat.smartassistapp.in/api/generalManager/dashboard/report?type=${apiFilterType}`;
      } else if (selectedDealers.length === 1) {
        const dealerId = selectedDealers[0].dealerId || selectedDealers[0].id;
        url = isCustomMode
          ? `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${customStartDate}&end_date=${customEndDate}`
          : `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${dealerId}&type=${apiFilterType}`;
      } else {
        const dealerIds = selectedDealers
          .map((d) => d.dealerId || d.id)
          .join(",");
        url = isCustomMode
          ? `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealerIds=${dealerIds}&start_date=${customStartDate}&end_date=${customEndDate}`
          : `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealerIds=${dealerIds}&type=${apiFilterType}`;
      }

      // console.log("🔗 API URL for filter:", filterType, url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("📡 API Response status:", response.status);

      // 🔴 CRITICAL: Handle 401 Unauthorized with centralized handler
      if (response.status === 401) {
        // console.log("🚨 401 Unauthorized - Token expired or invalid");
        if (handleUnauthorized()) {
          setIsLoading(false);
          return;
        }
      }

      if (!response.ok) {
        // Don't throw for 401 since we already handled it
        if (response.status !== 401) {
          // console.error("❌ HTTP Error:", response.status, response.statusText);
          toast.error(`Server error: ${response.status}. Please try again.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return; // Just return for 401 without throwing
        }
      }

      const res = await response.json();
      // console.log("📥 Full API Response for filter:", filterType, res);

      if (res?.status === 200 && res.data) {
        // console.log("✅ API Success - Processing data...");
        const updatedDealers = processDealerData(res);

        // console.log("🔄 Processed dealers count:", updatedDealers.length);

        if (updatedDealers.length === 0) {
          // console.log("⚠️ No dealers after processing");
          setDealers([]);
          setFilteredDealers([]);
          setKpiData({
            dealers: 0,
            activeNetwork: 0,
            users: 0,
            activeUsers: 0,
            leads: 0,
            calls: 0,
            enqCalls: 0, // ✅ ADDED
            coldCalls: 0, // ✅ ADDED
            totalFollowUps: 0,
            uniqueTestDrives: 0,
            completedTestDrives: 0,
            newOrders: 0,
            netOrders: 0,
            retail: 0,
            cancellations: 0,
          });
          toast.info("No data available for the selected filter.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        } else {
          const sortedDealers = [...updatedDealers].sort(
            (a, b) => (b.saLeads ?? 0) - (a.saLeads ?? 0),
          );

          // console.log("✅ Setting dealers state:", sortedDealers.length);

          setDealers(sortedDealers);
          setFilteredDealers(sortedDealers);

          // Enhanced KPI data mapping with all overview fields
          const overview = res.data.overview || {};
          // console.log("📊 Overview data:", overview);

          const kpiUpdate = {
            dealers: overview.dealers || sortedDealers.length,
            activeNetwork: overview.activeNetwork || sortedDealers.length,
            users: overview.users || 0,
            activeUsers: overview.activeUsers || 0,
            leads: overview.leads || 0,
            calls: overview.calls || 0,
            enqCalls: overview.enqCalls || 0, // ✅ ADDED: Extract enqCalls from overview
            coldCalls: overview.coldCalls || 0, // ✅ ADDED: Extract coldCalls from overview
            totalFollowUps: overview.totalFollowUps || 0,
            uniqueTestDrives: overview.uniqueTestDrives || 0,
            completedTestDrives: overview.completedTestDrives || 0,
            newOrders: overview.newOrders || 0,
            netOrders: overview.netOrders || 0,
            retail: overview.retail || 0,
            cancellations: overview.cancellations || 0,

            webLeads: overview.webLeads || 0,
            webFollowUps: overview.webFollowUps || 0,

            webTestDrives: overview.webTestDrives || 0,
            webCompletedTestDrives: overview.webCompletedTestDrives || 0,
          };

          // console.log("📊 Setting KPI data:", kpiUpdate);
          setKpiData(kpiUpdate);

          // console.log("✅ Data successfully loaded for filter:", filterType);
        }
      }
    } catch (error) {
      // console.error("❌ API failed for filter:", filterType, error);

      // Check if error is due to network failure
      if (
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch") ||
        error.code === "ECONNABORTED"
      ) {
        // toast.error("📡 Please check your internet connection!", {
        //   position: "top-right",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   theme: "colored",
        // });
      } else if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        // console.log("🚨 Unauthorized error detected in catch block");
        // No toast here - already handled by centralized handler
      } else {
        toast.error("Failed to load data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDealerUsersData = async (
    dealer,
    filterOverride = null,
    customStart = null,
    customEnd = null,
  ) => {
    const id = dealer.dealerId || dealer.id;
    const token = localStorage.getItem("token");
    if (!token) {
      handleUnauthorized();
      return;
    }

    setLoadingUsers((prev) => ({ ...prev, [id]: true }));

    try {
      let url = "";
      const effectiveFilter = filterOverride || selectedFilter;
      const isCustomMode = effectiveFilter === "CUSTOM";
      const effectiveStartDate = customStart || customStartDate;
      const effectiveEndDate = customEnd || customEndDate;

      if (isCustomMode && effectiveStartDate && effectiveEndDate) {
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
      } else if (isCustomMode && (!effectiveStartDate || !effectiveEndDate)) {
        const apiFilterType = mapFilterToApi("WEEK");
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilterType}`;
      } else {
        const apiFilterType = mapFilterToApi(effectiveFilter);
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilterType}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        if (response.status !== 401) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return;
        }
      }

      const res = await response.json();

      if (res?.status === 200 && res.data) {
        let userData = [];

        if (Array.isArray(res.data.dealerData)) {
          const dealerData = res.data.dealerData.find(
            (d) => (d.dealerId || d.id) === id,
          );
          userData = dealerData?.users || [];
        } else if (
          res.data.dealerData &&
          typeof res.data.dealerData === "object"
        ) {
          userData = res.data.dealerData.users || [];
        } else if (res.data.users) {
          userData = res.data.users || [];
        } else if (res.data.dealerId || res.data.dealerName) {
          userData = res.data.users || [];
        }

        if (userData.length > 0) {
          const processedUsers = userData.map((user) => {
            console.log("🔍 Raw user data:", user);
            return {
              user_id: user.user_id,
              user: user.user,
              purged: user.purged || false,
              user_role: user.user_role,
              registerUser:
                user.registerUser !== undefined ? user.registerUser : true,
              active: user.active !== undefined ? user.active : false,
              last_login: user.last_login || null,
              leads: user.leads || { sa: 0, manuallyEntered: 0 },
              followups: user.followups || {
                sa: 0,
                completed: 0,
                open: 0,
                closed: 0,
              },
              testdrives: user.testdrives || {
                sa: 0,
                completed: 0,
                unique: 0,
                upcoming: 0,
                closed: 0,
              },
              newOrders: user.newOrders || 0,
              netOrders: user.netOrders || 0,
              retail: user.retail || 0,
              cancellations: user.cancellations || 0,
              opportunitiesConverted: user.opportunitiesConverted || 0,
              calls: user.calls || {},
              enquiriesCalls: user.enquiriesCalls || {},
              coldCalls: user.coldCalls || {},
              combinedCalls: user.combinedCalls || {}, // ✅ CRITICAL FIX: Add this line
            };
          });

          console.log(
            "✅ Processed users with all call data types:",
            processedUsers,
          );
          setDealerUsers((prev) => ({ ...prev, [id]: processedUsers }));
        } else {
          setDealerUsers((prev) => ({ ...prev, [id]: [] }));
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch dealer users:", error);
      setDealerUsers((prev) => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [id]: false }));
    }
  };

  // ✅ FIXED: Function to fetch dealer data for modal - REMOVED customDatesApplied CHECK
  const fetchDealerDataForModal = async (
    dealer,
    filterOverride = null,
    customStart = null,
    customEnd = null,
  ) => {
    const id = dealer.dealerId || dealer.id;
    const token = localStorage.getItem("token");
    if (!token) {
      handleUnauthorized();
      return null;
    }

    try {
      let url = "";
      const effectiveFilter = filterOverride || selectedFilter;
      const isCustomMode = effectiveFilter === "CUSTOM";

      // ✅ FIX: Use passed custom dates from modal if available, otherwise use parent dates
      const effectiveStartDate = customStart || customStartDate;
      const effectiveEndDate = customEnd || customEndDate;

      // console.log(
      //   "📊 Fetching dealer summary data for modal with filter:",
      //   effectiveFilter,
      //   isCustomMode
      //     ? `Dates: ${effectiveStartDate} to ${effectiveEndDate}`
      //     : ""
      // );

      // ✅ ✅ ✅ CRITICAL FIX: Use the same logic as fetchDealerUsersData
      if (isCustomMode && effectiveStartDate && effectiveEndDate) {
        // ✅ Use the custom dates (either from modal or parent)
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&start_date=${effectiveStartDate}&end_date=${effectiveEndDate}`;
        // console.log("🔗 Custom date API URL for modal:", url);
      } else if (isCustomMode && (!effectiveStartDate || !effectiveEndDate)) {
        // ✅ If CUSTOM mode but no dates, fallback to WEEK
        // console.log(
        //   "⚠️ CUSTOM filter selected but no dates available, falling back to WEEK"
        // );
        const apiFilterType = mapFilterToApi("WEEK");
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilterType}`;
      } else {
        // For non-CUSTOM filters, use the type parameter
        const apiFilterType = mapFilterToApi(effectiveFilter);
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${id}&type=${apiFilterType}`;
        // console.log("🔗 Standard filter API URL for modal:", url);
      }

      // console.log("🔗 Dealer summary API URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        handleUnauthorized();
        return null;
      }

      if (!response.ok) {
        if (response.status !== 401) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return null;
        }
      }

      const res = await response.json();
      // console.log("📥 Dealer summary API response:", res);

      if (res?.status === 200 && res.data) {
        let dealerData;

        if (Array.isArray(res.data.dealerData)) {
          dealerData =
            res.data.dealerData.find((d) => (d.dealerId || d.id) === id) ||
            res.data.dealerData[0];
        } else if (
          res.data.dealerData &&
          typeof res.data.dealerData === "object"
        ) {
          dealerData = res.data.dealerData;
        } else if (res.data.dealerId || res.data.dealerName) {
          dealerData = res.data;
        } else {
          dealerData = res.data;
        }

        const processedDealer = processSingleDealerData(
          dealerData,
          effectiveFilter,
        );
        return processedDealer;
      }
    } catch (error) {
      // console.error("❌ Failed to fetch dealer summary data:", error);

      if (
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch") ||
        error.code === "ECONNABORTED"
      ) {
        // toast.error("📡 Please check your internet connection!", {
        //   position: "top-right",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   theme: "colored",
        // });
      } else if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        // No toast here - already handled by centralized handler
      } else {
        toast.error("Failed to load dealer data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    }

    return null;
  };

  // ✅ NEW: Function to fetch user call data for modal with specific data type
  const fetchUserCallDataForModal = async (
    dealerId,
    dataType,
    filterOverride = null,
    customStart = null,
    customEnd = null,
  ) => {
    // console.log("📞 Fetching user call data for modal:", {
    //   dealerId,
    //   dataType,
    //   filter: filterOverride || selectedFilter,
    //   customStart,
    //   customEnd,
    // });

    // First, fetch dealer users data with the filter and custom dates
    const dealer = dealers.find((d) => (d.dealerId || d.id) === dealerId);
    if (dealer) {
      // ✅ IMPORTANT: Always pass the custom dates from modal when available
      // This ensures the modal uses its own dates, not the parent's dates
      await fetchDealerUsersData(
        dealer,
        filterOverride || selectedFilter,
        customStart, // Pass modal's custom dates
        customEnd, // Pass modal's custom dates
      );
    }

    // Then return the sorted call logs with the specific data type
    return getSortedCallLogs(
      dealerId,
      dataType,
      filterOverride || selectedFilter,
      customStart,
      customEnd,
    );
  };

  // Helper function to process single dealer data
  const processSingleDealerData = (dealerData, filter) => {
    const getNum = (value, fallback = 0) => {
      if (value === null || value === undefined || value === "")
        return fallback;
      const num = Number(value);
      return isNaN(num) ? fallback : num;
    };

    // Extract web values properly
    const webleads =
      getNum(dealerData.webleads) || getNum(dealerData.webLeads) || 0;

    const webleadsFollowUps =
      getNum(dealerData.webleadsFollowUps) ||
      getNum(dealerData.webleadsfollowups) ||
      0;

    const saTestDrives =
      getNum(dealerData.saTestDrives) || getNum(dealerData.satestdrives) || 0;

    return {
      dealerId: dealerData.dealerId || dealerData.id || `dealer-${Date.now()}`,
      dealerName: dealerData.dealerName || dealerData.name || "Unknown Dealer",
      id: dealerData.dealerId || dealerData.id || `dealer-${Date.now()}`,
      name: dealerData.dealerName || dealerData.name || "Unknown Dealer",

      // Users data
      totalUsers: getNum(dealerData.totalUsers),
      registerUsers: getNum(dealerData.registerUsers),
      activeUsers: getNum(dealerData.activeUsers),

      // Leads data
      totalLeads: getNum(dealerData.totalLeads),
      saLeads: getNum(dealerData.saLeads),
      webleads: webleads,
      manuallyEnteredLeads: getNum(dealerData.manuallyEnteredLeads),

      // Follow-ups data
      totalFollowUps: getNum(dealerData.totalFollowUps),
      saFollowUps: getNum(dealerData.saFollowUps),
      webleadsFollowUps: webleadsFollowUps,
      completedFollowUps: getNum(dealerData.completedFollowUps),
      openFollowUps: getNum(dealerData.openFollowUps),
      closedFollowUps: getNum(dealerData.closedFollowUps),

      // Web followup fields
      webCompletedFollowUps: getNum(
        dealerData.webCompletedFollowUps || dealerData.webcompletedfollowups,
      ),
      webUpcomingFollowUps: getNum(
        dealerData.webUpcomingFollowUps || dealerData.webupcomingfollowups,
      ),
      webOverdueFollowUps: getNum(
        dealerData.webOverdueFollowUps || dealerData.weboverduefollowups,
      ),

      // Test drives data
      totalTestDrives: getNum(
        dealerData.totalTestDrives || dealerData.saTestDrives,
      ),
      saTestDrives: saTestDrives,
      completedTestDrives: getNum(dealerData.completedTestDrives),
      uniqueTestDrives: getNum(dealerData.uniqueTestDrives),
      upcomingTestDrives: getNum(dealerData.upcomingTestDrives),
      closedTestDrives: getNum(dealerData.closedTestDrives),

      // Web test drive fields
      webleadsTestDrives: getNum(
        dealerData.webleadsTestDrives || dealerData.webleadstestdrives,
      ),
      webCompletedTestDrives: getNum(
        dealerData.webCompletedTestDrives || dealerData.webcompletedtestdrives,
      ),
      webUpcomingTestDrives: getNum(
        dealerData.webUpcomingTestDrives || dealerData.webupcomingtestdrives,
      ),
      webOverdueTestDrives: getNum(
        dealerData.webOverdueTestDrives || dealerData.weboverduetestdrives,
      ),

      // Analytics data
      newOrders: getNum(dealerData.newOrders),
      netOrders: getNum(dealerData.netOrders),
      retail: getNum(dealerData.retail),
      cancellations: getNum(dealerData.cancellations),
      opportunitiesConverted: getNum(dealerData.opportunitiesConverted),

      // Calls data
      enquiriesCalls: dealerData.enquiriesCalls || {},
      coldCalls: dealerData.coldCalls || {},
      callLogs: dealerData.callLogs || {},

      // Users data for expanded rows
      users: dealerData.users || [],

      // Add current filter
      currentFilter: filter,
    };
  };
  // EVENT HANDLERS
  const handleFilterChange = (filter) => {
    // console.log("🔄 Filter changing to:", filter, "from:", selectedFilter);

    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    // ✅ FIX: Clear custom dates when switching AWAY from CUSTOM filter
    if (selectedFilter === "CUSTOM" && filter !== "CUSTOM") {
      // console.log("🧹 Clearing custom dates when switching away from CUSTOM");

      // Clear custom dates from state
      setCustomStartDate("");
      setCustomEndDate("");
      setInvalidDateRange(false);

      // Clear custom dates applied flag
      setCustomDatesApplied(false);

      // Clear applied dates ref
      appliedDatesRef.current = { start: "", end: "" };

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
      // console.log("⏳ Custom filter selected, waiting for Apply button click");

      // ✅ FIX: Set custom filter pending state instead of showing toast
      if (!customStartDate || !customEndDate || !customDatesApplied) {
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
          enqCalls: 0, // ✅ ADDED
          coldCalls: 0, // ✅ ADDED
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
    // console.log("🚀 Fetching fresh data for new filter:", filter);

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

  // Enhanced toggle functions to handle multiple expanded rows
  const toggleSummaryRow = async (event, dealer) => {
    event.stopPropagation();
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
    const id = dealer.dealerId || dealer.id;
    // console.log(
    //   "🎯 Toggling call logs row for dealer:",
    //   dealer.dealerName,
    //   "ID:",
    //   id
    // );

    setExpandedCallLogsRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        // console.log("📌 Collapsing row:", id);
      } else {
        newSet.add(id);
        // console.log("📌 Expanding row:", id);

        // Force fetch user data when expanding
        if (!dealerUsers[id]?.length) {
          // console.log("🔄 Fetching user data for expanded row...");
          fetchDealerUsersData(dealer);
        }
      }
      // console.log("📊 Updated expandedCallLogsRows:", Array.from(newSet));
      return newSet;
    });
  };

  // Functions to expand/collapse all rows
  const expandAllSummaryRows = () => {
    const allIds = new Set(
      dealers.map((dealer) => dealer.dealerId || dealer.id),
    );
    setExpandedSummaryRows(allIds);

    // Fetch user data for all dealers
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
    const allIds = new Set(
      dealers.map((dealer) => dealer.dealerId || dealer.id),
    );
    setExpandedCallLogsRows(allIds);
  };

  const collapseAllCallLogsRows = () => {
    setExpandedCallLogsRows(new Set());
  };

  // Check if all rows are expanded
  const areAllSummaryRowsExpanded = () => {
    return expandedSummaryRows.size === dealers.length && dealers.length > 0;
  };

  const areAllCallLogsRowsExpanded = () => {
    return expandedCallLogsRows.size === dealers.length && dealers.length > 0;
  };

  // ✅ FIXED: applyCustomDate function - FIXED THE MAIN ISSUE
  const applyCustomDate = () => {
    // console.log("📅 applyCustomDate called with:", {
    //   customStartDate,
    //   customEndDate,
    //   currentFilter: selectedFilter,
    //   customDatesApplied,
    // });

    if (!customStartDate || !customEndDate) {
      // console.warn("Please select both start and end dates");
      toast.error("Please select both start and end dates", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    if (new Date(customEndDate) < new Date(customStartDate)) {
      // console.error("End date cannot be earlier than start date");
      toast.error("End date cannot be earlier than start date", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    // console.log(
    //   "📅 Applying custom date range:",
    //   customStartDate,
    //   "to",
    //   customEndDate
    // );

    // ✅ CRITICAL FIX: Save to localStorage first
    localStorage.setItem("customStartDate", customStartDate);
    localStorage.setItem("customEndDate", customEndDate);
    localStorage.setItem("selectedFilter", "CUSTOM");

    // ✅ CRITICAL FIX: Update refs first (instant update)
    appliedDatesRef.current = {
      start: customStartDate,
      end: customEndDate,
    };

    // ✅ CRITICAL FIX: Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    // ✅ CRITICAL FIX: Reset custom filter pending state
    setCustomFilterPending(false);

    // ✅ CRITICAL FIX: Show loading toast first
    // toast.info("Loading data for custom date range...", {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   theme: "colored",
    // });

    // ✅ CRITICAL FIX: Clear existing data immediately
    setDealers([]);
    setFilteredDealers([]);
    setSelectedDealers([]);
    setExpandedSummaryRows(new Set());
    setExpandedCallLogsRows(new Set());
    setDealerUsers({});

    // ✅ CRITICAL FIX: Direct API call with a small delay to ensure state is cleared
    setTimeout(() => {
      // console.log(
      //   "🔄 Making API call for CUSTOM filter with dates:",
      //   customStartDate,
      //   customEndDate
      // );

      // ✅ CRITICAL FIX: Update state after clearing data but before API call
      setCustomDatesApplied(true);
      setSelectedFilter("CUSTOM");
      currentFilterRef.current = "CUSTOM";

      // ✅ CRITICAL FIX: Call fetchDashboardData with a custom flag to bypass the customDatesApplied check
      fetchDashboardDataForCustom(customStartDate, customEndDate);
    }, 100);
  };

  // ✅ NEW: Separate function for custom date fetching that bypasses the state check
  const fetchDashboardDataForCustom = async (startDate, endDate) => {
    // console.log(
    //   "🌐 fetchDashboardDataForCustom called with:",
    //   startDate,
    //   endDate
    // );

    setIsLoading(true);
    currentFilterRef.current = "CUSTOM";

    const token = localStorage.getItem("token");
    if (!token) {
      // console.error("No authentication token found");
      handleUnauthorized();
      setIsLoading(false);
      return;
    }

    try {
      let url = "";

      // Build URL based on selection
      if (selectedDealers.length === 0) {
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?start_date=${startDate}&end_date=${endDate}`;
      } else if (selectedDealers.length === 1) {
        const dealerId = selectedDealers[0].dealerId || selectedDealers[0].id;
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealer_id=${dealerId}&start_date=${startDate}&end_date=${endDate}`;
      } else {
        const dealerIds = selectedDealers
          .map((d) => d.dealerId || d.id)
          .join(",");
        url = `https://uat.smartassistapp.in/api/generalManager/dashboard/report?dealerIds=${dealerIds}&start_date=${startDate}&end_date=${endDate}`;
      }

      // console.log("🔗 Custom API URL:", url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("📡 Custom API Response status:", response.status);

      // 🔴 CRITICAL: Handle 401 Unauthorized with centralized handler
      if (response.status === 401) {
        // console.log("🚨 401 Unauthorized - Token expired or invalid");
        if (handleUnauthorized()) {
          setIsLoading(false);
          return;
        }
      }

      if (!response.ok) {
        if (response.status !== 401) {
          // console.error("❌ HTTP Error:", response.status, response.statusText);
          toast.error(`Server error: ${response.status}. Please try again.`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return;
        }
      }

      const res = await response.json();
      // console.log("📥 Custom API Response:", res);

      if (res?.status === 200 && res.data) {
        // console.log("✅ Custom API Success - Processing data...");
        const updatedDealers = processDealerData(res);

        // console.log("🔄 Processed dealers count:", updatedDealers.length);

        if (updatedDealers.length === 0) {
          // console.log("⚠️ No dealers after processing");
          setKpiData({
            dealers: 0,
            activeNetwork: 0,
            users: 0,
            activeUsers: 0,
            leads: 0,
            calls: 0,
            enqCalls: 0, // ✅ ADDED
            coldCalls: 0, // ✅ ADDED
            totalFollowUps: 0,
            uniqueTestDrives: 0,
            completedTestDrives: 0,
            newOrders: 0,
            netOrders: 0,
            retail: 0,
            cancellations: 0,
          });
          toast.info("No data available for the selected date range.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        } else {
          const sortedDealers = [...updatedDealers].sort(
            (a, b) => (b.saLeads ?? 0) - (a.saLeads ?? 0),
          );

          // console.log("✅ Setting dealers state:", sortedDealers.length);

          setDealers(sortedDealers);
          setFilteredDealers(sortedDealers);

          // Enhanced KPI data mapping with all overview fields
          const overview = res.data.overview || {};
          // console.log("📊 Overview data:", overview);

          const kpiUpdate = {
            dealers: overview.dealers || sortedDealers.length,
            activeNetwork: overview.activeNetwork || sortedDealers.length,
            users: overview.users || 0,
            activeUsers: overview.activeUsers || 0,
            leads: overview.leads || 0,
            calls: overview.calls || 0,
            enqCalls: overview.enqCalls || 0, // ✅ ADDED: Extract enqCalls from overview
            coldCalls: overview.coldCalls || 0, // ✅ ADDED: Extract coldCalls from overview
            totalFollowUps: overview.totalFollowUps || 0,
            uniqueTestDrives: overview.uniqueTestDrives || 0,
            completedTestDrives: overview.completedTestDrives || 0,
            newOrders: overview.newOrders || 0,
            netOrders: overview.netOrders || 0,
            retail: overview.retail || 0,
            cancellations: overview.cancellations || 0,
          };

          // console.log("📊 Setting KPI data:", kpiUpdate);
          setKpiData(kpiUpdate);

          // console.log("✅ Custom data successfully loaded");
        }
      }
    } catch (error) {
      // console.error("❌ Custom API failed:", error);

      if (
        error.message?.includes("Network Error") ||
        error.message?.includes("Failed to fetch") ||
        error.code === "ECONNABORTED"
      ) {
        // toast.error("📡 Please check your internet connection!", {
        //   position: "top-right",
        //   autoClose: 3000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   theme: "colored",
        // });
      } else if (
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        // console.log("🚨 Unauthorized error detected in catch block");
        // No toast here - already handled by centralized handler
      } else {
        toast.error("Failed to load data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateCustomDates = () => {
    if (customStartDate && customEndDate) {
      setInvalidDateRange(new Date(customStartDate) > new Date(customEndDate));
    } else {
      setInvalidDateRange(false);
    }
  };

  // ✅ FIXED: Clear data when resetting custom dates
  const resetCustomDate = () => {
    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedFilter("LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
    setInvalidDateRange(false);

    // ✅ NEW: Reset custom dates applied flag
    setCustomDatesApplied(false);
    appliedDatesRef.current = { start: "", end: "" };

    // ✅ NEW: Reset custom filter pending state
    setCustomFilterPending(false);

    // Clear from localStorage
    localStorage.removeItem("customStartDate");
    localStorage.removeItem("customEndDate");

    // Clear existing data
    setDealers([]);
    setFilteredDealers([]);
    setSelectedDealers([]);
    setExpandedSummaryRows(new Set());
    setExpandedCallLogsRows(new Set());
    setDealerUsers({});
    setUserCallLogs({});

    // toast.info("Custom dates reset to default filter", {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   theme: "colored",
    // });

    // Now fetch data for "LAST_WEEK" filter
    handleFilterChange("LAST_WEEK"); // ✅ CHANGED: From "WEEK" to "LAST_WEEK"
  };

  const refreshDashboardData = () => {
    // console.log("🔃 Refreshing data for current filter:", selectedFilter);

    // ✅ Reset the duplicate call prevention ref
    hasFetchedInitialDataRef.current = false;

    // ✅ FIX: Handle CUSTOM filter differently
    if (selectedFilter === "CUSTOM") {
      if (!customStartDate || !customEndDate) {
        toast.warning("Please apply custom dates first to refresh data", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      // For CUSTOM filter, use the separate function
      toast.info("Refreshing custom date range data...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      fetchDashboardDataForCustom(customStartDate, customEndDate);
      return;
    }

    // toast.info("Refreshing dashboard data...", {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   theme: "colored",
    // });

    // Don't clear data for CUSTOM filter if dates are set
    if (selectedFilter !== "CUSTOM") {
      setExpandedSummaryRows(new Set());
      setExpandedCallLogsRows(new Set());
      setDealerUsers({});
      setUserCallLogs({});
    }

    fetchDashboardData(selectedFilter);
  };

  const toggleDealerSelection = (dealer) => {
    const isSelected = selectedDealers.some(
      (d) => (d.dealerId || d.id) === (dealer.dealerId || dealer.id),
    );

    let newSelectedDealers;
    if (isSelected) {
      newSelectedDealers = selectedDealers.filter(
        (d) => (d.dealerId || d.id) !== (dealer.dealerId || dealer.id),
      );
    } else {
      newSelectedDealers = [...selectedDealers, dealer];
    }

    setSelectedDealers(newSelectedDealers);
  };

  const toggleSelectAll = () => {
    if (selectedDealers.length === filteredDealers.length) {
      setSelectedDealers([]);
      toast.info("All dealers deselected", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } else {
      setSelectedDealers([...filteredDealers]);
    }
  };

  const clearSelection = () => {
    setSelectedDealers([]);
    toast.info("Selection cleared", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
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

  // Table Methods
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

  const getDealerCalls = (dealer, dataType = dealerSummaryCallsDataType) => {
    let calls = {};

    if (dataType === "enquiries") {
      calls = dealer.enquiriesCalls || {};
    } else if (dataType === "coldcalls") {
      calls = dealer.coldCalls || {};
    } else if (dataType === "combinedCalls") {
      calls = dealer.combinedCalls || dealer.callLogs || {};
    } else {
      calls = dealer.callLogs || {};
    }

    // console.log(
    //   `📞 getDealerCalls for ${dealer.dealerName} (${dataType}):`,
    //   calls
    // );

    // Handle different data structures - GET RAW VALUES WITHOUT CALCULATION
    const duration = calls.durationSec || calls.duration || 0;
    const totalCalls = calls.totalCalls || calls.total || 0;
    const connectedCalls = calls.connectedCalls || calls.connected || 0;
    const callsAbove1Min = calls.callsAbove1Min || 0;
    const missed = calls.missed || 0;

    // ✅ REMOVE CALCULATION: Just use the value from API or 0
    const avgConnected = calls.avgConnected || calls.avgConnectedSec || 0;

    return {
      totalCalls: totalCalls,
      outgoing: calls.outgoing || 0,
      incoming: calls.incoming || 0,
      connectedCalls: connectedCalls,
      declined: calls.declined || 0,
      missed: missed,
      duration: duration, // ← RAW VALUE (in seconds)
      avgConnected: avgConnected, // ← RAW VALUE from API (in seconds)
      callsAbove1Min: callsAbove1Min,
    };
  };

  // FIXED getSortedCallLogs function in CEODashboard.jsx
  const getSortedCallLogs = (
    dealerId,
    dataType = dealerSummaryCallsDataType,
    timeFilter = selectedFilter,
    customStart = null,
    customEnd = null,
  ) => {
    console.log("🔍 Getting sorted call logs for dealer:", dealerId);
    console.log("🔍 Requested data type:", dataType);
    console.log("🔍 Requested time filter:", timeFilter);
    console.log("🔍 Custom dates:", customStart, "to", customEnd);

    if (dealerUsers[dealerId]?.length) {
      console.log(
        "✅ Found users in dealerUsers:",
        dealerUsers[dealerId].length,
      );

      const usersWithCalls = dealerUsers[dealerId].map((user) => {
        let calls = {};

        // ✅ FIX: Properly handle combinedCalls data type
        if (dataType === "enquiries") {
          calls = user.enquiriesCalls || user.calls || {};
        } else if (dataType === "coldcalls") {
          calls = user.coldCalls || user.calls || {};
        } else if (dataType === "combinedCalls") {
          // ✅ CRITICAL FIX: Check for combinedCalls first, then fall back to calls
          calls = user.combinedCalls || user.calls || {};

          // ✅ If combinedCalls exists but doesn't have avgConnected/callsAbove1Min,
          // try to get from calls as fallback
          if (calls && (!calls.avgConnected || !calls.callsAbove1Min)) {
            const fallbackCalls = user.calls || {};
            calls.avgConnected =
              calls.avgConnected ||
              fallbackCalls.avgConnected ||
              fallbackCalls.avgConnectedSec ||
              0;
            calls.callsAbove1Min =
              calls.callsAbove1Min || fallbackCalls.callsAbove1Min || 0;
          }
        } else {
          calls = user.calls || {};
        }

        console.log("📊 Raw user calls data for", user.user, ":", calls);

        // Extract all call metrics properly
        const duration = calls.durationSec || calls.duration || 0;
        const totalCalls = calls.totalCalls || calls.total || 0;
        const connectedCalls = calls.connectedCalls || calls.connected || 0;

        // ✅ FIX: Properly extract avgConnected and callsAbove1Min with multiple fallbacks
        const avgConnected =
          calls.avgConnected || calls.avgConnectedSec || calls.avgDuration || 0;

        const callsAbove1Min =
          calls.callsAbove1Min ||
          calls.callsAboveOneMin ||
          calls.callsAbove60Sec ||
          0;

        const userData = {
          userId: user.user_id,
          name: user.user,
          user_role: user.user_role,
          calls: {
            total: totalCalls,
            outgoing: calls.outgoing || 0,
            incoming: calls.incoming || 0,
            connected: connectedCalls,
            declined: calls.declined || 0,
            missed: calls.missed || 0,
            duration: duration, // RAW VALUE (seconds)
            avgConnected: avgConnected, // ✅ Now properly extracted with fallbacks
            callsAbove1Min: callsAbove1Min, // ✅ Now properly extracted with fallbacks
          },
        };

        console.log("✅ Processed user call data:", {
          name: user.user,
          dataType: dataType,
          avgConnected: userData.calls.avgConnected,
          callsAbove1Min: userData.calls.callsAbove1Min,
          rawCalls: calls,
        });

        return userData;
      });

      const sorted = usersWithCalls.sort(
        (a, b) => (b.calls.total || 0) - (a.calls.total || 0),
      );
      return sorted;
    }

    const dealer = dealers.find((d) => (d.dealerId || d.id) === dealerId);
    if (dealer?.users?.length) {
      console.log("✅ Found users in dealer data:", dealer.users.length);

      const usersWithCalls = dealer.users.map((user) => {
        let calls = {};

        // ✅ FIX: Properly handle combinedCalls data type
        if (dataType === "enquiries") {
          calls = user.enquiriesCalls || user.calls || {};
        } else if (dataType === "coldcalls") {
          calls = user.coldCalls || user.calls || {};
        } else if (dataType === "combinedCalls") {
          // ✅ CRITICAL FIX: Check for combinedCalls first, then fall back to calls
          calls = user.combinedCalls || user.calls || {};

          // ✅ If combinedCalls exists but doesn't have avgConnected/callsAbove1Min,
          // try to get from calls as fallback
          if (calls && (!calls.avgConnected || !calls.callsAbove1Min)) {
            const fallbackCalls = user.calls || {};
            calls.avgConnected =
              calls.avgConnected ||
              fallbackCalls.avgConnected ||
              fallbackCalls.avgConnectedSec ||
              0;
            calls.callsAbove1Min =
              calls.callsAbove1Min || fallbackCalls.callsAbove1Min || 0;
          }
        } else {
          calls = user.calls || {};
        }

        console.log(
          "📊 Raw user calls data from dealer:",
          user.user,
          ":",
          calls,
        );

        const duration = calls.durationSec || calls.duration || 0;
        const totalCalls = calls.totalCalls || calls.total || 0;
        const connectedCalls = calls.connectedCalls || calls.connected || 0;

        // ✅ FIX: Properly extract avgConnected and callsAbove1Min with multiple fallbacks
        const avgConnected =
          calls.avgConnected || calls.avgConnectedSec || calls.avgDuration || 0;

        const callsAbove1Min =
          calls.callsAbove1Min ||
          calls.callsAboveOneMin ||
          calls.callsAbove60Sec ||
          0;

        return {
          userId: user.user_id,
          name: user.user,
          user_role: user.user_role,
          calls: {
            total: totalCalls,
            outgoing: calls.outgoing || 0,
            incoming: calls.incoming || 0,
            connected: connectedCalls,
            declined: calls.declined || 0,
            missed: calls.missed || 0,
            duration: duration,
            avgConnected: avgConnected, // ✅ Now properly extracted with fallbacks
            callsAbove1Min: callsAbove1Min, // ✅ Now properly extracted with fallbacks
          },
        };
      });

      const sorted = usersWithCalls.sort(
        (a, b) => (b.calls.total || 0) - (a.calls.total || 0),
      );
      return sorted;
    }

    console.log("❌ No user data found for dealer:", dealerId);
    return [];
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

  // Get sorted dealers for summary table
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

  // ✅ FIXED: Enhanced handleModalFilterChange with proper data fetching
  const handleModalFilterChange = async (
    filterValue,
    applyCustomDates = false,
  ) => {
    if (!selectedDealer) {
      return;
    }

    // If CUSTOM filter and not applying custom dates yet, just update filter
    if (filterValue === "CUSTOM" && !applyCustomDates) {
      setModalFilter("CUSTOM");
      return;
    }

    // If CUSTOM filter and we're applying dates, validate them
    if (filterValue === "CUSTOM" && applyCustomDates) {
      if (!modalCustomStartDate || !modalCustomEndDate) {
        alert("Please select both start and end dates for custom range");
        return;
      }

      const isValid = validateModalDates();
      if (!isValid) {
        alert("Invalid date range. End date must be after start date.");
        return;
      }
    }

    // For CUSTOM filter, make sure we have dates even if not applying new ones
    let startDateToUse, endDateToUse;
    if (filterValue === "CUSTOM") {
      startDateToUse = modalCustomStartDate;
      endDateToUse = modalCustomEndDate;

      // Validate dates are present for CUSTOM filter
      if (!startDateToUse || !endDateToUse) {
        alert("Please select both start and end dates for custom range");
        return;
      }
    }

    setModalFilter(filterValue);
    setIsLoadingDealerData(true);

    try {
      // Fetch fresh dealer summary data
      if (onFetchDealerData) {
        const freshDealerData = await onFetchDealerData(
          selectedDealer,
          filterValue,
          // Pass custom dates when filter is CUSTOM
          filterValue === "CUSTOM" ? startDateToUse : undefined,
          filterValue === "CUSTOM" ? endDateToUse : undefined,
        );

        if (freshDealerData) {
          // ✅ CRITICAL FIX: Ensure the new data has web followup fields
          // If API doesn't return them, set them to 0 to prevent undefined errors
          const enhancedData = {
            ...freshDealerData,
            webCompletedFollowUps:
              freshDealerData.webCompletedFollowUps ||
              freshDealerData.webcompletedfollowups ||
              0,
            webUpcomingFollowUps:
              freshDealerData.webUpcomingFollowUps ||
              freshDealerData.webupcomingfollowups ||
              0,
            webOverdueFollowUps:
              freshDealerData.webOverdueFollowUps ||
              freshDealerData.weboverduefollowups ||
              0,
          };
          setModalDealerData(enhancedData);
        }
      }

      // Also fetch fresh user data
      if (onFetchDealerUsers) {
        // Pass custom dates for CUSTOM filter
        await onFetchDealerUsers(
          selectedDealer,
          filterValue,
          // Pass custom dates for CUSTOM filter
          filterValue === "CUSTOM" ? startDateToUse : undefined,
          filterValue === "CUSTOM" ? endDateToUse : undefined,
        );
      }
    } catch (error) {
      console.error("❌ Failed to fetch dealer data:", error);
      alert("Failed to fetch updated data. Please try again.");
    } finally {
      setIsLoadingDealerData(false);
    }
  };
  // Debug effect to monitor state changes
  useEffect(() => {
    // console.log("📊 CURRENT STATE:", {
    //   filter: selectedFilter,
    //   dealersCount: dealers.length,
    //   selectedDealersCount: selectedDealers.length,
    //   expandedSummaryRows: expandedSummaryRows.size,
    //   expandedCallLogsRows: expandedCallLogsRows.size,
    //   isLoading: isLoading,
    //   isSticky: isSticky,
    //   initialLoadComplete: initialLoadComplete,
    //   customDatesApplied: customDatesApplied,
    //   customStartDate: customStartDate,
    //   customEndDate: customEndDate,
    //   hasCheckedSavedDates: hasCheckedSavedDates,
    //   hasFetchedInitialData: hasFetchedInitialDataRef.current,
    //   shouldAutoFetchCustom: shouldAutoFetchCustom,
    //   customFilterPending: customFilterPending,
    // });
  }, [
    selectedFilter,
    dealers,
    selectedDealers,
    expandedSummaryRows,
    expandedCallLogsRows,
    isLoading,
    isSticky,
    initialLoadComplete,
    customDatesApplied,
    customStartDate,
    customEndDate,
    hasCheckedSavedDates,
    shouldAutoFetchCustom,
    customFilterPending,
  ]);

  return (
    <div className="dashboard-container w-full min-h-screen bg-gray-50">
      {/* ✅ ADDED: ToastContainer to render toasts */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="spinner w-10 h-10 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
        </div>
      )}

      <div className="content-section active w-full">
        <main className="main-content p-2">
          {/* Header */}
          <div className="mb-2">
            <FilterBar
              isSticky={isSticky}
              selectedFilter={selectedFilter}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              invalidDateRange={invalidDateRange}
              dealerSearch={dealerSearch}
              selectedDealers={selectedDealers}
              getFilterLabel={getFilterLabel}
              onFilterChange={handleFilterChange}
              onCustomStartDateChange={setCustomStartDate}
              onCustomEndDateChange={setCustomEndDate}
              onDealerSearchChange={setDealerSearch}
              onValidateCustomDates={validateCustomDates}
              onApplyCustomDate={applyCustomDate}
              onResetCustomDate={resetCustomDate}
              onRefresh={refreshDashboardData}
              dealers={dealers}
              filteredDealers={filteredDealers}
              isDealerSelected={isDealerSelected}
              areAllSelected={areAllSelected}
              onToggleDealerSelection={toggleDealerSelection}
              onToggleSelectAll={toggleSelectAll}
              onClearSelection={clearSelection}
              // ✅ NEW: Pass customDatesApplied to FilterBar
              customDatesApplied={customDatesApplied}
              // ✅ NEW: Pass customFilterPending to FilterBar
              customFilterPending={customFilterPending}
            />
          </div>

          {/* KPI Section */}
          <div className="mb-2">
            <KpiSection
              kpiData={kpiData}
              // ✅ NEW: Pass customFilterPending to show message in KPI section
              customFilterPending={customFilterPending}
            />
          </div>

          {/* Tables */}
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
              onExpandAllSummaryRows={expandAllSummaryRows}
              onCollapseAllSummaryRows={collapseAllSummaryRows}
              areAllSummaryRowsExpanded={areAllSummaryRowsExpanded}
              selectedFilter={selectedFilter}
              onFilterChange={handleFilterChange}
              onRefreshDashboardData={refreshDashboardData}
              onFetchDealerData={fetchDealerDataForModal}
              onFetchDealerUsers={fetchDealerUsersData}
              // ✅ NEW: Pass customDatesApplied and applied dates
              customDatesApplied={customDatesApplied}
              appliedDatesRef={appliedDatesRef}
              // ✅ NEW: Pass customFilterPending to show message in table
              customFilterPending={customFilterPending}
              // ✅ CRITICAL FIX: PASS THE CUSTOM DATES AS PROPS
              customStartDate={customStartDate}
              customEndDate={customEndDate}
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
              onToggleCallLogsRow={toggleCallLogsRow}
              onSetDealerSummaryCallsViewType={setDealerSummaryCallsViewType}
              onSetDealerSummaryCallsDataType={setDealerSummaryCallsDataType}
              onGetDealerCalls={getDealerCalls}
              onGetSortedCallLogs={getSortedCallLogs}
              onExpandAllCallLogsRows={expandAllCallLogsRows}
              onCollapseAllCallLogsRows={collapseAllCallLogsRows}
              areAllCallLogsRowsExpanded={areAllCallLogsRowsExpanded}
              // ✅ NEW: Pass the modal filter change handler
              onHandleModalFilterChange={handleModalFilterChange}
              // ✅ NEW: Pass customDatesApplied and applied dates
              customDatesApplied={customDatesApplied}
              appliedDatesRef={appliedDatesRef}
              // ✅ NEW: Pass customFilterPending to show message in table
              customFilterPending={customFilterPending}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CEODashboard;
