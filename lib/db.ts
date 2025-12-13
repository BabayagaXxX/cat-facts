import mysql from 'mysql2/promise';

/**
 * MySQL Database Connection Pool
 * 
 * This creates a pool of database connections that can be reused.
 * Using a pool is more efficient than creating a new connection for each query.
 * 
 * Configuration comes from environment variables (.env file):
 * - DB_HOST: Database server address
 * - DB_PORT: Database port (default: 3306)
 * - DB_USER: Database username
 * - DB_PASSWORD: Database password
 * - DB_NAME: Database name
 */
export const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,    // Wait for a connection if all are busy
    connectionLimit: 10,          // Maximum number of connections in pool
    queueLimit: 0                 // No limit on queued connection requests
});

/**
 * Tests if the database connection is working
 * @returns true if connection successful, false otherwise
 */
export async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

/**
 * Handle database errors
 * Logs helpful error messages when connection issues occur
 */
db.on('error', (err) => {
    console.error('Database pool error:', err);
    
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});
