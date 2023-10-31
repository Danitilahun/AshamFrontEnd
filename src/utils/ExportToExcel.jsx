import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import useExportData from "../hooks/useExportData";
import { useState } from "react";
import Export from "../api/Export/sendPostRequest";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "@mui/material";
import { useSnackbar } from "../contexts/InfoContext";
import getInternationalDate from "./getDate";
import { useContext } from "react";
import { SpinnerContext } from "../contexts/SpinnerContext";

export const ExportToExcel = ({
  file,
  endpoint,
  branchId = null,
  id = null,
  clear = false,
  name,
}) => {
  const { user } = useAuth();
  const { openSnackbar } = useSnackbar();
  const date = getInternationalDate();
  const { isSubmitting, setIsSubmitting } = useContext(SpinnerContext);
  const theme = useTheme();
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    const maxLengths = {};

    // Iterate through the objects in the array
    apiData.forEach((obj) => {
      // Iterate through the properties (keys) of each object
      for (const key in obj) {
        // Get the length of the property value
        const value = obj[key].toString(); // Convert to string to handle numbers as well
        const valueLength = value.length;

        // Calculate the length of the key itself
        const keyLength = key.length;

        // Compare the value length and key length, and store the maximum
        const maxLength = Math.max(valueLength, keyLength);

        // Update the maximum length if needed
        if (!maxLengths[key] || maxLength > maxLengths[key]) {
          maxLengths[key] = maxLength;
        }
      }
    });

    // Add 3 to each maximum length
    const maxLengthsPlus3 = {};
    for (const key in maxLengths) {
      maxLengthsPlus3[key] = maxLengths[key] + 3;
    }

    console.log("maxLengthsPlus3", maxLengthsPlus3);
    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(apiData);

    // // Set column widths based on the calculated key length
    const cols = [];

    for (const key in maxLengthsPlus3) {
      const maxLength = maxLengthsPlus3[key];
      cols.push({ wch: maxLength });
    }
    // // Add the columns with dynamic widths based on maxKeyLength

    ws["!cols"] = cols;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const handleClick = async () => {
    setIsSubmitting(true);
    try {
      const response = await Export(user, {
        file: file,
        endpoint: endpoint,
        branchId: branchId,
        id: id,
        clear: clear,
      });
      console.log(response.data.message);
      openSnackbar(`${response.data.message}!`, "success");
      if (response) {
        exportToCSV(response.data.data, `${name}-${date}`);
      }
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

  console.log(isSubmitting, "isSubmitting");
  return isSubmitting ? null : (
    <button
      onClick={handleClick}
      disabled={isSubmitting}
      style={{
        color: theme.palette.secondary[100],
        backgroundColor: theme.palette.background.alt,
        borderRadius: "8px",
        padding: "10px 20px",
        border: "none",
        marginLeft: "10px",
        cursor: isSubmitting ? "normal" : "pointer",
        fontSize: "16px",
        transition: "transform 0.2s",
      }}
    >
      Export
    </button>
  );
};
