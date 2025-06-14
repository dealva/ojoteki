// @/app/admin/chat/page.jsx
'use client';

import { useAdminChat } from '@/hooks/admin/useAdminChat';
import ChatWindow from '@/components/admin/ChatWindow';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/basic/Button';

export default function AdminChatPage() {
  const router = useRouter();
  const {
    conversations,
    selectedUser,
    setSelectedUser,
    messages,
    setMessages,
    conversationId
  } = useAdminChat();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 bg-white">
        <h1 className="text-xl font-semibold">Admin Chat</h1>
        <Button onClick={() => router.push('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-gray-300 overflow-y-auto">
          <h2 className="text-lg font-bold p-4 border-b">Conversations</h2>
          {conversations.map((user) => (
            <div
              key={user.public_id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? 'bg-gray-200' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {user.unread_count > 0 && (
                  <span className="bg-red-600 text-white text-xs rounded-full px-2">
                    {user.unread_count}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-2/3 flex flex-col">
          {selectedUser ? (
            <ChatWindow
              admin
              recipient={selectedUser}
              messages={messages}
              setMessages={setMessages}
              conversationId={conversationId}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
