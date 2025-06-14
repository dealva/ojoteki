'use client';

import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import FormHeader from '@/components/common/form/FormHeader';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';
import BackToHomeButton from '@/components/common/BackToHomeButton';
import GoogleLoginButton from '@/components/common/GoogleLoginButton';
import useLoginForm from '@/hooks/auth/useLoginForm';

function LoginForm() {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit,
    onGoogleLogin,
  } = useLoginForm();

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <FormHeader title="Masuk" />

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <TextInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <TextInput
          label="Kata Sandi"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <SubmitButton loading={loading} text="Masuk" />
      </form>

      {/* Divider with "atau" */}
      <div className="my-6 flex items-center gap-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-sm text-gray-500">atau</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      {/* Google login button */}
      <GoogleLoginButton onClick={onGoogleLogin} />

      <div className="mt-6">
        <RedirectPrompt
          message="Belum punya akun?"
          linkText="Daftar di sini"
          href="/register"
        />
      </div>

      <div className="mt-6 text-center">
        <BackToHomeButton />
      </div>
    </div>
  );
}

export default LoginForm;
