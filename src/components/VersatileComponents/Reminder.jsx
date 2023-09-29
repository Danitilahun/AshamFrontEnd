import React, { useContext, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../contexts/InfoContext";
import getDataFromCollectionWithCriteria from "../../api/utils/getDataFromCollectionWithCriteria";
import Reminder from "../../api/orders/reminder";
import { useTheme } from "@mui/material";

function ReminderComponent({ type }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const params = useParams();
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const [documentData, setDocumentData] = useState(null);
  const [daysDifference, setDaysDifference] = useState(0); // Initialize with 0

  function calculateDateDifference(targetDate) {
    const currentDate = new Date();
    const targetDateObject = new Date(targetDate);

    const timeDifference = targetDateObject - currentDate;

    // Convert time difference to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return -daysDifference; // Return positive days difference
  }

  useEffect(() => {
    const collectionName = "reminders";
    const conditionField1 = "callcenterId";
    const conditionValue1 = params.id;
    const conditionField2 = "type";
    const conditionValue2 = type === "Water Order" ? "water" : "wifi";

    const unsubscribe = getDataFromCollectionWithCriteria(
      collectionName,
      conditionField1,
      conditionValue1,
      conditionField2,
      conditionValue2,
      (updatedData) => {
        setDocumentData(updatedData);
        if (updatedData?.date) {
          const targetDate = new Date(updatedData.date);
          const newDaysDifference = calculateDateDifference(targetDate);
          setDaysDifference(newDaysDifference);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [params.id, type]);

  const handleSetReminder = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    if (selectedDate) {
      console.log("Selected date:", selectedDate);
      setOpen(false);
      try {
        const formData = {
          date: selectedDate,
          callcenterId: params.id ? params.id : user.uid,
          type: type === "Water Order" ? "water" : "wifi",
        };
        await Reminder(formData, user);
        openSnackbar("Reminder set successfully!", "success");
      } catch (error) {
        console.error("Error during form submission:", error);
        openSnackbar(error.message, "error");
      }
    }
  };

  return (
    <>
      <Grid container spacing={0.3} alignItems="center">
        <Grid item xs={6}>
          <Grid container spacing={0.1} alignItems="center">
            <Grid
              item
              xs={12}
              style={{
                backgroundColor: 30 - daysDifference < 3 ? "red" : "green",
                borderRadius: "10px",
                padding: "10px",
                margin: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">
                {30 - daysDifference} days left
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSetReminder}
            height="50%"
          >
            Set Reminder
          </Button>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
            Select a Date
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.alt,
              width: "200px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            // sx={{
            //   width: "400px", // Set the width to your desired value
            //   height: "300px", // Set the height to your desired value
            // }}
          >
            <input
              type="date"
              value={selectedDate}
              style={{
                width: "100%",
                height: "50%",
                padding: "10px",
                margin: "10px",
              }}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
            <Button
              onClick={handleClose}
              color="primary"
              variant="contained"
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
              onClick={handleConfirm}
              color="primary"
              variant="contained"
              sx={{
                color: theme.palette.secondary[100],
                "&:hover": {
                  backgroundColor: theme.palette.background.alt,
                },
              }}
            >
              Set
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default ReminderComponent;
