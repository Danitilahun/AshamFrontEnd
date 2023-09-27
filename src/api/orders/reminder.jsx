import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const Reminder = async (orderData, user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.callCenter === true) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/order/reminder`,
          orderData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission
        console.log("Branch created successfully.");
        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw {
          response: {
            data: {
              message: "User is not authorized",
              type: "error",
            },
          },
        };
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    throw error;
  }
};

export default Reminder;
