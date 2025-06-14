// app/api/admin/orders/[orderId]/route.js
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(req, { params }) {
  const { orderId } = await params;

  try {
    const body = await req.json();
    const { status } = body;

    // Only allow canceling if status === 'cancelled'
    if (status !== 'cancelled') {
      return NextResponse.json({ error: 'Only cancellation is allowed here' }, { status: 400 });
    }

    // Optional: verify current status is still 'pending'
    const { rows } = await pool.query('SELECT status FROM orders WHERE id = $1', [orderId]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const currentStatus = rows[0].status;
    if (currentStatus !== 'pending') {
      return NextResponse.json({ error: 'Only pending orders can be cancelled' }, { status: 400 });
    }

    // Update to cancelled
    await pool.query('UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2', [
      'cancelled',
      orderId,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
