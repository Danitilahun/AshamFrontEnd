// EditBranchDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";
import CustomEditTextField from "../CustomComponents/CustomEditTextField";

const EditBranchDialog = ({
  open,
  onClose,
  onSubmit,
  editFormValues,
  setEditFormValues,
}) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Branch</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <CustomEditTextField
              label="Name"
              name="name"
              value={editFormValues.name}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  name: e.target.value,
                })
              }
            />

            <CustomEditTextField
              label="Address"
              name="address"
              value={editFormValues.address}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  address: e.target.value,
                })
              }
            />

            <CustomEditTextField
              label="Budget"
              name="budget"
              type={"number"}
              value={editFormValues.budget}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  budget: e.target.value,
                })
              }
            />

            <CustomEditTextField
              label="Phone"
              name="phone"
              value={editFormValues.phone}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  phone: e.target.value,
                })
              }
            />

            <CustomEditTextField
              name="account"
              label="Account"
              type={"number"}
              value={editFormValues.account}
              onChange={(e) =>
                setEditFormValues({
                  ...editFormValues,
                  account: e.target.value,
                })
              }
            />
          </Grid>
          <DialogActions>
            <Button
              variant="contained"
              onClick={onClose}
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
              variant="contained"
              type="submit"
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranchDialog;
