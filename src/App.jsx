import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import MapView from "./MapView";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <Router basename="/mapbox-app">
      <div className="h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-xl font-bold tracking-wide">City Facility Analysis</h1>
          <div className="space-x-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `hover:underline ${isActive ? "font-semibold border-b-2 border-white" : ""}`
              }
            >
              Map
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hover:underline ${isActive ? "font-semibold border-b-2 border-white" : ""}`
              }
            >
              Dashboard
            </NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <Routes>
            <Route index element={<MapView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<MapView />} /> {/* Fallback */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}
