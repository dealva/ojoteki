'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { registerValidator } from '@/lib/validators';
import { useCsrfToken } from '@/contexts/csrf-token/client';
import { useReCaptcha } from 'next-recaptcha-v3';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export default function useRegisterForm() {
    const csrfToken = useCsrfToken();
    const { executeRecaptcha } = useReCaptcha();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await executeRecaptcha('register');

            await registerValidator.validate(formData, { abortEarly: false });

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify({ ...formData, recaptchaToken: token }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Pendaftaran gagal');

            toast.success('Pendaftaran berhasil!');

            const loginToken = await executeRecaptcha('login');

            const result = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
                recaptchaToken: loginToken,
            });

            console.log('Respon SignIn:', result);

            if (result.ok) {
                toast.success('Mengalihkan ke beranda...');
                redirect('/');
            } else {
                toast.error('Login gagal setelah pendaftaran.');
            }
        } catch (err) {
            if (isRedirectError(err)) {
                throw err;
            } else {
                toast.error('Terjadi kesalahan. Email anda sudah terdaftar');
            }
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, handleChange, handleSubmit };
}
