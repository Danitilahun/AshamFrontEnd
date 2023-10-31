// tableColumns.js
export const basecolumns = [
  {
    field: "asbezaNumber",
    headerName: "Asbeza Number",
    flex: 0.4,
  },
  {
    field: "asbezaProfit",
    headerName: "Asbeza Profit",
    flex: 0.4,
  },
  {
    field: "cardCollect",
    headerName: "Card Collect",
    flex: 0.4,
  },
  {
    field: "cardDistribute",
    headerName: "Card Distribute",
    flex: 0.4,
  },
  {
    field: "cardFee",
    headerName: "Card Fee",
    flex: 0.4,
  },
  {
    field: "hotelProfit",
    headerName: "Hotel Profit",
    flex: 0.4,
  },
  {
    field: "waterCollect",
    headerName: "Water Collect",
    flex: 0.4,
  },
  {
    field: "waterDistribute",
    headerName: "Water Distribute",
    flex: 0.4,
  },
  {
    field: "wifiCollect",
    headerName: "Wifi Collect",
    flex: 0.4,
  },
  {
    field: "wifiDistribute",
    headerName: "Wifi Distribute",
    flex: 0.4,
  },
  {
    field: "total",
    headerName: "Total",
    flex: 0.4,
  },
];

export const columns = [
  {
    field: "uniqueName",
    headerName: "Unique Name",
    flex: 0.4,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  ...basecolumns,
];

export const summery2Column = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  ...basecolumns,
];

export const salaryColumn = [
  {
    field: "uniqueName",
    headerName: "Unique Name",
    flex: 0.4,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },

  {
    field: "asbezaNumber",
    headerName: "Asbeza Number",
    flex: 0.4,
  },
  {
    field: "cardCollect",
    headerName: "Card Collect",
    flex: 0.4,
  },
  {
    field: "cardDistribute",
    headerName: "Card Distribute",
    flex: 0.4,
  },
  {
    field: "cardFee",
    headerName: "Card Fee",
    flex: 0.4,
  },
  {
    field: "waterCollect",
    headerName: "Water Collect",
    flex: 0.4,
  },
  {
    field: "waterDistribute",
    headerName: "Water Distribute",
    flex: 0.4,
  },
  {
    field: "wifiCollect",
    headerName: "Wifi Collect",
    flex: 0.4,
  },
  {
    field: "wifiDistribute",
    headerName: "Wifi Distribute",
    flex: 0.4,
  },
  {
    field: "bonus",
    headerName: "Bonus",
    flex: 0.4,
  },
  {
    field: "fixedSalary",
    headerName: "Fixed Salary",
    flex: 0.4,
  },
  {
    field: "holidayBonus",
    headerName: "Holiday Bonus",
    flex: 0.4,
  },
  {
    field: "penality",
    headerName: "Penality",
    flex: 0.4,
  },
  {
    field: "total",
    headerName: "Total",
    flex: 0.4,
  },
];
