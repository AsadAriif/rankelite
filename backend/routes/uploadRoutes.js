const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully.',
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
