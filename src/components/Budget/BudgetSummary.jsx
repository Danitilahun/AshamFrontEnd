import React from "react";
import { Grid } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper";
import InfoGridItem from "../VersatileComponents/InfoGridItem";

const BudgetSummary = ({ finalBudget, total, totalCredit }) => (
  <Grid item xs={12} md={12}>
    <CustomPaper>
      <Grid container spacing={2}>
        <InfoGridItem
          label={"Final Budget"}
          value={finalBudget ? finalBudget - total : "not available"}
        />
        <InfoGridItem
          label={"All Credit"}
          value={totalCredit ? totalCredit : "not available"}
        />
        <InfoGridItem
          label={"Next budget"}
          value={
            finalBudget ? finalBudget - total - totalCredit : "not available"
          }
        />
      </Grid>
    </CustomPaper>
  </Grid>
);

export default BudgetSummary;
