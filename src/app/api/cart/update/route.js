// app/api/cart/update/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_id, quantity } = await req.json();
  const userRes = await query('SELECT id FROM users WHERE email = $1', [session.user.email]);
  const userId = userRes.rows[0].id;

  await query('UPDATE carts SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [quantity, userId, product_id]);

  return NextResponse.json({ success: true });
}
