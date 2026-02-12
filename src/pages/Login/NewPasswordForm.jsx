import React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const NewPasswordForm = ({
  loginData,
  showNewPassword,
  showConfirmPassword,
  inputRefs,
  onSetNewPassword,
  backToLogin,
  updateLoginData,
  setShowNewPassword,
  setShowConfirmPassword,
  handleKeyPress,
}) => {
  return (
    <form onSubmit={onSetNewPassword} className="space-y-5 relative">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
          Set New Password
        </h2>
        <p className="text-gray-600 text-xs">
          Create a strong password for your account (max 20 characters)
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            New Password
            <span className="float-right text-xs text-gray-500">
              Max 20 characters
            </span>
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={(el) => (inputRefs.current[4] = el)}
              value={loginData.newPwd}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  updateLoginData("newPwd", e.target.value);
                }
              }}
              onKeyPress={(e) => handleKeyPress(e, onSetNewPassword)}
              type={showNewPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Enter new password "
              className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
              maxLength={20}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {loginData.newPwd.length}/20 characters
            </span>
            {loginData.newPwd.length === 20 && (
              <span className="text-xs text-amber-600">
                Maximum length reached
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Confirm Password
            <span className="float-right text-xs text-gray-500">
              Max 20 characters
            </span>
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              ref={(el) => (inputRefs.current[5] = el)}
              value={loginData.confirmPassword}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  updateLoginData("confirmPassword", e.target.value);
                }
              }}
              onKeyPress={(e) => handleKeyPress(e, onSetNewPassword)}
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="off"
              placeholder="Confirm password "
              className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
              maxLength={20}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {loginData.confirmPassword.length}/20 characters
            </span>
            {loginData.confirmPassword.length === 20 && (
              <span className="text-xs text-amber-600">
                Maximum length reached
              </span>
            )}
          </div>
          {loginData.confirmPassword &&
            loginData.newPwd &&
            loginData.newPwd !== loginData.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={backToLogin}
          className="text-xs text-gray-600 hover:underline"
          style={{
            color: "#222fb9",
          }}
        >
          Back to Login
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-md"
        style={{
          background: "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
          borderRadius: "8px",
        }}
      >
        Reset Password
      </button>
    </form>
  );
};

export default NewPasswordForm;
