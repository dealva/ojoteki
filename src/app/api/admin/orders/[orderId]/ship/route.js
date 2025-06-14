// File: /app/api/admin/orders/[orderId]/ship/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import RajaOngkir from '@/lib/rajaongkir'; // adjust if the path differs

export async function POST(req, { params }) {
  const { orderId } = await params;
  const { courier, trackingNumber } = await req.json();

  if (!courier?.trim() || !trackingNumber?.trim()) {
    return NextResponse.json(
      { error: 'Courier and tracking number are required.' },
      { status: 400 }
    );
  }

  // Step 1: Validate order exists and is confirmed
  const orderRes = await query(
    'SELECT * FROM orders WHERE id = $1 AND status = $2',
    [orderId, 'confirmed']
  );
  if (orderRes.rowCount === 0) {
    return NextResponse.json(
      { error: 'Order not found or not confirmed.' },
      { status: 400 }
    );
  }

  // Step 2: Try to fetch current delivery status from RajaOngkir
  let shipmentStatus = 'in_transit'; // fallback
  try {
    const waybillRes = await RajaOngkir.getWaybill(trackingNumber, courier);
    const summary = waybillRes?.data?.summary;

    if (summary?.status) {
      shipmentStatus = summary.status.toLowerCase().replace(/\s+/g, '_'); // e.g. 'DELIVERED' → 'delivered'
    }
  } catch (err) {
    console.error('RajaOngkir tracking failed:', err);
    // Proceed anyway with fallback status
  }
  console.log(`Shipment status for ${trackingNumber}: ${shipmentStatus}`);
  // Step 3: Update order status to 'shipped'
  await query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
    ['shipped', orderId]
  );

  // Step 4: Create shipment record
  await query(
    `INSERT INTO shipments (order_id, reference, courier, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())`,
    [orderId, trackingNumber, courier.toLowerCase(), shipmentStatus]
  );

  return NextResponse.json({ success: true });
}
