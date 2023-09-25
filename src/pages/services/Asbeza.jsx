import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import AsbezaTable from "../../components/Asbeza/Tables/callcenterTable";

const Asbeza = () => {
  return (
    <Box m="1.5rem 2.5rem">
      <Header
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        from={"callcenter"}
      />
      <AsbezaTable />
    </Box>
  );
};

export default Asbeza;
