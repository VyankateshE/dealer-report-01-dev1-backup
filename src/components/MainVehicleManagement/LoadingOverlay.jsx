import React from "react";

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="text-center text-white">
        <div className="border-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto"></div>
        <p className="mt-3 text-xs">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
