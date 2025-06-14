'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import useCartView from '@/hooks/cart/useCartView';
import useCartStore from '@/hooks/cart/useCartStore';

export default function UserDropdown({
  profilePhoto = '/assets/images/avatar/defaultAvatar.png',
  user,
}) {
  const isAdmin = user?.role === 'admin';
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { cartItems: freshCartItems } = useCartView();
  const setCartItems = useCartStore((state) => state.setCartItems);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    setCartItems(freshCartItems);
  }, [freshCartItems, setCartItems]);

  const itemCount = cartItems.length;

  return (
    <>
      <div className="absolute top-0 right-0 mt-2 w-64 bg-white rounded-lg shadow-md z-10 p-4 text-sm text-[#6B4C3B] border border-[#C24B4B]">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={profilePhoto}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-[#C24B4B]"
          />
          <div className="overflow-hidden">
            <p className="font-semibold truncate">{user?.name}</p>
            <p className="text-[#6B4C3B]/70 truncate text-xs">{user?.email}</p>
          </div>
        </div>

        <button
          disabled={isAdmin}
          className={`w-full text-left py-2 px-3 rounded-md mt-2 font-medium transition relative
            ${isAdmin ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[#F5D7D7]'}`}
          onClick={() => !isAdmin && router.push('/cart')}
        >
          Keranjang
          {itemCount > 0 && (
            <span className="absolute top-1.5 right-2 bg-[#C24B4B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {itemCount}
            </span>
          )}
        </button>

        <button
          disabled={isAdmin}
          className={`w-full text-left py-2 px-3 rounded-md mt-2 font-medium transition
            ${isAdmin ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[#F5D7D7]'}`}
          onClick={() => setShowModal(true)}
        >
          Ubah Gambar Profil
        </button>

        <button
          disabled={isAdmin}
          className={`w-full text-left py-2 px-3 rounded-md mt-2 font-medium transition
            ${isAdmin ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-[#F5D7D7]'}`}
          onClick={() => !isAdmin && router.push('/complete-profile')}
        >
          Profil Saya
        </button>

        {isAdmin && (
          <button
            className="w-full text-left py-2 px-3 rounded-md mt-2 font-medium bg-[#C24B4B] text-white hover:bg-[#a53c3c] transition"
            onClick={() => window.open('/admin/dashboard', '_blank')}
            type="button"
          >
            Ke Dashboard
          </button>
        )}

        <button
          type="button"
          className="w-full text-left py-2 px-3 rounded-md mt-2 font-semibold text-[#C24B4B] hover:bg-[#F5D7D7] transition"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          Keluar
        </button>
      </div>

      {showModal && <UploadProfileModal user={user} onClose={() => setShowModal(false)} />}
    </>
  );
}

function UploadProfileModal({ user, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    const res = await fetch('/api/profile/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      window.location.reload(); // refresh photo
    } else {
      alert('Upload gagal.');
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-20 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-[#6B4C3B]">
        <h2 className="text-lg font-semibold mb-4">Ubah Foto Profil</h2>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Batal</button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 rounded bg-[#C24B4B] text-white hover:bg-[#a53c3c]"
          >
            {loading ? 'Mengunggah...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
