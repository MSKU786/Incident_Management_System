const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Get absolute path to uploads directory
// __dirname = current file's directory (Backend/src/middleware/)
// '../../uploads' goes up 2 levels to Backend/uploads/
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {recursive: true});
}

// Configure storage engine and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp + random number + original extension
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({storage});

// Save references to original multer methods BEFORE we override them
// This prevents infinite recursion when we wrap them
const originalSingle = upload.single.bind(upload);
const originalArray = upload.array.bind(upload);
const originalAny = upload.any.bind(upload);

// Wrapper function to handle multer errors gracefully
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            message: 'Unexpected field name. Please use field name: "image"',
            error:
              'The frontend is sending a file with a different field name than expected.',
          });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'File too large',
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            message: 'Too many files. Maximum is 10 files.',
          });
        }
        return res.status(400).json({
          message: 'File upload error: ' + err.message,
        });
      }
      next();
    });
  };
};

// Export multer instance with error handling wrappers
// Use the original methods (originalSingle, originalArray, originalAny)
// instead of upload.single/array/any to avoid recursion
module.exports = upload;
module.exports.single = (fieldName) => handleUpload(originalSingle(fieldName));
module.exports.array = (fieldName, maxCount) =>
  handleUpload(originalArray(fieldName, maxCount));
module.exports.any = () => handleUpload(originalAny());
