import UserOrders from '@/components/orders/UserOrders';
import MainLayout from '@/components/layout/MainLayout';
import { getSessionUser } from '@/lib/getSessionUser';
export const metadata = {
  title: 'Your Orders',
};

export default async function OrdersPage() {
const { isAuthenticated, user } = await getSessionUser();
  if (!isAuthenticated){
    
  }
  return (
    <MainLayout isAuthenticated={isAuthenticated} user={user}>
      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>
        <UserOrders />
      </main>
    </MainLayout>
  );
}
