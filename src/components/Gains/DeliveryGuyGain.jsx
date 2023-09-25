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
import fetchData from "../../api/services/Users/getUser";
import editPrices from "../../api/services/prices/setPrices";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import useUserClaims from "../../hooks/useUserClaims";
const DeliveryGainGrid = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const { openSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userClaims = useUserClaims(user);

  useEffect(() => {
    const unsubscribe = fetchData("prices", setData);
    return () => unsubscribe();
  }, []);

  delete data.id;
  console.log(data);
  const showData = {
    fixedSalary: data ? data.fixedSalary : "",
    asbezaPrice: data ? data.asbezaPrice : "",
    card_collect_price: data ? data.card_collect_price : "",
    card_fee_price: data ? data.card_fee_price : "",
    card_distribute_price: data ? data.card_distribute_price : "",
    water_collect_price: data ? data.water_collect_price : "",
    wifi_collect_price: data ? data.wifi_collect_price : "",
    water_distribute_price: data ? data.water_distribute_price : "",
    wifi_distribute_price: data ? data.wifi_distribute_price : "",
  };

  const names = {
    fixedSalary: "Fixed Salary",
    asbezaPrice: "Asbeza Price",
    card_collect_price: "Card Collect Price",
    card_fee_price: "Card Fee Price",
    card_distribute_price: "Card Distribute Price",
    water_collect_price: "Water Collect Price",
    wifi_collect_price: "WiFi Collect Price",
    water_distribute_price: "Water Distribute Price",
    wifi_distribute_price: "WiFi Distribute Price",
  };

  const [editMode, setEditMode] = useState({
    fixedSalary: false,
    asbezaPrice: false,
    card_collect_price: false,
    card_fee_price: false,
    card_distribute_price: false,
    water_collect_price: false,
    wifi_collect_price: false,
    water_distribute_price: false,
    wifi_distribute_price: false,
  });

  const handleInputChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
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

    console.log({ [key]: parseInt(data[key], 10) });
    try {
      // Make an Axios PUT request to update the individual field
      await editPrices(user, { [key]: parseInt(data[key], 10) }, "update");
      openSnackbar(`${names[key]} updated successful!`, "success");
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
          Service Price Set
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(showData).map((key) => (
            <Grid item xs={12} md={6} key={key}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4} md={4}>
                  <Typography variant="subtitle1">{names[key]}</Typography>
                </Grid>
                <Grid item xs={4} md={4}>
                  <TextField
                    value={data[key]}
                    type="number"
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    disabled={!editMode[key] || !userClaims.superAdmin}
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

export default DeliveryGainGrid;
