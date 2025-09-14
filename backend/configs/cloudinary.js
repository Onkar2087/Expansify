import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"
dotenv.config()

// --- FIX APPLIED HERE ---
// The configuration is now moved outside the function.
// This block will run only once when the application starts and this module is imported.
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            return null;
        }
        
        // The configuration call is removed from here.
        const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
        
        // It's safer to unlink the file only after a successful upload.
        fs.unlinkSync(filePath);
        return uploadResult.secure_url;

    } catch (error) {
        // If an error occurs (e.g., upload fails), we still need to remove the local file.
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Cloudinary upload error:", error);
        // It's good practice to throw the error or return null so the calling function knows it failed.
        return null;
    }
};

export default uploadOnCloudinary;
