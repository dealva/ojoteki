'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function SortSelect({ currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(e) {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', value);

    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={onChange}
      className="border border-[#C24B4B] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C24B4B]"
      aria-label="Urutkan produk berdasarkan harga"
    >
      <option value="asc">Harga: Termurah ke Termahal</option>
      <option value="desc">Harga: Termahal ke Termurah</option>
    </select>
  );
}
