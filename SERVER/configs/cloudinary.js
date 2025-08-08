import {v2 as cloudinary} from 'cloudinary';

let isConfigured = false

const connectCloudinary = async () => {
    if (isConfigured) {
        console.log('Using existing Cloudinary configuration')
        return
    }

    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.warn('Cloudinary credentials not found, skipping configuration')
            return
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        })
        
        isConfigured = true
        console.log("Cloudinary connected successfully");
    } catch (error) {
        console.error('Cloudinary configuration error:', error)
        throw error
    }
}

export default connectCloudinary;