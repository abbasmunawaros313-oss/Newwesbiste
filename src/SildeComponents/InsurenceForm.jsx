import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://uicbackend-production.up.railway.app/api/uic/packages";

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
        return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
    };
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing again
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

            // SUCCESS: Navigate to the Packages page
            // UPDATED: We now pass 'searchData: formData' so the Purchase page can use it later
            navigate("/packages", { 
                state: { 
                    packages: packagesArray,
                    searchData: {
                        ...formData,
                        formattedDOB: formatUICDate(formData.dob),
                        formattedStartDate: formatUICDate(formData.travelStart),
                        formattedEndDate: formatUICDate(formData.travelEnd),
                    }
                } 
            });
            

        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800 border-b pb-4">
                ✈️ Comprehensive Travel Insurance Finder
            </h1>

            <div className="bg-white shadow-2xl p-8 rounded-xl space-y-6">
                <h2 className="text-2xl font-bold text-gray-700">Traveler Details & Dates</h2>
                
                {/* Form Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Traveler Name *</label>
                        <input type="text" name="travelerName" value={formData.travelerName} onChange={handleChange} placeholder="e.g., Munawar Abbas" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                        <input type="date" name="travelStart" value={formData.travelStart} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                        <input type="date" name="travelEnd" value={formData.travelEnd} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
                        <input readOnly value={formData.travelDays} className="w-full bg-indigo-50 border border-indigo-300 p-3 rounded-lg font-bold text-center text-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">COVID Coverage</label>
                        <select name="covid" value={formData.covid} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg">
                            <option value="Not Covered">Not Covered</option>
                            <option value="Covered">Covered</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <h2 className="col-span-full text-lg font-semibold text-gray-700">Optional Identification</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                        <input type="text" name="nicNo" value={formData.nicNo} onChange={handleChange} placeholder="CNIC/Passport Number" className="w-full border border-gray-300 p-3 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">NTN Number</label>
                        <input type="text" name="ntnNo" value={formData.ntnNo} onChange={handleChange} placeholder="Tax Number" className="w-full border border-gray-300 p-3 rounded-lg" />
                    </div>
                </div>

                {/* Beautiful Error Display */}
                {errorMsg && (
                    <div className="animate-bounce bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
                        <p className="font-bold">Error Occurred</p>
                        <p>{errorMsg}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg font-extrabold text-lg shadow-lg transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching Packages...
                        </>
                    ) : "Search Insurance Packages"}
                </button>
            </div>
        </div>
    );
}
