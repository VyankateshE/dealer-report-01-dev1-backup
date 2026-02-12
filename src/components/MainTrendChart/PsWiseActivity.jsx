// import React from 'react';
// import DealerGroup from './DealerGroup';

// const PsWiseActivity = ({ psWiseCharts, roleFilter, setRoleFilter, shouldFillBars }) => {
//   if (psWiseCharts.length === 0) return null;

//   return (
//     <div className="bg-white border-t border-gray-200">
//       {/* Section Header */}
//       <div className="flex justify-between items-center px-3 py-0 border-b border-gray-200 bg-gray-50">
//         <div className="text-lg font-semibold text-gray-900">
//           {roleFilter === 'Both' ? 'PS-wise Activity' : `${roleFilter}-wise Activity`}
//         </div>
//         <select
//           value={roleFilter}
//           onChange={(e) => setRoleFilter(e.target.value)}
//           className="border border-gray-300 cursor-pointer rounded px-3 py-0 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
//         >
//           <option value="PS">PS</option>
//           <option value="SM">SM</option>
//           <option value="Both">Both</option>
//         </select>
//       </div>

//       {/* Dealers List */}
//       <div className="max-h-[600px] overflow-y-auto">
//         {psWiseCharts.map((dealerGroup, dealerIndex) => (
//           <DealerGroup
//             key={dealerIndex}
//             dealerGroup={dealerGroup}
//             shouldFillBars={shouldFillBars}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PsWiseActivity;

import React from "react";
import DealerGroup from "./DealerGroup";

const PsWiseActivity = ({
  psWiseCharts,
  shouldFillBars,
  roleFilter,
  setRoleFilter,
}) => {
  if (psWiseCharts.length === 0) return null;

  // ✅ Compute header text dynamically
  const getHeaderText = () => {
    if (roleFilter === "Both") return "PS + SM Activity";
    return `${roleFilter}-wise Activity`;
  };

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Section Header */}
      <div className="flex justify-between items-center px-3 py-0 border-b border-gray-200 bg-gray-50">
        <div className="text-lg font-semibold text-gray-900">
          {getHeaderText()}
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 cursor-pointer rounded px-3 py-0 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#222fb9] focus:border-[#222fb9]"
        >
          <option value="PS">PS</option>
          <option value="SM">SM</option>
          <option value="Both">Both</option>
        </select>
      </div>

      {/* Dealers List */}
      <div className="max-h-[600px] overflow-y-auto">
        {psWiseCharts.map((dealerGroup, dealerIndex) => (
          <DealerGroup
            key={dealerIndex}
            dealerGroup={dealerGroup}
            shouldFillBars={shouldFillBars}
            roleFilter={roleFilter}
            showRole={roleFilter === "Both"} // ✅ Pass this prop to show roles
          />
        ))}
      </div>
    </div>
  );
};

export default PsWiseActivity;
