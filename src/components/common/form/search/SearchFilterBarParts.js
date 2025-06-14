import React from 'react';
export function DataSelect({dataType,onDataTypeChange}){
  return (
    <select
    value={dataType}
    onChange={(e) => onDataTypeChange(e.target.value)}
    className="border rounded px-3 py-2"
  >
    <option value="products">Products</option>
    <option value="users">Users</option>
    <option value="orders">Orders</option>
    <option value="transactions">Transaction</option>
  </select>
  );
}
// Search input component
export function SearchInput({ value, onChange, onSubmit }) {
  return (
    <input
      type="search"
      placeholder="Search items..."
      className="border rounded px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
    />
  );
}

// Featured filter dropdown
export function FeaturedSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="all">All</option>
      <option value="true">✅ Featured</option>
      <option value="false">❌ Not Featured</option>
    </select>
  );
}

// Category select dropdown
export function CategorySelect({ value, onChange, categories }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2"
    >
      <option value="all">Category: All</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}

// Add item button
export function AddItemButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#C24B4B] text-white px-4 py-2 rounded hover:bg-[#a53c3c]"
    >
      Add Item
    </button>
  );
}

// Chat notification button
export function ChatButton({ notifications, onClick }) {
  return (
    <button
      className="relative"
      title={`${notifications} new chat(s)`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#C24B4B]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0-4.418-4.03-8-9-8S3 7.582 3 12c0 1.657 1.343 3 3 3h9l3 3v-3h3c.552 0 1-.448 1-1z"
        />
      </svg>
      {notifications > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {notifications}
        </span>
      )}
    </button>
  );
}
