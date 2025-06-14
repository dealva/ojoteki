// /app/api/chat/[public_id]/route.js
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { public_id  } = await params;
    // console.log('Fetching chat for public_id:', public_id);

    const user = await query('SELECT id FROM users WHERE public_id = $1', [public_id]);
    const userId = user.rows[0]?.id;

    let conv = await query(
        `SELECT c.id FROM conversations c
        JOIN conversation_users cu ON c.id = cu.conversation_id
        WHERE cu.user_id = $1`,
        [userId]
    );
    // console.log('route public_id, conv : ',conv);
    if (conv.rows.length === 0) {
        const convRes = await query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
        const convId = convRes.rows[0].id;

        await query(
        `INSERT INTO conversation_users (user_id, conversation_id) VALUES ($1, $2)`,
        [userId, convId]
        );

        conv = { rows: [{ id: convId }] };
    }

    const messages = await query(
        `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
        [conv.rows[0].id]
    );

    return NextResponse.json({
        conversation_id: conv.rows[0].id,
        messages: messages.rows,
    });
}
