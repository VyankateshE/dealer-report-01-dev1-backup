// import React, { useState, useEffect } from "react";

// const DealerFilter = ({
//   filteredDealers,
//   selectedDealers,
//   setSelectedDealers,
//   dealerSearch,
//   setDealerSearch,
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".dropdown-container")) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   const isDealerSelected = (dealer) => {
//     return selectedDealers.includes(dealer.dealer_id);
//   };

//   const toggleDealerSelection = (dealer) => {
//     const dealerId = dealer.dealer_id;
//     setSelectedDealers((prev) =>
//       prev.includes(dealerId)
//         ? prev.filter((id) => id !== dealerId)
//         : [...prev, dealerId]
//     );
//   };

//   const areAllSelected = () => {
//     return (
//       filteredDealers.length > 0 &&
//       filteredDealers.every((dealer) => isDealerSelected(dealer))
//     );
//   };

//   const toggleSelectAll = (event) => {
//     const isChecked = event.target.checked;
//     setSelectedDealers(
//       isChecked ? filteredDealers.map((d) => d.dealer_id) : []
//     );
//   };

//   const clearSelection = () => {
//     setSelectedDealers([]);
//   };

//   // Determine button text based on state
//   const getButtonText = () => {
//     if (selectedDealers.length > 0) {
//       return `Dealers (${selectedDealers.length})`;
//     } else if (dealerSearch.trim() !== "") {
//       return `Search: "${dealerSearch}"`;
//     } else {
//       return "Select Dealers";
//     }
//   };

//   return (
//     <div className="relative dropdown-container">
//       <button
//         className="bg-white border border-gray-300 rounded px-3 py-1 text-xs min-w-[160px] text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <span className="truncate font-medium">{getButtonText()}</span>
//         <svg
//           className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {dropdownOpen && (
//         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] max-h-52 overflow-hidden">
//           {/* Search Input */}
//           <div className="p-2 border-b border-gray-200">
//             <input
//               type="text"
//               className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
//               placeholder="Search dealers..."
//               value={dealerSearch}
//               onChange={(e) => setDealerSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* Select All & Clear */}
//           <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200 bg-gray-50">
//             <label className="flex items-center text-xs cursor-pointer font-medium">
//               <input
//                 type="checkbox"
//                 className="mr-1 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9]"
//                 checked={areAllSelected()}
//                 onChange={toggleSelectAll}
//               />
//               Select All
//             </label>
//             <button
//               className="text-[10px] text-red-600 hover:text-red-800 bg-transparent border-none cursor-pointer font-medium"
//               onClick={clearSelection}
//             >
//               Clear
//             </button>
//           </div>

//           {/* Dealers List */}
//           <div className="max-h-32 overflow-y-auto">
//             {filteredDealers.length > 0 ? (
//               filteredDealers.map((dealer) => (
//                 <div
//                   key={dealer.dealer_id}
//                   className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <input
//                     type="checkbox"
//                     className="mr-2 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9]"
//                     checked={isDealerSelected(dealer)}
//                     onChange={() => toggleDealerSelection(dealer)}
//                   />
//                   <span
//                     className="text-xs flex-1 truncate font-medium"
//                     onClick={() => toggleDealerSelection(dealer)}
//                   >
//                     {dealer.dealer_name}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="px-2 py-3 text-xs text-gray-500 text-center font-medium">
//                 No dealers found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealerFilter;
// import React, { useState, useEffect } from "react";

// const DealerFilter = ({
//   filteredDealers,
//   selectedDealers, // Actual selected dealers (after apply)
//   setSelectedDealers,
//   dealerSearch,
//   setDealerSearch,
//   onApplyDealers, // Optional callback when apply is clicked
//   tempSelectedDealers, // Temporary selection in dropdown
//   setTempSelectedDealers, // For updating temporary selection
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [localTempSelected, setLocalTempSelected] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // ✅ Initialize temporary selection when dropdown opens
//   useEffect(() => {
//     if (dropdownOpen && !isInitialized) {
//       console.log(
//         "📋 Initializing dropdown with selected dealers:",
//         selectedDealers
//       );

//       // Initialize with selected dealers
//       setLocalTempSelected([...selectedDealers]);
//       setIsInitialized(true);
//     }

//     // Reset initialized when dropdown closes
//     if (!dropdownOpen) {
//       setIsInitialized(false);
//     }
//   }, [dropdownOpen, isInitialized, selectedDealers]);

//   // ✅ Handle external changes to tempSelectedDealers (if provided by parent)
//   useEffect(() => {
//     if (tempSelectedDealers && dropdownOpen) {
//       setLocalTempSelected([...tempSelectedDealers]);
//     }
//   }, [tempSelectedDealers, dropdownOpen]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".dropdown-container")) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Check if a dealer is selected in temporary selection
//   const isDealerTempSelected = (dealer) => {
//     return localTempSelected.includes(dealer.dealer_id);
//   };

//   // ✅ Toggle individual dealer selection
//   const toggleDealerSelection = (dealer) => {
//     const dealerId = dealer.dealer_id;

//     setLocalTempSelected((prev) => {
//       if (prev.includes(dealerId)) {
//         // Remove dealer if already selected
//         return prev.filter((id) => id !== dealerId);
//       } else {
//         // Add dealer if not selected
//         return [...prev, dealerId];
//       }
//     });
//   };

//   // Check if all filtered dealers are selected in temporary selection
//   const areAllTempSelected = () => {
//     if (filteredDealers.length === 0) return false;
//     return filteredDealers.every((dealer) =>
//       localTempSelected.includes(dealer.dealer_id)
//     );
//   };

//   // Check if some (but not all) filtered dealers are selected
//   const areSomeTempSelected = () => {
//     if (filteredDealers.length === 0) return false;
//     const selectedCount = filteredDealers.filter((dealer) =>
//       localTempSelected.includes(dealer.dealer_id)
//     ).length;
//     return selectedCount > 0 && selectedCount < filteredDealers.length;
//   };

//   // ✅ Toggle select all for filtered dealers
//   const toggleSelectAll = () => {
//     if (areAllTempSelected()) {
//       // If all are selected, deselect all filtered dealers
//       const remainingSelected = localTempSelected.filter(
//         (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
//       );
//       setLocalTempSelected(remainingSelected);
//     } else {
//       // If not all are selected, select all filtered dealers
//       const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
//       const newSelection = [
//         ...new Set([...localTempSelected, ...allFilteredDealerIds]),
//       ];
//       setLocalTempSelected(newSelection);
//     }
//   };

//   // Clear all selection in temporary selection
//   const clearTempSelection = () => {
//     setLocalTempSelected([]);
//   };

//   // ✅ Handle apply button
//   const handleApply = () => {
//     console.log("🚀 Applying dealer selection:", localTempSelected);

//     // Update the parent's selected dealers
//     setSelectedDealers([...localTempSelected]);

//     // Call the optional callback if provided
//     if (onApplyDealers) {
//       onApplyDealers(localTempSelected);
//     }

//     // Update temporary selection if provided by parent
//     if (setTempSelectedDealers) {
//       setTempSelectedDealers([...localTempSelected]);
//     }

//     setDropdownOpen(false);
//   };

//   // ✅ Handle cancel button
//   const handleCancel = () => {
//     console.log(
//       "❌ Canceling, reverting to original selection:",
//       selectedDealers
//     );

//     // Reset local temp selection to actual selected dealers
//     setLocalTempSelected([...selectedDealers]);

//     // Reset parent's temp selection if provided
//     if (setTempSelectedDealers) {
//       setTempSelectedDealers([...selectedDealers]);
//     }

//     setDropdownOpen(false);
//   };

//   // Get button text for main button
//   const getButtonText = () => {
//     if (selectedDealers.length > 0) {
//       return `Dealers (${selectedDealers.length})`;
//     } else if (dealerSearch.trim() !== "") {
//       return `Search: "${dealerSearch}"`;
//     } else {
//       return "Select Dealers";
//     }
//   };

//   // Get selected count for current filtered view in temporary selection
//   const getTempSelectedCount = () => {
//     return filteredDealers.filter((dealer) =>
//       localTempSelected.includes(dealer.dealer_id)
//     ).length;
//   };

//   return (
//     <div className="relative dropdown-container">
//       <button
//         className="bg-white border border-gray-300 rounded px-3 py-1 text-xs min-w-[160px] text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <span className="truncate font-medium">{getButtonText()}</span>
//         <svg
//           className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {dropdownOpen && (
//         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] max-h-64 overflow-hidden">
//           {/* Search Input */}
//           <div className="p-2 border-b border-gray-200">
//             <input
//               type="text"
//               className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
//               placeholder="Search dealers..."
//               value={dealerSearch}
//               onChange={(e) => setDealerSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* Select All & Clear */}
//           <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200 bg-gray-50">
//             {/* LEFT SIDE: SELECT ALL */}
//             <div className="flex items-center text-xs font-medium select-none">
//               <input
//                 type="checkbox"
//                 className="mr-1 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9] cursor-pointer"
//                 checked={areAllTempSelected()}
//                 ref={(input) => {
//                   if (input) input.indeterminate = areSomeTempSelected();
//                 }}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               />
//               <span
//                 className="ml-1 cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               >
//                 {areAllTempSelected() ? "Deselect All" : "Select All"}
//               </span>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex gap-2 items-center">
//               <span className="text-xs text-gray-600 font-medium">
//                 {getTempSelectedCount()}/{filteredDealers.length} selected
//               </span>

//               <button
//                 className="text-[10px] text-red-600 hover:text-red-800 cursor-pointer font-medium"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   clearTempSelection();
//                 }}
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           {/* Dealers List */}
//           <div className="max-h-32 overflow-y-auto">
//             {filteredDealers.length > 0 ? (
//               filteredDealers.map((dealer) => (
//                 <div
//                   key={dealer.dealer_id}
//                   className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   onClick={() => toggleDealerSelection(dealer)}
//                 >
//                   <input
//                     type="checkbox"
//                     className="mr-2 rounded border-gray-300 text-[#222fb9] cursor-pointer focus:ring-[#222fb9]"
//                     checked={isDealerTempSelected(dealer)}
//                     onChange={() => toggleDealerSelection(dealer)}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <span className="text-xs flex-1 truncate font-medium">
//                     {dealer.dealer_name}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="px-2 py-3 text-xs text-gray-500 text-center font-medium">
//                 No dealers found
//               </div>
//             )}
//           </div>

//           {/* ✅ ADDED: Apply & Cancel Buttons */}
//           <div className="flex justify-between p-2 border-t border-gray-200 bg-gray-50">
//             <button
//               className="px-3 py-1.5 text-xs bg-gray-200 cursor-pointer text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
//               onClick={handleCancel}
//               type="button"
//             >
//               Cancel
//             </button>
//             <div className="flex gap-2 items-center">
//               <span className="text-xs text-gray-600">
//                 {localTempSelected.length} selected
//               </span>
//               <button
//                 className="px-3 py-1.5 text-xs bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors font-medium"
//                 onClick={handleApply}
//                 type="button"
//                 disabled={localTempSelected.length === 0}
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealerFilter;

// import React, { useState, useEffect } from "react";

// const DealerFilter = ({
//   filteredDealers,
//   selectedDealers,
//   setSelectedDealers,
//   dealerSearch,
//   setDealerSearch,
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [tempSelectedDealers, setTempSelectedDealers] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // ✅ Initialize temporary selection when dropdown opens
//   useEffect(() => {
//     if (dropdownOpen && !isInitialized) {
//       console.log(
//         "📋 Initializing dropdown with selected dealers:",
//         selectedDealers
//       );
//       setTempSelectedDealers([...selectedDealers]);
//       setIsInitialized(true);
//     }

//     if (!dropdownOpen) {
//       setIsInitialized(false);
//     }
//   }, [dropdownOpen, isInitialized, selectedDealers]);

//   // Check if a dealer is selected in temporary selection
//   const isDealerTempSelected = (dealer) => {
//     return tempSelectedDealers.includes(dealer.dealer_id);
//   };

//   // ✅ Toggle individual dealer selection
//   const toggleDealerSelection = (dealer) => {
//     const dealerId = dealer.dealer_id;
//     setTempSelectedDealers((prev) => {
//       if (prev.includes(dealerId)) {
//         return prev.filter((id) => id !== dealerId);
//       } else {
//         return [...prev, dealerId];
//       }
//     });
//   };

//   // Check if all filtered dealers are selected in temporary selection
//   const areAllTempSelected = () => {
//     if (filteredDealers.length === 0) return false;
//     return filteredDealers.every((dealer) =>
//       tempSelectedDealers.includes(dealer.dealer_id)
//     );
//   };

//   // Check if some (but not all) filtered dealers are selected
//   const areSomeTempSelected = () => {
//     if (filteredDealers.length === 0) return false;
//     const selectedCount = filteredDealers.filter((dealer) =>
//       tempSelectedDealers.includes(dealer.dealer_id)
//     ).length;
//     return selectedCount > 0 && selectedCount < filteredDealers.length;
//   };

//   // ✅ Toggle select all for filtered dealers
//   const toggleSelectAll = () => {
//     if (areAllTempSelected()) {
//       // If all are selected, deselect all filtered dealers
//       const remainingSelected = tempSelectedDealers.filter(
//         (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
//       );
//       setTempSelectedDealers(remainingSelected);
//     } else {
//       // If not all are selected, select all filtered dealers
//       const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
//       const newSelection = [
//         ...new Set([...tempSelectedDealers, ...allFilteredDealerIds]),
//       ];
//       setTempSelectedDealers(newSelection);
//     }
//   };

//   // Clear all selection in temporary selection
//   const clearTempSelection = () => {
//     setTempSelectedDealers([]);
//   };

//   // ✅ Handle apply button
//   const handleApply = () => {
//     console.log("🚀 Applying dealer selection:", tempSelectedDealers);

//     // Update the parent's selected dealers
//     setSelectedDealers([...tempSelectedDealers]);
//     setDropdownOpen(false);

//     // Clear search
//     setDealerSearch("");
//   };

//   // ✅ Handle cancel button
//   const handleCancel = () => {
//     console.log(
//       "❌ Canceling, reverting to original selection:",
//       selectedDealers
//     );

//     // Reset to original selection
//     setTempSelectedDealers([...selectedDealers]);
//     setDropdownOpen(false);
//   };

//   // Get button text for main button
//   const getButtonText = () => {
//     if (selectedDealers.length > 0) {
//       return `Dealers (${selectedDealers.length})`;
//     } else if (dealerSearch.trim() !== "") {
//       return `Search: "${dealerSearch}"`;
//     } else {
//       return "Select Dealers";
//     }
//   };

//   // Get selected count for current filtered view in temporary selection
//   const getTempSelectedCount = () => {
//     return filteredDealers.filter((dealer) =>
//       tempSelectedDealers.includes(dealer.dealer_id)
//     ).length;
//   };

//   return (
//     <div className="relative dropdown-container">
//       <button
//         className="bg-white border border-gray-300 rounded px-3 py-1 text-xs min-w-[160px] text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <span className="truncate font-medium">{getButtonText()}</span>
//         <svg
//           className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {dropdownOpen && (
//         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] max-h-64 overflow-hidden">
//           {/* Search Input */}
//           <div className="p-2 border-b border-gray-200">
//             <input
//               type="text"
//               className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
//               placeholder="Search dealers..."
//               value={dealerSearch}
//               onChange={(e) => setDealerSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* Select All & Clear */}
//           <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200 bg-gray-50">
//             {/* LEFT SIDE: SELECT ALL */}
//             <div className="flex items-center text-xs font-medium select-none">
//               <input
//                 type="checkbox"
//                 className="mr-1 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9] cursor-pointer"
//                 checked={areAllTempSelected()}
//                 ref={(input) => {
//                   if (input) input.indeterminate = areSomeTempSelected();
//                 }}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               />
//               <span
//                 className="ml-1 cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               >
//                 {areAllTempSelected() ? "Deselect All" : "Select All"}
//               </span>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex gap-2 items-center">
//               <span className="text-xs text-gray-600 font-medium">
//                 {getTempSelectedCount()}/{filteredDealers.length} selected
//               </span>

//               <button
//                 className="text-[10px] text-red-600 hover:text-red-800 cursor-pointer font-medium"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   clearTempSelection();
//                 }}
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           {/* Dealers List */}
//           <div className="max-h-32 overflow-y-auto">
//             {filteredDealers.length > 0 ? (
//               filteredDealers.map((dealer) => (
//                 <div
//                   key={dealer.dealer_id}
//                   className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   onClick={() => toggleDealerSelection(dealer)}
//                 >
//                   <input
//                     type="checkbox"
//                     className="mr-2 rounded border-gray-300 text-[#222fb9] cursor-pointer focus:ring-[#222fb9]"
//                     checked={isDealerTempSelected(dealer)}
//                     onChange={() => toggleDealerSelection(dealer)}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <span className="text-xs flex-1 truncate font-medium">
//                     {dealer.dealer_name}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="px-2 py-3 text-xs text-gray-500 text-center font-medium">
//                 No dealers found
//               </div>
//             )}
//           </div>

//           {/* ✅ Apply & Cancel Buttons */}
//           <div className="flex justify-between p-2 border-t border-gray-200 bg-gray-50">
//             <button
//               className="px-3 py-1.5 text-xs bg-gray-200 cursor-pointer text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
//               onClick={handleCancel}
//               type="button"
//             >
//               Cancel
//             </button>
//             <div className="flex gap-2 items-center">
//               <span className="text-xs text-gray-600">
//                 {tempSelectedDealers.length} selected
//               </span>
//               <button
//                 className="px-3 py-1.5 text-xs bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors font-medium"
//                 onClick={handleApply}
//                 type="button"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealerFilter;

// import React, { useState, useEffect } from "react";

// const DealerFilter = ({
//   filteredDealers,
//   selectedDealers,
//   setSelectedDealers,
//   dealerSearch,
//   setDealerSearch,
//   showApplyCancelButtons = true, // ✅ Add this prop (default: true for GM)
// }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [tempSelectedDealers, setTempSelectedDealers] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);

//   // ✅ Initialize temporary selection when dropdown opens
//   useEffect(() => {
//     if (dropdownOpen && !isInitialized) {
//       // console.log(
//       //   "📋 Initializing dropdown with selected dealers:",
//       //   selectedDealers
//       // );

//       // Only initialize temp selection if we have apply/cancel buttons
//       if (showApplyCancelButtons) {
//         setTempSelectedDealers([...selectedDealers]);
//       }

//       setIsInitialized(true);
//     }

//     if (!dropdownOpen) {
//       setIsInitialized(false);
//     }
//   }, [dropdownOpen, isInitialized, selectedDealers, showApplyCancelButtons]);

//   // Check if a dealer is selected
//   const isDealerSelected = (dealer) => {
//     // If showing buttons, use temp selection; otherwise use real selection
//     if (showApplyCancelButtons) {
//       return tempSelectedDealers.includes(dealer.dealer_id);
//     } else {
//       return selectedDealers.includes(dealer.dealer_id);
//     }
//   };

//   // ✅ Toggle individual dealer selection
//   const toggleDealerSelection = (dealer) => {
//     const dealerId = dealer.dealer_id;

//     if (showApplyCancelButtons) {
//       // Use temp selection with apply/cancel buttons
//       setTempSelectedDealers((prev) => {
//         if (prev.includes(dealerId)) {
//           return prev.filter((id) => id !== dealerId);
//         } else {
//           return [...prev, dealerId];
//         }
//       });
//     } else {
//       // Immediately update parent state for CEO (no apply/cancel)
//       setSelectedDealers((prev) => {
//         if (prev.includes(dealerId)) {
//           return prev.filter((id) => id !== dealerId);
//         } else {
//           return [...prev, dealerId];
//         }
//       });
//     }
//   };

//   // Check if all filtered dealers are selected
//   const areAllSelected = () => {
//     if (filteredDealers.length === 0) return false;

//     const currentSelection = showApplyCancelButtons
//       ? tempSelectedDealers
//       : selectedDealers;

//     return filteredDealers.every((dealer) =>
//       currentSelection.includes(dealer.dealer_id)
//     );
//   };

//   // Check if some (but not all) filtered dealers are selected
//   const areSomeSelected = () => {
//     if (filteredDealers.length === 0) return false;

//     const currentSelection = showApplyCancelButtons
//       ? tempSelectedDealers
//       : selectedDealers;

//     const selectedCount = filteredDealers.filter((dealer) =>
//       currentSelection.includes(dealer.dealer_id)
//     ).length;

//     return selectedCount > 0 && selectedCount < filteredDealers.length;
//   };

//   // ✅ Toggle select all for filtered dealers
//   const toggleSelectAll = () => {
//     if (showApplyCancelButtons) {
//       // For GM with apply/cancel buttons
//       if (areAllSelected()) {
//         const remainingSelected = tempSelectedDealers.filter(
//           (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
//         );
//         setTempSelectedDealers(remainingSelected);
//       } else {
//         const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
//         const newSelection = [
//           ...new Set([...tempSelectedDealers, ...allFilteredDealerIds]),
//         ];
//         setTempSelectedDealers(newSelection);
//       }
//     } else {
//       // For CEO - immediate update
//       if (areAllSelected()) {
//         // Deselect all filtered dealers
//         const remainingSelected = selectedDealers.filter(
//           (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
//         );
//         setSelectedDealers(remainingSelected);
//       } else {
//         // Select all filtered dealers
//         const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
//         const newSelection = [
//           ...new Set([...selectedDealers, ...allFilteredDealerIds]),
//         ];
//         setSelectedDealers(newSelection);
//       }
//     }
//   };

//   // Clear selection
//   const clearSelection = () => {
//     if (showApplyCancelButtons) {
//       setTempSelectedDealers([]);
//     } else {
//       setSelectedDealers([]);
//     }
//   };

//   // ✅ Handle apply button (only for GM)
//   const handleApply = () => {
//     // console.log("🚀 Applying dealer selection:", tempSelectedDealers);

//     // Update the parent's selected dealers
//     setSelectedDealers([...tempSelectedDealers]);
//     setDropdownOpen(false);

//     // Clear search
//     setDealerSearch("");
//   };

//   // ✅ Handle cancel button (only for GM)
//   const handleCancel = () => {
//     // console.log(
//     //   "❌ Canceling, reverting to original selection:",
//     //   selectedDealers
//     // );

//     // Reset to original selection
//     setTempSelectedDealers([...selectedDealers]);
//     setDropdownOpen(false);
//   };

//   // Get button text for main button
//   const getButtonText = () => {
//     if (selectedDealers.length > 0) {
//       return `Dealers (${selectedDealers.length})`;
//     } else if (dealerSearch.trim() !== "") {
//       return `Search: "${dealerSearch}"`;
//     } else {
//       return "Select Dealers";
//     }
//   };

//   // Get selected count for current filtered view
//   const getSelectedCount = () => {
//     const currentSelection = showApplyCancelButtons
//       ? tempSelectedDealers
//       : selectedDealers;

//     return filteredDealers.filter((dealer) =>
//       currentSelection.includes(dealer.dealer_id)
//     ).length;
//   };

//   return (
//     <div className="relative dropdown-container">
//       <button
//         className="bg-white border border-gray-300 rounded px-3 py-1 text-xs min-w-[160px] text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
//         onClick={() => setDropdownOpen(!dropdownOpen)}
//       >
//         <span className="truncate font-medium">{getButtonText()}</span>
//         <svg
//           className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M19 9l-7 7-7-7"
//           />
//         </svg>
//       </button>

//       {dropdownOpen && (
//         <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] max-h-64 overflow-hidden">
//           {/* Search Input */}
//           <div className="p-2 border-b border-gray-200">
//             <input
//               type="text"
//               className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
//               placeholder="Search dealers..."
//               value={dealerSearch}
//               onChange={(e) => setDealerSearch(e.target.value)}
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* Select All & Clear */}
//           <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200 bg-gray-50">
//             {/* LEFT SIDE: SELECT ALL */}
//             <div className="flex items-center text-xs font-medium select-none">
//               <input
//                 type="checkbox"
//                 className="mr-1 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9] cursor-pointer"
//                 checked={areAllSelected()}
//                 ref={(input) => {
//                   if (input) input.indeterminate = areSomeSelected();
//                 }}
//                 onChange={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               />
//               <span
//                 className="ml-1 cursor-pointer"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSelectAll();
//                 }}
//               >
//                 {areAllSelected() ? "Deselect All" : "Select All"}
//               </span>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="flex gap-2 items-center">
//               <span className="text-xs text-gray-600 font-medium">
//                 {getSelectedCount()}/{filteredDealers.length} selected
//               </span>

//               <button
//                 className="text-[10px] text-red-600 hover:text-red-800 cursor-pointer font-medium"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   clearSelection();
//                 }}
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>

//           {/* Dealers List */}
//           <div className="max-h-32 overflow-y-auto">
//             {filteredDealers.length > 0 ? (
//               filteredDealers.map((dealer) => (
//                 <div
//                   key={dealer.dealer_id}
//                   className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   onClick={() => toggleDealerSelection(dealer)}
//                 >
//                   <input
//                     type="checkbox"
//                     className="mr-2 rounded border-gray-300 text-[#222fb9] cursor-pointer focus:ring-[#222fb9]"
//                     checked={isDealerSelected(dealer)}
//                     onChange={() => toggleDealerSelection(dealer)}
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <span className="text-xs flex-1 truncate font-medium">
//                     {dealer.dealer_name}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="px-2 py-3 text-xs text-gray-500 text-center font-medium">
//                 No dealers found
//               </div>
//             )}
//           </div>

//           {/* ✅ Conditionally show Apply & Cancel Buttons */}
//           {showApplyCancelButtons && (
//             <div className="flex justify-between p-2 border-t border-gray-200 bg-gray-50">
//               <button
//                 className="px-3 py-1.5 text-xs bg-gray-200 cursor-pointer text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
//                 onClick={handleCancel}
//                 type="button"
//               >
//                 Cancel
//               </button>
//               <div className="flex gap-2 items-center">
//                 <span className="text-xs text-gray-600">
//                   {tempSelectedDealers.length} selected
//                 </span>
//                 <button
//                   className="px-3 py-1.5 text-xs bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors font-medium"
//                   onClick={handleApply}
//                   type="button"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DealerFilter;
import React, { useState, useEffect, useRef } from "react";

const DealerFilter = ({
  filteredDealers,
  selectedDealers,
  setSelectedDealers,
  dealerSearch,
  setDealerSearch,
  showApplyCancelButtons = true,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempSelectedDealers, setTempSelectedDealers] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Add ref for dropdown container
  const dropdownRef = useRef(null);

  // ✅ Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        if (showApplyCancelButtons) {
          // For GM: Revert to original selection when clicking outside
          setTempSelectedDealers([...selectedDealers]);
        }
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, selectedDealers, showApplyCancelButtons]);

  // ✅ Initialize temporary selection when dropdown opens
  useEffect(() => {
    if (dropdownOpen && !isInitialized) {
      if (showApplyCancelButtons) {
        setTempSelectedDealers([...selectedDealers]);
      }
      setIsInitialized(true);
    }

    if (!dropdownOpen) {
      setIsInitialized(false);
    }
  }, [dropdownOpen, isInitialized, selectedDealers, showApplyCancelButtons]);

  // Check if a dealer is selected
  const isDealerSelected = (dealer) => {
    if (showApplyCancelButtons) {
      return tempSelectedDealers.includes(dealer.dealer_id);
    } else {
      return selectedDealers.includes(dealer.dealer_id);
    }
  };

  // ✅ Toggle individual dealer selection
  const toggleDealerSelection = (dealer) => {
    const dealerId = dealer.dealer_id;

    if (showApplyCancelButtons) {
      setTempSelectedDealers((prev) => {
        if (prev.includes(dealerId)) {
          return prev.filter((id) => id !== dealerId);
        } else {
          return [...prev, dealerId];
        }
      });
    } else {
      setSelectedDealers((prev) => {
        if (prev.includes(dealerId)) {
          return prev.filter((id) => id !== dealerId);
        } else {
          return [...prev, dealerId];
        }
      });
    }
  };

  // Check if all filtered dealers are selected
  const areAllSelected = () => {
    if (filteredDealers.length === 0) return false;

    const currentSelection = showApplyCancelButtons
      ? tempSelectedDealers
      : selectedDealers;

    return filteredDealers.every((dealer) =>
      currentSelection.includes(dealer.dealer_id)
    );
  };

  // Check if some (but not all) filtered dealers are selected
  const areSomeSelected = () => {
    if (filteredDealers.length === 0) return false;

    const currentSelection = showApplyCancelButtons
      ? tempSelectedDealers
      : selectedDealers;

    const selectedCount = filteredDealers.filter((dealer) =>
      currentSelection.includes(dealer.dealer_id)
    ).length;

    return selectedCount > 0 && selectedCount < filteredDealers.length;
  };

  // ✅ Toggle select all for filtered dealers
  const toggleSelectAll = () => {
    if (showApplyCancelButtons) {
      if (areAllSelected()) {
        const remainingSelected = tempSelectedDealers.filter(
          (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
        );
        setTempSelectedDealers(remainingSelected);
      } else {
        const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
        const newSelection = [
          ...new Set([...tempSelectedDealers, ...allFilteredDealerIds]),
        ];
        setTempSelectedDealers(newSelection);
      }
    } else {
      if (areAllSelected()) {
        const remainingSelected = selectedDealers.filter(
          (id) => !filteredDealers.some((dealer) => dealer.dealer_id === id)
        );
        setSelectedDealers(remainingSelected);
      } else {
        const allFilteredDealerIds = filteredDealers.map((d) => d.dealer_id);
        const newSelection = [
          ...new Set([...selectedDealers, ...allFilteredDealerIds]),
        ];
        setSelectedDealers(newSelection);
      }
    }
  };

  // Clear selection
  const clearSelection = () => {
    if (showApplyCancelButtons) {
      setTempSelectedDealers([]);
    } else {
      setSelectedDealers([]);
    }
  };

  // ✅ Handle apply button (only for GM)
  const handleApply = () => {
    setSelectedDealers([...tempSelectedDealers]);
    setDropdownOpen(false);
    setDealerSearch("");
  };

  // ✅ Handle cancel button (only for GM)
  const handleCancel = () => {
    setTempSelectedDealers([...selectedDealers]);
    setDropdownOpen(false);
  };

  // Get button text for main button
  const getButtonText = () => {
    if (selectedDealers.length > 0) {
      return `Dealers (${selectedDealers.length})`;
    } else if (dealerSearch.trim() !== "") {
      return `Search: "${dealerSearch}"`;
    } else {
      return "Select Dealers";
    }
  };

  // Get selected count for current filtered view
  const getSelectedCount = () => {
    const currentSelection = showApplyCancelButtons
      ? tempSelectedDealers
      : selectedDealers;

    return filteredDealers.filter((dealer) =>
      currentSelection.includes(dealer.dealer_id)
    ).length;
  };

  return (
    // ✅ Attach the ref here
    <div className="relative dropdown-container" ref={dropdownRef}>
      <button
        className="bg-white border border-gray-300 rounded px-3 py-1 text-xs min-w-[160px] text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="truncate font-medium">{getButtonText()}</span>
        <svg
          className="w-3 h-3 text-gray-500 flex-shrink-0 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[240px] max-h-64 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
              placeholder="Search dealers..."
              value={dealerSearch}
              onChange={(e) => setDealerSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Select All & Clear */}
          <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200 bg-gray-50">
            {/* LEFT SIDE: SELECT ALL */}
            <div className="flex items-center text-xs font-medium select-none">
              <input
                type="checkbox"
                className="mr-1 rounded border-gray-300 text-[#222fb9] focus:ring-[#222fb9] cursor-pointer"
                checked={areAllSelected()}
                ref={(input) => {
                  if (input) input.indeterminate = areSomeSelected();
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleSelectAll();
                }}
              />
              <span
                className="ml-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelectAll();
                }}
              >
                {areAllSelected() ? "Deselect All" : "Select All"}
              </span>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex gap-2 items-center">
              <span className="text-xs text-gray-600 font-medium">
                {getSelectedCount()}/{filteredDealers.length} selected
              </span>

              <button
                className="text-[10px] text-red-600 hover:text-red-800 cursor-pointer font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Dealers List */}
          <div className="max-h-32 overflow-y-auto">
            {filteredDealers.length > 0 ? (
              filteredDealers.map((dealer) => (
                <div
                  key={dealer.dealer_id}
                  className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => toggleDealerSelection(dealer)}
                >
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300 text-[#222fb9] cursor-pointer focus:ring-[#222fb9]"
                    checked={isDealerSelected(dealer)}
                    onChange={() => toggleDealerSelection(dealer)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-xs flex-1 truncate font-medium">
                    {dealer.dealer_name}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-2 py-3 text-xs text-gray-500 text-center font-medium">
                No dealers found
              </div>
            )}
          </div>

          {/* ✅ Conditionally show Apply & Cancel Buttons */}
          {showApplyCancelButtons && (
            <div className="flex justify-between p-2 border-t border-gray-200 bg-gray-50">
              <button
                className="px-3 py-1.5 text-xs bg-gray-200 cursor-pointer text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </button>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-600">
                  {tempSelectedDealers.length} selected
                </span>
                <button
                  className="px-3 py-1.5 text-xs bg-[#222fb9] cursor-pointer text-white rounded hover:bg-[#1b258f] transition-colors font-medium"
                  onClick={handleApply}
                  type="button"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DealerFilter;
