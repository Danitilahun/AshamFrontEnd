// helpers.js (or any suitable file name)
const extractData = (userData) => {
  const {
    name: branchName = null,
    activeTable = null,
    uniqueName = null,
    numberofworker = null,
    id: requiredId = null,
    salaryTable = null,
    worker = null,
    activeSheet = null,
    activeDailySummery = null,
    active = null,
    bank = null,
    paid = null,
  } = userData || {};

  return {
    branchName,
    activeTable,
    uniqueName,
    numberofworker,
    requiredId,
    salaryTable,
    worker,
    activeSheet,
    activeDailySummery,
    active,
    bank,
    paid,
  };
};

const getRequiredUserData = () => {
  const storedData = localStorage.getItem("userData");
  const userData = storedData ? JSON.parse(storedData) : null;
  return extractData(userData);
};

module.exports = getRequiredUserData;
