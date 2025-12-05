import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Packages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve packages AND searchData from the previous form
  const { packages, searchData } = location.state || {};

  // Handle "No Data" scenario
  if (!packages || packages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Packages Found</h2>
          <p className="text-slate-500 mb-6">We couldn't find any insurance packages matching your criteria.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Start New Search
          </button>
        </div>
      </div>
    );
  }

  // Helper: Format Currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // --- UPDATED HANDLE BUY ---
  const handleBuy = (pkg) => {
    // Navigate to the purchase page
    // Pass the specific selected package AND the original form data (dates, names)
    navigate("/purchase", { 
      state: { 
        pkg: pkg, 
        searchData: searchData 
      } 
    });
  };

  // Group packages by Area (e.g., SCHENGEN vs WORLDWIDE)
  const groupedPackages = packages.reduce((acc, pkg) => {
    const area = pkg.Area || "Other Destinations";
    if (!acc[area]) acc[area] = [];
    acc[area].push(pkg);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* --- Header Section --- */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">Insurance Results</h1>
              <p className="text-xs text-slate-500">Found {packages.length} options for you</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
          >
            &larr; Modify Search
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {Object.entries(groupedPackages).map(([area, areaPackages]) => (
          <div key={area} className="mb-12">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{area}</h2>
              <div className="h-px flex-1 bg-slate-200"></div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areaPackages
                .sort((a, b) => a.TotalPayablePremium - b.TotalPayablePremium) // Sort by price (low to high)
                .map((pkg, idx) => (
                  <PackageCard key={idx} pkg={pkg} onBuy={handleBuy} formatMoney={formatMoney} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Sub-component for individual cards to keep code clean
 */
const PackageCard = ({ pkg, onBuy, formatMoney }) => {
  const isFamily = pkg.PlanType === "F";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
      
      {/* Card Top Decoration */}
      <div className={`h-2 w-full ${isFamily ? "bg-purple-500" : "bg-blue-500"}`} />

      <div className="p-6 flex-1 flex flex-col">
        
        {/* Header: Plan Name & Type */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">{pkg.Plan}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Duration: {pkg.Duration} {pkg.DurationUnit}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isFamily
                ? "bg-purple-50 text-purple-700 border border-purple-100"
                : "bg-blue-50 text-blue-700 border border-blue-100"
            }`}
          >
            {isFamily ? "Family" : "Single"}
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <p className="text-sm text-slate-400 font-medium mb-1">Total Payable</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatMoney(pkg.TotalPayablePremium)}
            </span>
          </div>
          {pkg.GrossPremium < pkg.TotalPayablePremium && (
            <p className="text-xs text-slate-400 mt-1">
              Base: {formatMoney(pkg.GrossPremium)} + Tax
            </p>
          )}
        </div>

        {/* Features Divider */}
        <div className="h-px w-full bg-slate-100 mb-6"></div>

        {/* Features List */}
        <ul className="space-y-3 mb-8 flex-1">
          <ListItem label="COVID-19 Coverage" value={pkg.Covid} active={pkg.Covid === "Covered"} />
          <ListItem label="Traveler Name" value={pkg.TravelerName} />
          <ListItem label="Age" value={`${pkg.TravelerAge} Years`} />
          <ListItem label="Coverage Area" value={pkg.AreaShortCode} />
        </ul>

        {/* Action Button */}
        <button
          onClick={() => onBuy(pkg)}
          className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transition-transform transform active:scale-95 flex items-center justify-center gap-2 ${
            isFamily
              ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
          }`}
        >
          <span>Select Plan</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Simple helper for list items
const ListItem = ({ label, value, active = true }) => (
  <li className="flex justify-between items-center text-sm">
    <span className="text-slate-500">{label}</span>
    <span className={`font-semibold ${active ? "text-slate-700" : "text-red-500"}`}>
      {value}
    </span>
  </li>
);

export default Packages;
