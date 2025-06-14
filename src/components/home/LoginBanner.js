'use client';
import {  signIn } from 'next-auth/react';
export default function LoginBanner({ onLogin }) {
  return (
    <section className="bg-gradient-to-r from-[#E9DDCC] to-[#F5F1E9] rounded-lg p-6 text-center text-[#6B4C3B] mb-16 shadow-md">
      <p className="mb-4 font-semibold text-lg">
        Masuk untuk pengalaman belanja yang lebih mudah dan penawaran eksklusif!
      </p>
      <div className="space-x-4">
        <button
          onClick={() => signIn()}
          className="px-6 py-2 bg-[#C24B4B] text-white rounded-md font-semibold hover:bg-[#9F3C3C] transition"
        >
          Masuk
        </button>
      </div>
    </section>
  );
}
