import type { Metadata } from "next";
import { AuthProvider } from "./AuthProvider";

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
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
