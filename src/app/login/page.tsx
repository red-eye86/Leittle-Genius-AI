import LoginCard from '@/components/ui/LoginCard';

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const target = searchParams?.redirect || '/parent/dashboard';
  return <LoginCard redirectTo={target} isMainPage={false} />;
}
