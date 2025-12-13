import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { saveUploadedFile } from '@/lib/file-upload';

/**
 * GET /api/adoptions
 * Fetches all adoption listings with breed information, sorted by newest first
 * Excludes soft-deleted records (where deleted_at is NOT NULL)
 */
export async function GET() {
    try {
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                a.*,
                b.breed as breed_name
            FROM adoptions a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.deleted_at IS NULL
            ORDER BY a.created_at DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Failed to fetch adoptions:', error);
        return NextResponse.json({ error: 'Failed to fetch adoptions' }, { status: 500 });
    }
}

/**
 * POST /api/adoptions
 * Creates a new adoption listing with optional image upload
 */
export async function POST(request: Request) {
    try {
        // Extract all form data
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const breed_id = formData.get('breed_id') as string;
        const age = formData.get('age') as string;
        const gender = formData.get('gender') as string;
        const temperament = formData.get('temperament') as string;
        const description = formData.get('description') as string;
        const adoption_status = formData.get('adoption_status') as string || 'available';
        const contact_name = formData.get('contact_name') as string;
        const contact_email = formData.get('contact_email') as string;
        const contact_phone = formData.get('contact_phone') as string;
        const location = formData.get('location') as string;
        const image = formData.get('image') as File | null;

        // Handle image upload if provided
        let image_url = '';
        if (image) {
            image_url = await saveUploadedFile(image, 'adoptions');
        }

        // Insert into database
        const [result] = await db.execute(
            `INSERT INTO adoptions 
            (name, breed_id, age, gender, temperament, description, adoption_status, 
             contact_name, contact_email, contact_phone, location, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, breed_id || null, age, gender, temperament, description, adoption_status,
             contact_name, contact_email, contact_phone, location, image_url]
        );

        const insertId = (result as any).insertId;
        return NextResponse.json({ 
            id: insertId, 
            name, 
            breed_id, 
            age, 
            gender, 
            temperament,
            description,
            adoption_status,
            contact_name,
            contact_email,
            contact_phone,
            location,
            image_url 
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create adoption:', error);
        return NextResponse.json({ 
            error: 'Failed to create adoption listing', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

// PUT - Update adoption listing
export async function PUT(request: Request) {
    try {
        console.log('✏️ PUT /api/adoptions - Starting update...');
        
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const breed_id = formData.get('breed_id') as string;
        const age = formData.get('age') as string;
        const gender = formData.get('gender') as string;
        const temperament = formData.get('temperament') as string;
        const description = formData.get('description') as string;
        const adoption_status = formData.get('adoption_status') as string;
        const contact_name = formData.get('contact_name') as string;
        const contact_email = formData.get('contact_email') as string;
        const contact_phone = formData.get('contact_phone') as string;
        const location = formData.get('location') as string;
        const image = formData.get('image') as File | null;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Handle new image if provided
        let image_url: string | undefined;
        if (image) {
            image_url = await saveUploadedFile(image, 'adoptions');
        }

        // Build update query based on whether we have a new image
        const query = image_url
            ? `UPDATE adoptions SET 
                name = ?, breed_id = ?, age = ?, gender = ?, temperament = ?, 
                description = ?, adoption_status = ?, contact_name = ?, contact_email = ?, 
                contact_phone = ?, location = ?, image_url = ? 
                WHERE id = ?`
            : `UPDATE adoptions SET 
                name = ?, breed_id = ?, age = ?, gender = ?, temperament = ?, 
                description = ?, adoption_status = ?, contact_name = ?, contact_email = ?, 
                contact_phone = ?, location = ? 
                WHERE id = ?`;
        
        const params = image_url
            ? [name, breed_id || null, age, gender, temperament, description, adoption_status,
               contact_name, contact_email, contact_phone, location, image_url, id]
            : [name, breed_id || null, age, gender, temperament, description, adoption_status,
               contact_name, contact_email, contact_phone, location, id];

        await db.execute(query, params);

        // Return updated adoption with breed name
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT a.*, b.breed as breed_name
            FROM adoptions a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.id = ?
        `, [id]);
        
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error('Failed to update adoption:', error);
        return NextResponse.json({ 
            error: 'Failed to update adoption listing', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

/**
 * DELETE /api/adoptions?id=123
 * Deletes an adoption listing from the database
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await db.execute('DELETE FROM adoptions WHERE id = ?', [id]);
        return NextResponse.json({ success: true, message: 'Adoption deleted successfully' });
    } catch (error) {
        console.error('Failed to delete adoption:', error);
        return NextResponse.json({ 
            error: 'Failed to delete adoption listing', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
