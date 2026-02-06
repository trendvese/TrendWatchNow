/**
 * Image Service - Multiple Free Options
 * 
 * Option 1: Cloudinary (Recommended) - 25GB free
 * Option 2: ImgBB - Unlimited free
 * Option 3: Direct URL - Just paste URLs from Unsplash/Pexels
 */

// ============================================
// OPTION 1: CLOUDINARY (Recommended)
// ============================================
// 1. Go to https://cloudinary.com/ and sign up (free)
// 2. Get your Cloud Name from Dashboard
// 3. Create an unsigned upload preset:
//    Settings → Upload → Upload Presets → Add Upload Preset
//    → Signing Mode: Unsigned → Save
// 4. Update these values:

const CLOUDINARY_CLOUD_NAME = 'your-cloud-name'; // Replace with your cloud name
const CLOUDINARY_UPLOAD_PRESET = 'your-upload-preset'; // Replace with your preset

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'trendverse-blog');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// ============================================
// OPTION 2: IMGBB (Unlimited Free)
// ============================================
// 1. Go to https://api.imgbb.com/ and sign up
// 2. Get your API key
// 3. Update this value:

const IMGBB_API_KEY = 'your-imgbb-api-key'; // Replace with your API key

export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.data.url;
  } catch (error) {
    console.error('ImgBB upload error:', error);
    throw error;
  }
};

// ============================================
// OPTION 3: Convert to Base64 (No external service)
// ============================================
// Stores image as base64 in Firestore
// Note: Limited to ~1MB images, uses Firestore quota

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ============================================
// MAIN UPLOAD FUNCTION
// ============================================
// Change this to use your preferred service

export type ImageUploadService = 'cloudinary' | 'imgbb' | 'base64' | 'url';

export const uploadImage = async (
  file: File,
  service: ImageUploadService = 'cloudinary'
): Promise<string> => {
  switch (service) {
    case 'cloudinary':
      return uploadToCloudinary(file);
    case 'imgbb':
      return uploadToImgBB(file);
    case 'base64':
      return convertToBase64(file);
    default:
      throw new Error('Invalid upload service');
  }
};

// ============================================
// FREE IMAGE SOURCES (No upload needed!)
// ============================================
// Just copy URLs from these free image sites:
//
// 🖼️ Unsplash: https://unsplash.com/
// 🖼️ Pexels: https://www.pexels.com/
// 🖼️ Pixabay: https://pixabay.com/
// 🖼️ Freepik: https://www.freepik.com/
//
// Example Unsplash URL:
// https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200
