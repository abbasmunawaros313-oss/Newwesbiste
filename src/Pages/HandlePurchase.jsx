import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * UTILITY FUNCTIONS
 */

// Format Date to DD/MM/YYYY
const formatDateToDDMMYYYY = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Calculate end date from startDate + travelDays
const calcEndDate = (startDate, days) => {
  if (!startDate || !days) return "";
  const d = new Date(startDate);
  d.setDate(d.getDate() + parseInt(days) - 1);
  return formatDateToDDMMYYYY(d);
};

// Helper to parse DD/MM/YYYY back to YYYY-MM-DD for input fields
const parseDDMMYYYYToISO = (ddmmyyyy) => {
  if (!ddmmyyyy) return "";
  if (ddmmyyyy.includes('-')) return ddmmyyyy;
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

// Calculate Age helper
const calculateAge = (dobISO) => {
  const birthDate = new Date(dobISO);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * PAYLOAD BUILDER
 * Strictly maps frontend state to the required Backend JSON structure
 */
const buildPayload = (formData, pkg) => {
  const startDateFormatted = formatDateToDDMMYYYY(formData.startDate);
  const endDateFormatted = calcEndDate(formData.startDate, formData.travelDays);

  const payload = {
    // --- Personal Info ---
    TravelerName: formData.travelerName,
    NICNo: formData.nicNo || "",
    NTNNo: formData.ntnNo || "",
    DOB: formatDateToDDMMYYYY(formData.dob),
    PassportNo: formData.passportNo,
    
    // --- Contact Info (Corrected Keys) ---
    Email: formData.email,               // Was TravelerEmail
    PhoneNo: formData.contactNo,         // Was ContactNo
    Address: formData.address,

    // --- Beneficiary Info (NEW REQUIRED) ---
    BeneficiaryName: formData.beneficiaryName,
    Relationship: formData.relationship,

    // --- Location Info ---
    AreaShortCode: pkg.AreaShortCode || "WW",
    Country: "Pakistan",                 // NEW REQUIRED (Country Name)
    CountryCode: "PAK",                  // Required Code

    // --- Plan Info (Corrected Keys) ---
    PlanType: pkg.PlanType,
    PlanName: pkg.Plan.toUpperCase(),    // Was Plan
    TravelDays: parseInt(formData.travelDays), // Was NoOfDays
    StartDate: startDateFormatted,       // Was TravelDate
    EndDate: endDateFormatted,           // NEW REQUIRED

    // --- Coverage Info ---
    Covid: pkg.Covid === "Yes" || pkg.Covid === "Covered" ? "Covered" : "Not Covered",
    Premium: pkg.TotalPayablePremium,
    GSTNo: formData.gstNo || "",
    Remarks: formData.remarks || "Online Purchase",

    // --- Family Plan Fields ---
    SpouseName: pkg.PlanType === "F" ? formData.spouseName : "",
    SpouseDOB: pkg.PlanType === "F" ? formatDateToDDMMYYYY(formData.spouseDOB) : "",
    SpousePassportNo: pkg.PlanType === "F" ? (formData.spousePassport || "") : "",
    NoOfChildren: pkg.PlanType === "F" ? formData.children.length : 0,
    Children: pkg.PlanType === "F" ? formData.children.map((c) => ({
      ChildName: c.ChildName,
      ChildDOB: formatDateToDDMMYYYY(c.ChildDOB),
      ChildPassportNo: c.ChildPassportNo || ""
    })) : []
  };

  return payload;
};

const PurchasePolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Retrieve Data
  const { pkg, searchData } = location.state || {};

  // 2. State Management
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successData, setSuccessData] = useState(null);

  // Default Form State
  const [formData, setFormData] = useState({
    // Traveler Info
    travelerName: "",
    nicNo: "",
    ntnNo: "",
    dob: "",
    passportNo: "",
    email: "",
    contactNo: "",
    address: "",
    
    // Beneficiary Info (NEW)
    beneficiaryName: "",
    relationship: "",

    // Policy Meta
    startDate: "",
    travelDays: 0,
    
    // Optional
    gstNo: "",
    remarks: "Online Purchase",

    // Family Logic
    spouseName: "",
    spouseDOB: "",
    spousePassport: "",
    children: [] 
  });

  // 3. Initialization Effect
  useEffect(() => {
    if (!pkg || !searchData) {
      navigate('/'); 
      return;
    }

    const initialDays = searchData.travelDays || pkg.Duration || 7;
    const initialStart = parseDDMMYYYYToISO(searchData.formattedStartDate) || new Date().toISOString().split('T')[0];

    setFormData(prev => ({
      ...prev,
      travelerName: searchData.travelerName || "",
      nicNo: searchData.nicNo || "",
      dob: parseDDMMYYYYToISO(searchData.formattedDOB) || "",
      email: searchData.email || "",
      contactNo: searchData.phone || "",
      travelDays: initialDays,
      startDate: initialStart
    }));
  }, [pkg, searchData, navigate]);

  // 4. Input Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Child specific handlers
  const handleAddChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { ChildName: "", ChildDOB: "", ChildPassportNo: "" }]
    }));
  };

  const handleRemoveChild = (index) => {
    const newChildren = [...formData.children];
    newChildren.splice(index, 1);
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleChildChange = (index, field, value) => {
    const newChildren = [...formData.children];
    newChildren[index][field] = value;
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  // 5. Validation Logic
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // 5.1 CNIC
    const cnicRegex = /^(\d{13}|\d{5}-\d{7}-\d{1})$/;
    if (!formData.nicNo || !cnicRegex.test(formData.nicNo)) {
      errors.nicNo = "Invalid CNIC";
      isValid = false;
    }

    // 5.2 Age
    if (!formData.dob) {
      errors.dob = "Required";
      isValid = false;
    } else {
      const age = calculateAge(formData.dob);
      if (age < 18 || age > 86) {
        errors.dob = "Must be 18-86 years";
        isValid = false;
      }
    }

    // 5.3 Required Text Fields
    if (!formData.travelerName || formData.travelerName.length < 2) {
      errors.travelerName = "Required";
      isValid = false;
    }
    if (!formData.passportNo || formData.passportNo.length < 3) {
      errors.passportNo = "Required";
      isValid = false;
    }
    if (!formData.address || formData.address.length < 5) {
      errors.address = "Required";
      isValid = false;
    }

    // 5.4 Contact
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid Email";
      isValid = false;
    }
    if (!formData.contactNo || formData.contactNo.length < 7) {
      errors.contactNo = "Required";
      isValid = false;
    }

    // 5.5 Beneficiary Validation (NEW)
    if (!formData.beneficiaryName) {
      errors.beneficiaryName = "Required";
      isValid = false;
    }
    if (!formData.relationship) {
      errors.relationship = "Required";
      isValid = false;
    }

    // 5.6 Family Validation
    if (pkg?.PlanType === 'F') {
      if (!formData.spouseName) { errors.spouseName = "Required"; isValid = false; }
      if (!formData.spouseDOB) { errors.spouseDOB = "Required"; isValid = false; }
      
      formData.children.forEach((child, idx) => {
        if (!child.ChildName) { errors[`child_${idx}_name`] = "Required"; isValid = false; }
        if (!child.ChildDOB) { errors[`child_${idx}_dob`] = "Required"; isValid = false; }
      });
    }

    setValidationErrors(errors);
    return isValid;
  };

  // 6. Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    // Generate Payload
    const payload = buildPayload(formData, pkg);

    // ... inside handleSubmit ...

    try {
      const response = await fetch('https://uicbackend-production.up.railway.app/api/uic/policy/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = result.message || result.ResponseDescription || "Validation Failed";
        throw new Error(msg);
      }

      // --- UPDATED LOGIC STARTS HERE ---
      // The API returns an array in 'data', we want the first object
      if (result.data && result.data.length > 0) {
        const policyData = result.data[0];
        
        // Navigate to the new page and pass the data object
        navigate('/bookingconfirmation', { state: policyData });
      } 
      else {
         throw new Error("Policy generated but no data returned from API");
      }
      // --- UPDATED LOGIC ENDS HERE ---

    } catch (err) {
      console.error("Purchase Error:", err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. Render Logic
  if (!pkg) return null;

  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Policy Issued!</h2>
          <p className="text-gray-600 mb-6">Your travel insurance policy has been successfully generated.</p>
          
          {successData.PolicyNo && (
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <span className="block text-xs text-gray-500 uppercase">Policy Number</span>
              <span className="block text-xl font-mono font-bold text-gray-800">{successData.PolicyNo}</span>
            </div>
          )}

          <div className="space-y-3">
            {successData.PrintURL && (
              <a 
                href={successData.PrintURL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
              >
                Download Policy PDF
              </a>
            )}
            <button 
              onClick={() => navigate('/')}
              className="block w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition duration-200"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Summary Card */}
        <div className="bg-slate-900 rounded-t-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Confirm & Buy Policy</h1>
              <p className="text-slate-400 mt-1 flex items-center">
                <span className="bg-blue-600 text-xs font-bold px-2 py-0.5 rounded mr-2">
                  {pkg.Plan}
                </span>
                {pkg.Area} Region ({formData.travelDays} Days)
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-slate-400 text-xs uppercase tracking-wide">Total Premium</p>
              <p className="text-3xl font-bold text-white">
                PKR {pkg.TotalPayablePremium?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 shadow-sm">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission Failed</h3>
                <div className="mt-1 text-sm text-red-700">{apiError}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-b-2xl overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">

            {/* Section 1: Traveler Details */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                <span className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                Traveler Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="travelerName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="travelerName"
                    name="travelerName"
                    value={formData.travelerName}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.travelerName ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="As per passport"
                  />
                  {validationErrors.travelerName && <p className="text-red-500 text-xs mt-1">{validationErrors.travelerName}</p>}
                </div>

                <div>
                  <label htmlFor="nicNo" className="block text-sm font-medium text-gray-700 mb-1">CNIC Number *</label>
                  <input
                    type="text"
                    id="nicNo"
                    name="nicNo"
                    value={formData.nicNo}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.nicNo ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="13 digits"
                  />
                   {validationErrors.nicNo && <p className="text-red-500 text-xs mt-1">{validationErrors.nicNo}</p>}
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.dob ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                   {validationErrors.dob && <p className="text-red-500 text-xs mt-1">{validationErrors.dob}</p>}
                </div>

                <div>
                  <label htmlFor="passportNo" className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                  <input
                    type="text"
                    id="passportNo"
                    name="passportNo"
                    value={formData.passportNo}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.passportNo ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {validationErrors.passportNo && <p className="text-red-500 text-xs mt-1">{validationErrors.passportNo}</p>}
                </div>
              </div>
            </section>

            {/* Section 2: Contact & Beneficiary */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                <span className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                Contact & Beneficiary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="user@example.com"
                  />
                  {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    id="contactNo"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.contactNo ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="03001234567"
                  />
                  {validationErrors.contactNo && <p className="text-red-500 text-xs mt-1">{validationErrors.contactNo}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${validationErrors.address ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Full House/Street Address more than 10 characters"
                  />
                  {validationErrors.address && <p className="text-red-500 text-xs mt-1">{validationErrors.address}</p>}
                </div>

                {/* Beneficiary Info */}
                <div className="md:col-span-2 border-t pt-4 mt-2">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Beneficiary Details (Next of Kin)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="beneficiaryName" className="block text-sm font-medium text-gray-700 mb-1">Beneficiary Name *</label>
                            <input
                                type="text"
                                id="beneficiaryName"
                                name="beneficiaryName"
                                value={formData.beneficiaryName}
                                onChange={handleChange}
                                className={`w-full rounded-lg border ${validationErrors.beneficiaryName ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Name of Beneficiary"
                            />
                            {validationErrors.beneficiaryName && <p className="text-red-500 text-xs mt-1">{validationErrors.beneficiaryName}</p>}
                        </div>
                        <div>
                            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                            <select
                                id="relationship"
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                className={`w-full rounded-lg border ${validationErrors.relationship ? 'border-red-500' : 'border-gray-300'} p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
                            >
                                <option value="">Select Relationship</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                                <option value="Other">Other</option>
                            </select>
                            {validationErrors.relationship && <p className="text-red-500 text-xs mt-1">{validationErrors.relationship}</p>}
                        </div>
                    </div>
                </div>
              </div>
            </section>

            {/* Section 3: Trip Details */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4 flex items-center">
                <span className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
                <div>
                   <label className="block text-xs font-medium text-gray-500">Travel Start Date</label>
                   <input type="date" disabled value={formData.startDate} className="mt-1 block w-full bg-transparent font-semibold text-gray-800"/>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500">Duration (Days)</label>
                   <span className="mt-1 block w-full font-semibold text-gray-800">{formData.travelDays} Days</span>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-500">Calculated End Date</label>
                   <span className="mt-1 block w-full font-semibold text-gray-800">
                     {calcEndDate(formData.startDate, formData.travelDays)}
                   </span>
                </div>
              </div>
            </section>

            {/* Section 4: Family Details (Conditional) */}
            {pkg.PlanType === 'F' && (
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-bold text-blue-900 border-b border-blue-200 pb-2 mb-4 flex items-center">
                  <span className="bg-blue-200 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
                  Family Members
                </h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Spouse Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <input 
                        type="text" name="spouseName" placeholder="Spouse Name *" 
                        value={formData.spouseName} onChange={handleChange}
                        className={`w-full p-2 border rounded ${validationErrors.spouseName ? 'border-red-500' : 'border-blue-200'}`} 
                      />
                    </div>
                    <div>
                      <input 
                        type="date" name="spouseDOB" 
                        value={formData.spouseDOB} onChange={handleChange}
                        className={`w-full p-2 border rounded ${validationErrors.spouseDOB ? 'border-red-500' : 'border-blue-200'}`} 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" name="spousePassport" placeholder="Spouse Passport (Opt)" 
                        value={formData.spousePassport} onChange={handleChange}
                        className="w-full p-2 border border-blue-200 rounded" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-blue-800">Children</h4>
                    <button type="button" onClick={handleAddChild} className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                      + Add Child
                    </button>
                  </div>
                  
                  {formData.children.length === 0 && <p className="text-sm text-blue-400 italic">No children added.</p>}

                  {formData.children.map((child, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-3 items-center bg-white p-3 rounded shadow-sm">
                      <div className="md:col-span-2">
                        <input 
                          type="text" placeholder="Child Name" 
                          value={child.ChildName} 
                          onChange={(e) => handleChildChange(index, 'ChildName', e.target.value)}
                          className={`w-full text-sm p-2 border rounded ${validationErrors[`child_${index}_name`] ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input 
                          type="date" 
                          value={child.ChildDOB} 
                          onChange={(e) => handleChildChange(index, 'ChildDOB', e.target.value)}
                          className={`w-full text-sm p-2 border rounded ${validationErrors[`child_${index}_dob`] ? 'border-red-500' : ''}`}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input 
                          type="text" placeholder="Passport (Optional)" 
                          value={child.ChildPassportNo} 
                          onChange={(e) => handleChildChange(index, 'ChildPassportNo', e.target.value)}
                          className="w-full text-sm p-2 border rounded"
                        />
                      </div>
                      <div className="md:col-span-1 text-center">
                        <button type="button" onClick={() => handleRemoveChild(index)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Optional Fields */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
               <div>
                  <label htmlFor="ntnNo" className="block text-sm font-medium text-gray-500 mb-1">NTN No (Optional)</label>
                  <input type="text" name="ntnNo" value={formData.ntnNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
               </div>
               <div>
                  <label htmlFor="gstNo" className="block text-sm font-medium text-gray-500 mb-1">GST No (Optional)</label>
                  <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} className="w-full rounded-lg border border-gray-300 p-3 text-sm" />
               </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t mt-8">
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay PKR ${pkg.TotalPayablePremium?.toLocaleString()}`
                )}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchasePolicyPage;
