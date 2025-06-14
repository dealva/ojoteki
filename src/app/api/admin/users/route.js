
import { query } from '@/lib/db';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  const queryParams = [];
  let whereClause = `WHERE role = 'customer'`; // Always filter by customer role

  if (search) {
    queryParams.push(`%${search}%`, `%${search}%`);
    whereClause += ` AND (LOWER(name) LIKE $1 OR LOWER(email) LIKE $2)`;
  }

  queryParams.push(limit, offset);

  const result = await query(`
    SELECT id, name, email
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
  `, queryParams);

  // Count total for pagination
  const countParams = search ? queryParams.slice(0, queryParams.length - 2) : [];
  const countResult = await query(`
    SELECT COUNT(*) FROM users
    ${whereClause}
  `, countParams);

  const total = parseInt(countResult.rows[0].count, 10);
  const totalPages = Math.ceil(total / limit);

  return Response.json({
    users: result.rows,
    pagination: {
      totalItems: total,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  });
}

