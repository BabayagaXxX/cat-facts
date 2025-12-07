import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        console.log('📖 GET /api/breeds - Fetching all breeds...');
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM breeds ORDER BY created_at DESC');
        console.log(`✅ Found ${rows.length} breeds in database`);
        return NextResponse.json(rows);
    } catch (error) {
        console.error('❌ Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch breeds' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        console.log('📝 POST /api/breeds - Starting...');
        
        const formData = await request.formData();
        const breed = formData.get('breed') as string;
        const country = formData.get('country') as string;
        const origin = formData.get('origin') as string;
        const coat = formData.get('coat') as string;
        const pattern = formData.get('pattern') as string;
        const image = formData.get('image') as File | null;

        console.log('📋 Form data:', { breed, country, origin, coat, pattern, hasImage: !!image });

        let image_url = '';

        if (image) {
            console.log('🖼️ Processing image:', image.name, image.size, 'bytes');
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure uploads directory exists
            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            // Create unique filename
            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            image_url = `/uploads/${filename}`;
            console.log('✅ Image saved:', image_url);
        }

        console.log('💾 Attempting database insert...');
        const [result] = await db.execute(
            'INSERT INTO breeds (breed, country, origin, coat, pattern, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [breed, country, origin, coat, pattern, image_url]
        );

        const insertId = (result as any).insertId;
        console.log('✅ Database insert successful! ID:', insertId);

        return NextResponse.json({ id: insertId, breed, country, origin, coat, pattern, image_url }, { status: 201 });
    } catch (error) {
        console.error('❌ Database error:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
        return NextResponse.json({ 
            error: 'Failed to add breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        console.log('✏️ PUT /api/breeds - Starting update...');
        
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

        console.log('📋 Update data:', { id, breed, country, origin, coat, pattern, hasNewImage: !!image });

        let image_url: string | undefined;

        if (image) {
            console.log('🖼️ Processing new image:', image.name, image.size, 'bytes');
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
            const filepath = join(uploadDir, filename);

            await writeFile(filepath, buffer);
            image_url = `/uploads/${filename}`;
            console.log('✅ New image saved:', image_url);
        }

        console.log('💾 Attempting database update...');
        
        let query: string;
        let params: any[];
        
        if (image_url) {
            query = 'UPDATE breeds SET breed = ?, country = ?, origin = ?, coat = ?, pattern = ?, image_url = ? WHERE id = ?';
            params = [breed, country, origin, coat, pattern, image_url, id];
        } else {
            query = 'UPDATE breeds SET breed = ?, country = ?, origin = ?, coat = ?, pattern = ? WHERE id = ?';
            params = [breed, country, origin, coat, pattern, id];
        }

        await db.execute(query, params);
        console.log('✅ Database update successful!');

        // Fetch the updated record
        const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM breeds WHERE id = ?', [id]);
        
        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error('❌ Update error:', error);
        return NextResponse.json({ 
            error: 'Failed to update breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('🗑️ DELETE /api/breeds - Deleting breed ID:', id);

        await db.execute('DELETE FROM breeds WHERE id = ?', [id]);
        console.log('✅ Breed deleted successfully!');

        return NextResponse.json({ success: true, message: 'Breed deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('❌ Delete error:', error);
        return NextResponse.json({ 
            error: 'Failed to delete breed', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
