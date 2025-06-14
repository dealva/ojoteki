import { query } from '@/lib/db';
export async function DELETE(req, { params }) {
    const p=params;
    const id = p.id;
    try {
        await query(`DELETE FROM orders WHERE id = $1`, [id]);
        return new Response(null, { status: 204 }); // Successfully deleted
    } catch (err) {
        if (err.code === '23503') {
        return new Response(
            JSON.stringify({
            error: 'Cannot delete order: it still has associated order items.',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
        }

        console.error('Unexpected error deleting order:', err);
        return new Response(
        JSON.stringify({ error: 'Failed to delete order.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
