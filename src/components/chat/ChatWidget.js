// @/components/chat/ChatWidget.js
'use client'

import { useEffect, useRef, useState } from 'react';
import ChatWindow from './ChatWindow';
import { MessageCircle } from 'lucide-react'; 

export default function ChatWidget({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-[#6B4C3B] hover:bg-[#F5F1E9] text-white hover:text-black p-3 rounded-full shadow-lg"
        >
          <MessageCircle />
        </button>
      </div>
      {open && (
        <div className="fixed bottom-4 right-20 w-80 h-96 bg-white shadow-lg border border-[#C24B4B] rounded-xl flex flex-col z-50 overflow-hidden">
          <ChatWindow user={user} />
        </div>
      )}
    </>
  );
}
