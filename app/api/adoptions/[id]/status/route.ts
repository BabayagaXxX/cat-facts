import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

/**
 * PATCH /api/adoptions/[id]/status
 * Updates the adoption status of a specific cat
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        // Validate status
        if (!['available', 'adopted'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be available or adopted' },
                { status: 400 }
            );
        }

        // Update the adoption status
        await db.execute(
            'UPDATE adoptions SET adoption_status = ? WHERE id = ?',
            [status, id]
        );

        // Fetch and return the updated adoption
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT a.*, b.breed as breed_name
            FROM adoptions a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.id = ?
        `, [id]);

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Adoption not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Failed to update adoption status:', error);
        return NextResponse.json(
            {
                error: 'Failed to update adoption status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
