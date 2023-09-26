import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../VersatileComponents/LoadingSpinner";
import getRequiredUserData from "../../utils/getBranchInfo";
import ConfirmationDialog from "../VersatileComponents/ConfirmationDialog";
import HolidayBonus from "../../api/bonusPenality/holidayBonus";
import useUserClaims from "../../hooks/useUserClaims";
const BonusDialog = ({ worker, id = null }) => {
  const [open, setOpen] = useState(false);
  const [bonusText, setBonusText] = useState(0);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const branchData = getRequiredUserData();
  const theme = useTheme();
  const userClaims = useUserClaims(user);
  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleOpen = () => {
    if (!branchData.active) {
      openSnackbar("There is not salary table for this branch", "info");
      return;
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBonusChange = (event) => {
    setBonusText(event.target.value);
  };

  const handleBonusSubmit = async () => {
    console.log("Bonus submitted:", bonusText);
    setOpen(false);
    setIsSubmitting(true);
    handleDialogClose();

    try {
      const amount = bonusText === "" ? 0 : bonusText;
      if (parseInt(amount) === 0) {
        openSnackbar(
          `You are try to give 0 holiday bonus to all your ${worker} .`,
          "info"
        );
        setBonusText("");
        setIsSubmitting(false);
        return;
      }

      if (branchData.active !== "") {
        const BonusData = {
          salaryTableId: branchData.active,
          branchId: branchData.requiredId,
          holidayBonus: parseInt(amount),
          employeeId: id,
        };
        const res = await HolidayBonus(BonusData, user, worker);
        openSnackbar(res.data.message, "success");
      }
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    console.log("issubmitting", isSubmitting);
    setBonusText("");
    setIsSubmitting(false);
  };

  return (
    <div>
      <LoadingSpinner isSubmitting={isSubmitting} />
      {userClaims.admin ? (
        <Button
          variant="contained"
          disabled={userClaims.superAdmin}
          color="primary"
          onClick={handleOpen}
          sx={{ backgroundColor: id ? "green" : "none" }}
        >
          Holiday Bonus
        </Button>
      ) : null}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
          Add Bonus
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <DialogContentText>Please enter the bonus details.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Bonus"
            fullWidth
            type="number"
            value={bonusText}
            onChange={handleBonusChange}
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
            onClick={handleDeleteIconClick}
            color="primary"
            variant="contained"
            sx={{
              color: theme.palette.secondary[100],
              "&:hover": {
                backgroundColor: theme.palette.background.alt,
              },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={openDialog}
        handleDialogClose={handleDialogClose}
        handleConfirmed={handleBonusSubmit}
        message={` Are you sure you want to give ${
          bonusText === "" ? 0 : bonusText
        }
        as Holiday Bonus for ${
          worker === "deliveryGuy"
            ? "all active"
            : worker === "staff"
            ? "all"
            : ""
        } ${worker}?`}
        title={`Confirm Holiday Bonus`}
      />
    </div>
  );
};

export default BonusDialog;
