import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./navbar";

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
        <NavBar />
        {children}
      </body>
    </html>
  );
}
