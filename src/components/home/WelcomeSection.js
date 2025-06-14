'use client';
import { useRouter } from "next/navigation";
export default function WelcomeSection() {
  const router=useRouter();
  
  return (
    <section className="text-center mb-16 px-4 py-12 bg-gradient-to-br from-[#F5F1E9] to-[#E8DDD0] rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-4xl font-extrabold mb-4 text-[#6B4C3B] tracking-wide">
        Selamat datang di <span className="text-[#C24B4B]">OJOTEKI</span>!
      </h2>
      <p className="text-lg text-[#5A6A3F] mb-10">
        Belanja dengan percaya diri, <br /> tanpa ragu!
      </p>
      <div>
        <button
          onClick={()=>{router.push('/catalog')}}
          className="px-10 py-3 bg-[#C24B4B] hover:bg-[#A43D3D] text-white rounded-md font-semibold shadow-lg transition duration-300"
          aria-label="Lihat Katalog"
        >
          Lihat Katalog
        </button>
      </div>
    </section>
  );
}
