-- Migration: Create facts table
-- Date: 2025-12-07
-- Description: Create table to store cat facts

CREATE TABLE facts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fact TEXT NOT NULL,
    length INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify the table was created
DESCRIBE facts;
