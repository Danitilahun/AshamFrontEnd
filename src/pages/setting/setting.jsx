import DeliveryGainGrid from "../../components/Gains/DeliveryGuyGain";
import CompanyGainGrid from "../../components/Gains/CompanyGain";
import { useTheme } from "@mui/material";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Setting</title>
        {/* <link rel="canonical" href="http://localhost:3000/" /> */}
        <meta
          name="description"
          content="List of prices for company gain and delivery guy gain"
        />
      </Helmet>
      <DeliveryGainGrid />
      <CompanyGainGrid />
    </div>
  );
};

export default Setting;
