'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { loginValidator } from '@/lib/validators';
import { useReCaptcha } from 'next-recaptcha-v3';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export default function useLoginForm() {
  const { executeRecaptcha } = useReCaptcha();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await executeRecaptcha('login');
      await loginValidator.validate(formData, { abortEarly: false });

      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        recaptchaToken: token,
      });

      if (res?.ok) {
        toast.success('Berhasil masuk');
        redirect('/');
      } else {
        toast.error('Gagal masuk. Silakan periksa kembali email dan kata sandi.');
      }
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      } else {
        toast.error(err?.message || 'Terjadi kesalahan validasi atau CSRF.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit,
    onGoogleLogin,
  };
}
