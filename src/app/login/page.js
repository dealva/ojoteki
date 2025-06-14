import AuthLayout from '@/components/auth/layout/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { metadataConfig } from '@/lib/metadata';

export const metadata = metadataConfig.login;

export default function LoginPage() {
  // Dummy Google login handler (replace with real OAuth logic)

  return (
    <AuthLayout>
      <LoginForm  />
    </AuthLayout>
  );
}
