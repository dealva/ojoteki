import * as Yup from 'yup';

// Validator untuk pendaftaran pengguna
export const registerValidator = Yup.object().shape({
  name: Yup.string()
    .required('Nama wajib diisi')
    .min(3, 'Nama minimal terdiri dari 3 karakter'),
  email: Yup.string()
    .email('Alamat email tidak valid')
    .required('Email wajib diisi'),
  password: Yup.string()
    .required('Kata sandi wajib diisi')
    .min(6, 'Kata sandi minimal terdiri dari 6 karakter'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Kata sandi tidak cocok')
    .required('Konfirmasi kata sandi wajib diisi'),
});

// Validator untuk login pengguna
export const loginValidator = Yup.object().shape({
  email: Yup.string()
    .email('Alamat email tidak valid')
    .required('Email wajib diisi'),
  password: Yup.string()
    .required('Kata sandi wajib diisi'),
});


export const productValidator = Yup.object().shape({
  name: Yup.string()
    .required('Nama produk wajib diisi')
    .min(3, 'Nama produk minimal 3 karakter'),

  description: Yup.string()
    .required('Deskripsi produk wajib diisi'),

  price: Yup.number()
    .typeError('Harga harus berupa angka')
    .required('Harga wajib diisi')
    .min(0, 'Harga tidak boleh negatif'),

  stock_quantity: Yup.number()
    .typeError('Stok harus berupa angka')
    .required('Stok wajib diisi')
    .min(0, 'Stok tidak boleh negatif'),

  image_file: Yup.mixed()
  .required('Gambar produk wajib diunggah'),

  featured: Yup.boolean(), // optional

  useNewCategory: Yup.boolean(),

  category_id: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .when('useNewCategory', {
      is: false,
      then: (schema) =>
        schema.required('Kategori wajib dipilih').typeError('Kategori tidak valid'),
      otherwise: (schema) => schema.notRequired(),
    }),


  new_category_name: Yup.string()
    .when('useNewCategory', {
      is: true,
      then: (schema) =>
        schema.required('Nama kategori baru wajib diisi').min(3, 'Minimal 3 karakter'),
      otherwise: (schema) => schema.notRequired(),
    }),
});
export const updateProductValidator = Yup.object().shape({
  name: Yup.string()
    .required('Nama produk wajib diisi')
    .min(3, 'Nama produk minimal 3 karakter'),

  description: Yup.string()
    .required('Deskripsi produk wajib diisi'),

  price: Yup.number()
    .typeError('Harga harus berupa angka')
    .required('Harga wajib diisi')
    .min(0, 'Harga tidak boleh negatif'),

  stock_quantity: Yup.number()
    .typeError('Stok harus berupa angka')
    .required('Stok wajib diisi')
    .min(0, 'Stok tidak boleh negatif'),

  image_file: Yup.mixed().nullable().notRequired(),

  featured: Yup.boolean(), // optional

  useNewCategory: Yup.boolean(),

  category_id: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .when('useNewCategory', {
      is: false,
      then: (schema) =>
        schema.required('Kategori wajib dipilih').typeError('Kategori tidak valid'),
      otherwise: (schema) => schema.notRequired(),
    }),


  new_category_name: Yup.string()
    .when('useNewCategory', {
      is: true,
      then: (schema) =>
        schema.required('Nama kategori baru wajib diisi').min(3, 'Minimal 3 karakter'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const completeProfileSchema = Yup.object({
  name: Yup.string().required('Nama wajib diisi'),
  phone: Yup
    .string()
    .nullable()
    .matches(/^(\+62|08)\d{8,13}$/, 'Nomor HP tidak valid')
    .notRequired(),
  address: Yup.string().nullable().notRequired(),

});