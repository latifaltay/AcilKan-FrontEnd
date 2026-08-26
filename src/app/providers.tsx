import type { ReactNode } from "react";
import { AuthProvider } from "../features/auth/AuthContext";
import { ThemeProvider } from "../shared/ui/ThemeContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
