import React, { useState, useRef, useEffect } from "react";
import {
  HiMagnifyingGlass,
  HiCalendar,
  HiUser,
  HiChevronDown,
  HiPlus,
  HiMinus,
} from "react-icons/hi2";

function Hotelform() {
  const [activeSearchTab, setActiveSearchTab] = useState("Overnight Stays");

  // State for occupancy dropdown
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState([]); // Array to store ages of children
  const [isOccupancyDropdownOpen, setIsOccupancyDropdownOpen] = useState(false);

  const occupancyRef = useRef(null); // Ref for the occupancy button
  const dropdownRef = useRef(null); // Ref for the dropdown content

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        occupancyRef.current &&
        !occupancyRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOccupancyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers for increment/decrement
  const handleRoomsChange = (change) => {
    setRooms((prev) => Math.max(1, prev + change));
  };
  const handleAdultsChange = (change) => {
    setAdults((prev) => Math.max(1, prev + change));
  };
  const handleChildrenChange = (change) => {
    setChildren((prev) => {
      const newCount = Math.max(0, prev + change);
      // Adjust childAges array size if children count changes
      setChildAges((currentAges) => {
        if (newCount > currentAges.length) {
          // Add null for new children
          return [...currentAges, ...Array(newCount - currentAges.length).fill(null)];
        } else if (newCount < currentAges.length) {
          // Remove ages for removed children
          return currentAges.slice(0, newCount);
        }
        return currentAges;
      });
      return newCount;
    });
  };

  const handleChildAgeChange = (index, age) => {
    setChildAges((prevAges) => {
      const newAges = [...prevAges];
      newAges[index] = age;
      return newAges;
    });
  };

  // Function to format the occupancy display text
  const getOccupancyDisplayText = () => {
    let text = `${adults} adult${adults > 1 ? "s" : ""}`;
    if (children > 0) {
      text += `, ${children} child${children > 1 ? "ren" : ""}`;
    }
    text += `, ${rooms} room${rooms > 1 ? "s" : ""}`;
    return text;
  };

  return (
    <>
      {/* Inner Search Tabs */}
      <div className="flex items-center mt-5 gap-2 mb-4">
        <button
          onClick={() => setActiveSearchTab("Overnight Stays")}
          className={`px-5 py-2 rounded-full font-semibold transition-colors
            ${
              activeSearchTab === "Overnight Stays"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          Overnight Stays
        </button>
        <button
          onClick={() => setActiveSearchTab("Day Use Stays")}
          className={`px-5 py-2 rounded-full font-semibold transition-colors
            ${
              activeSearchTab === "Day Use Stays"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          Day Use Stays
        </button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 mb-5">
        {/* Destination Input */}
        <div className="relative w-full lg:col-span-4">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Enter a destination or property"
            className="w-full h-14 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Check-in Date */}
        <button className="flex items-center gap-3 w-full lg:col-span-2 h-14 px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-blue-500">
          <HiCalendar className="text-gray-500 text-xl" />
          <div>
            <span className="block text-sm font-medium">19 Nov 2025</span>
            <span className="block text-xs text-gray-500">Wednesday</span>
          </div>
        </button>

        {/* Check-out Date */}
        <button className="flex items-center gap-3 w-full lg:col-span-2 h-14 px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-blue-500">
          <HiCalendar className="text-gray-500 text-xl" />
          <div>
            <span className="block text-sm font-medium">22 Nov 2025</span>
            <span className="block text-xs text-gray-500">Saturday</span>
          </div>
        </button>

        {/* Occupancy Selector (Button & Dropdown) */}
        <div className="relative w-full lg:col-span-4">
          <button
            ref={occupancyRef}
            onClick={() => setIsOccupancyDropdownOpen(!isOccupancyDropdownOpen)}
            className="flex justify-between items-center gap-3 w-full h-14 px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-blue-500"
          >
            <div className="flex items-center gap-3">
              <HiUser className="text-gray-500 text-xl" />
              <div>
                <span className="block text-sm font-medium">
                  {getOccupancyDisplayText()}
                </span>
                {/* No second line for rooms/adults, it's combined in getOccupancyDisplayText */}
              </div>
            </div>
            <HiChevronDown
              className={`text-gray-400 transition-transform ${
                isOccupancyDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOccupancyDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 p-5 bg-white shadow-xl rounded-lg w-[300px] z-20 border border-gray-200"
            >
              {/* Rooms Counter */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-700">Room</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRoomsChange(-1)}
                    disabled={rooms <= 1}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50 disabled:text-gray-300 disabled:bg-white disabled:cursor-not-allowed"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{rooms}</span>
                  <button
                    onClick={() => handleRoomsChange(1)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>

              {/* Adults Counter */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <span className="font-semibold text-gray-700">Adult</span>
                  <p className="text-xs text-gray-500">Ages 18 or above</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAdultsChange(-1)}
                    disabled={adults <= 1}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50 disabled:text-gray-300 disabled:bg-white disabled:cursor-not-allowed"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{adults}</span>
                  <button
                    onClick={() => handleAdultsChange(1)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className="flex justify-between items-center py-2 mb-3">
                <div>
                  <span className="font-semibold text-gray-700">Children</span>
                  <p className="text-xs text-gray-500">Ages 0-17</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleChildrenChange(-1)}
                    disabled={children <= 0}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50 disabled:text-gray-300 disabled:bg-white disabled:cursor-not-allowed"
                  >
                    <HiMinus />
                  </button>
                  <span className="font-bold text-lg w-6 text-center">{children}</span>
                  <button
                    onClick={() => handleChildrenChange(1)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 text-blue-600 hover:bg-blue-50"
                  >
                    <HiPlus />
                  </button>
                </div>
              </div>

              {/* Child Age Dropdowns */}
              {children > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    For accurate room pricing, make sure to enter your child's correct
                    age.
                  </p>
                  {Array.from({ length: children }).map((_, index) => (
                    <div key={index} className="mb-3">
                      <select
                        value={childAges[index] || ""}
                        onChange={(e) => handleChildAgeChange(index, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="" disabled>
                          Age of Child {index + 1}
                        </option>
                        {Array.from({ length: 18 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Add flight & Search Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button className="font-semibold text-blue-600 hover:underline">
          + Add a flight
        </button>
        <button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-lg px-16 py-3 transition-colors">
          SEARCH
        </button>
      </div>
    </>
  );
}

export default Hotelform;