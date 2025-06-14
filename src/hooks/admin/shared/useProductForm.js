import { useState } from 'react';

export default function useProductForm({ validator }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    new_category_name: '',
    useNewCategory: false,
    featured: false,
    image_file: null,
    image_url: '',
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({
      ...prev,
      image_file: file,
      image_url: '',
    }));
  };

  const resetCategoryFields = () => {
    setForm((prev) => ({
      ...prev,
      useNewCategory: false,
      category_id: '',
      new_category_name: '',
    }));
  };

  const validateForm = async () => {
    if (!validator) throw new Error('No validator provided');
    await validator.validate(form, { abortEarly: false });
  };

  const uploadImageFile = async () => {
    if (!form.image_file) return form.image_url;

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', form.image_file);

      const uploadRes = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: uploadData,
      });

      if (!uploadRes.ok) throw new Error('Image upload failed');

      const uploadJson = await uploadRes.json();
      return uploadJson.url;
    } finally {
      setUploading(false);
    }
  };

  return {
    form,
    setForm,
    uploading,
    handleChange,
    handleImageChange,
    resetCategoryFields,
    validateForm,
    uploadImageFile,
  };
}
