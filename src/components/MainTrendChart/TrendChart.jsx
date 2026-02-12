import React, { useState, useEffect, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterSection from "./FilterSection";
import ChartsSection from "./ChartsSection";
import PsWiseActivity from "./PsWiseActivity";
import LoadingOverlay from "./LoadingOverlay";
import { useApi } from "./hooks/useApi";
import { useScroll } from "./hooks/useScroll";
const TrendChart = () => {
  const [selectedDealers, setSelectedDealers] = useState([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState("LAST_WEEK");
  const [roleFilter, setRoleFilter] = useState("Both");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Create toast function to pass to useApi hook
  const showToast = useCallback((message, type = "info") => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "success":
        toast.success(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast.info(message);
    }
  }, []);

  const {
    isLoading,
    apiData,
    stats,
    dealers,
    filteredDealers,
    dealerSearch,
    setDealerSearch,
    fetchData,
    psWiseCharts,
    error,
  } = useApi(selectedDateFilter, roleFilter, selectedDealers, showToast);

  const { isSticky, headerRef, shouldFillBars } = useScroll();

  // Internet connection monitoring
  useEffect(() => {
    const handleOnline = () => {
      // console.log("✅ Internet connection restored");
      setIsOnline(true);
      // toast.success("🌐 Internet connection restored!");
    };

    const handleOffline = () => {
      // console.log("❌ Internet connection lost");
      setIsOnline(false);
      // toast.error("📡 Please check your internet connection!");
    };

    // Check initial network status
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

  // Check internet connection before API calls
  const checkInternetConnection = () => {
    if (!navigator.onLine) {
      // toast.error("📡 Please check your internet connection!");
      return false;
    }
    return true;
  };

  // Show error toast when useApi returns an error
  useEffect(() => {
    if (error) {
      // Don't show toast for session expired - it's already handled in useApi
      if (!error.includes("Session expired")) {
        toast.error(`Error: ${error}`);
      }
    }
  }, [error]);

  useEffect(() => {
    // console.log("🔍 CURRENT FILTER STATE:", {
    //   selectedDealers,
    //   selectedDealerCount: selectedDealers.length,
    //   apiData: {
    //     hasData: !!apiData,
    //     stats: apiData?.topCards,
    //     chartData: !!(apiData?.left && apiData?.right),
    //     psData: !!apiData?.psWiseActivity,
    //   },
    // });
  }, [selectedDealers, apiData]);

  // Enhanced fetchData function with internet check
  const handleFetchData = useCallback(async () => {
    // Check internet connection first
    if (!checkInternetConnection()) {
      return;
    }

    // console.log("🔄 Manual refresh triggered");
    await fetchData();
    setRefreshTrigger((prev) => prev + 1);
  }, [fetchData]);

  // Initialize with all dealers selected when data is fetched
  useEffect(() => {
    if (dealers.length > 0 && selectedDealers.length === 0) {
      const allDealerIds = dealers.map((dealer) => dealer.dealer_id);
      setSelectedDealers(allDealerIds);
      // console.log("✅ Auto-selected all dealers:", allDealerIds.length);
    }
  }, [dealers]);

  // Handle dealer selection changes
  const handleDealerSelection = useCallback((dealerIds) => {
    // console.log("🎯 Dealer selection changed:", dealerIds);
    setSelectedDealers(dealerIds);
    // Dealer change pe bhi refresh trigger update karo
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Date filter change with internet check
  const handleDateFilterChange = useCallback((filter) => {
    // Check internet connection
    if (!checkInternetConnection()) {
      return;
    }

    // console.log("📅 Date filter changed:", filter);
    setSelectedDateFilter(filter);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Role filter change with internet check
  const handleRoleFilterChange = useCallback((filter) => {
    // Check internet connection
    if (!checkInternetConnection()) {
      return;
    }

    // console.log("👥 Role filter changed:", filter);
    setRoleFilter(filter);
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Debug: Log when apiData changes
  useEffect(() => {
    // console.log("📦 API Data updated:", {
    //   hasData: !!apiData,
    //   stats: apiData?.topCards,
    //   chartData: !!apiData?.left && !!apiData?.right,
    // });
  }, [apiData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
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

      <LoadingOverlay isLoading={isLoading} />

      {/* Header with box styling */}
      <FilterSection
        ref={headerRef}
        dealers={dealers}
        filteredDealers={filteredDealers}
        selectedDealers={selectedDealers}
        setSelectedDealers={handleDealerSelection}
        dealerSearch={dealerSearch}
        setDealerSearch={setDealerSearch}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={handleDateFilterChange}
        stats={stats}
        fetchData={handleFetchData}
        isOnline={isOnline}
      />

      {/* Main content with conditional padding */}
      <div
        className={`max-w-full mx-auto transition-all duration-300 ${
          isSticky ? "pt-32" : "pt-0"
        }`}
      >
        <ChartsSection
          apiData={apiData}
          selectedDateFilter={selectedDateFilter}
          selectedDealers={selectedDealers}
          refreshTrigger={refreshTrigger}
          isOnline={isOnline}
          dealers={dealers} // ✅ ADDED: Pass dealers for filtering
        />

        <PsWiseActivity
          psWiseCharts={psWiseCharts}
          roleFilter={roleFilter}
          setRoleFilter={handleRoleFilterChange}
          shouldFillBars={shouldFillBars}
          refreshTrigger={refreshTrigger}
          isOnline={isOnline}
        />
      </div>
    </div>
  );
};
// const TrendChart = () => {
//   const [selectedDealers, setSelectedDealers] = useState([]);
//   const [selectedDateFilter, setSelectedDateFilter] = useState("LAST_WEEK"); // Changed from "WEEK" to "LAST_WEEK"
//   const [roleFilter, setRoleFilter] = useState("Both");
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // Create toast function to pass to useApi hook
//   const showToast = useCallback((message, type = "info") => {
//     switch (type) {
//       case "error":
//         toast.error(message);
//         break;
//       case "success":
//         toast.success(message);
//         break;
//       case "warning":
//         toast.warning(message);
//         break;
//       default:
//         toast.info(message);
//     }
//   }, []);

//   const {
//     isLoading,
//     apiData,
//     stats,
//     dealers,
//     filteredDealers,
//     dealerSearch,
//     setDealerSearch,
//     fetchData,
//     psWiseCharts,
//     error,
//   } = useApi(selectedDateFilter, roleFilter, selectedDealers, showToast);

//   const { isSticky, headerRef, shouldFillBars } = useScroll();

//   // Internet connection monitoring
//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       // toast.success("🌐 Internet connection restored!");
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       toast.error("📡 Please check your internet connection!");
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
//   }, []);

//   // Check internet connection before API calls
//   const checkInternetConnection = () => {
//     if (!navigator.onLine) {
//       toast.error("📡 Please check your internet connection!");
//       return false;
//     }
//     return true;
//   };

//   // Show error toast when useApi returns an error
//   useEffect(() => {
//     if (error) {
//       // Don't show toast for session expired - it's already handled in useApi
//       if (!error.includes("Session expired")) {
//         toast.error(`Error: ${error}`);
//       }
//     }
//   }, [error]);

//   useEffect(() => {
//     // Debug logging if needed
//   }, [selectedDealers, apiData]);

//   // Enhanced fetchData function with internet check
//   const handleFetchData = useCallback(async () => {
//     // Check internet connection first
//     if (!checkInternetConnection()) {
//       return;
//     }

//     await fetchData();
//     setRefreshTrigger((prev) => prev + 1);
//   }, [fetchData]);

//   // Initialize with all dealers selected when data is fetched
//   useEffect(() => {
//     if (dealers.length > 0 && selectedDealers.length === 0) {
//       const allDealerIds = dealers.map((dealer) => dealer.dealer_id);
//       setSelectedDealers(allDealerIds);
//     }
//   }, [dealers]);

//   // Handle dealer selection changes
//   const handleDealerSelection = useCallback((dealerIds) => {
//     setSelectedDealers(dealerIds);
//     // Dealer change pe bhi refresh trigger update karo
//     setRefreshTrigger((prev) => prev + 1);
//   }, []);

//   // Date filter change with internet check
//   const handleDateFilterChange = useCallback((filter) => {
//     // Check internet connection
//     if (!checkInternetConnection()) {
//       return;
//     }

//     setSelectedDateFilter(filter);
//     setRefreshTrigger((prev) => prev + 1);
//   }, []);

//   // Role filter change with internet check
//   const handleRoleFilterChange = useCallback((filter) => {
//     // Check internet connection
//     if (!checkInternetConnection()) {
//       return;
//     }

//     setRoleFilter(filter);
//     setRefreshTrigger((prev) => prev + 1);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50">
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

//       <LoadingOverlay isLoading={isLoading} />

//       {/* Header with box styling */}
//       <FilterSection
//         ref={headerRef}
//         dealers={dealers}
//         filteredDealers={filteredDealers}
//         selectedDealers={selectedDealers}
//         setSelectedDealers={handleDealerSelection}
//         dealerSearch={dealerSearch}
//         setDealerSearch={setDealerSearch}
//         selectedDateFilter={selectedDateFilter}
//         setSelectedDateFilter={handleDateFilterChange}
//         stats={stats}
//         fetchData={handleFetchData}
//         isOnline={isOnline}
//       />

//       {/* Main content with conditional padding */}
//       <div
//         className={`max-w-full mx-auto transition-all duration-300 ${
//           isSticky ? "pt-32" : "pt-0"
//         }`}
//       >
//         <ChartsSection
//           apiData={apiData}
//           selectedDateFilter={selectedDateFilter}
//           selectedDealers={selectedDealers}
//           refreshTrigger={refreshTrigger}
//           isOnline={isOnline}
//           dealers={dealers}
//         />

//         <PsWiseActivity
//           psWiseCharts={psWiseCharts}
//           roleFilter={roleFilter}
//           setRoleFilter={handleRoleFilterChange}
//           shouldFillBars={shouldFillBars}
//           refreshTrigger={refreshTrigger}
//           isOnline={isOnline}
//         />
//       </div>
//     </div>
//   );
// };

export default TrendChart;
