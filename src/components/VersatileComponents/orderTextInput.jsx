import React from "react";
import { Grid, TextField } from "@mui/material";

const CustomTextField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  touched,
  type = "text",
  helperText,
  xs = 12, // Default value for xs
  sm = 6, // Default value for sm
  md = 6, // Default value for md
  lg = 6, // Default value for lg
  required = true, // Default value for required
}) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg}>
      <TextField
        label={label}
        name={name}
        value={value}
        onChange={(e) => onChange(name)(e)}
        onBlur={onBlur}
        fullWidth
        required={required}
        type={type}
        error={error && touched}
        helperText={error && touched ? helperText : ""}
        InputLabelProps={{
          shrink: true,
          style: {
            marginTop: "8px",
            color: "inherit",
          },
        }}
        InputProps={{ style: { width: "100%" } }}
      />
    </Grid>
  );
};

export default CustomTextField;
