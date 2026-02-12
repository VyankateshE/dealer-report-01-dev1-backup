import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, LayoutDashboard, TrendingUp, Menu, X } from "lucide-react";
import Dashboard from "../../components/MainDashboard/Dashboard";
import TrendChart from "../../components/MainTrendChart/TrendChart";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import FaqReleaseNotesModal from "../../components/FaqReleaseNotesModal";
import { HelpCircle } from "lucide-react";

const GMDashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("gmDashboardActiveTab") || "dashboard";
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("gmDashboardActiveTab", activeTab);
  }, [activeTab]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
    setMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem("gmDashboardActiveTab");
    logout();
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // GM only has 2 tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trend", label: "Trend Chart", icon: TrendingUp },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "trend":
        return <TrendChart />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-4 sm:px-4 lg:px-1">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4 py-3">
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                SA - GM Dashboard
                {activeTab === "dashboard" && (
                  <span className="block text-xs text-gray-800 mt-1 font-bold">
                    (Values with{" "}
                    <span className="text-[rgb(255,152,0)] ">color</span>{" "}
                    indicate{" "}
                    <span className="text-[rgb(255,152,0)] font-semibold">
                      digital enquiries
                    </span>
                    )
                  </span>
                )}
              </h1>
            </div>
            <nav className="inline-flex rounded-full p-1 mx-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 cursor-pointer px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? "bg-[#222fb9] text-white shadow-sm"
                        : "text-gray-700 hover:bg-white hover:text-[#222fb9]"
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* FIXED: Changed to flex container with gap for side-by-side icons */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <button
                onClick={() => setShowFaqModal(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-[#222fb9] transition-colors cursor-pointer"
                title="Help / Release Notes"
              >
                <HelpCircle className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-8 h-8 cursor-pointer rounded-full border border-gray-300 bg-white hover:border-[#222fb9] transition-colors"
                title="Logout"
              >
                <User className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden py-3">
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <h1 className="text-base font-bold text-gray-900 tracking-tight">
                  SA - GM Dashboard
                </h1>
                {activeTab === "dashboard" && (
                  <p className="text-xs text-gray-600 mt-1 font-bold">
                    (Values with{" "}
                    <span className="text-[rgb(255,152,0)] ">color</span>{" "}
                    indicate{" "}
                    <span className="text-[rgb(255,152,0)] ">
                      digital enquiries
                    </span>{" "}
                    )
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFaqModal(true)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-[#222fb9] transition-colors"
                  title="Help / Release Notes"
                >
                  <HelpCircle className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-white hover:border-[#222fb9] transition-colors"
                  title="Logout"
                >
                  <User className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white hover:border-[#222fb9] transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Menu className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div
                ref={mobileMenuRef}
                className="mt-3 pb-2 border-t border-gray-200 pt-3"
              >
                <nav className="flex flex-col space-y-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "bg-[#222fb9] text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-[#222fb9]"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="py-1">{renderTabContent()}</div>
        <Footer />
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Confirm Logout
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to logout from your account?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-3 py-1.5 text-xs bg-[#222fb9] text-white rounded-lg hover:bg-[#1e2a9c] transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal - FIXED: Now independent and can be opened separately */}
      <FaqReleaseNotesModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />
    </div>
  );
};

export default GMDashboard;
