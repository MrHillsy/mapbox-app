export const locations = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-74.5, 40] // New York
      },
      properties: {
        title: "New York City",
        description: "Population: 8.6M"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-73.9, 40.7] // Brooklyn
      },
      properties: {
        title: "Brooklyn",
        description: "Population: 2.5M"
      }
    }
  ]
};
