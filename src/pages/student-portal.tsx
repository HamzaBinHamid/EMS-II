// pages/student-portal.tsx
import { GetServerSideProps } from "next";
import { verifyToken, DecodedUser } from "@/lib/verifyToken";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await verifyToken(req);
  if (!user || user.role !== "student") {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: { user } };
};

export default function StudentPortal({ user }: { user: DecodedUser }) {
  return <h1>Welcome Student: {user.full_name}</h1>;
}
