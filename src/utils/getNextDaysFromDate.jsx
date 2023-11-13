const { subDays, format } = require("date-fns");

function getPreviousDaysFromToday() {
  const today = new Date();

  const formatDate = (date) => format(date, "MMMM dd, yyyy");

  const dayDifferences = [30, 31, 32, 33];
  const previousDays = [];

  for (const difference of dayDifferences) {
    const previousDay = subDays(today, difference);
    previousDays.push(formatDate(previousDay));
  }

  return previousDays;
}

export default getPreviousDaysFromToday;
