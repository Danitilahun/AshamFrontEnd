import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import DeliveryGuyPage from "../pages/BranchInfo/DeliveryGuyPage";
import CardFee from "../pages/BranchInfo/DailyReport/CardReport/CardFeeReport";
import CardDistribute from "../pages/BranchInfo/DailyReport/CardReport/CardDistributeReport";
import HotelProfit from "../pages/BranchInfo/DailyReport/hotelReport";
import WaterDistribute from "../pages/BranchInfo/DailyReport/waterReport";
import WifiDistribute from "../pages/BranchInfo/DailyReport/wifiReport";
import BranchWater from "../pages/BranchInfo/Services/Water";
import BranchWifi from "../pages/BranchInfo/Services/Wifi";
import BranchCard from "../pages/BranchInfo/Services/Card";
import BranchAsbeza from "../pages/BranchInfo/Services/Asbeza";
import TransactionPage from "../pages/Money/TransactionPage";
import BudgetPage from "../pages/Money/BudgetPage";
import CreditPage from "../pages/Money/CreditPage";
import BonusPenality from "../pages/Money/BonusPenality";
import SalaryPage from "../pages/Money/SalaryPage";
import StatusPage from "../pages/Money/StatusPage";
import Customer from "../pages/BranchInfo/Customer";
import Bank from "../pages/BranchInfo/Bank";
import Staff from "../pages/BranchInfo/Staff";
import BranchCalculator from "../pages/BranchInfo/Calculator";

const branchRoutesData = [
  { path: "/deliveryguy/:id", component: DeliveryGuyPage },
  { path: "/cardfee/:id", component: CardFee },
  { path: "/carddistribute/:id", component: CardDistribute },
  { path: "/hotelprofit/:id", component: HotelProfit },
  { path: "/waterdistribute/:id", component: WaterDistribute },
  { path: "/wifidistribute/:id", component: WifiDistribute },
  { path: "/water/:id", component: BranchWater },
  { path: "/wifi/:id", component: BranchWifi },
  { path: "/card/:id", component: BranchCard },
  { path: "/asbeza/:id", component: BranchAsbeza },
  { path: "/transaction/:id", component: TransactionPage },
  { path: "/budget/:id", component: BudgetPage },
  { path: "/credit/:id", component: CreditPage },
  { path: "/bonuspenality/:id", component: BonusPenality },
  { path: "/salary/:id", component: SalaryPage },
  // { path: "/status/:id", component: StatusPage },
  { path: "/segmentCustomer/:id", component: Customer },
  { path: "/staff/:id", component: Staff },
  { path: "/bank/:id", component: Bank },
  { path: "/calculator/:id", component: BranchCalculator },
];

const BranchRoutes = () => {
  return (
    <>
      {branchRoutesData.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <RequireAuth>
              <route.component />
            </RequireAuth>
          }
        />
      ))}
    </>
  );
};

export default BranchRoutes;
