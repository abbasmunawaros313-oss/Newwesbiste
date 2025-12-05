import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiCheckCircle, 
  HiArrowDownTray, 
  HiHome, 
  HiUser, 
  HiCreditCard, 
  HiDocumentText,
  HiIdentification
} from 'react-icons/hi2';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve data from location state
  const policyData = location.state;

  // Protect Route: Redirect if no data is present
  useEffect(() => {
    if (!policyData) {
      navigate('/');
    }
  }, [policyData, navigate]);

  if (!policyData) return null;

  // Helper calculation
  const totalAmount = (parseFloat(policyData.Amount || 0) + parseFloat(policyData.AdvanceTax || 0)).toFixed(2);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-100 selection:text-blue-900">
      <motion.div 
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* --- Success Status Header --- */}
        <div className="text-center mb-10">
          <motion.div 
            className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 mb-6 shadow-sm ring-1 ring-green-100"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <HiCheckCircle className="h-14 w-14 text-green-500" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Payment Successful
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-3 text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
            {policyData.ResponseDescription || "Your policy has been successfully generated and is ready for download."}
          </motion.p>
        </div>

        {/* --- Main Policy Ticket Card --- */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative"
        >
          {/* Top Decorative Gradient Strip */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 via-indigo-500 to-purple-500"></div>

          <div className="p-8 md:p-10">
            
            {/* Header: Policy No & Reference */}   
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-slate-100 mb-8 gap-6">
              
              {/* Policy Number Badge */}
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                  <HiDocumentText className="h-4 w-4" />
                  Policy Number
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-mono font-bold text-slate-800 tracking-tight">
                    {policyData.PolicyNo}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              {/* Reference ID Box */}
              <div className="bg-slate-50 px-5 py-4 rounded-xl border border-slate-200 text-left md:text-right w-full md:w-auto shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center md:justify-end gap-1">
                  <HiIdentification className="h-3 w-3" />
                  Reference ID
                </p>
                <p className="text-lg font-bold text-slate-700 font-mono tracking-wide">{policyData.ReferenceID}</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-12">
              
              {/* Left Column: Traveler */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded">
                    <HiUser className="h-4 w-4" />
                  </span>
                  Traveler Details
                </h3>
                
                <div className="space-y-6">
                  <div className="group">
                    <p className="text-xs font-medium text-slate-500 mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {policyData.TravelerName}
                    </p>
                  </div>
                  
                  <div className="group">
                    <p className="text-xs font-medium text-slate-500 mb-1">Email Address</p>
                    <p className="text-base font-medium text-slate-900 break-all group-hover:text-blue-600 transition-colors">
                      {policyData.TravelerEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-600 p-1 rounded">
                    <HiCreditCard className="h-4 w-4" />
                  </span>
                  Payment Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm group">
                    <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Policy Premium</span>
                    <span className="font-medium text-slate-900 tabular-nums">PKR {parseFloat(policyData.Amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm group">
                    <span className="text-slate-500 group-hover:text-slate-700 transition-colors">Advance Tax</span>
                    <span className="font-medium text-slate-900 tabular-nums">PKR {parseFloat(policyData.AdvanceTax).toLocaleString()}</span>
                  </div>
                  
                  {/* Perforated Line Effect */}
                  <div className="my-4 border-b-2 border-dashed border-slate-200 relative"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-800">Total Paid</span>
                    <span className="text-xl font-bold text-green-600 tabular-nums tracking-tight">
                      PKR {parseFloat(totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Actions --- */}
            <div className="flex flex-col gap-4 pt-10 mt-2">
              {policyData.PolicyPrintUrl && (
                <motion.a 
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  href={policyData.PolicyPrintUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md group"
                >
                  <HiArrowDownTray className="h-5 w-5 group-hover:animate-bounce" />
                  Download Policy PDF
                </motion.a>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 font-semibold py-3.5 px-6 rounded-xl hover:border-slate-300 hover:text-slate-800 transition-all duration-200"
              >
                <HiHome className="h-5 w-5 text-slate-400" />
                Return to Home
              </motion.button>
            </div>

          </div>
          
          {/* Footer Code */}
          <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-200">
             <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
               Transaction Code: <span className="text-slate-600">{policyData.ResponseCode}</span>
             </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
