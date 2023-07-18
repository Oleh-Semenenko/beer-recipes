import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beer recipes",
  description: "Choose your beer recipe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container">
        {children}
      </body>
    </html>
  );
}
