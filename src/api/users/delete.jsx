import axios from "axios";

import { API_BASE_URL } from "../utils/config";

const deleteUser = async (user, Id, type) => {
  try {
    if (!user) {
      console.log("User is not authenticated.");
      return null;
    }

    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims.superAdmin === true || idTokenResult.claims.admin === true)  {
      const idToken = await user.getIdToken();
      const res = await axios.delete(`${API_BASE_URL}api/user/${type}/${Id}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      return res;
    } else {
      throw new Error("User is not authorized to delete a User.");
    }
  } catch (error) {
    console.log(`Error occurred while creating User.`, error);
    throw error;
  }
};

export default deleteUser;
