const mysql = require('mysql2/promise');
require('dotenv').config();

async function importAllBreeds() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');

        console.log('📡 Fetching all breeds from API...');
        
        let allBreeds = [];
        let currentPage = 1;
        let lastPage = 1;

        // Fetch first page to get total pages
        const firstResponse = await fetch('https://catfact.ninja/breeds?page=1');
        const firstData = await firstResponse.json();
        lastPage = firstData.last_page;
        allBreeds = allBreeds.concat(firstData.data);
        
        console.log(`📄 Total pages: ${lastPage}`);
        console.log(`📊 Fetching breeds from page 1/${lastPage}...`);

        // Fetch remaining pages
        for (let page = 2; page <= lastPage; page++) {
            console.log(`📊 Fetching breeds from page ${page}/${lastPage}...`);
            const response = await fetch(`https://catfact.ninja/breeds?page=${page}`);
            const data = await response.json();
            allBreeds = allBreeds.concat(data.data);
            
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n✅ Total breeds fetched: ${allBreeds.length}\n`);

        // Insert breeds into database
        console.log('💾 Inserting breeds into database...');
        let insertedCount = 0;
        let skippedCount = 0;

        for (const breed of allBreeds) {
            try {
                // Check if breed already exists
                const [existing] = await connection.query(
                    'SELECT id FROM breeds WHERE breed = ?',
                    [breed.breed]
                );

                if (existing.length > 0) {
                    console.log(`⏭️  Skipping "${breed.breed}" - already exists`);
                    skippedCount++;
                    continue;
                }

                // Insert breed
                await connection.execute(
                    'INSERT INTO breeds (breed, country, origin, coat, pattern, image_url) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        breed.breed,
                        breed.country,
                        breed.origin,
                        breed.coat,
                        breed.pattern,
                        '' // Empty image_url - you'll add images later
                    ]
                );
                
                console.log(`✅ Inserted: ${breed.breed} (${breed.country})`);
                insertedCount++;
            } catch (error) {
                console.error(`❌ Failed to insert ${breed.breed}:`, error.message);
            }
        }

        console.log('\n═══════════════════════════════════════════════════');
        console.log(`🎉 Import complete!`);
        console.log(`   ✅ Inserted: ${insertedCount} breeds`);
        console.log(`   ⏭️  Skipped: ${skippedCount} breeds (already existed)`);
        console.log(`   📊 Total: ${allBreeds.length} breeds from API`);
        console.log('═══════════════════════════════════════════════════\n');

        // Show some stats
        const [totalCount] = await connection.query('SELECT COUNT(*) as count FROM breeds');
        console.log(`📊 Total breeds in database: ${totalCount[0].count}`);

        const [withImages] = await connection.query('SELECT COUNT(*) as count FROM breeds WHERE image_url IS NOT NULL AND image_url != ""');
        console.log(`🖼️  Breeds with images: ${withImages[0].count}`);
        
        const [withoutImages] = await connection.query('SELECT COUNT(*) as count FROM breeds WHERE image_url IS NULL OR image_url = ""');
        console.log(`📷 Breeds needing images: ${withoutImages[0].count}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n👋 Database connection closed');
        }
    }
}

importAllBreeds();
