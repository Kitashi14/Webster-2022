import React from "react";

const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "text-primary-500",
    white: "text-white",
    slate: "text-slate-500",
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
      </div>
      <div className="mt-6 flex justify-end">
        <div className="w-24 h-8 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  );
};

const SkeletonList = ({ count = 3 }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
};

export { LoadingSpinner, LoadingScreen, SkeletonCard, SkeletonList };
export default LoadingSpinner;
