const calculateDayDifference = (timestamp) => {
  const timestampMilliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  const timestampDate = new Date(timestampMilliseconds);
  const today = new Date();
  const timestampFormatted = timestampDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const todayFormatted = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${timestampFormatted} - ${todayFormatted}`;
};

export default calculateDayDifference;
