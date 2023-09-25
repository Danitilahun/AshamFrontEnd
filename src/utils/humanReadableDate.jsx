const getHumanReadableDate = (openingDate) => {
  const dateObject = new Date(openingDate);

  // Options for formatting the date with day, month, year, hour, and minute
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  };

  // Convert the date object to human-readable format
  const humanReadableDate = dateObject.toLocaleString(undefined, options);

  return humanReadableDate;
};

export default getHumanReadableDate;
