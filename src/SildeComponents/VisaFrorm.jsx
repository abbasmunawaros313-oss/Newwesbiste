import React from "react";
// Make sure you have react-icons installed: npm install react-icons
import {
  FaUser,
  FaPassport,
  FaGlobe,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
} from "react-icons/fa";

function VisaForm() {
  return (
    <div className="mt-5">
      {/* 1. Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6  text-center">
        Visa Application Assistance
      </h3>

      {/* 2. Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        
        {/* Destination Country */}
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
            Destination Country
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="destination"
              placeholder="e.g., United States"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Visa Type */}
        <div>
          <label htmlFor="visaType" className="block text-sm font-medium text-gray-700 mb-1">
            Visa Type
          </label>
          <div className="relative">
            <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              id="visaType"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option>Tourist Visa</option>
              <option>Work Visa</option>
              <option>Student Visa</option>
              <option>Business Visa</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name (as on passport)
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="fullName"
              placeholder="John M. Doe"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Passport Number */}
        <div>
          <label htmlFor="passport" className="block text-sm font-medium text-gray-700 mb-1">
            Passport Number
          </label>
          <div className="relative">
            <FaPassport className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="passport"
              placeholder="AB1234567"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <div className="relative">
            <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="nationality"
              placeholder="e.g., Pakistani"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              id="dob"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
            />
          </div>
        </div>

        {/* Email Address (Spans full width) */}
        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Phone Number (Spans full width) */}
        <div className="md:col-span-2">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              id="phone"
              placeholder="+92 300 1234567"
              className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

      </div>

      {/* 3. Submit Button */}
      <div className="mt-8">
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-lg px-16 py-3 transition-colors">
          Submit Application
        </button>
      </div>
    </div>
  );
}

export default VisaForm;