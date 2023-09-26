import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import CardTable from "../../components/Card/Tables/callcenterTable";

const Card = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        m="1.5rem 2.5rem"
        sx={{
          backgroundColor: theme.palette.background.default,
          height: "100%",
          position: "relative",
        }}
      >
        {/* <Header
          title="Card Orders"
          subtitle="Entire list of Card Orders"
          from={"callcenter"}
        /> */}
        <CardTable />
      </Box>
    </>
  );
};

export default Card;
