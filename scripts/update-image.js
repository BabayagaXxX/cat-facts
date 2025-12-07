require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateImage() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: node scripts/update-image.js "Breed Name" "Image URL"');
        process.exit(1);
    }

    const [breedName, imageUrl] = args;

    console.log(`Updating image for breed: "${breedName}" to "${imageUrl}"...`);

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [result] = await connection.execute(
            'UPDATE breeds SET image_url = ? WHERE breed = ?',
            [imageUrl, breedName]
        );

        if (result.affectedRows > 0) {
            console.log('✅ Success! Image updated.');
        } else {
            console.log('⚠️  No breed found with that name.');
        }
    } catch (error) {
        console.error('❌ Error updating database:', error);
    } finally {
        await connection.end();
    }
}

updateImage();
