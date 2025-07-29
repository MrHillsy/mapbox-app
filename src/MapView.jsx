import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import * as turf from "@turf/turf";

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2F5Y2VlcHJhZyIsImEiOiJjbWRsNGcyeHcxNmZqMmxxM3hjOTM3bm12In0.yboxKqGeZF8p9TAbIeQWgw";

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popupRef = useRef(null);

  const initialView = { center: [-73.935242, 40.73061], zoom: 10 };

  const cities = ["All", "New York", "Brooklyn", "Queens"];
  const categories = [
    { key: "School", color: "#3b82f6" },
    { key: "Hospital", color: "#ef4444" },
    { key: "Bank", color: "#10b981" },
    { key: "Supermarket", color: "#f59e0b" },
    { key: "Police", color: "#6366f1" },
    { key: "Park", color: "#22c55e" },
  ];

  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedCategories, setSelectedCategories] = useState(categories.map((c) => c.key));
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showBoundaries, setShowBoundaries] = useState(false);

  // Polygon coordinates for each city
  const polygons = {
    "New York": {
      coords: [
        [-74.05, 40.7],
        [-73.95, 40.7],
        [-73.95, 40.8],
        [-74.05, 40.8],
        [-74.05, 40.7],
      ],
      color: "#3b82f6",
    },
    Brooklyn: {
      coords: [
        [-73.99, 40.66],
        [-73.9, 40.66],
        [-73.9, 40.7],
        [-73.99, 40.7],
        [-73.99, 40.66],
      ],
      color: "#10b981",
    },
    Queens: {
      coords: [
        [-73.93, 40.73],
        [-73.8, 40.73],
        [-73.8, 40.8],
        [-73.93, 40.8],
        [-73.93, 40.73],
      ],
      color: "#f59e0b",
    },
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialView.center,
      zoom: initialView.zoom,
    });

    const nav = new mapboxgl.NavigationControl();
    map.current.addControl(nav, "top-right");
  }, []);

  // Fetch facilities
  useEffect(() => {
    fetch("http://localhost:5000/api/facilities")
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((err) => console.error(err));
  }, []);

  // Add facility points
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const geoData = getFilteredGeoJSON();

    if (map.current.getLayer("facility-points")) {
      map.current.getSource("facilities").setData(geoData);
    } else {
      map.current.addSource("facilities", { type: "geojson", data: geoData });

      map.current.addLayer({
        id: "facility-points",
        type: "circle",
        source: "facilities",
        paint: {
          "circle-radius": 6,
          "circle-color": [
            "match",
            ["get", "category"],
            "School", "#3b82f6",
            "Hospital", "#ef4444",
            "Bank", "#10b981",
            "Supermarket", "#f59e0b",
            "Police", "#6366f1",
            "Park", "#22c55e",
            "#000000",
          ],
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "#fff",
        },
      });

      // Handle click
      map.current.on("click", "facility-points", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const props = e.features[0].properties;

        const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${coordinates[0]},${coordinates[1]},15,0/400x400?access_token=${mapboxgl.accessToken}`;

        if (selectedFacility && selectedFacility.name === props.name) {
          resetView();
        } else {
          setSelectedFacility({ name: props.name });
          map.current.flyTo({ center: coordinates, zoom: 14, speed: 0.8 });

          const popupHTML = `
            <div style="text-align:center; width:220px;">
              <img src="${staticImageUrl}" alt="${props.name}" style="width:100%; border-radius:8px;"/>
              <p style="font-weight:bold; margin:8px 0;">${props.name || "Facility"}</p>
              <p style="font-size:12px; color:#555;">${props.category}</p>
            </div>
          `;
          if (popupRef.current) popupRef.current.remove();
          popupRef.current = new mapboxgl.Popup({ offset: 15 })
            .setLngLat(coordinates)
            .setHTML(popupHTML)
            .addTo(map.current);
        }
      });
    }
  }, [facilities, selectedCity, selectedCategories, selectedFacility]);

  // ✅ Toggle Polygons
  useEffect(() => {
    if (!map.current) return;

    Object.keys(polygons).forEach((city) => {
      const sourceId = `boundary-${city}`;
      const lineLayer = `boundary-line-${city}`;
      const labelLayer = `boundary-label-${city}`;

      if (showBoundaries) {
        if (!map.current.getSource(sourceId)) {
          map.current.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: { name: city },
              geometry: { type: "Polygon", coordinates: [polygons[city].coords] },
            },
          });

          map.current.addLayer({
            id: lineLayer,
            type: "line",
            source: sourceId,
            paint: {
              "line-color": polygons[city].color,
              "line-width": 3,
            },
            layout: { "line-join": "round", "line-cap": "round" },
          }, "facility-points");

          map.current.addLayer({
            id: labelLayer,
            type: "symbol",
            source: sourceId,
            layout: {
              "text-field": city,
              "text-size": 14,
              "text-offset": [0, 1],
            },
            paint: { "text-color": polygons[city].color },
          });
        }
      } else {
        if (map.current.getLayer(lineLayer)) map.current.removeLayer(lineLayer);
        if (map.current.getLayer(labelLayer)) map.current.removeLayer(labelLayer);
        if (map.current.getSource(sourceId)) map.current.removeSource(sourceId);
      }
    });
  }, [showBoundaries]);

  // Highlight selected point
  useEffect(() => {
    if (map.current && map.current.getLayer("facility-points")) {
      map.current.setPaintProperty("facility-points", "circle-radius", [
        "case",
        ["==", ["get", "name"], selectedFacility?.name || ""],
        12,
        6,
      ]);
      map.current.setPaintProperty("facility-points", "circle-stroke-color", [
        "case",
        ["==", ["get", "name"], selectedFacility?.name || ""],
        "#FFD700",
        "#fff",
      ]);
    }
  }, [selectedFacility]);

  const resetView = () => {
    map.current.flyTo({ center: initialView.center, zoom: initialView.zoom, speed: 0.8 });
    setSelectedFacility(null);
    if (popupRef.current) popupRef.current.remove();
  };

  const getFilteredGeoJSON = () => {
    const filtered = facilities.filter(
      (f) =>
        (selectedCity === "All" || f.city === selectedCity) &&
        selectedCategories.includes(f.category)
    );

    return {
      type: "FeatureCollection",
      features: filtered.map((f) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [f.lon, f.lat] },
        properties: {
          name: f.name || "Unknown",
          category: f.category,
          image: f.image || "",
        },
      })),
    };
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Filters</h2>

        {/* City Selector */}
        <label className="block font-semibold mb-2">Select City</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Category Filters */}
        <h3 className="font-semibold mb-2">Select Facilities</h3>
        <div className="space-y-2">
          {categories.map((cat) => {
            const count = facilities.filter(
              (f) =>
                (selectedCity === "All" || f.city === selectedCity) &&
                f.category === cat.key
            ).length;

            return (
              <label key={cat.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.key)}
                    onChange={() => toggleCategory(cat.key)}
                  />
                  <span className="font-medium" style={{ color: cat.color }}>
                    {cat.key}
                  </span>
                </div>
                <span className="text-gray-600 text-sm font-semibold">{count}</span>
              </label>
            );
          })}
        </div>

        {/* ✅ Toggle Boundaries */}
        <div className="mt-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={() => setShowBoundaries(!showBoundaries)}
            />
            <span className="font-medium">Show Area Boundaries</span>
          </label>
        </div>

        {/* ✅ Reset View Button */}
        <button
          onClick={resetView}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reset View
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: "relative" }}>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}
