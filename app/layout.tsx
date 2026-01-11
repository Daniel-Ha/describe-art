import type { Metadata } from "next";
import {
  ClerkProvider,
} from "@clerk/nextjs";
import { ThemeSwitcher } from "../components/themes-control/ThemeSwitcher";
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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen">
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <ThemeSwitcher />
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
