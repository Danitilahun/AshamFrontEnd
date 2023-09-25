import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteSheet = async (user, Id) => {
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
      const res = await axios.delete(`${API_BASE_URL}api/sheet/${Id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return res;
    } else {
      throw new Error("User is not authorized to delete a branch.");
    }
  } catch (error) {
    console.log(`Error occurred while creating .`, error);

    throw error;
  }
};

export default deleteSheet;
