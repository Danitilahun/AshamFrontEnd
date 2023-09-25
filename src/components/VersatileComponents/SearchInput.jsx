import React, { useState } from "react";
import "./SearchUI.css";
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

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      {showCancel && (
        <span className="cancel-button" onClick={handleCancel}>
          &#10006;
        </span>
      )}
    </div>
  );
};

export default SearchInput;
