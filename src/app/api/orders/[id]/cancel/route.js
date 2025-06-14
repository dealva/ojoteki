import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/getSessionUser';
import { query } from '@/lib/db';

export async function PATCH(req, { params }) {
  const { user } = await getSessionUser();
  const data = await params;
  const orderId = data.id;
  

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Check if order belongs to the user and is cancelable
    const orderRes = await query(
      `SELECT id, user_id, status FROM orders WHERE id = $1`,
      [orderId]
    );
    console.log('Order response:', orderRes);
    if (orderRes.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderRes.rows[0];

    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (['paid', 'shipped', 'cancelled'].includes(order.status)) {
      return NextResponse.json({ error: `Cannot cancel a ${order.status} order` }, { status: 400 });
    }

    // Cancel the order and transaction
    await query('BEGIN');

    await query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [orderId]
    );

    await query(
      `UPDATE transactions SET status = 'cancelled', updated_at = NOW() WHERE order_id = $1`,
      [orderId]
    );

    await query('COMMIT');

    return NextResponse.json({ success: true });
  } catch (err) {
    await query('ROLLBACK');
    console.error('Cancel order failed:', err);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
