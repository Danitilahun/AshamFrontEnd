import { Grid, TextField, useTheme } from "@mui/material";

const CustomEditTextField = ({
  name,
  label,
  value,
  type = "text",
  onChange,
  fullWidth = true,
}) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
      <TextField
        name={name}
        variant="outlined"
        label={label}
        value={value}
        type={type}
        onChange={onChange}
        fullWidth={fullWidth}
        required
        InputLabelProps={{
          shrink: true,
          style: { marginTop: "8px", color: theme.palette.secondary[100] },
        }}
      />
    </Grid>
  );
};

export default CustomEditTextField;
