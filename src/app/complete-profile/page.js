import AuthLayout from '@/components/auth/layout/AuthLayout';
import CompleteProfileForm from '@/components/auth/CompleteProfileForm';
import { metadataConfig } from '@/lib/metadata';
import { getSessionUser } from '@/lib/getSessionUser';
export const metadata = metadataConfig.login;

export default async function CompleteProfilePage() {
    const { isAuthenticated, user } = await getSessionUser();
  return (
    <AuthLayout>
      <CompleteProfileForm user={ user } />
    </AuthLayout>
  );
}
