'use client';
import { useState, useEffect } from 'react';

export default function ImageUpload({ label, file, onChange, existingImageUrl }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url); // Clean up
    } else if (existingImageUrl) {
      setPreviewUrl(existingImageUrl); // Fallback to DB image
    } else {
      setPreviewUrl('');
    }
  }, [file, existingImageUrl]);

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    onChange(selectedFile);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">{label}:</label>
      <label
        htmlFor="fileInput"
        className="block w-full px-4 py-3 text-gray-700 bg-gray-100 rounded border border-gray-300 cursor-pointer hover:bg-gray-200 transition"
      >
        Unggah Gambar
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="mt-2 max-w-xs border rounded"
        />
      )}
    </div>
  );
}
