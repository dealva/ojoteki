'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import AdminCard from './layout/AdminCard';
import SearchFilterBar from '../common/form/SearchFilterBar';
import ProductTable from '../common/table/ProductTable';
import UserTable from '../common/table/UserTable';
import OrderTable from '../common/table/OrderTable';
import Pagination from '../common/table/Pagination';
import TransactionTable from '../common/table/TransactionTable';
import useDashboardView from '@/hooks/admin/useDashboardView';

function DashboardView({ admin, initialItems, totalPages, initialPage, chatNotifications }) {
  const router = useRouter();

  const {
    dataType,
    setDataType,
    items,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages: total,
    loading,
    featuredFilter,
    setFeaturedFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    fetchItems,
    handleDelete,
    handleCancel,
    handleShip
  } = useDashboardView(initialItems, totalPages, initialPage);

  const handleSearchSubmit = () => {
    fetchItems(searchTerm, 1, featuredFilter, categoryFilter);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white p-6">
      <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
        <AdminCard admin={admin} />
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          featuredFilter={dataType === 'products' ? featuredFilter : null}
          onFeaturedChange={(val) => {
            setFeaturedFilter(val);
            setPage(1);
          }}
          categoryFilter={dataType === 'products' ? categoryFilter : null}
          onCategoryChange={(val) => {
            setCategoryFilter(val);
            setPage(1);
          }}
          categories={dataType === 'products' ? categories : []}
          onAddClick={() => dataType === 'products' && router.push('/admin/products/add')}
          chatNotifications={chatNotifications}
          onChatClick={() => router.push('/admin/chat')}
          dataType={dataType}
          onDataTypeChange={(val) => {
            setDataType(val);
            setPage(1);
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1">
        {dataType === 'products' && (
          <ProductTable
            items={items}
            loading={loading}
            onEdit={(id) => router.push(`/admin/products/edit/${id}`)}
            onDelete={handleDelete}
          />
        )}

        {dataType === 'users' && (
          <UserTable items={items} loading={loading} onDelete={handleDelete} />
        )}

        {dataType === 'orders' && (
          <OrderTable
            items={items}
            loading={loading}
            onCancel={handleCancel}
            onShip={handleShip}
          />
        )}

        {dataType === 'transactions' && (
          <TransactionTable
            items={items}
            loading={loading}
          />
        )}

        <Pagination
          page={page}
          totalPages={total}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(total, p + 1))}
        />
      </div>
    </div>
  );
}

export default DashboardView;
