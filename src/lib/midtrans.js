import { Snap } from "midtrans-client";
import crypto from 'crypto';

export const snap = new Snap({
  isProduction: false,
  serverKey: process.env.ECOM_MIDTRANS_SERVER_KEY,
});

export function createSignature(orderId, statusCode, grossAmount) {
  const serverKey = process.env.ECOM_MIDTRANS_SERVER_KEY;
  const input = orderId + statusCode + grossAmount + serverKey;
  return crypto.createHash('sha512').update(input).digest('hex');
}
