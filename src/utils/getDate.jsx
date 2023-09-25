const getInternationalDate = () => {
  const currentDate = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Format the date in the international format (e.g., "July 28, 2023")
  const internationalDate = `${month} ${day}, ${year}`;

  return internationalDate;
};

export default getInternationalDate;
