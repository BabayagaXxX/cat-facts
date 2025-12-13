-- Migration: Update adoptions table - Remove pending status
-- Date: 2025-12-13
-- Description: Remove 'pending' status and keep only 'available' and 'adopted'

-- Step 1: Update any existing 'pending' records to 'available'
UPDATE adoptions 
SET adoption_status = 'available' 
WHERE adoption_status = 'pending';

-- Step 2: Modify the column to only allow 'available' and 'adopted'
ALTER TABLE adoptions 
MODIFY COLUMN adoption_status ENUM('available', 'adopted') NOT NULL DEFAULT 'available';

-- Verify the change
DESCRIBE adoptions;

-- Show current status distribution
SELECT adoption_status, COUNT(*) as count 
FROM adoptions 
GROUP BY adoption_status;
