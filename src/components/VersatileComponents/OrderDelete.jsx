import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  useTheme,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
// Separate Confirmation Dialog component
const DeleteConfirmationDialog = ({
  open,
  handleDialogClose,
  handleUnPayConfirmed,
  handlePayConfirmed,
  message,
  title,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <WarningIcon style={{ marginRight: "16px", color: "orange" }} />
          <DialogContentText>{message}</DialogContentText>
        </div>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
        <Button
          onClick={handleDialogClose}
          backgroundColor={theme.palette.background.alt}
          sx={{
            color: theme.palette.secondary[100],
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUnPayConfirmed}
          backgroundColor={theme.palette.background.alt}
          sx={{
            color: theme.palette.secondary[100],
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          UnPay
        </Button>
        <Button
          onClick={handlePayConfirmed}
          backgroundColor={theme.palette.background.alt}
          sx={{
            color: theme.palette.secondary[100],
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          Pay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
