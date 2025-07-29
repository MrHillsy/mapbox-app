import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `hover:underline ${location.pathname === path ? "font-bold underline" : ""}`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">City Facility Analysis</h1>
      <div className="space-x-6">
        <Link to="/" className={navLinkClass("/")}>Map</Link>
        <Link to="/dashboard" className={navLinkClass("/dashboard")}>Dashboard</Link>
      </div>
    </nav>
  );
}
