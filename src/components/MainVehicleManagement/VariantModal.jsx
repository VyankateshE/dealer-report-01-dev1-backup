import React from "react";

const VariantModal = ({
  isModalOpen,
  isEditMode,
  formData,
  allModels,
  isFormSubmitted,
  vinTooLong,
  variantTooLong,
  aliasTooLong,
  closeModal,
  handleInputChange,
  handleSave,
  handleUpdate,
  hasFormChanged,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl text-xs">
        <div className="border-b p-4 flex justify-between items-center">
          <h5 className="text-xs font-semibold flex-1 text-center">
            {isEditMode ? "Edit Variant" : "Add Variant"}
          </h5>
          <button
            type="button"
            className="text-2xl bg-transparent border-none cursor-pointer"
            onClick={closeModal}
          >
            <span>&times;</span>
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Model */}
            <div>
              <label htmlFor="model" className="block mb-2 font-medium text-xs">
                Model Name
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                id="model"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-[#222fb9] text-xs ${
                  !isEditMode && !formData.model && isFormSubmitted
                    ? "border-red-500"
                    : "border-gray-300"
                } ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
                value={formData.model}
                onChange={(e) => {
                  handleInputChange("model", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false); // This should be passed as prop if needed
                  }
                }}
                disabled={isEditMode}
                required={!isEditMode}
              >
                <option value="" disabled hidden className="text-xs">
                  Select Model
                </option>
                {allModels.map((data) => (
                  <option
                    key={data.vehicle_id}
                    value={data.vehicle_id}
                    className="text-xs"
                  >
                    {data.vehicle_name}
                  </option>
                ))}
              </select>
              {!isEditMode && !formData.model && isFormSubmitted && (
                <div className="text-red-500 text-xs mt-1">
                  Model Name is required.
                </div>
              )}
            </div>

            {/* Variant */}
            <div>
              <label
                htmlFor="variant"
                className="block mb-2 font-medium text-xs"
              >
                Variant
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id="variant"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
                  (!isEditMode && !formData.variant && isFormSubmitted) ||
                  variantTooLong
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="text"
                value={formData.variant}
                onChange={(e) => {
                  handleInputChange("variant", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false);
                  }
                }}
                placeholder={isEditMode ? "Edit Variant" : "Add Variant"}
                maxLength={16}
                required={!isEditMode}
              />
              <div className="flex justify-between mt-1">
                <div className="text-left">
                  {!isEditMode && !formData.variant && isFormSubmitted && (
                    <div className="text-red-500 text-xs">
                      Variant is required.
                    </div>
                  )}
                  {variantTooLong && (
                    <div className="text-red-500 text-xs">
                      Variant cannot exceed 16 characters
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.variant.length}/16 characters
                </div>
              </div>
            </div>

            {/* YOM */}
            <div>
              <label htmlFor="YOM" className="block mb-2 font-medium text-xs">
                YOM
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id="YOM"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
                  !isEditMode && !formData.YOM && isFormSubmitted
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formData.YOM}
                onChange={(e) => {
                  handleInputChange("YOM", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false);
                  }
                }}
                required={!isEditMode}
              />
              {!isEditMode && !formData.YOM && isFormSubmitted && (
                <div className="text-red-500 text-xs mt-1">
                  YOM is required.
                </div>
              )}
            </div>

            {/* VIN */}
            <div>
              <label htmlFor="vin" className="block mb-2 font-medium text-xs">
                VIN
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id="vin"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
                  !isEditMode && !formData.vin && isFormSubmitted
                    ? "border-red-500"
                    : vinTooLong
                      ? "border-red-500"
                      : "border-gray-300"
                }`}
                type="text"
                value={formData.vin}
                onChange={(e) => {
                  handleInputChange("vin", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false);
                  }
                }}
                placeholder="Add VIN"
                maxLength={17}
                required={!isEditMode}
              />
              <div className="flex justify-between mt-1">
                <div className="text-left">
                  {!isEditMode && !formData.vin && isFormSubmitted ? (
                    <div className="text-red-500 text-xs">VIN is required.</div>
                  ) : vinTooLong ? (
                    <div className="text-red-500 text-xs">
                      VIN cannot exceed 17 characters
                    </div>
                  ) : null}
                </div>
                <div className="text-xs text-gray-500">
                  {formData.vin.length}/17 characters
                </div>
              </div>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block mb-2 font-medium text-xs">
                Type
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <select
                id="type"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
                  !isEditMode && !formData.type && isFormSubmitted
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={formData.type}
                onChange={(e) => {
                  handleInputChange("type", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false);
                  }
                }}
                required={!isEditMode}
              >
                <option value="" disabled hidden className="text-xs">
                  Select Type
                </option>
                <option value="petrol" className="text-xs">
                  PETROL
                </option>
                <option value="diesel" className="text-xs">
                  DIESEL
                </option>
                <option value="EV" className="text-xs">
                  EV
                </option>
              </select>
              {!isEditMode && !formData.type && isFormSubmitted && (
                <div className="text-red-500 text-xs mt-1">
                  Type is required.
                </div>
              )}
            </div>

            {/* Identity (Alias) */}
            <div>
              <label
                htmlFor="identity"
                className="block mb-2 font-medium text-xs"
              >
                Alias
                {!isEditMode && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                id="identity"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#222fb9] text-xs ${
                  (!isEditMode && !formData.identity && isFormSubmitted) ||
                  aliasTooLong
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                type="text"
                value={formData.identity}
                onChange={(e) => {
                  handleInputChange("identity", e.target.value);
                  if (e.target.value) {
                    // setIsFormSubmitted(false);
                  }
                }}
                placeholder="Add Alias"
                maxLength={16}
                required={!isEditMode}
              />
              <div className="mt-1 text-right">
                <div className="text-xs text-gray-500">
                  {formData.identity.length}/16 characters
                </div>
                {!isEditMode && !formData.identity && isFormSubmitted && (
                  <div className="text-red-500 text-xs mt-1">
                    Alias is required.
                  </div>
                )}
                {aliasTooLong && (
                  <div className="text-red-500 text-xs mt-1">
                    Alias cannot exceed 16 characters
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
              onClick={closeModal}
            >
              Close
            </button>
            {isEditMode ? (
              <button
                type="button"
                className={`px-4 py-2 rounded text-xs ${
                  hasFormChanged()
                    ? "border border-[#222fb9] text-[#222fb9] hover:bg-[#222fb9] hover:text-white transition-colors cursor-pointer"
                    : "border border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
                onClick={handleUpdate}
                disabled={!hasFormChanged()}
              >
                Update
              </button>
            ) : (
              <button
                type="button"
                className="border border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
                onClick={handleSave}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
