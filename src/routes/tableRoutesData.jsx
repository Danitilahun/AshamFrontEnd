import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "../components/VersatileComponents/RequireAuth";
import TablesPage from "../pages/Money/TablesPage";
import Setting from "../pages/setting/setting";
import Branch from "../pages/Collection/Branch";

const tableRoutesData = [
  { path: "table/:id/:sheet", component: TablesPage },
  { path: "setting", component: Setting },
  { path: "/genzeb/branch", component: Branch },
];

const TableRoutes = () => {
  return (
    <>
      {tableRoutesData.map((route, index) => (
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

export default TableRoutes;
