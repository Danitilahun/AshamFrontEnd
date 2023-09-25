import React from "react";
import { Grid, TextField } from "@mui/material";

const FormTextField = ({
  label,
  value,
  onChange,
  fullWidth,
  required,
  InputLabelProps,
  theme,
}) => {
  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <TextField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth={fullWidth}
        required={required}
        InputLabelProps={{
          shrink: true,
          style: {
            marginTop: "8px",
            color: theme.palette.secondary[100],
          },
          ...InputLabelProps,
        }}
      />
    </Grid>
  );
};

export default FormTextField;
