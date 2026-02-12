import React, { useState, useRef, useEffect } from "react";
import { getBarColor, getBarWidth } from "./utils/chartUtils";

const MetricChart = ({
  chart,
  chartIndex,
  totalCharts,
  shouldFillBars,
  baseUserOrder,
  selectedUsers = [],
  setSelectedUsers,
  roleFilter,
  showRole, // ✅ Added missing prop
  onSort,
}) => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [callFilter, setCallFilter] = useState("calls");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const scrollRef = useRef(null);

  if (!chart || !chart.users) return null;

  const isCallsSection = chart.title.toLowerCase().includes("call");

  const processedUsers = isCallsSection
    ? chart.users.map((user) => {
        let displayValue;
        switch (callFilter) {
          case "enquiryCalls":
            displayValue = user.enquiryCalls || 0;
            break;
          case "coldCalls":
            displayValue = user.coldCalls || 0;
            break;
          case "calls":
          default:
            displayValue = user.calls || 0;
            break;
        }
        return {
          ...user,
          displayValue,
          value: displayValue,
          role: user.role || "",
        };
      })
    : chart.users.map((user) => ({
        ...user,
        value: user.value || 0,
        role: user.role || "",
      }));

  const sortedUsers = (() => {
    if (baseUserOrder && baseUserOrder.length > 0) {
      return [...processedUsers].sort(
        (a, b) => baseUserOrder.indexOf(a.name) - baseUserOrder.indexOf(b.name)
      );
    } else {
      return [...processedUsers].sort((a, b) =>
        sortOrder === "asc" ? a.value - b.value : b.value - a.value
      );
    }
  })();

  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    if (onSort) {
      const newOrder = [...processedUsers]
        .sort((a, b) =>
          newSortOrder === "asc" ? a.value - b.value : b.value - a.value
        )
        .map((u) => u.name);

      onSort(newOrder);
    }
  };

  const maxValue = Math.max(...sortedUsers.map((user) => user.value), 1);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = (e) => {
      if (chartIndex !== 0) return;
      const scrollTop = e.target.scrollTop;
      const dealerGroupEl = e.target.closest(".dealer-group-container");
      if (!dealerGroupEl) return;

      const chartsInGroup = dealerGroupEl.querySelectorAll(
        ".metric-scroll-sync"
      );
      chartsInGroup.forEach((chartEl, idx) => {
        if (idx !== 0) chartEl.scrollTop = scrollTop;
      });
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [chartIndex]);

  const handleUserClick = (userName) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userName)
        ? prevSelected.filter((name) => name !== userName)
        : [...prevSelected, userName]
    );
  };

  const handleFilterChange = (filter) => {
    setCallFilter(filter);
    setShowFilterDropdown(false);
  };

  const getFilterLabel = () => {
    switch (callFilter) {
      case "calls":
        return "Calls";
      case "enquiryCalls":
        return "Enquiry";
      case "coldCalls":
        return "Cold Calls";
      default:
        return "Calls";
    }
  };

  return (
    <div className="flex-shrink-0 w-full min-w-[220px] flex-1 relative overflow-x-hidden">
      <div className="px-1 min-h-[32px] flex items-center">
        <div className="flex justify-between items-center w-full">
          <span className="text-xs font-semibold text-gray-900 line-clamp-2 flex-1 pr-1">
            {chart.title}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            {isCallsSection && (
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-gray-700"
                >
                  <span>{getFilterLabel()}</span>
                  <svg
                    className={`w-3 h-3 transform transition-transform ${
                      showFilterDropdown ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-0">
                    {["calls", "enquiryCalls", "coldCalls"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`w-full text-left px-3 py-1 text-xs transition-colors ${
                          callFilter === filter
                            ? "bg-[#222fb9] text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {filter === "calls"
                          ? "Calls"
                          : filter === "enquiryCalls"
                          ? "Enquiry"
                          : "Cold Calls"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 text-xs flex-shrink-0">
              <span className="text-gray-600">Avg:</span>
              <span className="font-semibold text-gray-900">
                {chart.dealerAvg || 0}
              </span>
            </div>
          </div>

          <button
            onClick={toggleSortOrder}
            className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
            title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            <svg
              className={`w-3 h-3 transform transition-transform ${
                sortOrder === "asc" ? "rotate-0" : "rotate-180"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`metric-scroll-sync border border-gray-200 rounded-lg bg-white h-32 overflow-x-hidden ${
          chartIndex === 0 ? "overflow-y-auto" : "overflow-y-hidden"
        }`}
      >
        <div className="p-1.5 space-y-1">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user, userIndex) => {
              const isSelected = selectedUsers.includes(user.name);

              return (
                <div
                  key={user.id || user.user_id || userIndex}
                  role="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => chartIndex === 0 && handleUserClick(user.name)}
                  className={`flex items-center gap-1 w-full transition-all duration-200 
                  ${chartIndex === 0 ? "" : "justify-between"} 
                  ${isSelected ? "bg-blue-100 rounded-md" : ""} 
                  ${
                    isSelected || selectedUsers.length === 0
                      ? "opacity-100"
                      : "opacity-40"
                  } 
                  outline-none focus:outline-none active:outline-none focus:ring-0 active:ring-0 select-none`}
                >
                  {chartIndex === 0 && (
                    <div className="w-20 flex-shrink-0 min-w-0 cursor-pointer">
                      <span
                        className={`text-[11px] truncate block ${
                          isSelected
                            ? "text-[#222fb9] font-bold"
                            : "text-gray-900"
                        }`}
                        title={
                          showRole && user.role
                            ? `${user.name} - ${user.role}`
                            : user.name
                        }
                      >
                        {user.name}
                        {showRole && user.role ? ` (${user.role})` : ""}
                      </span>
                    </div>
                  )}

                  <div
                    className={`${
                      chartIndex === 0
                        ? "flex-1 flex items-center gap-1"
                        : "w-full flex items-center gap-1"
                    }`}
                  >
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          backgroundColor: getBarColor(chart.title),
                          width: shouldFillBars
                            ? `${getBarWidth(user.value, maxValue)}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-semibold w-5 text-right flex-shrink-0 ${
                        isSelected ? "text-[#222fb9]" : "text-gray-700"
                      }`}
                    >
                      {user.displayValue || user.value}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-xs text-gray-500 py-4">
              No data available for selected filter
            </div>
          )}
        </div>
      </div>

      {chartIndex < totalCharts - 1 && (
        <div className="absolute right-[-4px] top-0 bottom-0 w-px bg-gray-200" />
      )}
    </div>
  );
};

export default React.memo(MetricChart);
