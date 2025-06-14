// app/catalog/product/[id]/page.js
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import MainLayout from '@/components/layout/MainLayout';
import { getSessionUser } from '@/lib/getSessionUser';
import ProductDetailView from '@/components/product/ProductDetailView';


export default async function ProductDetailPage({ params }) {
    const data=await params;
  const id = parseInt(data.id);
  const { isAuthenticated, user } = await getSessionUser();
  const { rows } = await query(
    `SELECT p.*, c.name as category_name FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.id = $1`,
    [id]
  );

  if (!rows || rows.length === 0) return notFound();
  const product = rows[0];

  const needsProfileCompletion =
    !user?.phone || !user?.address;

  return (
    <MainLayout isAuthenticated={isAuthenticated} user={user}>
      <ProductDetailView
        product={product}
        user={user}
        needsProfileCompletion={needsProfileCompletion}
      />
    </MainLayout>
  );
}
