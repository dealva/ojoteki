import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/getSessionUser';
import { query } from '@/lib/db'; // PostgreSQL query helper

export async function POST(req) {
  const { isAuthenticated, user } = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  if (!productId || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  try {
    // Check if product already in cart
    const existing = await query(
      `SELECT id, quantity FROM carts WHERE user_id = $1 AND product_id = $2`,
      [user.id, productId]
    );

    if (existing.rows.length > 0) {
      const existingCart = existing.rows[0];
      await query(
        `UPDATE carts SET quantity = quantity + $1, updated_at = NOW() WHERE id = $2`,
        [quantity, existingCart.id]
      );
    } else {
      await query(
        `INSERT INTO carts (user_id, product_id, quantity) VALUES ($1, $2, $3)`,
        [user.id, productId, quantity]
      );
    }
 // Fetch updated cart for user
    const updatedCart = await query(
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image_url
       FROM carts c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    return NextResponse.json({ success: true, updatedCart: updatedCart.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
