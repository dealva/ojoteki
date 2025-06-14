import React from 'react';

export default function AdminCard({ admin }) {
  return (
    <div className="flex items-center gap-3 bg-[#F5D7D7] rounded-md p-3 border border-[#C24B4B] shadow-sm max-w-xs">
      <img
        src={admin?.profilePhoto || '/assets/images/avatar/defaultAvatar.png'}
        alt="Admin Avatar"
        className="w-12 h-12 rounded-full border-2 border-[#C24B4B]"
      />
      <div className="text-[#6B4C3B]">
        <p className="font-semibold truncate">{admin?.name || 'Admin'}</p>
        <p className="text-sm">{admin?.role || 'Admin'}</p>
      </div>
    </div>
  );
}
