import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
function extractPublicId(url) {
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}
export async function GET(req, { params }) {
      const p =await params;
  const productId = p.id;
    console.log('Fetching product with ID:', productId);


  const result = await query('SELECT * FROM products WHERE id = $1', [productId]);
  const rows = result.rows;

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(req, { params }) {
  const p =await params;
  const id = p.id;
  try {
    await query(`DELETE FROM products WHERE id = $1`, [id]);
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error('Delete failed:', err);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const p =await params;
  const id = p.id;
  const body = await req.json();
  const { name, description, price, stock_quantity, category_id, featured, image_url, old_image_url } = body;

  try {

    const updateQuery = `
      UPDATE products SET
        name = $1,
        description = $2,
        price = $3,
        stock_quantity = $4,
        category_id = $5,
        featured = $6,
        image_url = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;

    const values = [
      name,
      description || '',
      price,
      stock_quantity || 0,
      category_id,
      featured ?? false,
      image_url ?? null,
      id,
    ];

    const result = await query(updateQuery, values);
    if (old_image_url && image_url !== old_image_url) {
      const publicId = extractPublicId(old_image_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error('Update failed:', err);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}


