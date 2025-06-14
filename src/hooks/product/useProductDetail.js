'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import useCartStore from '@/hooks/cart/useCartStore';

export function useProductDetail({ product, needsProfileCompletion }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (needsProfileCompletion) return;

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');

      const data = await res.json();
      useCartStore.getState().setCartItems(data.updatedCart);

      toast.success(`Menambahkan ${quantity} dari "${product.name}" ke keranjang`);
    } catch (error) {
      toast.error('Gagal menambahkan ke keranjang');
      console.error(error);
    }
  };

  const handleBuyNow = async () => {
    if (needsProfileCompletion) return;

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          direct: true,
          productId: product.id,
          quantity,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to initiate payment');
      }

      const { snapToken, orderId } = await res.json();

      window.snap.pay(snapToken, {
        onSuccess: () => {
          toast.success('Pembayaran berhasil!');
          window.location.href = `/orders`;
        },
        onPending: () => {
          toast.info('Pembayaran menunggu konfirmasi.');
          window.location.href = `/orders`;
        },
        onError: () => {
          toast.error('Pembayaran gagal, silakan coba lagi.');
        },
        onClose: () => {
          toast.info('Menu Pembayaran Ditutup.');
          window.location.href = `/orders`;
        },
      });
    } catch (error) {
      toast.error(error.message || 'Gagal melakukan pembelian');
      console.error(error);
    }
  };

  return {
    quantity,
    setQuantity,
    handleAddToCart,
    handleBuyNow,
  };
}
