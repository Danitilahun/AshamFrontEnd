import React, { useEffect, useRef, useState, useContext } from "react";
import "./DynamicTable.css";
import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@emotion/react";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Import the eye icon
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { useAuth } from "../../contexts/AuthContext";
import useUserClaims from "../../hooks/useUserClaims";
import { useSnackbar } from "../../contexts/InfoContext";
import returnedCard from "../../api/report/cardReturnHandle";
import { SpinnerContext } from "../../contexts/SpinnerContext";
import useWindowDimensions from "../../hooks/useWindowDimensions";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
const getColor = (statusNumber) => {
  let style = {
    color: "black",
  };

  if (0 <= statusNumber && statusNumber <= 5) {
    style.color = "green";
  } else if (statusNumber > 5 && statusNumber <= 15) {
    style.color = "blue";
  } else if (statusNumber > 15) {
    style.color = "red";
  }

  return style;
};

const getStatusStyle = (status) => {
  let style = {
    borderRadius: "4px",
    width: "fit-content",
    textAlign: "center",
    margin: "4px",
    color: "white",
    padding: "5px",
  };

  switch (status) {
    case "New Order":
      style = { ...style, background: "red" };
      break;
    case "Assigned":
      style.backgroundColor = "yellow";
      style.color = "black";
      break;
    case "Completed":
      style.backgroundColor = "green";
      break;
    default:
      break;
  }

  return style;
};

const DynamicTable = ({
  data,
  columns,
  loadMoreData,
  onEdit,
  onDelete,
  onNew,
  TableId = "normal",
  orderType = "asbeza",
  containerHeight = 500,
  from = "other",
}) => {
  const tableContainerRef = useRef(null);
  const theme = useTheme();
  const { user } = useAuth();
  const userClaims = useUserClaims(user);
  const [prevScrollPosition, setPrevScrollPosition] = useState(0); // Store the previous scroll position
  const { openSnackbar } = useSnackbar();
  const { setIsSubmitting } = useContext(SpinnerContext);
  const handleScroll = () => {
    const tableContainer = tableContainerRef.current;
    const scrollPosition = tableContainer.scrollTop;

    // Check if scrolling downwards
    if (scrollPosition > prevScrollPosition) {
      const maxScrollPosition =
        tableContainer.scrollHeight - tableContainer.clientHeight;

      // Check if the scroll is near the bottom (within a small threshold)
      const isScrollAtBottom = maxScrollPosition - scrollPosition < 1;

      if (isScrollAtBottom) {
        // The scroll has reached the end while scrolling downwards
        loadMoreData();
      }
    }

    // Update the previous scroll position
    setPrevScrollPosition(scrollPosition);
  };

  useEffect(() => {
    // Attach the scroll event listener to the .table-container element
    const tableContainer = tableContainerRef.current;
    tableContainer.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      tableContainer.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreData, prevScrollPosition]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // Store the selected row data for the dialog
  const [expense, setExpense] = useState([]);

  // Function to open the dialog and set the selected row data
  const openDialog = (row) => {
    setSelectedRow(row);
    setIsDialogOpen(true);
    const excludedProperties = [
      "Sheetstatus",
      "amount",
      "branchId",
      "totalIncome",
      "totalCredit",
      "dayRange",
      "date",
      "createdDate",
    ];

    // Create the setExpense array by filtering out excluded properties
    let setExpensesss = Object.entries(row)
      .filter(([key]) => !excludedProperties.includes(key))
      .map(([expense, amount]) => ({ expense, amount }));

    // Find the "Total Expense" entry, remove it, and push it to the end

    const taxpersentageIndex = setExpensesss.findIndex(
      (entry) => entry.expense === "taxPersentage"
    );
    if (taxpersentageIndex !== -1) {
      const taxpersentage = setExpensesss.splice(taxpersentageIndex, 1)[0];
      taxpersentage.amount = taxpersentage.amount + "%";
      setExpensesss.push(taxpersentage);
    }

    const totalExpenseIndex = setExpensesss.findIndex(
      (entry) => entry.expense === "totalExpense"
    );
    if (totalExpenseIndex !== -1) {
      const totalExpenseEntry = setExpensesss.splice(totalExpenseIndex, 1)[0];
      setExpensesss.push(totalExpenseEntry);
    }

    setExpense(setExpensesss);
  };

  const handleEdit = (row) => {
    onEdit(row); // Call the onEdit callback with the selected row data
  };
  const handleNew = (row) => {
    onNew(row); // Call the onEdit callback with the selected row data
  };

  const handleDelete = (id) => {
    onDelete(id); // Call the onDelete callback with the row id
  };

  const [orderPopupOpen, setOrderPopupOpen] = useState(false); // State for the order popup
  const [selectedOrder, setSelectedOrder] = useState([]); // Store the selected order array
  // Function to open the order popup
  const openOrderPopup = (order) => {
    setSelectedOrder(order);
    setOrderPopupOpen(true);
  };

  // Function to close the order popup
  const closeOrderPopup = () => {
    setOrderPopupOpen(false);
  };

  const [popupOpen, setPopupOpen] = useState(false); // State for the popup
  const [selectedItem, setSelectedItem] = useState([]); // Store the selected item array

  // Function to open the popup
  const openPopup = (item) => {
    setSelectedItem(item);
    setPopupOpen(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupOpen(false);
  };
  const [returnCardPopupOpen, setReturnCardPopupOpen] = useState(false);
  const [returnCardReason, setReturnCardReason] = useState("");
  const [returnCardCount, setReturnCardCount] = useState(0);

  const openReturnCardPopup = (reason, count) => {
    setReturnCardReason(reason);
    setReturnCardCount(count);
    setReturnCardPopupOpen(true);
  };

  const closeReturnCardPopup = () => {
    setReturnCardPopupOpen(false);
  };

  // Inside your component function
  // State variables for dialog
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [numberOfCards, setNumberOfCards] = useState(0);
  const [reason, setReason] = useState("");
  const [id, setId] = useState(null);

  // Function to open the registration dialog
  const openRegisterDialog = (card) => {
    setNumberOfCards(0);
    setReason("");
    setRegisterDialogOpen(true);
    setId(card.id);
  };

  // Function to close the registration dialog
  const closeRegisterDialog = () => {
    setRegisterDialogOpen(false);
  };

  // Function to handle form submission (registration)
  const handleRegistration = async (event) => {
    // Handle registration logic here
    event.preventDefault();
    setIsSubmitting(true);
    const Data = {
      returnCardNumber: numberOfCards,
      reason: reason,
    };

    try {
      const res = await returnedCard(user, id, Data);
      openSnackbar(res.data.message, "success");
      closeRegisterDialog();
    } catch (error) {
      if (error.response && error.response.data) {
        openSnackbar(
          error.response.data.message,
          error.response.data.type ? error.response.data.type : "error"
        );
      } else {
        openSnackbar(
          "An unexpected error occurred.Please kindly check your connection.",
          "error"
        );
      }
    }
    setIsSubmitting(false);
  };

  // ... Other code

  const numColumns = columns.length;
  const columnWidth = numColumns > 0 ? `calc(100vw / ${numColumns})` : "auto";

  const { screenWidth } = useWindowDimensions();
  const fontSize = screenWidth >= 1536 ? 15 : (screenWidth / 1536) * 15 + "px";
  return (
    <>
      {/* <Button onClick={}>

    </Button> */}
      <div
        className="DynamicTable"
        style={{
          color: theme.palette.secondary[200],
          backgroundColor: theme.palette.background.alt,
          fontSize: fontSize,
        }}
      >
        <div
          className="table-container"
          ref={tableContainerRef}
          style={{
            maxHeight: `${containerHeight}px`,
            border: `1px solid ${
              theme.palette.mode === "dark" ? "#323E8B" : "#C5C7D7"
            }` /* New */,
            borderRadius: ".1rem",
          }}
        >
          <table id={TableId} className="custom-table" width={"100vw"}>
            <colgroup>
              {columns.map((column) => (
                <col
                  key={column.key}
                  className={`col-${column.key}`}
                  style={{
                    // height: "3rem",
                    width: columnWidth,
                    color: theme.palette.secondary[200],
                    backgroundColor: theme.palette.background.alt,
                  }} // Add a class for each column
                />
              ))}
            </colgroup>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    className="header-cell ellipsis-cell"
                    style={{
                      // New
                      // height: "3rem",
                      color: theme.palette.secondary[50], // New
                      backgroundColor: theme.palette.background.alt, // New
                      borderBottom: `1px solid ${
                        theme.palette.mode === "dark" ? "#323E8B" : "#E4E6F2"
                      }` /* New */,
                    }}
                    key={column.key}
                    title={column.key.toString()}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((row, rowIndex) => (
                <tr
                  style={{
                    // New
                    background:
                      theme.palette.mode === "dark" ? "#333964" : "white", // New
                    borderBottom: `1px solid ${
                      theme.palette.mode === "dark" ? "#323E8B" : "#E4E6F2"
                    }` /* New */,
                  }}
                  className="datarow"
                  key={rowIndex}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="ellipsis-cell"
                      title={row[column.key]?.toString()}
                      style={{
                        color: theme.palette.secondary[50],
                      }}
                    >
                      {column.key === "edit" ? (
                        <IconButton
                          onClick={
                            from === "other" && userClaims.superAdmin
                              ? null
                              : () => handleEdit(row)
                          }
                          disabled={from === "other" && userClaims.superAdmin}
                        >
                          <EditIcon />
                        </IconButton>
                      ) : column.key === "status" ? (
                        <div
                          style={{
                            ...getStatusStyle(row[column.key]),
                          }}
                        >
                          {row[column.key]}
                        </div>
                      ) : column.key === "lastseen" ? (
                        <div
                          style={{
                            ...getColor(row[column.key]),
                          }}
                        >
                          {row[column.key]}
                        </div>
                      ) : column.key === "daysSinceBorrowed" ? (
                        <div
                          style={{
                            ...getColor(row[column.key]),
                          }}
                        >
                          {row[column.key]}
                        </div>
                      ) : column.key === "delete" ? (
                        <IconButton
                          onClick={
                            from === "other" && userClaims.superAdmin
                              ? null
                              : () => handleDelete(row.id)
                          }
                          disabled={from === "other" && userClaims.superAdmin}
                        >
                          <DeleteIcon />
                        </IconButton>
                      ) : column.key === "new" ? (
                        <IconButton
                          onClick={
                            from === "other" && userClaims.superAdmin
                              ? null
                              : () => handleNew(row)
                          }
                          disabled={from === "other" && userClaims.superAdmin}
                        >
                          <FiberNewIcon />
                        </IconButton>
                      ) : column.key === "order" ? (
                        <IconButton onClick={() => openOrderPopup(row.order)}>
                          <VisibilityIcon />
                        </IconButton>
                      ) : column.key === "transactionType" ? (
                        <div
                          onClick={() => {
                            openPopup(row);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {row[column.key]}
                        </div>
                      ) : column.key === "returnCardNumber" ? (
                        row[column.key] === 0 ? (
                          <div>
                            <button
                              disabled={userClaims.superAdmin}
                              onClick={() => openRegisterDialog(row)}
                              style={{ padding: 8, borderRadius: 10 }}
                            >
                              Register
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() =>
                                openReturnCardPopup(
                                  row.reason,
                                  row.returnCardNumber
                                )
                              }
                              style={{ padding: 8, borderRadius: 10 }}
                            >
                              Reason
                            </button>
                          </div>
                        )
                      ) : column.key === "totalExpense" ? (
                        // Open the dialog when "totalExpense" column is clicked
                        <div>
                          <span
                            onClick={() => openDialog(row)} // Open the dialog on click
                            style={{ cursor: "pointer" }}
                          >
                            {row[column.key]}
                          </span>
                        </div>
                      ) : typeof row[column.key] === "number" &&
                        column.key !== "numberOfCard" &&
                        column.key !== "rollNumber" &&
                        column.key !== "no" &&
                        column.key !== "dayRemain" ? (
                        row[column.key].toFixed(2)
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Dialog */}

        <Dialog
          open={popupOpen}
          onClose={closePopup}
          // fullWidth
          // maxWidth="xs" // Set maxWidth to "xs" to make it as wide as content
        >
          <DialogTitle
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            Details
          </DialogTitle>
          <DialogContent
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <div>
              {/* {row.transactionType ==="Deposit" ? (<p>Name: {selectedItem.name}</p>
              <p>Reason: {selectedItem.reason}</p>) : null} */}
              {selectedItem.transactionType === "Deposit" ? (
                <p>Name: {selectedItem.name}</p>
              ) : null}
              {selectedItem.transactionType === "Deposit" ? (
                <p>Placement: {selectedItem.placement}</p>
              ) : null}
              <p>
                Reason:{" "}
                {selectedItem.reason ? selectedItem.reason : "not provided."}
              </p>
            </div>
          </DialogContent>
          <DialogActions
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <Button onClick={closePopup}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            Total Expense Details
          </DialogTitle>
          <DialogContent
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            {/* Table for displaying wifi data */}
            {selectedRow && (
              <TableContainer
                component={Paper}
                style={{
                  color: theme.palette.secondary[200],
                  backgroundColor: theme.palette.background.alt,
                }}
              >
                <Table size="small">
                  <TableHead
                    style={{
                      color: theme.palette.secondary[200],
                      backgroundColor: "grey",
                    }}
                  >
                    <TableRow>
                      <TableCell>Expense</TableCell>
                      <TableCell>Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expense.map((wifiData, index) => (
                      <TableRow key={index}>
                        <TableCell>{wifiData.expense}</TableCell>
                        <TableCell>{wifiData.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={orderPopupOpen}
          onClose={closeOrderPopup}
          // fullWidth
          // maxWidth="xs" // Set maxWidth to "xs" to make it as wide as content
        >
          <DialogTitle
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            Order Details
          </DialogTitle>
          <DialogContent
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <ul>
              {selectedOrder.map((item, index) => (
                <li key={index}>
                  {index + 1}. {item}
                </li> // Add the number before each item
              ))}
            </ul>
          </DialogContent>
          <DialogActions
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <Button onClick={closeOrderPopup}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={returnCardPopupOpen} onClose={closeReturnCardPopup}>
          <DialogTitle
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            Return Card Reason
          </DialogTitle>
          <DialogContent
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <p>Number of Cards: {returnCardCount}</p>
            <p>Reason: {returnCardReason}</p>
          </DialogContent>
          <DialogActions
            style={{
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
            }}
          >
            <Button onClick={closeReturnCardPopup}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={registerDialogOpen}
          onClose={closeRegisterDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle sx={{ backgroundColor: theme.palette.background.alt }}>
            Register Return Card
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
            <form onSubmit={handleRegistration}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Number of Cards"
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
                <Grid item xs={12} sm={12} md={12} lg={12}>
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
                  <DialogActions
                    sx={{ backgroundColor: theme.palette.background.alt }}
                  >
                    <Button
                      onClick={closeRegisterDialog}
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
                      type="submit"
                      variant="contained"
                      sx={{
                        color: theme.palette.secondary[100],
                        "&:hover": {
                          backgroundColor: theme.palette.background.alt,
                        },
                      }}
                    >
                      Register
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default DynamicTable;
