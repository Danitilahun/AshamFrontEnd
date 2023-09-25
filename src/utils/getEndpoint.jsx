const getEndpointFromType = (type) => {
  switch (type) {
    case "Delivery Guy":
      return "deliveryguy";
    case "Staff":
      return "deliveryguy";
    case "Branch Admin":
      return "admin";
    case "Branch":
      return "branch";
    case "Call Center":
      return "callcenter";
    case "Finance":
      return "finance";
    default:
      return null;
  }
};

export default getEndpointFromType;
