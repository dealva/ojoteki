'use client';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#F5F1E9]">
      {/* Left branding panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 px-12 bg-white">
        <h1 className="text-5xl font-extrabold text-[#6B4C3B] mb-6 select-none">OJOTEKI</h1>
        <p className="text-xl text-[#6B4C3B] max-w-sm text-center leading-relaxed">
          Selamat datang di OJOTEKI! <br />
          Belanja dengan percaya diri, tanpa ragu!
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        {children}
      </div>
    </div>
  );
}
