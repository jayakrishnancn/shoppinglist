import { auth, provider } from "./firebase/config";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@mui/material";

export const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      console.log("User signed in");
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <Button variant="contained" onClick={handleLogin}>
      Sign in with Google
    </Button>
  );
};
