import axios from "axios";
import { API_BASE_URL } from "../../utils/config";
import getNumberOfDocumentsInCollection from "../../utils/getNumberOfDocument";
import getInternationalDate from "../../../utils/getDate";

const createTable = async (user, branchId, sheetId) => {
  try {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      if (
        idTokenResult.claims.superAdmin === true ||
        idTokenResult.claims.admin === true
      ) {
        const idToken = await user.getIdToken();
        const count = await getNumberOfDocumentsInCollection(
          "tables",
          "branchId",
          branchId
        );

        console.log(
          `Number of documents in "sheets" with branchId equal to "${branchId}": ${count}`
        );

        const date = getInternationalDate();
        const TableData = {
          branchId: branchId,
          sheetId: sheetId,
          date: date,
        };
        const response = await axios.post(`${API_BASE_URL}table`, TableData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
        // Handle successful submission
        console.log("Branch created successfully.");
        return response;
      } else {
        console.log("User is not authorized to create a branch.");
        throw new Error("User is not authorized to create a branch.");
        // Handle case when the user is not a super admin
      }
    }
  } catch (error) {
    // console.log("Error occurred while creating branch.", error);
    if (error.isAxiosError) {
      console.log(
        "Error occurred while creating branch.",
        error.response.data.error,
        error.message,
        error.stack
      );
      throw new Error(error.response.data.error);
    } else {
      throw error;
    }
  }
};

export default createTable;
