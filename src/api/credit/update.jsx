import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const updateCredit = async (user, id, creditData, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.put(
        `${API_BASE_URL}api/credit/${type}/${id}`,
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
      throw new Error(`User is not authorized to create a branch.`);
    }
  } catch (error) {
    console.log(`Error occurred while creating ${type}.`, error);

    throw error;
  }
};

export default updateCredit;
