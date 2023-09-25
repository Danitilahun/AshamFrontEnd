const formatDateRange = (dateString) => {
  const startDate = new Date(dateString);
  const endDate = new Date();

  const startMonth = startDate.toLocaleString("default", { month: "short" });
  const endMonth = endDate.toLocaleString("default", { month: "short" });

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
};

export default formatDateRange;
