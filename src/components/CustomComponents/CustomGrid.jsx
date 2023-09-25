import { Grid } from "@mui/material";

const CustomGrid = ({ children }) => (
  <Grid container justifyContent="space-between" spacing={3}>
    {children}
  </Grid>
);

export default CustomGrid;
