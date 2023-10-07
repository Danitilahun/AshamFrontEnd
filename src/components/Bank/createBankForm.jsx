import React, { useContext, useState } from "react";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { BankFormValidationSchema } from "./validation";
import { useSnackbar } from "../../contexts/InfoContext";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";
import getInternationalDate from "../../utils/getDate";
import createBank from "../../api/bank/create";
import CustomTextField from "../Credit/component/CustomTextField";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import getRequiredUserData from "../../utils/getBranchInfo";

const BankForm = ({ source }) => {
  const params = useParams();
  const [showForm, setShowForm] = useState(false);
  const { openSnackbar } = useSnackbar();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const theme = useTheme();
  const userData = getRequiredUserData();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);

  const [transactionType, settransactionType] = useState([
    "Deposit",
    "Withdraw",
  ]);

  const [bank, setBank] = useState([
    "Commercial Bank of Ethiopia (CBE)",
    "Bank of Abyssinia",
    "Awash Bank",
    "Abay Bank",
    "Addis International Bank",
    "Amhara Bank",
    "Berhan Bank",
    "Bunna Bank",
    "Cooperative Bank of Oromia",
    "Dashen Bank",
    "Debub Global Bank",
    "Enat Bank",
    "Hibret Bank",
    "Hijra Bank",
    "Lion Bank",
    "Nib Bank",
    "Oromia Bank",
    "Wegagen Bank",
    "ZamZam Bank",
    "Zemen Bank",
    "Shabelle Bank",
    "Ahadu Bank",
    "Siinqee Bank",
    "Tsehay Bank",
  ]);

  const handleButtonClick = () => {
    if (!userData.active) {
      openSnackbar("Please create sheet before.", "info");
      return;
    }
    setShowForm(true);
  };
  const formik = useFormik({
    initialValues: {
      transactionType: "",
      bankName: "",
      amount: "",
      reason: "",
      placement: "",
      name: "",
    },

    validationSchema: BankFormValidationSchema,
    onSubmit: async (values) => {
      // Send formData to the backend
      setIsSubmitting(true);
      try {
        const date = getInternationalDate();
        values.branchId = params.id;
        values.branchId = userClaims.finance
          ? user.uid
          : params.id
          ? params.id
          : user.displayName;
        values.calculatorId = userClaims.finance ? user.uid : userData.active;
        values.date = date;
        values.source = source;
        console.log("values", values);
        const res = await createBank(user, values);
        openSnackbar(`${res.data.message} successfully created!`, "success");
        handleCloseForm();
      } catch (error) {
        if (error.response && error.response.data) {
          openSnackbar(
            error.response.data.message,
            error.response.data.type ? error.response.data.type : "error"
          );
        } else {
          openSnackbar("An unexpected error occurred.", "error");
        }
      }
      setIsSubmitting(false);
    },
  });

  const handleCloseForm = () => {
    setShowForm(false);
    formik.resetForm();
  };

  console.log(formik.values.transactionType);
  return (
    <div>
      {userClaims.finance || userClaims.admin ? (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            Create New Bank
          </Button>

          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
              New Bank
            </DialogTitle>
            <DialogContent
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      select
                      name="transactionType"
                      label="transactionType"
                      required
                      value={formik.values.transactionType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      error={
                        formik.touched.transactionType &&
                        Boolean(formik.errors.transactionType)
                      }
                      helperText={
                        formik.touched.transactionType &&
                        formik.errors.transactionType
                      }
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          marginTop: "8px",
                          color: theme.palette.secondary[100],
                        },
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              backgroundColor: theme.palette.background.alt,
                              color: "inherit",
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Select transactionType</MenuItem>
                      {transactionType.map((transactionType) => (
                        <MenuItem key={transactionType} value={transactionType}>
                          {transactionType}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      select
                      name="bankName"
                      label="bankName"
                      required
                      value={formik.values.bankName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      error={
                        formik.touched.bankName &&
                        Boolean(formik.errors.bankName)
                      }
                      helperText={
                        formik.touched.bankName && formik.errors.bankName
                      }
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          marginTop: "8px",
                          color: theme.palette.secondary[100],
                        },
                      }}
                      SelectProps={{
                        MenuProps: {
                          PaperProps: {
                            style: {
                              backgroundColor: theme.palette.background.alt,
                              color: "inherit",
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="">Select bankName</MenuItem>
                      {bank.map((bankName) => (
                        <MenuItem key={bankName} value={bankName}>
                          {bankName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {formik.values.transactionType === "Deposit" && (
                    <CustomTextField
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}
                  {formik.values.transactionType === "Deposit" && (
                    <CustomTextField
                      name="reason"
                      label="Reason"
                      value={formik.values.reason}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}

                  {formik.values.transactionType === "Deposit" && (
                    <CustomTextField
                      name="placement"
                      label="placement"
                      value={formik.values.placement}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errors={formik.errors}
                      touched={formik.touched}
                    />
                  )}

                  <CustomTextField
                    name="amount"
                    label="Amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errors={formik.errors}
                    touched={formik.touched}
                    type="number"
                  />

                  <Grid
                    item
                    xs={12}
                    container
                    alignItems="end"
                    justifyContent="end"
                  >
                    <DialogActions
                      sx={{ backgroundColor: theme.palette.background.alt }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleCloseForm}
                        color="secondary"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained" color="primary">
                        Submit
                      </Button>
                    </DialogActions>
                  </Grid>
                </Grid>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default BankForm;
