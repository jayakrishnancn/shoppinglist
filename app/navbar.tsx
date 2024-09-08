"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useAuth from "./firebase/useAuth";
import { auth } from "./firebase/config";
import Loading from "./Loading";
import { Avatar } from "@mui/material";

export default function NavBar() {
  const { user } = useAuth();
  const handleLogout = (): void => {
    auth
      .signOut()
      .then((res) => {
        console.log("User signed out", res);
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out: ", error);
      });
  };

  console.log(user);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Loading />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shopping List
          </Typography>
          {user && (
            <Box display="flex" gap={2}>
              <Box>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <Avatar
                    alt={user.displayName ?? ""}
                    src={user.photoURL ?? ""}
                  />
                </IconButton>

                {user.displayName}
              </Box>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
