require('dotenv').config();
const mysql = require('mysql2/promise');

async function testInsert() {
    console.log('Attempting to connect to DB...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Connected! Inserting test breed...');
        const [result] = await connection.execute(
            'INSERT INTO breeds (breed, country, origin, coat, pattern, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            ['TestBreed', 'TestCountry', 'TestOrigin', 'TestCoat', 'TestPattern', 'http://example.com/test.jpg']
        );
        console.log('Insert result:', result);
        console.log('✅ Insert successful! Check SQLyog now.');
    } catch (error) {
        console.error('❌ Insert failed:', error);
    } finally {
        await connection.end();
    }
}

testInsert();
