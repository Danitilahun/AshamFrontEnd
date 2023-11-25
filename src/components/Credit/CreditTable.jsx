import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import getData from "../../api/services/DeliveryGuy/getDeliveryGuy";
import { useAuth } from "../../contexts/AuthContext";
import { useSnackbar } from "../../contexts/InfoContext";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditCreditDialog from "./EditCreditDialog";
import getInternationalDate from "../../utils/getDate";
import updateCredit from "../../api/services/Credit/update.credit";
import deleteCredit from "../../api/services/Credit/delete.credit";
import { useBranch } from "../../contexts/BranchContext";
import RemoveCredit from "../../api/services/Credit/remove.credit";
import updateStatus from "../../api/services/Status/update.status";
import deleteStatus from "../../api/services/Status/delete.status";
import getDocumentById from "../../api/utils/getDocumentById";
import WarningIcon from "@mui/icons-material/Warning";
import { SpinnerContext } from "../../contexts/SpinnerContext";
const CreditTable = ({ type, bank = "null" }) => {
  const [admins, setAdmins] = useState([]);
  const param = useParams();
  const theme = useTheme();
  const { user } = useAuth();
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { activeness, deliveryGuy } = useBranch();
  const [openDialog, setOpenDialog] = useState(false);
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);

  const handleDeleteIconClick = (row) => {
    setSelectedCredit(row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const [userClaims, setUserClaims] = useState({});
  // ... (other states)

  // Use useEffect to fetch idTokenResult when the component mounts
  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {}
    }
    fetchUserClaims();
  }, [user]);

  const deliveryGuyId = localStorage.getItem("deliveryGuyId");
  let active = "";
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    const userData = JSON.parse(storedData);
    active = userData ? userData.active : "try";
  }

  if (!active) {
    const storedData2 = localStorage.getItem("active");
    if (storedData2) {
      const userData = JSON.parse(storedData2);
      active = userData ? userData.active : "try";
    }
  }

  useEffect(() => {
    let unsubscribe;
    if (bank === "null") {
      unsubscribe = getData(type, "branchId", param.id, setAdmins);
    } else {
      unsubscribe = getData(
        type,
        "branchId",
        param.id,
        setAdmins,
        "bank",
        bank
      );
    }
    return () => {
      unsubscribe();
    };
  }, [type, param.id]);

  useEffect(() => {
    localStorage.setItem("deliveryGuyId", "");
    return () => {
      localStorage.setItem("choosen", 0);
    };
  }, []);

  const [editFormValues, setEditFormValues] = useState({
    deliveryguyName: "",
    deliveryguyId: "",
    name: "",
    amount: "",
    placement: "",
    reason: "",
  });

  const { openSnackbar } = useSnackbar();

  const columns = [];
  if (type === "StaffCredit") {
    columns.push({ field: "name", headerName: "Name", flex: 0.35 });
    columns.push({ field: "placement", headerName: "Placement", width: 120 });
  } else if (type === "CustomerCredit") {
    columns.push({ field: "name", headerName: "Customer name", flex: 0.35 });
    columns.push({ field: "date", headerName: "Date", flex: 0.2 });
  } else if (type === "Status") {
    columns.push({ field: "name", headerName: "Expense", flex: 0.35 });
  } else if (type === "Bank") {
    columns.push({
      field: "transaction",
      headerName: "Transaction",
      flex: 0.3,
    });
    columns.push({ field: "date", headerName: "Date", flex: 0.3 });
  } else if (
    type === "DailyCredit" ||
    type === "Bonus" ||
    type === "Penality"
  ) {
    columns.push({
      field: "deliveryguyName",
      headerName: "Delivery guy name",
      flex: 0.3,
    });
  }

  if (type !== "Status" && type !== "Bank") {
    columns.push({
      field: "reason",
      headerName: "Reason",
      flex: 0.1,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={() => handleReturnClick(params.row)} // Assuming handleWatch is a function that takes a row parameter
            aria-label="Watch"
          >
            <RemoveRedEyeIcon />{" "}
          </IconButton>
        </div>
      ),
    });
  }

  columns.push({ field: "amount", headerName: "Amount", flex: 0.2 });
  if (type !== "Bank" && !userClaims.finance) {
    columns.push({
      field: "edit",
      headerName: "Edit",
      flex: 0.1,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="green"
          style={{ color: "blue" }}
          onClick={() => handleEditIconClick(params.row)}
        >
          <EditIcon />
        </IconButton>
      ),
    });
  }
  if (type !== "Bank" && !userClaims.finance) {
    columns.push({
      field: "delete",
      headerName: "Delete",
      flex: 0.1,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="red"
          style={{ color: "red" }}
          onClick={() => handleDeleteIconClick(params.row)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    });
  }

  const [open, setOpen] = useState(false);
  const [report, setReport] = useState("");
  const [numberOfCards, setNumberOfCards] = useState("");
  const [reason, setReason] = useState("");

  const handleDelete = async () => {
    handleDialogClose();
    setIsSubmitting(true);
    try {
      if (type === "Status") {
        await deleteStatus(user, selectedCredit.id, selectedCredit.active);
        openSnackbar(`${type} deleted successful!`, "success");
      } else {
        await deleteCredit(user, selectedCredit.id, type);
        openSnackbar(`${type} deleted successful!`, "success");

        await RemoveCredit(selectedCredit.id, user, selectedCredit);
      }
    } catch (error) {
      openSnackbar(
        `Error occurred while performing deleting ${type}.`,
        "error"
      );
    }
    setSelectedCredit(null);
    setIsSubmitting(false);
  };

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleEditIconClick = (row) => {
    setSelectedCredit(row);
    setEditFormValues({
      id: row.id ? row.id : "",
      deliveryguyName: row.deliveryguyName ? row.deliveryguyName : "",
      deliveryguyId: row.deliveryguyId ? row.deliveryguyId : "",
      name: row.name ? row.name : "",
      amount: row.amount ? row.amount : "",
      placement: row.placement ? row.placement : "",
      reason: row.reason ? row.reason : "",
    });
    handleOpenForm();
  };

  const handleReturnClick = (row) => {
    setOpen(true);
    setReport(row);
  };

  const handleClose = () => {
    setOpen(false);
    setNumberOfCards("");
    setReason("");
  };

  const handleSubmit = async (event) => {
    // Handle your action here
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = editFormValues;
      const date = getInternationalDate();
      formData.branchId = param.id;
      formData.date = date;
      formData.type = type;
      formData.diff =
        parseInt(formData.amount) - parseInt(selectedCredit.amount);
      if (type !== "DailyCredit" && type !== "Bonus" && type !== "Penality") {
        delete formData.deliveryguyId;
        delete formData.deliveryguyName;
      }
      if (type !== "StaffCredit") {
        delete formData.placement;
      }
      if (type === "DailyCredit" || type === "Bonus" || type === "Penality") {
        delete formData.name;
      }

      if (type === "Status") {
        delete formData.reason;
      }

      formData.active = active;
      const id = formData.id;

      delete formData.id;
      if (type === "Status") {
        await updateStatus(id, user, formData);
      } else {
        await updateCredit(id, user, formData);
      }
      openSnackbar(`${type} successfully created!`, "success");
      handleCloseForm();
    } catch {
      openSnackbar(`Error occured while creating ${type}!`, "error");
    }
    setIsSubmitting(false);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    let based_on;

    if (type === "Bonus") {
      based_on = "deliveryguyName";
    } else if (type === "Penalty") {
      based_on = "deliveryguyName";
    } else if (type === "DailyCredit") {
      based_on = "deliveryguyName";
    } else {
      based_on = "name";
    }
    if (searchTerm) {
      getData(type, based_on, searchTerm, (newData) => {
        setSearchResults(newData);
        setNoResults(newData.length === 0);
      });
    }
  };

  const handleClear = () => {
    setSearchTerm(""); // Clear search term
    setSearchResults([]); // Clear search results
    setNoResults(false); // Clear no results
  };

  const renderData = searchResults.length > 0 ? searchResults : admins;
  return (
    <>
      {type !== "Status" && type !== "Bank" ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "20px" }}
          >
            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
            />
            <Button onClick={handleSearch} style={{ marginLeft: "10px" }}>
              Search
            </Button>
            <Button onClick={handleClear}>Clear</Button>{" "}
            {/* Added Clear button */}
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <Box
        mt="20px"
        height={type === "Status" ? "40vh" : type === "Bank" ? "50vh" : "75vh"}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        {/* <DataGrid
          getRowId={(row) => row.id}
          rows={admins}
          columns={columns}
          pageSize={10}
        /> */}
        {!renderData && noResults ? (
          <Typography
            variant="h6"
            fontWeight="bold"
            style={{
              fontSize: "24px",
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <WarningOutlined
              color="error"
              fontSize="small"
              style={{ marginRight: "5px" }}
            /> */}
            Search results not found.
          </Typography>
        ) : (
          <DataGrid
            //   loading={isLoading || !data}
            getRowId={(row) => row.id}
            rows={renderData || []}
            columns={columns}
          />
        )}
        <EditCreditDialog
          open={showForm}
          onClose={handleCloseForm}
          // isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          editFormValues={editFormValues}
          setEditFormValues={setEditFormValues}
          type={type}
        />
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column", // Align content vertically
              minHeight: "30%", // Set a minimum height
              maxHeight: "70%", // Set a maximum height
            },
          }}
        >
          {report.reason === "" ? (
            <DialogTitle>New Asbeza Order</DialogTitle>
          ) : (
            <div></div>
          )}
          <DialogContent>
            {report.reason === "" ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    label="Number of card"
                    value={numberOfCards}
                    fullWidth
                    onChange={(e) => setNumberOfCards(e.target.value)}
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
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
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
                      onClick={handleClose}
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
                      onClick={handleSubmit}
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
            ) : (
              <div>
                <p>Reason is:</p>
                <p>{report.reason}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Confirm Creation</DialogTitle>
          <DialogContent>
            <div style={{ display: "flex", alignItems: "center" }}>
              <WarningIcon style={{ marginRight: "16px", color: "orange" }} />
              <DialogContentText>
                Are you sure you want to delete this {type}?
              </DialogContentText>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default CreditTable;
