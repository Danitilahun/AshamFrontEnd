import DeliveryGainGrid from "../../components/Gains/DeliveryGuyGain";
import CompanyGainGrid from "../../components/Gains/CompanyGain";
import { useTheme } from "@mui/material";

const Setting = () => {
  const theme = useTheme();
  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        height: "100%",
        position: "relative",
      }}
    >
      <DeliveryGainGrid />
      <CompanyGainGrid />
    </div>
  );
};

export default Setting;
