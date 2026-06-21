import React from "react";

const Loader = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-slate-700 border-t-emerald-500 rounded-full animate-spin`}
        role="status"
        id="loading-spinner"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
