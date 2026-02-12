import React from "react";
import { Lock } from "lucide-react";
const VerifyOtpForm = ({
  loginData,
  otpError,
  countdown,
  inputRefs,
  onVerifyOtp,
  onVerifyEmail,
  backToLogin,
  onOtpInput,
  handleKeyPress,
}) => {
  return (
    <form onSubmit={onVerifyOtp} className="space-y-5 relative">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
          Verify your OTP
        </h2>
        <p
          className="text-xs"
          style={{
            color: "rgb(123, 129, 153)",
            lineHeight: "1.6",
          }}
        >
          Enter the one-time code sent to your registered email to complete your
          account setup.
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Enter the OTP to finalize your account registration
        </label>
        <div className="relative">
          <Lock
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={(el) => (inputRefs.current[3] = el)}
            onInput={onOtpInput}
            onKeyPress={(e) => handleKeyPress(e, onVerifyOtp)}
            type="text"
            value={loginData.otp || ""}
            name="otp"
            autoComplete="off"
            placeholder="Enter OTP"
            className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg
              focus:outline-none focus:ring-1 focus:bg-white transition-all
              text-left tracking-widest ${
                otpError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
              }`}
          />
        </div>
      </div>
      <div className="flex justify-between items-center">
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
        <button
          type="button"
          onClick={countdown > 0 ? undefined : onVerifyEmail}
          disabled={countdown > 0}
          className={`text-xs ${
            countdown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "hover:underline"
          }`}
          style={{
            color: countdown > 0 ? "#9CA3AF" : "#222fb9",
          }}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
        </button>
      </div>
      <button
        type="submit"
        disabled={!loginData.otp}
        className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
          borderRadius: "8px",
        }}
      >
        VERIFY OTP
      </button>
    </form>
  );
};
export default VerifyOtpForm;
