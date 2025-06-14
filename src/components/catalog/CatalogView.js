import { query } from '@/lib/db';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { getSessionUser } from '@/lib/getSessionUser';
import CategoryFilter from '@/components/catalog/CategoryFilter'; // client component wrapper
import SortSelect from '@/components/catalog/SortSelect'; // new client component for sorting UI
import Link from 'next/link';

export default async function CatalogView({ searchParams }) {

  const { isAuthenticated, user } = await getSessionUser();
  const data= await searchParams;
  const q = data.q ?? '';
  const categoryFilter = data.category ?? 'all';
  const sort = data.sort ?? 'asc';

  let queryText = `
    SELECT id, name, price, image_url AS image
    FROM products 
    WHERE name ILIKE $1
  `;
  const queryParams = [`%${q}%`];

  if (categoryFilter !== 'all') {
    queryText += ` AND category_id = $2`;
    queryParams.push(categoryFilter);
  }

  if (sort === 'desc') {
    queryText += ` ORDER BY price DESC, created_at DESC LIMIT 50`;
  } else {
    queryText += ` ORDER BY price ASC, created_at DESC LIMIT 50`;
  }

  const { rows: products } = await query(queryText, queryParams);

  const { rows: categories } = await query(`
    SELECT id, name FROM categories ORDER BY name
  `);

  return (
    <div className="flex min-h-screen flex-col">
      <Header isAuthenticated={isAuthenticated} user={user} />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 min-w-[320px] w-full">
        <div className="w-full min-w-[320px] flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-semibold mb-4 md:mb-0 text-left">
            {q ? `Pencarian Untuk "${q}"` : 'Semua Produk'}
          </h1>

          {/* Sorting UI */}
          <SortSelect currentSort={sort} />
        </div>

        <div className="mb-6">
          {/* Client component handles interactivity and preserves q, category, sort in URL */}
          <CategoryFilter categories={categories} />
        </div>

        {products.length === 0 ? (
          <div className="w-full min-h-[300px] flex items-center justify-center">
            <p className="text-center text-gray-500 text-lg">Tidak ditemukan</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full min-w-[320px]">
            {products.map((product) => (
                <Link key={product.id} href={`/catalog/product/${product.id}`} passHref>
                    <li      
                        className="
                        cursor-pointer
                        rounded-lg
                        shadow-md
                        border-2 border-[#6B4C3B]/30
                        overflow-hidden
                        hover:border-[#C24B4B]
                        hover:shadow-inner
                        hover:shadow-[#C24B4B]
                        transition
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#C24B4B]
                        focus-visible:ring-offset-2
                        flex
                        flex-col
                        "
                    >
                        {/* Aspect ratio box for consistent image size */}
                        <div className="w-full aspect-[1/1] object-cover rounded-t-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        </div>

                        {/* Product info */}
                        <div className="p-4 text-center bg-[#F5F1E9] flex-grow flex flex-col justify-center">
                        <h2 className="font-semibold text-lg text-[#6B4C3B] truncate">{product.name}</h2>
                        <p className="text-[#C24B4B] font-bold mt-2">Rp {product.price.toLocaleString()}</p>
                        </div>
                    </li>
                </Link>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
}
