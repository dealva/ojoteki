import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { completeProfileSchema } from '@/lib/validators';
import { query } from '@/lib/db';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await req.json();
  const { name, phone, address } = body;

  try {
    // Validate with Yup
    await completeProfileSchema.validate({ name, phone, address });

    const updateQuery = `
      UPDATE users
      SET name = $1,
          phone = $2,
          address = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = $4
      RETURNING id, name, phone, address, role;
    `;

    const values = [name, phone, address, session.user.email];

    const result = await query(updateQuery, values);

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Profile updated successfully' }), { status: 200 });
  } catch (err) {
    console.error('Complete profile error:', err);

    if (err.name === 'ValidationError') {
      return new Response(JSON.stringify({ error: err.errors?.[0] || 'Invalid input' }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
