import React from "react";

// ✅ Format numbers with commas
const formatNumber = (num) => {
  if (num === null || num === undefined || num === "") return "0";
  // Handle string numbers
  const numberValue = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(numberValue)) return "0";

  // Format with commas for thousands
  return numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// ✅ Format numbers in ratio format (e.g., "1,000 / 500")
const formatRatio = (num1, num2) => {
  return `${formatNumber(num1)} / ${formatNumber(num2)}`;
};

const KpiSection = ({ kpiData }) => {
  // ✅ Create formatted data
  const formattedData = {
    activeUsers: formatNumber(kpiData?.activeUsers),
    users: formatNumber(kpiData?.users),

    // Enquiries
    leads: formatNumber(kpiData?.leads),
    digitalLeads: formatNumber(kpiData?.webLeads || 0),
    otherLeads: formatNumber((kpiData?.leads || 0) - (kpiData?.webLeads || 0)),

    // Calls
    calls: formatNumber(kpiData?.calls),

    // Followups
    totalFollowUps: formatNumber(kpiData?.totalFollowUps),
    digitalFollowUps: formatNumber(kpiData?.webFollowUps || 0),
    otherFollowUps: formatNumber(
      (kpiData?.totalFollowUps || 0) - (kpiData?.webFollowUps || 0),
    ),

    // Test Drives
    uniqueTestDrives: formatNumber(kpiData?.uniqueTestDrives),
    completedTestDrives: formatNumber(kpiData?.completedTestDrives),

    digitalTestDrives: formatNumber(kpiData?.webTestDrives || 0),
    otherTestDrives: formatNumber(
      (kpiData?.uniqueTestDrives || 0) - (kpiData?.webTestDrives || 0),
    ),

    digitalCompletedTestDrives: formatNumber(
      kpiData?.webCompletedTestDrives || 0,
    ),
    otherCompletedTestDrives: formatNumber(
      (kpiData?.completedTestDrives || 0) -
        (kpiData?.webCompletedTestDrives || 0),
    ),
  };

  return (
    <section className="kpi-section grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 my-1">
      {/* Active Users */}
      <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">Active Users</div>
        <div className="text-xl font-bold text-gray-900">
          {formattedData.activeUsers}
        </div>
        <div className="text-xs text-gray-500">
          Total Registered Users:{" "}
          <span className="font-semibold">{formattedData.users}</span>
        </div>
      </div>

      {/* Enquiries - With + sign */}
      <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">Enquiries</div>

        <div className="text-xl font-bold text-gray-900">
          {formattedData.leads}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          (<span className="font-semibold">{formattedData.otherLeads}</span>+
          <span className="font-semibold" style={{ color: "rgb(255, 152, 0)" }}>
            {formattedData.digitalLeads}
          </span>
          )
        </div>
      </div>

      {/* Calls */}
      <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">
          Calls (
          <span style={{ color: "#222fb9", fontWeight: 600 }}>Enquiry </span>+
          Cold)
        </div>

        <div className="text-xl font-bold text-gray-900">{kpiData.calls}</div>

        <div className="text-xs text-gray-500 mt-1">
          (
          <span className="font-semibold" style={{ color: "#222fb9" }}>
            {kpiData.enqCalls}
          </span>
          +
          <span className="font-semibold text-gray-900">
            {kpiData.coldCalls}
          </span>
          )
        </div>
      </div>

      {/* Total Followups - With + sign */}
      {/* <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">Total Followups</div>
        <div className="text-xl font-bold text-gray-900">
          {formattedData.totalFollowUps}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <span className="font-semibold">{formattedData.otherFollowUps}</span>{" "}
          +{" "}
          <span className="font-semibold" style={{ color: "rgb(255, 152, 0)" }}>
            {formattedData.digitalFollowUps}
          </span>
        </div>
      </div> */}
      <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">Total Followups</div>

        <div className="text-xl font-bold text-gray-900">
          {formattedData.totalFollowUps}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          (<span className="font-semibold">{formattedData.otherFollowUps}</span>
          +
          <span className="font-semibold" style={{ color: "rgb(255, 152, 0)" }}>
            {formattedData.digitalFollowUps}
          </span>
          )
        </div>
      </div>

      {/* Test Drives - With + signs */}
      <div className="kpi-card bg-white rounded-lg shadow-sm p-3 text-center">
        <div className="text-xs text-gray-600">
          Total / Completed Test Drives
        </div>

        <div className="text-xl font-bold text-gray-900">
          {formattedData.uniqueTestDrives} / {formattedData.completedTestDrives}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          (<span>{formattedData.otherTestDrives}</span>+
          <span style={{ color: "rgb(255, 152, 0)" }}>
            {formattedData.digitalTestDrives}
          </span>
          ) + (<span>{formattedData.otherCompletedTestDrives}</span>+
          <span style={{ color: "rgb(255, 152, 0)" }}>
            {formattedData.digitalCompletedTestDrives}
          </span>
          )
        </div>
      </div>
    </section>
  );
};

export default KpiSection;
