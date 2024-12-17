import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController';
const upload = require('../services/fileService');

const router = Router();

router.post('/upload', (req, res, next) => {
  console.log('收到上传请求');
  
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      console.error('Multer 错误:', err);
      return res.status(400).json({ 
        error: err.message || '文件上传失败'
      });
    }
    
    console.log('Multer 处理完成，文件已保存');
    next();
  });
}, uploadFile);

router.get('/test', (req, res) => {
  res.json({ message: 'Upload route is working' });
});

export default router;
