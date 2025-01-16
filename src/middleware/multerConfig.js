const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Validate environment variables
if (!process.env.AWS_S3_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error('Missing required AWS S3 environment variables');
}

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const multerConfig = (folderName) => multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read', // Optional: Adjust ACL if needed
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Organize uploaded files by folder
      const fileName = `${folderName}/${uuidv4()}-${path.basename(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept valid file types
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, JPG, and PNG are allowed.`), false); // Reject invalid file types
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
  },
});

module.exports = multerConfig;
