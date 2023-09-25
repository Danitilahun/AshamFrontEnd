import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteExpense = async (user, Id) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }
    const idTokenResult = await user.getIdTokenResult();
    if (
      idTokenResult.claims.superAdmin === true ||
      idTokenResult.claims.finance === true
    ) {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/expense/${Id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      return res;
    } else {
      throw new Error("User is not authorized to delete a branch.");
    }
  } catch (error) {
    throw error;
  }
};

export default deleteExpense;
