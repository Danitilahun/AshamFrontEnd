import { useState, useEffect } from "react";

const useUserClaims = (user) => {
  const [userClaims, setUserClaims] = useState({});

  useEffect(() => {
    async function fetchUserClaims() {
      try {
        const idTokenResult = await user.getIdTokenResult();
        setUserClaims(idTokenResult.claims);
      } catch (error) {
        console.log("Error fetching user claims:", error);
      }
    }

    if (user) {
      fetchUserClaims();
    }
  }, [user]);

  return userClaims;
};

export default useUserClaims;
