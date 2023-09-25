import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateEssential = async (user, id, creditData) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/essential/${id}`,
        creditData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      return res;
    } else {
      throw new Error(`User is not authorized`);
    }
  } catch (error) {
    throw error;
  }
};

export default updateEssential;
