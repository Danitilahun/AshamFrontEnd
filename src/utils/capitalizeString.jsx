const capitalizeString = (input) => {
  if (input.includes(" ")) {
    const words = input.split(" ");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(" ");
  } else {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }
};

export default capitalizeString;
