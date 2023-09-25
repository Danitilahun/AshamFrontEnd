import React, { useState, createContext, useContext } from "react";

const BranchContext = createContext();

// Create the provider component
export const useBranch = () => useContext(BranchContext);
const BranchProvider = ({ children }) => {
  const [branchId, setBranchId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchInfo, setBranchInfo] = useState("");
  const [deliveryGuy, setChoosen] = useState(0);
  const [choosen, setdeliveryGuy] = useState("");
  const [sheetName, setSheetName] = useState("");
  const [activeness, setActiveness] = useState("");
  const [tableDate, settableDate] = useState([]);
  const [callCenterId, setCallCenterId] = useState("");
  const [callCenterName, setCallCenterName] = useState("");

  // Function to change the branchId
  const changeChoosen = (newcallCenterName) => {
    setChoosen(newcallCenterName);
  };
  const changeActiveness = (newcallCenterName) => {
    setActiveness(newcallCenterName);
  };
  const changedeliveryGuy = (newcallCenterName) => {
    setdeliveryGuy(newcallCenterName);
  };
  const changecallCenterName = (newcallCenterName) => {
    setCallCenterName(newcallCenterName);
  };
  const changecallCenterId = (newcallCenterId) => {
    setCallCenterId(newcallCenterId);
  };
  const changeBranch = (newBranchId) => {
    setBranchId(newBranchId);
  };
  const changetableDate = (newtableDate) => {
    settableDate(newtableDate);
  };

  const changeBranchName = (newBranchName) => {
    setBranchName(newBranchName);
  };
  const changeBranchInfo = (newBranchInfo) => {
    setBranchInfo(newBranchInfo);
  };
  const changesheetName = (newsheetName) => {
    setSheetName(newsheetName);
  };

  // Value object to be provided by the context
  const contextValue = {
    callCenterId,
    callCenterName,
    deliveryGuy,
    choosen,
    changeChoosen,
    changedeliveryGuy,
    activeness,
    changeActiveness,
    changecallCenterId,
    changecallCenterName,
    branchId,
    changesheetName,
    sheetName,
    branchName,
    changeBranchName,
    changeBranch,
    branchInfo,
    changeBranchInfo,
    tableDate,
    changetableDate,
  };

  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
};

export default BranchProvider;
