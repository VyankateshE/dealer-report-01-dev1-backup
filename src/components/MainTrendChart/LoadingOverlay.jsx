// import React from "react";

// const LoadingOverlay = ({ isLoading }) => {
//   if (!isLoading) return null;

//   return (
//     <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
//       <div className="w-10 h-10 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
//     </div>
//   );
// };

// export default LoadingOverlay;

import React from "react";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-[#222fb9] rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingOverlay;
