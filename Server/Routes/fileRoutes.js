const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const File = require('../Models/FileModals'); // Ensure this path is correct

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure this uploads directory exists
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for allowed types and size
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  
  // Check file type
  if (allowedTypes.includes(file.mimetype)) {
    // Check file size (5MB limit)
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize <= 5 * 1024 * 1024) {
      cb(null, true);
    } else {
      cb(new Error('File size exceeds 5MB limit'), false);
    }
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// File Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file is invalid' });
    }

    // Create new file document
    const newFile = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Save file metadata to database
    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: newFile._id,
        filename: newFile.filename,
        originalname: newFile.originalname
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Get All Files Route
router.get('/list', async (req, res) => {
  try {
    // Fetch all file metadata from database
    const files = await File.find().sort({ uploadedAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Fetch files error:', error);
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
});

// Download File Route
router.get('/download/:id', async (req, res) => {
  try {
    // Find file metadata in database
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Send file for download
    res.download(file.path, file.originalname, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file', error: error.message });
  }
});

// Delete File Route
router.delete('/delete/:id', async (req, res) => {
  try {
    // Find file in database
    const file = await File.findById(req.params.id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove file from filesystem
    fs.unlinkSync(file.path);

    // Remove file metadata from database
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

module.exports = router;