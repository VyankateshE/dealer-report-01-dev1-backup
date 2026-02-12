// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../../context/AuthContext";
// import { Eye, EyeOff, User, Lock, Mail } from "lucide-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Footer from "../../components/Footer";
// const Login = () => {
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const inputRefs = useRef([]);

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//     otp: null,
//     confirmPassword: "",
//     newPwd: "",
//   });

//   const [fieldErrors, setFieldErrors] = useState({
//     email: "",
//     password: "",
//   });

//   const [verifyData, setVerifyData] = useState({
//     email: "",
//   });

//   const [verifyEmailError, setVerifyEmailError] = useState("");
//   const [otpError, setOtpError] = useState("");

//   const [currentStep, setCurrentStep] = useState("login");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [rememberDevice, setRememberDevice] = useState(false);

//   const API_BASE_URL = "https://uat.smartassistapp.in/api/";

//   useEffect(() => {
//     let interval;
//     if (countdown > 0) {
//       interval = setInterval(() => {
//         setCountdown((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [countdown]);

//   const showVerifyEmail = () => {
//     setCurrentStep("verifyEmail");
//     setVerifyData({ email: "" });
//     setVerifyEmailError("");
//     setLoginData((prev) => ({
//       ...prev,
//       password: "",
//       newPwd: "",
//       confirmPassword: "",
//     }));
//   };

//   const showVerifyOtp = () => {
//     setCurrentStep("verifyOtp");
//     setOtpError("");
//   };

//   const isValidPassword = (password) => {
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     return passwordRegex.test(password);
//   };

//   const validateNewPassword = () => {
//     if (!loginData.newPwd || !loginData.confirmPassword) {
//       toast.error("Please enter both passwords");
//       return false;
//     }
//     if (!isValidPassword(loginData.newPwd)) {
//       toast.error(
//         "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
//       );
//       return false;
//     }
//     if (loginData.newPwd !== loginData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }
//     return true;
//   };

//   const showNewPasswordStep = () => {
//     setCurrentStep("newPassword");
//   };

//   const backToLogin = () => {
//     setCurrentStep("login");
//     setLoginData({
//       email: "",
//       password: "",
//       otp: null,
//       confirmPassword: "",
//       newPwd: "",
//     });
//     setVerifyData({ email: "" });
//     setVerifyEmailError("");
//     setOtpError("");
//     setCountdown(0);
//     setFieldErrors({
//       email: "",
//       password: "",
//     });
//   };

//   const isValidEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateLoginInput = () => {
//     const errors = {
//       email: "",
//       password: "",
//     };
//     let isValid = true;

//     if (!loginData.email.trim()) {
//       errors.email = "Email is required";
//       isValid = false;
//     }

//     if (!loginData.password.trim()) {
//       errors.password = "Password is required";
//       isValid = false;
//     }

//     setFieldErrors(errors);
//     return isValid;
//   };

//   const onLogin = async (e) => {
//     e?.preventDefault();

//     // Clear previous errors
//     setFieldErrors({
//       email: "",
//       password: "",
//     });

//     // Validate input fields
//     if (!validateLoginInput()) {
//       return; // Stop here if validation fails (will show red borders)
//     }

//     localStorage.clear();
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}login/GM`,
//         {
//           email: loginData.email,
//           password: loginData.password,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           timeout: 10000,
//         },
//       );

//       if (
//         response.data.status === 200 &&
//         response.data.data?.token &&
//         response.data.data?.user
//       ) {
//         handleLoginSuccess(response.data);
//       } else {
//         setIsLoading(false);
//         // If server returns an error but not specific field error, show general error
//         const errorMessage = response.data.message || "Invalid credentials";

//         // Check if error message contains "email" or "password" keywords
//         const errorMsgLower = errorMessage.toLowerCase();

//         if (
//           errorMsgLower.includes("email") ||
//           errorMsgLower.includes("invalid email")
//         ) {
//           setFieldErrors({
//             email: errorMessage,
//             password: "",
//           });
//         } else if (
//           errorMsgLower.includes("password") ||
//           errorMsgLower.includes("incorrect password")
//         ) {
//           setFieldErrors({
//             email: "",
//             password: errorMessage,
//           });
//         } else {
//           // For generic errors, show toast
//           toast.error(errorMessage);
//         }
//         return;
//       }
//     } catch (err) {
//       setIsLoading(false);

//       // Handle server response errors
//       if (err.response?.data?.message) {
//         const errorMessage = err.response.data.message;
//         const errorMsgLower = errorMessage.toLowerCase();

//         // Check which field the error relates to
//         if (
//           errorMsgLower.includes("email") ||
//           errorMsgLower.includes("invalid email") ||
//           errorMsgLower.includes("email not found")
//         ) {
//           setFieldErrors({
//             email: errorMessage,
//             password: "",
//           });
//         } else if (
//           errorMsgLower.includes("password") ||
//           errorMsgLower.includes("incorrect password") ||
//           errorMsgLower.includes("wrong password")
//         ) {
//           setFieldErrors({
//             email: "",
//             password: errorMessage,
//           });
//         } else {
//           // For other server errors, show toast
//           toast.error(errorMessage);
//         }
//       } else if (err.code === "NETWORK_ERROR" || err.code === "ECONNABORTED") {
//         toast.error(
//           "Network error: Please check your internet connection and try again.",
//         );
//       } else if (err.response?.status >= 500) {
//         toast.error("Server error. Please try again later.");
//       } else {
//         // For other errors, show generic message
//         setFieldErrors({
//           email: "",
//           password: "Invalid credentials",
//         });
//       }
//     }
//   };

//   const handleLoginSuccess = (response) => {
//     const token = response.data.token;
//     let user = response.data.user || response.data.userContext;
//     let userType = response.data.userRole;

//     if (!userType && user) {
//       userType = user.role === "DP" ? "GM" : "DEALER";
//     }

//     let userData = {};
//     let finalRole = userType;

//     if (userType === "GM" && user) {
//       userData = {
//         id: user.generalManager_id || user.id,
//         name: user.name,
//         email: user.email,
//       };
//       finalRole = "GM";
//     } else if (userType === "CEO" && user) {
//       userData = {
//         id: user.dealerId || user.id,
//         name: user.dealerName || user.name,
//         email: user.email,
//       };
//       finalRole = "CEO";
//     } else if (userType === "DEALER" && user) {
//       userData = {
//         id: user.dealerId || user.id,
//         name: user.dealerName || user.name,
//         email: user.email,
//         gmId: user.createdByGM || user.generalManager_id || "",
//       };
//       finalRole = "DEALER";
//     }

//     login(userData, token, finalRole);

//     if (finalRole === "GM") navigate("/gm/dashboard");
//     else if (finalRole === "DEALER") navigate("/dealer/dashboard");
//     else navigate("/admin/dashboard");
//   };

//   const onVerifyEmail = async (e) => {
//     e?.preventDefault();

//     // Clear previous error
//     setVerifyEmailError("");

//     if (!verifyData.email) {
//       setVerifyEmailError("Email is required");
//       return;
//     }

//     if (!isValidEmail(verifyData.email)) {
//       setVerifyEmailError("Please enter a valid email address");
//       return;
//     }

//     setIsLoading(true);

//     const gmPayload = { email: verifyData.email };

//     try {
//       await axios.post(
//         `${API_BASE_URL}login/GM/forgot-pwd/verify-email`,
//         gmPayload,
//       );
//       setIsLoading(false);
//       toast.success("OTP sent to your email");
//       showVerifyOtp();
//       setCountdown(60);
//     } catch (gmError) {
//       setIsLoading(false);
//       const errorMessage =
//         gmError.response?.data?.message || "An error occurred";

//       // Set the error to display under the email field
//       setVerifyEmailError(errorMessage);
//     }
//   };

//   const onVerifyOtp = async (e) => {
//     e?.preventDefault();

//     // Clear previous error
//     setOtpError("");

//     if (loginData.otp === null || isNaN(Number(loginData.otp))) {
//       setOtpError("Please enter a valid OTP");
//       return;
//     }

//     setIsLoading(true);

//     const gmPayload = {
//       otp: Number(loginData.otp),
//       email: verifyData.email,
//     };

//     try {
//       await axios.post(
//         `${API_BASE_URL}login/GM/forgot-pwd/verify-otp`,
//         gmPayload,
//       );
//       setIsLoading(false);
//       toast.success("OTP verified successfully");
//       showNewPasswordStep();
//     } catch (gmError) {
//       setIsLoading(false);
//       const errorMessage =
//         gmError.response?.data?.message || "Entered OTP is invalid";

//       // Set the error to display under the OTP field
//       setOtpError(errorMessage);
//     }
//   };

//   const onOtpInput = (e) => {
//     const numericValue = e.target.value.replace(/[^0-9]/g, "");
//     setLoginData((prev) => ({
//       ...prev,
//       otp: numericValue ? Number(numericValue) : 0,
//     }));
//     e.target.value = numericValue;

//     // Clear OTP error when user starts typing
//     if (otpError) {
//       setOtpError("");
//     }
//   };

//   const onSetNewPassword = async (e) => {
//     e.preventDefault();
//     if (!validateNewPassword()) return;

//     setIsLoading(true);

//     const gmPayload = {
//       email: verifyData.email,
//       newPwd: loginData.newPwd,
//       confirmPwd: loginData.confirmPassword,
//     };

//     try {
//       await axios.put(`${API_BASE_URL}login/GM/forgot-pwd/new-pwd`, gmPayload);
//       setIsLoading(false);
//       toast.success("Password reset successfully");
//       backToLogin();
//     } catch (gmError) {
//       setIsLoading(false);
//       if (gmError.response?.status === 400) {
//         toast.error("Invalid request. Please check your inputs.");
//       } else if (gmError.response?.status === 404) {
//         toast.error("User not found");
//       } else {
//         const errorMessage =
//           gmError.response?.data?.error || "An error occurred";
//         toast.error(errorMessage);
//       }
//     }
//   };

//   const updateLoginData = (field, value) => {
//     setLoginData((prev) => ({ ...prev, [field]: value }));

//     // Clear error for this field when user starts typing
//     if (fieldErrors[field]) {
//       setFieldErrors((prev) => ({
//         ...prev,
//         [field]: "",
//       }));
//     }
//   };

//   const updateVerifyData = (field, value) => {
//     setVerifyData((prev) => ({ ...prev, [field]: value }));

//     // Clear verify email error when user starts typing
//     if (field === "email" && verifyEmailError) {
//       setVerifyEmailError("");
//     }
//   };

//   const handleKeyPress = (e, action) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       action();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <div className="flex-1 flex items-center justify-center p-4">
//         <ToastContainer
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="light"
//           limit={1}
//         />

//         <div className="w-full max-w-5xl mx-auto relative">
//           {isLoading && (
//             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-40 rounded-2xl">
//               <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
//             </div>
//           )}

//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="grid md:grid-cols-2 gap-0">
//               <div className="hidden md:block">
//                 <div
//                   className="p-10 flex flex-col justify-between text-white relative h-full"
//                   style={{
//                     background:
//                       "linear-gradient(135deg, rgba(255, 255, 255, 1) 0, #f6f7ff 40%, #f3f5ff 100%)",
//                   }}
//                 >
//                   <div className="relative z-10">
//                     <div className="mb-10">
//                       <div className="flex items-start justify-between">
//                         <div className="flex flex-col">
//                           <h1 className="font-semibold text-5xl text-gray-800 leading-tight mb-0">
//                             smart
//                           </h1>
//                           <h1 className="font-semibold text-5xl text-gray-800 leading-tight mb-2 -mt-2">
//                             <span style={{ color: "#222fb9" }}>a</span>ss
//                             <span style={{ color: "#222fb9" }}>i</span>st
//                           </h1>
//                           <p className="text-sm text-gray-600">
//                             Pre-Sales Intelligence for JLR
//                           </p>
//                         </div>

//                         <div className="w-30 h-30 flex items-center justify-center">
//                           <img
//                             src="/logo copy.svg"
//                             alt="JLR Logo"
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-6">
//                       <div>
//                         <h2 className="text-2xl font-bold leading-tight text-gray-800 mb-2">
//                           Admin{" "}
//                           <span style={{ color: "#222fb9" }}>
//                             Control Center
//                           </span>
//                         </h2>
//                         <p className="text-gray-600 text-sm leading-relaxed">
//                           Dedicated access for JLR India leadership & central
//                           teams to govern dealerships, users and performance
//                           dashboards across the Smart Assist ecosystem.
//                         </p>
//                       </div>

//                       <div className="space-y-3">
//                         <div
//                           className="inline-block px-4 py-2 rounded-full text-xs font-medium"
//                           style={{
//                             background: "rgba(34, 47, 185, 0.1)",
//                             color: "#222fb9",
//                             border: "1px solid rgba(34, 47, 185, 0.2)",
//                           }}
//                         >
//                           CENTRAL GOVERNANCE
//                         </div>
//                         &nbsp;
//                         <span
//                           className="px-3 py-1.5 rounded-full text-xs"
//                           style={{
//                             background: "rgba(255, 255, 255, 0.85)",
//                             color: "rgb(75, 85, 99)",
//                             border: "1px solid rgba(148, 163, 184, 0.7)",
//                           }}
//                         >
//                           DEALER PERFORMANCE
//                         </span>
//                         <div className="flex flex-wrap gap-2">
//                           <span
//                             className="px-3 py-1.5 rounded-full text-xs"
//                             style={{
//                               background: "rgba(255, 255, 255, 0.85)",
//                               color: "rgb(75, 85, 99)",
//                               border: "1px solid rgba(148, 163, 184, 0.7)",
//                             }}
//                           >
//                             DATA INTEGRITY
//                           </span>

//                           <span
//                             className="px-3 py-1.5 rounded-full text-xs"
//                             style={{
//                               background: "rgba(255, 255, 255, 0.85)",
//                               color: "rgb(75, 85, 99)",
//                               border: "1px solid rgba(148, 163, 184, 0.7)",
//                             }}
//                           >
//                             AUDIT TRAILS
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div
//                     className="flex items-center mt-10 text-xs opacity-90"
//                     style={{ color: "#7b8199" }}
//                   >
//                     <span>© Ariantech Solutions</span>
//                     <div
//                       className="flex-1 h-px mx-3"
//                       style={{
//                         background:
//                           "linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.9), transparent)",
//                       }}
//                     ></div>
//                     <span>For internal JLR use only</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-8 md:p-10 flex flex-col justify-center w-full">
//                 <div className="md:hidden text-center mb-6">
//                   <div className="inline-flex items-center justify-between w-full mb-4">
//                     <div className="flex flex-col text-left">
//                       <h1 className="font-semibold text-2xl text-gray-800 leading-tight mb-0">
//                         smart
//                       </h1>
//                       <h1 className="font-semibold text-2xl text-gray-800 leading-tight mb-2 -mt-2">
//                         <span style={{ color: "#222fb9" }}>a</span>ss
//                         <span style={{ color: "#222fb9" }}>i</span>st
//                       </h1>
//                       <p className="text-sm text-gray-600">
//                         Pre-Sales Intelligence for JLR
//                       </p>
//                     </div>
//                     <div className="w-16 h-16 rounded-lg flex items-center justify-center">
//                       <img
//                         src="/logo copy.svg"
//                         alt="JLR Logo"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {currentStep === "login" && (
//                   <form onSubmit={onLogin} className="space-y-5" noValidate>
//                     <div>
//                       <div
//                         className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border"
//                         style={{
//                           borderColor: "#222fb9",
//                           backgroundColor: "rgba(34, 47, 185, 0.05)",
//                         }}
//                       >
//                         <div
//                           className="w-1.5 h-1.5 rounded-full"
//                           style={{
//                             background:
//                               "linear-gradient(135deg, #222fb9 0, #1a2580 100%)",
//                           }}
//                         ></div>
//                         <span
//                           className="text-xs font-semibold uppercase tracking-wide"
//                           style={{
//                             color: "#222fb9",
//                           }}
//                         >
//                           Admin Login
//                         </span>
//                       </div>
//                       <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
//                         Welcome back, Admin.
//                       </h2>
//                       <p
//                         className="text-xs"
//                         style={{
//                           color: "rgb(123, 129, 153)",
//                           lineHeight: "1.6",
//                         }}
//                       >
//                         Sign in with your JLR corporate credentials to access
//                         the Smart Assist Admin dashboard.
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                           Corporate ID / Email
//                           <span className="float-right text-xs text-gray-500">
//                             {/* For JLR central team only */}
//                           </span>
//                         </label>
//                         <div className="relative">
//                           <User
//                             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                             size={18}
//                           />
//                           {/* <input
//                             ref={(el) => (inputRefs.current[0] = el)}
//                             value={loginData.email}
//                             onChange={(e) =>
//                               updateLoginData("email", e.target.value)
//                             }
//                             onKeyPress={(e) => handleKeyPress(e, onLogin)}
//                             type="text"
//                             name="login-email"
//                             autoComplete="off"
//                             placeholder="firstname.lastname@jlr.in"
//                             className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
//                               fieldErrors.email
//                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                 : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//                             }`}
//                           /> */}
//                           <input
//                             ref={(el) => (inputRefs.current[0] = el)}
//                             type="email"
//                             name="email"
//                             autoComplete="username"
//                             value={loginData.email}
//                             onChange={(e) =>
//                               updateLoginData("email", e.target.value)
//                             }
//                             onKeyPress={(e) => handleKeyPress(e, onLogin)}
//                             placeholder="firstname.lastname@jlr.in"
//                             className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg
//     focus:outline-none focus:ring-1 focus:bg-white transition-all
//     ${
//       fieldErrors.email
//         ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//         : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//     }`}
//                           />
//                         </div>
//                         {/* {fieldErrors.email && (
//                           <p className="text-red-500 text-xs mt-1 ml-1">
//                             {fieldErrors.email}
//                           </p>
//                         )} */}
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                           Password
//                           <span className="float-right text-xs text-gray-500">
//                             {/* Minimum 8 characters */}
//                           </span>
//                         </label>
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                             size={18}
//                           />
//                           {/* <input
//                             ref={(el) => (inputRefs.current[1] = el)}
//                             value={loginData.password}
//                             onChange={(e) =>
//                               updateLoginData("password", e.target.value)
//                             }
//                             onKeyPress={(e) => handleKeyPress(e, onLogin)}
//                             type={showPassword ? "text" : "password"}
//                             name="login-password"
//                             autoComplete="off"
//                             maxLength={20}
//                             placeholder="Enter your password"
//                             className={`w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
//                               fieldErrors.password
//                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                                 : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//                             }`}
//                           /> */}
//                           <input
//                             ref={(el) => (inputRefs.current[1] = el)}
//                             type={showPassword ? "text" : "password"}
//                             name="password"
//                             autoComplete="current-password"
//                             maxLength={20}
//                             value={loginData.password}
//                             onChange={(e) =>
//                               updateLoginData("password", e.target.value)
//                             }
//                             onKeyPress={(e) => handleKeyPress(e, onLogin)}
//                             placeholder="Enter your password"
//                             className={`w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg
//     focus:outline-none focus:ring-1 focus:bg-white transition-all
//     ${
//       fieldErrors.password
//         ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//         : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//     }`}
//                           />

//                           <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                           >
//                             {showPassword ? (
//                               <Eye size={18} />
//                             ) : (
//                               <EyeOff size={18} />
//                             )}
//                           </button>
//                         </div>
//                         {/* {fieldErrors.password && (
//                           <p className="text-red-500 text-xs mt-1 ml-1">
//                             {fieldErrors.password}
//                           </p>
//                         )} */}
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <label className="flex items-center cursor-pointer">
//                           <input
//                             type="checkbox"
//                             checked={rememberDevice}
//                             onChange={(e) =>
//                               setRememberDevice(e.target.checked)
//                             }
//                             className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-blue-500"
//                             style={{
//                               color: "#222fb9",
//                             }}
//                           />
//                           <span className="ml-2 text-xs text-gray-700">
//                             Remember this device
//                           </span>
//                         </label>
//                         <button
//                           type="button"
//                           onClick={showVerifyEmail}
//                           className="text-xs font-medium hover:underline"
//                           style={{
//                             color: "#222fb9",
//                           }}
//                         >
//                           Forgot password?
//                         </button>
//                       </div>
//                     </div>

//                     <button
//                       type="submit"
//                       className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
//                         borderRadius: "8px",
//                       }}
//                       onMouseEnter={(e) => {
//                         e.target.style.background =
//                           "linear-gradient(135deg, #1a2580 0%, #222fb9 100%)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.target.style.background =
//                           "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)";
//                       }}
//                     >
//                       LOGIN
//                     </button>

//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between text-xs">
//                         <span className="text-gray-600">
//                           First time logging in?
//                         </span>
//                         <button
//                           type="button"
//                           onClick={showVerifyEmail}
//                           className="font-medium hover:underline"
//                           style={{
//                             color: "#222fb9",
//                           }}
//                         >
//                           Verify your e-mail?
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 )}

//                 {currentStep === "verifyEmail" && (
//                   <form
//                     onSubmit={onVerifyEmail}
//                     className="space-y-5 relative"
//                     noValidate
//                   >
//                     <div>
//                       <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
//                         Verify your identity
//                       </h2>
//                       <p
//                         className="text-xs"
//                         style={{
//                           color: "rgb(123, 129, 153)",
//                           lineHeight: "1.6",
//                         }}
//                       >
//                         Enter the email linked to your Smart Assist account.
//                         We'll send you a one-time verification code to reset
//                         your password.
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                         Corporate ID / Email
//                       </label>
//                       <div className="relative">
//                         <Mail
//                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                           size={18}
//                         />
//                         <input
//                           ref={(el) => (inputRefs.current[2] = el)}
//                           value={verifyData.email}
//                           onChange={(e) =>
//                             updateVerifyData("email", e.target.value)
//                           }
//                           onKeyPress={(e) => handleKeyPress(e, onVerifyEmail)}
//                           type="text"
//                           autoComplete="off"
//                           placeholder="firstname.lastname@jlr.in"
//                           className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
//                             verifyEmailError
//                               ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//                               : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//                           }`}
//                         />
//                       </div>
//                       {/* {verifyEmailError && (
//                         <p className="text-red-500 text-xs mt-1 ml-1">
//                           {verifyEmailError}
//                         </p>
//                       )} */}
//                     </div>

//                     <div className="flex justify-end">
//                       <button
//                         type="button"
//                         onClick={backToLogin}
//                         className="text-xs text-gray-600 hover:underline"
//                         style={{
//                           color: "#222fb9",
//                         }}
//                       >
//                         Back to Login
//                       </button>
//                     </div>
//                     <button
//                       type="submit"
//                       className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       SEND OTP
//                     </button>
//                   </form>
//                 )}

//                 {currentStep === "verifyOtp" && (
//                   <form onSubmit={onVerifyOtp} className="space-y-5 relative">
//                     <div>
//                       <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
//                         Verify your OTP
//                       </h2>
//                       <p
//                         className="text-xs"
//                         style={{
//                           color: "rgb(123, 129, 153)",
//                           lineHeight: "1.6",
//                         }}
//                       >
//                         Enter the one-time code sent to your registered email to
//                         complete your account setup.
//                       </p>
//                     </div>

//                     <div>
//                       <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                         Enter the OTP to finalize your account registration
//                       </label>

//                       <div className="relative">
//                         <Lock
//                           className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                           size={18}
//                         />

//                         <input
//                           ref={(el) => (inputRefs.current[3] = el)}
//                           onInput={onOtpInput}
//                           onKeyPress={(e) => handleKeyPress(e, onVerifyOtp)}
//                           type="text"
//                           value={loginData.otp || ""}
//                           name="otp"
//                           autoComplete="off"
//                           placeholder="Enter OTP"
//                           className={`w-full
//         pl-10 pr-4 py-2.5
//         text-sm text-gray-700
//         bg-gray-50
//         border rounded-lg
//         focus:outline-none
//         focus:ring-1
//         focus:bg-white
//         transition-all
//         text-left
//         tracking-widest ${
//           otpError
//             ? "border-red-500 focus:border-red-500 focus:ring-red-500"
//             : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
//         }`}
//                         />
//                       </div>
//                       {/* {otpError && (
//                         <p className="text-red-500 text-xs mt-1 ml-1">
//                           {otpError}
//                         </p>
//                       )} */}
//                     </div>

//                     <div className="flex justify-between items-center">
//                       <button
//                         type="button"
//                         onClick={backToLogin}
//                         className="text-xs text-gray-600 hover:underline"
//                         style={{
//                           color: "#222fb9",
//                         }}
//                       >
//                         Back to Login
//                       </button>
//                       <button
//                         type="button"
//                         onClick={countdown > 0 ? undefined : onVerifyEmail}
//                         disabled={countdown > 0}
//                         className={`text-xs ${
//                           countdown > 0
//                             ? "text-gray-400 cursor-not-allowed"
//                             : "hover:underline"
//                         }`}
//                         style={{
//                           color: countdown > 0 ? "#9CA3AF" : "#222fb9",
//                         }}
//                       >
//                         {countdown > 0
//                           ? `Resend in ${countdown}s`
//                           : "Resend OTP"}
//                       </button>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={!loginData.otp}
//                       className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       VERIFY OTP
//                     </button>
//                   </form>
//                 )}

//                 {currentStep === "newPassword" && (
//                   <form
//                     onSubmit={onSetNewPassword}
//                     className="space-y-5 relative"
//                   >
//                     <div>
//                       <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
//                         Set New Password
//                       </h2>

//                       <p className="text-gray-600 text-xs">
//                         Create a strong password for your account (max 20
//                         characters)
//                       </p>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                           New Password
//                           <span className="float-right text-xs text-gray-500">
//                             Max 20 characters
//                           </span>
//                         </label>
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             ref={(el) => (inputRefs.current[4] = el)}
//                             value={loginData.newPwd}
//                             onChange={(e) => {
//                               if (e.target.value.length <= 20) {
//                                 updateLoginData("newPwd", e.target.value);
//                               }
//                             }}
//                             onKeyPress={(e) =>
//                               handleKeyPress(e, onSetNewPassword)
//                             }
//                             type={showNewPassword ? "text" : "password"}
//                             autoComplete="off"
//                             placeholder="Enter new password "
//                             className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
//                             maxLength={20}
//                           />
//                           <button
//                             type="button"
//                             onClick={() => setShowNewPassword(!showNewPassword)}
//                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                           >
//                             {showNewPassword ? (
//                               <Eye size={18} />
//                             ) : (
//                               <EyeOff size={18} />
//                             )}
//                           </button>
//                         </div>
//                         <div className="flex justify-between mt-1">
//                           <span className="text-xs text-gray-500">
//                             {loginData.newPwd.length}/20 characters
//                           </span>
//                           {loginData.newPwd.length === 20 && (
//                             <span className="text-xs text-amber-600">
//                               Maximum length reached
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1.5">
//                           Confirm Password
//                           <span className="float-right text-xs text-gray-500">
//                             Max 20 characters
//                           </span>
//                         </label>
//                         <div className="relative">
//                           <Lock
//                             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                             size={18}
//                           />
//                           <input
//                             ref={(el) => (inputRefs.current[5] = el)}
//                             value={loginData.confirmPassword}
//                             onChange={(e) => {
//                               if (e.target.value.length <= 20) {
//                                 updateLoginData(
//                                   "confirmPassword",
//                                   e.target.value,
//                                 );
//                               }
//                             }}
//                             onKeyPress={(e) =>
//                               handleKeyPress(e, onSetNewPassword)
//                             }
//                             type={showConfirmPassword ? "text" : "password"}
//                             autoComplete="off"
//                             placeholder="Confirm password "
//                             className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
//                             maxLength={20}
//                           />
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setShowConfirmPassword(!showConfirmPassword)
//                             }
//                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                           >
//                             {showConfirmPassword ? (
//                               <Eye size={18} />
//                             ) : (
//                               <EyeOff size={18} />
//                             )}
//                           </button>
//                         </div>
//                         <div className="flex justify-between mt-1">
//                           <span className="text-xs text-gray-500">
//                             {loginData.confirmPassword.length}/20 characters
//                           </span>
//                           {loginData.confirmPassword.length === 20 && (
//                             <span className="text-xs text-amber-600">
//                               Maximum length reached
//                             </span>
//                           )}
//                         </div>
//                         {loginData.confirmPassword &&
//                           loginData.newPwd &&
//                           loginData.newPwd !== loginData.confirmPassword && (
//                             <p className="text-red-500 text-xs mt-1">
//                               Passwords do not match
//                             </p>
//                           )}
//                       </div>
//                     </div>

//                     <div className="flex justify-end">
//                       <button
//                         type="button"
//                         onClick={backToLogin}
//                         className="text-xs text-gray-600 hover:underline"
//                         style={{
//                           color: "#222fb9",
//                         }}
//                       >
//                         Back to Login
//                       </button>
//                     </div>

//                     <button
//                       type="submit"
//                       className="w-full py-3 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
//                         borderRadius: "8px",
//                       }}
//                     >
//                       Reset Password
//                     </button>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };
// export default Login;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./LoginForm";
import VerifyEmailForm from "./VerifyEmailForm";
import VerifyOtpForm from "./VerifyOtpForm";
import NewPasswordForm from "./NewPasswordForm";
import LoginLeftPanel from "./LoginLeftPanel";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    otp: null,
    confirmPassword: "",
    newPwd: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [verifyData, setVerifyData] = useState({
    email: "",
  });

  const [verifyEmailError, setVerifyEmailError] = useState("");
  const [otpError, setOtpError] = useState("");

  const [currentStep, setCurrentStep] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [rememberDevice, setRememberDevice] = useState(false);

  const API_BASE_URL = "https://uat.smartassistapp.in/api/";

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Handler functions
  const showVerifyEmail = () => {
    setCurrentStep("verifyEmail");
    setVerifyData({ email: "" });
    setVerifyEmailError("");
    setLoginData((prev) => ({
      ...prev,
      password: "",
      newPwd: "",
      confirmPassword: "",
    }));
  };

  const showVerifyOtp = () => {
    setCurrentStep("verifyOtp");
    setOtpError("");
  };

  const showNewPasswordStep = () => {
    setCurrentStep("newPassword");
  };

  const backToLogin = () => {
    setCurrentStep("login");
    setLoginData({
      email: "",
      password: "",
      otp: null,
      confirmPassword: "",
      newPwd: "",
    });
    setVerifyData({ email: "" });
    setVerifyEmailError("");
    setOtpError("");
    setCountdown(0);
    setFieldErrors({
      email: "",
      password: "",
    });
  };

  const updateLoginData = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const updateVerifyData = (field, value) => {
    setVerifyData((prev) => ({ ...prev, [field]: value }));

    if (field === "email" && verifyEmailError) {
      setVerifyEmailError("");
    }
  };

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateLoginInput = () => {
    const errors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!loginData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    }

    if (!loginData.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const validateNewPassword = () => {
    if (!loginData.newPwd || !loginData.confirmPassword) {
      toast.error("Please enter both passwords");
      return false;
    }
    if (!isValidPassword(loginData.newPwd)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      );
      return false;
    }
    if (loginData.newPwd !== loginData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  // API call functions
  const onLogin = async (e) => {
    e?.preventDefault();

    setFieldErrors({
      email: "",
      password: "",
    });

    if (!validateLoginInput()) {
      return;
    }

    localStorage.clear();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}login/GM`,
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        },
      );

      if (
        response.data.status === 200 &&
        response.data.data?.token &&
        response.data.data?.user
      ) {
        handleLoginSuccess(response.data);
      } else {
        setIsLoading(false);
        handleLoginError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      setIsLoading(false);
      handleLoginError(err);
    }
  };

  const handleLoginSuccess = (response) => {
    const token = response.data.token;
    let user = response.data.user || response.data.userContext;
    let userType = response.data.userRole;

    if (!userType && user) {
      userType = user.role === "DP" ? "GM" : "DEALER";
    }

    let userData = {};
    let finalRole = userType;

    if (userType === "GM" && user) {
      userData = {
        id: user.generalManager_id || user.id,
        name: user.name,
        email: user.email,
      };
      finalRole = "GM";
    } else if (userType === "CEO" && user) {
      userData = {
        id: user.dealerId || user.id,
        name: user.dealerName || user.name,
        email: user.email,
      };
      finalRole = "CEO";
    } else if (userType === "DEALER" && user) {
      userData = {
        id: user.dealerId || user.id,
        name: user.dealerName || user.name,
        email: user.email,
        gmId: user.createdByGM || user.generalManager_id || "",
      };
      finalRole = "DEALER";
    }

    login(userData, token, finalRole);

    if (finalRole === "GM") navigate("/gm/dashboard");
    else if (finalRole === "DEALER") navigate("/dealer/dashboard");
    else navigate("/admin/dashboard");
  };

  const handleLoginError = (error) => {
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      const errorMsgLower = errorMessage.toLowerCase();

      if (
        errorMsgLower.includes("email") ||
        errorMsgLower.includes("invalid email") ||
        errorMsgLower.includes("email not found")
      ) {
        setFieldErrors({
          email: errorMessage,
          password: "",
        });
      } else if (
        errorMsgLower.includes("password") ||
        errorMsgLower.includes("incorrect password") ||
        errorMsgLower.includes("wrong password")
      ) {
        setFieldErrors({
          email: "",
          password: errorMessage,
        });
      } else {
        toast.error(errorMessage);
      }
    } else if (
      error.code === "NETWORK_ERROR" ||
      error.code === "ECONNABORTED"
    ) {
      toast.error(
        "Network error: Please check your internet connection and try again.",
      );
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      setFieldErrors({
        email: "",
        password: "Invalid credentials",
      });
    }
  };

  const onVerifyEmail = async (e) => {
    e?.preventDefault();

    setVerifyEmailError("");

    if (!verifyData.email) {
      setVerifyEmailError("Email is required");
      return;
    }

    if (!isValidEmail(verifyData.email)) {
      setVerifyEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    const gmPayload = { email: verifyData.email };

    try {
      const response = await axios.post(
        `${API_BASE_URL}login/GM/forgot-pwd/verify-email`,
        gmPayload,
      );

      setIsLoading(false);

      // show backend message instead of fixed text
      toast.success(response?.data?.message);

      showVerifyOtp();
      setCountdown(60);
    } catch (gmError) {
      setIsLoading(false);
      const errorMessage =
        gmError.response?.data?.message || "An error occurred";
      setVerifyEmailError(errorMessage);
    }
  };

  // const onVerifyEmail = async (e) => {
  //   e?.preventDefault();

  //   setVerifyEmailError("");

  //   if (!verifyData.email) {
  //     setVerifyEmailError("Email is required");
  //     return;
  //   }

  //   if (!isValidEmail(verifyData.email)) {
  //     setVerifyEmailError("Please enter a valid email address");
  //     return;
  //   }

  //   setIsLoading(true);

  //   const gmPayload = { email: verifyData.email };

  //   try {
  //     await axios.post(
  //       `${API_BASE_URL}login/GM/forgot-pwd/verify-email`,
  //       gmPayload,
  //     );
  //     setIsLoading(false);
  //     toast.success("OTP sent to your email");
  //     showVerifyOtp();
  //     setCountdown(60);
  //   } catch (gmError) {
  //     setIsLoading(false);
  //     const errorMessage =
  //       gmError.response?.data?.message || "An error occurred";
  //     setVerifyEmailError(errorMessage);
  //   }
  // };

  const onVerifyOtp = async (e) => {
    e?.preventDefault();

    setOtpError("");

    if (loginData.otp === null || isNaN(Number(loginData.otp))) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);

    const gmPayload = {
      otp: Number(loginData.otp),
      email: verifyData.email,
    };

    try {
      await axios.post(
        `${API_BASE_URL}login/GM/forgot-pwd/verify-otp`,
        gmPayload,
      );
      setIsLoading(false);
      toast.success("OTP verified successfully");
      showNewPasswordStep();
    } catch (gmError) {
      setIsLoading(false);
      const errorMessage =
        gmError.response?.data?.message || "Entered OTP is invalid";
      setOtpError(errorMessage);
    }
  };

  const onOtpInput = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setLoginData((prev) => ({
      ...prev,
      otp: numericValue ? Number(numericValue) : 0,
    }));
    e.target.value = numericValue;

    if (otpError) {
      setOtpError("");
    }
  };

  const onSetNewPassword = async (e) => {
    e.preventDefault();
    if (!validateNewPassword()) return;

    setIsLoading(true);

    const gmPayload = {
      email: verifyData.email,
      newPwd: loginData.newPwd,
      confirmPwd: loginData.confirmPassword,
    };

    try {
      await axios.put(`${API_BASE_URL}login/GM/forgot-pwd/new-pwd`, gmPayload);
      setIsLoading(false);
      toast.success("Password reset successfully");
      backToLogin();
    } catch (gmError) {
      setIsLoading(false);
      if (gmError.response?.status === 400) {
        toast.error("Invalid request. Please check your inputs.");
      } else if (gmError.response?.status === 404) {
        toast.error("User not found");
      } else {
        const errorMessage =
          gmError.response?.data?.error || "An error occurred";
        toast.error(errorMessage);
      }
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={1}
        />

        <div className="w-full max-w-5xl mx-auto relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-40 rounded-2xl">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <LoginLeftPanel />

              <div className="p-8 md:p-10 flex flex-col justify-center w-full">
                <div className="md:hidden text-center mb-6">
                  <div className="inline-flex items-center justify-between w-full mb-4">
                    <div className="flex flex-col text-left">
                      <h1 className="font-semibold text-2xl text-gray-800 leading-tight mb-0">
                        smart
                      </h1>
                      <h1 className="font-semibold text-2xl text-gray-800 leading-tight mb-2 -mt-2">
                        <span style={{ color: "#222fb9" }}>a</span>ss
                        <span style={{ color: "#222fb9" }}>i</span>st
                      </h1>
                      <p className="text-sm text-gray-600">
                        Pre-Sales Intelligence for JLR
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                      <img
                        src="/logo copy.svg"
                        alt="JLR Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {currentStep === "login" && (
                  <LoginForm
                    loginData={loginData}
                    fieldErrors={fieldErrors}
                    showPassword={showPassword}
                    rememberDevice={rememberDevice}
                    inputRefs={inputRefs}
                    onLogin={onLogin}
                    showVerifyEmail={showVerifyEmail}
                    updateLoginData={updateLoginData}
                    setShowPassword={setShowPassword}
                    setRememberDevice={setRememberDevice}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === "verifyEmail" && (
                  <VerifyEmailForm
                    verifyData={verifyData}
                    verifyEmailError={verifyEmailError}
                    inputRefs={inputRefs}
                    onVerifyEmail={onVerifyEmail}
                    backToLogin={backToLogin}
                    updateVerifyData={updateVerifyData}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === "verifyOtp" && (
                  <VerifyOtpForm
                    loginData={loginData}
                    otpError={otpError}
                    countdown={countdown}
                    inputRefs={inputRefs}
                    onVerifyOtp={onVerifyOtp}
                    onVerifyEmail={onVerifyEmail}
                    backToLogin={backToLogin}
                    onOtpInput={onOtpInput}
                    handleKeyPress={handleKeyPress}
                  />
                )}

                {currentStep === "newPassword" && (
                  <NewPasswordForm
                    loginData={loginData}
                    showNewPassword={showNewPassword}
                    showConfirmPassword={showConfirmPassword}
                    inputRefs={inputRefs}
                    onSetNewPassword={onSetNewPassword}
                    backToLogin={backToLogin}
                    updateLoginData={updateLoginData}
                    setShowNewPassword={setShowNewPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    handleKeyPress={handleKeyPress}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Login;
