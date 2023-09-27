import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a branch using Axios
const updateIncentive = async (id, user, incentiveData, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/incentive/${type}/${id}`,
        incentiveData,
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

export default updateIncentive;
