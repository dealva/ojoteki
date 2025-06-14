// app/api/cart/delete/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { product_id } = await req.json();
  const userRes = await query('SELECT id FROM users WHERE email = $1', [session.user.email]);
  const userId = userRes.rows[0].id;

  await query('DELETE FROM carts WHERE user_id = $1 AND product_id = $2', [userId, product_id]);

  const updatedCart = await query(
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image_url
       FROM carts c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    return NextResponse.json({ success: true, updatedCart: updatedCart.rows });
}
