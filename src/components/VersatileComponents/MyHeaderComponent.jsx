import React from "react";
import { Grid, Box, Typography, useTheme } from "@mui/material";
import SearchInput from "./SearchInput"; // Import your SearchInput component here
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";

const MyHeaderComponent = ({
  title,
  subtitle,
  onSearch,
  onCancel,
  formComponent: FormComponent,
  formProps,
  from = "other",
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);

  return (
    <Grid container spacing={2} style={{ marginBottom: "50px" }}>
      <Grid
        item
        xs={
          (from === "BonusPenality" && userClaims.finance) ||
          userClaims.superAdmin
            ? 6
            : 4
        }
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Box flex="1">
          <Typography
            variant="h2"
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            {title}
          </Typography>

          <Typography variant="h5" color={theme.palette.secondary[300]}>
            {subtitle}
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={
          (from === "BonusPenality" && userClaims.finance) ||
          userClaims.superAdmin
            ? 6
            : 5
        }
        sx={{
          display: "flex",
          justifyContent:
            (from === "BonusPenality" && userClaims.finance) ||
            userClaims.superAdmin
              ? "flex-end"
              : "center",
          alignItems: "center",
          //   margin: "0 30",
        }}
      >
        <SearchInput onSearch={onSearch} onCancel={onCancel} />
      </Grid>
      <Grid
        item
        xs={
          (from === "BonusPenality" && userClaims.finance) ||
          userClaims.superAdmin
            ? 0
            : 3
        }
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
