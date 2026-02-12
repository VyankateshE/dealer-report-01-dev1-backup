import React, { useMemo, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BarChart = ({
  data = [],
  title = "Dealer-wise Calls Analysis",
  height = 500,
  showLegend = true,
}) => {
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [hoveredDealer, setHoveredDealer] = useState(null);
  const chartRef = useRef(null);
  const chartContentRef = useRef(null);

  // Process data - include all dealers even with zero values
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => (b.total || 0) - (a.total || 0));
  }, [data]);

  const maxValue = useMemo(() => {
    const values = chartData.map((item) => item.total || 0);
    return Math.max(...values, 10);
  }, [chartData]);

  // Dynamic scale calculation
  const scaleData = useMemo(() => {
    const percentageBuffer = Math.ceil(maxValue * 0.2);
    let fixedBuffer;
    if (maxValue <= 50) fixedBuffer = 10;
    else if (maxValue <= 100) fixedBuffer = 20;
    else if (maxValue <= 200) fixedBuffer = 30;
    else fixedBuffer = 50;

    const buffer = Math.max(percentageBuffer, fixedBuffer, 10);
    const maxScaleValue = Math.ceil((maxValue + buffer) / 20) * 20;
    const finalMaxScaleValue = Math.max(
      maxScaleValue,
      Math.ceil(maxValue * 1.2)
    );

    const scaleSteps = Math.min(
      8,
      Math.max(5, Math.ceil(finalMaxScaleValue / 50))
    );
    const stepSize = finalMaxScaleValue / scaleSteps;

    return {
      maxScaleValue: finalMaxScaleValue,
      steps: Array.from({ length: scaleSteps + 1 }, (_, i) =>
        Math.round(i * stepSize)
      ),
    };
  }, [maxValue]);

  // Create a temporary chart element for export
  const createExportChart = () => {
    const exportContainer = document.createElement("div");
    exportContainer.style.width = "800px";
    exportContainer.style.backgroundColor = "white";
    exportContainer.style.padding = "20px";
    exportContainer.style.borderRadius = "8px";
    exportContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    // Header
    const header = document.createElement("div");
    header.style.borderBottom = "1px solid #e5e7eb";
    header.style.paddingBottom = "15px";
    header.style.marginBottom = "15px";

    const titleEl = document.createElement("h2");
    titleEl.textContent = title;
    titleEl.style.fontSize = "18px";
    titleEl.style.fontWeight = "bold";
    titleEl.style.textAlign = "center";
    titleEl.style.color = "#1f2937";
    titleEl.style.margin = "0";

    header.appendChild(titleEl);
    exportContainer.appendChild(header);

    // Scale
    const scaleContainer = document.createElement("div");
    scaleContainer.style.marginBottom = "10px";

    const scaleNumbers = document.createElement("div");
    scaleNumbers.style.display = "flex";
    scaleNumbers.style.justifyContent = "space-between";
    scaleNumbers.style.marginBottom = "5px";

    scaleData.steps.forEach((value) => {
      const scaleNumber = document.createElement("span");
      scaleNumber.textContent = value;
      scaleNumber.style.fontSize = "10px";
      scaleNumber.style.color = "#6b7280";
      scaleNumbers.appendChild(scaleNumber);
    });

    const scaleLine = document.createElement("div");
    scaleLine.style.width = "100%";
    scaleLine.style.height = "1px";
    scaleLine.style.backgroundColor = "#d1d5db";
    scaleLine.style.position = "relative";

    scaleData.steps.forEach((value) => {
      const tick = document.createElement("div");
      tick.style.position = "absolute";
      tick.style.width = "1px";
      tick.style.height = "4px";
      tick.style.backgroundColor = "#9ca3af";
      tick.style.top = "-1.5px";
      tick.style.left = `${(value / scaleData.maxScaleValue) * 100}%`;
      scaleLine.appendChild(tick);
    });

    scaleContainer.appendChild(scaleNumbers);
    scaleContainer.appendChild(scaleLine);
    exportContainer.appendChild(scaleContainer);

    // Chart bars
    chartData.forEach((item, index) => {
      const barGroup = document.createElement("div");
      barGroup.style.marginBottom = "8px";
      barGroup.style.paddingBottom = "8px";
      barGroup.style.borderBottom =
        index < chartData.length - 1 ? "1px solid #f3f4f6" : "none";

      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "10px";

      // Dealer name
      const nameContainer = document.createElement("div");
      nameContainer.style.width = "150px";
      nameContainer.style.minWidth = "150px";

      const name = document.createElement("span");
      name.textContent = formatDealerName(item.dealerName, 25);
      name.style.fontSize = "12px";
      name.style.fontWeight = "500";
      name.style.color = (item.total || 0) === 0 ? "#9ca3af" : "#222fb9";
      nameContainer.appendChild(name);

      // Bar container
      const barContainer = document.createElement("div");
      barContainer.style.flex = "1";

      const barWrapper = document.createElement("div");
      barWrapper.style.position = "relative";
      barWrapper.style.width = "100%";
      barWrapper.style.height = "12px";
      barWrapper.style.backgroundColor =
        (item.total || 0) === 0 ? "#f9fafb" : "#f3f4f6";
      barWrapper.style.border =
        (item.total || 0) === 0 ? "1px solid #e5e7eb" : "1px solid #d1d5db";
      barWrapper.style.borderRadius = "4px";
      barWrapper.style.overflow = "hidden";

      if ((item.total || 0) > 0) {
        // Outgoing
        if (item.outgoing > 0) {
          const outgoingBar = document.createElement("div");
          outgoingBar.style.position = "absolute";
          outgoingBar.style.top = "0";
          outgoingBar.style.left = "0";
          outgoingBar.style.height = "100%";
          outgoingBar.style.width = `${getPercentage(item.outgoing)}%`;
          outgoingBar.style.backgroundColor = getColorForMetric("outgoing");
          barWrapper.appendChild(outgoingBar);
        }

        // Incoming
        if (item.incoming > 0) {
          const incomingBar = document.createElement("div");
          incomingBar.style.position = "absolute";
          incomingBar.style.top = "0";
          incomingBar.style.left = `${getPercentage(item.outgoing)}%`;
          incomingBar.style.height = "100%";
          incomingBar.style.width = `${getPercentage(item.incoming)}%`;
          incomingBar.style.backgroundColor = getColorForMetric("incoming");
          barWrapper.appendChild(incomingBar);
        }

        // Connected
        if (item.connected > 0) {
          const connectedBar = document.createElement("div");
          connectedBar.style.position = "absolute";
          connectedBar.style.top = "0";
          connectedBar.style.left = `${
            getPercentage(item.outgoing) + getPercentage(item.incoming)
          }%`;
          connectedBar.style.height = "100%";
          connectedBar.style.width = `${getPercentage(item.connected)}%`;
          connectedBar.style.backgroundColor = getColorForMetric("connected");
          barWrapper.appendChild(connectedBar);
        }

        // Declined
        if (item.declined > 0) {
          const declinedBar = document.createElement("div");
          declinedBar.style.position = "absolute";
          declinedBar.style.top = "0";
          declinedBar.style.left = `${
            getPercentage(item.outgoing) +
            getPercentage(item.incoming) +
            getPercentage(item.connected)
          }%`;
          declinedBar.style.height = "100%";
          declinedBar.style.width = `${getPercentage(item.declined)}%`;
          declinedBar.style.backgroundColor = getColorForMetric("declined");
          barWrapper.appendChild(declinedBar);
        }

        // Total value
        const totalLabel = document.createElement("span");
        totalLabel.textContent = item.total || 0;
        totalLabel.style.position = "absolute";
        totalLabel.style.right = "5px";
        totalLabel.style.top = "50%";
        totalLabel.style.transform = "translateY(-50%)";
        totalLabel.style.fontSize = "10px";
        totalLabel.style.fontWeight = "bold";
        totalLabel.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
        totalLabel.style.padding = "1px 4px";
        totalLabel.style.borderRadius = "2px";
        totalLabel.style.color = "#374151";
        barWrapper.appendChild(totalLabel);
      } else {
        const noData = document.createElement("span");
        noData.textContent = "No Calls";
        noData.style.position = "absolute";
        noData.style.left = "50%";
        noData.style.top = "50%";
        noData.style.transform = "translate(-50%, -50%)";
        noData.style.fontSize = "10px";
        noData.style.color = "#9ca3af";
        barWrapper.appendChild(noData);
      }

      barContainer.appendChild(barWrapper);

      // Metrics
      const metrics = document.createElement("div");
      metrics.style.display = "flex";
      metrics.style.gap = "8px";
      metrics.style.marginTop = "4px";
      metrics.style.fontSize = "10px";

      const metricsData = [
        {
          value: item.outgoing,
          color: getColorForMetric("outgoing"),
          label: "Out",
        },
        {
          value: item.incoming,
          color: getColorForMetric("incoming"),
          label: "In",
        },
        {
          value: item.connected,
          color: getColorForMetric("connected"),
          label: "Conn",
        },
        {
          value: item.declined,
          color: getColorForMetric("declined"),
          label: "Dec",
        },
      ];

      metricsData.forEach((metric) => {
        if (metric.value > 0) {
          const metricEl = document.createElement("div");
          metricEl.style.display = "flex";
          metricEl.style.alignItems = "center";
          metricEl.style.gap = "3px";
          metricEl.style.color = "#6b7280";

          const colorDot = document.createElement("div");
          colorDot.style.width = "6px";
          colorDot.style.height = "6px";
          colorDot.style.backgroundColor = metric.color;
          colorDot.style.borderRadius = "1px";

          const value = document.createElement("span");
          value.textContent = metric.value;

          metricEl.appendChild(colorDot);
          metricEl.appendChild(value);
          metrics.appendChild(metricEl);
        }
      });

      barContainer.appendChild(metrics);

      row.appendChild(nameContainer);
      row.appendChild(barContainer);
      barGroup.appendChild(row);
      exportContainer.appendChild(barGroup);
    });

    // Legend
    const legend = document.createElement("div");
    legend.style.marginTop = "15px";
    legend.style.paddingTop = "10px";
    legend.style.borderTop = "1px solid #e5e7eb";
    legend.style.display = "flex";
    legend.style.justifyContent = "center";
    legend.style.gap = "15px";
    legend.style.flexWrap = "wrap";

    const legendItems = [
      { color: getColorForMetric("outgoing"), label: "Outgoing" },
      { color: getColorForMetric("incoming"), label: "Incoming" },
      { color: getColorForMetric("connected"), label: "Connected" },
      { color: getColorForMetric("declined"), label: "Declined" },
    ];

    legendItems.forEach((item) => {
      const legendItem = document.createElement("div");
      legendItem.style.display = "flex";
      legendItem.style.alignItems = "center";
      legendItem.style.gap = "4px";

      const colorDot = document.createElement("div");
      colorDot.style.width = "8px";
      colorDot.style.height = "8px";
      colorDot.style.backgroundColor = item.color;
      colorDot.style.borderRadius = "1px";

      const label = document.createElement("span");
      label.textContent = item.label;
      label.style.fontSize = "10px";
      label.style.color = "#374151";

      legendItem.appendChild(colorDot);
      legendItem.appendChild(label);
      legend.appendChild(legendItem);
    });

    exportContainer.appendChild(legend);

    return exportContainer;
  };

  // Export functions
  const exportAsPNG = async () => {
    try {
      const exportChart = createExportChart();
      document.body.appendChild(exportChart);

      const canvas = await html2canvas(exportChart, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      document.body.removeChild(exportChart);

      const dataURL = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `dealer-calls-chart-${
        new Date().toISOString().split("T")[0]
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // console.error('Error exporting PNG:', error);
      alert("Error exporting chart as PNG. Please try again.");
    }
  };

  const exportAsPDF = async () => {
    try {
      const exportChart = createExportChart();
      document.body.appendChild(exportChart);

      const canvas = await html2canvas(exportChart, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });

      document.body.removeChild(exportChart);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(
        `dealer-calls-chart-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      // console.error('Error exporting PDF:', error);
      alert("Error exporting chart as PDF. Please try again.");
    }
  };

  const exportAsCSV = () => {
    try {
      const headers = [
        "Dealer Name",
        "Total Calls",
        "Outgoing",
        "Incoming",
        "Connected",
        "Declined",
      ];

      const csvData = chartData.map((item) => [
        `"${item.dealerName.replace(/"/g, '""')}"`,
        item.total || 0,
        item.outgoing || 0,
        item.incoming || 0,
        item.connected || 0,
        item.declined || 0,
      ]);

      const csvContent = [headers, ...csvData]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dealer-calls-data-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Error exporting CSV:', error);
      alert("Error exporting data as CSV. Please try again.");
    }
  };

  // Dynamic colors based on call types
  const getColorForMetric = (metric) => {
    const colors = {
      total: "#3b82f6",
      outgoing: "#10b981",
      incoming: "#8b5cf6",
      connected: "#f59e0b",
      declined: "#ef4444",
    };
    return colors[metric] || "#6b7280";
  };

  const formatDealerName = (name, maxLength = 20) => {
    return name.length > maxLength
      ? name.substring(0, maxLength - 3) + "..."
      : name;
  };

  const getPercentage = (value) => {
    return ((value || 0) / scaleData.maxScaleValue) * 100;
  };

  const handleDealerClick = (dealerId) => {
    if (selectedDealer === dealerId) {
      setSelectedDealer(null);
    } else {
      setSelectedDealer(dealerId);
    }
  };

  const handleCloseDetails = () => {
    setSelectedDealer(null);
  };

  if (!data || data.length === 0) {
    return (
      <div
        className="bar-chart-container bg-white rounded-lg border border-gray-200"
        style={{ height }}
      >
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
            <i className="fas fa-chart-bar text-gray-400 text-sm"></i>
          </div>
          <h3 className="text-sm font-bold text-gray-600 mb-1">
            No Data Available
          </h3>
          <p className="text-gray-500 text-xs">No data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      className="bar-chart-container bg-white rounded-lg border border-gray-200"
      style={{ height }}
    >
      {/* Header */}
      <div className="chart-header p-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
          </div>

          {/* Export Button with Dropdown */}
          <div className="relative group">
            <button className="px-3 py-1 bg-[#222fb9] cursor-pointer text-white text-xs font-semibold rounded hover:bg-gray-300 transition-colors flex items-center gap-1">
              <i className="fas fa-download text-xs"></i>
              Export
              <i className="fas fa-chevron-down text-xs"></i>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <button
                onClick={exportAsPNG}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-image text-gray-400 text-xs"></i>
                PNG Image
              </button>
              <button
                onClick={exportAsPDF}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-file-pdf text-gray-400 text-xs"></i>
                PDF Document
              </button>
              <button
                onClick={exportAsCSV}
                className="w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
              >
                <i className="fas fa-file-csv text-gray-400 text-xs"></i>
                CSV Data
              </button>
            </div>
          </div>
        </div>

        {/* Scale Numbers */}
        <div className="flex justify-between mt-2 px-1">
          {scaleData.steps.map((value) => (
            <span key={value} className="text-xs text-gray-600">
              {value}
            </span>
          ))}
        </div>

        {/* Scale Line */}
        <div className="w-full h-px bg-gray-300 mt-1 relative">
          {scaleData.steps.map((value) => (
            <div
              key={value}
              className="absolute w-px h-1 bg-gray-400 -top-0.5"
              style={{ left: `${(value / scaleData.maxScaleValue) * 100}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div
        ref={chartContentRef}
        className="chart-content p-3"
        style={{ height: `calc(${height}px - 140px)` }}
      >
        <div className="space-y-0 max-h-full overflow-y-auto">
          {chartData.map((item, index) => {
            const hasZeroValue = (item.total || 0) === 0;
            const isHovered = hoveredDealer === item.id;
            const isSelected = selectedDealer === item.id;

            return (
              <div
                key={item.id || index}
                className="border-b border-gray-100 last:border-b-0"
              >
                {/* Dealer Row - Clickable */}
                <div
                  className={`dealer-bar-group transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50 p-1 border border-blue-200"
                      : isHovered
                      ? "bg-gray-50 p-1"
                      : "py-1"
                  }`}
                  onMouseEnter={() => setHoveredDealer(item.id)}
                  onMouseLeave={() => setHoveredDealer(null)}
                  onClick={() => handleDealerClick(item.id)}
                >
                  <div className="flex items-center gap-2">
                    {/* Dealer Name */}
                    <div className="w-40">
                      <span
                        className={`text-sm font-medium text-[#222fb9] ${
                          hasZeroValue ? "text-gray-400" : " "
                        } ${isSelected ? "font-semibold " : ""}`}
                      >
                        {formatDealerName(item.dealerName)}
                      </span>
                    </div>

                    {/* Stacked Bar Chart */}
                    <div className="flex-1">
                      <div
                        className={`relative w-full h-3 rounded overflow-hidden border ${
                          hasZeroValue
                            ? "border-gray-200 bg-gray-50"
                            : "border-gray-300 bg-gray-100"
                        } ${isSelected ? "shadow-sm" : ""}`}
                      >
                        {hasZeroValue ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-gray-400">
                              No Calls
                            </span>
                          </div>
                        ) : (
                          <>
                            {/* Total Calls - Background */}
                            <div
                              className="absolute top-0 left-0 h-full opacity-20 transition-all duration-200"
                              style={{
                                width: `${getPercentage(item.total)}%`,
                                backgroundColor: getColorForMetric("total"),
                              }}
                            ></div>

                            {/* Outgoing - Green */}
                            {item.outgoing > 0 && (
                              <div
                                className="absolute top-0 left-0 h-full transition-all duration-200"
                                style={{
                                  width: `${getPercentage(item.outgoing)}%`,
                                  backgroundColor:
                                    getColorForMetric("outgoing"),
                                  opacity: isSelected ? 1 : 0.9,
                                }}
                              ></div>
                            )}

                            {/* Incoming - Purple */}
                            {item.incoming > 0 && (
                              <div
                                className="absolute top-0 left-0 h-full transition-all duration-200"
                                style={{
                                  width: `${getPercentage(item.incoming)}%`,
                                  backgroundColor:
                                    getColorForMetric("incoming"),
                                  left: `${getPercentage(item.outgoing)}%`,
                                  opacity: isSelected ? 1 : 0.9,
                                }}
                              ></div>
                            )}

                            {/* Connected - Amber */}
                            {item.connected > 0 && (
                              <div
                                className="absolute top-0 left-0 h-full transition-all duration-200"
                                style={{
                                  width: `${getPercentage(item.connected)}%`,
                                  backgroundColor:
                                    getColorForMetric("connected"),
                                  left: `${
                                    getPercentage(item.outgoing) +
                                    getPercentage(item.incoming)
                                  }%`,
                                  opacity: isSelected ? 1 : 0.9,
                                }}
                              ></div>
                            )}

                            {/* Declined - Red */}
                            {item.declined > 0 && (
                              <div
                                className="absolute top-0 left-0 h-full transition-all duration-200"
                                style={{
                                  width: `${getPercentage(item.declined)}%`,
                                  backgroundColor:
                                    getColorForMetric("declined"),
                                  left: `${
                                    getPercentage(item.outgoing) +
                                    getPercentage(item.incoming) +
                                    getPercentage(item.connected)
                                  }%`,
                                  opacity: isSelected ? 1 : 0.9,
                                }}
                              ></div>
                            )}

                            {/* Total Value Label */}
                            <div className="absolute inset-0 flex items-center justify-end pr-1">
                              <span
                                className={`text-xs font-bold px-1 rounded ${
                                  isSelected
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-white bg-opacity-80 text-gray-700"
                                }`}
                              >
                                {item.total || 0}
                              </span>
                            </div>

                            {/* Click Indicator */}
                            <div className="absolute left-1 top-1/2 transform -translate-y-1/2">
                              <i
                                className={`fas fa-chevron-right text-xs ${
                                  isSelected
                                    ? "text-blue-600 transform rotate-90"
                                    : "text-gray-400"
                                }`}
                              ></i>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Metric Details */}
                      <div className="flex justify-between mt-0.5">
                        <div className="flex items-center gap-1 text-xs">
                          <div
                            className="flex items-center gap-0.5"
                            style={{
                              color: isSelected
                                ? getColorForMetric("outgoing")
                                : "#6b7280",
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-sm"
                              style={{
                                backgroundColor: getColorForMetric("outgoing"),
                              }}
                            ></div>
                            <span>{item.outgoing || 0}</span>
                          </div>
                          <div
                            className="flex items-center gap-0.5"
                            style={{
                              color: isSelected
                                ? getColorForMetric("incoming")
                                : "#6b7280",
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-sm"
                              style={{
                                backgroundColor: getColorForMetric("incoming"),
                              }}
                            ></div>
                            <span>{item.incoming || 0}</span>
                          </div>
                          <div
                            className="flex items-center gap-0.5"
                            style={{
                              color: isSelected
                                ? getColorForMetric("connected")
                                : "#6b7280",
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-sm"
                              style={{
                                backgroundColor: getColorForMetric("connected"),
                              }}
                            ></div>
                            <span>{item.connected || 0}</span>
                          </div>
                          <div
                            className="flex items-center gap-0.5"
                            style={{
                              color: isSelected
                                ? getColorForMetric("declined")
                                : "#6b7280",
                              fontWeight: isSelected ? "600" : "400",
                            }}
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-sm"
                              style={{
                                backgroundColor: getColorForMetric("declined"),
                              }}
                            ></div>
                            <span>{item.declined || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Panel - Shows on Click */}
                {isSelected && (
                  <div className="mt-1 p-2 bg-white border border-blue-200 rounded shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-bold text-gray-900">
                        Call Details
                      </h4>
                      <button
                        onClick={handleCloseDetails}
                        className="text-gray-400 hover:text-gray-600 text-xs"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center p-1 bg-gray-50 rounded">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">{item.total || 0}</span>
                        </div>
                        <div
                          className="flex justify-between items-center p-1 rounded"
                          style={{
                            backgroundColor: `${getColorForMetric(
                              "outgoing"
                            )}15`,
                          }}
                        >
                          <span
                            style={{ color: getColorForMetric("outgoing") }}
                          >
                            Outgoing:
                          </span>
                          <span className="font-medium">
                            {item.outgoing || 0}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div
                          className="flex justify-between items-center p-1 rounded"
                          style={{
                            backgroundColor: `${getColorForMetric(
                              "incoming"
                            )}15`,
                          }}
                        >
                          <span
                            style={{ color: getColorForMetric("incoming") }}
                          >
                            Incoming:
                          </span>
                          <span className="font-medium">
                            {item.incoming || 0}
                          </span>
                        </div>
                        <div
                          className="flex justify-between items-center p-1 rounded"
                          style={{
                            backgroundColor: `${getColorForMetric(
                              "connected"
                            )}15`,
                          }}
                        >
                          <span
                            style={{ color: getColorForMetric("connected") }}
                          >
                            Connected:
                          </span>
                          <span className="font-medium">
                            {item.connected || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-1 border-t border-gray-200">
                      <div className="flex justify-between text-xs">
                        <div className="text-center">
                          <div className="font-medium text-green-700">
                            Success
                          </div>
                          <div className="font-bold">
                            {item.total > 0
                              ? Math.round(
                                  ((item.connected || 0) / item.total) * 100
                                )
                              : 0}
                            %
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-blue-700">
                            Response
                          </div>
                          <div>
                            {item.total > 0
                              ? Math.round(
                                  ((item.connected + item.declined) /
                                    item.total) *
                                    100
                                )
                              : 0}
                            %
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-red-700">
                            Decline
                          </div>
                          <div>
                            {item.total > 0
                              ? Math.round((item.declined / item.total) * 100)
                              : 0}
                            %
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Total: {chartData.length}</span>
          <span>
            Active: {chartData.filter((item) => (item.total || 0) > 0).length}
          </span>
          <span>
            Zero: {chartData.filter((item) => (item.total || 0) === 0).length}
          </span>
        </div>
      </div>

      {/* Legend with Color Names - ALWAYS VISIBLE */}
      <div className="chart-footer p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: getColorForMetric("outgoing") }}
            ></div>
            <span className="text-gray-700 font-medium">Outgoing</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: getColorForMetric("incoming") }}
            ></div>
            <span className="text-gray-700 font-medium">Incoming</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: getColorForMetric("connected") }}
            ></div>
            <span className="text-gray-700 font-medium">Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: getColorForMetric("declined") }}
            ></div>
            <span className="text-gray-700 font-medium">Declined</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
