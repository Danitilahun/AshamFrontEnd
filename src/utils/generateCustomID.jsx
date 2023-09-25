import CryptoJS from "crypto-js";

const generateCustomID = (inputString) => {
  const hash = CryptoJS.SHA256(inputString);
  return hash.toString(CryptoJS.enc.Hex);
};

export default generateCustomID;
