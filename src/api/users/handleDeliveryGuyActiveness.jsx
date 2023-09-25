import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios

const handleDeliveryGuyActiveness = async (ActiveData, user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/user/deliveryGuy/setactiveness`,
          ActiveData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    throw error;
  }
};

export default handleDeliveryGuyActiveness;
