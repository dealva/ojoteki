'use client';

import React, { useState } from 'react';

export default function OrderTable({ items, loading, onCancel, onShip }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const openShipModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCourier('');
    setTrackingNumber('');
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!courier || !trackingNumber) {
      alert('Please enter courier and tracking number');
      return;
    }
    onShip(selectedOrderId, courier, trackingNumber);
    setShowModal(false);
  };

  return (
    <>
      {loading ? (
        <p className="p-4 text-center text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-[#F5F1E9] text-[#6B4C3B] sticky top-0">
            <tr>
              <th className="border border-gray-300 p-2 text-left">User</th>
              <th className="border border-gray-300 p-2 text-left">Address</th>
              <th className="border border-gray-300 p-2 text-left">Total</th>
              <th className="border border-gray-300 p-2 text-center">Order Status</th>
              <th className="border border-gray-300 p-2 text-center">Shipment Status</th>
              <th className="border border-gray-300 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              items.map((order) => (
                <tr key={order.id} className="hover:bg-[#F5D7D7]">
                  <td className="border border-gray-300 p-2">{order.user_name}</td>
                  <td className="border border-gray-300 p-2 text-sm text-gray-700 whitespace-pre-line">
                    {order.user_address ?? 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-2">Rp {order.total_price}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'shipped'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-gray-300 text-gray-700'
                          : ''
                      }`}
                    >
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-sm">
                    {order.shipment_status && order.shipment_status !== '-' ? (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          order.shipment_status.toLowerCase() === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : ['on_process', 'on_transit', 'picked_up'].includes(order.shipment_status.toLowerCase())
                            ? 'bg-yellow-100 text-yellow-800'
                            : ['cancelled', 'failed'].includes(order.shipment_status.toLowerCase())
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {order.shipment_status
                          .replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center space-x-2">
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => openShipModal(order.id)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => onCancel(order.id)}
                        className="text-orange-600 hover:text-orange-800 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Shipment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-[#6B4C3B]">Ship Order</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Courier (e.g. JNE, J&T)"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              />
              <input
                type="text"
                placeholder="Tracking Number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
              />
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Confirm Shipment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
