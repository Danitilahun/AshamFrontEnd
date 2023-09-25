// Dashboard.js
import React from "react";
import "./dashboard.css";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EngineeringIcon from "@mui/icons-material/Engineering";
import GroupIcon from "@mui/icons-material/Group";
import GetAppIcon from "@mui/icons-material/GetApp";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useTheme } from "@mui/material";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import BranchIncomeBar from "../../components/Branch/BranchIncomeBar";
import IncomeSourceBar from "../../components/Dashboard/IncomeSourceBar";
import ActiveDeliveryPercentage from "../../components/Dashboard/ActiveDeliveryPercentage";
import DashboardTable from "../../components/Dashboard/DashboardTable";
import useDashboardData from "../../hooks/useDashboardData";

const Dashboard = () => {
  const theme = useTheme();
  const { dashTotalData, incomeBarData, sourcesData, dashTableData } =
    useDashboardData();

  return (
    <>
      <div className="holder">
        <div className="super_container">
          {dashTotalData && (
            <div className="container-top">
              <DashboardCard
                totalIncome={dashTotalData.totalBudget}
                icon={<AttachMoneyIcon />}
                title={"Total Budget"}
                boxShadow={"5px 5px 10px rgba(0, 0, 0, 0.2)"}
              />
              <DashboardCard
                totalIncome={dashTotalData.totalEmployees}
                icon={<EngineeringIcon />}
                title={"Total Delivery Guy"}
              />

              <DashboardCard
                totalIncome={dashTotalData.totalCustomer}
                icon={<GroupIcon />}
                title={"Total Customer"}
              />
              <DashboardCard
                totalIncome={dashTotalData.totalIncome}
                icon={<GetAppIcon />}
                title={"Total Income"}
              />

              <DashboardCard
                totalIncome={dashTotalData.totalExpense}
                icon={<FileUploadIcon />}
                title={"Total Expense"}
              />
            </div>
          )}

          <div className="container-mid">
            <BranchIncomeBar incomeBarData={incomeBarData} />
            <IncomeSourceBar sourcesData={sourcesData} />
            <div
              className="item"
              style={{ backgroundColor: theme.palette.background.alt }}
            >
              {dashTotalData && (
                <ActiveDeliveryPercentage dashTotalData={dashTotalData} />
              )}
            </div>
          </div>
          <DashboardTable dashTableData={dashTableData} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
