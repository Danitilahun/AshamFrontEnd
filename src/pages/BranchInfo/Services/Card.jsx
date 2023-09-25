import React from "react";
import { Box } from "@mui/material";
import Header from "../../../components/VersatileComponents/Header";
import CardTable from "../../../components/Card/Tables/branchTable";

const BranchCard = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Card Order"
        subtitle="Entire list of Card Orders"
        from="branch"
      />
      <CardTable />
    </Box>
  );
};

export default BranchCard;
