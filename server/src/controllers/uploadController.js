// import multer from 'multer';
// import fs from 'fs';
// import path, { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const { user_id } = req.params; // Extract user ID from request body
//     if (!user_id) {
//       return cb(new Error('User ID is required'));
//     }

//     const uploadFolder = path.join(__dirname, '..', 'public', 'crecord', `cr_${user_id}`);
//     if (!fs.existsSync(uploadFolder)) {
//       fs.mkdirSync(uploadFolder, { recursive: true });
//     }
//     cb(null, uploadFolder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `${uniqueSuffix}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage });

// const handleFileUpload = (req, res) => {
//   // Handle file upload logic here
//   // You can access uploaded files using req.files
//   res.status(200).json({ status:'success',message: 'Files uploaded successfully' });
// };

// export { upload, handleFileUpload };
import multer from 'multer';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { user_id, folder, prefix } = req.params; // Extract user ID, folder, and prefix from request parameters
    if (!user_id || !folder || !prefix) {
      return cb(new Error('User ID, folder, and prefix are required'));
    }

    const uploadFolder = path.join(__dirname, '..', 'public', folder, `${prefix}${user_id}`);
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const handleFileUpload = (req, res) => {
  // Handle file upload logic here
  // You can access uploaded files using req.files
  res.status(200).json({ status:'success', message: 'Files uploaded successfully' });
};

export { upload, handleFileUpload };
