import React from 'react';

export default function UserTable({ items, loading, onDelete }) {
  return loading ? (
    <p className="p-4 text-center text-gray-500">Loading...</p>
  ) : (
    <table className="w-full border-collapse border border-gray-200">
      <thead className="bg-[#F5F1E9] text-[#6B4C3B] sticky top-0">
        <tr>
          <th className="border border-gray-300 p-2 text-left">Name</th>
          <th className="border border-gray-300 p-2 text-left">Email</th>
          <th className="border border-gray-300 p-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-4 text-center text-gray-500">
              No users found.
            </td>
          </tr>
        ) : (
          items.map((user) => (
            <tr key={user.id} className="hover:bg-[#F5D7D7]">
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => onDelete(user.id)}
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
