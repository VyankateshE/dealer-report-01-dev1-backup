import React, { useRef, useState } from "react";

export const ReassignCard = ({
  isReassignCardOpen,
  closeReassignCard,
  selectedLeadDetails,
  selectedUserPopup,
  setSelectedUserPopup,
  allUser,
  searchUserTermPopup,
  setSearchUserTermPopup,
  filteredUsersPopup,
  setFilteredUsersPopup,
  singleReassignSubmit,
  reassignSubmit,
  isReassigning,
}) => {
  const [dropdownOpenPopup, setDropdownOpenPopup] = useState(false);
  const popupDropdownRef = useRef(null);

  if (!isReassignCardOpen) return null;

  const toggleDropdownPopup = () => {
    setDropdownOpenPopup(!dropdownOpenPopup);
  };

  const selectUserPopup = (user) => {
    setSelectedUserPopup(user);
    setDropdownOpenPopup(false);
    setSearchUserTermPopup("");
  };

  const filterUsersPopup = () => {
    const filtered = allUser.filter((user) =>
      user.name.toLowerCase().includes(searchUserTermPopup.toLowerCase()),
    );
    setFilteredUsersPopup(filtered);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl relative w-96 shadow-lg text-xs">
        <h5 className="mb-4 font-bold text-xs">
          {selectedLeadDetails
            ? "Reassign Single Enquiry"
            : "Reassign Selected Enquiries"}
        </h5>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-xs">
            User
          </label>
          <div className="relative w-full" ref={popupDropdownRef}>
            <div
              className="border border-gray-300 rounded px-3 py-2 bg-white flex justify-between items-center hover:border-[#222fb9] cursor-pointer transition-colors text-xs"
              onClick={toggleDropdownPopup}
            >
              <span
                className={
                  selectedUserPopup
                    ? "text-gray-900 text-xs"
                    : "text-gray-500 text-xs"
                }
              >
                {selectedUserPopup?.name || "Select User"}
              </span>
              <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
            </div>

            {dropdownOpenPopup && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-50 text-xs">
                <input
                  type="text"
                  className="w-full border-b border-gray-300 px-3 py-2 focus:outline-none text-xs"
                  placeholder="Search user..."
                  value={searchUserTermPopup}
                  onChange={(e) => {
                    setSearchUserTermPopup(e.target.value);
                    filterUsersPopup();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ul className="max-h-60 overflow-y-auto text-xs">
                  {filteredUsersPopup.length > 0 ? (
                    filteredUsersPopup.map((user, index) => (
                      <li
                        key={index}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-xs"
                        onClick={() => selectUserPopup(user)}
                      >
                        {user.name}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 text-center text-xs">
                      No user found
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 text-xs">
          <button
            className="bg-white border-2 border-[#222fb9] text-[#222fb9] px-4 py-2 rounded hover:bg-[#222fb9] hover:text-white transition-colors text-xs"
            onClick={closeReassignCard}
          >
            Cancel
          </button>
          <button
            className="bg-[#222fb9] text-white px-4 py-2 rounded hover:bg-[#1e28a0] transition-colors text-xs"
            onClick={
              selectedLeadDetails ? singleReassignSubmit : reassignSubmit
            }
          >
            Submit
          </button>
        </div>

        {isReassigning && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center rounded-xl">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
