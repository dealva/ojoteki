// cron/trackShipments.js
require('dotenv').config();
const cron = require('node-cron');
const { query } = require('../src/lib/db'); 
const RajaOngkir = require('../src/lib/rajaongkir').default; 

// Run every hour
cron.schedule('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running shipment tracking task...`);

  try {
    const { rows: shipments } = await query(
      `SELECT id, reference, courier FROM shipments WHERE status != 'delivered'`
    );

    for (const shipment of shipments) {
      try {
        const result = await RajaOngkir.getWaybill(shipment.reference, shipment.courier);
        const deliveryStatus = result?.data?.summary?.status?.toLowerCase();

        if (deliveryStatus) {
          await query(
            `UPDATE shipments SET status = $1, updated_at = NOW() WHERE id = $2`,
            [deliveryStatus, shipment.id]
          );
          console.log(`Updated shipment ${shipment.id} to "${deliveryStatus}"`);
        } else {
          console.warn(`No status found for shipment ${shipment.id}`);
        }
      } catch (err) {
        console.error(`Error tracking shipment ${shipment.id}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Failed to fetch shipments:', err.message);
  }
});
