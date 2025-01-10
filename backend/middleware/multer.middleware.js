import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/backend/myupload/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);  // Defined uniqueSuffix
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
})

const upload = multer({ storage: storage })

export default upload;
