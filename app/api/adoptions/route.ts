import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET - Fetch all adoptions
export async function GET() {
    try {
        console.log('📖 GET /api/adoptions - Fetching all adoptions...');
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                a.*,
                b.breed as breed_name
            FROM adoptions a
            LEFT JOIN breeds b ON a.breed_id = b.id
            ORDER BY a.created_at DESC
        `);
        console.log(`✅ Found ${rows.length} adoptions in database`);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('❌ Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch adoptions' }, { status: 500 });
    }
}

// POST - Create new adoption listing
export async function POST(request: Request) {
    try {
        console.log('📝 POST /api/adoptions - Creating new adoption...');
        
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

        console.log('📋 Form data:', { name, breed_id, age, gender, adoption_status });

        let image_url = '';

        if (image) {
            console.log('🖼️ Processing image:', image.name, image.size, 'bytes');
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'adoptions');
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            image_url = `/uploads/adoptions/${filename}`;
            console.log('✅ Image saved:', image_url);
        }

        console.log('💾 Attempting database insert...');
        const [result] = await db.execute(
            `INSERT INTO adoptions 
            (name, breed_id, age, gender, temperament, description, adoption_status, 
             contact_name, contact_email, contact_phone, location, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, breed_id || null, age, gender, temperament, description, adoption_status,
             contact_name, contact_email, contact_phone, location, image_url]
        );

        const insertId = (result as any).insertId;
        console.log('✅ Database insert successful! ID:', insertId);

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
        console.error('❌ Database error:', error);
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

        console.log('📋 Update data:', { id, name, breed_id, age, gender, adoption_status });

        let image_url: string | undefined;

        if (image) {
            console.log('🖼️ Processing new image:', image.name);
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads', 'adoptions');
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            image_url = `/uploads/adoptions/${filename}`;
            console.log('✅ New image saved:', image_url);
        }

        console.log('💾 Attempting database update...');
        
        let query: string;
        let params: any[];
        
        if (image_url) {
            query = `UPDATE adoptions SET 
                name = ?, breed_id = ?, age = ?, gender = ?, temperament = ?, 
                description = ?, adoption_status = ?, contact_name = ?, contact_email = ?, 
                contact_phone = ?, location = ?, image_url = ? 
                WHERE id = ?`;
            params = [name, breed_id || null, age, gender, temperament, description, adoption_status,
                     contact_name, contact_email, contact_phone, location, image_url, id];
        } else {
            query = `UPDATE adoptions SET 
                name = ?, breed_id = ?, age = ?, gender = ?, temperament = ?, 
                description = ?, adoption_status = ?, contact_name = ?, contact_email = ?, 
                contact_phone = ?, location = ? 
                WHERE id = ?`;
            params = [name, breed_id || null, age, gender, temperament, description, adoption_status,
                     contact_name, contact_email, contact_phone, location, id];
        }

        await db.execute(query, params);
        console.log('✅ Database update successful!');

        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT a.*, b.breed as breed_name
            FROM adoptions a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.id = ?
        `, [id]);
        
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json({ 
            error: 'Failed to update adoption listing', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

// DELETE - Delete adoption listing
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('🗑️ DELETE /api/adoptions - Deleting adoption ID:', id);

        await db.execute('DELETE FROM adoptions WHERE id = ?', [id]);
        console.log('✅ Adoption deleted successfully!');

        return NextResponse.json({ success: true, message: 'Adoption deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete adoption listing', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
