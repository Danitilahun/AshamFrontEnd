import React from "react";
import { Grid, TextField } from "@mui/material";

const CustomTextField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  errors,
  touched,
  type = "text",
  required = true,
}) => {
  const showError = Boolean(errors[name] && touched[name]); // <-- Change from 'label' to 'name'

  return (
    <Grid item xs={12} sm={6} md={6} lg={6}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange} // <-- Change to 'onChange(name)'
        onBlur={onBlur}
        fullWidth
        required={required}
        type={type}
        error={showError}
        helperText={showError ? errors[name] : ""} // <-- Change from 'label' to 'name'
        InputLabelProps={{
          shrink: true,
          style: {
            marginTop: "8px",
            color: "inherit",
          },
        }}
      />
    </Grid>
  );
};
export default CustomTextField;
