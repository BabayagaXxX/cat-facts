import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET - Fetch facts from database
export async function GET() {
    try {
        console.log('📖 GET /api/facts - Fetching facts from database...');
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM facts ORDER BY created_at DESC LIMIT 20');
        console.log(`✅ Found ${rows.length} facts in database`);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('❌ Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch facts' }, { status: 500 });
    }
}

// POST - Save a fact to database
export async function POST(request: Request) {
    try {
        console.log('📝 POST /api/facts - Saving fact...');
        
        const body = await request.json();
        const { fact, length } = body;

        if (!fact || !length) {
            return NextResponse.json({ error: 'Fact and length are required' }, { status: 400 });
        }

        console.log('💾 Attempting database insert...');
        const [result] = await db.execute(
            'INSERT INTO facts (fact, length) VALUES (?, ?)',
            [fact, length]
        );

        const insertId = (result as any).insertId;
        console.log('✅ Fact saved! ID:', insertId);

        return NextResponse.json({ id: insertId, fact, length }, { status: 201 });
    } catch (error) {
        console.error('❌ Database error:', error);
        return NextResponse.json({ 
            error: 'Failed to save fact', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

// DELETE - Delete all facts (for refresh)
export async function DELETE() {
    try {
        console.log('🗑️ DELETE /api/facts - Clearing facts...');
        await db.execute('DELETE FROM facts');
        console.log('✅ All facts deleted');
        return NextResponse.json({ success: true, message: 'Facts cleared' }, { status: 200 });
    } catch (error) {
        console.error('❌ Delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete facts', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
