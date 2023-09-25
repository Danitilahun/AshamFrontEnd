import React, { useEffect, useState } from "react";
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

function ReminderComponent({ type }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const params = useParams();
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
          >
            Set Reminder
          </Button>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Select a Date</DialogTitle>
          <DialogContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
              Set
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}

export default ReminderComponent;
