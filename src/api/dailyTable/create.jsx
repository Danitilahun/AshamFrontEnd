import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import getInternationalDate from "../../utils/getDate";

const createTable = async (user, branchId, sheetId) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.admin === true) {
        const idToken = await user.getIdToken();

        const date = getInternationalDate();
        const TableData = {
          branchId: branchId,
          sheetId: sheetId,
          date: date,
        };
        const response = await axios.post(
          `${API_BASE_URL}api/table`,
          TableData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        // Handle successful submission

        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw {
          response: {
            data: {
              message: "User is not authorized",
              type: "error",
            },
          },
        };
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    console.log("Error occurred while creating branch.", error);
    throw error;
  }
};

export default createTable;
