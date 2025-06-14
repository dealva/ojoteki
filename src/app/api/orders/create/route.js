import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/getSessionUser';
import { pool, query } from '@/lib/db'; 
import { snap } from '@/lib/midtrans';

export async function POST(req) {
  const { user } = await getSessionUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { direct = false, productId = null, quantity = null } = body;

  // Use helper for simple queries outside transaction
  let orderItems = [];

  if (direct) {
    if (!productId || quantity < 1)
      return NextResponse.json({ error: 'Invalid product or quantity' }, { status: 400 });

    const productRes = await query('SELECT id, name, price FROM products WHERE id = $1', [productId]);
    if (productRes.rows.length === 0)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const product = productRes.rows[0];
    orderItems = [{ product_id: product.id, product_name: product.name, price: product.price, quantity }];
  } else {
    const cartRes = await query(
      `SELECT c.product_id, c.quantity, p.price, p.name as product_name
       FROM carts c 
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    orderItems = cartRes.rows;
    if (orderItems.length === 0)
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert order
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id`,
      [user.id, totalPrice, 'pending']
    );
    const orderId = orderRes.rows[0].id;

    // Insert order items
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Prepare Midtrans transaction parameters
    const notificationUrl = `${process.env.BASE_URL}/api/orders/notify`;
    const parameter = {
      transaction_details: { order_id: `order-${orderId}`, gross_amount: totalPrice },
      item_details: orderItems.map(item => ({
        id: item.product_id.toString(),
        name: item.product_name.length > 50 ? item.product_name.slice(0, 47) + '...' : item.product_name,
        price: item.price,
        quantity: item.quantity,
      })),
      customer_details: { first_name: user.name, email: user.email },
      credit_card: { secure: true },
      notification_url: notificationUrl,
    };

    // Create Midtrans payment transaction (snap token)
    const snapResponse = await snap.createTransaction(parameter);
    const snapToken = snapResponse.token;

    // Insert transaction record with snap token and status 'pending'
    await client.query(
      `INSERT INTO transactions (order_id, snap_token, status, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [orderId, snapToken, 'pending']
    );

    await client.query('COMMIT');

    // Clear cart if not direct
    if (!direct) {
      await query('DELETE FROM carts WHERE user_id = $1', [user.id]);
    }

    return NextResponse.json({ snapToken, orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    client.release();
  }
}
