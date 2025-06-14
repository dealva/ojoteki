import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useCartStore from '@/hooks/cart/useCartStore';

export default function useCartView() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(() => toast.error('Gagal memuat keranjang'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateQuantity = async (productId, delta) => {
    const item = cartItems.find(i => i.product_id === productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await handleRemoveItem(productId);
      return;
    }

    const res = await fetch('/api/cart/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity: newQty }),
    });

    if (res.ok) {
      setCartItems(items =>
        items.map(i =>
          i.product_id === productId ? { ...i, quantity: newQty } : i
        )
      );
    } else {
      toast.error('Gagal memperbarui jumlah');
    }
  };

  const handleRemoveItem = async (productId) => {
    const res = await fetch('/api/cart/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    });

    if (res.ok) {
      const data = await res.json();
      useCartStore.getState().setCartItems(data.updatedCart);
      setCartItems(items => items.filter(i => i.product_id !== productId));
    } else {
      toast.error('Gagal menghapus item');
    }
  };

  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // New checkout function for cart
  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        toast.info('Keranjang Anda kosong');
        return;
      }

      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direct: false }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal memulai pembayaran');
      }

      const { snapToken, orderId } = await res.json();
      
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          toast.success('Pembayaran berhasil!');
          window.location.href = `/orders}`;
        },
        onPending: function (result) {
          toast.info('Pembayaran menunggu konfirmasi.');
          window.location.href = `/orders`;
        },
        onError: function (result) {
          toast.error('Pembayaran gagal, silakan coba lagi.');
        },
        onClose: function () {
          toast.info('Menu Pembayaran Ditutup.');
          window.location.href = `/orders`;
        },
    });

    } catch (error) {
      toast.error(error.message || 'Gagal melakukan checkout');
      console.error(error);
    }
  };

  return {
    cartItems,
    loading,
    handleUpdateQuantity,
    handleRemoveItem,
    subtotal,
    handleCheckout, 
  };
}
