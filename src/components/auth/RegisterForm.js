'use client';

import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import FormHeader from '@/components/common/form/FormHeader';
import useRegisterForm from '@/hooks/auth/useRegisterForm';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';
import BackToHomeButton from '@/components/common/BackToHomeButton';

export default function RegisterForm() {
  const { formData, loading, handleChange, handleSubmit } = useRegisterForm();


  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <FormHeader title="Daftar Akun" />

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <TextInput
          label="Nama Lengkap"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <TextInput
          label="Konfirmasi Kata Sandi"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <SubmitButton
          loading={loading}
          text="Daftar"
        />
      </form>

      <div className="mt-6">
        <RedirectPrompt
          message="Sudah punya akun?"
          linkText="Masuk di sini"
          href="/login"
        />
      </div>

      <div className="mt-6 text-center">
        <BackToHomeButton />
      </div>
    </div>
  );
}
