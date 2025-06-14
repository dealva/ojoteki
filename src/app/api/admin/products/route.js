import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() || '';
  const featured = searchParams.get('featured');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const filters = [];
    const queryParams = [];

    // Search filter
    if (search) {
      queryParams.push(`%${search}%`);
      filters.push(`LOWER(p.name) LIKE $${queryParams.length}`);
    }

    // Featured filter
    if (featured === 'true' || featured === 'false') {
      queryParams.push(featured === 'true');
      filters.push(`p.featured = $${queryParams.length}`);
    }

    // Category filter
    if (category && category !== 'all') {
      queryParams.push(parseInt(category));
      filters.push(`p.category_id = $${queryParams.length}`);
    }

    // Combine WHERE clause
    const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    // Add pagination params
    queryParams.push(limit, offset);

    const result = await query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
      queryParams
    );

    const countQuery = await query(
      `SELECT COUNT(*) FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ${where}`,
      queryParams.slice(0, queryParams.length - 2) // exclude limit & offset
    );

    const total = parseInt(countQuery.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      products: result.rows,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}



export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      featured,
      image_url,
    } = body;

    // Optional: Basic validation
    if (!name || !price || !category_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const insertQuery = `
      INSERT INTO products (
        name,
        description,
        price,
        stock_quantity,
        category_id,
        featured,
        image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      name,
      description || '',
      price,
      stock_quantity || 0,
      category_id,
      featured || false,
      image_url || null,
    ];

    const result = await query(insertQuery, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error('Product insert error:', err);
    return NextResponse.json({ message: 'Failed to add product' }, { status: 500 });
  }
}
