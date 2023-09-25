import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import Branch from "../pages/Collection/Branch";
import Expenses from "../pages/Finance/expenses";
import Bank from "../pages/Finance/bank";
import FinanceCredit from "../pages/Finance/credit";

const mainRoutesData = [
  { path: "mainFinance/branches/:id", component: Branch },
  { path: "mainFinance/expenses/:id", component: Expenses },
  { path: "mainFinance/bank/:id", component: Bank },
  { path: "mainFinance/credit/:id", component: FinanceCredit },
];

const mainFinanceRoutesData = () => {
  return (
    <>
      {mainRoutesData.map((route, index) => (
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

export default mainFinanceRoutesData;
