import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import SalaryPage from "../pages/Money/SalaryPage";
import BonusPenality from "../pages/Money/BonusPenality";
import BudgetPage from "../pages/Money/BudgetPage";
import Staff from "../pages/Money/Credit/staff";

const financeRoutesData = [
  { path: "/genzeb/salary/:id", component: SalaryPage },
  { path: "/genzeb/budget/:id", component: BudgetPage },
  { path: "/genzeb/credit/:id", component: Staff },
  { path: "/genzeb/bonuspenality/:id", component: BonusPenality },
];

const FinanceRoutes = () => {
  return (
    <>
      {financeRoutesData.map((route, index) => (
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

export default FinanceRoutes;
