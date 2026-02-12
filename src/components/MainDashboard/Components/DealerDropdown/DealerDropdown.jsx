import React from "react";

const DealerDropdown = ({
  dropdownOpen,
  setDropdownOpen,
  selectedDealers,
  dealerSearch,
  filteredDealers,
  isDealerSelected,
  areAllSelected,
  onDealerSearchChange,
  onToggleDealerSelection,
  onToggleSelectAll,
  onClearSelection,
}) => {
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={`dropdown relative ${dropdownOpen ? "show" : ""}`}>
      <button
        className="time-dropdown dropdown-toggle px-3 py-2 cursor-pointer rounded-lg bg-white min-w-[200px] text-left flex justify-between items-center w-full"
        onClick={toggleDropdown}
      >
        {selectedDealers.length > 0
          ? `Dealers Selected (${selectedDealers.length})`
          : "Select Dealers"}
        <i className="fas fa-chevron-down ml-2 text-sm"></i>
      </button>

      {dropdownOpen && (
        <div className="dropdown-menu absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto w-full">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              className="form-control w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Search dealers..."
              value={dealerSearch}
              onChange={(e) => onDealerSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200">
            <label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                checked={areAllSelected()}
                onChange={onToggleSelectAll}
                onClick={(e) => e.stopPropagation()}
              />
              Select All
            </label>
            <button
              type="button"
              className="btn btn-link btn-sm text-red-600 p-0 text-sm cursor-pointer hover:text-red-800"
              onClick={(e) => {
                onClearSelection();
                e.stopPropagation();
              }}
            >
              Clear
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => (
                <div
                  key={dealer.dealerId}
                  className="dropdown-item px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={isDealerSelected(dealer)}
                    onChange={() => onToggleDealerSelection(dealer)}
                  />
                  <span onClick={() => onToggleDealerSelection(dealer)}>
                    {dealer.dealerName}
                  </span>
                </div>
              ))
            ) : (
              <div className="dropdown-item text-gray-500 text-center py-2">
                No dealers found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerDropdown;
