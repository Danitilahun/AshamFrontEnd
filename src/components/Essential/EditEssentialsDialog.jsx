import React, { useEffect, useState } from "react";
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
} from "@mui/material";

const EditEssentialsDialog = ({
  open,
  onClose,
  onSubmit,
  editFormValues,
  setEditFormValues,
}) => {
  const theme = useTheme();
  console.log("editFormValues", editFormValues);

  const handleInputChange = (field, value) => {
    setEditFormValues((preveditFormValues) => ({
      ...preveditFormValues,
      [field]: value,
    }));
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>New Asbeza Order</DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Name"
                  required
                  value={editFormValues.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Company"
                  required
                  value={editFormValues.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="Phone"
                  required
                  value={editFormValues.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      marginTop: "8px",
                      color: theme.palette.secondary[100],
                    },
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                container
                alignItems="end"
                justifyContent="end"
              >
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
                    // onClick={onSubmit}
                    type="submit"
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
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditEssentialsDialog;
