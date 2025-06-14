// @/components/layout/MainLayout.js
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ChatWidget from '@/components/chat/ChatWidget';

export default function MainLayout({ children, isAuthenticated, user }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAuthenticated={isAuthenticated} user={user} />
        {children}
      <Footer />
      {isAuthenticated && user?.role === 'customer' && (
        <ChatWidget user={user} />
      )}
    </div>
  );
}
