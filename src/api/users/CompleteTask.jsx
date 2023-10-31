import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const CompleteTask = async (user, UserData) => {
  console.log("UserData", UserData);
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();

      if (idTokenResult.claims.admin === true) {
        const idToken = await user.getIdToken();
        const response = await axios.post(
          `${API_BASE_URL}api/user/deliveryGuy/completeTask`,
          UserData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        console.log(`User created successfully.`);
        return response;
      } else {
        console.log("User is not authorized to create a User.");
        throw {
          response: {
            data: {
              message: "User is not authorized",
              type: "error",
            },
          },
        };
      }
    }
  } catch (error) {
    throw error;
  }
};

export default CompleteTask;
