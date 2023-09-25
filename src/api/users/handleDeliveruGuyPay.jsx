import axios from "axios";
import { API_BASE_URL } from "../utils/config";
// Arrow function to create a branch using Axios

const handlePay = async (activeSalaryTableId, deliveryGuyId, user) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.superAdmin === true) {
        const idToken = await user.getIdToken();
        const response = await axios.put(
          `${API_BASE_URL}api/user/deliveryGuy/pay/${deliveryGuyId}/${activeSalaryTableId}`,
          {},
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

export default handlePay;
