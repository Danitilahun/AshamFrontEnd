import React from "react";
import { Collapse, CardContent, Typography } from "@mui/material";
import CustomEllipsisTextField from "../CustomComponents/CustomEllipsisTextField";

const EmergencyInformation = ({ expanded, userInfo }) => {
  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <CardContent>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{
            fontWeight: "bold",
            marginBottom: "1rem",
            textAlign: "start",
          }}
        >
          {"Emergency Information"}
        </Typography>
        <CustomEllipsisTextField
          label="Name"
          value={userInfo.securityName}
          paddingBottom="0.3rem"
        />
        <CustomEllipsisTextField
          label="Phone"
          value={userInfo.securityPhone}
          paddingBottom="0.3rem"
        />
        <CustomEllipsisTextField
          label="Address"
          value={userInfo.securityAddress}
          paddingBottom="0.3rem"
        />
      </CardContent>
    </Collapse>
  );
};

export default EmergencyInformation;
