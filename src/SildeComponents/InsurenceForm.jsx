import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// change it later to railway
 const BASE_URL = "https://uicbackend-production.up.railway.app/api/uic/packages";
//const BASE_URL = "http://localhost:5002/api/uic/packages";

export default function InsuranceForm() {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    travelerName: "",
    nicNo: "",
    ntnNo: "",
    dob: "",
    travelStart: "",
    travelEnd: "",
    travelDays: 0,
    covid: "Not Covered",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto calculate travel days
  useEffect(() => {
    if (formData.travelStart && formData.travelEnd) {
      const start = new Date(formData.travelStart);
      const end = new Date(formData.travelEnd);
      const diff = (end - start) / (1000 * 60 * 60 * 24) + 1;
      setFormData((prev) => ({
        ...prev,
        travelDays: diff > 0 ? Math.ceil(diff) : 0,
      }));
    }
  }, [formData.travelStart, formData.travelEnd]);

  const formatUICDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    // Validation
    if (!formData.travelerName || !formData.dob || formData.travelDays <= 0) {
      return setErrorMsg("Please fill in Traveler Name, Date of Birth, and valid Travel Dates.");
    }

    const payload = {
      TravelerName: formData.travelerName,
      NICNo: formData.nicNo || "",
      NTNNo: formData.ntnNo || "",
      TravelDays: formData.travelDays,
      DOB: formatUICDate(formData.dob),
      Covid: formData.covid,
    };

    setLoading(true);

    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let responseData;
      let packagesArray;

      try {
        responseData = await res.json();
        packagesArray = responseData.data;
      } catch (e) {
        throw new Error("Server returned invalid response (Not JSON).");
      }

      if (!res.ok) {
        const apiError = packagesArray?.[0]?.ResponseDescription || "Server Error (HTTP status not OK)";
        throw new Error(apiError);
      }

      if (!Array.isArray(packagesArray)) {
        throw new Error("API returned unexpected data format.");
      }

      if (packagesArray.length > 0 && packagesArray[0].ResponseCode !== "USTI-S001") {
        const apiError = packagesArray[0].ResponseDescription || "API returned a non-success code.";
        throw new Error(apiError);
      }

      // SUCCESS
      navigate("/packages", {
        state: {
          packages: packagesArray,
          searchData: {
            ...formData,
            formattedDOB: formatUICDate(formData.dob),
            formattedStartDate: formatUICDate(formData.travelStart),
            formattedEndDate: formatUICDate(formData.travelEnd),
          },
        },
      });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get Today's date for min/max attributes
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Travel Insurance
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Secure your journey with the best UIC packages available.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          
          {/* Section 1: Personal Details */}
          <div className="p-8 bg-white">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b pb-2">
              <UserIcon /> Personal Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="relative group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIconSmall className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="travelerName"
                    value={formData.travelerName}
                    onChange={handleChange}
                    placeholder="e.g. Munawar Abbas"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="relative group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="text-slate-400" />
                  </div>
                  <input
                    type="date"
                    name="dob"
                    max={today} // Prevents selecting future dates
                    value={formData.dob}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm appearance-none"
                    style={{ colorScheme: "light" }} 
                  />
                </div>
              </div>

              {/* CNIC (Optional) */}
              <div className="relative group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  CNIC / Passport (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdCardIcon className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="nicNo"
                    value={formData.nicNo}
                    onChange={handleChange}
                    placeholder="Identification Number"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                  />
                </div>
              </div>

               {/* NTN (Optional) */}
               <div className="relative group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  NTN Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HashtagIcon className="text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="ntnNo"
                    value={formData.ntnNo}
                    onChange={handleChange}
                    placeholder="Tax Number"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Trip Details (Different Background) */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
              <PlaneIcon /> Trip Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Departure Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="travelStart"
                  min={today} // Can't start in the past
                  value={formData.travelStart}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
                  style={{ colorScheme: "light" }}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Return Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="travelEnd"
                  min={formData.travelStart || today} // Can't return before start
                  value={formData.travelEnd}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
                  style={{ colorScheme: "light" }}
                />
              </div>

              {/* Calculated Days */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Duration
                </label>
                <div className="flex items-center px-4 py-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 sm:text-sm font-medium">
                  {formData.travelDays > 0 ? (
                    <span className="text-blue-700 font-bold">{formData.travelDays} Days</span>
                  ) : (
                    <span>Auto-calculated</span>
                  )}
                </div>
              </div>

              {/* Covid Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Covid-19 Coverage
                </label>
                <select
                  name="covid"
                  value={formData.covid}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition sm:text-sm"
                >
                  <option value="Not Covered">Not Covered</option>
                  <option value="Covered">Include Coverage</option>
                </select>
              </div>

            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="px-8 pb-4">
              <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start">
                <div className="shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Form Error</h3>
                  <div className="mt-1 text-sm text-red-700">{errorMsg}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="px-8 py-6 bg-slate-50 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                w-full md:w-auto px-8 py-3.5 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white uppercase tracking-wider
                bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transform transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Search Packages <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Simple SVG Icons (No external libs needed) --- */

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UserIconSmall = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

const CalendarIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlaneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const IdCardIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const HashtagIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
  </svg>
);

const ExclamationCircleIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
