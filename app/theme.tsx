"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  palette: {
    primary: {
      main: "#0171dc",
    },
    success: {
      main: "#2fa834",
    },
  },
});

export default theme;
