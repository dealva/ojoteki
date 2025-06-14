// @/components/chat/ChatWindow.js
'use client'

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/websocket/client';

export default function ChatWindow({ user }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const conversationIdRef = useRef(null);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Fetch past messages first
    fetch(`/api/chat/${user.public_id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages);
        const convId = data.conversation_id;
        conversationIdRef.current = convId;

        // Join room using conversation_id 
        socket.emit('join_conversation_room', { conversation_id: convId });
      });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [socket, user]);

  const sendMessage = async () => {
    if (!conversationIdRef.current) return;
    const msg = {
      user_id: user.id,
      contents: input,
      conversation_id: conversationIdRef.current,
    };

    socket.emit('send_message', msg);
    // setMessages(prev => [...prev, { ...msg, self: true }]);
    setInput('');

    // Persist to DB
    await fetch('/api/chat/send', {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F1E9] text-[#6B4C3B]">
      {/* Chat Messages */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[75%] shadow-sm ${
              m.user_id === user.id
                ? 'bg-[#C24B4B] text-white self-end'
                : 'bg-white text-[#6B4C3B] self-start'
            }`}
          >
            {m.contents}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex p-2 border-t border-[#C24B4B] bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-[#C24B4B] rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C24B4B]"
        />
        <button
          onClick={sendMessage}
          disabled={!conversationIdRef.current || input.trim() === ''}
          className="bg-[#C24B4B] text-white px-4 py-2 rounded-r-md hover:bg-[#a53636] transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );

}
