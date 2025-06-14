// /app/api/chat/send/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { user_id, contents, conversation_id } = await req.json();

  await query(
    'INSERT INTO messages (user_id, conversation_id, contents) VALUES ($1, $2, $3)',
    [user_id, conversation_id, contents]
  );

  return NextResponse.json({ success: true });
}
