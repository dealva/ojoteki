'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TextInput from '@/components/common/form/TextInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import BackToHomeButton from '@/components/common/BackToHomeButton';
import FormHeader from '@/components/common/form/FormHeader';
import { completeProfileSchema } from '@/lib/validators';
import { getSession } from 'next-auth/react';
export default function CompleteProfileForm({ user }) {
  const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') || '/';
  // Initialize form with user prop data, fallback to empty strings
  const [form, setForm] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Send only the updatable fields (exclude email)
    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.address,
    };
    await completeProfileSchema.validate(payload, { abortEarly: false });
    const res = await fetch('/api/auth/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
        await getSession();
      router.push(returnTo);
    } else {
      alert('Gagal menyimpan profil. Coba lagi.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <FormHeader title="Profile Saya" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email"
          name="email"
          value={form.email}
          onChange={() => {}}
          required
          disabled={true}
        />

        <TextInput
          label="Nama"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <TextInput
          label="Nomor HP"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <TextInput
          label="Alamat"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <SubmitButton text="Simpan Profil" loading={loading} />
      </form>

      <div className="mt-6 text-center">
        <BackToHomeButton />
      </div>
    </div>
  );
}
