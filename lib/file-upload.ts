import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * File Upload Utilities
 * 
 * Helper functions for handling file uploads in the application.
 * These functions handle saving uploaded files to the public directory.
 */

/**
 * Saves an uploaded file to the public/uploads directory
 * 
 * @param file - The uploaded File object
 * @param subfolder - Optional subfolder within uploads (e.g., 'adoptions', 'breeds')
 * @returns The public URL path to access the uploaded file (e.g., '/uploads/image.jpg')
 * 
 * @example
 * const imageUrl = await saveUploadedFile(file, 'breeds');
 * // Returns: '/uploads/breeds/1234567890-cat.jpg'
 */
export async function saveUploadedFile(file: File, subfolder: string = ''): Promise<string> {
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create upload directory if it doesn't exist
    const uploadDir = subfolder 
        ? join(process.cwd(), 'public', 'uploads', subfolder)
        : join(process.cwd(), 'public', 'uploads');
    
    await mkdir(uploadDir, { recursive: true });

    // Create unique filename using timestamp to avoid conflicts
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/\s/g, '_'); // Replace spaces with underscores
    const filename = `${timestamp}-${sanitizedName}`;
    
    // Save file to disk
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL path
    const urlPath = subfolder 
        ? `/uploads/${subfolder}/${filename}`
        : `/uploads/${filename}`;
    
    return urlPath;
}

/**
 * Validates if a file is an image
 * 
 * @param file - The file to validate
 * @returns true if file is a valid image type
 */
export function isValidImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
}

/**
 * Validates file size
 * 
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in megabytes (default: 5MB)
 * @returns true if file size is within limit
 */
export function isValidFileSize(file: File, maxSizeMB: number = 5): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxBytes;
}
