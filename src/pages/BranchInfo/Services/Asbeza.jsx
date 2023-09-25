import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import AsbezaCard from "../../../components/Asbeza/AsbezaCard";
import Header from "../../../components/VersatileComponents/Header";
import { useParams } from "react-router-dom";
import getData from "../../../api/services/DeliveryGuy/getDeliveryGuy";
import AsbezaTable from "../../../components/Asbeza/Tables/branchTable";

const BranchAsbeza = () => {
  const [admins, setAdmins] = useState([]);
  const param = useParams();

  useEffect(() => {
    const unsubscribe = getData("Asbeza", "branch", param.id, setAdmins);
    return () => unsubscribe();
  }, []);

  console.log("asbeza", admins);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (searchTerm) {
      getData("Asbeza", "blockHouse", searchTerm.toUpperCase(), (newData) => {
        setSearchResults(newData);
        setNoResults(newData.length === 0);
      });
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setNoResults(false);
  };

  console.log("searchResults-------------------------------", searchResults);
  const renderData = searchResults.length > 0 ? searchResults : admins;
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        from="branch"
      />
      <AsbezaTable />
    </Box>
  );
};

export default BranchAsbeza;
