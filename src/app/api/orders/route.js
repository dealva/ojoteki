import { query } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;

    // Get user ID
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [userEmail]
    );

    if (userResult.rowCount === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Get query params
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status'); // optional filter
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Base count query
    let countQuery = `SELECT COUNT(*) FROM orders WHERE user_id = $1`;
    let countValues = [userId];

    if (status) {
      countQuery += ` AND status = $2`;
      countValues.push(status);
    }

    const countResult = await query(countQuery, countValues);
    const totalOrders = parseInt(countResult.rows[0].count, 10);

    // Base orders query
    let ordersQuery = `
      SELECT 
        o.id AS order_id,
        o.total_price,
        o.status AS order_status,
        o.created_at,
        t.status AS transaction_status,
        t.reference AS transaction_reference,
        s.status AS shipment_status
      FROM orders o
      LEFT JOIN transactions t ON o.id = t.order_id
      LEFT JOIN shipments s ON o.id = s.order_id
      WHERE o.user_id = $1
    `;
    const values = [userId];

    if (status) {
      ordersQuery += ` AND o.status = $2`;
      values.push(status);
    }

    ordersQuery += ` ORDER BY o.created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const ordersResult = await query(ordersQuery, values);
    const orders = ordersResult.rows;

    // Get items per order (same as before)
    for (const order of orders) {
      const itemsResult = await query(
        `
        SELECT 
          oi.product_id,
          p.name AS product_name,
          p.image_url,
          oi.quantity,
          oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
        `,
        [order.order_id]
      );

      order.items = itemsResult.rows;
    }

    return Response.json({
      orders,
      pagination: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (err) {
    console.error('[API /orders] Error:', err);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
