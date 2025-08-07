import { GetServerSideProps } from 'next';
import { verifyToken, DecodedUser } from '@/lib/verifyToken';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await verifyToken(req);

  if (!user || user.role !== 'teacher') {
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: { user } };
};

export default function TeacherPortal({ user }: { user: DecodedUser }) {
  return <h1>Welcome Teacher: {user.full_name}</h1>;
}
