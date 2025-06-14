import React from 'react';

export default function TransactionTable({ items, loading }) {
  return loading ? (
    <p className="p-4 text-center text-gray-500">Loading transactions...</p>
  ) : (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-[#F5F1E9] text-[#6B4C3B] sticky top-0">
        <tr>
          <th className="border border-gray-300 p-2 text-left">Order ID</th>
          <th className="border border-gray-300 p-2 text-left">Customer</th>
          <th className="border border-gray-300 p-2 text-left">Method</th>
          <th className="border border-gray-300 p-2 text-left">Status</th>
          <th className="border border-gray-300 p-2 text-left">Paid At</th>
          <th className="border border-gray-300 p-2 text-left">Reference</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500">
              No transactions found.
            </td>
          </tr>
        ) : (
          items.map((tx) => (
            <tr key={tx.id} className="hover:bg-[#F5D7D7]">
              <td className="border border-gray-300 p-2">#{tx.order_id}</td>
              <td className="border border-gray-300 p-2">{tx.user_name || '-'}</td>
              <td className="border border-gray-300 p-2 capitalize">
                {tx.payment_method || '-'}
              </td>
              <td className="border border-gray-300 p-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    tx.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : tx.status === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {tx.status}
                </span>
              </td>
              <td className="border border-gray-300 p-2">
                {tx.paid_at ? new Date(tx.paid_at).toLocaleString() : '-'}
              </td>
              <td className="border border-gray-300 p-2 break-all">{tx.reference}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
