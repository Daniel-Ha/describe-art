import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Describe Art",
  description: "Describe Art",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
