import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { public_id } = await params;

  const user = await query(`SELECT id FROM users WHERE public_id = $1`, [public_id]);
  const userId = user.rows[0]?.id;
  if (!userId) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const conv = await query(
    `SELECT c.id FROM conversations c
     JOIN conversation_users cu ON c.id = cu.conversation_id
     WHERE cu.user_id = $1`, [userId]
  );

  const conversationId = conv.rows[0]?.id;
  if (!conversationId) return NextResponse.json({ messages: [] });

  // Mark all messages from user as read
  await query(
    `UPDATE messages SET is_read = true
     WHERE conversation_id = $1 AND user_id = $2 AND is_read = false`,
    [conversationId, userId]
  );

  const messages = await query(
    `SELECT * FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );

  return NextResponse.json({ conversation_id: conversationId, messages: messages.rows });
}
