import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

// Arrow function to create a branch using Axios

const createDashboard = async (user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.superAdmin === true) {
        const idToken = await user.getIdToken();

        await axios.post(
          `${API_BASE_URL}dashboard`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        return true;
      } else {
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    if (error.isAxiosError) {
      throw new Error(error.message);
    } else {
      throw error;
    }
  }
};

export default createDashboard;
