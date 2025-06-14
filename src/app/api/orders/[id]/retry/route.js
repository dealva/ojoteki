import { snap } from '@/lib/midtrans';
import { query } from '@/lib/db';

export async function PATCH(req, { params }) {
    const data= await params;
  const orderId = data.id;

  // 1. Get existing transaction for this order
  const transactions = await query(
    'SELECT * FROM transactions WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
    [orderId]
  );

  const transaction = transactions.rows[0];
   console.log ("Transaksi",transactions)
  if (transaction) {
    if (transaction.status === 'pending' && transaction.snap_token) {
      // Return existing snap token
         
      return new Response(
        JSON.stringify({ snap_token: transaction.snap_token }),
        { status: 200 }
      );
    }
    // else if failed or expired, create new transaction
  }

  // 2. Fetch order details and prepare params for Midtrans snap create transaction
  // (your existing logic here)

  // 3. Call Midtrans API to create transaction, get new snap token
  const snapResponse = await snap.createTransaction(data);
  const newSnapToken = snapResponse.token;

  // 4. Insert or update transaction row in DB with new snap token and status = 'pending'
  if (transaction) {
    await query(
      'UPDATE transactions SET snap_token = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [newSnapToken, 'pending', transaction.id]
    );
  } else {
    await query(
      `INSERT INTO transactions (order_id, snap_token, status, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [orderId, newSnapToken, 'pending']
    );
  }

  return new Response(
    JSON.stringify({ snap_token: newSnapToken }),
    { status: 201 }
  );
}
