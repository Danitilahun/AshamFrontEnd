import React from "react";
import CreditTable from "../Credit/CreditTable";
import { Grid } from "@mui/material";
import CustomPaper from "../CustomComponents/CustomPaper";
import InfoGridItem from "../VersatileComponents/InfoGridItem";

const LeftGridItem = ({ documentData }) => (
  <Grid item xs={7}>
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <CreditTable type={"Status"} />
      </Grid>
      <Grid item xs={12} md={12}>
        <CustomPaper>
          <Grid container spacing={2}>
            <InfoGridItem
              label="Total staff salary"
              value={
                documentData
                  ? documentData["totalStaffSalary"]
                  : "not available"
              }
            />
            <InfoGridItem
              label="Tax"
              value={documentData ? documentData["totaltax"] : "not available"}
            />
            <InfoGridItem
              label="Total Expense"
              value={
                documentData ? documentData["totalExpense"] : "not available"
              }
            />
          </Grid>
        </CustomPaper>
      </Grid>
    </Grid>
  </Grid>
);

export default LeftGridItem;
