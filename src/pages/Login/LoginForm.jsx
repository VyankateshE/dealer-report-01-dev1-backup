import React from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const LoginForm = ({
  loginData,
  fieldErrors,
  showPassword,
  rememberDevice,
  inputRefs,
  onLogin,
  showVerifyEmail,
  updateLoginData,
  setShowPassword,
  setRememberDevice,
  handleKeyPress,
}) => {
  return (
    <form onSubmit={onLogin} className="space-y-5" noValidate>
      <div>
        <div
          className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border"
          style={{
            borderColor: "#222fb9",
            backgroundColor: "rgba(34, 47, 185, 0.05)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "linear-gradient(135deg, #222fb9 0, #1a2580 100%)",
            }}
          ></div>
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{
              color: "#222fb9",
            }}
          >
            Admin Login
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
          Welcome back, Admin.
        </h2>
        <p
          className="text-xs"
          style={{
            color: "rgb(123, 129, 153)",
            lineHeight: "1.6",
          }}
        >
          Sign in with your JLR corporate credentials to access the Smart Assist
          Admin dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Corporate ID / Email
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={(el) => (inputRefs.current[0] = el)}
              type="email"
              name="email"
              autoComplete="username"
              value={loginData.email}
              onChange={(e) => updateLoginData("email", e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, onLogin)}
              placeholder="firstname.lastname@jlr.in"
              className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg
                focus:outline-none focus:ring-1 focus:bg-white transition-all
                ${
                  fieldErrors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={(el) => (inputRefs.current[1] = el)}
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              maxLength={20}
              value={loginData.password}
              onChange={(e) => updateLoginData("password", e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, onLogin)}
              placeholder="Enter your password"
              className={`w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg
                focus:outline-none focus:ring-1 focus:bg-white transition-all
                ${
                  fieldErrors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-blue-500"
              style={{
                color: "#222fb9",
              }}
            />
            <span className="ml-2 text-xs text-gray-700">
              Remember this device
            </span>
          </label>
          <button
            type="button"
            onClick={showVerifyEmail}
            className="text-xs font-medium hover:underline"
            style={{
              color: "#222fb9",
            }}
          >
            Forgot password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #1a2580 0%, #222fb9 100%)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background =
            "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)";
        }}
      >
        LOGIN
      </button>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">First time logging in?</span>
          <button
            type="button"
            onClick={showVerifyEmail}
            className="font-medium hover:underline"
            style={{
              color: "#222fb9",
            }}
          >
            Verify your e-mail?
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
