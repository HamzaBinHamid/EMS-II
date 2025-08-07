import { GetServerSideProps } from 'next';
import { verifyToken, DecodedUser } from '@/lib/verifyToken';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await verifyToken(req);

  if (!user || user.role !== 'admin') {
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: { user } };
};

export default function AdminPortal({ user }: { user: DecodedUser }) {
  return <h1>Welcome Admin: {user.full_name}</h1>;
}
