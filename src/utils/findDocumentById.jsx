const findDocumentById = (idToFind, data) => {
  for (const document of data) {
    if (document.id === idToFind) {
      return document;
    }
  }
  return null; // Return null if no matching document is found
};

export default findDocumentById;
