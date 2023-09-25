import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const createReport = async (user, ReportData, type) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin === true) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/report/${type}`,
          ReportData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        console.log(`${type} created successfully.`);
        return response;
      } else {
        throw new Error("User is not authorized ");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    // console.log(`Error occurred while creating ${type}.`, error);
    throw error;
  }
};

export default createReport;
