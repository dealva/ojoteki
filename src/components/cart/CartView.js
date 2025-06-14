'use client';

import Image from 'next/image';
import { toast } from 'react-toastify';
import { Button } from '@/components/common/basic/Button';
import Separator from '@/components/common/basic/Separator';
import useCartView from '@/hooks/cart/useCartView';

export default function CartView() {
  const {
    cartItems,
    loading,
    handleUpdateQuantity,
    handleRemoveItem,
    subtotal,
    handleCheckout
  } = useCartView();

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow gap-8 flex flex-col">
        Memuat...
      </div>
    );
  if (cartItems.length === 0)
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow gap-8 flex flex-col">
        Keranjang kosong
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 w-full flex-grow gap-8 flex flex-col">
      <h1
        className="text-4xl font-extrabold"
        style={{ color: '#C24B4B' }}
      >
        Keranjang
      </h1>

      <div className="space-y-6">
        {cartItems.map((item) => {
          const isMinusDisabled = item.quantity <= 1;
          const itemTotal = item.price * item.quantity;

          return (
            <div
              key={item.product_id}
              className="flex items-center justify-between gap-6 p-5 rounded-xl border border-[#F5F1E9] shadow-md bg-[#F5F1E9]"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover shadow-sm flex-shrink-0"
                />

                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-[#6B4C3B] truncate">{item.name}</h2>
                  <p className="text-md text-[#6B4C3B]/80 mt-1">
                    Rp{item.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium mt-1 text-[#6B4C3B]">
                    Total: Rp{itemTotal.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center gap-4 ">
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className={`text-[#C24B4B] border-[#C24B4B] px-1 hover:bg-[#C24B4B]/10 ${isMinusDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    onClick={() => !isMinusDisabled && handleUpdateQuantity(item.product_id, -1)}
                    disabled={isMinusDisabled}
                    aria-label={`Kurangi jumlah ${item.name}`}
                  >
                    −
                  </Button>
                  <span className="w-10 text-center text-[#6B4C3B] font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="text-[#C24B4B] border-[#C24B4B] px-1 hover:bg-[#C24B4B]/10"
                    onClick={() => handleUpdateQuantity(item.product_id, 1)}
                    aria-label={`Tambah jumlah ${item.name}`}
                  >
                    +
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-[#C24B4B] hover:bg-[#6B4C3B] text-[#F5F1E9] w-full"
                  onClick={() => handleRemoveItem(item.product_id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      <div className="ml-auto w-full max-w-sm space-y-4 text-right">
        <div
          className="text-2xl font-bold"
          style={{ color: '#6B4C3B' }}
        >
          Total:{' '}
          <span className="text-[#C24B4B]">Rp{subtotal.toLocaleString()}</span>
        </div>
        <Button
          className="w-full bg-[#C24B4B] hover:bg-[#6B4C3B] text-[#F5F1E9]"
          onClick={() => handleCheckout()}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
