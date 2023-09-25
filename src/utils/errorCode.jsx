function getAlternativeErrorMessage(error) {
  switch (error) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "Your account has been disabled. Please contact the administrator for assistance.";
    case "auth/user-not-found":
      return "No account found with this email.Try with correct email.";
    case "auth/wrong-password":
      return 'Incorrect password. Please try again with correct password or use the "Forgot Password" option to reset it.';
    case "auth/email-already-in-use":
      return "This email address is already registered. Please sign in or use a different email to sign up.";
    case "auth/weak-password":
      return "Please choose a stronger password. It should contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.";
    case "auth/requires-recent-login":
      return "For security reasons, please sign in again to continue.";
    case "auth/popup-closed-by-user":
      return "Sign-in process canceled. Please try again or use an alternative sign-in method.";
    case "auth/network-request-failed":
      return "Network error occurred. Please check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "This sign-in method is currently not available. Please contact support for assistance.";
    case "auth/invalid-action-code":
      return "Password Reset Link Expired or Already Used.";
    default:
      return "An error occurred during sign-in or sign-up. Please try again later.";
  }
}

export default getAlternativeErrorMessage;
