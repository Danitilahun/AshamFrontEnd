import React, { useState } from "react";
import "./SearchUI.css";

import { useTheme } from "@emotion/react"; /* New */

const SearchInput = ({ onSearch, onCancel }) => {
  const [searchText, setSearchText] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() !== "") {
      setShowCancel(true);
    } else {
      setShowCancel(false);
    }
  };

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleCancel = () => {
    setSearchText("");
    setShowCancel(false);
    onCancel(); // Call the onCancel prop when cancel is clicked
  };

  const theme = useTheme(); /* New */

  return (
    <div
      className="search-container"
      style={{
        border: `1px solid ${
          theme.palette.mode === "dark" ? "#323E8B" : "#C5C7D7"
        }` /* New */,
        paddingRight: "1rem",
      }}
    >
      <input
        style={{
          color: theme.palette.secondary[50], // New
        }}
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      {showCancel && (
        <span className="cancel-button" onClick={handleCancel}>
          &#x2715;
        </span>
      )}
    </div>
  );
};

export default SearchInput;
