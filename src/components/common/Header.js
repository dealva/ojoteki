'use client';

import { useState } from 'react';
import Logo from '@/components/common/headers/Logo';
import SearchBar from '@/components/common/headers/SearchBar';
import Navigationbar from '@/components/common/headers/Navigationbar';
import UserAvatar from '@/components/common/headers/UserAvatar';
import UserDropdown from '@/components/common/headers/UserDropdown';
import { signOut, signIn } from 'next-auth/react';

export default function Header({ isAuthenticated, user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const toggleDropdown = () => setDropdownOpen(prev => !prev);



  return (
    <header className="bg-[#F5F1E9] border-b border-[#6B4C3B]/30 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Logo />
          <SearchBar />
        </div>

        <div className="flex items-center h-full relative">
          <Navigationbar />

          {isAuthenticated ? (
            <div className="ml-4">
              <UserAvatar src={user?.profile_photo} onClick={toggleDropdown} />
              {dropdownOpen && (
                <div className="absolute right-0  ">
                  <UserDropdown profilePhoto={user?.profile_photo} user={user} onLogout={() => {
                    setDropdownOpen(false);
                    signOut();
                  }} />
                </div>
              )}
              
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="skew-x-[-12deg] px-6 h-full flex items-center justify-center font-medium bg-[#C24B4B] text-white hover:bg-[#a53c3c] focus:ring-2 focus:ring-[#C24B4B]"
            >
              <span className="skew-x-[12deg]">Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
