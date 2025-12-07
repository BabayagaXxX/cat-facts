const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

async function runMigration() {
    let connection;
    
    try {
        console.log('🔄 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('✅ Connected to database');

        // Read the migration file
        const migrationPath = path.join(__dirname, '..', 'database', 'migration_update_breeds_table.sql');
        console.log(`📖 Reading migration file: ${migrationPath}`);
        
        const sql = await fs.readFile(migrationPath, 'utf8');
        
        // Remove comments and split by semicolons
        const statements = sql
            .split('\n')
            .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
            .join('\n')
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);

        console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement) {
                console.log(`⚙️  Executing statement ${i + 1}/${statements.length}...`);
                console.log(`   ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`);
                
                try {
                    await connection.query(statement);
                    console.log(`   ✅ Success\n`);
                } catch (error) {
                    console.error(`   ❌ Error: ${error.message}\n`);
                    throw error;
                }
            }
        }

        console.log('🎉 Migration completed successfully!');
        
        // Show the updated table structure
        console.log('\n📋 Updated table structure:');
        const [columns] = await connection.query('DESCRIBE breeds');
        console.table(columns);

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n👋 Database connection closed');
        }
    }
}

runMigration();
