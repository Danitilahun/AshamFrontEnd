import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/VersatileComponents/Header";
import AsbezaTable from "../../components/Asbeza/Tables/callcenterTable";

const Asbeza = () => {
  const theme = useTheme();
  return (
    <Box
      m="1.5rem 2.5rem"
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      {/* <Header
        title="Asbeza Order"
        subtitle="Entire list of Asbeza Orders"
        from={"callcenter"}
      /> */}
      <AsbezaTable />
    </Box>
  );
};

export default Asbeza;
