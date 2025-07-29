import React from "react";

export default function AnalysisCard({ insights, selectedCity }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 h-fit max-h-[180px] overflow-y-auto">
      <h3 className="text-lg font-bold mb-3 text-gray-700">
        Quick Insights for {selectedCity}
      </h3>

      {insights.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
          {insights.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm">Loading insights...</p>
      )}
    </div>
  );
}
