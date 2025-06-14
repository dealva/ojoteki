// src/app/api/admin/categories/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db'; // adjust path as needed

export async function GET() {
  try {
    const result = await query('SELECT id, name FROM categories ORDER BY name ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Category name is required' }, { status: 400 });
    }

    const insertResult = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
      [name.trim()]
    );
    return NextResponse.json(insertResult.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
