const { subDays } = require("date-fns");

function getPast15Days(currentDate) {
  const pastDates = [];
  for (let i = 0; i < 8; i++) {
    const date = subDays(currentDate, i);
    pastDates.push(date);
  }
  return pastDates;
}

export default getPast15Days;
