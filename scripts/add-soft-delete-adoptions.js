require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    console.log('🔄 Starting migration: Add soft delete to adoptions...\n');

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

        const migrationPath = path.join(__dirname, '..', 'database', 'migration_add_soft_delete_adoptions.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📝 Executing migration...\n');
        await connection.query(sql);

        console.log('✅ Migration completed successfully!');
        console.log('✨ Adoptions table now supports soft delete with deleted_at column.');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
        console.log('\n🔌 Database connection closed');
    }
}

runMigration();
