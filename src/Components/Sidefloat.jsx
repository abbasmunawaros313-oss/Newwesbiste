import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTicketAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidefloat() {
  // State now controls if the panel is open or minimized
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  // Animation variants for the main container's width
  const containerVariants = {
    open: {
      width: "20rem", // This is 320px (max-w-xs)
      transition: { type: "spring", stiffness: 400, damping: 30, delay: 0.1 },
    },
    closed: {
      width: "4rem", // This is 64px (w-16)
      transition: { type: "spring", stiffness: 400, damping: 30 },
    },
  };

  // Variants for the content (text, button) fading in/out
  const contentVariants = {
    open: {
      opacity: 1,
      transition: { delay: 0.3 },
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
  };

  // Variants for the minimized icon fading in/out
  const iconVariants = {
    open: {
      opacity: 0,
      transition: { duration: 0.1 },
    },
    closed: {
      opacity: 1,
      transition: { delay: 0.3 },
    },
  };

  return (
    <motion.div
      className="fixed top-1/2 right-0 z-40 bg-white shadow-2xl 
                 rounded-l-lg overflow-hidden
                 border-l-4 border-t-4 border-b-4 border-blue-500"
      style={{ y: "-50%" }}
      variants={containerVariants}
      animate={isOpen ? "open" : "closed"}
      initial={false} // Start in the default state without animating on load
    >
      {/* We use AnimatePresence to switch between the open and closed content */}
      <AnimatePresence mode="wait">
        {isOpen ? (
          // --- 2. OPEN VIEW (The Content) ---
          <motion.div
            key="content"
            className="w-80 p-6" // w-80 matches the 20rem open state
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* --- Close (Minimize) Button --- */}
            <button
              onClick={toggleOpen}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Minimize promotion"
            >
              <FaTimes />
            </button>

            {/* --- Content --- */}
            <div className="flex items-center gap-3 mb-3">
              <FaTicketAlt className="text-4xl text-blue-500 shrink-0" />
              <h3 className="text-xl font-bold text-gray-800">
                Exclusive Offer!
              </h3>
            </div>
            
            <p className="text-gray-600 mb-5">
              Planning your next trip? Get a 
              <span className="font-bold text-blue-600"> 10% DISCOUNT</span> on
              any visa file processing when you book your flight and hotel with us!
            </p>

            {/* --- CTA Button --- */}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)} // Also minimize when CTA is clicked
              className="block w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 
                         rounded-lg shadow-lg hover:bg-blue-700 transition-all 
                         transform hover:scale-105"
            >
              Claim Your Offer Now
            </Link>
          </motion.div>
        ) : (
          // --- 1. MINIMIZED VIEW (The Icon Button) ---
          <motion.button
            key="icon"
            onClick={toggleOpen}
            className="w-16 h-24 flex items-center justify-center text-blue-500 cursor-pointer"
            aria-label="Open promotion"
            variants={iconVariants}
            initial="closed"
            animate="closed"
            exit="open"
          >
            <FaTicketAlt className="text-3xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Sidefloat;