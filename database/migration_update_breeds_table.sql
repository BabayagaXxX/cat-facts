-- Migration: Update breeds table for file upload
-- Date: 2025-12-07
-- Description: Replace image_url with proper file storage columns

-- Step 1: Add new columns for file storage
ALTER TABLE breeds
ADD COLUMN image_filename VARCHAR(255) NULL AFTER pattern,
ADD COLUMN image_path VARCHAR(500) NULL AFTER image_filename,
ADD COLUMN image_size INT NULL AFTER image_path,
ADD COLUMN image_mime_type VARCHAR(100) NULL AFTER image_size;

-- Step 2: Migrate existing data from image_url to new columns
-- This extracts the filename from the URL path
UPDATE breeds
SET 
    image_filename = SUBSTRING_INDEX(image_url, '/', -1),
    image_path = image_url,
    image_mime_type = 'image/jpeg'
WHERE image_url IS NOT NULL AND image_url != '';

-- Step 3: Drop the old image_url column
ALTER TABLE breeds
DROP COLUMN image_url;

-- Step 4: Add index for faster queries on image_filename
CREATE INDEX idx_image_filename ON breeds(image_filename);

-- Verify the changes
DESCRIBE breeds;
