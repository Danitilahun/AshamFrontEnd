import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

// Arrow function to create a branch using Axios

const createBank = async (reportData, user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true ||
        idTokenResult.claims.finance === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(`${API_BASE_URL}bank`, reportData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        // Handle successful submission
        console.log("Credit created successfully.");
        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    console.log("Error occurred while creating branch.", error);
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default createBank;
