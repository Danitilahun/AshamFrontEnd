import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const AsbezaProfit = async (user, orderData) => {
  try {
    if (!user) {
      return null;
    }
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.post(
        `${API_BASE_URL}api/report/asbezaProfit`,
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
      throw {
        response: {
          data: {
            message: "User is not authorized",
            type: "error",
          },
        },
      };
    }
  } catch (error) {
    throw error;
  }
};

export default AsbezaProfit;
