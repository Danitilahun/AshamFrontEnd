import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "./CustomPaper"; // Make sure to import your CustomPaper component

const CustomInfoRow = ({ label, value, marginTop, marginBottom }) => (
  <Grid item xs={12}>
    <CustomPaper marginTop={marginTop} marginBottom={marginBottom}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item xs={6}>
          {label}
        </Grid>
        <Grid item xs={6}>
          <CustomPaper>{value}</CustomPaper>
        </Grid>
      </Grid>
    </CustomPaper>
  </Grid>
);

export default CustomInfoRow;
