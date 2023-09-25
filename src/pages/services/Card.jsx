import React from "react";
import { Box } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import CardTable from "../../components/Card/Tables/callcenterTable";

const Card = () => {
  return (
    <>
      <Box m="1.5rem 2.5rem">
        <Header
          title="Card Orders"
          subtitle="Entire list of Card Orders"
          from={"callcenter"}
        />
        <CardTable />
      </Box>
    </>
  );
};

export default Card;
