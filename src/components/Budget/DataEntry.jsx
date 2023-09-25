import React from "react";
import { Grid, Paper, useTheme } from "@mui/material";

const DataEntry = ({ data, status, amount }) => {
  const theme = useTheme();

  return (
    <Grid item xs={12} md={12}>
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid item xs={4} md={4}>
          <Paper
            style={{
              padding: 16,
              textAlign: "center",
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
            }}
          >
            {data}
          </Paper>
        </Grid>
        <Grid item xs={4} md={4}>
          <Paper
            style={{
              padding: 16,
              textAlign: "center",
              color: theme.palette.secondary[500],
              backgroundColor: status === "profit" ? "green" : "red",
              borderRadius: 10,
              boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            {status}
          </Paper>
        </Grid>
        <Grid item xs={4} md={4}>
          <Paper
            style={{
              padding: 16,
              textAlign: "center",
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
            }}
          >
            {amount}
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DataEntry;
