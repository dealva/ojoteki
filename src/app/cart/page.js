// app/cart/page.js


import CartView from '@/components/cart/CartView';
import { getSessionUser } from '@/lib/getSessionUser';
import MainLayout from '@/components/layout/MainLayout';
export default async function CartPage() {
  const { isAuthenticated, user } = await getSessionUser();
  return(
    <MainLayout isAuthenticated={isAuthenticated} user={user}>
        <CartView />
    </MainLayout>
  ) 
}
