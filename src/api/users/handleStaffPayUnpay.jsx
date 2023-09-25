import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const handleStaffPayUnpay = async (staffId, user, data) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.put(
          `${API_BASE_URL}api/user/staff/pay/${staffId}`,
          data,
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
    console.log(error);
    throw error;
  }
};

export default handleStaffPayUnpay;
