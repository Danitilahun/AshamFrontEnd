const createForm = (event) => {
  const formData = new FormData();
  // Loop through all form elements and append them to formData
  for (let i = 0; i < event.target.elements.length; i++) {
    const element = event.target.elements[i];
    if (element.type === "file") {
      formData.append(element.name, element.files[0]);
    } else if (element.name) {
      formData.append(element.name, element.value);
    }
  }

  return formData;
};

export default createForm;
