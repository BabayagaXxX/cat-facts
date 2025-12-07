require('dotenv').config();
const mysql = require('mysql2/promise');

async function listBreeds() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [rows] = await connection.execute('SELECT breed FROM breeds');
        console.log('Breeds found:', rows.map(r => r.breed));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

listBreeds();
