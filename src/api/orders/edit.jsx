import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import getInternationalDate from "../../utils/getDate";

const update = async (user, id, orderData, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }
    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.admin === true ||
      idTokenResult.claims.callCenter === true
    ) {
      const idToken = await user.getIdToken();
      const date = getInternationalDate();
      orderData.createdDate = date;
      const res = await axios.put(
        `${API_BASE_URL}api/order/${type}/${id}`,
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
    console.log(`Error occurred while `, error);
    throw error;
  }
};

export default update;
