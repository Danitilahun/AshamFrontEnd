import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper"; // Make sure to import your CustomPaper component
import CustomColoredPaper from "../CustomComponents/CustomColoredPaper"; // Make sure to import your CustomColoredPaper component

const ShowBudget = ({ label, value, marginTop }) => (
  <Grid item xs={12}>
    <CustomPaper marginTop={marginTop}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={6}>
          {label}
        </Grid>
        <Grid item xs={6}>
          {value}
        </Grid>
      </Grid>
    </CustomPaper>
  </Grid>
);

export default ShowBudget;
