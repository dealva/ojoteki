// @/hooks/admin/useAdminChat.js
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/websocket/client';

export function useAdminChat() {
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  // Fetch conversation list
  useEffect(() => {
    const loadConversations = async () => {
      const res = await fetch('/api/admin/chat/conversations');
      const data = await res.json();
      setConversations(data);
    };
    loadConversations();
  }, [setConversations]);

  // Fetch messages on user select
  useEffect(() => {
    if (!selectedUser) return;
    fetch(`/api/admin/chat/messages/${selectedUser.public_id}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages);
        setConversationId(data.conversation_id);
        socket?.emit('join_conversation_room', { conversation_id: data.conversation_id });
      });
  }, [selectedUser,socket]);

  // Realtime updates
  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => {
      if (msg.user_id === selectedUser?.id) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('message', handleMessage);
    return () => socket.off('message', handleMessage);
  }, [socket, selectedUser]);

  return {
    socket,
    conversations,
    selectedUser,
    setSelectedUser,
    messages,
    setMessages,
    conversationId,
  };
}
