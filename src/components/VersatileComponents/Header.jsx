import { Typography, Box, useTheme, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import React, { useContext, useEffect, useState } from "react";
import FormPopup from "../User/FormPopup";
// import BranchForm from "../Branch/BranchForm";
import { useAuth } from "../../contexts/AuthContext";
import { useBranch } from "../../contexts/BranchContext";
import { useSnackbar } from "../../contexts/InfoContext";
import { useParams } from "react-router-dom";
// import AsbezaOrderForm from "../Asbeza/AsbezaOrder";
import ReminderComponent from "./Reminder";
import CreditForm from "./versatileFrom";
import BonusDialog from "../BonusPenality/Bonus";
import CustomerCreditForm from "../Credit/createCreditForm/customerCredit";
import DailyCreditForm from "../Credit/createCreditForm/dailyCredit";
import StaffCreditForm from "../Credit/createCreditForm/staffCredit";
import CardFeeReportForm from "../Report/createReportForm/cardFee";
import CardDistributeReportForm from "../Report/createReportForm/cardDistribute";
import WifiDistributeReportForm from "../Report/createReportForm/wifiDistribute";
import WaterDistributeReportForm from "../Report/createReportForm/waterDIstribute";
import HotelProfitReportForm from "../Report/createReportForm/hospitalProfit";
import BranchForm from "../Branch/createBranchForm/branchForm";
import AdminRegisterForm from "../User/createUserForm/Adminform";
import CallcenterRegisterForm from "../User/createUserForm/CallCenterForm";
import DeliveryGuyRegisterForm from "../User/createUserForm/DeliveryGuyForm";
import FinanceRegisterForm from "../User/createUserForm/FinanceForm";
import StaffRegisterForm from "../User/createUserForm/StaffForm";
import { date } from "yup";
import getInternationalDate from "../../utils/getDate";
import createSheet from "../../api/sheet/create";
import ConfirmationDialog from "./ConfirmationDialog";
import getNumberOfDocumentsInCollection from "../../api/utils/getNumberOfDocument";
import AsbezaOrderForm from "../Asbeza/CreateForm/callcenterForm";
import AsbezaOrderBranchForm from "../Asbeza/CreateForm/branchForm";
import getRequiredUserData from "../../utils/getBranchInfo";
import createTable from "../../api/dailyTable/create";
import deleteTable from "../../api/dailyTable/delete";
import CreateForm from "../BonusPenality/createForm/create";
import CardOrderBranchForm from "../Card/CreateForm/branchForm";
import CardOrderForm from "../Card/CreateForm/callcenterForm";
import WaterOrderBranchForm from "../Water/CreateForm/branchForm";
import WifiOrderBranchForm from "../Wifi/CreateForm/branchForm";
import WifiOrderForm from "../Wifi/CreateForm/callcenterForm";
import WaterOrderForm from "../Water/CreateForm/callcenterForm";
import BankForm from "../Bank/createBankForm";
import FinancialCreditForm from "../Credit/createCreditForm/financeCredit";
import EssentialForm from "../Essential/createEssentials";
import ExpenseForm from "../Expense/create";
import { SpinnerContext } from "../../contexts/SpinnerContext";

const Header = ({
  title,
  subtitle,
  tableId = "None",
  total = 0,
  summeryId = "",
  fieldName = "",
  from = "",
  source = "",
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const params = useParams();
  const sheetId = params.sheet;
  const { changeActiveness } = useBranch();

  const branchData = getRequiredUserData();
  let branchId = branchData.requiredId;
  let active = branchData.active;
  let activeSheet = branchData.activeSheet;

  const {isSubmitting, setIsSubmitting} = useContext(SpinnerContext);
  const [userClaims, setUserClaims] = useState({});
  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {
        console.log("Error fetching user claims:", error);
      }
    }
    fetchUserClaims();
  }, [user]);
  const [openDialog, setOpenDialog] = useState(false);
  const handleDeleteIconClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const [openDialog2, setOpenDialog2] = useState(false);

  const handleDeleteIconClick2 = () => {
    setOpenDialog2(true);
  };

  const handleDialogClose2 = () => {
    setOpenDialog2(false);
  };

  const [openDialog3, setOpenDialog3] = useState(false);

  const handleDeleteIconClick3 = () => {
    if (tableId === "None") {
      openSnackbar("You don't select any table to be deleted.", "info");
      return;
    }
    setOpenDialog3(true);
  };

  const handleDialogClose3 = () => {
    setOpenDialog3(false);
  };

  const DeleteTable = async () => {
    handleDialogClose3();
    setIsSubmitting(true);

    if (!tableId) {
      openSnackbar("You don't select any table to be deleted.", "info");
      setIsSubmitting(false);
      return;
    }

    try {
      if (userClaims.superAdmin) {
        const res = await deleteTable(user, tableId);
        openSnackbar(res.data.message, "success");
      } else {
        openSnackbar(
          "You don't have the permission to delete the table.",
          "info"
        );
      }
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };

  const createNewTable = async (event) => {
    event.preventDefault();
    handleDialogClose2();
    setIsSubmitting(true);
    try {
      if (!activeSheet) {
        openSnackbar("There is no active sheet.You can't create a", "info");
        return;
      }
      const res = await createTable(user, branchId, activeSheet);
      openSnackbar(res.data.message, "success");
    } catch (error) {
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };
  const [branch, setBranch] = useState(null);
  const createNewSheet = async (event) => {
    event.preventDefault();
    if (branchData.sheetStatus === "Pending") {
      openSnackbar(
        "Unable to create a new sheet. Please complete the pending sheet before creating a new one. If you've already completed it, please notify the finance department for further assistance.",
        "info"
      );
      return;
    }
    handleDialogClose();
    setIsSubmitting(true);
    try {
      const date = getInternationalDate();

      const count = await getNumberOfDocumentsInCollection(
        "sheets",
        "branchId",
        branchId
      );
      const SheetData = {
        branchId: branchId ? branchId : params.id,
        date: date,
        previousActive: activeSheet,
        prevActive: active,
        name: "Sheet " + date,
        sheetNumber: count + 1,
        realDate: new Date(),
        sheetStatus: "Pending",
      };
      const res = await createSheet(user, SheetData);
      openSnackbar(`${res.data.message}`, "success");
    } catch (error) {
      console.error("Error during form submission:", error);
      openSnackbar(
        error.response.data.message,
        error.response.data.type ? error.response.data.type : "error"
      );
    }
    setIsSubmitting(false);
  };

  return (
    <>
      
      <Box display="flex" alignItems="center" padding="0">
        <Box flex="1">
          <Typography
            variant="h2"
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{ mb: "5px" }}
          >
            {title}
          </Typography>
          {title !== "Summery Table" && (
            <Typography variant="h5" color={theme.palette.secondary[300]}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {title === "Water Order" || title === "Wifi Order" ? (
          <Box sx={{ width: "25%", marginBottom: "5px" }}>
            <ReminderComponent type={title} />
          </Box>
        ) : (
          <div></div>
        )}

        <Box ml={3}>
          {title === "Card Distribute Report" ? (
            <CardDistributeReportForm />
          ) : title === "Hotel profit Report" ? (
            <HotelProfitReportForm />
          ) : title === "Card Fee Report" ? (
            <CardFeeReportForm />
          ) : title === "Customer credit" ? (
            <CustomerCreditForm type={"CustomerCredit"} />
          ) : title === "Daily credit" ? (
            <DailyCreditForm type={"DailyCredit"} />
          ) : title === "Bonus" && !userClaims.finance ? (
            <CreateForm type={"bonus"} />
          ) : title === "Bonus" && userClaims.finance ? (
            <div></div>
          ) : title === "Bank Transaction" ? (
            <BankForm source={source} />
          ) : title === "Expense" ? (
            <ExpenseForm />
          ) : title === "Credit" ? (
            <FinancialCreditForm />
          ) : title === "Penality" && !userClaims.finance ? (
            <CreateForm type={"penality"} />
          ) : title === "Penality" && userClaims.finance ? (
            <div></div>
          ) : title === "Staff credit" ? (
            <StaffCreditForm type={"StaffCredit"} />
          ) : title === "Essentials" ? (
            <EssentialForm />
          ) : title === "Water Report" ? (
            <WaterDistributeReportForm />
          ) : title === "Wifi Report" ? (
            <WifiDistributeReportForm />
          ) : title === "Summery Person Table" ? (
            <div></div>
          ) : title === "Customer" ? (
            <div></div>
          ) : title === "Staff Salary Table" &&
            (userClaims.superAdmin || userClaims.admin) ? (
            <BonusDialog worker={"staff"} />
          ) : title === "Delivery guys Salary Table" && userClaims.admin ? (
            <BonusDialog worker={"deliveryGuy"} />
          ) : title === "Delivery guys Salary Table" ||
            (title === "Staff Salary Table" && userClaims.finance) ? (
            <div></div>
          ) : title === "Summery Daily Table" ? (
            <div></div>
          ) : title === "Water Orders" && from === "branch" ? (
            <WaterOrderBranchForm />
          ) : title === "Wifi Orders" && from === "branch" ? (
            <WifiOrderBranchForm />
          ) : title === "Water Order" && from === "callcenter" ? (
            <WaterOrderForm />
          ) : title === "Wifi Order" && from === "callcenter" ? (
            <WifiOrderForm />
          ) : title === "Card Order" && from === "branch" ? (
            <CardOrderBranchForm />
          ) : title === "Card Orders" && from === "callcenter" ? (
            <CardOrderForm />
          ) : title === "Asbeza Order" && from === "branch" ? (
            <AsbezaOrderBranchForm />
          ) : title === "Asbeza Order" && from === "callcenter" ? (
            <AsbezaOrderForm />
          ) : title === "Branch" ? (
            <BranchForm />
          ) : title === "Sheet" ? (
            <>
              {userClaims.admin ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteIconClick}
                >
                  Create new {title}
                </Button>
              ) : null}
            </>
          ) : title === "Table" ? (
            <Box display="flex" gap={3}>
              {userClaims.admin ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteIconClick2}
                >
                  Create new {title}
                </Button>
              ) : null}
              {userClaims.superAdmin ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteIconClick3}
                >
                  Delete Table
                </Button>
              ) : (
                <div></div>
              )}
            </Box>
          ) : title === "Branch Admin" ? (
            <AdminRegisterForm /> // Corrected to <FormPopup type={title} />
          ) : title === "Call Center" ? (
            <CallcenterRegisterForm /> // Corrected to <FormPopup type={title} />
          ) : title === "Finance" ? (
            <FinanceRegisterForm /> // Corrected to <FormPopup type={title} />
          ) : title === "Delivery Guy" ? (
            <DeliveryGuyRegisterForm /> // Corrected to <FormPopup type={title} />
          ) : title === "Staff" ? (
            <StaffRegisterForm /> // Corrected to <FormPopup type={title} />
          ) : title !== "Salary Table" ? (
            <FormPopup type={title} /> // Corrected to <FormPopup type={title} />
          ) : (
            <div></div>
          )}
        </Box>
        <ConfirmationDialog
          open={openDialog}
          handleDialogClose={handleDialogClose}
          handleConfirmed={createNewSheet}
          message={` Are you sure you want to create new sheet? Associated summary
          table will be created?`}
          title={`Confirm Sheet Creation`}
        />

        <ConfirmationDialog
          open={openDialog2}
          handleDialogClose={handleDialogClose2}
          handleConfirmed={createNewTable}
          message={`Are you sure you want to Create new Daily Table?`}
          title={`Confirm Table Creation`}
        />

        <ConfirmationDialog
          open={openDialog3}
          handleDialogClose={handleDialogClose3}
          handleConfirmed={DeleteTable}
          message={`Are you sure you want to delete the table selected?`}
          title={`Confirm Table Deletion`}
        />
      </Box>
    </>
  );
};

export default Header;
