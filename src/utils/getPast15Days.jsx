const { subDays } = require("date-fns");

function getPast15Days(currentDate, days = 8) {
  const pastDates = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(currentDate, i);
    pastDates.push(date);
  }
  return pastDates;
}

export default getPast15Days;
