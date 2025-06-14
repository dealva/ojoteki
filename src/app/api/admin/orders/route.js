import { query } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = 10;
  const offset = (page - 1) * limit;

  const queryParams = [];
  let whereClause = '';

  if (search) {
    queryParams.push(`%${search}%`);
    whereClause = `WHERE LOWER(u.name) LIKE $${queryParams.length}`;
  }

  queryParams.push(limit, offset);

  try {
    const result = await query(
      `
      SELECT 
        o.id,
        u.name AS user_name,
        u.address AS user_address,
        o.total_price,
        o.status,
        s.status AS shipment_status
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN shipments s ON s.order_id = o.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
      `,
      queryParams
    );

    const countQuery = await query(
      `
      SELECT COUNT(*) FROM orders o
      JOIN users u ON u.id = o.user_id
      ${whereClause}
      `,
      queryParams.slice(0, queryParams.length - 2)
    );

    const total = parseInt(countQuery.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);
    
    return Response.json({
      orders: result.rows,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
