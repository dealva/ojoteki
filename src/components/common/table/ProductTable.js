import React from 'react';

export default function ProductTable({ items, loading, onEdit, onDelete }) {
  return loading ? (
    <p className="p-4 text-center text-gray-500">Loading...</p>
  ) : (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-[#F5F1E9] text-[#6B4C3B] sticky top-0">
        <tr>
          <th className="border border-gray-300 p-2 text-left">Item Name</th>
          <th className="border border-gray-300 p-2 text-center">Featured</th>
          <th className="border border-gray-300 p-2 text-left">Category</th>
          <th className="border border-gray-300 p-2 text-left">Price</th>
          <th className="border border-gray-300 p-2 text-center">Stock</th>
          <th className="border border-gray-300 p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-500">
              No items found.
            </td>
          </tr>
        ) : (
          items.map((item) => (
            <tr key={item.id} className="hover:bg-[#F5D7D7]">
              <td className="border border-gray-300 p-2">{item.name}</td>
              <td className="border border-gray-300 p-2 text-center">
                {item.featured ? '✅' : '❌'}
              </td>
              <td className="border border-gray-300 p-2">{item.category}</td>
              <td className="border border-gray-300 p-2">{item.price}</td>
              <td className="border border-gray-300 p-2 text-center">{item.stock_quantity}</td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-[#6B4C3B] hover:text-[#C24B4B] font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
