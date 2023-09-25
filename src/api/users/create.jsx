import axios from "axios";
import { API_BASE_URL } from "../utils/config";

// Arrow function to create a User using Axios

const createUser = async (user, UserData, type) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/user/${type}`,
          UserData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        console.log(`User created successfully.`);
        return response;
      } else {
        console.log("User is not authorized to create a User.");
        throw new Error("User is not authorized to create a User.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    // console.log(`Error occurred while creating ${type}.`, error);
    throw error;
  }
};

export default createUser;
