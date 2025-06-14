import MainLayout from '@/components/layout/MainLayout';

import WelcomeSection from '@/components/home/WelcomeSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import LoginBanner from '@/components/home/LoginBanner';

import { getSessionUser } from '@/lib/getSessionUser';
import { query } from '@/lib/db'; 

export default async function HomeView() {
  const { isAuthenticated, user } = await getSessionUser();


  const { rows: products } = await query(
    `
    SELECT id, name, price, image_url AS image
    FROM products
    WHERE featured = true
    ORDER BY created_at DESC
    LIMIT 16
    `
  );

  return (
    <MainLayout isAuthenticated={isAuthenticated} user={user}>
      <main className="flex-grow max-w-6xl mx-auto px-6 py-12">
        <WelcomeSection />
        <FeaturedProducts products={products} />
        {!isAuthenticated && <LoginBanner />}
      </main>
    </MainLayout>
  );
}
