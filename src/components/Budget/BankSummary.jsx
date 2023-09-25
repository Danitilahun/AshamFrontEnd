import React from "react";
import { Grid } from "@mui/material";
import ShowBudget from "./ShowBudget";
import CreditTable from "../Credit/CreditTable";

const BankSummary = ({ total, finalBudget, totalExpense, totalCredit }) => (
  <Grid item xs={5}>
    <Grid item xs={12}>
      <CreditTable type={"Bank"} />
    </Grid>

    <ShowBudget
      label={"Total Amount"}
      value={total ? total : "not available"}
      marginTop={5}
    />

    <ShowBudget
      label={"Bank Account"}
      value={
        finalBudget
          ? finalBudget - total - totalCredit - totalExpense
          : "not available"
      }
      marginTop={5}
    />
  </Grid>
);

export default BankSummary;
