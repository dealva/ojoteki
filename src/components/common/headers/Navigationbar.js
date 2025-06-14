'use client';

import { usePathname, useRouter } from 'next/navigation';

const navItems = ['Beranda', 'Katalog', 'Tentang', 'Kontak'];
const navRoutes = ['/', '/catalog', '/', '/'];

export default function Navigationbar() {
  const pathname = usePathname();
  const router = useRouter();


  const activeIndex = navRoutes.findIndex(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  return (
    <nav aria-label="Primary navigation" className="flex h-full">
      {navItems.map((label, i) => {
        const route = navRoutes[i];
        const isActive = i === activeIndex;

        return (
          <button
            key={label}
            disabled={isActive}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => !isActive && router.push(route)}
            className={`skew-x-[-12deg] px-6 font-medium transition-transform duration-150 flex items-center justify-center
              ${
                isActive
                  ? 'cursor-default bg-[#F5D7D7] text-[#C24B4B] border-b-2 border-[#C24B4B]'
                  : 'text-[#6B4C3B] hover:bg-[#E9DDCC] focus:outline-none  hover:translate-x-[-1px] hover:translate-y-[5px] hover:shadow-[0_-5px_0_0_#C24B4B]'
              }`}
          >
            <span className="skew-x-[12deg]">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
