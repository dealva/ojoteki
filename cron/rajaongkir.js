const fetch = require('node-fetch'); // required in CommonJS
const { URLSearchParams } = require('url');

class RajaOngkir {
  static BASE_URL = 'https://rajaongkir.komerce.id/api/v1';
  static API_KEY = process.env.ECOM_RAJAONGKIR_API_KEY;

  static async searchDomesticDestinations(search, limit = 10, offset = 0) {
    const response = await fetch(
      `${this.BASE_URL}/destination/domestic-destination?search=${search}&limit=${limit}&offset=${offset}`,
      {
        headers: { key: this.API_KEY }
      }
    );
    return await response.json();
  }

  static async calculateCost({
    origin,
    destination,
    weight,
    couriers,
    sortBy = 'lowest'
  } = {}) {
    const response = await fetch(
      `${this.BASE_URL}/calculate/domestic-cost`,
      {
        method: 'POST',
        headers: {
          key: this.API_KEY,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          origin,
          destination,
          weight,
          courier: couriers.map(courier => courier.toLowerCase()).join(':'),
          price: sortBy
        }).toString()
      }
    );
    return await response.json();
  }

  static async getWaybill(trackingNumber, courier) {
    const response = await fetch(
      `${this.BASE_URL}/track/waybill`,
      {
        method: 'POST',
        headers: {
          key: this.API_KEY,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          awb: trackingNumber,
          courier: courier.toLowerCase()
        }).toString()
      }
    );
    return await response.json();
  }
}

module.exports = RajaOngkir;
