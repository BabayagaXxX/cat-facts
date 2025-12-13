-- Migration: Add soft delete to adoptions table
-- Date: 2025-12-13
-- Description: Add deleted_at column for soft delete functionality

-- Add deleted_at column
ALTER TABLE adoptions 
ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;

-- Add index for better query performance
CREATE INDEX idx_deleted_at ON adoptions(deleted_at);

-- Verify the change
DESCRIBE adoptions;
