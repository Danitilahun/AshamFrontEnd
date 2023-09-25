import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import editPrices from "../../api/services/prices/setPrices";
import fetchData from "../../api/services/Users/getUser";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";

const CompanyGainGrid = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState({});
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchData("companyGain", setCompanyData);
    return () => unsubscribe();
  }, []);

  delete companyData.id;

  console.log("company info", companyData);

  const showCompanyData = {
    card_distribute_gain: companyData ? companyData.card_distribute_gain : "",
    water_distribute_gain: companyData ? companyData.water_distribute_gain : "",
    wifi_distribute_gain: companyData ? companyData.wifi_distribute_gain : "",
    card_price: companyData ? companyData.card_price : "",
    asbeza_profit: companyData ? companyData.asbeza_profit : "",
  };

  console.log(showCompanyData);
  const names = {
    card_distribute_gain: "Card Distribute Gain",
    water_distribute_gain: "Water Distribute Gain",
    wifi_distribute_gain: "WiFi Distribute Gain",
    card_price: "Card Price",
    asbeza_profit: "Asbeza Profit",
  };

  const [editMode, setEditMode] = useState({
    card_distribute_gain: false,
    water_distribute_gain: false,
    wifi_distribute_gain: false,
    card_price: false,
    asbeza_profit: false,
  });

  const handleInputChange = (key, value) => {
    setCompanyData((prevCompanyData) => ({
      ...prevCompanyData,
      [key]: value,
    }));
  };

  const handleEditButtonClick = (key) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [key]: true,
    }));
  };

  const handleSaveButtonClick = async (key) => {
    setIsSubmitting(true);
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [key]: false,
    }));

    console.log({ [key]: parseInt(companyData[key], 10) });
    try {
      // Make an Axios PUT request to update the individual field
      await editPrices(
        user,
        { [key]: parseInt(companyData[key], 10) },
        "gainUpdate"
      );
      openSnackbar(`${names[key]} updated successfully!`, "success");
      // Optionally, you can handle success or show a notification to the user
    } catch (error) {
      // Handle error if necessary
      openSnackbar(error.message, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <LoadingSpinner isSubmitting={isSubmitting} />
      <Paper
        elevation={5}
        style={{
          padding: "20px",
          margin: "20px",
          backgroundColor: theme.palette.background.alt,
          color: theme.palette.secondary[300],
        }}
      >
        <Typography
          variant="h4"
          align="center"
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Company Gain Set
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(showCompanyData).map((key) => (
            <Grid item xs={12} md={6} key={key}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} md={4}>
                  <Typography variant="subtitle1">{names[key]}</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                  <TextField
                    value={companyData[key]}
                    type="number"
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    disabled={!editMode[key]}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4} md={4}>
                  {editMode[key] ? (
                    <Button
                      variant="contained"
                      onClick={() => handleSaveButtonClick(key)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleEditButtonClick(key)}
                    >
                      Edit
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  );
};

export default CompanyGainGrid;
