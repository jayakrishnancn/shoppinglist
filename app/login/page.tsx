"use client";
import { auth, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      signInWithPopup(auth, provider).then((res) => {
        console.log("User signed in", res);
        router.push("/");
      });
    } catch (error) {
      console.error("Error signing in: ", error);
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Button disabled={loading} variant="contained" onClick={handleLogin}>
        Sign in with Google
      </Button>
    </Box>
  );
};

export default Login;
