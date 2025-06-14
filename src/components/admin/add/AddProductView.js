'use client';

import { useState } from 'react';
import TextInput from '@/components/common/form/TextInput';
import ImageUpload from '@/components/common/form/ImageUpload';
import CheckboxInput from '@/components/common/form/CheckboxInput';
import CategorySelect from '@/components/common/form/CategorySelect';
import { productValidator } from '@/lib/validators';
import useCategories from '@/hooks/admin/shared/useCategories';
import useProductForm from '@/hooks/admin/shared/useProductForm';
import SubmitButton from '@/components/common/form/SubmitButton';
import BackToDashboardButton from '@/components/common/BackToDashboardButton';
export default function AddProductPage() {
  const { categories, reloadCategories } = useCategories();


  const {
    form,
    setForm,
    uploading,
    handleChange,
    handleImageChange,
    resetCategoryFields,
    validateForm,
    uploadImageFile,
  } = useProductForm({ validator: productValidator });

  const [showSummary, setShowSummary] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      image_file: null,
      featured: false,
      useNewCategory: false,
      category_id: '',
      new_category_name: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await validateForm();

      let categoryId = form.category_id;

      if (form.useNewCategory && form.new_category_name.trim()) {
        const resCategory = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: form.new_category_name }),
        });
        if (!resCategory.ok) throw new Error('Failed to create category');
        const newCategory = await resCategory.json();
        categoryId = newCategory.id;

        await reloadCategories();
      }

      const imageUrl = await uploadImageFile();

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price, 10),
          stock_quantity: parseInt(form.stock_quantity, 10),
          category_id: parseInt(categoryId, 10),
          featured: form.featured,
          image_url: imageUrl,
        }),
      });

      if (res.ok) {
        const newProduct = await res.json();
        setSubmittedData({ ...newProduct, image_url: imageUrl });
        setShowSummary(true);
        resetForm(); // Clear form inputs here!
      } else {
        console.error('Failed to add product');
        alert('Gagal menambahkan produk.');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const messages = err.inner.map((e) => e.message);
        alert(messages.join('\n'));
      } else {
        alert(err.message || 'An error occurred');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative max-w-3xl w-full p-6 bg-white rounded shadow">
        <div className="absolute top-4 right-4">
            <BackToDashboardButton />
        </div>
        <h1 className="text-xl font-bold mb-4">Tambah Produk</h1>
        <form onSubmit={handleSubmit} className="space-y-4 pb-16" id="productForm">
          <TextInput label="Nama Produk" name="name" value={form.name} onChange={handleChange} required />
          <TextInput label="Deskripsi" name="description" value={form.description} onChange={handleChange} multiline />
          <TextInput label="Harga" name="price" type="number" value={form.price} onChange={handleChange} required />
          <TextInput label="Stok" name="stock_quantity" type="number" value={form.stock_quantity} onChange={handleChange} />

          <div className="mb-4">
            <label className="block mb-1 font-medium">Kategori</label>
            {!form.useNewCategory ? (
              <CategorySelect
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                categories={categories}
              />
            ) : (
              <TextInput
                label="Nama Kategori Baru"
                name="new_category_name"
                value={form.new_category_name}
                onChange={handleChange}
                required
              />
            )}
            <CheckboxInput
              label="Tambahkan kategori baru"
              name="useNewCategory"
              checked={form.useNewCategory}
              onChange={(e) => {
                const checked = e.target.checked;
                setForm((prev) => ({
                  ...prev,
                  useNewCategory: checked,
                  category_id: '',
                  new_category_name: '',
                }));
              }}
            />
          </div>

          <ImageUpload label="Unggah Gambar" file={form.image_file} onChange={handleImageChange} />
          {uploading && <p className="text-sm text-gray-500">Sedang mengunggah...</p>}

          <CheckboxInput label="Unggulan" name="featured" checked={form.featured} onChange={handleChange} />

          <SubmitButton text="Simpan" loading={uploading} />
        </form>
      </div>

        {showSummary && submittedData && (
        <>
            {(() => {
            const categoryName = categories.find(cat => cat.id === submittedData.category_id)?.name || 'Tidak diketahui';
            return (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                <div className="bg-white rounded shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-6 relative">
                    {/* Left: Image */}
                    <div className="flex-shrink-0 w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                    <img
                        src={submittedData.image_url}
                        alt={submittedData.name}
                        className="rounded object-cover w-full h-48 md:h-full"
                    />
                    </div>

                    {/* Right: Details */}
                    <div className="flex-grow flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Produk berhasil ditambahkan!</h2>
                        <ul className="text-gray-700 space-y-2">
                        <li><strong>Nama:</strong> {submittedData.name}</li>
                        <li><strong>Harga:</strong> Rp{submittedData.price}</li>
                        <li><strong>Stok:</strong> {submittedData.stock_quantity}</li>
                        <li><strong>Kategori:</strong> {categoryName}</li>
                        <li><strong>Unggulan:</strong> {submittedData.featured ? 'Ya' : 'Tidak'}</li>
                        </ul>
                    </div>
                    <div className="mt-6 text-right">
                        <button
                        onClick={() => setShowSummary(false)}
                        className="bg-[#C24B4B] text-white px-6 py-2 rounded hover:bg-[#a53c3c] transition-colors duration-200"
                        >
                        OK
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            );
            })()}
        </>
        )}

    </div>
  );
}
