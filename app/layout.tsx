import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import "react-toastify/dist/ReactToastify.min.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export const metadata: Metadata = {
  title: "Shopping List",
  description: "Simple shopping list",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppRouterCacheProvider>
      <html lang="en">
        <body>
          <ToastContainer />
          <ThemeProvider theme={theme}>
            <NavBar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </AppRouterCacheProvider>
  );
}
