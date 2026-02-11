import { AppShell } from "@/components/app-shell";
import { RequireAuth } from "@/components/auth/require-auth";

export default function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}
