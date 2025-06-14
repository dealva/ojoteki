// components/catalog/CategoryFilter.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CategorySelect } from '../common/form/search/SearchFilterBarParts';

export default function CategoryFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category') ?? 'all';
  const currentSearch = searchParams.get('q') ?? '';

  function onChange(value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }

    // Keep q param if it exists, or remove if empty
    if (!currentSearch) {
      params.delete('q');
    } else {
      params.set('q', currentSearch);
    }

    router.push(`?${params.toString()}`);
  }

  return (
    <CategorySelect
      value={categoryFilter}
      onChange={onChange}
      categories={categories}
    />
  );
}
