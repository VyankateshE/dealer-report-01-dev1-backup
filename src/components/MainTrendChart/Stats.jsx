import React from "react";

const Stats = ({ stats, fetchData }) => {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="text-center min-w-[70px]">
        <div className="text-lg font-semibold text-gray-900">
          {stats.distinctUsers}
        </div>
        <div className="text-xs text-gray-600">Active Users</div>
      </div>
      <div className="text-center min-w-[70px]">
        <div className="text-lg font-semibold text-gray-900">
          {stats.saLeads}
        </div>
        <div className="text-xs text-gray-600">Leads</div>
      </div>
      <div className="text-center min-w-[70px]">
        <div className="text-lg font-semibold text-gray-900">
          {stats.followups}
        </div>
        <div className="text-xs text-gray-600">Follow-ups</div>
      </div>
      <div className="text-center min-w-[70px]">
        <div className="text-lg font-semibold text-gray-900">
          {stats.testDrives}
        </div>
        <div className="text-xs text-gray-600">UTDs</div>
      </div>
      <div className="text-center min-w-[90px]">
        <div className="text-lg font-semibold text-gray-900">
          {stats.enquiryCalls} / {stats.coldCalls}
        </div>
        <div className="text-xs text-gray-600">Enquiry / Cold calls</div>
      </div>

      {/* Refresh Button */}
      <button
        className="border border-[#222fb9] text-[#222fb9] hover:bg-[#222fb9] hover:text-white px-3 py-1.5 rounded text-sm transition-colors duration-200 flex items-center gap-2"
        onClick={fetchData}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Refresh</span>
      </button>
    </div>
  );
};

export default Stats;
