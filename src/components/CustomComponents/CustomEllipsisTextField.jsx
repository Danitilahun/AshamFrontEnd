import { Tooltip, Typography } from "@mui/material";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const CustomEllipsisTextField = ({
  label,
  value,
  paddingBottom = "0.5rem",
}) => {
  const { screenWidth } = useWindowDimensions();
  const fontSize = screenWidth >= 1536 ? 18 : (screenWidth / 1536) * 18 + "px";
  return (
    <Tooltip title={value}>
      <Typography
        variant="h5"
        color="text.secondary"
        fontSize={fontSize}
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
    </Tooltip>
  );
};

export default CustomEllipsisTextField;
