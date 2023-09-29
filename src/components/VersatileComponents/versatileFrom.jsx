// import React, { useContext, useEffect, useState } from "react";
// import {
//   Grid,
//   TextField,
//   Button,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   useTheme,
//   DialogActions,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import { useSnackbar } from "../../contexts/InfoContext";
// import { useAuth } from "../../contexts/AuthContext";
// import { useParams } from "react-router-dom";
// import getInternationalDate from "../../utils/getDate";
// import fetchData from "../../api/services/Users/getUser";
// import createCredit from "../../api/services/Credit/create.credit";
// import { useBranch } from "../../contexts/BranchContext";
// import createStatus from "../../api/services/Status/create.status";
// import createBank from "../../api/services/Bank/create.bank";
// import { useSelector } from "react-redux";
// import LoadingSpinner from "./LoadingSpinner";
// import useCollectionData from "../../hooks/useCollectionData";

// const CreditForm = ({ type }) => {
//   const [showForm, setShowForm] = useState(false);
//   const theme = useTheme();
//   const { openSnackbar } = useSnackbar();
//   const { user } = useAuth();
//   const [deliveryguys, setdeliveryGuys] = useState([]);
//   const { activeness } = useBranch();
//   const [transactionType, setTransactionType] = useState("");
//   const [userClaims, setUserClaims] = useState({});
//   const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);

//   const { selectedItemId, selectedItem, loading } = useSelector(
//     (state) => state.itemDetails
//   );

//   console.log("selectedItem----------react__redux", selectedItem);
//   console.log("selectedItemId----------react__redux", selectedItemId);
//   console.log("active --------------", selectedItem?.active);

//   let active = "";
//   let worker = [];
//   const storedData = localStorage.getItem("userData");
//   if (storedData) {
//     const userData = JSON.parse(storedData);
//     active = userData ? userData.active : "try";
//     worker = userData ? userData.worker : [];
//   }

//   console.log("Worker-------------", worker);
//   // Use useEffect to fetch idTokenResult when the component mounts
//   useEffect(() => {
//     async function fetchUserClaims() {
//       try {
//         const idTokenResult = await user.getIdTokenResult();
//         setUserClaims(idTokenResult.claims);
//       } catch (error) {
//         console.log("Error fetching user claims:", error);
//       }
//     }
//     fetchUserClaims();
//   }, [user]);

//   const handleTransactionTypeChange = (event) => {
//     setTransactionType(event.target.value);
//   };

//   console.log("activenss", activeness);

//   const [placementOptions, setPlacementOptions] = useState([
//     "BranchAdmin",
//     "DeliveryGuy",
//     "Finance",
//     "Cleaner",
//     "Keeper",
//     "Bike Technician",
//     "Wifi Technician",
//   ]);

//   const [roles, setRoles] = useState([
//     "DeliveryGuy",
//     "Cleaner",
//     "Keeper",
//     "Bike Technician",
//     "Wifi Technician",
//   ]);

//   const [bank, setBank] = useState([
//     "Commercial Bank of Ethiopia (CBE)",
//     "Bank of Abyssinia",
//     "Awash Bank",
//     "Abay Bank",
//     "Addis International Bank",
//     "Amhara Bank",
//     "Berhan Bank",
//     "Bunna Bank",
//     "Cooperative Bank of Oromia",
//     "Dashen Bank",
//     "Debub Global Bank",
//     "Enat Bank",
//     "Hibret Bank",
//     "Hijra Bank",
//     "Lion Bank",
//     "Nib Bank",
//     "Oromia Bank",
//     "Wegagen Bank",
//     "ZamZam Bank",
//     "Zemen Bank",
//     "Shabelle Bank",
//     "Ahadu Bank",
//     "Siinqee Bank",
//     "Tsehay Bank",
//   ]);

//   const params = useParams();
//   useEffect(() => {
//     const unsubscribe = fetchData("Deliveryturn", setdeliveryGuys);
//     return () => unsubscribe();
//   }, []);

//   const handleOpen = () => {
//     if (
//       (type === "Bonus" && selectedItem?.active === "") ||
//       (type === "Penality" && selectedItem?.active === "")
//     ) {
//       openSnackbar(
//         `You do not have a sheet. Create sheet before.Since ${type} need to be reduced from the delivery guy salary.`,
//         "info"
//       );
//     } else {
//       setShowForm(true);
//     }
//   };

//   const branchI = deliveryguys ? deliveryguys[params.id] : [];
//   const branchInfo = branchI?.map((item) => [
//     item.deliveryGuyName,
//     item.deliveryManId,
//   ]);

//   const [formData, setFormData] = useState({
//     deliveryguyName: "",
//     deliveryguyId: "",
//     name: "",
//     amount: "",
//     placement: "",
//     reason: "",
//     transaction: "",
//     address: "",
//     phone: "",
//     sector: "",
//     bank: "",
//     role: "",
//     isHolidayBonus: false,
//   });

//   const handleCloseForm = () => {
//     setShowForm(false);
//     setFormData({
//       deliveryguyName: "",
//       deliveryguyId: "",
//       name: "",
//       amount: "",
//       placement: "",
//       reason: "",
//       active: "",
//       role: "DeliveryGuy",
//       transaction: "",
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [field]: value,
//     }));
//   };
//   if (
//     formData.placement === "DeliveryGuy" ||
//     type === "DailyCredit" ||
//     type === "staffCredit"
//   ) {
//     formData.role = "DeliveryGuy";
//   }

//   if (type === "StaffCredit" && formData.placement === "") {
//     formData.placement = "DeliveryGuy";
//   }
//   let filteredData = worker?.filter((item) => item.role === formData.role);
//   let transformedData = filteredData?.map((item) => [item.name, item.id]);
//   if (type === "StaffCredit") {
//     filteredData = worker?.filter((item) => item.role === formData.placement);
//     transformedData = filteredData?.map((item) => [item.name, item.id]);
//   }
//   console.log("filteredData", filteredData);
//   const { data: admins } = useCollectionData("admin");
//   if (formData.placement === "BranchAdmin") {
//     transformedData = admins?.map((item) => [item.fullName, item.id]);
//   }
//   const { data: finances } = useCollectionData("finance");
//   if (formData.placement === "Finance") {
//     transformedData = finances?.map((item) => [item.fullName, item.id]);
//   }
//   useEffect(() => {
//     if (
//       type === "StaffCredit" &&
//       formData.placement === "DeliveryGuy" &&
//       (selectedItem?.active === "" || selectedItem?.active === "try")
//     ) {
//       openSnackbar(
//         `You do not have a sheet. Create sheet before try to give credit to Delivery guy. since it needs to be reduced from his salary.`,
//         "info"
//       );
//     }
//   }, [formData.placement]);

//   const handleSubmit = async (event) => {
//     // Send formData to the backend
//     event.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const date = getInternationalDate();
//       formData.branchId = params.id;
//       formData.date = date;
//       formData.type = type;

//       if (type !== "Bonus") {
//         delete formData.isHolidayBonus;
//       }
//       if (formData.placement) {
//         formData.name = formData.deliveryguyName;
//       }

//       if (type === "StaffCredit") {
//         delete formData.role;
//       }
//       if (formData.placement === "BranchAdmin") {
//         formData.name = formData.deliveryguyName;
//         formData.adminId = formData.deliveryguyId;
//       }

//       if (
//         type !== "DailyCredit" &&
//         type !== "Bonus" &&
//         type !== "Penality" &&
//         type !== "StaffCredit"
//       ) {
//         delete formData.deliveryguyId;
//         delete formData.deliveryguyName;
//       }
//       if (type !== "StaffCredit") {
//         delete formData.placement;
//       }

//       if (type !== "Bank") {
//         delete formData.transaction;
//         delete formData.bank;
//       }
//       if (
//         type === "DailyCredit" ||
//         type === "Bonus" ||
//         type === "Penality" ||
//         type === "Bank"
//       ) {
//         delete formData.name;
//       }

//       if (type !== "Expense") {
//         formData.active = selectedItem?.active;
//       }
//       if (type === "Expense" || type === "Bank") {
//         delete formData.reason;
//       }
//       // console.log("formData", formData);
//       // console.log(formData);
//       if (formData.type === "Expense") {
//         console.log("expense", formData);

//         await createStatus(formData, user);
//         openSnackbar(`${type} successfully created!`, "success");
//       } else if (formData.type === "Bank") {
//         formData.source = userClaims.admin ? "branches" : "finance";
//         console.log("bank", formData);
//         await createBank(formData, user);
//         openSnackbar(`${type} successfully created!`, "success");
//       } else if (formData.type === "Essentials") {
//         console.log("odd -------------", formData);
//         const newEssential = {
//           name: formData.name,
//           company: formData.reason,
//           phone: formData.amount,
//           date: formData.date,
//           type: formData.type,
//           address: formData.address,
//           sector: formData.sector,
//         };
//         console.log("-----------------", newEssential);
//         await createCredit(newEssential, user);
//         openSnackbar(`${type} successfully created!`, "success");
//       } else {
//         formData.active = selectedItem?.active;
//         formData.active = active;
//         console.log("here is the thing", formData);
//         const res = await createCredit(formData, user);
//         openSnackbar(`${res.data.message} successfully created!`, "success");
//       }

//       handleCloseForm();
//     } catch {
//       openSnackbar(`Error occured while creating ${type}!`, "error");
//     }
//     setIsSubmitting(false);
//   };

//   return (
//     <div>

//       {userClaims.superAdmin || userClaims.admin || userClaims.finance ? (
//         <div>
//           <Button variant="contained" color="primary" onClick={handleOpen}>
//             Create new {type !== "Expense" ? type : "Expense"}
//           </Button>

//           <Dialog
//             open={showForm}
//             onClose={handleCloseForm}
//             maxWidth="md"
//             fullWidth
//           >
//             <DialogTitle>New Asbeza Order</DialogTitle>
//             <DialogContent>
//               <form onSubmit={handleSubmit}>
//                 <Grid container spacing={2}>
//                   {type === "StaffCredit" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         select
//                         label="placement"
//                         required
//                         value={formData.placement}
//                         onChange={(e) =>
//                           handleInputChange("placement", e.target.value)
//                         }
//                         fullWidth
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       >
//                         <MenuItem value="">Select Placement</MenuItem>
//                         {placementOptions.map((placement) => (
//                           <MenuItem key={placement} value={placement}>
//                             {placement}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   {type === "Bonus" || type === "Penality" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         select
//                         label="Role"
//                         required
//                         value={formData.role}
//                         onChange={(e) =>
//                           handleInputChange("role", e.target.value)
//                         }
//                         fullWidth
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       >
//                         <MenuItem value="">Select Role</MenuItem>
//                         {roles.map((placement) => (
//                           <MenuItem key={placement} value={placement}>
//                             {placement}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   {type === "Bank" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         select
//                         label="Bank"
//                         required
//                         value={formData.bank}
//                         onChange={(e) =>
//                           handleInputChange("bank", e.target.value)
//                         }
//                         fullWidth
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       >
//                         <MenuItem value="">Select Placement</MenuItem>
//                         {bank.map((placement) => (
//                           <MenuItem key={placement} value={placement}>
//                             {placement}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   {(transformedData && type === "DailyCredit") ||
//                   formData.placement ||
//                   formData.role ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         select
//                         name="deliveryguyId"
//                         variant="outlined"
//                         fullWidth
//                         required
//                         value={formData.deliveryguyId}
//                         onChange={(e) => {
//                           const branchId = e.target.value;
//                           const branchName =
//                             transformedData.find(
//                               (branch) => branch[1] === branchId
//                             )?.[0] || ""; // Find the branch name using the branchId
//                           setFormData((prevFormData) => ({
//                             ...prevFormData,
//                             deliveryguyId: branchId,
//                             deliveryguyName: branchName,
//                           }));
//                         }}
//                         label={
//                           type !== "StaffCredit"
//                             ? formData.role
//                             : formData.placement
//                         }
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       >
//                         <MenuItem value="">Select Delivery Guy</MenuItem>
//                         {transformedData?.map((branch) => (
//                           <MenuItem key={branch[1]} value={branch[1]}>
//                             {branch[0]}
//                           </MenuItem>
//                         ))}
//                       </TextField>
//                     </Grid>
//                   ) : type !== "Bank" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label={type !== "Expense" ? "name" : "Expence"}
//                         value={formData.name}
//                         onChange={(e) =>
//                           handleInputChange("name", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   {type !== "Expense" && type !== "Bank" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label={
//                           type === "Essentials" ? "Company Name " : "reason"
//                         }
//                         value={formData.reason}
//                         onChange={(e) =>
//                           handleInputChange("reason", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   {type === "Bank" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         select
//                         label="Transaction Type"
//                         required
//                         value={formData.transaction}
//                         onChange={(e) =>
//                           handleInputChange("transaction", e.target.value)
//                         }
//                         fullWidth
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       >
//                         <MenuItem value="withdrawal">Withdrawal</MenuItem>
//                         <MenuItem value="deposit">Deposit</MenuItem>
//                       </TextField>
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}

//                   {type !== "Essentials" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="amount"
//                         value={formData.numberOfCard}
//                         onChange={(e) =>
//                           handleInputChange("amount", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         type="number"
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "CustomerCredit" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="Address"
//                         value={formData.address}
//                         onChange={(e) =>
//                           handleInputChange("address", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         // type="number"
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "CustomerCredit" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="Phone"
//                         value={formData.phone}
//                         onChange={(e) =>
//                           handleInputChange("phone", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         // type="number"
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "Essentials" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="Phone"
//                         value={formData.numberOfCard}
//                         onChange={(e) =>
//                           handleInputChange("amount", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "Essentials" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="Sector"
//                         value={formData.numberOfCard}
//                         onChange={(e) =>
//                           handleInputChange("sector", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "Essentials" && (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <TextField
//                         label="Address"
//                         value={formData.numberOfCard}
//                         onChange={(e) =>
//                           handleInputChange("address", e.target.value)
//                         }
//                         fullWidth
//                         required
//                         InputLabelProps={{
//                           shrink: true,
//                           style: {
//                             marginTop: "8px",
//                             color: theme.palette.secondary[100],
//                           },
//                         }}
//                       />
//                     </Grid>
//                   )}
//                   {type === "Bonus" && formData.role !== "DeliveryGuy" ? (
//                     <Grid item xs={12} sm={6} md={6} lg={6}>
//                       <FormControlLabel
//                         control={
//                           <Checkbox
//                             checked={formData.isHolidayBonus}
//                             onChange={(event) =>
//                               handleInputChange(
//                                 "isHolidayBonus",
//                                 event.target.checked
//                               )
//                             }
//                             name="isHolidayBonus"
//                             color="primary"
//                           />
//                         }
//                         label="Holiday Bonus"
//                       />
//                     </Grid>
//                   ) : (
//                     <div></div>
//                   )}
//                   <Grid
//                     item
//                     xs={12}
//                     container
//                     alignItems="end"
//                     justifyContent="end"
//                   >
//                     <DialogActions>
//                       <Button
//                         variant="contained"
//                         onClick={handleCloseForm}
//                         sx={{
//                           color: theme.palette.secondary[100],
//                           "&:hover": {
//                             backgroundColor: theme.palette.background.alt,
//                           },
//                         }}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         // onClick={handleSubmit}
//                         type="submit"
//                         variant="contained"
//                         sx={{
//                           color: theme.palette.secondary[100],
//                           "&:hover": {
//                             backgroundColor: theme.palette.background.alt,
//                           },
//                         }}
//                       >
//                         Submit
//                       </Button>
//                     </DialogActions>
//                   </Grid>
//                 </Grid>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       ) : (
//         <div></div>
//       )}
//     </div>
//   );
// };

// export default CreditForm;
