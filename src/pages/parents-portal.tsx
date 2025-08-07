import { GetServerSideProps } from 'next';
import { verifyToken, DecodedUser } from '@/lib/verifyToken';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await verifyToken(req);

  if (!user || user.role !== 'parent') {
    return { redirect: { destination: '/login', permanent: false } };
  }

  return { props: { user } };
};

export default function ParentsPortal({ user }: { user: DecodedUser }) {
  return <h1>Welcome Parent: {user.full_name}</h1>;
}
