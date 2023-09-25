import React from "react";
import { Paper, Typography } from "@mui/material";

const DashboardBox = ({ icon, number, name, backgroundColor }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 5,
        height: "100%",
        background: "linear-gradient(to right, blue, red)",
        paddingLeft: 3,
      }}
    >
      {icon}
      <Typography variant="h6" mt={2} sx={{ fontSize: "2rem" }}>
        {number}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {name}
      </Typography>
    </Paper>
  );
};

export default DashboardBox;
