import React from 'react';
import {
  DataSelect,
  SearchInput,
  FeaturedSelect,
  CategorySelect,
  AddItemButton,
  ChatButton,
} from './search/SearchFilterBarParts';


export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  featuredFilter,
  onFeaturedChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onAddClick,
  chatNotifications,
  onChatClick,
  dataType,
  onDataTypeChange,
}) {
  return (
    <div className="flex items-center gap-4">
       {dataType === 'products' && <>
          <FeaturedSelect value={featuredFilter} onChange={onFeaturedChange} />
          <CategorySelect
            value={categoryFilter}
            onChange={onCategoryChange}
            categories={categories}
          />
       </>
      
       }
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        onSubmit={onSearchSubmit}
      />
      <DataSelect
        dataType={dataType}
        onDataTypeChange={onDataTypeChange}
      />
      <AddItemButton onClick={onAddClick} />
      
      <ChatButton notifications={chatNotifications} onClick={onChatClick} />
    </div>
  );
}
