import React from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import SearchInput from "./SearchInput"; // Import your SearchInput component here
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";

const MyHeaderComponent = ({
  onSearch,
  onCancel,
  formComponent: FormComponent,
  formProps,
}) => {
  const { user } = useAuth();
  const userClaims = useUserClaims(user);

  return (
    <Grid container spacing={2} style={{ marginBottom: "50px" }}>
      {userClaims.superAdmin && (
        <Grid item xs={userClaims.superAdmin ? 6 : 0}></Grid>
      )}
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          justifyContent: userClaims.superAdmin ? "flex-end" : "center",
          alignItems: "center",
          //   margin: "0 30",
        }}
      >
        <SearchInput onSearch={onSearch} onCancel={onCancel} />
      </Grid>
      <Grid
        item
        xs={userClaims.superAdmin ? 0 : 6}
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        {FormComponent && <FormComponent {...formProps} />}
      </Grid>
    </Grid>
  );
};

export default MyHeaderComponent;
