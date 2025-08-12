// pages/portal/admin/index.tsx
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudentPage() {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <h1>Student Dashboard</h1>
    </ProtectedRoute>
  );
}
