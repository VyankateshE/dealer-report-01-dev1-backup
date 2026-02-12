import React from "react";
import { DateFilterPopup } from "./DateFilterPopup";

export const FilterSection = ({
  pageLimit,
  onLimitChange,
  leadSourceList,
  selectedLeadSource,
  setSelectedLeadSource,
  leadOwnerList,
  selectedLeadOwner,
  setSelectedLeadOwner,
  statusList,
  selectedStatus,
  setSelectedStatus,
  vehicleNameList,
  selectedVehicleName,
  setSelectedVehicleName,
  enquiryTypeList,
  selectedEnquiryType,
  setSelectedEnquiryType,
  showDatePopup,
  setShowDatePopup,
  tempStartDate,
  setTempStartDate,
  tempEndDate,
  setTempEndDate,
  startDate,
  endDate,
  dateFilterApplied,
  setStartDate,
  setEndDate,
  setSelectedDateRangeMsg,
  setDateFilterApplied,
  setPageNumber,
  isLoadingDropdowns,
  search,
  handleSearchInput,
  handleSearchKeyPress,
  totalRecords,
  selectedDateRangeMsg,
  resetAllFilters,
  isResetting,
  getAnyRowSelected,
  getIsAllSelected,
  selectAllRows,
  getSelectedCount,
  openReassignCard,
  allLead,
  setAllLead,
}) => {
  const renderDateFilterButton = () => (
    <button
      onClick={() => setShowDatePopup(true)}
      className="border border-gray-300 rounded px-3 py-2 bg-white hover:border-[#222fb9] hover:bg-blue-50 transition-colors text-xs flex items-center justify-between w-full sm:w-auto min-w-[176px]"
    >
      <div className="flex items-center gap-2">
        <i className="fa-solid fa-calendar text-gray-500 text-xs"></i>
        {dateFilterApplied ? (
          <span className="text-gray-800 text-xs whitespace-nowrap">
            {startDate} - {endDate}
          </span>
        ) : (
          <span className="text-gray-600 text-xs whitespace-nowrap">
            Custom Filter
          </span>
        )}
      </div>
      <i className="fa-solid fa-chevron-down text-gray-500 text-xs ml-2"></i>
    </button>
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3 mb-3 flex-wrap text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
          <select
            className="border border-gray-300 rounded px-3 py-2 w-24 sm:w-24 focus:outline-none focus:border-[#222fb9] text-xs"
            value={pageLimit}
            onChange={onLimitChange}
          >
            <option value={10} className="text-xs">
              10
            </option>
            <option value={50} className="text-xs">
              50
            </option>
            <option value={100} className="text-xs">
              100
            </option>
          </select>
          <label className="mb-0 whitespace-nowrap text-gray-700 text-xs">
            records per page
          </label>
        </div>

        <div className="w-full sm:w-5"></div>

        {!getAnyRowSelected() ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:flex-1 mb-3 sm:mb-0">
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
              value={selectedLeadSource}
              onChange={(e) => setSelectedLeadSource(e.target.value)}
            >
              <option value="" className="text-xs">
                All Enquiry Sources
              </option>
              {leadSourceList.map((source, index) => (
                <option key={index} value={source} className="text-xs">
                  {source}
                </option>
              ))}
              {leadSourceList.length === 0 && isLoadingDropdowns && (
                <option disabled className="text-xs">
                  Loading sources...
                </option>
              )}
            </select>

            <select
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
              value={selectedLeadOwner}
              onChange={(e) => setSelectedLeadOwner(e.target.value)}
            >
              <option value="" className="text-xs">
                All Enquiry Owners
              </option>
              {leadOwnerList.map((owner, index) => (
                <option key={index} value={owner.user_id} className="text-xs">
                  {owner.name}
                </option>
              ))}
              {leadOwnerList.length === 0 && isLoadingDropdowns && (
                <option disabled className="text-xs">
                  Loading users...
                </option>
              )}
            </select>

            <select
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-32 focus:outline-none focus:border-[#222fb9] text-xs"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="" className="text-xs">
                All Status
              </option>
              {statusList.map((status, index) => (
                <option key={index} value={status} className="text-xs">
                  {status}
                </option>
              ))}
              {statusList.length === 0 && isLoadingDropdowns && (
                <option disabled className="text-xs">
                  Loading status...
                </option>
              )}
            </select>

            <select
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
              value={selectedVehicleName}
              onChange={(e) => setSelectedVehicleName(e.target.value)}
            >
              <option value="" className="text-xs">
                All PMI's
              </option>
              {vehicleNameList.map((vehicle, index) => (
                <option key={index} value={vehicle} className="text-xs">
                  {vehicle}
                </option>
              ))}
              {vehicleNameList.length === 0 && isLoadingDropdowns && (
                <option disabled className="text-xs">
                  Loading vehicles...
                </option>
              )}
            </select>

            <select
              className="border border-gray-300 rounded px-3 py-2 w-full sm:w-40 focus:outline-none focus:border-[#222fb9] text-xs"
              value={selectedEnquiryType}
              onChange={(e) => setSelectedEnquiryType(e.target.value)}
            >
              <option value="" className="text-xs">
                All Enquiry Types
              </option>
              {enquiryTypeList.map((type, index) => (
                <option key={index} value={type} className="text-xs">
                  {type}
                </option>
              ))}
              {enquiryTypeList.length === 0 && isLoadingDropdowns && (
                <option disabled className="text-xs">
                  Loading enquiry types...
                </option>
              )}
            </select>

            {renderDateFilterButton()}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:flex-1 mb-3 sm:mb-0">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg w-full sm:w-auto text-xs">
              <label className="flex items-center gap-2 mb-0 font-medium text-xs">
                <input
                  type="checkbox"
                  checked={getIsAllSelected()}
                  onChange={selectAllRows}
                  className="w-4 h-4"
                />
                Select All
              </label>
              <span className="text-xs font-medium">
                {getSelectedCount()} selected
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                className="bg-[#222fb9] text-white px-5 py-2 rounded-lg hover:bg-[#1b26a0] transition-colors font-medium shadow-sm text-xs w-full sm:w-auto"
                onClick={openReassignCard}
              >
                Reassign
              </button>

              <button
                className="bg-[#222fb9] text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-xs w-full sm:w-auto"
                onClick={() => {
                  const updatedLeads = allLead.leads.map((lead) => ({
                    ...lead,
                    selected: false,
                  }));
                  setAllLead((prev) => ({
                    ...prev,
                    leads: updatedLeads,
                  }));
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {showDatePopup && (
        <DateFilterPopup
          tempStartDate={tempStartDate}
          setTempStartDate={setTempStartDate}
          tempEndDate={tempEndDate}
          setTempEndDate={setTempEndDate}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setSelectedDateRangeMsg={setSelectedDateRangeMsg}
          setDateFilterApplied={setDateFilterApplied}
          setPageNumber={setPageNumber}
          setShowDatePopup={setShowDatePopup}
        />
      )}
    </>
  );
};
