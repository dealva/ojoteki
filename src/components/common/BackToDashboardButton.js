//src/components/common/BackToDashboardButton.js
'use client';

import { useRouter } from 'next/navigation';

const BackToDashboardButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/admin/dashboard'); // or '/home', based on your routing
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-2 bg-[#F5D7D7] text-[#C24B4B] rounded-md hover:bg-[#C24B4B] hover:text-white transition"
    >
      Kembali Ke Dashboard
    </button>
  );
};

export default BackToDashboardButton;
