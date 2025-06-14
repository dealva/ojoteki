'use client';

export default function CategorySelect({ name, value, onChange, categories = [] }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded"
    >
      <option value="">Pilih Kategori</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
