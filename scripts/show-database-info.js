const mysql = require('mysql2/promise');
require('dotenv').config();

async function showDatabaseInfo() {
    let connection;
    
    try {
        console.log('🔍 Detailed Database Information\n');
        console.log('═══════════════════════════════════════════════════');
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        // Show connection details
        console.log('📡 Connection Details:');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Port: ${process.env.DB_PORT || '3306'}`);
        console.log(`   User: ${process.env.DB_USER}`);
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log('\n═══════════════════════════════════════════════════\n');

        // Get server info
        const [serverInfo] = await connection.query('SELECT VERSION() as version');
        console.log(`🖥️  MySQL Version: ${serverInfo[0].version}\n`);

        // Show current database
        const [dbInfo] = await connection.query('SELECT DATABASE() as current_db');
        console.log(`📂 Current Database: ${dbInfo[0].current_db}\n`);

        // List all databases
        console.log('📚 All Databases:');
        const [databases] = await connection.query('SHOW DATABASES');
        databases.forEach((db, i) => {
            const dbName = Object.values(db)[0];
            const isCurrent = dbName === process.env.DB_NAME;
            console.log(`   ${isCurrent ? '➤' : ' '} ${dbName} ${isCurrent ? '(ACTIVE)' : ''}`);
        });

        console.log('\n═══════════════════════════════════════════════════\n');

        // Show all tables in current database
        console.log('📋 Tables in cat_facts_db:');
        const [tables] = await connection.query('SHOW TABLES');
        if (tables.length === 0) {
            console.log('   No tables found');
        } else {
            tables.forEach(table => {
                console.log(`   • ${Object.values(table)[0]}`);
            });
        }

        console.log('\n═══════════════════════════════════════════════════\n');

        // Check breeds table
        const [tableCheck] = await connection.query("SHOW TABLES LIKE 'breeds'");
        if (tableCheck.length > 0) {
            console.log('✅ breeds table EXISTS\n');

            // Get exact count
            const [count] = await connection.query('SELECT COUNT(*) as total FROM breeds');
            console.log(`📊 Total Records: ${count[0].total}\n`);

            if (count[0].total > 0) {
                // Show all records with full details
                console.log('📝 All Records in breeds table:\n');
                const [allRecords] = await connection.query('SELECT * FROM breeds ORDER BY id');
                
                allRecords.forEach((record, index) => {
                    console.log(`Record #${index + 1}:`);
                    console.log(`   ID: ${record.id}`);
                    console.log(`   Breed: ${record.breed}`);
                    console.log(`   Country: ${record.country}`);
                    console.log(`   Origin: ${record.origin}`);
                    console.log(`   Coat: ${record.coat}`);
                    console.log(`   Pattern: ${record.pattern}`);
                    console.log(`   Image URL: ${record.image_url || '(none)'}`);
                    console.log(`   Created: ${record.created_at}`);
                    console.log('');
                });

                console.log('═══════════════════════════════════════════════════\n');
                console.log('💡 SQLyog Configuration:');
                console.log(`   Make sure you're connected to: ${process.env.DB_HOST}:${process.env.DB_PORT || '3306'}`);
                console.log(`   Using database: ${process.env.DB_NAME}`);
                console.log(`   Then refresh (F5) or right-click → Refresh`);
            }
        } else {
            console.log('❌ breeds table does NOT exist!');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nFull error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

showDatabaseInfo();
