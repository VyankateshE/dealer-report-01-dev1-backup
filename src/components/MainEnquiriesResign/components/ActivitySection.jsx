import React from "react";

export const ActivitySection = ({ activities, type }) => {
  const getBadgeColor = (statusType) => {
    switch (statusType) {
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!activities?.length) {
    return (
      <div className="alert alert-info text-center">
        No {type} events and tasks
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12">
          <div
            id="DZ_W_TimeLine"
            className="widget-timeline dz-scroll"
            style={{ height: "270px", overflowY: "scroll" }}
          >
            <ul className="timeline">
              {activities.map((data, index) => (
                <li key={index}>
                  <div
                    className={`timeline-badge ${getBadgeColor(type)}`}
                  ></div>
                  <a className="timeline-panel text-muted" href="#">
                    <div className="row">
                      {/* Render activity data based on type */}
                      {renderActivityData(data, type)}
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderActivityData = (data, type) => {
  switch (type) {
    case "upcoming":
    case "overdue":
      return (
        <>
          <div className="col-3">
            <strong>Date:</strong> {data.due_date}
          </div>
          <div className="col-3">
            <strong>Subject:</strong> {data.subject}
          </div>
          <div className="col-3">
            <strong>Remarks:</strong> {data.remarks}
          </div>
          <div className="col-3 d-flex align-items-center">
            <strong>Status:</strong>
            <span
              className="badge ms-1"
              style={{
                backgroundColor: type === "upcoming" ? "#6eb9ff" : "#e74c3c",
                color: "white",
                padding: "2px 6px",
                fontSize: "12px",
                width: "auto",
                display: "inline-block",
                marginLeft: "4px",
              }}
            >
              {data.status}
            </span>
          </div>
        </>
      );
    case "completed":
      return (
        <>
          <div className="col-3">
            <strong>Date:</strong> {data.start_date}
          </div>
          <div className="col-3">
            <strong>Start Time:</strong> {data.start_time}
          </div>
          <div className="col-3">
            <strong>End Time:</strong> {data.end_time}
          </div>
          <div className="col-3 d-flex align-items-center">
            <strong>Status:</strong>
            <span
              className="badge badge-success ms-1"
              style={{
                backgroundColor: "#7ed99c",
                color: "white",
                padding: "2px 6px",
                fontSize: "12px",
                width: "auto",
                display: "inline-block",
                marginLeft: "4px",
              }}
            >
              {data.status}
            </span>
          </div>
        </>
      );
    default:
      return null;
  }
};
