'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get('category') ?? 'all';
  const sort = searchParams.get('sort') ?? 'asc'; // default sort
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();

    const params = new URLSearchParams();

    if (trimmed.length > 0) {
      params.set('q', trimmed);
    }

    if (category && category !== 'all') {
      params.set('category', category);
    }

    if (sort && sort !== 'asc') {
      params.set('sort', sort);
    }

    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="ml-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari produk..."
        className="px-4 py-2 rounded-md border border-[#C24B4B] focus:outline-none focus:ring-2 focus:ring-[#C24B4B]"
      />
    </form>
  );
}
