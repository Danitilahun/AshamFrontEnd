import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import getData from "../../api/services/DeliveryGuy/getDeliveryGuy";
import { useAuth } from "../../contexts/AuthContext";
import updateReport from "../../api/services/Report/update.report";
import { useSnackbar } from "../../contexts/InfoContext";

const ReportTable = ({ type }) => {
  const [admins, setAdmins] = useState([]);
  const param = useParams();
  const theme = useTheme();
  const { user } = useAuth();
  // console.log("danasdfskdagn", param.id);
  const { openSnackbar } = useSnackbar();
  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);

  useEffect(() => {
    const unsubscribe = getData(type, "beanchId", param.id, setAdmins);
    return () => unsubscribe();
  }, []);
  // console.log("admins", admins);
  const CardFeecolumns = [
    //   { field: "id", headerName: "ID", width: 70 },
    { field: "deliveryguyName", headerName: "Delivery Guy", width: 200 },
    { field: "numberOfCard", headerName: "Number of Cards", width: 120 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "price", headerName: "Price", width: 120 },
    {
      field: "returnCardNumber",
      headerName: "Return",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <span
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleReturnClick(params.row)}
        >
          {params.value} {/* Display the value from the field */}
        </span>
      ),
    },
  ];

  const CardDistributecolumns = [
    // { field: "id", headerName: "ID", flex: 0.1 },
    { field: "deliveryguyName", headerName: "Delivery Guy", flex: 0.3 },
    { field: "numberOfCard", headerName: "Number of Cards", flex: 0.3 },
    { field: "time", headerName: "Time", flex: 0.3 },
  ];

  const Hotelcolumns = [
    // { field: "id", headerName: "ID", flex: 0.1 },
    { field: "deliveryguyName", headerName: "Delivery Guy", flex: 0.3 },
    { field: "price", headerName: "Amount", flex: 0.3 },
    { field: "time", headerName: "Time", flex: 0.3 },
  ];

  const columns =
    type === "CardFee"
      ? CardFeecolumns
      : type === "hotelProfit"
      ? Hotelcolumns
      : CardDistributecolumns;
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState("");
  const [numberOfCards, setNumberOfCards] = useState("");
  const [reason, setReason] = useState("");

  console.log(columns);
  console.log(admins);
  const handleReturnClick = (row) => {
    setOpen(true);
    setReport(row);
    console.log(row);
  };

  const handleClose = () => {
    setOpen(false);
    setNumberOfCards("");
    setReason("");
  };

  const handleSubmit = async (event) => {
    // Handle your action here
    event.preventDefault();
    handleClose();
    setIsSubmitting(true);
    console.log("Number of cards:", numberOfCards);
    console.log("Reason:", reason);
    try {
      let formData = report;
      formData.reason = reason;
      formData.returnCardNumber = numberOfCards;
      await updateReport(report.id, user, formData);
      openSnackbar(`Report return done successful!`, "success");
    } catch (error) {
      openSnackbar(`Error occurred while performing updating Asbeza.`, "error");
    }

    setIsSubmitting(false);
  };

  console.log("column", columns);
  console.log("admin", admins);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleSearch = async () => {
    if (searchTerm) {
      getData(type, "deliveryguyName", searchTerm, (newData) => {
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

  console.log("searchResults-------------------------------", searchResults);
  const renderData = searchResults.length > 0 ? searchResults : admins;

  return (
    <>
      {isSubmitting && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              // marginLeft: "250px",
              marginBottom: "20px",
            }}
          >
            <CircularProgress
              style={{ color: "white", width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
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
      <Box
        mt="40px"
        mb="30px"
        height="75vh"
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
            <form onSubmit={handleSubmit}>
              {report.reason === "" ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      label="Number of card"
                      value={numberOfCards}
                      fullWidth
                      required
                      type="number"
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
                        onClick={handleClose}
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
                        // onClick={handleSubmit}
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
            </form>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default ReportTable;
