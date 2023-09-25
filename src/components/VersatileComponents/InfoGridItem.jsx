import React from "react";
import { Grid, Paper, useTheme } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper";

const InfoGridItem = ({ label, value }) => {
  return (
    <Grid item xs={12} md={12}>
      <Grid container justifyContent="space-between" spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomPaper>{label}</CustomPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomPaper>{value}</CustomPaper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default InfoGridItem;
