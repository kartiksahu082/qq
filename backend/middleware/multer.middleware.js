import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Example: store files in ./uploads folder
    // Make sure this folder exists
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    // Generate a unique suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // The file.fieldname is typically the field name, e.g. "avatar"
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export default upload;
