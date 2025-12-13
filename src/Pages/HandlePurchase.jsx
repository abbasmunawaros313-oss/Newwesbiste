import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaPassport, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaUsers, FaCreditCard, FaLock, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

/**
 * --- UTILITY FUNCTIONS ---
 */
const formatDateForAPI = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

const calcEndDate = (startDate, days) => {
  if (!startDate || !days) return "Auto-calculated";
  const d = new Date(startDate);
  d.setDate(d.getDate() + parseInt(days) - 1);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const PurchasePolicyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Retrieve Data
  const { pkg, searchData } = location.state || {};

  // 2. State Management
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [toasts, setToasts] = useState([]); // State for Popups

  // Form State
  const [formData, setFormData] = useState({
    travelerName: "",
    nicNo: "",
    ntnNo: "",
    dob: "",
    passportNo: "",
    email: "",
    contactNo: "",
    address: "",
    beneficiaryName: "",
    relationship: "",
    startDate: "",
    travelDays: 0,
    gstNo: "",
    remarks: "Online Purchase",
    spouseName: "",
    spouseDOB: "",
    spousePassport: "",
    children: [] 
  });

  // 3. Initialization
  useEffect(() => {
    if (!pkg) { navigate('/'); return; }
    const initialStart = searchData?.formattedStartDate ? searchData.formattedStartDate.split('/').reverse().join('-') : new Date().toISOString().split('T')[0];
    const initialDOB = searchData?.formattedDOB ? searchData.formattedDOB.split('/').reverse().join('-') : "";

    setFormData(prev => ({
      ...prev,
      travelerName: searchData?.travelerName || "",
      nicNo: searchData?.nicNo || "",
      dob: initialDOB,
      email: searchData?.email || "",
      contactNo: searchData?.phone || "",
      travelDays: searchData?.travelDays || pkg.Duration || 7,
      startDate: initialStart
    }));
  }, [pkg, searchData, navigate]);

  // --- POPUP / TOAST HANDLER ---
  const addToast = (message, type = 'error') => {
    const id = Date.now() + Math.random(); // Unique ID
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto remove after 5 seconds
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 4. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    
    // Auto-uppercase Passport
    if (name === "passportNo" || name === "spousePassport") {
        finalValue = value.toUpperCase();
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDateChange = (key, value) => {
      setFormData(prev => ({ ...prev, [key]: value }));
      if (validationErrors[key]) setValidationErrors(prev => ({ ...prev, [key]: null }));
  };

  // Child Handlers
  const handleAddChild = () => {
    setFormData(prev => ({ ...prev, children: [...prev.children, { ChildName: "", ChildDOB: "", ChildPassportNo: "" }] }));
  };

  const handleRemoveChild = (index) => {
    const newChildren = [...formData.children];
    newChildren.splice(index, 1);
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleChildChange = (index, field, value) => {
    const newChildren = [...formData.children];
    let finalValue = value;
    if (field === 'ChildPassportNo') finalValue = value.toUpperCase();
    
    newChildren[index][field] = finalValue;
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  // 5. STRICT VALIDATION LOGIC WITH POPUPS
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    let errorCount = 0;

    // Regex Patterns
    const cnicRegex = /^[0-9]{13}$/; 
    const phoneRegex = /^[0-9]{11}$/; // Exactly 11 digits
    const passportRegex = /^[A-Z]{2}[0-9]{7}$/; // 2 Letters + 7 Digits
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // --- 1. PERSONAL DETAILS ---
    if (!formData.travelerName.trim()) { 
        errors.travelerName = "Required"; isValid = false; 
        if(errorCount < 3) { addToast("Full Name is missing."); errorCount++; }
    }

    const cleanCNIC = formData.nicNo.replace(/-/g, '');
    if (!cleanCNIC || !cnicRegex.test(cleanCNIC)) { 
        errors.nicNo = "Invalid CNIC"; isValid = false; 
        if(errorCount < 3) { addToast("CNIC Error: Must be 13 digits."); errorCount++; }
    }

    if (!formData.dob) { 
        errors.dob = "Required"; isValid = false; 
        if(errorCount < 3) { addToast("Date of Birth is missing."); errorCount++; }
    }

    if (!formData.passportNo || !passportRegex.test(formData.passportNo)) {
        errors.passportNo = "Invalid Format"; isValid = false;
        if(errorCount < 3) { addToast("Passport Error: Format AB1234567 required."); errorCount++; }
    }

    // --- 2. CONTACT ---
    if (!emailRegex.test(formData.email)) { 
        errors.email = "Invalid Email"; isValid = false; 
        if(errorCount < 3) { addToast("Please enter a valid email address."); errorCount++; }
    }

    if (!formData.contactNo || !phoneRegex.test(formData.contactNo)) {
        errors.contactNo = "Invalid Phone"; isValid = false;
        if(errorCount < 3) { addToast("Phone Error: Must be 11 digits."); errorCount++; }
    }

    if (!formData.address || formData.address.length <= 20) {
        errors.address = "Too Short"; isValid = false;
        if(errorCount < 3) { addToast("Address is too short (min 20 chars)."); errorCount++; }
    }

    if (!formData.beneficiaryName) { 
        errors.beneficiaryName = "Required"; isValid = false; 
        if(errorCount < 3) { addToast("Beneficiary Name is missing."); errorCount++; }
    }

    if (!formData.relationship) { 
        errors.relationship = "Required"; isValid = false; 
        if(errorCount < 3) { addToast("Please select a relationship."); errorCount++; }
    }

    // --- 3. FAMILY VALIDATION ---
    if (pkg?.PlanType === 'F') {
        if (!formData.spouseName) { 
            errors.spouseName = "Required"; isValid = false;
            addToast("Spouse Name is required for Family Plan.");
        }
        if (!formData.spouseDOB) { 
            errors.spouseDOB = "Required"; isValid = false;
            addToast("Spouse DOB is required.");
        }
        
        // Loop through children to check for empty fields
        formData.children.forEach((child, i) => {
            if(!child.ChildName.trim()) { 
                errors[`child_${i}_name`] = "Required"; isValid = false; 
                addToast(`Child ${i+1}: Name is missing.`);
            }
            if(!child.ChildDOB) { 
                errors[`child_${i}_dob`] = "Required"; isValid = false; 
                addToast(`Child ${i+1}: Date of Birth is missing.`);
            }
        });
    }

    setValidationErrors(errors);
    
    if (!isValid) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return isValid;
  };

  // 6. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    // Payload Builder
    const payload = {
        TravelerName: formData.travelerName,
        NICNo: formData.nicNo.replace(/-/g, ''),
        NTNNo: formData.ntnNo,
        DOB: formatDateForAPI(formData.dob),
        PassportNo: formData.passportNo,
        Email: formData.email,
        PhoneNo: formData.contactNo,
        Address: formData.address,
        BeneficiaryName: formData.beneficiaryName,
        Relationship: formData.relationship,
        AreaShortCode: pkg.AreaShortCode || "WW",
        Country: "Pakistan",
        CountryCode: "PAK",
        PlanType: pkg.PlanType,
        PlanName: pkg.Plan.toUpperCase(),
        TravelDays: parseInt(formData.travelDays),
        StartDate: formatDateForAPI(formData.startDate),
        EndDate: calcEndDate(formData.startDate, formData.travelDays),
        Covid: pkg.Covid === "Covered" ? "Covered" : "Not Covered",
        Premium: pkg.TotalPayablePremium,
        GSTNo: formData.gstNo,
        Remarks: formData.remarks,
        SpouseName: pkg.PlanType === "F" ? formData.spouseName : "",
        SpouseDOB: pkg.PlanType === "F" ? formatDateForAPI(formData.spouseDOB) : "",
        SpousePassportNo: pkg.PlanType === "F" ? formData.spousePassport : "",
        NoOfChildren: pkg.PlanType === "F" ? formData.children.length : 0,
        Children: pkg.PlanType === "F" ? formData.children.map(c => ({
            ChildName: c.ChildName,
            ChildDOB: formatDateForAPI(c.ChildDOB),
            ChildPassportNo: c.ChildPassportNo
        })) : []
    };

    try {
        const response = await fetch('https://uicbackend-production.up.railway.app/api/uic/policy/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || result.ResponseDescription || "Submission Failed");

        if (result.data && result.data.length > 0) {
            navigate('/paypage', { 
                state: { 
                    amount: pkg.TotalPayablePremium,
                    customerName: formData.travelerName, 
                    customerEmail: formData.email,
                    customerMobile: formData.contactNo,
                    policyNo: result.data[0].PolicyNo,
                    policyData: result.data[0]
                } 
            });
        } else {
            throw new Error("No policy data returned from server.");
        }
    } catch (err) {
        addToast(err.message, 'error');
    } finally {
        setLoading(false);
    }
  };

  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans relative">
      
      {/* --- TOAST NOTIFICATION CONTAINER --- */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
            <div 
                key={toast.id} 
                className="animate-in slide-in-from-right fade-in duration-300 bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-4 max-w-sm flex items-start gap-3"
            >
                <div className="text-red-500 mt-1"><FaExclamationTriangle /></div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">Validation Error</h4>
                    <p className="text-xs text-slate-600 mt-1">{toast.message}</p>
                </div>
                <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600"><FaTimes /></button>
            </div>
        ))}
      </div>
      {/* ---------------------------------- */}

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
            <p className="text-slate-500">Complete your details to secure your insurance.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: FORM */}
            <div className="flex-1">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* 1. PERSONAL DETAILS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="text-lg font-bold text-slate-800">Traveler Details</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Full Name" name="travelerName" value={formData.travelerName} onChange={handleChange} error={validationErrors.travelerName} icon={<FaUser />} placeholder="As on Passport" />
                            <InputGroup label="CNIC (No Dashes)" name="nicNo" value={formData.nicNo} onChange={handleChange} error={validationErrors.nicNo} icon={<FaCreditCard />} placeholder="13 Digit Number" maxLength={13} />
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth <span className="text-red-500">*</span></label>
                                <DateSelector value={formData.dob} onChange={(val) => handleDateChange('dob', val)} error={validationErrors.dob} />
                            </div>

                            <InputGroup label="Passport Number" name="passportNo" value={formData.passportNo} onChange={handleChange} error={validationErrors.passportNo} icon={<FaPassport />} placeholder="e.g. AB1234567" maxLength={9} />
                        </div>
                    </div>

                    {/* 2. CONTACT DETAILS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                            <h3 className="text-lg font-bold text-slate-800">Contact & Beneficiary</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={validationErrors.email} icon="@" placeholder="email@example.com" />
                            <InputGroup label="Mobile Number" type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} error={validationErrors.contactNo} icon={<FaPhone />} placeholder="03001234567" maxLength={11} />
                            
                            <div className="md:col-span-2">
                                <InputGroup label="Home Address (Min 20 chars)" name="address" value={formData.address} onChange={handleChange} error={validationErrors.address} icon={<FaMapMarkerAlt />} placeholder="Full House/Street Address, City" />
                            </div>

                            <div className="md:col-span-2 border-t pt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-4">Beneficiary (Next of Kin)</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Beneficiary Name" name="beneficiaryName" value={formData.beneficiaryName} onChange={handleChange} error={validationErrors.beneficiaryName} />
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Relationship <span className="text-red-500">*</span></label>
                                        <select name="relationship" value={formData.relationship} onChange={handleChange} className={`w-full p-3 bg-slate-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition ${validationErrors.relationship ? 'border-red-500' : 'border-slate-300'}`}>
                                            <option value="">Select Relationship</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Sibling">Sibling</option>
                                            <option value="Child">Child</option>
                                        </select>
                                        {validationErrors.relationship && <p className="text-xs text-red-500 mt-1">{validationErrors.relationship}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. TRIP DETAILS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
                            <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                            <h3 className="text-lg font-bold text-slate-800">Trip Info</h3>
                        </div>
                        <div className="p-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Trip Start Date <span className="text-red-500">*</span></label>
                                <DateSelector value={formData.startDate} onChange={(val) => handleDateChange('startDate', val)} range="future" />
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center border border-blue-100">
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Coverage Period</p>
                                    <p className="text-blue-900 font-bold">{formData.travelDays} Days</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-600 font-bold uppercase">Valid Until</p>
                                    <p className="text-blue-900 font-bold">{calcEndDate(formData.startDate, formData.travelDays)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. FAMILY SECTION (CONDITIONAL) */}
                    {pkg.PlanType === 'F' && (
                        <div className="bg-indigo-50 rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
                            <div className="bg-indigo-100 px-6 py-4 border-b border-indigo-200 flex items-center gap-3">
                                <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">4</div>
                                <h3 className="text-lg font-bold text-indigo-900">Family Members</h3>
                            </div>
                            <div className="p-6">
                                <h4 className="font-bold text-indigo-800 mb-3">Spouse Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <InputGroup label="Spouse Name" name="spouseName" value={formData.spouseName} onChange={handleChange} error={validationErrors.spouseName} />
                                    <InputGroup label="Passport (Optional)" name="spousePassport" value={formData.spousePassport} onChange={handleChange} />
                                    <div className="md:col-span-2">
                                         <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Spouse DOB <span className="text-red-500">*</span></label>
                                         <DateSelector value={formData.spouseDOB} onChange={(val) => handleDateChange('spouseDOB', val)} error={validationErrors.spouseDOB} />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-indigo-800">Children</h4>
                                    <button type="button" onClick={handleAddChild} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm">
                                        + Add Child
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {formData.children.map((child, index) => (
                                        <div key={index} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative">
                                            <button type="button" onClick={() => handleRemoveChild(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FaTimes size={12}/></button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input type="text" placeholder="Child Name" value={child.ChildName} onChange={(e) => handleChildChange(index, 'ChildName', e.target.value)} className={`w-full text-sm p-2 border rounded-lg ${validationErrors[`child_${index}_name`] ? 'border-red-500' : 'border-indigo-200'}`} />
                                                <input type="text" placeholder="Passport (Opt)" value={child.ChildPassportNo} onChange={(e) => handleChildChange(index, 'ChildPassportNo', e.target.value)} className="w-full text-sm p-2 border border-indigo-200 rounded-lg" />
                                                <div className="md:col-span-2">
                                                    <DateSelector value={child.ChildDOB} onChange={(val) => handleChildChange(index, 'ChildDOB', val)} error={validationErrors[`child_${index}_dob`]} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </form>
            </div>

            {/* RIGHT COLUMN: STICKY SUMMARY */}
            <div className="lg:w-1/3">
                <div className="sticky top-6 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h3>
                        
                        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="h-10 w-10 bg-white rounded flex items-center justify-center shadow-sm text-2xl">🛡️</div>
                             <div>
                                 <p className="text-sm font-bold text-slate-800">{pkg.Plan} Plan</p>
                                 <p className="text-xs text-slate-500">{pkg.Area} Region</p>
                             </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-6 pb-6 border-b border-slate-100">
                            <div className="flex justify-between"><span>Plan Type</span><span className="font-bold">{pkg.PlanType === 'F' ? 'Family' : 'Individual'}</span></div>
                            <div className="flex justify-between"><span>Duration</span><span className="font-bold">{formData.travelDays} Days</span></div>
                            <div className="flex justify-between"><span>Covid Cover</span><span className={`font-bold ${pkg.Covid === 'Covered' ? 'text-green-600' : 'text-slate-500'}`}>{pkg.Covid}</span></div>
                        </div>

                        <div className="flex justify-between items-end mb-6">
                            <span className="text-sm font-bold text-slate-500">Total Payable</span>
                            <span className="text-2xl font-black text-blue-600">PKR {pkg.TotalPayablePremium?.toLocaleString()}</span>
                        </div>

                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-spin">⌛</span> : <FaLock />} 
                            {loading ? "Processing..." : "Secure Checkout"}
                        </button>
                        
                        <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                            <FaLock size={8} /> SSL Encrypted Transaction
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const InputGroup = ({ label, name, type="text", value, onChange, error, icon, placeholder, maxLength }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {label} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={onChange}
                placeholder={placeholder}
                maxLength={maxLength}
                autoComplete="off"
                className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-slate-800 ${error ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
            />
        </div>
        {/* Error message is visually handled by the Toast, but we keep red border here */}
    </div>
);

const DateSelector = ({ value, onChange, error, range = 'past' }) => {
    const [yearStr, monthStr, dayStr] = value ? value.split("-") : ["", "", ""];
    const currentYear = new Date().getFullYear();
    let years = range === 'past' 
        ? Array.from({ length: 100 }, (_, i) => currentYear - i) 
        : Array.from({ length: 5 }, (_, i) => currentYear + i);
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
  
    const handleSelect = (type, val) => {
        let newY = type === 'y' ? val : (yearStr || currentYear);
        let newM = type === 'm' ? val : (monthStr || "01");
        let newD = type === 'd' ? val : (dayStr || "01");
        onChange(`${newY}-${newM}-${newD}`);
    };
  
    const baseClass = `w-full p-2.5 bg-slate-50 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-slate-300'}`;
  
    return (
        <div>
            <div className="grid grid-cols-3 gap-2">
                <select value={dayStr} onChange={(e) => handleSelect('d', e.target.value)} className={baseClass}>
                    <option value="" disabled>Day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={monthStr} onChange={(e) => handleSelect('m', e.target.value)} className={baseClass}>
                    <option value="" disabled>Mon</option>
                    {months.map((m, i) => <option key={i} value={String(i+1).padStart(2,'0')}>{m}</option>)}
                </select>
                <select value={yearStr} onChange={(e) => handleSelect('y', e.target.value)} className={baseClass}>
                    <option value="" disabled>Year</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
        </div>
    );
};

export default PurchasePolicyPage;
