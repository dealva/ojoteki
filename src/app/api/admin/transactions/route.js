import { query } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const queryParams = [];
  let whereClause = '';

  if (search) {
    queryParams.push(`%${search}%`, `%${search}%`);
    whereClause = `
      WHERE LOWER(t.reference) LIKE $1 OR LOWER(u.name) LIKE $2
    `;
  }

  queryParams.push(limit, offset);

  try {
    const transactionsResult = await query(`
      SELECT 
        t.id,
        t.reference,
        t.order_id,
        t.payment_method,
        t.paid_at,
        t.status,
        u.name AS user_name
      FROM transactions t
      LEFT JOIN orders o ON t.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
    `, queryParams);

    // Count query for pagination
    const countParams = search ? queryParams.slice(0, queryParams.length - 2) : [];
    const countQueryText = `
      SELECT COUNT(*) FROM transactions t
      LEFT JOIN orders o ON t.order_id = o.id
      LEFT JOIN users u ON o.user_id = u.id
      ${whereClause}
    `;
    const countResult = await query(countQueryText, countParams);
    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      transactions: transactionsResult.rows,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('[GET /api/transactions]', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

