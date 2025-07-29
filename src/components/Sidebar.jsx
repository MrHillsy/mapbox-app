import React, { useState } from "react";

export default function Sidebar({ cities, selectedCity, setSelectedCity, filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`bg-white shadow-lg p-4 border-r h-full transition-all duration-300 ${isOpen ? "w-64" : "w-16"} relative`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-blue-600 text-white rounded-full p-1 shadow"
      >
        {isOpen ? "<" : ">"}
      </button>

      {isOpen && (
        <div>
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          {/* City Selector */}
          <label className="block font-semibold mb-2">City</label>
          <select
            className="border p-2 rounded w-full mb-4"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Facility Filters */}
          <h3 className="font-semibold mb-2">Facilities</h3>
          {Object.keys(filters).map((facility) => (
            <div key={facility} className="mb-2">
              <input
                type="checkbox"
                checked={filters[facility]}
                onChange={() =>
                  setFilters({ ...filters, [facility]: !filters[facility] })
                }
                className="mr-2"
              />
              <label>{facility}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
