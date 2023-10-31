import React from "react";
import { CardContent, IconButton, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomEllipsisTextField from "../CustomComponents/CustomEllipsisTextField";

const BranchCardContent = ({ branchData, showMore, handleSeeMore }) => {
  const { address, manager, phone, account, numberofworker } = branchData;
  const theme = useTheme();
  return (
    <CardContent>
      <CustomEllipsisTextField label="Address" value={address} />
      <CustomEllipsisTextField
        label="Manager"
        value={manager ? manager : "Not assigned"}
      />
      <CustomEllipsisTextField
        label="Phone"
        value={phone ? phone : "Not assigned"}
      />
      <CustomEllipsisTextField
        label="TotalIncome"
        value={
          branchData?.budget?.totalIncome +
          (branchData?.status?.totalIncome || 0)
        }
      />
      <CustomEllipsisTextField
        label="TotalExpense"
        value={
          branchData?.budget?.totalExpense +
          (branchData?.status?.totalExpense || 0)
        }
      />
      <CustomEllipsisTextField
        label="Net"
        value={
          branchData?.budget?.totalIncome +
          (branchData?.status?.totalIncome || 0) -
          (branchData?.budget?.totalExpense +
            (branchData?.status?.totalExpense || 0))
        }
      />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          className="custom-button"
          onClick={handleSeeMore}
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            color: theme.palette.secondary[100],
            borderRadius: "10px",
          }}
        >
          {showMore ? (
            <ExpandLessIcon className="custom-button-expand-less" />
          ) : (
            <ExpandMoreIcon className="custom-button-expand-more" />
          )}
        </IconButton>
      </div>

      {showMore && (
        <>
          <CustomEllipsisTextField
            label="Account"
            value={account ? account : "Not assigned"}
          />
          <CustomEllipsisTextField
            label="Delivery Men"
            value={numberofworker ? numberofworker : 0}
          />
        </>
      )}
    </CardContent>
  );
};

export default BranchCardContent;
