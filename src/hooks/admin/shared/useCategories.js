// hooks/admin/add/useCategories.js
'use client';
import { useEffect, useState } from 'react';

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, reloadCategories: fetchCategories };
}
