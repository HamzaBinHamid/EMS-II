// pages/portal/admin/index.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <h1>Admin Dashboard</h1>
    </ProtectedRoute>
  );
}
