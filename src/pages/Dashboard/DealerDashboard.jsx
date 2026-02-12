import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  TrendingUp,
  Car,
  Users,
  Target,
  Menu,
  X,
  Upload,
  UploadCloud,
  Clock,
} from "lucide-react";
import Dashboard from "../../components/MainDashboard/CEODashboard";
import TrendChart from "../../components/MainTrendChart/TrendChart";
import MainVehicleManagement from "../../components/MainVehicleManagement/MainVehicleManagement";
import MainEnquiriesResign from "../../components/MainEnquiriesResign/MainEnquiriesResign";
import MainSetTarget from "../../components/MainSetTarget/MainSetTarget";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import FaqReleaseNotesModal from "../../components/FaqReleaseNotesModal";
import { HelpCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const DealerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const urlTab = searchParams.get("tab");
    const storedTab = localStorage.getItem("dealerDashboardActiveTab");
    return urlTab || storedTab || "dashboard";
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [uploadfile, setUploadFile] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [error, setError] = useState("");
  const [validatedRows, setValidatedRows] = useState([]);
  const [validatedHeaders, setValidatedHeaders] = useState([]);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const REQUIRED_HEADERS = [
    "Retailer Name",
    "Create Date",
    "Primary Model Interest",
    "Lead Source",
    "Lead ID",
    "First Name",
    "Last Name",
    "Company / Account",
    "Mobile",
    "Email",
    "Lead Owner",
    "Enquiry Type",
    "Expected Date of Purchase",
  ];

  // const parseExcel = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = (e) => {
  //       const wb = XLSX.read(e.target.result, { type: "array" });
  //       const sheet = wb.Sheets[wb.SheetNames[0]];

  //       const rows = XLSX.utils.sheet_to_json(sheet, {
  //         header: 1,
  //         defval: "",
  //         raw: false,
  //       });

  //       if (rows.length <= 1) return reject("Excel is empty");

  //       const headerRow = rows[0].map((h) => h.toString().trim());

  //       const matched = REQUIRED_HEADERS.filter((h) => headerRow.includes(h));

  //       if (!matched.length) {
  //         reject("Required headers not found");
  //         return;
  //       }

  //       const indexMap = {};
  //       matched.forEach((h) => (indexMap[h] = headerRow.indexOf(h)));

  //       const validRows = rows.slice(1).map((r) => {
  //         const obj = {};
  //         matched.forEach((h) => (obj[h] = r[indexMap[h]] ?? ""));
  //         return obj;
  //       });

  //       resolve({ validRows, matched });
  //     };

  //     reader.onerror = () => reject("File read failed");
  //     reader.readAsArrayBuffer(file);
  //   });


  // const parseExcel = (file) =>
  // new Promise((resolve, reject) => {
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     const wb = XLSX.read(e.target.result, { type: "array" });
  //     const sheet = wb.Sheets[wb.SheetNames[0]];

  //     const rows = XLSX.utils.sheet_to_json(sheet, {
  //       header: 1,
  //       defval: "",
  //       raw: false,
  //     });

  //     if (rows.length <= 1) return reject("Excel file is empty.");

  //     const headerRow = rows[0].map((h) => h.toString().trim());

  //     // 🔹 1. Check missing headers
  //     const missingHeaders = REQUIRED_HEADERS.filter(
  //       (h) => !headerRow.includes(h)
  //     );

  //     if (missingHeaders.length > 0) {
  //       return reject(
  //         `Missing required column(s): ${missingHeaders.join(", ")}`
  //       );
  //     }

  //     // 🔹 2. Check extra headers
  //     const extraHeaders = headerRow.filter(
  //       (h) => !REQUIRED_HEADERS.includes(h)
  //     );

  //     if (extraHeaders.length > 0) {
  //       return reject(
  //         `Invalid column(s) found: ${extraHeaders.join(
  //           ", "
  //         )}. Please upload the correct template file.`
  //       );
  //     }

  //     // 🔹 3. Exact match validation
  //     if (headerRow.length !== REQUIRED_HEADERS.length) {
  //       return reject(
  //         "Column structure mismatch. Please use the correct upload template."
  //       );
  //     }

  //     // 🔹 Map indexes
  //     const indexMap = {};
  //     REQUIRED_HEADERS.forEach(
  //       (h) => (indexMap[h] = headerRow.indexOf(h))
  //     );

  //     const validRows = rows.slice(1).map((r) => {
  //       const obj = {};
  //       REQUIRED_HEADERS.forEach(
  //         (h) => (obj[h] = r[indexMap[h]] ?? "")
  //       );
  //       return obj;
  //     });

  //     resolve({ validRows });
  //   };

  //   reader.onerror = () => reject("File reading failed.");
  //   reader.readAsArrayBuffer(file);
  // });

useEffect(() => {
  if (uploadfile) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto"; // cleanup
  };
}, [uploadfile]);

const parseExcel = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
          raw: false,
        });

        if (!rows || rows.length <= 1) {
          return reject("Excel file is empty.");
        }

        const normalize = (str) =>
          str?.toString().trim().replace(/\s+/g, " ");

        const headerRow = rows[0].map((h) => normalize(h));
        const normalizedRequired = REQUIRED_HEADERS.map((h) =>
          normalize(h)
        );

        const missingHeaders = normalizedRequired.filter(
          (h) => !headerRow.includes(h)
        );

        if (missingHeaders.length > 0) {
          return reject(
            `Missing required column(s): ${missingHeaders.join(", ")}`
          );
        }

        if (headerRow.length !== normalizedRequired.length) {
          return reject(
            "Column structure mismatch. Please use the correct upload template."
          );
        }

        const indexMap = {};
        REQUIRED_HEADERS.forEach((header) => {
          indexMap[header] = headerRow.indexOf(normalize(header));
        });

        const validRows = rows.slice(1).map((row) => {
          const obj = {};
          REQUIRED_HEADERS.forEach((header) => {
            obj[header] = row[indexMap[header]] ?? "";
          });
          return obj;
        });

        resolve({ validRows });

      } catch {
        reject("Invalid or corrupted Excel file.");
      }
    };

    reader.onerror = () => reject("File reading failed.");
    reader.readAsArrayBuffer(file);
  });


 const handleFileSelect = async (files) => {
  if (!files || !files[0]) return;

  const selected = files[0];

  // 🔥 HARD RESET EVERYTHING FIRST
  setError("");
  setUploadSummary(null);
  setValidatedRows([]);
  setFile(null);
  setFileName("");

  if (fileInputRef.current) {
    fileInputRef.current.value = null; // 🔥 force reset browser cache
  }

  if (!/\.(xls|xlsx|csv)$/i.test(selected.name)) {
    setError("Only Excel files allowed");
    return;
  }

  if (selected.size > MAX_FILE_SIZE) {
    setError("File must be under 5MB");
    return;
  }

  try {
    const { validRows } = await parseExcel(selected);

    setValidatedRows(validRows);
    setFile(selected);
    setFileName(selected.name);
    setError(""); // 🔥 clear any old error permanently

  } catch (err) {
    setError(err);
  }
};


  // Sync URL and localStorage when activeTab changes
  useEffect(() => {
    localStorage.setItem("dealerDashboardActiveTab", activeTab);
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Listen for URL changes
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

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
    localStorage.removeItem("dealerDashboardActiveTab");
    logout();
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Dealer has all 5 tabs
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "trend", label: "Trend Chart", icon: TrendingUp },
    { id: "vehicles", label: "Vehicle Management", icon: Car },
    { id: "enquiries", label: "Enquiries Reassign", icon: Users },
    { id: "target", label: "Set Target", icon: Target },
    { id: "upload", label: "Upload File", icon: Upload },
  ];

  const handleUploadClick = () => {
    setUploadFile(true);
  };

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

 const uploadExcel = async () => {
  if (!file) {
    toast.error("Please select a valid Excel file");
    return;
  }

  if (validatedRows.length === 0) {
    toast.error("Excel contains no data rows");
    return;
  }

  if (uploading) return; // 🔥 prevent double click

  setUploading(true);

  const formData = new FormData();
  formData.append("file", file);

  const uploadRequest = async () => {
    return axios.post(
      "https://lindsay-trailblazing-renate.ngrok-free.dev/exceltojson",
      formData,
      {
        timeout: 20000, // increase timeout to 20s
      }
    );
  };

  try {
    let response;

    try {
      // 🔥 First attempt
      response = await uploadRequest();
    } catch (firstError) {
      // 🔥 If timeout → retry once automatically
      if (firstError.code === "ECONNABORTED") {
        console.log("First attempt timed out. Retrying...");
        response = await uploadRequest();
      } else {
        throw firstError;
      }
    }

    setUploadSummary(response.data.apiResponse);

    setFile(null);
    setFileName("");
    setValidatedRows([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      error?.message ||
      "Server is not responding. Please try again."
    );
  } finally {
    setUploading(false);
  }
};



  const clearUpload = () => {
    setFile(null);
    setFileName("");
    setUploadSummary(null);
    setValidatedRows([]);
    setValidatedHeaders([]);
    setError("");

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (uploadSummary) {
      toast.success("File uploaded successfully!", {
        toastId: "uploadSuccess",
      });
    }
  }, [uploadSummary]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className=" mx-auto px-4 sm:px-4 lg:px-1">
          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-4 py-3">
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                {user?.role === "CEO" ? "CEO" : "Dealer"} Report
                {activeTab === "dashboard" && (
                  <span className="block text-xs text-gray-800 font-fold mt-1">
                    (Values with{" "}
                    <span className="text-[rgb(255,152,0)] font-semibold">
                      color
                    </span>{" "}
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
                    // onClick={() => handleTabClick(tab.id)}
                    // onClick={() =>
                    //   tab.id === "upload"
                    //     ? handleUploadClick()
                    //     : handleTabClick(tab.id)
                    // }
                    onClick={() => {
  if (tab.id === "upload") {
    setActiveTab("upload");   // 🔥 make it active
    handleUploadClick();
  } else {
    handleTabClick(tab.id);
  }
}}
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

            {/* Updated: Added Help button next to Logout */}
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
                  SA - {user?.role === "CEO" ? "CEO" : "Dealer"} Dashboard
                </h1>
                {activeTab === "dashboard" && (
                  <p className="text-xs text-gray-600 mt-1">
                    (Values with{" "}
                    <span className="text-[rgb(255,152,0)] font-semibold">
                      color
                    </span>{" "}
                    indicate{" "}
                    <span className="text-[rgb(255,152,0)] font-semibold">
                      digital enquiries
                    </span>
                    )
                  </p>
                )}
              </div>

              {/* Updated: Added Help button for mobile */}
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
      </main>

      {/* Footer component */}
      <Footer />

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
                className="px-3 py-1.5 text-xs bg-[#222fb9] text-white rounded-lg hover:bg-[#222fb9] transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div
            className="bg-white rounded-xl w-full max-w-3xl p-6 relative
      animate-[fadeIn_.2s_ease-out] scale-95"
          >
            <button
              onClick={() => {
                setUploadFile(false);
                setActiveTab("dashboard");
                clearUpload();
                
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Upload File
            </h2>

            <div
              className="border-2 border-dashed  rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer border-gray-300"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                hidden
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={(e) => handleFileSelect(e.target.files)}
              />

              <UploadCloud className="w-10 h-10 text-[#222fb9]" />
              <p className="mt-2 text-sm">Drop Excel or click</p>
            </div>

            {fileName && (
              <div className="mt-3 flex justify-between">
                <span className="text-sm text-[#222fb9]">Selected File :- {fileName}</span>
                {/* <button onClick={clearUpload}>
                  <X className="w-4 h-4 text-gray-500 hover:text-gray-600 cursor-pointer ml-0.5" />
                </button> */}
              </div>
            )}

            {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
            {uploadSummary && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  Upload Summary
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                  <span>
                    Processed:
                    <span className="ml-1 font-semibold text-gray-900">
                      {uploadSummary.processedRecords}
                    </span>
                  </span>

                  <span>
                    Created:
                    <span className="ml-1 font-semibold text-green-600">
                      {uploadSummary.createdRecords}
                    </span>
                  </span>

                  <span>
                    Duplicates:
                    <span className="ml-1 font-semibold text-yellow-600">
                      {uploadSummary.skippedDuplicates}
                    </span>
                  </span>

                  <span>
                    Invalid Mobile:
                    <span className="ml-1 font-semibold text-red-600">
                      {uploadSummary.invalidMobileCount}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                disabled={!file || uploading}
                onClick={uploadExcel}
                className="bg-[#222fb9] text-white px-8 py-2 rounded disabled:opacity-50 flex items-center gap-2 mx-auto cursor-pointer"
              >
                {uploading && <Clock className="animate-spin w-4 h-4" />}
                {uploading ? "Uploading..." : "Import File"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal - Added same as GM Dashboard */}
      <FaqReleaseNotesModal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
      />
    </div>
  );
};

export default DealerDashboard;
