'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export default function useDashboardView(initialItems = [], initialTotalPages = 1, initialPage = 1) {
  const [dataType, setDataType] = useState('products');
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchItems = useCallback(
    async (
      search = searchTerm,
      currentPage = page,
      featured = featuredFilter,
      category = categoryFilter
    ) => {
      setLoading(true);
      const query = new URLSearchParams({ search, page: currentPage });

      if (dataType === 'products') {
        query.append('featured', featured);
        query.append('category', category);
      }

      try {
        const res = await fetch(`/api/admin/${dataType}?${query.toString()}`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message = errorData.error || `Failed to fetch ${dataType}`;
          throw new Error(message);
        }
        const data = await res.json();
        setItems(data[dataType] || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error(`Error loading ${dataType}:`, err.message);
        setItems([]);
        setTotalPages(1);
        toast?.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, page, featuredFilter, categoryFilter, dataType]
  );

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to delete this ${dataType.slice(0, -1)}?`)) return;

    try {
      const res = await fetch(`/api/admin/${dataType}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`${dataType.slice(0, -1)} deleted successfully`);
        await fetchItems();
      } else {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.error || `Failed to delete ${dataType.slice(0, -1)}. Please try again later.`;
        toast.error(message);
      }
    } catch (err) {
      toast.error('Unexpected error occurred while deleting.');
    }
  };

  const handleCancel = async (id) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (res.ok) {
        toast.success('Order cancelled');
        await fetchItems();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch (err) {
      toast.error('Error cancelling order');
    }
  };

  const handleShip = async (id, courier, trackingNumber) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courier, trackingNumber }),
      });

      if (res.ok) {
        toast.success('Order marked as shipped');
        await fetchItems();
      } else {
        toast.error('Failed to mark order as shipped');
      }
    } catch (err) {
      toast.error('Error shipping order');
    }
  };

  useEffect(() => {
    if (dataType === 'products') fetchCategories();
  }, [dataType]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, featuredFilter, categoryFilter, dataType]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    dataType,
    setDataType,
    items,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    loading,
    featuredFilter,
    setFeaturedFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    fetchItems,
    handleDelete,
    handleCancel,
    handleShip
  };
}
