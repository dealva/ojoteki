import { NextResponse } from 'next/server';
import { createSignature } from '@/lib/midtrans';
import { query } from '@/lib/db';  

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      transaction_status,
      fraud_status,
      signature_key,
    } = body;
    console.log('Received Midtrans notification:', body);
    // Verify signature
    const expectedSignature = createSignature(order_id, status_code, gross_amount);
    if (expectedSignature !== signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    console.log('Signature verified successfully' , order_id);

    // Map Midtrans status to internal status values
    let orderStatus = null;
    let transactionStatus = null;
    let paidAt = null;

    switch (transaction_status) {
      case 'capture':
        if (fraud_status === 'challenge') {
          orderStatus = '';
          transactionStatus = 'pending';
        } else if (fraud_status === 'accept') {
          orderStatus = 'confirmed';
          transactionStatus = 'paid';
          paidAt = new Date();
        }
        break;

      case 'settlement':
        orderStatus = 'confirmed';
        transactionStatus = 'paid';
        paidAt = new Date();
        break;

      case 'pending':
        orderStatus = 'pending';
        transactionStatus = 'pending';
        break;

      case 'deny':
        orderStatus = 'failed';
        transactionStatus = 'failed';
        break;

      case 'expire':
        orderStatus = 'expired';
        transactionStatus = 'failed';
        break;

      case 'cancel':
        orderStatus = 'canceled';
        transactionStatus = 'failed';
        break;

      default:
        console.log('Unknown transaction status:', transaction_status);
    }

    if (orderStatus && transactionStatus) {
      // Update orders table
      await query(
        `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [orderStatus, parseInt(order_id.replace('order-', ''))]
      );

      // Update transactions table
      await query(
        `UPDATE transactions SET status = $1, paid_at = COALESCE($2, paid_at), updated_at = CURRENT_TIMESTAMP
         WHERE order_id = $3`,
        [transactionStatus, paidAt, parseInt(order_id.replace('order-', ''))]
      );
    }

    return NextResponse.json({ message: 'Notification processed' });
  } catch (error) {
    console.error('Error handling Midtrans notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
