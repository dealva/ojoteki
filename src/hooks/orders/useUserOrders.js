import { useCallback, useEffect, useState, useRef } from 'react';

export default function useUserOrders(statusFilter = '', initialPage = 1, initialLimit = 10) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const pageRef = useRef(initialPage);
  const [limit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const totalPagesRef = useRef(1);

  const fetchOrders = useCallback(async (pageToFetch = pageRef.current) => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/orders?page=${pageToFetch}&limit=${limit}`;
      if (statusFilter) {
        url += `&status=${encodeURIComponent(statusFilter)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');

      if (pageToFetch === 1) {
        setOrders(data.orders);
      } else {
        setOrders((prev) => [...prev, ...data.orders]);
      }

      setTotalPages(data.pagination?.totalPages || 1);
      totalPagesRef.current = data.pagination?.totalPages || 1;

      setPage(pageToFetch);
      pageRef.current = pageToFetch;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, limit]);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders, statusFilter]);

  const loadMore = useCallback(() => {
  
    if (pageRef.current < totalPagesRef.current) {
      fetchOrders(pageRef.current + 1);
    }
  }, [fetchOrders]);

  return { orders, loading, error, refetch: () => fetchOrders(1), loadMore, page, totalPages };
}
