// import React, { useState } from "react";
// import { ActivitySection } from "./ActivitySection";

// export const LeadDetailsModal = ({
//   showDetailsModal,
//   setShowDetailsModal,
//   selectedLeadDetails,
//   isLoadingActivities,
//   error,
//   handleViewDetails,
//   lead,
//   getStatusColor,
//   formatDateOnly,
//   leadActivities,
//   activeTab,
//   setActiveTab,
//   allUser,
//   selectedUserPopup,
//   setSelectedUserPopup,
//   searchUserTermPopup,
//   setSearchUserTermPopup,
//   filteredUsersPopup,
//   setFilteredUsersPopup,
//   dropdownOpenPopup,
//   setDropdownOpenPopup,
//   popupDropdownRef,
//   singleReassignSubmit,
// }) => {
//   const [isOpen, setIsOpen] = useState(showDetailsModal);

//   if (!isOpen) return null;

//   const renderLeadProfile = () => (
//     <div className="space-y-4 text-xs">
//       <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-b border-gray-200 pb-4">
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Name:
//           </div>
//           <div className="text-gray-800 font-semibold text-xs">
//             {selectedLeadDetails.lead_name ||
//               selectedLeadDetails.fname ||
//               "N/A"}
//           </div>
//         </div>
//         <div className="flex">
//           <div className="text-gray-600 font-medium text-xs min-w-[120px]">
//             Mobile:
//           </div>
//           <div className="text-gray-800 font-semibold text-xs">
//             {selectedLeadDetails.mobile || "N/A"}
//           </div>
//         </div>
//       </div>

//       {/* Rest of the profile details... */}
//       {/* You can further split this if needed */}
//     </div>
//   );

//   const renderReassignTab = () => (
//     <div className="space-y-4 text-xs">
//       <div className="mb-4">
//         <h4 className="font-medium text-gray-600 mb-2 text-xs">User</h4>
//         <div className="relative w-full" ref={popupDropdownRef}>
//           <div
//             className="border border-gray-300 rounded px-3 py-2 bg-white flex justify-between items-center hover:border-[#222fb9] cursor-pointer transition-colors text-xs"
//             onClick={() => setDropdownOpenPopup(!dropdownOpenPopup)}
//           >
//             <span
//               className={
//                 selectedUserPopup
//                   ? "text-gray-900 text-xs"
//                   : "text-gray-500 text-xs"
//               }
//             >
//               {selectedUserPopup?.name || "Select User"}
//             </span>
//             <i className="fas fa-chevron-down text-gray-500 text-xs"></i>
//           </div>

//           {dropdownOpenPopup && (
//             <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded mt-1 shadow-lg z-50 text-xs">
//               <input
//                 type="text"
//                 className="w-full border-b border-gray-300 px-3 py-2 focus:outline-none text-xs"
//                 placeholder="Search user..."
//                 value={searchUserTermPopup}
//                 onChange={(e) => {
//                   setSearchUserTermPopup(e.target.value);
//                   // filter function would be passed from parent
//                 }}
//                 onClick={(e) => e.stopPropagation()}
//               />
//               <ul className="max-h-60 overflow-y-auto text-xs">
//                 {filteredUsersPopup.length > 0 ? (
//                   filteredUsersPopup.map((user, index) => (
//                     <li
//                       key={index}
//                       className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-xs"
//                       onClick={() => {
//                         setSelectedUserPopup(user);
//                         setDropdownOpenPopup(false);
//                       }}
//                     >
//                       {user.name}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="px-3 py-2 text-gray-500 text-center text-xs">
//                     No user found
//                   </li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           className="bg-[#222fb9] text-white px-6 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs"
//           onClick={singleReassignSubmit}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//       onClick={() => {
//         setShowDetailsModal(false);
//         setIsOpen(false);
//       }}
//     >
//       <div
//         className="bg-white p-6 rounded-xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg text-xs"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
//           onClick={() => {
//             setShowDetailsModal(false);
//             setIsOpen(false);
//           }}
//         >
//           &times;
//         </button>

//         {(!selectedLeadDetails || isLoadingActivities) && (
//           <div className="flex justify-center items-center py-12 flex-col">
//             <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-3"></div>
//             <span className="text-gray-600 mt-2">Loading lead details...</span>

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs max-w-md">
//                 {/* Error display */}
//               </div>
//             )}
//           </div>
//         )}

//         {selectedLeadDetails && !isLoadingActivities && (
//           <>
//             <h2 className="text-2xl font-bold mb-6 text-gray-800 text-xs">
//               Enquiry Details
//             </h2>

//             <div className="border-b border-gray-200 mb-6 text-xs">
//               <nav className="flex space-x-8 text-xs">
//                 {[
//                   "profile",
//                   "upcoming",
//                   "completed",
//                   "overdue",
//                   "reassign",
//                 ].map((tab) => (
//                   <button
//                     key={tab}
//                     className={`py-2 px-1 border-b-2 font-medium text-xs capitalize ${
//                       activeTab === tab
//                         ? "border-[#222fb9] text-[#222fb9]"
//                         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                     }`}
//                     onClick={() => setActiveTab(tab)}
//                   >
//                     {tab === "reassign" ? "Reassign Enquiries" : tab}
//                   </button>
//                 ))}
//               </nav>
//             </div>

//             <div className="min-h-[400px] text-xs">
//               {activeTab === "profile" && renderLeadProfile()}
//               {activeTab === "upcoming" && (
//                 <ActivitySection
//                   activities={leadActivities.upcoming}
//                   type="upcoming"
//                 />
//               )}
//               {activeTab === "completed" && (
//                 <ActivitySection
//                   activities={leadActivities.completed}
//                   type="completed"
//                 />
//               )}
//               {activeTab === "overdue" && (
//                 <ActivitySection
//                   activities={leadActivities.overdue}
//                   type="overdue"
//                 />
//               )}
//               {activeTab === "reassign" && renderReassignTab()}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
import React from "react";
import { ActivitySection } from "./ActivitySection";

export const LeadDetailsModal = ({
  showDetailsModal,
  setShowDetailsModal,
  selectedLeadDetails,
  isLoadingActivities,
  error,
  handleViewDetails,
  lead,
  getStatusColor,
  formatDateOnly,
  leadActivities,
  activeTab,
  setActiveTab,
  allUser,
  selectedUserPopup,
  setSelectedUserPopup,
  searchUserTermPopup,
  setSearchUserTermPopup,
  filteredUsersPopup,
  setFilteredUsersPopup,
  dropdownOpenPopup,
  setDropdownOpenPopup,
  popupDropdownRef,
  singleReassignSubmit,
  filterUsersPopup, // Make sure this is passed from parent
}) => {
  // ✅ REMOVE the local state and use the prop directly
  if (!showDetailsModal) return null;

  const renderLeadProfile = () => (
    <div className="space-y-4 text-xs">{/* ... rest of your code ... */}</div>
  );

  const renderReassignTab = () => (
    <div className="space-y-4 text-xs">
      <div className="mb-4">
        <h4 className="font-medium text-gray-600 mb-2 text-xs">User</h4>
        <div className="relative w-full" ref={popupDropdownRef}>
          <div
            className="border border-gray-300 rounded px-3 py-2 bg-white flex justify-between items-center hover:border-[#222fb9] cursor-pointer transition-colors text-xs"
            onClick={() => setDropdownOpenPopup(!dropdownOpenPopup)}
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
                  // ✅ Make sure filterUsersPopup is passed from parent
                  if (filterUsersPopup) filterUsersPopup();
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <ul className="max-h-60 overflow-y-auto text-xs">
                {filteredUsersPopup.length > 0 ? (
                  filteredUsersPopup.map((user, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-xs"
                      onClick={() => {
                        setSelectedUserPopup(user);
                        setDropdownOpenPopup(false);
                      }}
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

      <div className="flex justify-end">
        <button
          className="bg-[#222fb9] text-white px-6 py-2 rounded hover:bg-[#1b26a0] transition-colors text-xs"
          onClick={singleReassignSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => {
        setShowDetailsModal(false);
      }}
    >
      <div
        className="bg-white p-6 rounded-xl relative w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => {
            setShowDetailsModal(false);
          }}
        >
          &times;
        </button>

        {(!selectedLeadDetails || isLoadingActivities) && (
          <div className="flex justify-center items-center py-12 flex-col">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin mr-3"></div>
            <span className="text-gray-600 mt-2">Loading lead details...</span>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-xs max-w-md">
                {/* Error display - you can add back the error UI if needed */}
              </div>
            )}
          </div>
        )}

        {selectedLeadDetails && !isLoadingActivities && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-xs">
              Enquiry Details
            </h2>

            <div className="border-b border-gray-200 mb-6 text-xs">
              <nav className="flex space-x-8 text-xs">
                {[
                  "profile",
                  "upcoming",
                  "completed",
                  "overdue",
                  "reassign",
                ].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-1 border-b-2 font-medium text-xs capitalize ${
                      activeTab === tab
                        ? "border-[#222fb9] text-[#222fb9]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "reassign" ? "Reassign Enquiries" : tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="min-h-[400px] text-xs">
              {activeTab === "profile" && renderLeadProfile()}
              {activeTab === "upcoming" && (
                <ActivitySection
                  activities={leadActivities.upcoming}
                  type="upcoming"
                />
              )}
              {activeTab === "completed" && (
                <ActivitySection
                  activities={leadActivities.completed}
                  type="completed"
                />
              )}
              {activeTab === "overdue" && (
                <ActivitySection
                  activities={leadActivities.overdue}
                  type="overdue"
                />
              )}
              {activeTab === "reassign" && renderReassignTab()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
