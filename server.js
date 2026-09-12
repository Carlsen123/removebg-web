require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.REMOVEBG_API_KEY;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 22 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Format yang didukung: JPG, PNG, WebP.'));
    }
    cb(null, true);
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: 'REMOVEBG_API_KEY belum diatur. Isi file .env terlebih dahulu.'
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada gambar yang diupload.' });
    }

    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    form.append('image_file', blob, req.file.originalname);
    form.append('size', 'auto');
    form.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY },
      body: form
    });

    if (!response.ok) {
      const text = await response.text();
      let message = 'API remove.bg gagal memproses gambar.';
      try {
        const data = JSON.parse(text);
        message = data.errors?.[0]?.title || data.error || message;
      } catch {}
      return res.status(response.status).json({ error: message });
    }

    const resultBuffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="background-removed.png"');
    res.send(resultBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Terjadi kesalahan server.' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Ukuran gambar maksimal 22 MB.' });
  }
  res.status(400).json({ error: err.message || 'Upload gagal.' });
});

app.listen(PORT, () => {
  console.log(`RemoveBG AI berjalan di http://localhost:${PORT}`);
});
