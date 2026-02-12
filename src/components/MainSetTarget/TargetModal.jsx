import React from "react";

const TargetModal = ({
  isEditMode,
  formData,
  formErrors,
  formTouched,
  handleFormChange,
  handleKeyPress,
  onSave,
  onUpdate,
  closeModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h5 className="text-lg font-semibold text-center w-full">
            Add New Target
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={closeModal}
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enquiries */}
            <div className="space-y-2">
              <label
                htmlFor="enquiries"
                className="block text-xs font-medium text-gray-700"
              >
                Enquiries <span className="text-red-500">*</span>
              </label>
              <input
                id="enquiries"
                className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
                  formTouched.enquiries && formErrors.enquiries
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="number"
                value={formData.enquiries}
                onChange={(e) => handleFormChange("enquiries", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enquiries"
              />
              {formTouched.enquiries && formErrors.enquiries && (
                <div className="text-red-500 text-xs">
                  {formErrors.enquiries}
                </div>
              )}
            </div>

            {/* Test Drives */}
            <div className="space-y-2">
              <label
                htmlFor="testDrives"
                className="block text-xs font-medium text-gray-700"
              >
                Test Drives <span className="text-red-500">*</span>
              </label>
              <input
                id="testDrives"
                className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
                  formTouched.testDrives && formErrors.testDrives
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="number"
                value={formData.testDrives}
                onChange={(e) => handleFormChange("testDrives", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Test Drives"
              />
              {formTouched.testDrives && formErrors.testDrives && (
                <div className="text-red-500 text-xs">
                  {formErrors.testDrives}
                </div>
              )}
            </div>

            {/* Orders */}
            <div className="space-y-2">
              <label
                htmlFor="orders"
                className="block text-xs font-medium text-gray-700"
              >
                Orders <span className="text-red-500">*</span>
              </label>
              <input
                id="orders"
                className={`w-full h-12 rounded-lg border px-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#222fb9] focus:border-transparent ${
                  formTouched.orders && formErrors.orders
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="number"
                value={formData.orders}
                onChange={(e) => handleFormChange("orders", e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Orders"
              />
              {formTouched.orders && formErrors.orders && (
                <div className="text-red-500 text-xs">{formErrors.orders}</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          {isEditMode ? (
            <button
              type="button"
              className="px-4 py-2 text-[#222fb9] border border-[#222fb9] rounded-lg hover:bg-[#222fb9] hover:text-white transition-colors duration-200 text-xs"
              onClick={onUpdate}
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              className="px-4 py-2 text-[#222fb9] border border-[#222fb9] rounded-lg hover:bg-[#222fb9] hover:text-white transition-colors duration-200 text-xs"
              onClick={onSave}
            >
              Save
            </button>
          )}
          <button
            type="button"
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-xs"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetModal;
