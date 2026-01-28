import fs from 'fs';
import path from 'path';

import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('uploads', req.uploadFolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
