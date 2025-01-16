const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Helper function to upload an image to S3.
 * Differentiates between 'menu-images' and 'restaurant-images'.
 * 
 * @param {object} file - The file object from multer.
 * @param {string} type - The type of image ('menu' or 'restaurant').
 * @returns {string} The URL of the uploaded image.
 */
const uploadImageToS3 = async (file, type) => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const folder = type === 'restaurant' ? 'restaurant-images' : 'menu-images';
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${uuidv4()}${path.extname(file.originalname)}`, // Use specific folder
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('S3 upload failed');
  }
};

module.exports = { uploadImageToS3 };
