import LoginCard from '@/components/ui/LoginCard';

export default function ParentLoginPage() {
  return <LoginCard redirectTo="/parent/dashboard" isMainPage={false} />;
}
