import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateCalculator = async (user, id, CalculatorData) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.admin === true ||
      idTokenResult.claims.finance === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/calculator/${id}`,
        CalculatorData,
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
    console.log(`Error occurred while creating User.`, error);
    throw error;
  }
};

export default updateCalculator;
