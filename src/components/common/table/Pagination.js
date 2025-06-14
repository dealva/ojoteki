import React from 'react';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <footer className="mt-4 max-w-7xl mx-auto w-full flex justify-center gap-4 py-4 border-t border-gray-300 bg-white sticky bottom-0">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="px-3 py-1 rounded border border-[#C24B4B] text-[#C24B4B] disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-3 py-1 rounded border border-[#C24B4B] text-[#6B4C3B]">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border border-[#C24B4B] text-[#C24B4B] disabled:opacity-50"
      >
        Next
      </button>
    </footer>
  );
}
