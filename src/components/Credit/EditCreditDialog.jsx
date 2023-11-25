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
} from "@mui/material";
import fetchData from "../../api/services/Users/getUser";
import { useParams } from "react-router-dom";

const EditCreditDialog = ({
  open,
  onClose,
  isSubmitting,
  onSubmit,
  editFormValues,
  setEditFormValues,
  type,
}) => {
  const [deliveryGuy, setDeliveryGuy] = useState([]);
  const theme = useTheme();
  const param = useParams();
  useEffect(() => {
    const unsubscribe = fetchData("Deliveryturn", setDeliveryGuy);
    return () => unsubscribe();
  }, []);

  const deliveryMan = deliveryGuy ? deliveryGuy[param.id] : [];
  const deliveryman = deliveryMan?.map((item) => [
    item.deliveryGuyName,
    item.deliveryManId,
  ]);

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
              {["DailyCredit", "Bonus", "Penality"].includes(type) ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    select
                    name="deliveryguyId"
                    variant="outlined"
                    fullWidth
                    required
                    value={editFormValues.deliveryguyId}
                    onChange={(e) => {
                      const branchId = e.target.value;
                      const branchName =
                        deliveryman.find(
                          (branch) => branch[1] === branchId
                        )?.[0] || ""; // Find the branch name using the branchId
                      setEditFormValues((preveditFormValues) => ({
                        ...preveditFormValues,
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
                    {deliveryman?.map((branch) => (
                      <MenuItem key={branch[1]} value={branch[1]}>
                        {branch[0]}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="name"
                    value={editFormValues.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    fullWidth
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
              )}

              {type === "StaffCredit" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="placement"
                    required
                    value={editFormValues.placement}
                    onChange={(e) =>
                      handleInputChange("placement", e.target.value)
                    }
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
              ) : (
                <div></div>
              )}

              {type !== "Status" ? (
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="reason"
                    required
                    value={editFormValues.reason}
                    onChange={(e) =>
                      handleInputChange("reason", e.target.value)
                    }
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
              ) : (
                <div></div>
              )}
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  label="amount"
                  value={editFormValues.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  fullWidth
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

export default EditCreditDialog;
