'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import useCartView from '@/hooks/cart/useCartView';
import useCartStore from '@/hooks/cart/useCartStore';

export default function UserAvatar({
  src = '/assets/images/avatar/defaultAvatar.png',
  onClick,
}) {
  const { cartItems: freshCartItems } = useCartView();
  const setCartItems = useCartStore((state) => state.setCartItems);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    setCartItems(freshCartItems);
  }, [freshCartItems, setCartItems]);

  const itemCount = cartItems.length;

  return (
    <button
      onClick={onClick}
      className="ml-4 relative w-10 h-10 border border-[#C24B4B] rounded-full"
    >
      <div className="w-full h-full rounded-full overflow-hidden">
        <Image
          src={src}
          alt="User Avatar"
          width={40}
          height={40}
          className="object-cover"
        />
      </div>

      {itemCount > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-[#C24B4B] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md z-10">
          {itemCount}
        </div>
      )}
    </button>
  );
}
