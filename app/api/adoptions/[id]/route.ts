import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

/**
 * DELETE /api/adoptions/[id]
 * Soft deletes an adoption (sets deleted_at timestamp)
 * Only adopted cats can be soft deleted
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id} = await params;

        // Check if adoption exists and is adopted
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT adoption_status FROM adoptions WHERE id = ? AND deleted_at IS NULL',
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'Adoption not found or already deleted' },
                { status: 404 }
            );
        }

        // Only allow deleting adopted cats
        if (rows[0].adoption_status !== 'adopted') {
            return NextResponse.json(
                { error: 'Can only delete adopted cats' },
                { status: 400 }
            );
        }

        // Soft delete: Set deleted_at to current timestamp
        await db.execute(
            'UPDATE adoptions SET deleted_at = NOW() WHERE id = ?',
            [id]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Adoption deleted successfully' 
        });
    } catch (error) {
        console.error('Failed to delete adoption:', error);
        return NextResponse.json(
            {
                error: 'Failed to delete adoption',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
