"use client";
import { Container } from "@mui/material";
import Login from "./login/page";
import useAuth from "./firebase/useAuth";
import Dashboard from "./dashboard";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ mt: 1, p: 1 }}>
      {user ? <Dashboard /> : <Login />}
    </Container>
  );
}
