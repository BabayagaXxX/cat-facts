const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   User: ${process.env.DB_USER}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to database\n');

        // Check if breeds table exists
        console.log('📋 Checking if breeds table exists...');
        const [tables] = await connection.query(
            "SHOW TABLES LIKE 'breeds'"
        );
        
        if (tables.length === 0) {
            console.log('❌ Table "breeds" does not exist!');
            console.log('\n💡 You need to create the breeds table first.');
            return;
        }
        
        console.log('✅ Table "breeds" exists\n');

        // Show table structure
        console.log('📊 Table structure:');
        const [columns] = await connection.query('DESCRIBE breeds');
        console.table(columns);

        // Count records
        const [countResult] = await connection.query('SELECT COUNT(*) as count FROM breeds');
        console.log(`\n📈 Total records: ${countResult[0].count}`);

        // Show recent records
        if (countResult[0].count > 0) {
            console.log('\n📝 Recent records:');
            const [records] = await connection.query('SELECT * FROM breeds ORDER BY created_at DESC LIMIT 5');
            console.table(records);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 The database does not exist. Please create it first.');
        }
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Cannot connect to MySQL. Make sure MySQL is running.');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkDatabase();
