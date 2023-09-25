import { Typography, useTheme } from "@mui/material";

const CustomEllipsisTextField = ({
  label,
  value,
  paddingBottom = "0.5rem",
}) => {
  return (
    <Typography
      variant="h5"
      color="text.secondary"
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        paddingBottom: paddingBottom,
        paddingLeft: "0.5rem",
      }}
    >
      {label} : {value}
    </Typography>
  );
};

export default CustomEllipsisTextField;
