import React from "react";

const FaqReleaseNotesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-base font-semibold text-gray-900 mb-2">
          📘 Dashboard Help & Release Notes
        </h3>

        <div className="text-xs text-gray-700 space-y-3">
          {/* Latest Release */}
          <div>
            <h4 className="font-semibold">🔹 Latest Release</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Added Test Drive analytics</li>
              <li>Improved dashboard performance</li>
              <li>Digital enquiries highlighted in orange color</li>
              <li>Better mobile responsiveness</li>
            </ul>
          </div>

          {/* How to Read Dashboard */}
          <div>
            <h4 className="font-semibold">🔹 How to Read Dashboard</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Orange values indicate digital enquiries</li>
              <li>Tabs on top switch between analytics views</li>
              <li>Use filters to narrow dealer-wise data</li>
            </ul>
          </div>

          {/* FAQ */}
          <div>
            <h4 className="font-semibold">🔹 FAQ</h4>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Why values are highlighted? → Digital source</li>
              <li>Why data mismatch? → Sync delay of few minutes</li>
              <li>Mobile view missing data? → Use landscape mode</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs bg-[#222fb9] text-white rounded-lg cursor-pointer hover:bg-[#1b2499]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqReleaseNotesModal;
