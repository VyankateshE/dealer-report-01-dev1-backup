import React from "react";
import { Mail } from "lucide-react";

const VerifyEmailForm = ({
  verifyData,
  verifyEmailError,
  inputRefs,
  onVerifyEmail,
  backToLogin,
  updateVerifyData,
  handleKeyPress,
}) => {
  return (
    <form onSubmit={onVerifyEmail} className="space-y-5 relative" noValidate>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
          Verify your Email
        </h2>
        <p
          className="text-xs"
          style={{
            color: "rgb(123, 129, 153)",
            lineHeight: "1.6",
          }}
        >
          Enter the email linked to your Smart Assist account. We'll send you a
          one-time verification code to reset your password.
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Corporate ID / Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={(el) => (inputRefs.current[2] = el)}
            value={verifyData.email}
            onChange={(e) => updateVerifyData("email", e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, onVerifyEmail)}
            type="text"
            autoComplete="off"
            placeholder="firstname.lastname@jlr.in"
            className={`w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
              verifyEmailError
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            }`}
          />
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
        className="w-full py-3 text-white text-sm font-semibold transition-all duration-300 shadow-md"
        style={{
          background: "linear-gradient(135deg, #222fb9 0%, #1a2580 100%)",
          borderRadius: "8px",
        }}
      >
        SEND OTP
      </button>
    </form>
  );
};

export default VerifyEmailForm;
