import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await query(`
    SELECT u.public_id, u.name, u.email,
      COUNT(m.*) FILTER (
        WHERE m.is_read = false AND m.user_id = u.id
      ) AS unread_count
    FROM users u
    JOIN conversation_users cu ON cu.user_id = u.id
    JOIN conversations c ON c.id = cu.conversation_id
    LEFT JOIN messages m ON m.conversation_id = c.id
    WHERE u.role = 'customer'
    GROUP BY u.id
    ORDER BY MAX(m.created_at) DESC NULLS LAST
  `);
    // console.log('Conversations:', result.rows.data);
  return NextResponse.json(result.rows);
}
