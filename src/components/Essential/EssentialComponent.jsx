import React from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import Header from "../VersatileComponents/Header";
import EssentialTable from "./table";

const EssentialComponent = ({ isVisible }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "60px", // Adjust this margin based on your navbar's height
        left: "50%",
        transform: "translateX(-40%)",
        width: "70vw",
        height: "65vh",
        backgroundColor: theme.palette.background.alt,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.8)", // Shadow
        zIndex: 1000,
        visibility: isVisible ? "visible" : "hidden",
        padding: "20px",
        transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Header title="Essentials" subtitle="" />
      {/* <Paper elevation={3}>This is the essential component</Paper> */}
      <EssentialTable />
    </Box>
  );
};

export default EssentialComponent;
