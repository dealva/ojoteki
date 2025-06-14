'use client';

import useUserOrders from '@/hooks/orders/useUserOrders';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function UserOrdersView() {
  const [statusFilter, setStatusFilter] = useState('');
  const { orders, loading, error, refetch, loadMore, page, totalPages } = useUserOrders(statusFilter);

    const handleRetry = async (orderId) => {
    try {
        
        const res = await fetch(`/api/orders/${orderId}/retry`, {
        method: 'PATCH',
        });
        
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to retry payment');

        const snapToken = data.snap_token;

        if (window.snap && snapToken) {
        window.snap.pay(snapToken, {
            onSuccess: async () => {
            toast.success('Payment successful!');
            await refetch();
            },
            onPending: async () => {
            toast.info('Payment is pending...');
            await refetch();
            },
            onError: (error) => {
            toast.error('Payment failed. Please try again.');
            console.error('Payment failed:', error);
            },
            onClose: () => {
            toast.info('Payment popup closed.');
            },
        });
        } else {
        throw new Error('Midtrans snap is not loaded or snap token missing');
        }
    } catch (err) {
        toast.error(`Error retrying payment: ${err.message}`);
        console.error(`Error retrying payment for order ${orderId}:`, err.message);
    }
    };

    const handleCancel = async (orderId) => {
    try {
        const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to cancel order');

        toast.success(`Order #${orderId} cancelled successfully.`);

        await refetch(); 
    } catch (err) {
        toast.error(`Failed to cancel order #${orderId}: ${err.message}`);
        console.error(`Error cancelling order ${orderId}:`, err.message);
    }
    };


  const badgeClasses = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-200 text-gray-600',
    failed: 'bg-red-100 text-red-700',
  };

  if (loading && page === 1) return <p>Loading your orders...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-6 bg-[#F5F1E9] p-4 sm:p-6 rounded-2xl">
      {/* Filter dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-[#6B4C3B]">Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-[#E5DCD3] px-3 py-2 text-sm text-[#6B4C3B]"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders list or no orders */}
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} className="bg-white border border-[#E5DCD3] rounded-2xl shadow-md p-6">
            {/* order header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#C24B4B]">Order #{order.order_id}</h2>
                <p className="text-sm text-[#6B4C3B]">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    badgeClasses[order.order_status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Order : {order.order_status}
                </span>

                {order.order_status !== 'cancelled' && (
                  <>
                    <span className="px-3 py-1 rounded-full bg-[#EDF6EC] text-[#6B4C3B] text-sm">
                      Payment : {order.transaction_status || 'Unpaid'}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FEF9E6] text-[#6B4C3B] text-sm">
                      Shipment : {order.shipment_status || 'Waiting'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* order items */}
            <div className="space-y-4 mt-4">
              {order.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex items-center gap-4 border border-[#E5DCD3] rounded-xl p-3 bg-[#FAF7F2]"
                >
                  <Image
                    src={item.image_url || '/placeholder.png'}
                    alt={item.product_name}
                    width={64}
                    height={64}
                    className="rounded-xl object-cover w-16 h-16"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#6B4C3B]">{item.product_name}</h3>
                    <p className="text-sm text-[#A58C7E]">
                      Qty: {item.quantity} × Rp{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* total price */}
            <div className="text-right font-semibold text-[#C24B4B] mt-6">
              Total: Rp{order.total_price.toLocaleString()}
            </div>

            {/* buttons */}
            <div className="mt-4 flex gap-2 justify-end">
              {order.order_status === 'pending' && (
                <>
                  <button
                    onClick={() => handleRetry(order.order_id)}
                    className="px-4 py-2 text-sm rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Check Payment
                  </button>
                  <button
                    onClick={() => handleCancel(order.order_id)}
                    className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel Order
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}

      {/* Load more button */}
      {page < totalPages && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-[#C24B4B] text-white rounded-md hover:bg-[#a03a3a] disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}