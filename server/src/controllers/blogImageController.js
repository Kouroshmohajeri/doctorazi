import multer from 'multer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the directory exists
const uploadDir = path.join(__dirname, '../public/blogImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Saving file to directory: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage }).single('file');

export const uploadImage = (req, res) => {
  console.log('Received image upload request');
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: err.message });
    }
    if (req.file) {
      res.status(200).json({ link: `http://localhost:8800/blogImages/${req.file.filename}` });
    } else {
      console.error('No file received');
      res.status(400).json({ error: 'No file received' });
    }
  });
};

export const getImages = (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Error reading image directory:', err);
      return res.status(500).json({ error: 'Error reading image directory' });
    }
    const images = files.map(file => ({ url: `http://localhost:8800/blogImages/${file}`, thumb: `http://localhost:8800/blogImages/${file}` }));
    res.status(200).json(images);
  });
};

export const deleteImage = (req, res) => {
    const { src } = req.body;
    console.log(src)
    if (!src) {
      return res.status(400).json({ error: 'No image source provided' });
    }
  
    const fileName = path.basename(src);
    const filePath = path.join(uploadDir, fileName);
  
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return res.status(500).json({ error: 'Error deleting image' });
      }
      res.status(200).json({ message: 'Image deleted successfully' });
    });
  };
  
  