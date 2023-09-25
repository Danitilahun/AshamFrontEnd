import { Grid } from "@mui/material";
import React from "react";
import CustomPaper from "../CustomComponents/CustomPaper";
import InfoGridItem from "../VersatileComponents/InfoGridItem";

const RightGridItem = ({ documentData, day }) => (
  <Grid item xs={5} style={{ marginTop: "40px" }}>
    <CustomPaper>
      <Grid container spacing={2}>
        <InfoGridItem
          label="Total Income"
          value={documentData ? documentData["totalIncome"] : "not available"}
        />
        <InfoGridItem
          label="Total Expense"
          value={documentData ? documentData["totalExpense"] : "not available"}
        />
        <InfoGridItem
          label="Result"
          value={
            documentData
              ? documentData["totalIncome"] - documentData["totalExpense"]
              : "not available"
          }
        />
        <InfoGridItem
          label="Status"
          value={
            documentData
              ? documentData["totalIncome"] - documentData["totalExpense"] >= 0
                ? "Profit"
                : "Loss"
              : "not available"
          }
        />
        <InfoGridItem label="Date Range" value={day} />
      </Grid>
    </CustomPaper>
  </Grid>
);

export default RightGridItem;
