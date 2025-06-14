'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/websocket/client';

export default function ChatWindow({ admin, recipient, messages, setMessages, conversationId }) {
  const socket = useSocket();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // Join socket room and handle incoming messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('join_conversation_room', { conversation_id: conversationId });

    const handleIncomingMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };

    socket.on('message', handleIncomingMessage);

    return () => {
      socket.off('message', handleIncomingMessage);
    };
  }, [socket, conversationId, setMessages]);

  const sendMessage = async () => {
    if (!conversationId || !input.trim()) return;

    const msg = {
      user_id: null, // from admin
      contents: input.trim(),
      conversation_id: conversationId,
      from_admin: true,
    };

    socket.emit('send_message', msg);
    setInput('');

    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
  };

  if (!recipient?.public_id || !socket || !conversationId) {
    return <div className="text-center text-gray-500 p-4">Loading chat...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F1E9] text-[#6B4C3B]">
      {/* Message List */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2"
      >
        {Array.isArray(messages) && messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[75%] shadow-sm ${
              m.user_id
                ? 'bg-white text-[#6B4C3B] self-start'
                : 'bg-[#C24B4B] text-white self-end'
            }`}
          >
            {m.contents}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex p-2 border-t border-[#C24B4B] bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-[#C24B4B] rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C24B4B]"
        />
        <button
          onClick={sendMessage}
          className="bg-[#C24B4B] text-white px-4 py-2 rounded-r-md hover:bg-[#a53636] transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
