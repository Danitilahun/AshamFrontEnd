import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper";
import CustomColoredPaper from "../CustomComponents/CustomColoredPaper";

const BudgetHeader = ({ date, budget }) => (
  <CustomPaper marginBottom={10} marginTop={40}>
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={3}>
        Budget
      </Grid>
      <Grid item xs={6}>
        {date}
      </Grid>
      <Grid item xs={3}>
        <CustomColoredPaper value={budget} />
      </Grid>
    </Grid>
  </CustomPaper>
);

export default BudgetHeader;
