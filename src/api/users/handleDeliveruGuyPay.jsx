import axios from "axios";
import { API_BASE_URL } from "../utils/config";
// Arrow function to create a branch using Axios

const handlePay = async (activeSalaryTableId, deliveryGuyId, user, data) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin === true) {
        const idToken = await user.getIdToken();
        const response = await axios.put(
          `${API_BASE_URL}api/user/deliveryGuy/pay/${deliveryGuyId}/${activeSalaryTableId}`,
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

export default handlePay;
