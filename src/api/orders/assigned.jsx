import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const Assigned = async (user, orderData, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }
    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.admin === true
    ) {
      const idToken = await user.getIdToken();

      const res = await axios.post(
        `${API_BASE_URL}api/order/${type}/orderAssigned`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return res;
    } else {
      throw new Error(`User is not authorized.`);
    }
  } catch (error) {
    console.log(`Error occurred while creating.`, error);
    throw error;
  }
};

export default Assigned;
