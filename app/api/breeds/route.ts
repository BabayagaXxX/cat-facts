import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { saveUploadedFile } from '@/lib/file-upload';

/**
 * GET /api/breeds
 * Fetches all breeds from the database, sorted by newest first
 */
export async function GET() {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT * FROM breeds ORDER BY created_at DESC'
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch breeds:', error);
        return NextResponse.json({ error: 'Failed to fetch breeds' }, { status: 500 });
    }
}

/**
 * POST /api/breeds
 * Creates a new breed in the database with optional image upload
 */
export async function POST(request: Request) {
    try {
        // Extract form data
        const formData = await request.formData();
        const breed = formData.get('breed') as string;
        const country = formData.get('country') as string;
        const origin = formData.get('origin') as string;
        const coat = formData.get('coat') as string;
        const pattern = formData.get('pattern') as string;
        const image = formData.get('image') as File | null;

        // Handle image upload if provided
        let image_url = '';
        if (image) {
            image_url = await saveUploadedFile(image, 'breeds');
        }

        // Insert breed into database
        const [result] = await db.execute(
            'INSERT INTO breeds (breed, country, origin, coat, pattern, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [breed, country, origin, coat, pattern, image_url]
        );

        const insertId = (result as any).insertId;
        return NextResponse.json(
            { id: insertId, breed, country, origin, coat, pattern, image_url },
            { status: 201 }
        );
    } catch (error) {
        console.error('Failed to add breed:', error);
        return NextResponse.json({ 
            error: 'Failed to add breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

/**
 * PUT /api/breeds
 * Updates an existing breed with optional new image
 */
export async function PUT(request: Request) {
    try {
        // Extract form data
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const breed = formData.get('breed') as string;
        const country = formData.get('country') as string;
        const origin = formData.get('origin') as string;
        const coat = formData.get('coat') as string;
        const pattern = formData.get('pattern') as string;
        const image = formData.get('image') as File | null;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Handle new image if provided
        let image_url: string | undefined;
        if (image) {
            image_url = await saveUploadedFile(image, 'breeds');
        }

        // Build update query based on whether we have a new image
        const query = image_url
            ? 'UPDATE breeds SET breed = ?, country = ?, origin = ?, coat = ?, pattern = ?, image_url = ? WHERE id = ?'
            : 'UPDATE breeds SET breed = ?, country = ?, origin = ?, coat = ?, pattern = ? WHERE id = ?';
        
        const params = image_url
            ? [breed, country, origin, coat, pattern, image_url, id]
            : [breed, country, origin, coat, pattern, id];

        await db.execute(query, params);

        // Return updated breed
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM breeds WHERE id = ?', [id]);
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error('Failed to update breed:', error);
        return NextResponse.json({ 
            error: 'Failed to update breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

/**
 * DELETE /api/breeds?id=123
 * Deletes a breed from the database
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await db.execute('DELETE FROM breeds WHERE id = ?', [id]);
        return NextResponse.json({ success: true, message: 'Breed deleted successfully' });
    } catch (error) {
        console.error('Failed to delete breed:', error);
        return NextResponse.json({ 
            error: 'Failed to delete breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
