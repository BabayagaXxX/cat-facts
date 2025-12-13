import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

/**
 * GET /api/facts
 * Fetches the latest 20 cat facts from our local database
 */
export async function GET() {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM facts ORDER BY created_at DESC LIMIT 20'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch facts:', error);
        return NextResponse.json({ error: 'Failed to fetch facts' }, { status: 500 });
    }
}

/**
 * POST /api/facts
 * Saves a single cat fact to our local database
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fact, length } = body;

        // Validate required fields
        if (!fact || !length) {
            return NextResponse.json({ error: 'Fact and length are required' }, { status: 400 });
        }

        // Insert fact into database
        const [result] = await db.execute(
            'INSERT INTO facts (fact, length) VALUES (?, ?)',
            [fact, length]
        );

        const insertId = (result as any).insertId;
        return NextResponse.json({ id: insertId, fact, length }, { status: 201 });
    } catch (error) {
        console.error('Failed to save fact:', error);
        return NextResponse.json({ 
            error: 'Failed to save fact', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

/**
 * DELETE /api/facts
 * Clears all facts from our local database
 * Used when fetching fresh facts from the external API
 */
export async function DELETE() {
    try {
        await db.execute('DELETE FROM facts');
        return NextResponse.json({ success: true, message: 'Facts cleared' });
    } catch (error) {
        console.error('Failed to delete facts:', error);
        return NextResponse.json({ 
            error: 'Failed to delete facts', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
