import React, { useState } from "react";
import MetricChart from "./MetricChart";

const DealerGroup = ({
  dealerGroup,
  shouldFillBars,
  roleFilter = "All",
  showRole,
}) => {
  // Add showRole prop here ^^
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [baseUserOrder, setBaseUserOrder] = useState(() => {
    const firstChart = dealerGroup.charts?.[0];
    if (!firstChart || !firstChart.users) return [];

    const processedUsers = firstChart.users.map((user) => ({
      ...user,
      value: user.calls || 0,
    }));

    return processedUsers.sort((a, b) => b.value - a.value).map((u) => u.name);
  });

  const handleSort = (newOrder) => {
    setBaseUserOrder(newOrder);
  };

  return (
    <div className="dealer-group-container border-b border-gray-200 last:border-b-0 text-xs">
      {/* Dealer Header */}
      <div className="flex justify-between items-center px-2 py-1 sm:px-4 sm:py-0 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xs sm:text-base font-semibold text-gray-900 truncate pr-2">
          {dealerGroup.dealerName}
        </h3>
        <div className="bg-[#222fb9] text-white px-3 py-1 rounded-full text-xs font-sans flex-shrink-0">
          {dealerGroup.users.length} Users
        </div>
      </div>

      {/* Metrics Charts */}
      <div className="flex overflow-x-auto p-2 sm:p-3 gap-1 sm:gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
        {dealerGroup.charts.map((chart, chartIndex) => (
          <MetricChart
            key={chartIndex}
            chart={chart}
            chartIndex={chartIndex}
            totalCharts={dealerGroup.charts.length}
            shouldFillBars={shouldFillBars}
            baseUserOrder={baseUserOrder}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            roleFilter={roleFilter}
            showRole={showRole} // ✅ Add this line - pass showRole to MetricChart
            onSort={handleSort}
          />
        ))}
      </div>
    </div>
  );
};

export default DealerGroup;
