import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteCredit = async (user, Id, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.admin === true) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(
        `${API_BASE_URL}api/credit/${type}/${Id}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      // Handle successful deletion

      return res;
    } else {
      throw new Error("User is not authorized to delete a branch.");
    }
  } catch (error) {
    console.log(`Error occurred while creating ${type}.`, error);

    throw error;
  }
};

export default deleteCredit;
