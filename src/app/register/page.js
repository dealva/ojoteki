// Registration page for new users
import RegisterForm from '@/components/auth/RegisterForm';
import AuthLayout from '@/components/auth/layout/AuthLayout';
import ServerProvider from '@/contexts/csrf-token/server';
import { metadataConfig } from '@/lib/metadata';
export const metadata = metadataConfig.register;
export default function RegisterPage() {


  return (
    <>
      <AuthLayout>
        <ServerProvider>
          <RegisterForm />
        </ServerProvider>
      </AuthLayout>
    </>
  );
}
