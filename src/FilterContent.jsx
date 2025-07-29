import React, { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState("New York");
  const [selectedCategories, setSelectedCategories] = useState([
    "School", "Hospital", "Bank", "Supermarket", "Police", "Park"
  ]);

  return (
    <FilterContext.Provider value={{ selectedCity, setSelectedCity, selectedCategories, setSelectedCategories }}>
      {children}
    </FilterContext.Provider>
  );
};
