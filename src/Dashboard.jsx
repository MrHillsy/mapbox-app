import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from "chart.js";
import AnalysisCard from "./components/AnalysisCard";
import FacilityAnalysis from "./components/FacilityAnalysis";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement);

export default function Dashboard() {
  const [facilities, setFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("New York");

  const cities = ["New York", "Brooklyn", "Queens"];
  const categories = ["School", "Hospital", "Bank", "Supermarket", "Police", "Park"];
  const [insights, setInsights] = useState([]);

useEffect(() => {
    fetch("http://localhost:5000/api/facilities")
    .then((res) => res.json())
    .then((data) => setFacilities(data))
    .catch((err) => console.error(err));
}, []);

  const cityCounts = cities.map((city) => ({
    city,
    count: facilities.filter((f) => f.city === city).length,
  }));

  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: facilities.filter((f) => f.city === selectedCity && f.category === cat).length,
  }));

  const groupedData = categories.map((cat) =>
    cities.map((city) => facilities.filter((f) => f.city === city && f.category === cat).length)
  );

  const barData = {
    labels: cityCounts.map((c) => c.city),
    datasets: [
      {
        label: "Total Facilities",
        data: cityCounts.map((c) => c.count),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      },
    ],
  };

  const pieData = {
    labels: categoryCounts.map((c) => c.category),
    datasets: [
      {
        data: categoryCounts.map((c) => c.count),
        backgroundColor: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#6366f1", "#22c55e"],
      },
    ],
  };

  const groupedBarData = {
    labels: categories,
    datasets: cities.map((city, index) => ({
      label: city,
      data: groupedData.map((row) => row[index]),
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"][index],
    })),
  };


  useEffect(() => {
  if (facilities.length > 0) {
    const newInsights = [];

    const cityData = facilities.filter((f) => f.city === selectedCity);

    // ✅ Generate insights for the selected city
    const totalFacilities = cityData.length;
    newInsights.push(`${selectedCity} has ${totalFacilities} total facilities.`);

    const topCategory = categories.reduce(
      (max, cat) => {
        const count = cityData.filter((f) => f.category === cat).length;
        return count > max.count ? { category: cat, count } : max;
      },
      { category: "", count: 0 }
    );
    if (topCategory.count > 0) {
      newInsights.push(
        `${selectedCity} has more ${topCategory.category}s than any other facility type.`
      );
    }

    const hospitals = cityData.filter((f) => f.category === "Hospital").length;
    if (hospitals < 5) {
      newInsights.push(
        `${selectedCity} may need more hospitals to meet public health demand.`
      );
    }

    const schools = cityData.filter((f) => f.category === "School").length;
    if (schools < 10) {
      newInsights.push(
        `${selectedCity} could improve education access by increasing schools.`
      );
    }

    setInsights(newInsights);
  }
}, [facilities, selectedCity]);


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">City Facility Dashboard</h2>
        <p className="text-gray-500 mt-2">
          Explore facility distribution across cities with real-time insights and data-driven analysis.
        </p>
      </header>

      {/* City Selector */}
      <div className="flex justify-center mb-6">
        <select
          className="border p-2 rounded shadow"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Facilities by City</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Facility Breakdown in {selectedCity}
          </h3>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Category Comparison</h3>
          <Bar
            data={groupedBarData}
            options={{
              responsive: true,
              plugins: { legend: { position: "bottom" } },
            }}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <AnalysisCard insights={insights} selectedCity={selectedCity} />
        <FacilityAnalysis />
      </div>
    </div>
  );
}
