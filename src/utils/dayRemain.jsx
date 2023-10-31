const { subDays } = require("date-fns");

function getPast15Days() {
  const pastDates = [];
  for (let i = 0; i < 8; i++) {
    pastDates.push(i);
  }
  return pastDates;
}

export default getPast15Days;
