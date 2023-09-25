// DashboardRoutes.js
import React from "react";
import { Route } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import Dashboard from "../pages/DashBoard/dashboard";

const DashboardRoutes = () => {
  return [
    <Route
      path="/"
      element={
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      }
      key="dashboard"
    />,
  ];
};

export default DashboardRoutes;
