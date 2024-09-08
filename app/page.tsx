"use client";
import { Container } from "@mui/material";
import { Login } from "./Login";
import Dashboard from "./dashboard/page";
import useAuth from "./firebase/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container sx={{ mt: 1 }}>{user ? <Dashboard /> : <Login />}</Container>
  );
}
