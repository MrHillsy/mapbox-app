import React from "react";

export default function FacilityAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Strategic Facility Analysis
      </h3>

      {/* Analyst Write-Up */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-700 leading-relaxed mb-3">
          Our analysis highlights the disparities in facility distribution across
          New York, Brooklyn, and Queens. While <span className="font-semibold text-blue-600">New York City</span> leads in
          healthcare and education infrastructure, <span className="font-semibold text-green-600">Brooklyn</span> demonstrates
          strength in retail facilities like supermarkets and banks. On the other hand,{" "}
          <span className="font-semibold text-yellow-600">Queens</span> falls behind in public
          safety and healthcare facilities, signaling a pressing need for increased
          investment in hospitals and police stations.
        </p>

        <p className="text-gray-700 leading-relaxed">
          If Queens allocates <span className="font-semibold">15-20% more of its annual
          infrastructure budget</span> towards healthcare facilities, it could close
          the gap with Brooklyn within the next 2 years. Similarly, Brooklyn should
          target <span className="font-semibold">public safety expansion</span> to keep pace
          with New York's rapid emergency response network.
        </p>
      </div>

      {/* Analyst Insights */}
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-3 text-blue-700">Key Recommendations:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Increase hospital development in Queens by 25% to meet growing demand.
          </li>
          <li>
            Brooklyn should improve its ratio of police stations per 10,000 residents.
          </li>
          <li>
            Continue education infrastructure expansion in New York to maintain its lead.
          </li>
        </ul>
      </div>
    </div>
  );
}
