'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import TextInput from '@/components/common/form/TextInput';
import ImageUpload from '@/components/common/form/ImageUpload';
import CheckboxInput from '@/components/common/form/CheckboxInput';
import CategorySelect from '@/components/common/form/CategorySelect';
import useProductForm from '@/hooks/admin/shared/useProductForm';
import SubmitButton from '@/components/common/form/SubmitButton';
import BackToDashboardButton from '@/components/common/BackToDashboardButton';
import { updateProductValidator } from '@/lib/validators';

export default function EditProductView({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [initialProduct, setInitialProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const {
    form,
    setForm,
    uploading,
    handleChange,
    handleImageChange,
    validateForm,
    uploadImageFile,
  } = useProductForm({ validator: updateProductValidator });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch('/api/admin/categories'),
        ]);
       
        if (!productRes.ok || !categoriesRes.ok) throw new Error('Failed to load data');

        const product = await productRes.json();
        const categories = await categoriesRes.json();

        setInitialProduct(product);
        setCategories(categories);

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          stock_quantity: product.stock_quantity?.toString() || '',
          image_file: null,
          featured: product.featured || false,
          useNewCategory: false,
          category_id: product.category_id?.toString() || '',
          new_category_name: '',
          image_url: product.image_url || '',
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data produk atau kategori.');
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, setForm]);

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
        if (!resCategory.ok) throw new Error('Gagal membuat kategori baru');
        const newCategory = await resCategory.json();
        categoryId = newCategory.id;
      }

      let imageUrl = form.image_url;
      let oldImageUrl=imageUrl;
      if (form.image_file) {
        imageUrl = await uploadImageFile();
        if (!imageUrl) {
          throw new Error('Gagal mengunggah gambar');
        }
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseInt(form.price, 10),
          stock_quantity: parseInt(form.stock_quantity, 10),
          category_id: parseInt(categoryId, 10),
          featured: form.featured,
          image_url: imageUrl,
          old_image_url: oldImageUrl,
        }),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setSubmittedData({ ...updatedProduct, image_url: imageUrl });
        setShowSummary(true);
      } else {
        console.error('Failed to update product');
        alert('Gagal mengupdate produk.');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const messages = err.inner.map((e) => e.message);
        alert(messages.join('\n'));
      } else {
        alert(err.message || 'Terjadi kesalahan saat menyimpan.');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Memuat data produk...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative max-w-3xl w-full p-6 bg-white rounded shadow">
        <div className="absolute top-4 right-4">
          <BackToDashboardButton />
        </div>
        <h1 className="text-xl font-bold mb-4">Edit Produk</h1>
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

          <ImageUpload
            label="Unggah Gambar"
            file={form.image_file}
            onChange={handleImageChange}
            existingImageUrl={form.image_url}
          />
          {uploading && <p className="text-sm text-gray-500">Sedang mengunggah...</p>}

          <CheckboxInput label="Unggulan" name="featured" checked={form.featured} onChange={handleChange} />

          <SubmitButton text="Simpan" loading={uploading} />
        </form>
      </div>

      {showSummary && submittedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded shadow-lg max-w-4xl w-full flex flex-col md:flex-row p-6 relative">
            <div className="flex-shrink-0 w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <img
                src={submittedData.image_url}
                alt={submittedData.name}
                className="rounded object-cover w-full h-48 md:h-full"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4">Produk berhasil diupdate!</h2>
                <ul className="text-gray-700 space-y-2">
                  <li><strong>Nama:</strong> {submittedData.name}</li>
                  <li><strong>Harga:</strong> Rp{submittedData.price}</li>
                  <li><strong>Stok:</strong> {submittedData.stock_quantity}</li>
                  <li>
                    <strong>Kategori:</strong>{' '}
                    {categories.find((cat) => cat.id === submittedData.category_id)?.name || 'Tidak diketahui'}
                  </li>
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
      )}
    </div>
  );
}
