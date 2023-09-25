const getCurrentTime = () => {
  const currentTime = new Date();
  const options = {
    timeZone: "Asia/Tokyo", // Japanese time zone
    hour12: true, // Use 12-hour format
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const formattedTime = currentTime.toLocaleString("en-us", options);
  return formattedTime;
};

module.exports = getCurrentTime;
