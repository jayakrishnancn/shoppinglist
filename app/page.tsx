"use client";
import { Container } from "@mui/material";
import Login from "./login/page";
import useAuth from "./firebase/useAuth";
import ProjectList from "./projects";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ mt: 1, p: 1 }}>
      {user ? <ProjectList userId={user.uid} /> : <Login />}
    </Container>
  );
}
