import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";

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
    <html lang="en">
      <body>
        <ToastContainer />
        <NavBar />
        {children}
      </body>
    </html>
  );
}
