'use client';

import React from 'react';
import Link from 'next/link';
import { FiShoppingCart, FiCreditCard, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useProductDetail } from '@/hooks/product/useProductDetail';

export default function ProductDetailView({ product, user, needsProfileCompletion }) {
  const pathname = usePathname();
  const { quantity, setQuantity, handleAddToCart, handleBuyNow } = useProductDetail({
    product,
    needsProfileCompletion,
  });
  const totalPrice = product.price * quantity;

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-xl object-cover aspect-square border-4 border-[#6B4C3B]"
        />

        <div className="space-y-6">
          <h1 className="text-3xl font-extrabold text-[#6B4C3B]">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.category_name}</p>

          <div className="border-t border-b py-4 space-y-2">
            <p className="text-2xl font-bold text-[#C24B4B]">
              Rp {product.price.toLocaleString('id-ID')} <span className="text-base font-normal text-gray-500">/ item</span>
            </p>
            <p className="text-lg text-[#6B4C3B] font-semibold">
              Total: Rp {totalPrice.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#6B4C3B] mb-1">Deskripsi Barang:</p>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {!user ? (
            <div className="p-4 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2 text-sm">
              <FiAlertCircle size={20} />
              <span>Silahkan Masuk ke akun anda dahulu.</span>
              <Link href="/login" className="underline font-medium text-[#6B4C3B] ml-auto">
                Masuk
              </Link>
            </div>
          ) : needsProfileCompletion ? (
            <div className="p-4 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2 text-sm">
              <FiAlertCircle size={20} />
              <span>Lengkapi profil Anda sebelum membeli.</span>
              <Link href={`/complete-profile?returnTo=${encodeURIComponent(pathname)}`} className="underline font-medium text-[#6B4C3B] ml-auto">
                Lengkapi Profil
              </Link>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B4C3B]"
                disabled={needsProfileCompletion}
              />
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-md bg-[#6B4C3B] text-white hover:bg-[#57392E] transition disabled:opacity-50"
                disabled={needsProfileCompletion}
                title="Tambah ke Keranjang"
              >
                <FiShoppingCart size={20} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={needsProfileCompletion}
              className="flex items-center justify-center gap-2 bg-[#F5F1E9] text-[#6B4C3B] px-5 py-2 rounded-md border border-[#6B4C3B] hover:bg-[#e6e1d9] transition w-full sm:w-auto disabled:opacity-50"
              title="Beli Sekarang"
            >
              <FiCreditCard size={20} />
              Beli Sekarang
            </button>
          </div>

          <div className="mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-[#6B4C3B] font-semibold border border-[#6B4C3B] rounded-md px-4 py-2 hover:bg-[#6B4C3B] hover:text-white transition"
            >
              <FiArrowLeft size={20} />
              Kembali
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
