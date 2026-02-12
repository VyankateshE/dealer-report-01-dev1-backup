// chartUtils.js
export const baseChartOptions = {
  chart: {
    height: 150,
    type: "line",
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: {
      enabled: false,
      easing: "linear",
      speed: 300,
    },
    redrawOnWindowResize: false,
    redrawOnParentResize: false,
  },
  stroke: {
    width: 2,
    curve: "smooth",
    colors: ["#222fb9"],
  },
  markers: {
    size: 4,
    colors: ["#222fb9"],
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: {
      size: 5,
    },
  },
  xaxis: {
    labels: {
      style: {
        fontSize: "10px",
        colors: "#666",
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: "10px",
        colors: "#666",
      },
    },
  },
  grid: {
    show: true,
    borderColor: "#e5e7eb",
    strokeDashArray: 3,
  },
  tooltip: {
    enabled: true,
    shared: false,
    intersect: true,
    followCursor: true,
    x: {
      show: true,
      format: "HH:mm",
    },
  },
  // SIMPLIFIED data labels configuration
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      // Show value if it's greater than 0
      return val > 0 ? val.toString() : "";
    },
    offsetY: -10,
    style: {
      fontSize: "11px",
      fontWeight: "bold",
      colors: ["#FFFFFF"],
    },
    background: {
      enabled: true,
      foreColor: "#222fb9",
      borderRadius: 3,
      padding: 4,
      opacity: 0.9,
      borderWidth: 0,
    },
  },
};

// Simple helper functions
const getMetricColor = (metric) => {
  const colors = {
    leads: "#222fb9",
    testDrives: "#ff9800",
    followups: "#28a745",
    enquiryCalls: "#CB4A1A",
  };
  return colors[metric] || "#222fb9";
};

const getMetricDisplayName = (metric) => {
  const names = {
    leads: "Leads",
    testDrives: "Test Drives",
    followups: "Follow-ups",
    enquiryCalls: "Enquiry Calls",
  };
  return names[metric] || metric;
};

const formatHour = (hour) => {
  if (!hour) return "00:00";
  if (hour.includes(":")) return hour;

  const hourNum = parseInt(hour);
  if (isNaN(hourNum)) return "00:00";

  return `${hourNum.toString().padStart(2, "0")}:00`;
};

// ADD THESE MISSING EXPORTS
export const getBarColor = (chartTitle) => {
  const title = chartTitle?.toLowerCase() || "";
  if (title.includes("sa leads")) return "#001f5b";
  if (title.includes("test drives")) return "#ff9800";
  if (title.includes("followups")) return "#28a745";
  if (title.includes("last login")) return "#222fb9";
  if (title.includes("calls")) return "#CB4A1A";
  return "#222fb9";
};

export const getBarWidth = (value, maxValue) => {
  if (!maxValue || maxValue === 0) return 0;
  return Math.max((value / maxValue) * 100, 2);
};

export const prepareChartData = (data, metric) => {
  if (!data || !data.left || !data.right) {
    return { day: null, hour: null };
  }

  try {
    const dayData = data.left[metric] || [];
    const hourData = data.right[metric] || [];

    const metricColor = getMetricColor(metric);

    // Create a clean copy of base options for this metric
    const commonOptions = JSON.parse(JSON.stringify(baseChartOptions));

    // Update colors for this specific metric
    commonOptions.stroke.colors = [metricColor];
    commonOptions.markers.colors = [metricColor];
    commonOptions.dataLabels.background.foreColor = metricColor;

    const dayChart =
      dayData.length > 0
        ? {
            series: [
              {
                name: getMetricDisplayName(metric),
                data: dayData.map((item) => Number(item.count) || 0),
              },
            ],
            options: {
              ...commonOptions,
              xaxis: {
                ...commonOptions.xaxis,
                categories: dayData.map((item) => String(item.label || "")),
              },
              tooltip: {
                ...commonOptions.tooltip,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const value = series[seriesIndex][dataPointIndex];
                  const timestamp = w.globals.labels[dataPointIndex];
                  const seriesName = w.config.series[seriesIndex].name;

                  if (value > 0) {
                    return `
                <div class="apexcharts-tooltip-title">${timestamp}</div>
                <div class="apexcharts-tooltip-series-group">
                  <div class="apexcharts-tooltip-marker" style="background-color: ${metricColor}"></div>
                  <div class="apexcharts-tooltip-text">
                    <div class="apexcharts-tooltip-y-group">
                      <span class="apexcharts-tooltip-text-label">${seriesName}:</span>
                      <span class="apexcharts-tooltip-text-value">${value}</span>
                    </div>
                  </div>
                </div>
              `;
                  }
                  return "";
                },
              },
            },
          }
        : null;

    const hourChart =
      hourData.length > 0
        ? {
            series: [
              {
                name: getMetricDisplayName(metric),
                data: hourData.map((item) => Number(item.count) || 0),
              },
            ],
            options: {
              ...commonOptions,
              xaxis: {
                ...commonOptions.xaxis,
                categories: hourData.map((item) =>
                  formatHour(String(item.hour || ""))
                ),
              },
              tooltip: {
                ...commonOptions.tooltip,
                x: {
                  show: true,
                  format: "HH:mm",
                },
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  const value = series[seriesIndex][dataPointIndex];
                  const timestamp = w.globals.labels[dataPointIndex];
                  const seriesName = w.config.series[seriesIndex].name;

                  if (value > 0) {
                    return `
                <div class="apexcharts-tooltip-title">${timestamp}</div>
                <div class="apexcharts-tooltip-series-group">
                  <div class="apexcharts-tooltip-marker" style="background-color: ${metricColor}"></div>
                  <div class="apexcharts-tooltip-text">
                    <div class="apexcharts-tooltip-y-group">
                      <span class="apexcharts-tooltip-text-label">${seriesName}:</span>
                      <span class="apexcharts-tooltip-text-value">${value}</span>
                    </div>
                  </div>
                </div>
              `;
                  }
                  return "";
                },
              },
            },
          }
        : null;

    return { day: dayChart, hour: hourChart };
  } catch (error) {
    // console.error(`Error preparing chart data for ${metric}:`, error);
    return { day: null, hour: null };
  }
};

// Updated prepareSimpleChartData function in chartUtils.js
// prepareSimpleChartData function mein debugging add karo
// chartUtils.js mein prepareSimpleChartData function ko update karo
export const prepareSimpleChartData = (data, metric) => {
  if (!data || !data.left || !data.right) {
    // console.log(`❌ No data available for metric: ${metric}`);
    return { day: null, hour: null };
  }

  try {
    const dayData = data.left[metric] || [];
    const hourData = data.right[metric] || [];

    // console.log(`📊 Preparing ${metric} chart - ACTUAL DATA:`, {
    //   dayDataPoints: dayData.length,
    //   hourDataPoints: hourData.length,
    //   dayDataSample: dayData.slice(0, 3), // First 3 items
    //   hourDataSample: hourData.slice(0, 3), // First 3 items
    // });

    const metricColor = getMetricColor(metric);

    const simpleOptions = {
      chart: {
        height: 150,
        type: "line",
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      stroke: {
        width: 2,
        curve: "smooth",
        colors: [metricColor],
      },
      markers: {
        size: 4,
        colors: [metricColor],
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => (val > 0 ? val.toString() : ""),
        offsetY: -10,
        style: {
          colors: ["#fff"],
          fontSize: "11px",
          fontWeight: "bold",
        },
        background: {
          enabled: true,
          foreColor: metricColor,
          borderRadius: 3,
          padding: 4,
        },
      },
      xaxis: {
        labels: { style: { fontSize: "10px", colors: "#666" } },
      },
      yaxis: {
        labels: { style: { fontSize: "10px", colors: "#666" } },
      },
      grid: {
        show: true,
        borderColor: "#e5e7eb",
        strokeDashArray: 3,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => (val > 0 ? val.toString() : ""),
        },
      },
    };

    const dayChart =
      dayData.length > 0
        ? {
            series: [
              {
                name: getMetricDisplayName(metric),
                data: dayData.map((item) => Number(item.count) || 0),
              },
            ],
            options: {
              ...simpleOptions,
              xaxis: {
                ...simpleOptions.xaxis,
                categories: dayData.map((item) => String(item.label || "")),
              },
            },
          }
        : null;

    const hourChart =
      hourData.length > 0
        ? {
            series: [
              {
                name: getMetricDisplayName(metric),
                data: hourData.map((item) => Number(item.count) || 0),
              },
            ],
            options: {
              ...simpleOptions,
              xaxis: {
                ...simpleOptions.xaxis,
                categories: hourData.map((item) =>
                  formatHour(String(item.hour || ""))
                ),
              },
            },
          }
        : null;

    // console.log(`✅ ${metric} chart prepared:`, {
    //   dayChartData: dayChart?.series[0]?.data,
    //   hourChartData: hourChart?.series[0]?.data,
    // });

    return { day: dayChart, hour: hourChart };
  } catch (error) {
    // console.error(`❌ Error preparing simple chart data for ${metric}:`, error);
    return { day: null, hour: null };
  }
};
// ADD THESE EXPORTS TOO
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

export const getMaxValue = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return 0;
  return Math.max(...dataArray.map((item) => Number(item.count) || 0));
};
