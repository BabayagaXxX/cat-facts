require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log('🔄 Starting migration: Remove pending status from adoptions...\n');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('✅ Connected to database');

        // Read the migration file
        const migrationPath = path.join(__dirname, '..', 'database', 'migration_update_adoptions_remove_pending.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Executing migration...\n');

        // Execute the migration
        const [results] = await connection.query(sql);

        console.log('✅ Migration completed successfully!\n');

        // Show the results
        if (Array.isArray(results)) {
            const lastResult = results[results.length - 1];
            if (Array.isArray(lastResult)) {
                console.log('📊 Current adoption status distribution:');
                lastResult.forEach(row => {
                    console.log(`   ${row.adoption_status}: ${row.count}`);
                });
            }
        }

        console.log('\n✨ All done! The adoptions table now only uses "available" and "adopted" statuses.');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
        console.log('\n🔌 Database connection closed');
    }
}

runMigration();
