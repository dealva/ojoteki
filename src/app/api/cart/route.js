// app/api/cart/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userEmail = session.user.email;
  const userRes = await query('SELECT id FROM users WHERE email = $1', [userEmail]);
  if (!userRes.rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const userId = userRes.rows[0].id;

  const cartRes = await query(`
    SELECT
      c.product_id,
      c.quantity,
      p.name,
      p.image_url,
      p.price
    FROM carts c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
  `, [userId]);

  return NextResponse.json(cartRes.rows);
}
