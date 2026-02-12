import React from "react";

const LoginLeftPanel = () => {
  return (
    <div className="hidden md:block">
      <div
        className="p-10 flex flex-col justify-between text-white relative h-full"
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 1) 0, #f6f7ff 40%, #f3f5ff 100%)",
        }}
      >
        <div className="relative z-10">
          <div className="mb-10">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <h1 className="font-semibold text-5xl text-gray-800 leading-tight mb-0">
                  smart
                </h1>
                <h1 className="font-semibold text-5xl text-gray-800 leading-tight mb-2 -mt-2">
                  <span style={{ color: "#222fb9" }}>a</span>ss
                  <span style={{ color: "#222fb9" }}>i</span>st
                </h1>
                <p className="text-sm text-gray-600">
                  Pre-Sales Intelligence for JLR
                </p>
              </div>

              <div className="w-30 h-30 flex items-center justify-center">
                <img
                  src="/logo copy.svg"
                  alt="JLR Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold leading-tight text-gray-800 mb-2">
                Admin <span style={{ color: "#222fb9" }}>Control Center</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dedicated access for JLR India leadership & central teams to
                govern dealerships, users and performance dashboards across the
                Smart Assist ecosystem.
              </p>
            </div>

            <div className="space-y-3">
              <div
                className="inline-block px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(34, 47, 185, 0.1)",
                  color: "#222fb9",
                  border: "1px solid rgba(34, 47, 185, 0.2)",
                }}
              >
                CENTRAL GOVERNANCE
              </div>
              &nbsp;
              <span
                className="px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  color: "rgb(75, 85, 99)",
                  border: "1px solid rgba(148, 163, 184, 0.7)",
                }}
              >
                DEALER PERFORMANCE
              </span>
              <div className="flex flex-wrap gap-2">
                <span
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    color: "rgb(75, 85, 99)",
                    border: "1px solid rgba(148, 163, 184, 0.7)",
                  }}
                >
                  DATA INTEGRITY
                </span>

                <span
                  className="px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    color: "rgb(75, 85, 99)",
                    border: "1px solid rgba(148, 163, 184, 0.7)",
                  }}
                >
                  AUDIT TRAILS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center mt-10 text-xs opacity-90"
          style={{ color: "#7b8199" }}
        >
          <span>© Ariantech Solutions</span>
          <div
            className="flex-1 h-px mx-3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.9), transparent)",
            }}
          ></div>
          <span>For internal JLR use only</span>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftPanel;
