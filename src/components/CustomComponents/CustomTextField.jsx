import React from "react";
import { Grid, TextField, useTheme } from "@mui/material";

const CustomTextField = ({
  name,
  label,
  type = "text",
  isInputRequired = true,
}) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <TextField
        name={name}
        variant="outlined"
        fullWidth
        type={type}
        required={isInputRequired}
        InputLabelProps={{
          shrink: true,
          style: { marginTop: "8px", color: theme.palette.secondary[100] },
        }}
        label={label}
      />
    </Grid>
  );
};

export default CustomTextField;
