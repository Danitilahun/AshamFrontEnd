import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

// Arrow function to create a branch using Axios

const handlePay = async (active, id, user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.put(
          `${API_BASE_URL}deliveryguy/pay/${id}/${active}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        return response;
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

export default handlePay;
