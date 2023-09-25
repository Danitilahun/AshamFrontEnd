import React from "react";
import { CardContent, IconButton, Typography } from "@mui/material";
import CustomEllipsisTextField from "../CustomComponents/CustomEllipsisTextField";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AsbezaCardContent = ({
  name,
  blockHouse,
  phone,
  branchName,
  deliveryguyName,
  additionalInfo,
  showMore,
  handleSeeMore,
  order,
  theme,
}) => {
  return (
    <CardContent>
      <CustomEllipsisTextField label="Name" value={name} />
      <CustomEllipsisTextField label="Block House" value={blockHouse} />
      <CustomEllipsisTextField label="Phone" value={phone} />
      <CustomEllipsisTextField label="Branch Name" value={branchName} />
      <CustomEllipsisTextField label="Delivery Guy" value={deliveryguyName} />
      <CustomEllipsisTextField label="Additional Info" value={additionalInfo} />

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
          <Typography variant="h6">Orders:</Typography>
          {order?.map((order, index) => (
            <Typography key={index} variant="body1" color="text.secondary">
              {order}
            </Typography>
          ))}
        </>
      )}
    </CardContent>
  );
};

export default AsbezaCardContent;
