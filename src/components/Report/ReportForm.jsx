import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import createReport from "../../api/services/Report/create.report";
import getInternationalDate from "../../utils/getDate";
import getNumberOfDocumentsInCollection from "../../api/utils/getNumberOfDocument";
import Distribute from "../../api/services/Report/distribute";
import Collect from "../../api/services/Report/collect";
import HotelProfit from "../../api/services/Report/hotelProfit";
import fetchData from "../../api/services/Users/getUser";
import { useDispatch, useSelector } from "react-redux";
const ReportForm = ({ type }) => {
  const [showForm, setShowForm] = useState(false);
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [deliveryguys, setdeliveryGuys] = useState([]);
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  const params = useParams();

  const { selectedItemId, selectedItem, loading } = useSelector(
    (state) => state.itemDetails
  );

  let active = "";
  let worker = [];
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
    worker = userData ? userData.worker : [];
  }

  useEffect(() => {
    const unsubscribe = fetchData("Deliveryturn", setdeliveryGuys);
    return () => unsubscribe();
  }, []);

  const [undoTimer, setUndoTimer] = useState(null);
  const [remainingTime, setRemainingTime] = useState(5000);

  const startUndoTimer = () => {
    const startTime = Date.now();
    const remainingFromPrevious = undoTimer ? remainingTime : 0;
    setUndoTimer(
      setTimeout(async () => {
        await Submit();
        setUndoTimer(null);
      }, 5000 - remainingFromPrevious)
    );

    const countdownInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const remaining = 5000 - elapsed;

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        setRemainingTime(5000);
      } else {
        setRemainingTime(remaining);
      }
    }, 1000); // Update countdown every second
  };

  useEffect(() => {
    // Create a new Date object to get the current UTC time
    const currentTime = new Date();
    const options = {
      timeZone: "Asia/Tokyo", // Japanese time zone
      hour12: true, // Use 12-hour format
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const formattedTime = currentTime.toLocaleString("en-us", options);
    console.log("----------------- time -----------", formattedTime);
  });
  const cancelUndoTimer = () => {
    if (undoTimer) {
      clearTimeout(undoTimer);
      setUndoTimer(null);
      setRemainingTime(5000);
    }
  };

  const handleUndo = async () => {
    cancelUndoTimer();
  };

  const handleOpen = () => {
    if (selectedItem?.active === "") {
      openSnackbar(
        `You do not have a sheet. Create sheet before reporting ${type}.`,
        "info"
      );
    } else if (selectedItem?.activeTable === "") {
      openSnackbar(
        `You do not have active table today. Create sheet before reporting ${type}. since the delivery guy activity should be tracked.`,
        "info"
      );
    } else {
      setShowForm(true);
    }
  };

  // console.log("deliveryGuy", deliveryguys);
  // const branchI = deliveryguys ? deliveryguys[params.id] : [];
  // const branchInfo = branchI?.map((item) => [
  //   item.deliveryGuyName,
  //   item.deliveryManId,
  // ]);

  let filteredData = worker.filter((item) => item.role === "DeliveryGuy");
  let branchInfo = filteredData.map((item) => [item.name, item.id]);

  const [formData, setFormData] = useState({
    deliveryguyName: "",
    deliveryguyId: "",
    numberOfCard: "",
    price: "",
  });

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({
      deliveryguyName: "",
      deliveryguyId: "",
      numberOfCard: "",
      price: "",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Send formData to the backend
    startUndoTimer();
  };

  const Submit = async () => {
    setIsSubmitting(true);
    try {
      const currentTime = new Date();
      const options = {
        timeZone: "Asia/Tokyo", // Japanese time zone
        hour12: true, // Use 12-hour format
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };

      const formattedTime = currentTime.toLocaleString("en-us", options);

      formData.time = formattedTime;

      formData.beanchId = params.id;
      formData.createdDate = new Date();
      formData.returnCardNumber = 0;
      formData.reason = "";
      formData.type = type;

      if (selectedItem?.active === "") {
        openSnackbar(`You do not have a sheet. Create sheet before.`, "info");
      }
      formData.act = selectedItem?.active;
      console.log("formData", formData);
      await createReport(formData, user);
      openSnackbar(`Report successfully created!`, "success");
      setIsSubmitting(false);
      handleCloseForm();
      const date = getInternationalDate();
      const count = await getNumberOfDocumentsInCollection(
        "sheets",
        "branchId",
        formData.beanchId
      );

      if (type === "CardFee") {
        const collectData = {
          type: "CardFee",
          date: date,
          branchId: formData.beanchId,
          deliveryguyId: formData.deliveryguyId,
          sheetNumber: count,
          deliveryguyName: formData.deliveryguyName,
          price: parseInt(formData.price),
        };
        console.log("collectData", collectData);
        await Collect(collectData, user);
      }
      console.log("type", type);
      if (type === "cardDistribute") {
        const distributeData = {
          type: "cardDistribute",
          date: date,
          branchId: formData.beanchId,
          deliveryguyId: formData.deliveryguyId,
          sheetNumber: count,
          numberOfCard: parseInt(formData.numberOfCard),
          deliveryguyName: formData.deliveryguyName,
        };
        console.log("distributeData", distributeData);
        await Distribute(distributeData, user);
      }
      if (type === "waterReport") {
        const distributeData = {
          type: "waterDistribute",
          date: date,
          branchId: formData.beanchId,
          deliveryguyId: formData.deliveryguyId,
          sheetNumber: count,
          numberOfCard: parseInt(formData.numberOfCard),
          deliveryguyName: formData.deliveryguyName,
        };
        console.log("distributeData", distributeData);
        await Distribute(distributeData, user);
      }
      if (type === "wifiReport") {
        const distributeData = {
          type: "wifiDistribute",
          date: date,
          branchId: formData.beanchId,
          deliveryguyId: formData.deliveryguyId,
          sheetNumber: count,
          numberOfCard: parseInt(formData.numberOfCard),
          deliveryguyName: formData.deliveryguyName,
        };
        console.log("distributeData", distributeData);
        await Distribute(distributeData, user);
      }

      if (type === "hotelProfit") {
        const distributeData = {
          date: date,
          branchId: formData.beanchId,
          deliveryguyId: formData.deliveryguyId,
          sheetNumber: count,
          profit: parseInt(formData.price),
          deliveryguyName: formData.deliveryguyName,
        };
        console.log("distributeData", distributeData);
        await HotelProfit(distributeData, user);
      }
      setFormData({
        deliveryguyName: "",
        deliveryguyId: "",
        numberOfCard: "",
        price: "",
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(`Error occurred while creating report`, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {isSubmitting && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              // marginLeft: "250px",
              marginBottom: "20px",
            }}
          >
            <CircularProgress
              style={{ color: "white", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create new Report
      </Button>

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>New Asbeza Order</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  select
                  name="deliveryguyId"
                  variant="outlined"
                  fullWidth
                  required
                  value={formData.deliveryguyId}
                  onChange={(e) => {
                    const branchId = e.target.value;
                    const branchName =
                      branchInfo.find(
                        (branch) => branch[1] === branchId
                      )?.[0] || ""; // Find the branch name using the branchId
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      deliveryguyId: branchId,
                      deliveryguyName: branchName,
                    }));
                  }}
                  label="Delivery guy"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                >
                  <MenuItem value="">Select Delivery Guy</MenuItem>
                  {branchInfo?.map((branch) => (
                    <MenuItem key={branch[1]} value={branch[1]}>
                      {branch[0]}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {type !== "hotelProfit" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Number of card"
                    value={formData.numberOfCard}
                    onChange={(e) =>
                      handleInputChange("numberOfCard", e.target.value)
                    }
                    fullWidth
                    type="number"
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        marginTop: "8px",
                        color: theme.palette.secondary[100],
                      },
                    }}
                  />
                </Grid>
              ) : (
                <div></div>
              )}
              {type !== "cardDistribute" &&
              type !== "waterReport" &&
              type !== "wifiReport" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label={type !== "hotelProfit" ? "Price" : "Amount"}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    fullWidth
                    required
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        marginTop: "8px",
                        color: theme.palette.secondary[100],
                      },
                    }}
                  />
                </Grid>
              ) : (
                <div></div>
              )}

              <Grid
                item
                xs={12}
                container
                alignItems="end"
                justifyContent="end"
              >
                <DialogActions>
                  {undoTimer && (
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "12px", // Adjust the font size as needed
                        paddingRight: "10px", // Adjust the padding on the right as needed
                        color: theme.palette.secondary[100], // Text color
                      }}
                    >
                      Undo in: {Math.ceil(remainingTime / 1000)} seconds
                    </Typography>
                  )}
                  {undoTimer && (
                    <Button
                      onClick={handleUndo}
                      variant="outlined"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      Undo
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleCloseForm}
                    sx={{
                      color: theme.palette.secondary[100],
                      "&:hover": {
                        backgroundColor: theme.palette.background.alt,
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    // onClick={handleSubmit}
                    type="submit"
                    variant="contained"
                    sx={{
                      color: theme.palette.secondary[100],
                      "&:hover": {
                        backgroundColor: theme.palette.background.alt,
                      },
                    }}
                    disabled={undoTimer || isSubmitting}
                  >
                    Submit
                  </Button>
                </DialogActions>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportForm;
