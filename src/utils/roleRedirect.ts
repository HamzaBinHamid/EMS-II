// utils/roleRedirect.ts
import { NextRouter } from "next/router";

export default function roleRedirect(role: string, router: NextRouter) {
  switch (role) {
    case "admin":
      router.push("/portal/admin");
      break;
    case "teacher":
      router.push("/portal/teacher");
      break;
    case "student":
      router.push("/portal/student");
      break;
    case "parent":
      router.push("/portal/parent");
      break;
    default:
      router.push("/login"); // Fallback
  }
}
