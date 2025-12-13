-- Migration: Create adoptions table
-- Date: 2025-12-11
-- Description: Create table for cat adoption listings

CREATE TABLE adoptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    breed_id INT,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Unknown') NOT NULL DEFAULT 'Unknown',
    temperament VARCHAR(255),
    description TEXT,
    adoption_status ENUM('available', 'pending', 'adopted') NOT NULL DEFAULT 'available',
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    location VARCHAR(255),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (breed_id) REFERENCES breeds(id) ON DELETE SET NULL,
    INDEX idx_adoption_status (adoption_status),
    INDEX idx_breed_id (breed_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify the table was created
DESCRIBE adoptions;
