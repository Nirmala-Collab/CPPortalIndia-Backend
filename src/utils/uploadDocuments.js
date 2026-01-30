import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  // Block dangerous executable types
  const blockedTypes = [
    'application/x-msdownload', // .exe
    'application/x-sh', // .sh
    'application/x-bat', // .bat
  ];

  if (blockedTypes.includes(file.mimetype)) {
    cb(new Error('Executable files are not allowed'), false);
  } else {
    cb(null, true);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
