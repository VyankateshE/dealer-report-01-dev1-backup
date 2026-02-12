// import React, { memo, useMemo } from "react";
// import Chart from "react-apexcharts";
// import { prepareSimpleChartData } from "./utils/chartUtils";

// // Memoized chart row to prevent unnecessary re-renders
// const ChartRow = memo(({ title, dayChart, hourChart, showDayChart }) => {
//   console.log(`Rendering ${title} chart`);

//   return (
//     <div className="flex border-b border-gray-200 last:border-b-0">
//       {/* Title Section */}
//       <div className="w-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center py-5 flex-shrink-0">
//         <h3 className="text-sm font-semibold text-gray-900 -rotate-90 whitespace-nowrap transform origin-center tracking-tight">
//           {title}
//         </h3>
//       </div>

//       {/* Charts Section */}
//       <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
//         {/* Day Level Chart */}
//         {showDayChart && (
//           <div className="flex-1 p-4 min-w-0">
//             <div className="h-32 min-w-0">
//               {dayChart ? (
//                 <div className="w-full h-full min-w-0 overflow-hidden">
//                   <Chart
//                     series={dayChart.series}
//                     options={dayChart.options}
//                     type="line"
//                     height="100%"
//                     width="100%"
//                     key={`${title}-day-${dayChart.series[0]?.data?.join("-")}`}
//                   />
//                 </div>
//               ) : (
//                 <NoDataPlaceholder />
//               )}
//             </div>
//           </div>
//         )}

//         {/* Hour Level Chart */}
//         <div className="flex-1 p-4 min-w-0">
//           <div className="h-32 min-w-0">
//             {hourChart ? (
//               <div className="w-full h-full min-w-0 overflow-hidden">
//                 <Chart
//                   series={hourChart.series}
//                   options={hourChart.options}
//                   type="line"
//                   height="100%"
//                   width="100%"
//                   key={`${title}-hour-${hourChart.series[0]?.data?.join("-")}`}
//                 />
//               </div>
//             ) : (
//               <NoDataPlaceholder />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// ChartRow.displayName = "ChartRow";

// // Memoized no data component
// const NoDataPlaceholder = memo(() => (
//   <div className="flex flex-col items-center justify-center h-full text-gray-400">
//     <svg
//       className="w-4 h-4 mb-2"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={1.5}
//         d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//       />
//     </svg>
//     <span className="text-xs">No Data</span>
//   </div>
// ));

// NoDataPlaceholder.displayName = "NoDataPlaceholder";

// // Main ChartsSection component
// const ChartsSection = ({
//   apiData,
//   selectedDateFilter,
//   selectedDealers,
//   refreshTrigger,
// }) => {
//   const showDayChart =
//     selectedDateFilter !== "DAY" && selectedDateFilter !== "YESTERDAY";

//   const chartsData = useMemo(() => {
//     console.log("🎯 Preparing chart data with dealer filter:", {
//       selectedDealers,
//       hasApiData: !!apiData,
//       hasChartData: !!(apiData?.left && apiData?.right),
//     });

//     if (!apiData || !apiData.left || !apiData.right) {
//       console.log("❌ No API data available for charts");
//       return {
//         leads: { day: null, hour: null },
//         testDrives: { day: null, hour: null },
//         followups: { day: null, hour: null },
//         enquiryCalls: { day: null, hour: null },
//       };
//     }

//     // Debug actual data
//     console.log("📊 ACTUAL CHART DATA FROM API (FILTERED):", {
//       leads: apiData.left.leads?.map((item) => ({
//         label: item.label,
//         count: item.count,
//       })),
//       testDrives: apiData.left.testDrives?.map((item) => ({
//         label: item.label,
//         count: item.count,
//       })),
//       followups: apiData.left.followups?.map((item) => ({
//         label: item.label,
//         count: item.count,
//       })),
//       enquiryCalls: apiData.left.enquiryCalls?.map((item) => ({
//         label: item.label,
//         count: item.count,
//       })),
//     });

//     const chartData = {
//       leads: prepareSimpleChartData(apiData, "leads"),
//       testDrives: prepareSimpleChartData(apiData, "testDrives"),
//       followups: prepareSimpleChartData(apiData, "followups"),
//       enquiryCalls: prepareSimpleChartData(apiData, "enquiryCalls"),
//     };

//     console.log("✅ FINAL Chart data prepared:", {
//       leadsData: chartData.leads?.hour?.series?.[0]?.data,
//       followupsData: chartData.followups?.hour?.series?.[0]?.data,
//       testDrivesData: chartData.testDrives?.hour?.series?.[0]?.data,
//       enquiryCallsData: chartData.enquiryCalls?.hour?.series?.[0]?.data,
//     });

//     return chartData;
//   }, [apiData, selectedDealers, refreshTrigger, selectedDateFilter]);

//   const { leads, testDrives, followups, enquiryCalls } = chartsData;

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-0">
//       {/* Charts Level Header */}
//       <div className="flex border-b border-gray-200 bg-gray-50">
//         <div className="w-8 border-r border-gray-200 flex-shrink-0"></div>
//         <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
//           {showDayChart && (
//             <div className="flex-1 text-center py-2 min-w-0">
//               <span className="text-sm font-medium text-gray-700">
//                 Day Level
//               </span>
//             </div>
//           )}
//           <div className="flex-1 text-center py-0.5 min-w-0">
//             <span className="text-sm font-medium text-gray-700">
//               Hour Level
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Charts Rows */}
//       <div className="divide-y divide-gray-200">
//         <ChartRow
//           title="Enquiries"
//           dayChart={leads.day}
//           hourChart={leads.hour}
//           showDayChart={showDayChart}
//         />
//         <ChartRow
//           title="Test Drive"
//           dayChart={testDrives.day}
//           hourChart={testDrives.hour}
//           showDayChart={showDayChart}
//         />
//         <ChartRow
//           title="Follow-ups"
//           dayChart={followups.day}
//           hourChart={followups.hour}
//           showDayChart={showDayChart}
//         />
//         <ChartRow
//           title="Enquiry Calls"
//           dayChart={enquiryCalls.day}
//           hourChart={enquiryCalls.hour}
//           showDayChart={showDayChart}
//         />
//       </div>
//     </div>
//   );
// };

// export default memo(ChartsSection);

// // import React, { memo, useMemo } from "react";
// // import Chart from "react-apexcharts";
// // import { prepareSimpleChartData } from "./utils/chartUtils";

// // // Memoized chart row to prevent unnecessary re-renders
// // const ChartRow = memo(({ title, dayChart, hourChart, showDayChart }) => {
// //   // console.log(`Rendering ${title} chart`);

// //   return (
// //     <>
// //       {/* Mobile layout - stack vertically */}
// //       <div className="md:hidden flex flex-col border-b border-gray-200 last:border-b-0">
// //         {/* Title for mobile */}
// //         <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
// //           <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
// //         </div>

// //         {/* Charts stacked vertically on mobile */}
// //         <div className="flex flex-col">
// //           {/* Day Level Chart - Mobile */}
// //           {showDayChart && (
// //             <div className="p-4 border-b border-gray-100">
// //               <div className="mb-2 text-center">
// //                 <span className="text-xs font-medium text-gray-700">
// //                   Day Level
// //                 </span>
// //               </div>
// //               <div className="h-40">
// //                 {dayChart ? (
// //                   <div className="w-full h-full">
// //                     <Chart
// //                       series={dayChart.series}
// //                       options={{
// //                         ...dayChart.options,
// //                         chart: {
// //                           ...dayChart.options.chart,
// //                           toolbar: {
// //                             show: false, // Hide toolbar on mobile for more space
// //                           },
// //                         },
// //                       }}
// //                       type="line"
// //                       height="100%"
// //                       width="100%"
// //                       key={`${title}-day-mobile-${dayChart.series[0]?.data?.join(
// //                         "-"
// //                       )}`}
// //                     />
// //                   </div>
// //                 ) : (
// //                   <NoDataPlaceholder />
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Hour Level Chart - Mobile */}
// //           <div className="p-4">
// //             <div className="mb-2 text-center">
// //               <span className="text-xs font-medium text-gray-700">
// //                 Hour Level
// //               </span>
// //             </div>
// //             <div className="h-40">
// //               {hourChart ? (
// //                 <div className="w-full h-full">
// //                   <Chart
// //                     series={hourChart.series}
// //                     options={{
// //                       ...hourChart.options,
// //                       chart: {
// //                         ...hourChart.options.chart,
// //                         toolbar: {
// //                           show: false, // Hide toolbar on mobile for more space
// //                         },
// //                       },
// //                     }}
// //                     type="line"
// //                     height="100%"
// //                     width="100%"
// //                     key={`${title}-hour-mobile-${hourChart.series[0]?.data?.join(
// //                       "-"
// //                     )}`}
// //                   />
// //                 </div>
// //               ) : (
// //                 <NoDataPlaceholder />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Desktop layout - original side-by-side */}
// //       <div className="hidden md:flex border-b border-gray-200 last:border-b-0">
// //         {/* Title Section */}
// //         <div className="w-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center py-5 flex-shrink-0">
// //           <h3 className="text-sm font-semibold text-gray-900 -rotate-90 whitespace-nowrap transform origin-center tracking-tight">
// //             {title}
// //           </h3>
// //         </div>

// //         {/* Charts Section */}
// //         <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
// //           {/* Day Level Chart */}
// //           {showDayChart && (
// //             <div className="flex-1 p-4 min-w-0">
// //               <div className="h-32 min-w-0">
// //                 {dayChart ? (
// //                   <div className="w-full h-full min-w-0 overflow-hidden">
// //                     <Chart
// //                       series={dayChart.series}
// //                       options={dayChart.options}
// //                       type="line"
// //                       height="100%"
// //                       width="100%"
// //                       key={`${title}-day-${dayChart.series[0]?.data?.join(
// //                         "-"
// //                       )}`}
// //                     />
// //                   </div>
// //                 ) : (
// //                   <NoDataPlaceholder />
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Hour Level Chart */}
// //           <div className="flex-1 p-4 min-w-0">
// //             <div className="h-32 min-w-0">
// //               {hourChart ? (
// //                 <div className="w-full h-full min-w-0 overflow-hidden">
// //                   <Chart
// //                     series={hourChart.series}
// //                     options={hourChart.options}
// //                     type="line"
// //                     height="100%"
// //                     width="100%"
// //                     key={`${title}-hour-${hourChart.series[0]?.data?.join(
// //                       "-"
// //                     )}`}
// //                   />
// //                 </div>
// //               ) : (
// //                 <NoDataPlaceholder />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // });

// // ChartRow.displayName = "ChartRow";

// // // Memoized no data component
// // const NoDataPlaceholder = memo(() => (
// //   <div className="flex flex-col items-center justify-center h-full text-gray-400">
// //     <svg
// //       className="w-4 h-4 mb-2"
// //       fill="none"
// //       stroke="currentColor"
// //       viewBox="0 0 24 24"
// //     >
// //       <path
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //         strokeWidth={1.5}
// //         d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
// //       />
// //     </svg>
// //     <span className="text-xs">No Data</span>
// //   </div>
// // ));

// // NoDataPlaceholder.displayName = "NoDataPlaceholder";

// // // Helper function to filter chart data based on selected dealers
// // const filterChartData = (apiData, selectedDealers, dealers) => {
// //   if (!apiData || selectedDealers.length === 0 || !dealers) {
// //     return apiData;
// //   }

// //   // console.log("🎯 Filtering chart data for dealers:", selectedDealers);

// //   // Create a deep copy
// //   const filteredData = JSON.parse(JSON.stringify(apiData));

// //   // Get selected dealer names
// //   const selectedDealerNames = dealers
// //     .filter((dealer) => selectedDealers.includes(dealer.dealer_id))
// //     .map((dealer) => dealer.dealer_name);

// //   // console.log(
// //   //   "📋 Selected dealer names for chart filtering:",
// //   //   selectedDealerNames
// //   // );

// //   return filteredData;
// // };

// // // Main ChartsSection component
// // const ChartsSection = ({
// //   apiData,
// //   selectedDateFilter,
// //   selectedDealers,
// //   refreshTrigger,
// //   dealers, // ✅ ADDED: Need dealers to map IDs to names
// // }) => {
// //   const showDayChart =
// //     selectedDateFilter !== "DAY" && selectedDateFilter !== "YESTERDAY";

// //   const chartsData = useMemo(() => {
// //     // console.log("🎯 Preparing chart data with dealer filter:", {
// //     //   selectedDealers,
// //     //   hasApiData: !!apiData,
// //     //   hasChartData: !!(apiData?.left && apiData?.right),
// //     //   dealerCount: selectedDealers?.length || 0,
// //     // });

// //     if (!apiData || !apiData.left || !apiData.right) {
// //       // console.log("❌ No API data available for charts");
// //       return {
// //         leads: { day: null, hour: null },
// //         testDrives: { day: null, hour: null },
// //         followups: { day: null, hour: null },
// //         enquiryCalls: { day: null, hour: null },
// //       };
// //     }

// //     // ✅ ADDED: Filter data based on selected dealers
// //     const filteredApiData = apiData; // API already filtered based on dealer_ids param

// //     // Debug actual data
// //     // console.log("📊 ACTUAL CHART DATA FROM API (FILTERED):", {
// //     //   selectedDealerCount: selectedDealers?.length || 0,
// //     //   leads: filteredApiData.left.leads?.map((item) => ({
// //     //     label: item.label,
// //     //     count: item.count,
// //     //   })),
// //     //   testDrives: filteredApiData.left.testDrives?.map((item) => ({
// //     //     label: item.label,
// //     //     count: item.count,
// //     //   })),
// //     //   followups: filteredApiData.left.followups?.map((item) => ({
// //     //     label: item.label,
// //     //     count: item.count,
// //     //   })),
// //     //   enquiryCalls: filteredApiData.left.enquiryCalls?.map((item) => ({
// //     //     label: item.label,
// //     //     count: item.count,
// //     //   })),
// //     // });

// //     const chartData = {
// //       leads: prepareSimpleChartData(filteredApiData, "leads"),
// //       testDrives: prepareSimpleChartData(filteredApiData, "testDrives"),
// //       followups: prepareSimpleChartData(filteredApiData, "followups"),
// //       enquiryCalls: prepareSimpleChartData(filteredApiData, "enquiryCalls"),
// //     };

// //     // console.log("✅ FINAL Chart data prepared:", {
// //     //   selectedDealers,
// //     //   leadsData: chartData.leads?.hour?.series?.[0]?.data,
// //     //   followupsData: chartData.followups?.hour?.series?.[0]?.data,
// //     //   testDrivesData: chartData.testDrives?.hour?.series?.[0]?.data,
// //     //   enquiryCallsData: chartData.enquiryCalls?.hour?.series?.[0]?.data,
// //     // });

// //     return chartData;
// //   }, [apiData, selectedDealers, refreshTrigger, selectedDateFilter]);

// //   const { leads, testDrives, followups, enquiryCalls } = chartsData;

// //   return (
// //     <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-0">
// //       {/* Charts Level Header - Desktop only (mobile headers are in each row) */}
// //       <div className="hidden md:flex border-b border-gray-200 bg-gray-50">
// //         <div className="w-8 border-r border-gray-200 flex-shrink-0"></div>
// //         <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
// //           {showDayChart && (
// //             <div className="flex-1 text-center py-2 min-w-0">
// //               <span className="text-sm font-medium text-gray-700">
// //                 Day Level
// //               </span>
// //             </div>
// //           )}
// //           <div className="flex-1 text-center py-0.5 min-w-0">
// //             <span className="text-sm font-medium text-gray-700">
// //               Hour Level
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Charts Rows */}
// //       <div className="divide-y divide-gray-200">
// //         <ChartRow
// //           title="Enquiries"
// //           dayChart={leads.day}
// //           hourChart={leads.hour}
// //           showDayChart={showDayChart}
// //         />
// //         <ChartRow
// //           title="Test Drive"
// //           dayChart={testDrives.day}
// //           hourChart={testDrives.hour}
// //           showDayChart={showDayChart}
// //         />
// //         <ChartRow
// //           title="Follow-ups"
// //           dayChart={followups.day}
// //           hourChart={followups.hour}
// //           showDayChart={showDayChart}
// //         />
// //         <ChartRow
// //           title="Enquiry Calls"
// //           dayChart={enquiryCalls.day}
// //           hourChart={enquiryCalls.hour}
// //           showDayChart={showDayChart}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default memo(ChartsSection);
import React, { memo, useMemo } from "react";
import Chart from "react-apexcharts";
import { prepareSimpleChartData } from "./utils/chartUtils";

// Memoized chart row to prevent unnecessary re-renders
const ChartRow = memo(({ title, dayChart, hourChart, showDayChart }) => {
  // console.log(`Rendering ${title} chart`);

  return (
    <>
      {/* Mobile layout - stack vertically */}
      <div className="md:hidden flex flex-col border-b border-gray-200 last:border-b-0">
        {/* Title for mobile */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>

        {/* Charts stacked vertically on mobile */}
        <div className="flex flex-col">
          {/* Day Level Chart - Mobile */}
          {showDayChart && (
            <div className="p-4 border-b border-gray-100">
              <div className="mb-2 text-center">
                <span className="text-xs font-medium text-gray-700">
                  Day Level
                </span>
              </div>
              <div className="h-40">
                {dayChart ? (
                  <div className="w-full h-full">
                    <Chart
                      series={dayChart.series}
                      options={{
                        ...dayChart.options,
                        chart: {
                          ...dayChart.options.chart,
                          toolbar: {
                            show: false, // Hide toolbar on mobile for more space
                          },
                        },
                      }}
                      type="line"
                      height="100%"
                      width="100%"
                      key={`${title}-day-mobile-${dayChart.series[0]?.data?.join(
                        "-"
                      )}`}
                    />
                  </div>
                ) : (
                  <NoDataPlaceholder />
                )}
              </div>
            </div>
          )}

          {/* Hour Level Chart - Mobile */}
          <div className="p-4">
            <div className="mb-2 text-center">
              <span className="text-xs font-medium text-gray-700">
                Hour Level
              </span>
            </div>
            <div className="h-40">
              {hourChart ? (
                <div className="w-full h-full">
                  <Chart
                    series={hourChart.series}
                    options={{
                      ...hourChart.options,
                      chart: {
                        ...hourChart.options.chart,
                        toolbar: {
                          show: false, // Hide toolbar on mobile for more space
                        },
                      },
                    }}
                    type="line"
                    height="100%"
                    width="100%"
                    key={`${title}-hour-mobile-${hourChart.series[0]?.data?.join(
                      "-"
                    )}`}
                  />
                </div>
              ) : (
                <NoDataPlaceholder />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop layout - original side-by-side */}
      <div className="hidden md:flex border-b border-gray-200 last:border-b-0">
        {/* Title Section */}
        <div className="w-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center py-5 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 -rotate-90 whitespace-nowrap transform origin-center tracking-tight">
            {title}
          </h3>
        </div>

        {/* Charts Section */}
        <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
          {/* Day Level Chart */}
          {showDayChart && (
            <div className="flex-1 p-4 min-w-0">
              <div className="h-32 min-w-0">
                {dayChart ? (
                  <div className="w-full h-full min-w-0 overflow-hidden">
                    <Chart
                      series={dayChart.series}
                      options={dayChart.options}
                      type="line"
                      height="100%"
                      width="100%"
                      key={`${title}-day-${dayChart.series[0]?.data?.join(
                        "-"
                      )}`}
                    />
                  </div>
                ) : (
                  <NoDataPlaceholder />
                )}
              </div>
            </div>
          )}

          {/* Hour Level Chart */}
          <div className="flex-1 p-4 min-w-0">
            <div className="h-32 min-w-0">
              {hourChart ? (
                <div className="w-full h-full min-w-0 overflow-hidden">
                  <Chart
                    series={hourChart.series}
                    options={hourChart.options}
                    type="line"
                    height="100%"
                    width="100%"
                    key={`${title}-hour-${hourChart.series[0]?.data?.join(
                      "-"
                    )}`}
                  />
                </div>
              ) : (
                <NoDataPlaceholder />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ChartRow.displayName = "ChartRow";

// Memoized no data component
const NoDataPlaceholder = memo(() => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <svg
      className="w-4 h-4 mb-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
    <span className="text-xs">No Data</span>
  </div>
));

NoDataPlaceholder.displayName = "NoDataPlaceholder";

// Helper function to filter chart data based on selected dealers
const filterChartData = (apiData, selectedDealers, dealers) => {
  if (!apiData || selectedDealers.length === 0 || !dealers) {
    return apiData;
  }

  // console.log("🎯 Filtering chart data for dealers:", selectedDealers);

  // Create a deep copy
  const filteredData = JSON.parse(JSON.stringify(apiData));

  // Get selected dealer names
  const selectedDealerNames = dealers
    .filter((dealer) => selectedDealers.includes(dealer.dealer_id))
    .map((dealer) => dealer.dealer_name);

  // console.log(
  //   "📋 Selected dealer names for chart filtering:",
  //   selectedDealerNames
  // );

  return filteredData;
};

// Main ChartsSection component
const ChartsSection = ({
  apiData,
  selectedDateFilter,
  selectedDealers,
  refreshTrigger,
  dealers, // ✅ ADDED: Need dealers to map IDs to names
}) => {
  const showDayChart =
    selectedDateFilter !== "DAY" && selectedDateFilter !== "YESTERDAY";

  const chartsData = useMemo(() => {
    // console.log("🎯 Preparing chart data with dealer filter:", {
    //   selectedDealers,
    //   hasApiData: !!apiData,
    //   hasChartData: !!(apiData?.left && apiData?.right),
    //   dealerCount: selectedDealers?.length || 0,
    // });

    if (!apiData || !apiData.left || !apiData.right) {
      // console.log("❌ No API data available for charts");
      return {
        leads: { day: null, hour: null },
        testDrives: { day: null, hour: null },
        followups: { day: null, hour: null },
        enquiryCalls: { day: null, hour: null },
      };
    }

    // ✅ ADDED: Filter data based on selected dealers
    const filteredApiData = apiData; // API already filtered based on dealer_ids param

    // Debug actual data
    // console.log("📊 ACTUAL CHART DATA FROM API (FILTERED):", {
    //   selectedDealerCount: selectedDealers?.length || 0,
    //   leads: filteredApiData.left.leads?.map((item) => ({
    //     label: item.label,
    //     count: item.count,
    //   })),
    //   testDrives: filteredApiData.left.testDrives?.map((item) => ({
    //     label: item.label,
    //     count: item.count,
    //   })),
    //   followups: filteredApiData.left.followups?.map((item) => ({
    //     label: item.label,
    //     count: item.count,
    //   })),
    //   enquiryCalls: filteredApiData.left.enquiryCalls?.map((item) => ({
    //     label: item.label,
    //     count: item.count,
    //   })),
    // });

    const chartData = {
      leads: prepareSimpleChartData(filteredApiData, "leads"),
      testDrives: prepareSimpleChartData(filteredApiData, "testDrives"),
      followups: prepareSimpleChartData(filteredApiData, "followups"),
      enquiryCalls: prepareSimpleChartData(filteredApiData, "enquiryCalls"),
    };

    // console.log("✅ FINAL Chart data prepared:", {
    //   selectedDealers,
    //   leadsData: chartData.leads?.hour?.series?.[0]?.data,
    //   followupsData: chartData.followups?.hour?.series?.[0]?.data,
    //   testDrivesData: chartData.testDrives?.hour?.series?.[0]?.data,
    //   enquiryCallsData: chartData.enquiryCalls?.hour?.series?.[0]?.data,
    // });

    return chartData;
  }, [apiData, selectedDealers, refreshTrigger, selectedDateFilter]);

  const { leads, testDrives, followups, enquiryCalls } = chartsData;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-0">
      {/* Charts Level Header - Desktop only (mobile headers are in each row) */}
      <div className="hidden md:flex border-b border-gray-200 bg-gray-50">
        <div className="w-8 border-r border-gray-200 flex-shrink-0"></div>
        <div className="flex-1 flex divide-x divide-gray-200 min-w-0">
          {showDayChart && (
            <div className="flex-1 text-center py-2 min-w-0">
              <span className="text-sm font-medium text-gray-700">
                Day Level
              </span>
            </div>
          )}
          <div className="flex-1 text-center py-0.5 min-w-0">
            <span className="text-sm font-medium text-gray-700">
              Hour Level
            </span>
          </div>
        </div>
      </div>

      {/* Charts Rows */}
      <div className="divide-y divide-gray-200">
        <ChartRow
          title="Enquiries"
          dayChart={leads.day}
          hourChart={leads.hour}
          showDayChart={showDayChart}
        />
        <ChartRow
          title="Test Drive"
          dayChart={testDrives.day}
          hourChart={testDrives.hour}
          showDayChart={showDayChart}
        />
        <ChartRow
          title="Follow-ups"
          dayChart={followups.day}
          hourChart={followups.hour}
          showDayChart={showDayChart}
        />
        <ChartRow
          title="Enquiry Calls"
          dayChart={enquiryCalls.day}
          hourChart={enquiryCalls.hour}
          showDayChart={showDayChart}
        />
      </div>
    </div>
  );
};

export default memo(ChartsSection);
