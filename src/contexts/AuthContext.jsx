import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  confirmPasswordReset,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../services/firebase";

const AuthContext = createContext({
  currentUser: null,
  user: null,
  validatingUser: true,
  signInWithGoogle: () => Promise,
  login: () => Promise,
  register: () => Promise,
  logout: () => Promise,
  forgotPassword: () => Promise,
  resetPassword: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(false);
  const [validatingUser, setValidatingUser] = useState(true);
  const [gettingUser, setGettingUser] = useState(true);

  async function getUser(user) {
    try {
      // const auth = getAuth(); // Assuming you have initialized Firebase Auth

      // Get the user's ID token result using the then method
      return user.getIdTokenResult().then(async (idTokenResult) => {
        const customClaims = idTokenResult.claims;

        let collectionName;

        // Determine the collection name based on the user's custom claim
        if (customClaims.superAdmin) {
          collectionName = "Superadmin";
        } else if (customClaims.admin) {
          collectionName = "admin";
        } else if (customClaims.callCenter) {
          collectionName = "callcenter";
        } else if (customClaims.finance) {
          collectionName = "finance";
        } else {
          // If no matching role, return null
          return null;
        }

        const userDocRef = doc(firestore, collectionName, user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          console.log("User data:", userDocSnapshot.data());
          return userDocSnapshot.data();
        }

        return null; // Return null if the user document doesn't exist
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // Return null if there's an error
    }
  }
  // Function to fetch user details from Firestore and update the currentUser state
  async function getCurrentUserDetails(authenticatedUser) {
    if (!authenticatedUser) return;

    try {
      const userData = await getUser(authenticatedUser);
      console.log("user--------------------Data", userData);
      if (userData) {
        console.log("User data: try sdjnak", userData);
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setGettingUser(false);
    }
  }

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getCurrentUserDetails(user);
      } else {
        setUser(false);
      }
      setValidatingUser(false);
    });

    return () => unSubscribe();
  }, []);

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function forgotPassword(email) {
    return sendPasswordResetEmail(auth, email, {
      // url: `http://localhost:3000/login`,
      url: `https://add-dh7x.onrender.com/login`,
    });
  }

  function resetPassword(oobCode, newPassword) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  function logout() {
    return signOut(auth);
  }

  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  const value = {
    user,
    validatingUser,
    currentUser,
    signInWithGoogle,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
