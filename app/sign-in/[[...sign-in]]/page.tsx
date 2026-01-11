import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        variables: {
          colorPrimary: "var(--primary)",
          colorBackground: "var(--card)",
          colorText: "var(--foreground)",
          colorTextSecondary: "var(--muted-foreground)",
          colorInputBackground: "var(--background)",
          colorInputText: "var(--foreground)",
          colorNeutral: "var(--muted-foreground)",
        },
        elements: {
          card: "shadow-theme",
          formButtonPrimary: "bg-primary text-primary-foreground hover:opacity-90",
        },
      }}
    />
  );
}
