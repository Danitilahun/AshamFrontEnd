import React, { useContext, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import WarningIcon from "@mui/icons-material/Warning";
import deleteCredit from "../../api/services/Credit/delete.credit";
import updateCredit from "../../api/services/Credit/update.credit";
import EditEssentialsDialog from "./EditEssentialsDialog";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import { SpinnerContext } from "../../contexts/SpinnerContext";
const updateFields = (targetObject, sourceObject) => {
  // Loop through the keys in the source object
  for (const key in sourceObject) {
    // Check if the key exists in both objects
    if (key in targetObject) {
      // Update the value in the target object
      targetObject[key] = sourceObject[key];
    }
  }
};

const GridItem = ({ item }) => {
  const theme = useTheme();
  const { openSnackbar } = useSnackbar();
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editFormValues, setEditFormValues] = useState({
    name: "",
    company: "",
    phone: "",
  });
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "...";
    }
    return text;
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleEditClick = () => {
    setEditFormValues({
      name: item.name,
      company: item.company,
      phone: item.phone,
    });
    handleOpenForm();
  };

  const handleDeleteClick = async () => {
    handleDialogClose();
    setIsSubmitting(true);
    try {
      await deleteCredit(user, item.id, "Essentials");
      openSnackbar(`Essentials deleted successful!`, "success");
    } catch (error) {
      openSnackbar(
        `Error occurred while performing deleting Essentials.`,
        "error"
      );
    }
    setIsSubmitting(false);
  };

  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (event) => {
    // Handle your action here
    event.preventDefault();
    setIsSubmitting(true);
    console.log("editFormValuesNew", editFormValues);
    try {
      updateFields(item, editFormValues);
      await updateCredit(item.id, user, item);
      openSnackbar(`Essentials successfully created!`, "success");
      handleCloseForm();
    } catch {
      openSnackbar(`Error occured while creating Essentials!`, "error");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      
      <Paper
        elevation={3}
        className="grid-labels"
        style={{
          marginTop: "16px",
          padding: "8px",
          backgroundColor: theme.palette.background.alt,
          //   color: theme.palette.secondary[700],
        }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          className="grid-item"
          // marginTop="10px"
          //   marginLeft="1px"
        >
          <Grid item xs={2}>
            <Typography variant="body1" className="item-text">
              {truncateText(item.name, 15)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" className="item-text">
              {truncateText(item.company, 20)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" className="item-text">
              {truncateText(item.sector, 15)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" className="item-text">
              {truncateText(item.address, 20)}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" className="item-text">
              {truncateText(item.phone, 15)}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={() => handleEditClick(item)}
              className="action-icon edit-icon"
            >
              <EditIcon />
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              onClick={handleDeleteIconClick}
              className="action-icon delete-icon"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>

      <EditEssentialsDialog
        open={showForm}
        onClose={handleCloseForm}
        // isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        editFormValues={editFormValues}
        setEditFormValues={setEditFormValues}
      />

      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleDeleteClick}
        message={"Are you sure you want to delete this Phone number?"}
        title={"Confirm essential deletion."}
      />
    </>
  );
};

export default GridItem;
