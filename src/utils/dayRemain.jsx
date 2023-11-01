const { subDays } = require("date-fns");

function getPastDays(days = 8) {
  const pastDates = [];
  for (let i = 0; i < days; i++) {
    pastDates.push(i);
  }
  return pastDates;
}

export default getPastDays;
