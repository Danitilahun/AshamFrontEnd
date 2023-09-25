import React from "react";
import { Paper, useTheme } from "@mui/material";

const CustomColoredPaper = ({ value, color = "green" }) => {
  const theme = useTheme();
  return (
    <Paper
      style={{
        padding: 10,
        textAlign: "center",
        color: theme.palette.secondary[500],
        backgroundColor: "grey",
        borderRadius: 10,
        boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
      }}
    >
      {value}
    </Paper>
  );
};

export default CustomColoredPaper;
