// useDashboardData.js
import { useEffect, useState } from "react";
import fetchData from "../api/services/Users/getUser";
const useDashboardData = () => {
  const [dashTotalData, setDashTotalData] = useState(null);
  const [incomeBarData, setIncomeBarData] = useState(null);
  const [sourcesData, setSourcesData] = useState(null);
  const [dashTableData, setDashTableData] = useState(null);
  let maxIncome = 1;
  let maxSource = 1;

  useEffect(() => {
    const unsubscribe1 = fetchData("dashboard", (data) => {
      const totalData = {
        totalBudget: data ? data.totalBudget : "Not Available",
        totalEmployees: data ? data.totalEmployees : "Not Available",
        totalIncome: data ? data.totalIncome : "Not Available",
        totalExpense: data ? data.totalExpense : "Not Available",
        totalCustomer: data ? data.totalCustomer : "Not Available",
        activeEmployees: data ? data.activeEmployees : "Not Available",
      };
      setDashTotalData(totalData);

      const data1 = data ? data.data2 : [];
      let maxSource = 1;
      data1?.forEach((data) => {
        if (data.Amount > maxSource) {
          maxSource = data.Amount;
        }
      });
      let newSourcesData = [];
      data1?.forEach((data, i) => {
        if (i > 10) {
          i = i + 10;
        }
        newSourcesData.push({
          Name: data.Name,
          Amount: data.Amount,
          Color: i % 10,
          Height: `${((100 * data.Amount) / maxSource).toFixed()}`,
        });
      });
      setSourcesData(newSourcesData);
      const data2 = data ? data.data : [];
      data2?.forEach((data) => {
        if (data.BranchIncome > maxIncome) {
          maxIncome = data.BranchIncome;
        }
      });

      let newBarData = [];
      data2?.forEach((data, i) => {
        if (i > 10) {
          i = i + 10;
        }
        newBarData.push({
          BranchName: data.BranchName,
          BranchIncome: data.BranchIncome,
          uniqueName: data.uniqueName,
          BarColor: i % 10,
          BarHeight: `${((100 * data.BranchIncome) / maxIncome).toFixed()}`,
        });
      });
      setIncomeBarData(newBarData);
    });

    const unsubscribe2 = fetchData("branchInfo", (adminsOne) => {
      let newBarData3 = [];
      for (const key in adminsOne) {
        if (key !== "id") {
          newBarData3.push(adminsOne[key]);
        }
      }

      const totalObject = {
        BranchName: "Total",
      };

      newBarData3?.forEach((item) => {
        for (const key in item) {
          if (key !== "BranchName") {
            totalObject[key] = (totalObject[key] || 0) + item[key];
          }
        }
      });

      newBarData3.push(totalObject);
      setDashTableData(newBarData3);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  return { dashTotalData, incomeBarData, sourcesData, dashTableData };
};

export default useDashboardData;
