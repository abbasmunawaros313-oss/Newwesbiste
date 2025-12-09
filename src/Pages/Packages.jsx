import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { FaPlane, FaShieldAlt, FaSuitcase, FaChevronDown, FaFilePdf, FaCheck, FaTimes, FaRegCreditCard, FaArrowRight } from "react-icons/fa";
import { MdRefresh, MdFilterList, MdCoronavirus, MdOutlineHealthAndSafety } from "react-icons/md";
import { BiSearchAlt } from "react-icons/bi";

const Packages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve packages AND searchData from previous page
  const { packages = [], searchData } = location.state || {};

  // --- STATE FOR FILTERS ---
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [priceRange, setPriceRange] = useState(500000); // Max Price Default
  const [planType, setPlanType] = useState("All"); 
  const [covidCovered, setCovidCovered] = useState(false);

  // --- STATE FOR MODALS ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  // --- FILTERING LOGIC ---
  useEffect(() => {
    let result = packages || [];

    // 1. Filter by Plan Type
    if (planType === "Family") {
      result = result.filter((pkg) => pkg.PlanType === "F");
    } else if (planType === "Individual") {
      result = result.filter((pkg) => pkg.PlanType !== "F");
    }

    // 2. Filter by Price (Range: 999 to Selected Max)
    result = result.filter((pkg) => pkg.TotalPayablePremium >= 999 && pkg.TotalPayablePremium <= priceRange);

    // 3. Filter by Covid
    if (covidCovered) {
      result = result.filter((pkg) => {
        const covidStatus = (pkg.Covid || "").toLowerCase();
        return covidStatus === "covered" || covidStatus === "yes" || covidStatus === "included";
      });
    }

    setFilteredPackages(result);
  }, [packages, priceRange, planType, covidCovered]);

  const handleReset = () => {
    setPriceRange(500000);
    setPlanType("All");
    setCovidCovered(false);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // --- HANDLERS ---
  
  // 1. Click "Select Plan" -> Open Confirmation Modal
  const initiateBuy = (pkg) => {
    setSelectedPkg(pkg);
    setShowConfirm(true);
  };

  // 2. Confirm -> Navigate to Purchase
  const proceedToPurchase = () => {
    if (selectedPkg) {
      navigate("/purchase", {
        state: { pkg: selectedPkg, searchData: searchData },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800 relative">
      
      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showConfirm && selectedPkg && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={() => setShowConfirm(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Confirm Selection</h3>
                            <p className="text-xs text-slate-500 mt-1">Please review your plan before proceeding.</p>
                        </div>
                        <button onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                             <div className="h-12 w-12 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                                {/* Use same logo logic or simple icon */}
                                <FaShieldAlt className="text-blue-600 text-xl" />
                             </div>
                             <div>
                                 <h4 className="font-bold text-slate-800 text-sm">{selectedPkg.Plan}</h4>
                                 <p className="text-xs text-blue-600 font-semibold">{selectedPkg.AreaShortCode || "Worldwide"}</p>
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 block">Medical Cover</span>
                                <span className="font-bold text-slate-800">{selectedPkg.MedicalCover}</span>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                                <span className="text-xs text-slate-500 block">Total Premium</span>
                                <span className="font-bold text-blue-700">{formatMoney(selectedPkg.TotalPayablePremium)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="p-6 pt-2 flex gap-3">
                        <button 
                            onClick={() => setShowConfirm(false)}
                            className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={proceedToPurchase}
                            className="flex-1 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-transform active:scale-95"
                        >
                            Proceed <FaArrowRight />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row gap-8">
        
        {/* === LEFT SIDEBAR === */}
        <div className="w-full lg:w-1/4 space-y-6">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hidden lg:block sticky top-6"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <MdFilterList className="text-blue-600" /> Filters
               </h3>
               <button onClick={handleReset} className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                 <MdRefresh /> Reset
               </button>
            </div>

            {/* Plan Type */}
            <div className="mb-8">
              <p className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Traveler Type</p>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {["All", "Individual", "Family"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPlanType(type)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      planType === type ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

             {/* Covid */}
             <div className="mb-8">
               <p className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Add-ons</p>
              <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg -mx-2 transition-colors">
                <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={covidCovered}
                      onChange={(e) => setCovidCovered(e.target.checked)}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 shadow-sm checked:border-emerald-500 checked:bg-emerald-500 transition-all"
                    />
                     <FaCheck className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100 text-[10px]" />
                </div>
                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                   Covid-19 Cover <MdCoronavirus className="text-emerald-500" />
                </span>
              </label>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-4">
                 <p className="font-bold text-xs text-slate-400 uppercase tracking-wider">Price Limit</p>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{formatMoney(priceRange)}</span>
              </div>
              
              <input 
                type="range" 
                min="999" 
                max="500000"
                step="1000"
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-medium">
                  <span>PKR 999</span>
                  <span>PKR 5 Lac+</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* === RIGHT CONTENT (PACKAGES LIST) === */}
        <div className="w-full lg:w-3/4">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 gap-4"
          >
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Select Your Plan</h1>
                <p className="text-sm text-slate-500 mt-1">Found {filteredPackages.length} options matching your criteria</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 shadow-sm px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
                <FaFilePdf className="text-red-500" /> Download Quote
            </motion.button>
          </motion.div>

          {/* Packages List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredPackages.length > 0 ? (
                filteredPackages
                  .sort((a, b) => a.TotalPayablePremium - b.TotalPayablePremium)
                  .map((pkg, idx) => (
                    <HorizontalCard key={idx} pkg={pkg} onBuy={initiateBuy} formatMoney={formatMoney} idx={idx} />
                  ))
              ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center bg-white p-16 rounded-2xl border border-dashed border-slate-300 text-center shadow-sm"
                  >
                      <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <BiSearchAlt className="text-5xl text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">No Plans Found</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                          We couldn't find any packages in this price range. Try increasing your budget.
                      </p>
                      <button 
                        onClick={handleReset} 
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-1"
                      >
                          Reset Filters
                      </button>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

           {/* Disclaimer */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4 items-start"
           >
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
                    <FaShieldAlt />
                </div>
                <div>
                    <p className="text-sm font-bold text-blue-900 mb-1">Important Information</p>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                        <li>Travel Insurance is fully refundable only in case of Visa rejection (Proof required).</li>
                        <li>Trip cancellations due to Covid-19 are not eligible for policy refunds.</li>
                    </ul>
                </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- Horizontal Card Component ---
const HorizontalCard = ({ pkg, onBuy, formatMoney, idx }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Logo Logic
  const getLogo = () => {
    const pName = (pkg.Plan || "").toLowerCase();
    const cName = (pkg.Company || "").toLowerCase();

    // UIC Image
    if (pName.includes("united") || cName.includes("united") || pName.includes("uic")) {
       return "https://d1e6cjojnyo6nm.cloudfront.net/provider_small_images/gnGorQsh.jpg";
    }
    // Adamjee
    if (pName.includes("adamjee") || cName.includes("adamjee")) {
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Adamjee_Group_Logo.jpg/800px-Adamjee_Group_Logo.jpg";
    }
    // Habib
    if (pName.includes("habib") || cName.includes("habib")) {
        return "https://seeklogo.com/images/H/habib-insurance-logo-8A11B4C93B-seeklogo.com.png";
    }
    // Default
    return "https://www.theunitedinsurance.com/wp-content/uploads/2024/05/uic-logo-png.png"; 
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? "border-blue-500 shadow-xl ring-1 ring-blue-500" : "border-slate-200 shadow-sm hover:shadow-lg"}`}
    >
      <div className="flex flex-col md:flex-row relative">
        
        {/* COL 1: Logo & Plan Identity */}
        <div className="w-full md:w-1/4 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50">
           <div className="h-16 w-32 mb-4 flex items-center justify-center bg-white rounded-xl p-2 shadow-sm border border-slate-100">
             <img src={getLogo()} alt="Insurance Logo" className="w-full h-full object-contain" /> 
           </div>
           <h3 className="text-sm font-extrabold text-slate-800 text-center uppercase tracking-wide leading-tight px-2">{pkg.Plan}</h3>
           <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full mt-3 tracking-wider">
             {pkg.AreaShortCode || "Worldwide"}
           </span>
        </div>

        {/* COL 2: Key Features Grid */}
        <div className="w-full md:w-2/4 p-6 flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
             
             {/* Feature 1: Medical */}
             <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <MdOutlineHealthAndSafety className="text-lg" />
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Medical Cover</p>
                    <p className="text-sm font-bold text-slate-800">{pkg.MedicalCover || "$50,000"}</p>
                </div>
             </div>

             {/* Feature 2: Duration */}
             <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                    <FaPlane className="text-lg" />
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Duration</p>
                    <p className="text-sm font-bold text-slate-800">{pkg.Duration || "30"} days</p>
                </div>
             </div>

             {/* Feature 3: Baggage */}
             <div className="flex items-start gap-3">
                 <div className="mt-0.5 p-1.5 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                    <FaSuitcase className="text-lg" />
                 </div>
                 <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Baggage Loss</p>
                    <p className="text-sm font-bold text-slate-800">$500</p>
                 </div>
             </div>

             {/* Feature 4: Covid */}
             <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                    <MdCoronavirus className="text-lg" />
                </div>
                <div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Covid-19</p>
                    <p className={`text-sm font-bold ${pkg.Covid === "Covered" ? "text-emerald-600" : "text-slate-800"}`}>
                        {pkg.Covid || "Included"}
                    </p>
                </div>
             </div>

          </div>
          
          {/* Toggle Details Button */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center md:justify-start">
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
             >
               {isExpanded ? "Hide Details" : "View More Details"}
               <motion.span
                 animate={{ rotate: isExpanded ? 180 : 0 }}
                 transition={{ duration: 0.2 }}
               >
                 <FaChevronDown />
               </motion.span>
             </button>
          </div>
        </div>

        {/* COL 3: Price & Actions */}
        <div className="w-full md:w-1/4 p-6 flex flex-col items-center justify-center bg-slate-50 border-l border-slate-100 relative group-hover:bg-blue-50/30 transition-colors">
           <div className="text-center mb-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Premium</p>
                <h4 className="text-3xl font-extrabold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {formatMoney(pkg.TotalPayablePremium).replace("PKR", "").trim()}<span className="text-xs font-bold text-slate-400 ml-1">PKR</span>
                </h4>
           </div>

           <div className="w-full space-y-3">
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBuy(pkg)}
                className="w-full py-3 px-4 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
             >
                Select Plan <FaRegCreditCard />
             </motion.button>
             <button className="w-full py-2.5 px-4 bg-white text-slate-600 border border-slate-200 text-xs font-bold rounded-xl hover:bg-white hover:text-blue-600 hover:border-blue-200 transition-colors">
                Enquire Now
             </button>
           </div>
        </div>
      </div>

      {/* --- EXPANDABLE DETAILS SECTION --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-slate-50 border-t border-slate-100 overflow-hidden"
          >
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
                
                {/* 1. Policy Limits */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Policy Limits
                    </h4>
                    <ul className="space-y-3">
                        <DetailRow label="Gross Premium" value={formatMoney(pkg.GrossPremium || 0)} />
                        <DetailRow label="Net Premium" value={formatMoney(pkg.NetPremium || pkg.GrossPremium)} />
                        <DetailRow label="Tax Amount" value={formatMoney((pkg.TotalPayablePremium - pkg.GrossPremium) || 0)} />
                    </ul>
                </div>

                {/* 2. Key Benefits */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Benefits
                    </h4>
                    <ul className="space-y-3">
                        <DetailRow label="Emergency Medical" value={pkg.MedicalCover || "$50,000"} />
                        <DetailRow label="Repatriation" value="Covered" />
                        <DetailRow label="Family Plan" value={pkg.PlanType === "F" ? "Yes" : "No"} />
                    </ul>
                </div>

                {/* 3. Additional Info */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                         <span className="w-2 h-2 bg-purple-500 rounded-full"></span> System Info
                     </h4>
                     <ul className="space-y-3">
                        <DetailRow label="Company ID" value={pkg.CompanyId || "N/A"} />
                        <DetailRow label="System Rate ID" value={pkg.RateId || "N/A"} />
                        <DetailRow label="Age Bracket" value={`${pkg.TravelerAge || "18-65"} Years`} />
                     </ul>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

// Helper for Detail Rows
const DetailRow = ({ label, value }) => (
    <li className="flex justify-between items-center text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-bold text-slate-700">{value}</span>
    </li>
);

export default Packages;