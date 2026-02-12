// src/pages/Dashboard/DashboardPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FaqReleaseNotesModal from "./FaqReleaseNotesModal";
import { HelpCircle } from "lucide-react";

import {
  User,
  LayoutDashboard,
  TrendingUp,
  Car,
  Users,
  Target,
  Menu,
  X,
} from "lucide-react";
import Dashboard from "./MainDashboard/Dashboard";
import TrendChart from "./MainTrendChart/TrendChart";
import MainVehicleManagement from "./MainVehicleManagement/MainVehicleManagement";
import MainEnquiriesResign from "./MainEnquiriesResign/MainEnquiriesResign";
import MainSetTarget from "./MainSetTarget/MainSetTarget";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Load active tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem("dashboardActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dashboardActiveTab", activeTab);
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
    // console.log("Logging out...");
    // Optional: Clear the saved tab on logout
    localStorage.removeItem("dashboardActiveTab");
    setShowLogoutModal(false);
    navigate("/login");
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Tab configuration for consistent styling and icons
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trend", label: "Trend Chart", icon: TrendingUp },
    { id: "vehicles", label: "Vehicle Management", icon: Car },
    { id: "enquiries", label: "Enquiries Reassign", icon: Users },
    { id: "target", label: "Set Target", icon: Target },
  ];

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "trend":
        return <TrendChart />;
      case "vehicles":
        return <MainVehicleManagement />;
      case "enquiries":
        return <MainEnquiriesResign />;
      case "target":
        return <MainSetTarget />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky removed */}
      <header className="bg-white border-b border-gray-200">
        <div className="  px-4 sm:px-4 lg:px-1">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4 py-3">
            {/* Left Side - Title */}
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                SA - Admin Dashboard
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">
                Monitor system performance
              </p>
            </div>

            {/* Center - Navigation Tabs */}
            <nav className="inline-flex rounded-full p-1 mx-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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

            {/* Right Side - Logout Button */}
            <div className="flex-shrink-0">
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
              {/* Left Side - Title */}
              <div className="flex-shrink-0">
                <h1 className="text-base font-bold text-gray-900 tracking-tight">
                  SA - Admin Dashboard
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">
                  Monitor system performance
                </p>
              </div>

              {/* Right Side - Mobile Menu and Logout Button */}
              <div className="flex items-center gap-2">
                {/* Logout Button */}
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

                {/* Mobile Menu Button */}
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

            {/* Mobile Navigation Menu */}
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

      {/* Main Content */}
      <main className="flex-1">
        <div className="py-1">{renderTabContent()}</div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                className="px-3 py-1.5 text-xs bg-[#222fb9] text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
          {/* FAQ / Release Notes Modal */}
          <FaqReleaseNotesModal
            isOpen={showFaqModal}
            onClose={() => setShowFaqModal(false)}
          />
        </div>
      )}
    </div>
  )``;
};

export default DashboardPage;
